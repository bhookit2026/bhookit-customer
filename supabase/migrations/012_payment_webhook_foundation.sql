-- supabase/migrations/012_payment_webhook_foundation.sql
-- Real Razorpay Webhook Security & Event Deduplication Foundation
-- 1. Table: public.payment_webhook_events with persistent unique idempotency
-- 2. RLS: Strict service_role only privileges (zero browser mutation)
-- 3. RPC: public.claim_webhook_event (atomic dedup & concurrency claim)
-- 4. RPC: public.finalize_webhook_event (authoritative state transition)
-- 5. RPC: public.reconcile_captured_cancelled_payment (safe cancel vs capture reconciliation)

-- ============================================================
-- 1. TABLE: public.payment_webhook_events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'razorpay',
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  parcelkar_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  processing_status TEXT NOT NULL DEFAULT 'received',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  error_code TEXT,
  safe_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT payment_webhook_events_status_check
    CHECK (processing_status IN ('received', 'processing', 'processed', 'failed', 'ignored', 'reconciliation_required')),
  CONSTRAINT payment_webhook_events_provider_event_uniq
    UNIQUE (provider, event_id)
);

-- Indexes for performance & lookups
CREATE INDEX IF NOT EXISTS payment_webhook_events_gateway_order_idx
  ON public.payment_webhook_events(gateway_order_id);

CREATE INDEX IF NOT EXISTS payment_webhook_events_gateway_payment_idx
  ON public.payment_webhook_events(gateway_payment_id);

CREATE INDEX IF NOT EXISTS payment_webhook_events_order_id_idx
  ON public.payment_webhook_events(parcelkar_order_id);

CREATE INDEX IF NOT EXISTS payment_webhook_events_status_idx
  ON public.payment_webhook_events(processing_status);

-- Automatic updated_at trigger (reuses shared public.handle_updated_at())
DROP TRIGGER IF EXISTS set_payment_webhook_events_updated_at ON public.payment_webhook_events;
CREATE TRIGGER set_payment_webhook_events_updated_at
  BEFORE UPDATE ON public.payment_webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 2. SECURITY & RLS POLICIES
-- ============================================================
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

-- Block all anonymous, public, and authenticated client access
REVOKE ALL ON public.payment_webhook_events FROM PUBLIC;
REVOKE ALL ON public.payment_webhook_events FROM anon;
REVOKE ALL ON public.payment_webhook_events FROM authenticated;

-- Grant access strictly to service_role (backend server only)
GRANT ALL ON public.payment_webhook_events TO service_role;

DROP POLICY IF EXISTS "service_role_all_payment_webhook_events" ON public.payment_webhook_events;
CREATE POLICY "service_role_all_payment_webhook_events"
  ON public.payment_webhook_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 3. RPC: public.claim_webhook_event
