-- supabase/migrations/008_cancel_customer_order_v2.sql
-- Secure Atomic Customer Order Cancellation with Wallet Refund RPC (v2)
-- Architecture:
-- 1. Atomic Order Cancellation & Wallet Refund:
--    Order verification, status transition to 'Cancelled', wallet balance credit,
--    and immutable refund ledger insertion happen within a single ACID transaction.
-- 2. Authoritative Server-Derived Refund Amount:
--    Never accepts refund amounts from client. Verifies authoritative checkout debit
--    ledger entry matching order_id and user_id. Refunds exact wallet_redeemed.
-- 3. Strict Idempotency:
--    Deterministic idempotency key 'cancel-refund:<user_id>:<order_code>'.
--    Retries on already-cancelled orders verify the existing refund ledger and return
--    'already_processed' without duplicate credit.
-- 4. Active-Order Inconsistency Defense:
--    Rejects cancellation if a cancellation refund ledger entry exists for an active order.
-- 5. No Payment Status Mutation:
--    Never mutates payment_status, total, or wallet_redeemed. Computes
--    external_refund_required flag for UPI/CARD orders paid externally.
-- 6. Row Locking Order:
--    Locks public.orders first; locks public.customer_wallets only when refund > 0.

-- ============================================================
-- RPC: public.cancel_customer_order_v2(p_order_id UUID)
-- ============================================================
CREATE OR REPLACE FUNCTION public.cancel_customer_order_v2(
  p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_order public.orders%ROWTYPE;

  v_checkout_debit_count INTEGER;
  v_checkout_debit public.wallet_transactions%ROWTYPE;

  v_refund_tx public.wallet_transactions%ROWTYPE;

  v_refund_key TEXT;
  v_refund_amount NUMERIC(12,2);

  v_current_balance NUMERIC(12,2);
  v_new_balance NUMERIC(12,2);

  v_external_refund_required BOOLEAN;
BEGIN
  -- ============================================================
  -- 1. AUTHENTICATION & INPUT VALIDATION
  -- ============================================================
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = '42501';
  END IF;

  IF p_order_id IS NULL THEN
    RAISE EXCEPTION 'Order ID is required'
      USING ERRCODE = '22023';
  END IF;

  -- ============================================================
  -- 2. LOCK ORDER & VALIDATE OWNERSHIP
  -- ============================================================
  SELECT *
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found'
      USING ERRCODE = 'P0002';
  END IF;

  -- Verify customer ownership independently without leaking order existence
  IF v_order.user_id <> v_user_id OR v_order.user_id IS NULL THEN
    RAISE EXCEPTION 'Order not found'
      USING ERRCODE = 'P0002';
  END IF;

  -- ============================================================
  -- 3. DETERMINISTIC REFUND IDEMPOTENCY KEY
  -- ============================================================
  v_refund_key :=
    'cancel-refund:' ||
    v_user_id::TEXT ||
    ':' ||
    v_order.order_code;

  -- ============================================================
  -- 4. AUTHORITATIVE CHECKOUT DEBIT VERIFICATION
  -- ============================================================
  IF COALESCE(v_order.wallet_redeemed, 0) > 0 THEN
    SELECT COUNT(*)
    INTO v_checkout_debit_count
    FROM public.wallet_transactions
    WHERE user_id = v_user_id
      AND order_id = v_order.id
      AND type = 'debit'
      AND transaction_type = 'checkout_debit';

    IF v_checkout_debit_count <> 1 THEN
      RAISE EXCEPTION 'Inconsistent checkout debit record'
        USING ERRCODE = '22023';
    END IF;

    SELECT *
    INTO v_checkout_debit
    FROM public.wallet_transactions
    WHERE user_id = v_user_id
      AND order_id = v_order.id
      AND type = 'debit'
      AND transaction_type = 'checkout_debit'
    LIMIT 1;

    IF v_checkout_debit.amount <> v_order.wallet_redeemed THEN
      RAISE EXCEPTION 'Inconsistent checkout debit record'
        USING ERRCODE = '22023';
    END IF;

    v_refund_amount := v_checkout_debit.amount;
  ELSE
    v_refund_amount := 0.00;
  END IF;

  -- ============================================================
  -- 5. EXTERNAL PAYMENT REFUND REQUIREMENT FLAG
  -- ============================================================
  v_external_refund_required :=
    v_order.payment_method IN ('UPI', 'CARD')
    AND v_order.payment_status = 'Paid'
    AND COALESCE(v_order.total, 0) > 0;

  -- ============================================================
  -- 6. IDEMPOTENT HANDLING FOR ALREADY CANCELLED ORDERS
  -- ============================================================
  IF v_order.status = 'Cancelled' THEN
    IF v_refund_amount = 0 THEN
      -- Read current wallet balance without FOR UPDATE lock
      SELECT balance
      INTO v_current_balance
      FROM public.customer_wallets
      WHERE user_id = v_user_id;

      RETURN jsonb_build_object(
        'status', 'already_processed',
        'order_id', v_order.id,
        'order_code', v_order.order_code,
        'order_status', 'Cancelled',
        'payment_status', v_order.payment_status,
        'wallet_refunded', 0.00,
        'wallet_balance_after', v_current_balance,
        'external_refund_required', v_external_refund_required
      );
    ELSE
      -- Find refund ledger entry by idempotency_key
      SELECT *
      INTO v_refund_tx
      FROM public.wallet_transactions
      WHERE idempotency_key = v_refund_key;

      IF NOT FOUND
         OR v_refund_tx.user_id <> v_user_id
         OR v_refund_tx.order_id <> v_order.id
         OR v_refund_tx.type <> 'credit'
         OR v_refund_tx.transaction_type <> 'cancellation_refund'
         OR v_refund_tx.amount <> v_refund_amount THEN
        RAISE EXCEPTION 'Database inconsistency: order cancelled but refund ledger missing'
          USING ERRCODE = '22023';
      END IF;

      RETURN jsonb_build_object(
        'status', 'already_processed',
        'order_id', v_order.id,
        'order_code', v_order.order_code,
        'order_status', 'Cancelled',
        'payment_status', v_order.payment_status,
        'wallet_refunded', v_refund_tx.amount,
        'wallet_balance_after', v_refund_tx.balance_after,
        'external_refund_required', v_external_refund_required
      );
    END IF;
  END IF;

  -- ============================================================
  -- 7. FIRST-TIME CANCELLABLE STATUS CHECK
  -- ============================================================
  IF v_order.status NOT IN ('New', 'Accepted') THEN
    RAISE EXCEPTION 'Order cannot be cancelled. Current status is %', v_order.status
      USING ERRCODE = '22023';
  END IF;

  -- ============================================================
  -- 8. ACTIVE ORDER INCONSISTENCY PROTECTION
  -- ============================================================
  IF EXISTS (
    SELECT 1
    FROM public.wallet_transactions
    WHERE idempotency_key = v_refund_key
  ) THEN
    RAISE EXCEPTION 'Database inconsistency: cancellation refund exists for an active order'
      USING ERRCODE = '22023';
  END IF;

  -- ============================================================
  -- 9. ZERO-WALLET CANCELLATION PATH
  -- ============================================================
  IF v_refund_amount = 0 THEN
    -- Update order status to Cancelled without touching customer_wallets or ledger
    UPDATE public.orders
    SET
      status = 'Cancelled',
      updated_at = now()
    WHERE id = v_order.id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Failed to update order status'
        USING ERRCODE = '22023';
    END IF;

    -- Read current wallet balance without lock
    SELECT balance
    INTO v_current_balance
    FROM public.customer_wallets
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
      'status', 'success',
      'order_id', v_order.id,
      'order_code', v_order.order_code,
      'order_status', 'Cancelled',
      'payment_status', v_order.payment_status,
      'wallet_refunded', 0.00,
      'wallet_balance_after', v_current_balance,
      'external_refund_required', v_external_refund_required
    );
  END IF;

  -- ============================================================
  -- 10. WALLET REFUND PATH (v_refund_amount > 0)
  -- ============================================================
  -- Lock customer wallet
  SELECT balance
  INTO v_current_balance
  FROM public.customer_wallets
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Customer wallet not found'
      USING ERRCODE = '22023';
  END IF;

  v_new_balance := v_current_balance + v_refund_amount;

  -- 11. Insert refund transaction into wallet ledger
  INSERT INTO public.wallet_transactions (
    user_id,
    order_id,
    type,
    amount,
    balance_after,
    transaction_type,
    description,
    idempotency_key
  )
  VALUES (
    v_user_id,
    v_order.id,
    'credit',
    v_refund_amount,
    v_new_balance,
    'cancellation_refund',
    'Cancellation refund for order ' || v_order.order_code,
    v_refund_key
  )
  RETURNING *
  INTO v_refund_tx;

  -- 12. Update customer wallet balance
  UPDATE public.customer_wallets
  SET
    balance = v_new_balance,
    updated_at = now()
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update customer wallet balance'
      USING ERRCODE = '22023';
  END IF;

  -- 13. Cancel order
  UPDATE public.orders
  SET
    status = 'Cancelled',
    updated_at = now()
  WHERE id = v_order.id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update order status'
      USING ERRCODE = '22023';
  END IF;

  -- 14. Return success result
  RETURN jsonb_build_object(
    'status', 'success',
    'order_id', v_order.id,
    'order_code', v_order.order_code,
    'order_status', 'Cancelled',
    'payment_status', v_order.payment_status,
    'wallet_refunded', v_refund_amount,
    'wallet_balance_after', v_new_balance,
    'external_refund_required', v_external_refund_required
  );
END;
$$;

-- ============================================================
-- PRIVILEGES & PERMISSIONS (AUTHENTICATED CUSTOMER ONLY)
-- ============================================================
REVOKE ALL ON FUNCTION public.cancel_customer_order_v2(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cancel_customer_order_v2(UUID) FROM anon;

GRANT EXECUTE ON FUNCTION public.cancel_customer_order_v2(UUID) TO authenticated;

COMMENT ON FUNCTION public.cancel_customer_order_v2(UUID) IS
  'Secure atomic customer cancellation with wallet refund RPC (v2). Locks order, verifies authoritative checkout debit, refunds wallet balance with idempotent ledger recording, marks order as Cancelled, and flags external payment refund requirement without mutating payment status.';
