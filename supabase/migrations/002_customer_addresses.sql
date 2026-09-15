CREATE TABLE public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  full_name TEXT,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX customer_addresses_user_id_idx
  ON public.customer_addresses (user_id);

CREATE INDEX customer_addresses_user_id_is_default_idx
  ON public.customer_addresses (user_id, is_default);

CREATE TRIGGER customer_addresses_updated_at
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_addresses_select_own
  ON public.customer_addresses
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY customer_addresses_insert_own
  ON public.customer_addresses
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY customer_addresses_update_own
  ON public.customer_addresses
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY customer_addresses_delete_own
  ON public.customer_addresses
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE UNIQUE INDEX customer_addresses_one_default_per_user_idx
  ON public.customer_addresses (user_id)
  WHERE is_default;

CREATE FUNCTION public.add_customer_address(
  p_label TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_address_line1 TEXT,
  p_address_line2 TEXT,
  p_landmark TEXT,
  p_city TEXT,
  p_state TEXT,
  p_postal_code TEXT,
  p_latitude NUMERIC,
  p_longitude NUMERIC,
  p_is_default BOOLEAN
)
RETURNS public.customer_addresses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_is_default BOOLEAN := COALESCE(p_is_default, false);
  v_address public.customer_addresses%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::TEXT), 0);

  IF NOT EXISTS (
    SELECT 1
    FROM public.customer_addresses
    WHERE user_id = v_user_id
  ) THEN
    v_is_default := true;
  ELSIF v_is_default THEN
    UPDATE public.customer_addresses
    SET is_default = false
    WHERE user_id = v_user_id
      AND is_default = true;
  END IF;

  INSERT INTO public.customer_addresses (
    user_id,
    label,
    full_name,
    phone,
    address_line1,
    address_line2,
    landmark,
    city,
    state,
    postal_code,
    latitude,
    longitude,
    is_default
  )
  VALUES (
    v_user_id,
    p_label,
    p_full_name,
    p_phone,
    p_address_line1,
    p_address_line2,
    p_landmark,
    p_city,
    p_state,
    p_postal_code,
    p_latitude,
    p_longitude,
    v_is_default
  )
  RETURNING * INTO v_address;

  RETURN v_address;
END;
$$;

CREATE FUNCTION public.update_customer_address(
  p_address_id UUID,
  p_label TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_address_line1 TEXT,
  p_address_line2 TEXT,
  p_landmark TEXT,
  p_city TEXT,
  p_state TEXT,
  p_postal_code TEXT,
  p_latitude NUMERIC,
  p_longitude NUMERIC,
  p_is_default BOOLEAN
)
RETURNS public.customer_addresses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_is_default BOOLEAN := COALESCE(p_is_default, false);
  v_address public.customer_addresses%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::TEXT), 0);

  SELECT *
  INTO v_address
  FROM public.customer_addresses
  WHERE id = p_address_id
    AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Address not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_is_default THEN
    UPDATE public.customer_addresses
    SET is_default = false
    WHERE user_id = v_user_id
      AND is_default = true
      AND id <> p_address_id;
  END IF;

  UPDATE public.customer_addresses
  SET
    label = p_label,
    full_name = p_full_name,
    phone = p_phone,
    address_line1 = p_address_line1,
    address_line2 = p_address_line2,
    landmark = p_landmark,
    city = p_city,
    state = p_state,
    postal_code = p_postal_code,
    latitude = p_latitude,
    longitude = p_longitude,
    is_default = v_is_default
  WHERE id = p_address_id
    AND user_id = v_user_id
  RETURNING * INTO v_address;

  RETURN v_address;
END;
$$;

CREATE FUNCTION public.delete_customer_address(p_address_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_was_default BOOLEAN;
  v_replacement_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::TEXT), 0);

  DELETE FROM public.customer_addresses
  WHERE id = p_address_id
    AND user_id = v_user_id
  RETURNING is_default INTO v_was_default;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Address not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_was_default THEN
    SELECT id
    INTO v_replacement_id
    FROM public.customer_addresses
    WHERE user_id = v_user_id
    ORDER BY updated_at DESC, created_at DESC, id ASC
    LIMIT 1
    FOR UPDATE;

    IF FOUND THEN
      UPDATE public.customer_addresses
      SET is_default = true
      WHERE id = v_replacement_id
        AND user_id = v_user_id;
    END IF;
  END IF;

  RETURN true;
END;
$$;

CREATE FUNCTION public.set_default_customer_address(p_address_id UUID)
RETURNS public.customer_addresses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_address public.customer_addresses%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::TEXT), 0);

  SELECT *
  INTO v_address
  FROM public.customer_addresses
  WHERE id = p_address_id
    AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Address not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.customer_addresses
  SET is_default = false
  WHERE user_id = v_user_id
    AND is_default = true;

  UPDATE public.customer_addresses
  SET is_default = true
  WHERE id = p_address_id
    AND user_id = v_user_id
  RETURNING * INTO v_address;

  RETURN v_address;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.add_customer_address(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, BOOLEAN
) FROM PUBLIC, anon, service_role;

REVOKE EXECUTE ON FUNCTION public.update_customer_address(
  UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, BOOLEAN
) FROM PUBLIC, anon, service_role;

REVOKE EXECUTE ON FUNCTION public.delete_customer_address(UUID)
FROM PUBLIC, anon, service_role;

REVOKE EXECUTE ON FUNCTION public.set_default_customer_address(UUID)
FROM PUBLIC, anon, service_role;

GRANT EXECUTE ON FUNCTION public.add_customer_address(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, BOOLEAN
) TO authenticated;

GRANT EXECUTE ON FUNCTION public.update_customer_address(
  UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, BOOLEAN
) TO authenticated;

GRANT EXECUTE ON FUNCTION public.delete_customer_address(UUID)
TO authenticated;

GRANT EXECUTE ON FUNCTION public.set_default_customer_address(UUID)
TO authenticated;

