-- supabase/migrations/005_customer_wallets.sql
-- Customer Wallets and Append-Only Financial Ledger
-- Architecture:
-- 1. customer_wallets: stores strict database-backed wallet balance (balance >= 0)
-- 2. wallet_transactions: immutable audit ledger with point-in-time balance_after and unique idempotency_key
-- 3. Read-only RLS for authenticated customers (SELECT own rows only); NO direct customer INSERT/UPDATE/DELETE
-- 4. Extends auth signup trigger to initialize zero balance wallet; backfills existing auth users with 0.00
-- 5. No financial mutation RPCs in this migration.

-- ============================================================
-- 1. TABLE: public.customer_wallets
-- ============================================================
CREATE TABLE public.customer_wallets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT customer_wallets_balance_non_negative CHECK (balance >= 0)
);

-- Comments
COMMENT ON TABLE public.customer_wallets IS 'Stores verified server-side wallet balance for customers. Mutations restricted to SECURITY DEFINER RPCs.';
COMMENT ON COLUMN public.customer_wallets.user_id IS 'References auth.users(id). Single identity key.';
COMMENT ON COLUMN public.customer_wallets.balance IS 'Current spendable INR balance. Guaranteed non-negative by check constraint.';

-- Updated_at trigger using existing shared public.handle_updated_at() from 001_init_core_tables.sql
CREATE TRIGGER customer_wallets_updated_at
  BEFORE UPDATE ON public.customer_wallets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 2. TABLE: public.wallet_transactions
-- ============================================================
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.customer_wallets(user_id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  balance_after NUMERIC(12,2) NOT NULL CHECK (balance_after >= 0),
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN (
      'checkout_debit',
      'checkout_rollback',
      'cancellation_refund',
      'cashback',
      'top_up',
      'admin_adjustment'
    )
  ),
  description TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments
COMMENT ON TABLE public.wallet_transactions IS 'Immutable financial audit trail recording all wallet debits and credits.';
COMMENT ON COLUMN public.wallet_transactions.balance_after IS 'Wallet balance immediately following the transaction for point-in-time auditing.';
COMMENT ON COLUMN public.wallet_transactions.idempotency_key IS 'Unique deterministic operation key to prevent duplicate credits or debits.';

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_order_id ON public.wallet_transactions(order_id);
CREATE INDEX idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);

-- ============================================================
-- 4. EXTEND AUTH USER TRIGGER (New Users Auto-Creation)
-- ============================================================
-- Extends the existing handle_new_user() from 001_init_core_tables.sql
-- so new signups receive both a profile row and a zero-balance wallet row atomically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Create customer profile (from 001_init_core_tables.sql)
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (id) DO NOTHING;

  -- 2. Create customer wallet with 0.00 balance
  INSERT INTO public.customer_wallets (user_id, balance)
  VALUES (NEW.id, 0.00)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. BACKFILL EXISTING AUTH USERS
-- ============================================================
-- Create zero-balance wallet rows for all existing Supabase auth users.
-- Does NOT import untrusted client/localStorage balances.
INSERT INTO public.customer_wallets (user_id, balance)
SELECT id, 0.00
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.customer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Customer can SELECT only their own wallet row
CREATE POLICY "customer_wallets_select_own"
  ON public.customer_wallets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Customer can SELECT only their own wallet transactions
CREATE POLICY "wallet_transactions_select_own"
  ON public.wallet_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- NO INSERT, UPDATE, or DELETE policies created for authenticated customers.
-- Financial rows cannot be created, modified, or deleted by client queries.

-- ============================================================
-- 7. TABLE PRIVILEGES
-- ============================================================
-- Revoke all table privileges from PUBLIC and anon
REVOKE ALL ON TABLE public.customer_wallets FROM PUBLIC;
REVOKE ALL ON TABLE public.customer_wallets FROM anon;
REVOKE ALL ON TABLE public.customer_wallets FROM authenticated;

REVOKE ALL ON TABLE public.wallet_transactions FROM PUBLIC;
REVOKE ALL ON TABLE public.wallet_transactions FROM anon;
REVOKE ALL ON TABLE public.wallet_transactions FROM authenticated;

-- Grant strictly SELECT to authenticated users (governed by RLS)
GRANT SELECT ON TABLE public.customer_wallets TO authenticated;
GRANT SELECT ON TABLE public.wallet_transactions TO authenticated;
