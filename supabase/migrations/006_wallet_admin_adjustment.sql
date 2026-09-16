-- supabase/migrations/006_wallet_admin_adjustment.sql
-- Service-Role Only Administrative Customer Wallet Adjustment RPC
-- Strict Security:
-- 1. Executable ONLY by service_role (backend server / admin).
-- 2. REVOKED from PUBLIC, anon, and authenticated. Normal customer browsers cannot invoke this.
-- 3. Row-level locking (SELECT ... FOR UPDATE) on target wallet serializes concurrent adjustments.
-- 4. Strict idempotency ownership: keys belonging to another user are rejected.
-- 5. Strict semantic validation: retries with differing amount/type for the same key are rejected.
-- 6. Atomicity: ledger insertion precedes balance mutation; balance cannot overdraft.

-- ============================================================
-- RPC: public.admin_adjust_customer_wallet
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_adjust_customer_wallet(
  p_user_id UUID,
  p_amount NUMERIC,
  p_description TEXT,
  p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_desc TEXT;
  v_key TEXT;
  v_current_balance NUMERIC(12,2);
  v_new_balance NUMERIC(12,2);
  v_type TEXT;
  v_abs_amount NUMERIC(12,2);
  v_tx_id UUID;
  v_existing RECORD;
  v_expected_type TEXT;
  v_expected_amount NUMERIC(12,2);
BEGIN
  -- 1. Input Validation & Normalization
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Target user_id is required' USING ERRCODE = '22023';
  END IF;

  IF p_amount IS NULL OR p_amount = 0 THEN
    RAISE EXCEPTION 'Adjustment amount cannot be zero or null' USING ERRCODE = '22023';
  END IF;

  v_desc := trim(p_description);
  IF v_desc IS NULL OR v_desc = '' THEN
    RAISE EXCEPTION 'Adjustment description is required' USING ERRCODE = '22023';
  END IF;

  v_key := trim(p_idempotency_key);
  IF v_key IS NULL OR v_key = '' THEN
    RAISE EXCEPTION 'Idempotency key is required' USING ERRCODE = '22023';
  END IF;

  -- Confirm target auth user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Target user not found' USING ERRCODE = 'P0002';
  END IF;

  -- 2. Ensure Target Customer Wallet Row Exists
  INSERT INTO public.customer_wallets (user_id, balance)
  VALUES (p_user_id, 0.00)
  ON CONFLICT (user_id) DO NOTHING;

  -- 3. Acquire Row Lock on Target Wallet
  -- Serializes concurrent operations on the same wallet to guarantee balance consistency
  SELECT balance
  INTO v_current_balance
  FROM public.customer_wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Compute expected transaction semantics for validation
  v_expected_type := CASE WHEN p_amount > 0 THEN 'credit' ELSE 'debit' END;
  v_expected_amount := ABS(p_amount);

  -- 4. Idempotency Check (Evaluated after wallet row lock)
  SELECT
    id,
    user_id,
    type,
    amount,
    balance_after,
    transaction_type,
    idempotency_key
  INTO v_existing
  FROM public.wallet_transactions
  WHERE idempotency_key = v_key;

  IF FOUND THEN
    -- Ownership check: Never return another user's transaction
    IF v_existing.user_id <> p_user_id THEN
      RAISE EXCEPTION 'Idempotency key belongs to another user' USING ERRCODE = '22023';
    END IF;

    -- Semantic validation: Reject if same key is reused for a different operation
    IF v_existing.transaction_type <> 'admin_adjustment'
       OR v_existing.type <> v_expected_type
       OR v_existing.amount <> v_expected_amount THEN
      RAISE EXCEPTION 'Idempotency key already used for a different operation' USING ERRCODE = '22023';
    END IF;

    -- Valid exact retry: return existing transaction without modifying balance
    RETURN jsonb_build_object(
      'status', 'already_processed',
      'transaction_id', v_existing.id,
      'user_id', v_existing.user_id,
      'type', v_existing.type,
      'amount', v_existing.amount,
      'balance_after', v_existing.balance_after,
      'idempotency_key', v_existing.idempotency_key
    );
  END IF;

  -- 5. Calculate Resulting Balance & Validate Overdraft
  v_new_balance := v_current_balance + p_amount;

  IF v_new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient balance for debit. Current balance is %, requested adjustment is %',
      v_current_balance, p_amount
      USING ERRCODE = '22023';
  END IF;

  v_type := v_expected_type;
  v_abs_amount := v_expected_amount;

  -- 6. Insert Ledger Entry with Defensive Unique Constraint Handling
  -- Ledger insertion occurs before balance mutation to guarantee atomicity
  BEGIN
    INSERT INTO public.wallet_transactions (
      user_id,
      order_id,
      type,
      amount,
      balance_after,
      transaction_type,
      description,
      idempotency_key
    ) VALUES (
      p_user_id,
      NULL,
      v_type,
      v_abs_amount,
      v_new_balance,
      'admin_adjustment',
      v_desc,
      v_key
    )
    RETURNING id INTO v_tx_id;
  EXCEPTION
    WHEN unique_violation THEN
      -- Race condition safety: if a concurrent process committed with this idempotency key,
      -- fetch and validate the committed record. Balance has NOT been updated in this block.
      SELECT
        id,
        user_id,
        type,
        amount,
        balance_after,
        transaction_type,
        idempotency_key
      INTO v_existing
      FROM public.wallet_transactions
      WHERE idempotency_key = v_key;

      IF FOUND THEN
        IF v_existing.user_id <> p_user_id THEN
          RAISE EXCEPTION 'Idempotency key belongs to another user' USING ERRCODE = '22023';
        END IF;

        IF v_existing.transaction_type <> 'admin_adjustment'
           OR v_existing.type <> v_expected_type
           OR v_existing.amount <> v_expected_amount THEN
          RAISE EXCEPTION 'Idempotency key already used for a different operation' USING ERRCODE = '22023';
        END IF;

        RETURN jsonb_build_object(
          'status', 'already_processed',
          'transaction_id', v_existing.id,
          'user_id', v_existing.user_id,
          'type', v_existing.type,
          'amount', v_existing.amount,
          'balance_after', v_existing.balance_after,
          'idempotency_key', v_existing.idempotency_key
        );
      ELSE
        RAISE;
      END IF;
  END;

  -- 7. Mutate Target Customer Wallet Balance
  UPDATE public.customer_wallets
  SET
    balance = v_new_balance,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- 8. Return Success Payload
  RETURN jsonb_build_object(
    'status', 'success',
    'transaction_id', v_tx_id,
    'user_id', p_user_id,
    'type', v_type,
    'amount', v_abs_amount,
    'balance_after', v_new_balance,
    'idempotency_key', v_key
  );
END;
$$;

-- ============================================================
-- PRIVILEGES & PERMISSIONS (SERVICE ROLE ONLY)
-- ============================================================
-- Revoke execution from all browser/client roles
REVOKE ALL ON FUNCTION public.admin_adjust_customer_wallet(UUID, NUMERIC, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_adjust_customer_wallet(UUID, NUMERIC, TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.admin_adjust_customer_wallet(UUID, NUMERIC, TEXT, TEXT) FROM authenticated;

-- Grant execution STRICTLY to service_role (backend server / admin only)
GRANT EXECUTE ON FUNCTION public.admin_adjust_customer_wallet(UUID, NUMERIC, TEXT, TEXT) TO service_role;

-- Schema Documentation Comment
COMMENT ON FUNCTION public.admin_adjust_customer_wallet(UUID, NUMERIC, TEXT, TEXT) IS
  'Service-role only RPC for administrative customer wallet adjustments. Enforces strict row locking, cross-user idempotency ownership, semantic retry validation, and atomic ledger insertion.';
