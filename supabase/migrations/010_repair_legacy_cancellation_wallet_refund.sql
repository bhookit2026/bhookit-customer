-- supabase/migrations/010_repair_legacy_cancellation_wallet_refund.sql
-- Administrative Repair RPC for Legacy Order Cancellation Wallet Refunds
-- Architecture:
-- 1. Service-Role Only Administrative Repair:
--    This RPC is strictly restricted to service_role (backend/admin console).
--    REVOKED from PUBLIC, anon, and authenticated to prevent browser/customer invocation.
-- 2. Authoritative Verification:
--    Requires order.status = 'Cancelled' and order.wallet_redeemed > 0.
--    Verifies exactly ONE authoritative checkout_debit transaction in wallet_transactions.
--    Authoritative refund amount is derived solely from checkout_debit.amount.
-- 3. Double-Refund & Multiple-Refund Inconsistency Protection:
--    Checks for both repair idempotency key and ALL existing cancellation_refund ledger
--    entries on the order. Rejects with error if multiple cancellation refunds exist.
--    Returns already_processed if exactly one valid refund exists.
-- 4. Atomic Row Locking & State Isolation:
--    Locks public.orders first (FOR UPDATE by order_code), then locks public.customer_wallets
--    (FOR UPDATE by user_id).
--    Inserts cancellation_refund into wallet_transactions, updates wallet balance.
--    DOES NOT mutate orders.status, orders.payment_status, or orders.wallet_redeemed.

