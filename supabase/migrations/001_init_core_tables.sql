-- supabase/migrations/001_init_core_tables.sql
-- Core tables: profiles, restaurants, restaurant_users
-- Security model: no browser privilege escalation, no RLS recursion, server-only role assignment

-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'rider', 'admin')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================
-- restaurants
-- ============================================================
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  address JSONB,
  zone_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  commission_pct NUMERIC(5,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_restaurants_zone ON restaurants(zone_id);
CREATE INDEX idx_restaurants_status ON restaurants(status);

-- ============================================================
-- restaurant_users
-- ============================================================
CREATE TABLE restaurant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (restaurant_id, user_id)
);

CREATE INDEX idx_restaurant_users_user ON restaurant_users(user_id);

-- ============================================================
-- Updated_at trigger function (shared) - DEFINED BEFORE TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Updated_at triggers (all reference the same function)
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER restaurant_users_updated_at
  BEFORE UPDATE ON restaurant_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Auth trigger: auto-create profile on signup (role = 'customer')
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SECURITY DEFINER helpers for RLS (no recursion)
-- ============================================================

-- is_admin(): checks if current user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid();
$$;

-- is_restaurant_owner(restaurant_id): checks if current user owns the restaurant
CREATE OR REPLACE FUNCTION public.is_restaurant_owner(p_restaurant_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT owner_id = auth.uid() FROM public.restaurants WHERE id = p_restaurant_id;
$$;

-- is_restaurant_participant(restaurant_id): checks if current user is a member of restaurant team
CREATE OR REPLACE FUNCTION public.is_restaurant_participant(p_restaurant_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurant_users
    WHERE restaurant_id = p_restaurant_id AND user_id = auth.uid()
  );
$$;

-- ============================================================
-- RPC: update own profile (restricted columns only)
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_own_profile(
  p_full_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.profiles
  SET
    full_name = COALESCE(p_full_name, full_name),
    phone = COALESCE(p_phone, phone),
    avatar_url = COALESCE(p_avatar_url, avatar_url),
    updated_at = now()
  WHERE id = auth.uid();
END;
$$;

-- ============================================================
-- RPC: assign user role (service_role only)
-- ============================================================
CREATE OR REPLACE FUNCTION public.assign_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_new_role NOT IN ('vendor', 'rider', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', p_new_role;
  END IF;

  UPDATE public.profiles
  SET role = p_new_role, updated_at = now()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', p_user_id;
  END IF;
END;
$$;

-- ============================================================
-- RPC: create restaurant (service_role / admin only)
-- Creates restaurant + owner membership atomically
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_restaurant(
  p_owner_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_address JSONB DEFAULT NULL,
  p_zone_id UUID DEFAULT NULL,
  p_commission_pct NUMERIC(5,2) DEFAULT 10.00
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_restaurant_id UUID;
BEGIN
  -- Verify owner exists and has vendor role (or admin creating on behalf)
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_owner_id AND role IN ('vendor', 'admin')) THEN
    RAISE EXCEPTION 'Owner must have vendor or admin role';
  END IF;

  INSERT INTO public.restaurants (name, slug, owner_id, address, zone_id, commission_pct, status)
  VALUES (p_name, p_slug, p_owner_id, p_address, p_zone_id, p_commission_pct, 'pending')
  RETURNING id INTO v_restaurant_id;

  -- Create owner membership
  INSERT INTO public.restaurant_users (restaurant_id, user_id, role)
  VALUES (v_restaurant_id, p_owner_id, 'owner');

  RETURN v_restaurant_id;
END;
$$;

-- ============================================================
-- RPC: update restaurant editable fields (owner only)
-- Does NOT allow modifying owner_id, status, commission_pct
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_restaurant_details(
  p_restaurant_id UUID,
  p_name TEXT DEFAULT NULL,
  p_address JSONB DEFAULT NULL
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.restaurants
  SET
    name = COALESCE(p_name, name),
    address = COALESCE(p_address, address),
    updated_at = now()
  WHERE id = p_restaurant_id
    AND owner_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant not found or not owner';
  END IF;
END;
$$;

-- ============================================================
-- RPC: manage restaurant team (owner only)
-- ============================================================
CREATE OR REPLACE FUNCTION public.add_restaurant_user(
  p_restaurant_id UUID,
  p_user_id UUID,
  p_role TEXT
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_role NOT IN ('owner', 'manager', 'staff') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.restaurants WHERE id = p_restaurant_id AND owner_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not restaurant owner';
  END IF;

  -- Prevent owner from changing their own role via this function
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot modify own role via add_restaurant_user';
  END IF;

  INSERT INTO public.restaurant_users (restaurant_id, user_id, role)
  VALUES (p_restaurant_id, p_user_id, p_role)
  ON CONFLICT (restaurant_id, user_id) DO UPDATE SET role = p_role;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_restaurant_user(
  p_restaurant_id UUID,
  p_user_id UUID
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.restaurants WHERE id = p_restaurant_id AND owner_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not restaurant owner';
  END IF;

  -- Prevent owner from removing themselves
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove self from restaurant';
  END IF;

  DELETE FROM public.restaurant_users
  WHERE restaurant_id = p_restaurant_id AND user_id = p_user_id;
END;
$$;

-- ============================================================
-- RLS Policies
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users read own profile
CREATE POLICY profiles_select_own ON profiles FOR SELECT
  USING (id = auth.uid());

-- Admins read all (via helper, no recursion)
CREATE POLICY profiles_select_admin ON profiles FOR SELECT
  USING (public.is_admin());

-- NO direct INSERT/UPDATE/DELETE policies
-- Insert: only via handle_new_user() trigger
-- Update: only via update_own_profile() RPC
-- Delete: CASCADE from auth.users

-- restaurants
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Owner/participants read own restaurant
CREATE POLICY restaurants_select_participant ON restaurants FOR SELECT
  USING (
    public.is_restaurant_owner(id) OR public.is_restaurant_participant(id)
  );

-- Customers read approved restaurants
CREATE POLICY restaurants_select_approved ON restaurants FOR SELECT
  USING (status = 'approved');

-- NO direct INSERT policy (use create_restaurant RPC)
-- NO direct UPDATE policy (use update_restaurant_details RPC)
-- NO direct DELETE policy

-- restaurant_users
ALTER TABLE restaurant_users ENABLE ROW LEVEL SECURITY;

-- Participants read their own memberships
CREATE POLICY restaurant_users_select_own ON restaurant_users FOR SELECT
  USING (user_id = auth.uid());

-- Owner manages team (explicit policies, no FOR ALL)
CREATE POLICY restaurant_users_select_owner ON restaurant_users FOR SELECT
  USING (public.is_restaurant_owner(restaurant_id));

CREATE POLICY restaurant_users_insert_owner ON restaurant_users FOR INSERT
  WITH CHECK (public.is_restaurant_owner(restaurant_id));

CREATE POLICY restaurant_users_update_owner ON restaurant_users FOR UPDATE
  USING (public.is_restaurant_owner(restaurant_id))
  WITH CHECK (public.is_restaurant_owner(restaurant_id));

CREATE POLICY restaurant_users_delete_owner ON restaurant_users FOR DELETE
  USING (public.is_restaurant_owner(restaurant_id));

-- ============================================================
-- GRANTS
-- ============================================================

-- Helper functions: authenticated users can call is_* helpers
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_restaurant_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_restaurant_participant(UUID) TO authenticated;

-- Profile update RPC: authenticated users
GRANT EXECUTE ON FUNCTION public.update_own_profile(TEXT, TEXT, TEXT) TO authenticated;

-- Restaurant detail update: authenticated (owner checked in function)
GRANT EXECUTE ON FUNCTION public.update_restaurant_details(UUID, TEXT, JSONB) TO authenticated;

-- Restaurant team management: authenticated (owner checked in function)
GRANT EXECUTE ON FUNCTION public.add_restaurant_user(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_restaurant_user(UUID, UUID) TO authenticated;

-- Privileged RPCs: service_role ONLY (REVOKE from PUBLIC first)
REVOKE ALL ON FUNCTION public.assign_user_role(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, TEXT) TO service_role;

REVOKE ALL ON FUNCTION public.create_restaurant(UUID, TEXT, TEXT, JSONB, UUID, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_restaurant(UUID, TEXT, TEXT, JSONB, UUID, NUMERIC) TO service_role;