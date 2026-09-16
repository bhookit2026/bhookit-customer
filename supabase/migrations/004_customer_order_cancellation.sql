-- supabase/migrations/004_customer_order_cancellation.sql
-- Secure customer order cancellation RPC
-- Strict security: Atomic status check, ownership enforcement via auth.uid(),
-- allows cancellation only for 'New' or 'Accepted' orders, no direct table UPDATE privileges.

-- ============================================================
-- RPC: public.cancel_customer_order(p_order_id uuid)
-- ============================================================
CREATE OR REPLACE FUNCTION public.cancel_customer_order(
  p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_order_id UUID;
  v_order_code TEXT;
  v_status TEXT;
  v_payment_status TEXT;
  v_current_status TEXT;
BEGIN
  -- 1. Enforce authentication
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  -- 2. Validate input parameter
  IF p_order_id IS NULL THEN
    RAISE EXCEPTION 'Order ID is required' USING ERRCODE = '22023';
  END IF;

  -- 3. Perform atomic conditional cancellation
  -- This single atomic UPDATE checks ownership and status concurrently to prevent race conditions.
  UPDATE public.orders
  SET
    status = 'Cancelled',
    updated_at = now()
  WHERE
    id = p_order_id
    AND user_id = v_user_id
    AND status IN ('New', 'Accepted')
  RETURNING
    id,
    order_code,
    status,
    payment_status
  INTO
    v_order_id,
    v_order_code,
    v_status,
    v_payment_status;

  -- 4. If no row was updated, determine the exact safe cause
  IF NOT FOUND THEN
    -- Check whether the order exists and belongs to this customer
    SELECT status INTO v_current_status
    FROM public.orders
    WHERE
      id = p_order_id
      AND user_id = v_user_id;

    IF NOT FOUND THEN
      -- Either the order does not exist or it belongs to another customer.
      -- Generic error message prevents cross-user enumeration/leakage.
      RAISE EXCEPTION 'Order not found' USING ERRCODE = 'P0002';
    ELSE
      -- Order exists for this customer, but status is no longer cancellable
      -- (e.g. 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', or already 'Cancelled')
      RAISE EXCEPTION 'Order cannot be cancelled. Current status is %', v_current_status USING ERRCODE = '22023';
    END IF;
  END IF;

  -- 5. Return confirmed cancellation result
  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_code', v_order_code,
    'status', v_status,
    'payment_status', v_payment_status
  );
END;
$$;

-- ============================================================
-- PRIVILEGES & PERMISSIONS
-- ============================================================
-- Revoke execution from public and anonymous callers
REVOKE ALL ON FUNCTION public.cancel_customer_order(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cancel_customer_order(UUID) FROM anon;

-- Grant execution strictly to authenticated customers
GRANT EXECUTE ON FUNCTION public.cancel_customer_order(UUID) TO authenticated;

-- Comment for PostgREST / schema introspection
COMMENT ON FUNCTION public.cancel_customer_order(UUID) IS
  'Securely cancels a customer order owned by auth.uid() if status is New or Accepted. Atomic and idempotent.';
