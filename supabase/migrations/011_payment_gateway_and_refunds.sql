-- supabase/migrations/011_payment_gateway_and_refunds.sql
-- Real Razorpay Gateway Foundation & Refund Architecture
-- 1. Updates payment_status constraint to include 'Refund_Pending'
-- 2. Creates public.payment_transactions and public.payment_refunds tables
-- 3. Enables RLS with customer read-only and service_role mutation privileges
-- 4. Creates public.create_customer_order_v3 (forcing Payment_Pending for online payments)
-- 5. Creates public.cancel_pending_customer_payment (customer abandonment & wallet reversal)
-- 6. Creates public.register_gateway_payment_order (service_role registration)
-- 7. Creates public.finalize_customer_payment (service_role capture & finalization)

-- ============================================================
-- 1. PAYMENT STATUS CONSTRAINT UPDATE
-- ============================================================
ALTER TABLE public.orders 
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;

ALTER TABLE public.orders 
  ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded', 'Refund_Pending'));

-- Note: orders.status check constraint is intentionally omitted to preserve
-- 100% backward compatibility with diverse application and historical status strings.

-- ============================================================
-- 2. TABLE: public.payment_transactions
-- ============================================================
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  gateway_order_id TEXT NOT NULL,
  gateway_payment_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created',
  signature_verified BOOLEAN NOT NULL DEFAULT false,
  idempotency_key TEXT,
  captured_at TIMESTAMPTZ,
  provider_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT payment_transactions_status_check
    CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  CONSTRAINT payment_transactions_amount_check
    CHECK (amount > 0)
);

-- Payment Transactions Indexes & Invariants
CREATE UNIQUE INDEX payment_transactions_gateway_order_id_idx
  ON public.payment_transactions(gateway_order_id);

CREATE UNIQUE INDEX payment_transactions_gateway_payment_id_idx
  ON public.payment_transactions(gateway_payment_id)
  WHERE gateway_payment_id IS NOT NULL;

