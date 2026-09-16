-- supabase/migrations/009_deprecate_legacy_cancel_rpc.sql
-- Deprecate Legacy Order Cancellation RPC (Safety Guard)
-- Architecture:
-- 1. Safety Guard for Stale Clients:
--    Replaces the legacy public.cancel_customer_order(UUID) RPC with a safe stub
--    that unconditionally aborts with an informative exception.
-- 2. Zero State Mutation:
--    Performs zero order mutations, zero wallet mutations, and zero ledger insertions.
-- 3. Stale Cache Protection:
--    Guarantees that if any stale browser, PWA, or client cached prior to Step 6I
--    attempts to call the legacy RPC, the transaction fails immediately without
--    cancelling the order or losing wallet refunds.
-- 4. Active Migration:
--    All active clients must use public.cancel_customer_order_v2(UUID) from migration 008.

CREATE OR REPLACE FUNCTION public.cancel_customer_order(
  p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Legacy cancellation RPC deprecated. Refresh the app and try again.'
    USING ERRCODE = '22023';
END;
$$;

-- ============================================================
-- PRIVILEGES & PERMISSIONS
-- ============================================================
REVOKE ALL ON FUNCTION public.cancel_customer_order(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cancel_customer_order(UUID) FROM anon;

GRANT EXECUTE ON FUNCTION public.cancel_customer_order(UUID) TO authenticated;

COMMENT ON FUNCTION public.cancel_customer_order(UUID) IS
  'DEPRECATED: Safe stub that prevents stale clients from cancelling orders without wallet refunds. Use cancel_customer_order_v2.';