-- Atomic idempotency claim for incoming webhook delivery
-- ============================================================
CREATE OR REPLACE FUNCTION public.claim_webhook_event(
  p_provider TEXT,
  p_event_id TEXT,
  p_event_type TEXT,
  p_gateway_order_id TEXT DEFAULT NULL,
  p_gateway_payment_id TEXT DEFAULT NULL,
  p_safe_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event public.payment_webhook_events%ROWTYPE;
BEGIN
  IF p_event_id IS NULL OR TRIM(p_event_id) = '' THEN
    RAISE EXCEPTION 'Event ID is required' USING ERRCODE = '22023';
  END IF;

  -- 1. Attempt atomic insert
  INSERT INTO public.payment_webhook_events (
    provider,
    event_id,
    event_type,
    gateway_order_id,
    gateway_payment_id,
    processing_status,
    safe_payload
  ) VALUES (
    COALESCE(NULLIF(TRIM(p_provider), ''), 'razorpay'),
    TRIM(p_event_id),
    TRIM(p_event_type),
    NULLIF(TRIM(p_gateway_order_id), ''),
    NULLIF(TRIM(p_gateway_payment_id), ''),
    'processing',
    COALESCE(p_safe_payload, '{}'::jsonb)
  )
  ON CONFLICT (provider, event_id) DO NOTHING
  RETURNING * INTO v_event;

  -- If successfully inserted, this invocation owns processing
  IF FOUND THEN
    RETURN jsonb_build_object(
      'status', 'claimed',
      'id', v_event.id,
      'event_id', v_event.event_id,
      'event_type', v_event.event_type
    );
  END IF;

  -- 2. Row already exists: lock existing row FOR UPDATE to inspect authoritative state
  SELECT * INTO v_event
  FROM public.payment_webhook_events
  WHERE provider = COALESCE(NULLIF(TRIM(p_provider), ''), 'razorpay')
    AND event_id = TRIM(p_event_id)
  FOR UPDATE;

  -- If already finished processing or ignored, return already_processed
  IF v_event.processing_status IN ('processed', 'ignored') THEN
    RETURN jsonb_build_object(
      'status', 'already_processed',
      'id', v_event.id,
      'event_id', v_event.event_id,
      'processing_status', v_event.processing_status
    );
  END IF;

  -- If already recorded as reconciliation_required, do not re-execute
  IF v_event.processing_status = 'reconciliation_required' THEN
    RETURN jsonb_build_object(
      'status', 'already_processed',
      'id', v_event.id,
      'event_id', v_event.event_id,
      'processing_status', 'reconciliation_required'
    );
  END IF;

  -- If currently processing: check age. If older than 5 minutes, consider it stale and reclaim
  IF v_event.processing_status = 'processing' THEN
    IF v_event.updated_at < (now() - INTERVAL '5 minutes') THEN
      UPDATE public.payment_webhook_events
      SET processing_status = 'processing',
          updated_at = now()
      WHERE id = v_event.id;

      RETURN jsonb_build_object(
        'status', 'claimed',
        'id', v_event.id,
        'event_id', v_event.event_id,
        'reclaimed', true
      );
    ELSE
      RETURN jsonb_build_object(
        'status', 'processing_in_flight',
        'id', v_event.id,
        'event_id', v_event.event_id
      );
    END IF;
  END IF;

  -- If previously failed, allow retry
  IF v_event.processing_status = 'failed' THEN
    UPDATE public.payment_webhook_events
    SET processing_status = 'processing',
        updated_at = now()
    WHERE id = v_event.id;

    RETURN jsonb_build_object(
      'status', 'claimed',
      'id', v_event.id,
      'event_id', v_event.event_id,
      'retry', true
    );
  END IF;

  RETURN jsonb_build_object(
    'status', 'unknown_existing',
    'id', v_event.id,
    'event_id', v_event.event_id,
    'processing_status', v_event.processing_status
  );
END;
$$;

-- ============================================================
-- 4. RPC: public.finalize_webhook_event
-- Update persistent webhook event processing status
-- ============================================================
CREATE OR REPLACE FUNCTION public.finalize_webhook_event(
  p_event_id TEXT,
  p_processing_status TEXT,
  p_parcelkar_order_id UUID DEFAULT NULL,
  p_gateway_payment_id TEXT DEFAULT NULL,
  p_error_code TEXT DEFAULT NULL,
  p_safe_payload JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_count INTEGER;
BEGIN
  UPDATE public.payment_webhook_events
  SET
    processing_status = p_processing_status,
    parcelkar_order_id = COALESCE(p_parcelkar_order_id, parcelkar_order_id),
    gateway_payment_id = COALESCE(NULLIF(TRIM(p_gateway_payment_id), ''), gateway_payment_id),
    error_code = p_error_code,
    safe_payload = CASE WHEN p_safe_payload IS NOT NULL THEN p_safe_payload ELSE safe_payload END,
    processed_at = CASE WHEN p_processing_status IN ('processed', 'ignored', 'reconciliation_required') THEN now() ELSE processed_at END,
    updated_at = now()
  WHERE event_id = TRIM(p_event_id);

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', v_updated_count > 0,
    'event_id', p_event_id,
    'processing_status', p_processing_status
  );
END;
$$;

-- ============================================================
-- 5. RPC: public.reconcile_captured_cancelled_payment
-- Handles cancel vs capture race condition:
-- Order is Cancelled, but Razorpay reports captured payment.
-- Preserves Cancelled status, flags Refund_Pending, updates transaction.
-- ============================================================
CREATE OR REPLACE FUNCTION public.reconcile_captured_cancelled_payment(
  p_order_id UUID,
  p_gateway_order_id TEXT,
  p_gateway_payment_id TEXT,
  p_provider_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_tx public.payment_transactions%ROWTYPE;
  v_gateway_payment_id TEXT;
  v_gateway_order_id TEXT;
BEGIN
  v_gateway_order_id := TRIM(p_gateway_order_id);
  v_gateway_payment_id := TRIM(p_gateway_payment_id);

  -- 1. Lock Order FOR UPDATE
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found' USING ERRCODE = 'P0002';
  END IF;

  -- Must be Cancelled
  IF v_order.status <> 'Cancelled' THEN
    RAISE EXCEPTION 'reconcile_captured_cancelled_payment only applies to Cancelled orders (current: %)', v_order.status
      USING ERRCODE = '22023';
  END IF;

  -- 2. Lock Payment Transaction FOR UPDATE
  SELECT * INTO v_tx
  FROM public.payment_transactions
  WHERE order_id = p_order_id
    AND gateway_order_id = v_gateway_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment transaction not found for order % and gateway order %',
      v_order.order_code, v_gateway_order_id
      USING ERRCODE = 'P0002';
  END IF;

  -- 3. Update Payment Transaction to captured with audit payload
  UPDATE public.payment_transactions
  SET
    gateway_payment_id = v_gateway_payment_id,
    signature_verified = true,
    status = 'captured',
    captured_at = now(),
    provider_payload = COALESCE(p_provider_payload, provider_payload),
    updated_at = now()
  WHERE id = v_tx.id;

  -- 4. Update Order: Preserve 'Cancelled' status, set payment_status to 'Refund_Pending'
  UPDATE public.orders
  SET
    payment_status = 'Refund_Pending',
    transaction_id = v_gateway_payment_id,
    updated_at = now()
  WHERE id = v_order.id;

  RETURN jsonb_build_object(
    'status', 'reconciliation_required',
    'order_id', v_order.id,
    'order_code', v_order.order_code,
    'order_status', 'Cancelled',
    'payment_status', 'Refund_Pending',
    'transaction_id', v_gateway_payment_id,
    'amount_captured', v_tx.amount,
    'refund_required', true
  );
END;
$$;

-- Revoke execute from public/anon/authenticated; grant strictly to service_role
REVOKE ALL ON FUNCTION public.claim_webhook_event(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_webhook_event(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.claim_webhook_event(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.claim_webhook_event(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO service_role;

REVOKE ALL ON FUNCTION public.finalize_webhook_event(TEXT, TEXT, UUID, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.finalize_webhook_event(TEXT, TEXT, UUID, TEXT, TEXT, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.finalize_webhook_event(TEXT, TEXT, UUID, TEXT, TEXT, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_webhook_event(TEXT, TEXT, UUID, TEXT, TEXT, JSONB) TO service_role;

REVOKE ALL ON FUNCTION public.reconcile_captured_cancelled_payment(UUID, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reconcile_captured_cancelled_payment(UUID, TEXT, TEXT, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.reconcile_captured_cancelled_payment(UUID, TEXT, TEXT, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.reconcile_captured_cancelled_payment(UUID, TEXT, TEXT, JSONB) TO service_role;