CREATE OR REPLACE FUNCTION public.repair_legacy_cancellation_wallet_refund(
  p_order_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_order public.orders%ROWTYPE;
  v_checkout_debit_count INTEGER;
  v_checkout_debit public.wallet_transactions%ROWTYPE;
  v_existing_repair public.wallet_transactions%ROWTYPE;
  v_existing_refund_count INTEGER;
  v_existing_refund public.wallet_transactions%ROWTYPE;
  v_repair_key TEXT;
  v_current_balance NUMERIC(12,2);
  v_new_balance NUMERIC(12,2);
  v_repair_tx public.wallet_transactions%ROWTYPE;
BEGIN
  -- ============================================================
  -- 1. INPUT VALIDATION
  -- ============================================================
  v_code := trim(p_order_code);
  IF v_code IS NULL OR v_code = '' THEN
    RAISE EXCEPTION 'Order code is required'
      USING ERRCODE = '22023';
  END IF;

  -- ============================================================
  -- 2. LOCK AND LOAD ORDER BY ORDER_CODE
  -- ============================================================
  SELECT *
  INTO v_order
  FROM public.orders
  WHERE order_code = v_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found for order code %', v_code
      USING ERRCODE = 'P0002';
  END IF;

  -- ============================================================
  -- 3. STATUS & REDEMPTION PREREQUISITES
  -- ============================================================
  IF v_order.status <> 'Cancelled' THEN
    RAISE EXCEPTION 'Order % is not Cancelled. Current status: %', v_order.order_code, v_order.status
      USING ERRCODE = '22023';
  END IF;

  IF COALESCE(v_order.wallet_redeemed, 0) <= 0 THEN
    RAISE EXCEPTION 'Order % has no wallet redemption (wallet_redeemed = %)', v_order.order_code, v_order.wallet_redeemed
      USING ERRCODE = '22023';
  END IF;

  -- ============================================================
  -- 4. AUTHORITATIVE CHECKOUT DEBIT VERIFICATION
  -- ============================================================
  SELECT COUNT(*)
  INTO v_checkout_debit_count
  FROM public.wallet_transactions
  WHERE user_id = v_order.user_id
    AND order_id = v_order.id
    AND type = 'debit'
    AND transaction_type = 'checkout_debit';

  IF v_checkout_debit_count <> 1 THEN
    RAISE EXCEPTION 'Inconsistent checkout debit records for order %: expected 1, found %', v_order.order_code, v_checkout_debit_count
      USING ERRCODE = '22023';
  END IF;

  SELECT *
  INTO v_checkout_debit
  FROM public.wallet_transactions
  WHERE user_id = v_order.user_id
    AND order_id = v_order.id
    AND type = 'debit'
    AND transaction_type = 'checkout_debit'
  LIMIT 1;

  IF v_checkout_debit.amount <> v_order.wallet_redeemed THEN
    RAISE EXCEPTION 'Checkout debit amount (%) does not match order wallet_redeemed (%) for order %',
      v_checkout_debit.amount, v_order.wallet_redeemed, v_order.order_code
      USING ERRCODE = '22023';
  END IF;

  -- ============================================================
  -- 5. DETERMINISTIC REPAIR IDEMPOTENCY KEY CHECK
  -- ============================================================
  v_repair_key :=
    'legacy-cancel-repair:' ||
    v_order.user_id::TEXT ||
    ':' ||
    v_order.order_code;

  SELECT *
  INTO v_existing_repair
  FROM public.wallet_transactions
  WHERE idempotency_key = v_repair_key;

  IF FOUND THEN
    IF v_existing_repair.user_id <> v_order.user_id
       OR v_existing_repair.order_id <> v_order.id
       OR v_existing_repair.type <> 'credit'
       OR v_existing_repair.transaction_type <> 'cancellation_refund'
       OR v_existing_repair.amount <> v_checkout_debit.amount THEN
      RAISE EXCEPTION 'Database inconsistency: repair transaction exists with mismatched fields for order %', v_order.order_code
        USING ERRCODE = '22023';
    END IF;

    RETURN jsonb_build_object(
      'status', 'already_processed',
      'order_id', v_order.id,
      'order_code', v_order.order_code,
      'wallet_refunded', v_existing_repair.amount,
      'wallet_balance_after', v_existing_repair.balance_after,
      'repair_idempotency_key', v_repair_key
    );
  END IF;

  -- ============================================================
  -- 6. EXISTING CANCELLATION REFUND CHECK (V2 / PRIOR DUPLICATE DEFENSE)
  -- ============================================================
  SELECT COUNT(*)
  INTO v_existing_refund_count
  FROM public.wallet_transactions
  WHERE user_id = v_order.user_id
    AND order_id = v_order.id
    AND type = 'credit'
    AND transaction_type = 'cancellation_refund';

  IF v_existing_refund_count > 1 THEN
    RAISE EXCEPTION 'Database inconsistency: multiple cancellation refund transactions found for order %: count = %',
      v_order.order_code, v_existing_refund_count
      USING ERRCODE = '22023';
  ELSIF v_existing_refund_count = 1 THEN
    SELECT *
    INTO v_existing_refund
    FROM public.wallet_transactions
    WHERE user_id = v_order.user_id
      AND order_id = v_order.id
      AND type = 'credit'
      AND transaction_type = 'cancellation_refund';

    IF v_existing_refund.amount <> v_checkout_debit.amount THEN
      RAISE EXCEPTION 'Database inconsistency: existing cancellation refund amount (%) does not match checkout debit (%) for order %',
        v_existing_refund.amount, v_checkout_debit.amount, v_order.order_code
        USING ERRCODE = '22023';
    END IF;

    RETURN jsonb_build_object(
      'status', 'already_processed',
      'order_id', v_order.id,
      'order_code', v_order.order_code,
      'wallet_refunded', v_existing_refund.amount,
      'wallet_balance_after', v_existing_refund.balance_after,
      'repair_idempotency_key', v_existing_refund.idempotency_key
    );
  END IF;

  -- ============================================================
  -- 7. ATOMIC WALLET REPAIR MUTATION
  -- ============================================================
  -- Lock customer wallet
  SELECT balance
  INTO v_current_balance
  FROM public.customer_wallets
  WHERE user_id = v_order.user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Customer wallet not found for user %', v_order.user_id
      USING ERRCODE = '22023';
  END IF;

  v_new_balance := v_current_balance + v_checkout_debit.amount;

  -- 8. Insert refund transaction into wallet ledger
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
    v_order.user_id,
    v_order.id,
    'credit',
    v_checkout_debit.amount,
    v_new_balance,
    'cancellation_refund',
    'Legacy cancellation wallet refund repair for order ' || v_order.order_code,
    v_repair_key
  )
  RETURNING *
  INTO v_repair_tx;

  -- 9. Update customer wallet balance
  UPDATE public.customer_wallets
  SET
    balance = v_new_balance,
    updated_at = now()
  WHERE user_id = v_order.user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update customer wallet balance for user %', v_order.user_id
      USING ERRCODE = '22023';
  END IF;

  -- 10. Return success result
  RETURN jsonb_build_object(
    'status', 'success',
    'order_id', v_order.id,
    'order_code', v_order.order_code,
    'wallet_refunded', v_checkout_debit.amount,
    'wallet_balance_after', v_new_balance,
    'repair_idempotency_key', v_repair_key
  );
END;
$$;

-- ============================================================
-- PRIVILEGES & PERMISSIONS (SERVICE ROLE ONLY)
-- ============================================================
REVOKE ALL ON FUNCTION public.repair_legacy_cancellation_wallet_refund(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.repair_legacy_cancellation_wallet_refund(TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.repair_legacy_cancellation_wallet_refund(TEXT) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.repair_legacy_cancellation_wallet_refund(TEXT) TO service_role;

COMMENT ON FUNCTION public.repair_legacy_cancellation_wallet_refund(TEXT) IS
  'Administrative repair RPC. Atomically refunds wallet debit for orders cancelled under legacy RPC prior to migration 008. Executable strictly by service_role.';