CREATE UNIQUE INDEX payment_transactions_idempotency_key_idx
  ON public.payment_transactions(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Invariant: At most ONE captured payment transaction per order
CREATE UNIQUE INDEX payment_transactions_one_captured_per_order_idx
  ON public.payment_transactions(order_id)
  WHERE status = 'captured';

CREATE INDEX payment_transactions_order_id_idx
  ON public.payment_transactions(order_id);

CREATE INDEX payment_transactions_user_id_idx
  ON public.payment_transactions(user_id);

-- ============================================================
-- 3. TABLE: public.payment_refunds
-- ============================================================
CREATE TABLE public.payment_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_transaction_id UUID NOT NULL REFERENCES public.payment_transactions(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gateway_refund_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'initiated',
  reason TEXT NOT NULL DEFAULT 'customer_cancellation',
  idempotency_key TEXT NOT NULL,
  error_message TEXT,
  provider_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT payment_refunds_status_check
    CHECK (status IN ('initiated', 'processed', 'failed')),
  CONSTRAINT payment_refunds_amount_check
    CHECK (amount > 0)
);

-- Payment Refunds Indexes
CREATE UNIQUE INDEX payment_refunds_idempotency_key_idx
  ON public.payment_refunds(idempotency_key);

CREATE UNIQUE INDEX payment_refunds_gateway_refund_id_idx
  ON public.payment_refunds(gateway_refund_id)
  WHERE gateway_refund_id IS NOT NULL;

CREATE INDEX payment_refunds_order_id_idx
  ON public.payment_refunds(order_id);

CREATE INDEX payment_refunds_tx_id_idx
  ON public.payment_refunds(payment_transaction_id);

CREATE INDEX payment_refunds_user_id_idx
  ON public.payment_refunds(user_id);

-- ============================================================
-- 4. UPDATED_AT TRIGGERS (Reuses shared public.handle_updated_at())
-- ============================================================
CREATE TRIGGER set_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_payment_refunds_updated_at
  BEFORE UPDATE ON public.payment_refunds
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 5. RLS & TABLE PRIVILEGES
-- ============================================================
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_transactions_select_own"
  ON public.payment_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "payment_refunds_select_own"
  ON public.payment_refunds FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

REVOKE ALL ON TABLE public.payment_transactions FROM PUBLIC;
REVOKE ALL ON TABLE public.payment_transactions FROM anon;
REVOKE ALL ON TABLE public.payment_transactions FROM authenticated;

REVOKE ALL ON TABLE public.payment_refunds FROM PUBLIC;
REVOKE ALL ON TABLE public.payment_refunds FROM anon;
REVOKE ALL ON TABLE public.payment_refunds FROM authenticated;

GRANT SELECT ON TABLE public.payment_transactions TO authenticated;
GRANT SELECT ON TABLE public.payment_refunds TO authenticated;

GRANT ALL ON TABLE public.payment_transactions TO service_role;
GRANT ALL ON TABLE public.payment_refunds TO service_role;

-- ============================================================
-- 6. RPC: public.create_customer_order_v3
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_customer_order_v3(
  p_order JSONB,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_order_code TEXT;
  v_payment_method TEXT;
  v_payment_status TEXT;
  v_order_status TEXT;
  v_subtotal NUMERIC(12,2);
  v_delivery_fee NUMERIC(12,2);
  v_delivery_fee_included NUMERIC(12,2);
  v_surge_fee NUMERIC(12,2);
  v_rider_tip NUMERIC(12,2);
  v_taxes NUMERIC(12,2);
  v_discount NUMERIC(12,2);
  v_wallet_redeemed NUMERIC(12,2);
  v_total NUMERIC(12,2);
  v_gross_before_wallet NUMERIC(12,2);

  v_current_balance NUMERIC(12,2);
  v_new_balance NUMERIC(12,2);
  v_order_id UUID := gen_random_uuid();
  v_delivery_address_id UUID;
  v_delivery_address_snapshot JSONB;
  v_service_mode TEXT;
  v_schedule_mode TEXT;

  v_existing_order public.orders%ROWTYPE;
  v_existing_tx public.wallet_transactions%ROWTYPE;
  v_tx_id UUID;
  v_item JSONB;
  v_checkout_key TEXT;
BEGIN
  -- 1. Authenticate caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to create customer order' USING ERRCODE = '42501';
  END IF;

  -- 2. Validate Order Code & Payment Method
  v_order_code := TRIM(COALESCE(p_order->>'order_code', p_order->>'id', ''));
  IF v_order_code = '' THEN
    RAISE EXCEPTION 'Order code is required' USING ERRCODE = '22023';
  END IF;

  v_payment_method := TRIM(COALESCE(p_order->>'payment_method', p_order->>'payment', ''));
  IF v_payment_method = '' THEN
    RAISE EXCEPTION 'Payment method is required' USING ERRCODE = '22023';
  END IF;

  -- 3. Parse & Validate Monetary Values
  BEGIN
    v_subtotal              := (p_order->>'subtotal')::NUMERIC(12,2);
    v_delivery_fee          := COALESCE((p_order->>'delivery_fee')::NUMERIC, (p_order->>'deliveryFee')::NUMERIC, 0.00);
    v_delivery_fee_included := COALESCE((p_order->>'delivery_fee_included')::NUMERIC, (p_order->>'deliveryFeeIncluded')::NUMERIC, 0.00);
    v_surge_fee             := COALESCE((p_order->>'surge_fee')::NUMERIC, (p_order->>'surgeFee')::NUMERIC, 0.00);
    v_rider_tip             := COALESCE((p_order->>'rider_tip')::NUMERIC, (p_order->>'riderTip')::NUMERIC, 0.00);
    v_taxes                 := COALESCE((p_order->>'taxes')::NUMERIC, 0.00);
    v_discount              := COALESCE((p_order->>'discount')::NUMERIC, 0.00);
    v_wallet_redeemed       := COALESCE((p_order->>'wallet_redeemed')::NUMERIC, (p_order->>'walletRedeemed')::NUMERIC, 0.00);
    v_total                 := (p_order->>'total')::NUMERIC(12,2);
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid numeric values in order monetary fields' USING ERRCODE = '22023';
  END;

  IF v_subtotal IS NULL OR v_total IS NULL THEN
    RAISE EXCEPTION 'Subtotal and total are required monetary values' USING ERRCODE = '22023';
  END IF;

  IF v_subtotal < 0 OR v_delivery_fee < 0 OR v_delivery_fee_included < 0 OR
     v_surge_fee < 0 OR v_rider_tip < 0 OR v_taxes < 0 OR v_discount < 0 OR
     v_wallet_redeemed < 0 OR v_total < 0 THEN
    RAISE EXCEPTION 'Monetary order amounts cannot be negative' USING ERRCODE = '22023';
  END IF;

  v_gross_before_wallet := v_subtotal + v_delivery_fee + v_surge_fee + v_rider_tip + v_taxes - v_discount;

  IF v_gross_before_wallet < 0 THEN
    RAISE EXCEPTION 'Gross order amount cannot be negative' USING ERRCODE = '22023';
  END IF;

  IF v_wallet_redeemed > v_gross_before_wallet THEN
    RAISE EXCEPTION 'Wallet redemption cannot exceed gross order payable amount' USING ERRCODE = '22023';
  END IF;

  IF (v_total + v_wallet_redeemed) <> v_gross_before_wallet THEN
    RAISE EXCEPTION 'Order total (%) plus wallet redemption (%) does not match gross payable (%)',
      v_total, v_wallet_redeemed, v_gross_before_wallet
      USING ERRCODE = '22023';
  END IF;

  -- 4. Authoritative Payment Semantics (Zero Client Trust for Online Paid Claims)
  IF v_total = 0 AND v_wallet_redeemed > 0 THEN
    -- Full wallet redemption
    IF v_payment_method <> 'WALLET' THEN
      RAISE EXCEPTION 'Full wallet order must specify payment_method = WALLET' USING ERRCODE = '22023';
    END IF;
    v_order_status := 'New';
    v_payment_status := 'Paid';
  ELSIF v_payment_method = 'COD' THEN
    -- Cash on Delivery
    v_order_status := 'New';
    v_payment_status := 'Pending';
  ELSIF v_payment_method IN ('UPI', 'CARD') THEN
    -- Online Payment: FORCE Payment_Pending and Pending. Browser cannot claim Paid!
    IF v_total <= 0 THEN
      RAISE EXCEPTION 'Online payment requires positive order total' USING ERRCODE = '22023';
    END IF;
    v_order_status := 'Payment_Pending';
    v_payment_status := 'Pending';
  ELSIF v_payment_method = 'WALLET' THEN
    IF v_total > 0 THEN
      RAISE EXCEPTION 'WALLET payment method is valid only when remaining total is 0' USING ERRCODE = '22023';
    END IF;
  ELSE
    RAISE EXCEPTION 'Unsupported payment method: %', v_payment_method USING ERRCODE = '22023';
  END IF;

  -- Service mode and Schedule mode
  v_service_mode := COALESCE(NULLIF(TRIM(p_order->>'service_mode'), ''), NULLIF(TRIM(p_order->>'serviceMode'), ''), 'delivery');
  IF v_service_mode NOT IN ('delivery', 'dinein', 'takeaway') THEN
    v_service_mode := 'delivery';
  END IF;

  v_schedule_mode := COALESCE(NULLIF(TRIM(p_order->>'schedule_mode'), ''), NULLIF(TRIM(p_order->>'scheduleMode'), ''), 'now');
  IF v_schedule_mode NOT IN ('now', 'later') THEN
    v_schedule_mode := 'now';
  END IF;

  -- Delivery address
  BEGIN
    v_delivery_address_id := (p_order->>'delivery_address_id')::UUID;
  EXCEPTION WHEN OTHERS THEN
    v_delivery_address_id := NULL;
  END;

  v_delivery_address_snapshot := COALESCE(
    p_order->'delivery_address_snapshot',
    p_order->'delivery_address',
    p_order->'customer'->'delivery_address',
    p_order->'customer'->'deliveryAddress',
    p_order->'deliveryAddress',
    'null'::jsonb
  );

  -- 5. Order Idempotency Check (Existing order_code lookup before insert)
  SELECT *
  INTO v_existing_order
  FROM public.orders
  WHERE order_code = v_order_code;

  IF FOUND THEN
    -- Verify ownership
    IF v_existing_order.user_id <> v_user_id THEN
      RAISE EXCEPTION 'Order code belongs to another user' USING ERRCODE = '22023';
    END IF;

    -- Verify financial & routing invariants
    IF v_existing_order.subtotal <> v_subtotal
       OR v_existing_order.delivery_fee <> v_delivery_fee
       OR v_existing_order.surge_fee <> v_surge_fee
       OR v_existing_order.rider_tip <> v_rider_tip
       OR v_existing_order.taxes <> v_taxes
       OR v_existing_order.discount <> v_discount
       OR v_existing_order.wallet_redeemed <> v_wallet_redeemed
       OR v_existing_order.total <> v_total
       OR v_existing_order.payment_method <> v_payment_method THEN
      RAISE EXCEPTION 'Order code % already exists with conflicting monetary parameters', v_order_code
        USING ERRCODE = '22023';
    END IF;

    -- Validate wallet transaction consistency for retry
    IF v_existing_order.wallet_redeemed > 0 THEN
      SELECT *
      INTO v_existing_tx
      FROM public.wallet_transactions
      WHERE order_id = v_existing_order.id
        AND user_id = v_user_id
        AND type = 'debit'
        AND transaction_type = 'checkout_debit';

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Database inconsistency: existing order specifies wallet redemption but ledger transaction is missing'
          USING ERRCODE = '22023';
      END IF;

      IF v_existing_tx.amount <> v_existing_order.wallet_redeemed THEN
        RAISE EXCEPTION 'Database inconsistency: wallet transaction details mismatch existing order'
          USING ERRCODE = '22023';
      END IF;
    END IF;

    -- Read current wallet balance
    SELECT balance
    INTO v_current_balance
    FROM public.customer_wallets
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
      'status', 'already_processed',
      'order_id', v_existing_order.id,
      'order_code', v_existing_order.order_code,
      'wallet_redeemed', v_existing_order.wallet_redeemed,
      'wallet_balance_after', v_current_balance,
      'total', v_existing_order.total,
      'payment_status', v_existing_order.payment_status,
      'order_status', v_existing_order.status
    );
  END IF;

  -- 6. Atomic Wallet Lock & Balance Check (Only when wallet is redeemed)
  IF v_wallet_redeemed > 0 THEN
    SELECT balance
    INTO v_current_balance
    FROM public.customer_wallets
    WHERE user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Customer wallet record not found' USING ERRCODE = '22023';
    END IF;

    IF v_current_balance < v_wallet_redeemed THEN
      RAISE EXCEPTION 'Insufficient wallet balance. Available: %, Requested: %',
        v_current_balance, v_wallet_redeemed
        USING ERRCODE = '22023';
    END IF;

    v_new_balance := v_current_balance - v_wallet_redeemed;
  ELSE
    SELECT balance
    INTO v_current_balance
    FROM public.customer_wallets
    WHERE user_id = v_user_id;
    v_new_balance := v_current_balance;
  END IF;

  -- 7. Insert Order
  INSERT INTO public.orders (
    id,
    order_code,
    user_id,
    invoice_no,
    restaurant_id,
    restaurant_name,
    is_multi_vendor_hub,
    vendor_names,
    allergies,
    chef_notes,
    service_mode,
    table_number,
    customer_name,
    customer_phone,
    customer_address,
    delivery_address_id,
    delivery_address_snapshot,
    subtotal,
    delivery_fee,
    delivery_fee_hidden,
    delivery_fee_included,
    surge_fee,
    rider_tip,
    taxes,
    discount,
    coupon_code,
    wallet_redeemed,
    total,
    status,
    delivery_otp,
    delivery_boy,
    rider_phone,
    payment_method,
    payment_status,
    transaction_id,
    eta_minutes,
    delivery_progress,
    schedule_mode,
    scheduled_slot,
    chat_history,
    created_at,
    updated_at
  ) VALUES (
    v_order_id,
    v_order_code,
    v_user_id,
    COALESCE(p_order->>'invoice_no', p_order->>'invoiceNo'),
    COALESCE(p_order->>'restaurant_id', (p_order->>'restaurantId')::TEXT),
    COALESCE(p_order->>'restaurant_name', p_order->>'restaurantName'),
    COALESCE((p_order->>'is_multi_vendor_hub')::BOOLEAN, (p_order->>'isMultiVendorHub')::BOOLEAN, false),
    COALESCE(p_order->'vendor_names', p_order->'vendorNames', '[]'::jsonb),
    COALESCE(p_order->'allergies', '[]'::jsonb),
    COALESCE(p_order->>'chef_notes', p_order->>'chefNotes'),
    v_service_mode,
    COALESCE(p_order->>'table_number', p_order->>'tableNumber'),
    COALESCE(p_order->'customer'->>'name', p_order->>'customer_name', p_order->>'customerName'),
    COALESCE(p_order->'customer'->>'phone', p_order->>'customer_phone', p_order->>'customerPhone'),
    COALESCE(p_order->'customer'->>'address', p_order->>'customer_address', p_order->>'customerAddress'),
    v_delivery_address_id,
    v_delivery_address_snapshot,
    v_subtotal,
    v_delivery_fee,
    COALESCE((p_order->>'delivery_fee_hidden')::BOOLEAN, (p_order->>'deliveryFeeHidden')::BOOLEAN, false),
    v_delivery_fee_included,
    v_surge_fee,
    v_rider_tip,
    v_taxes,
    v_discount,
    COALESCE(p_order->>'coupon_code', p_order->>'couponCode'),
    v_wallet_redeemed,
    v_total,
    v_order_status,
    COALESCE(p_order->>'delivery_otp', p_order->>'deliveryOtp', floor(1000 + random() * 9000)::TEXT),
    COALESCE(p_order->>'delivery_boy', p_order->>'deliveryBoy'),
    COALESCE(p_order->>'rider_phone', p_order->>'riderPhone'),
    v_payment_method,
    v_payment_status,
    NULL,
    COALESCE((p_order->>'eta_minutes')::INTEGER, (p_order->>'etaMinutes')::INTEGER, 30),
    COALESCE((p_order->>'delivery_progress')::INTEGER, (p_order->>'deliveryProgress')::INTEGER, 15),
    v_schedule_mode,
    COALESCE(p_order->'scheduled_slot', p_order->'scheduledSlot'),
    COALESCE(p_order->'chat_history', p_order->'chatHistory', '[]'::jsonb),
    now(),
    now()
  );

  -- 8. Insert Order Items
  IF p_items IS NOT NULL AND jsonb_typeof(p_items) = 'array' THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
      INSERT INTO public.order_items (
        order_id,
        restaurant_id,
        restaurant_name,
        food_id,
        name,
        base_price,
        price,
        qty,
        addons,
        allergies,
        chef_notes,
        delivery_share
      ) VALUES (
        v_order_id,
        COALESCE(v_item->>'restaurant_id', (v_item->>'restaurantId')::TEXT),
        COALESCE(v_item->>'restaurant_name', v_item->>'restaurantName'),
        COALESCE(v_item->>'food_id', (v_item->>'foodId')::TEXT),
        COALESCE(v_item->>'name', 'Item'),
        COALESCE((v_item->>'base_price')::NUMERIC, (v_item->>'basePrice')::NUMERIC, (v_item->>'price')::NUMERIC, 0.00),
        COALESCE((v_item->>'price')::NUMERIC, 0.00),
        GREATEST(1, COALESCE((v_item->>'qty')::INTEGER, (v_item->>'quantity')::INTEGER, 1)),
        COALESCE(v_item->'addons', '[]'::jsonb),
        COALESCE(v_item->'allergies', '[]'::jsonb),
        COALESCE(v_item->>'chef_notes', v_item->>'chefNotes'),
        COALESCE((v_item->>'delivery_share')::NUMERIC, (v_item->>'deliveryShare')::NUMERIC, 0.00)
      );
    END LOOP;
  END IF;

  -- 9. Debit Customer Wallet & Record Ledger Transaction
  IF v_wallet_redeemed > 0 THEN
    v_checkout_key := 'checkout:' || v_user_id::TEXT || ':' || v_order_code;

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
      v_order_id,
      'debit',
      v_wallet_redeemed,
      v_new_balance,
      'checkout_debit',
      'Wallet redemption for order ' || v_order_code,
      v_checkout_key
    )
    RETURNING id INTO v_tx_id;

    UPDATE public.customer_wallets
    SET
      balance = v_new_balance,
      updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  -- 10. Return Authoritative Response
  RETURN jsonb_build_object(
    'status', 'success',
    'order_id', v_order_id,
    'order_code', v_order_code,
    'wallet_redeemed', v_wallet_redeemed,
    'wallet_balance_after', v_new_balance,
    'total', v_total,
    'payment_status', v_payment_status,
    'order_status', v_order_status
  );
END;
$$;

-- ============================================================
-- 7. RPC: public.cancel_pending_customer_payment
-- ============================================================
CREATE OR REPLACE FUNCTION public.cancel_pending_customer_payment(
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
  v_captured_count INTEGER;
  v_checkout_debit_count INTEGER;
  v_checkout_debit public.wallet_transactions%ROWTYPE;
  v_refund_amount NUMERIC(12,2) := 0.00;
  v_refund_key TEXT;
  v_existing_refund public.wallet_transactions%ROWTYPE;
  v_current_balance NUMERIC(12,2);
  v_new_balance NUMERIC(12,2);
  v_refund_tx public.wallet_transactions%ROWTYPE;
BEGIN
  -- 1. Authenticate caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  -- 2. Lock Order FOR UPDATE & Validate Ownership
  SELECT *
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND OR v_order.user_id <> v_user_id THEN
    RAISE EXCEPTION 'Order not found' USING ERRCODE = 'P0002';
  END IF;

  -- 3. Deterministic Idempotency Key
  v_refund_key := 'cancel-pending-refund:' || v_user_id::TEXT || ':' || v_order.order_code;

  -- 4. Idempotent Return if Already Cancelled
  IF v_order.status = 'Cancelled' AND v_order.payment_status = 'Pending' THEN
    IF COALESCE(v_order.wallet_redeemed, 0) > 0 THEN
      SELECT *
      INTO v_existing_refund
      FROM public.wallet_transactions
      WHERE idempotency_key = v_refund_key;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Database inconsistency: pending order cancelled but refund ledger missing'
          USING ERRCODE = '22023';
      END IF;

      SELECT balance INTO v_current_balance FROM public.customer_wallets WHERE user_id = v_user_id;

      RETURN jsonb_build_object(
        'status', 'already_processed',
        'order_id', v_order.id,
        'order_code', v_order.order_code,
        'wallet_refunded', v_existing_refund.amount,
        'wallet_balance_after', v_current_balance,
        'external_refund_required', false
      );
    ELSE
      SELECT balance INTO v_current_balance FROM public.customer_wallets WHERE user_id = v_user_id;

      RETURN jsonb_build_object(
        'status', 'already_processed',
        'order_id', v_order.id,
        'order_code', v_order.order_code,
        'wallet_refunded', 0.00,
        'wallet_balance_after', v_current_balance,
        'external_refund_required', false
      );
    END IF;
  END IF;

  -- 5. Status Validation (Strictly Payment_Pending and Pending)
  IF v_order.status <> 'Payment_Pending' OR v_order.payment_status <> 'Pending' THEN
    RAISE EXCEPTION 'Order cannot be abandoned. Current status: %, payment_status: %',
      v_order.status, v_order.payment_status
      USING ERRCODE = '22023';
  END IF;

  -- 6. Ensure NO Captured Payment Exists
  SELECT COUNT(*)
  INTO v_captured_count
  FROM public.payment_transactions
  WHERE order_id = v_order.id
    AND status = 'captured';

  IF v_captured_count > 0 THEN
    RAISE EXCEPTION 'Cannot cancel pending payment: a captured payment transaction already exists for order %',
      v_order.order_code
      USING ERRCODE = '22023';
  END IF;

  -- 7. Wallet Reversal (Authoritative Checkout Debit Verification)
  IF COALESCE(v_order.wallet_redeemed, 0) > 0 THEN
    SELECT COUNT(*)
    INTO v_checkout_debit_count
    FROM public.wallet_transactions
    WHERE user_id = v_user_id
      AND order_id = v_order.id
      AND type = 'debit'
      AND transaction_type = 'checkout_debit';

    IF v_checkout_debit_count <> 1 THEN
      RAISE EXCEPTION 'Inconsistent checkout debit records for order %: expected 1, found %',
        v_order.order_code, v_checkout_debit_count
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
      RAISE EXCEPTION 'Checkout debit amount (%) does not match order wallet_redeemed (%)',
        v_checkout_debit.amount, v_order.wallet_redeemed
        USING ERRCODE = '22023';
    END IF;

    v_refund_amount := v_checkout_debit.amount;

    -- Lock wallet FOR UPDATE
    SELECT balance
    INTO v_current_balance
    FROM public.customer_wallets
    WHERE user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Customer wallet record not found' USING ERRCODE = '22023';
    END IF;

    v_new_balance := v_current_balance + v_refund_amount;

    -- Insert cancellation refund into ledger
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
      'Cancelled pending online payment for order ' || v_order.order_code,
      v_refund_key
    )
    RETURNING * INTO v_refund_tx;

    -- Update wallet balance
    UPDATE public.customer_wallets
    SET
      balance = v_new_balance,
      updated_at = now()
    WHERE user_id = v_user_id;
  ELSE
    SELECT balance INTO v_current_balance FROM public.customer_wallets WHERE user_id = v_user_id;
    v_new_balance := v_current_balance;
  END IF;

  -- 8. Mark Order as Cancelled (payment_status remains 'Pending', NO external refund)
  UPDATE public.orders
  SET
    status = 'Cancelled',
    updated_at = now()
  WHERE id = v_order.id;

  -- 9. Return Response
  RETURN jsonb_build_object(
    'status', 'success',
    'order_id', v_order.id,
    'order_code', v_order.order_code,
    'order_status', 'Cancelled',
    'payment_status', 'Pending',
    'wallet_refunded', v_refund_amount,
    'wallet_balance_after', v_new_balance,
    'external_refund_required', false
  );
END;
$$;

-- ============================================================
-- 8. RPC: public.register_gateway_payment_order (service_role ONLY)
-- ============================================================
CREATE OR REPLACE FUNCTION public.register_gateway_payment_order(
  p_order_id UUID,
  p_gateway_order_id TEXT,
  p_amount NUMERIC,
  p_currency TEXT DEFAULT 'INR',
  p_provider_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_existing_tx public.payment_transactions%ROWTYPE;
  v_active_tx public.payment_transactions%ROWTYPE;
  v_new_tx_id UUID;
  v_gateway_order_id TEXT;
BEGIN
  v_gateway_order_id := TRIM(p_gateway_order_id);
  IF v_gateway_order_id IS NULL OR v_gateway_order_id = '' THEN
    RAISE EXCEPTION 'Gateway order ID is required' USING ERRCODE = '22023';
  END IF;

  -- 1. Lock Order FOR UPDATE
  SELECT *
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found' USING ERRCODE = 'P0002';
  END IF;

  -- 2. State & Prerequisite Verification
  IF v_order.status <> 'Payment_Pending' OR v_order.payment_status <> 'Pending' THEN
    RAISE EXCEPTION 'Order is not awaiting payment. Current status: %, payment_status: %',
      v_order.status, v_order.payment_status
      USING ERRCODE = '22023';
  END IF;

  IF v_order.payment_method NOT IN ('UPI', 'CARD') THEN
    RAISE EXCEPTION 'Gateway payment is not supported for payment method %', v_order.payment_method
      USING ERRCODE = '22023';
  END IF;

  IF COALESCE(v_order.total, 0) <= 0 THEN
    RAISE EXCEPTION 'Order total must be greater than zero for gateway payment' USING ERRCODE = '22023';
  END IF;

  IF p_amount <> v_order.total THEN
    RAISE EXCEPTION 'Amount mismatch: provided %, authoritative order total %', p_amount, v_order.total
      USING ERRCODE = '22023';
  END IF;

  IF COALESCE(p_currency, 'INR') <> 'INR' THEN
    RAISE EXCEPTION 'Currency must be INR' USING ERRCODE = '22023';
  END IF;

  -- 3. Idempotency Check: Same gateway_order_id already registered
  SELECT *
  INTO v_existing_tx
  FROM public.payment_transactions
  WHERE gateway_order_id = v_gateway_order_id;

  IF FOUND THEN
    IF v_existing_tx.order_id = p_order_id THEN
      RETURN jsonb_build_object(
        'status', 'already_processed',
        'transaction_id', v_existing_tx.id,
        'order_id', v_order.id,
        'gateway_order_id', v_existing_tx.gateway_order_id,
        'amount', v_existing_tx.amount,
        'transaction_status', v_existing_tx.status
      );
    ELSE
      RAISE EXCEPTION 'Gateway order ID % is already assigned to another order', v_gateway_order_id
        USING ERRCODE = '22023';
    END IF;
  END IF;

  -- 4. Transition Previous 'created' Attempts for this Order to 'failed' (Superseded Attempt)
  FOR v_active_tx IN 
    SELECT * FROM public.payment_transactions 
    WHERE order_id = p_order_id AND status = 'created'
    FOR UPDATE
  LOOP
    UPDATE public.payment_transactions
    SET
      status = 'failed',
      updated_at = now()
    WHERE id = v_active_tx.id;
  END LOOP;

  -- 5. Insert New Payment Transaction
  INSERT INTO public.payment_transactions (
    order_id,
    user_id,
    provider,
    gateway_order_id,
    amount,
    currency,
    status,
    signature_verified,
    provider_payload
  ) VALUES (
    v_order.id,
    v_order.user_id,
    'razorpay',
    v_gateway_order_id,
    v_order.total,
    'INR',
    'created',
    false,
    COALESCE(p_provider_payload, '{}'::jsonb)
  )
  RETURNING id INTO v_new_tx_id;

  -- 6. Return Success
  RETURN jsonb_build_object(
    'status', 'success',
    'transaction_id', v_new_tx_id,
    'order_id', v_order.id,
    'gateway_order_id', v_gateway_order_id,
    'amount', v_order.total,
    'currency', 'INR'
  );
END;
$$;

-- ============================================================
-- 9. RPC: public.finalize_customer_payment (service_role ONLY)
-- ============================================================
CREATE OR REPLACE FUNCTION public.finalize_customer_payment(
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

  IF v_gateway_order_id IS NULL OR v_gateway_order_id = '' THEN
    RAISE EXCEPTION 'Gateway order ID is required' USING ERRCODE = '22023';
  END IF;

  IF v_gateway_payment_id IS NULL OR v_gateway_payment_id = '' THEN
    RAISE EXCEPTION 'Gateway payment ID is required' USING ERRCODE = '22023';
  END IF;

  -- 1. Lock Order FOR UPDATE
  SELECT *
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found' USING ERRCODE = 'P0002';
  END IF;

  -- 2. Idempotent Return if Already Finalized with this Payment ID
  IF v_order.status = 'New' AND v_order.payment_status = 'Paid' AND v_order.transaction_id = v_gateway_payment_id THEN
    RETURN jsonb_build_object(
      'status', 'already_processed',
      'order_id', v_order.id,
      'order_code', v_order.order_code,
      'order_status', 'New',
      'payment_status', 'Paid',
      'transaction_id', v_gateway_payment_id
    );
  END IF;

  -- 3. Enforce Pending State
  IF v_order.status <> 'Payment_Pending' OR v_order.payment_status <> 'Pending' THEN
    RAISE EXCEPTION 'Order is not in pending payment state. Current status: %, payment_status: %',
      v_order.status, v_order.payment_status
      USING ERRCODE = '22023';
  END IF;

  -- 4. Lock Matching Payment Transaction FOR UPDATE
  SELECT *
  INTO v_tx
  FROM public.payment_transactions
  WHERE order_id = p_order_id
    AND gateway_order_id = v_gateway_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment transaction not found for order % and gateway order %',
      v_order.order_code, v_gateway_order_id
      USING ERRCODE = 'P0002';
  END IF;

  IF v_tx.user_id <> v_order.user_id THEN
    RAISE EXCEPTION 'Payment transaction user mismatch' USING ERRCODE = '22023';
  END IF;

  IF v_tx.amount <> v_order.total THEN
    RAISE EXCEPTION 'Payment transaction amount (%) does not match order total (%)',
      v_tx.amount, v_order.total
      USING ERRCODE = '22023';
  END IF;

  IF v_tx.currency <> 'INR' THEN
    RAISE EXCEPTION 'Payment currency must be INR' USING ERRCODE = '22023';
  END IF;

  -- Handle already captured transaction state
  IF v_tx.status = 'captured' THEN
    IF v_tx.gateway_payment_id = v_gateway_payment_id THEN
      -- Reconcile order if not updated
      UPDATE public.orders
      SET
        status = 'New',
        payment_status = 'Paid',
        transaction_id = v_gateway_payment_id,
        updated_at = now()
      WHERE id = v_order.id;

      RETURN jsonb_build_object(
        'status', 'already_processed',
        'order_id', v_order.id,
        'order_code', v_order.order_code,
        'order_status', 'New',
        'payment_status', 'Paid',
        'transaction_id', v_gateway_payment_id
      );
    ELSE
      RAISE EXCEPTION 'Payment transaction already captured under different payment ID %', v_tx.gateway_payment_id
        USING ERRCODE = '22023';
    END IF;
  END IF;

  IF v_tx.status NOT IN ('created', 'authorized') THEN
    RAISE EXCEPTION 'Payment transaction is not eligible for capture (current status: %)', v_tx.status
      USING ERRCODE = '22023';
  END IF;

  -- 5. Mark Payment Transaction Captured
  UPDATE public.payment_transactions
  SET
    gateway_payment_id = v_gateway_payment_id,
    signature_verified = true,
    status = 'captured',
    captured_at = now(),
    provider_payload = COALESCE(p_provider_payload, provider_payload),
    updated_at = now()
  WHERE id = v_tx.id;

  -- 6. Transition Order to New and Paid
  UPDATE public.orders
  SET
    status = 'New',
    payment_status = 'Paid',
    transaction_id = v_gateway_payment_id,
    updated_at = now()
  WHERE id = v_order.id;

  -- 7. Return Response
  RETURN jsonb_build_object(
    'status', 'success',
    'order_id', v_order.id,
    'order_code', v_order.order_code,
    'order_status', 'New',
    'payment_status', 'Paid',
    'transaction_id', v_gateway_payment_id,
    'amount_captured', v_tx.amount
  );
END;
$$;

-- ============================================================
-- 10. PRIVILEGES & PERMISSIONS
-- ============================================================
-- create_customer_order_v3: authenticated only
REVOKE ALL ON FUNCTION public.create_customer_order_v3(JSONB, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_customer_order_v3(JSONB, JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_customer_order_v3(JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_order_v3(JSONB, JSONB) TO service_role;

-- cancel_pending_customer_payment: authenticated only
REVOKE ALL ON FUNCTION public.cancel_pending_customer_payment(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cancel_pending_customer_payment(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.cancel_pending_customer_payment(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_pending_customer_payment(UUID) TO service_role;

-- register_gateway_payment_order: service_role strictly
REVOKE ALL ON FUNCTION public.register_gateway_payment_order(UUID, TEXT, NUMERIC, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_gateway_payment_order(UUID, TEXT, NUMERIC, TEXT, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.register_gateway_payment_order(UUID, TEXT, NUMERIC, TEXT, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.register_gateway_payment_order(UUID, TEXT, NUMERIC, TEXT, JSONB) TO service_role;

-- finalize_customer_payment: service_role strictly
REVOKE ALL ON FUNCTION public.finalize_customer_payment(UUID, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.finalize_customer_payment(UUID, TEXT, TEXT, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.finalize_customer_payment(UUID, TEXT, TEXT, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_customer_payment(UUID, TEXT, TEXT, JSONB) TO service_role;
