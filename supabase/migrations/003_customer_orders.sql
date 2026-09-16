-- supabase/migrations/003_customer_orders.sql
-- Customer Orders & Order Items Schema with Immutable Delivery Address Snapshot
-- Strict security: Authenticated customer SELECT only; all mutations via atomic SECURITY DEFINER RPC.

-- ============================================================
-- TABLE 1: orders
-- ============================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  invoice_no TEXT,

  restaurant_id TEXT,
  restaurant_name TEXT,

  is_multi_vendor_hub BOOLEAN NOT NULL DEFAULT false,
  vendor_names JSONB NOT NULL DEFAULT '[]'::jsonb,

  allergies JSONB NOT NULL DEFAULT '[]'::jsonb,
  chef_notes TEXT,

  service_mode TEXT NOT NULL DEFAULT 'delivery',
  table_number TEXT,

  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,

  delivery_address_id UUID,
  delivery_address_snapshot JSONB,

  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee_hidden BOOLEAN NOT NULL DEFAULT false,
  delivery_fee_included NUMERIC(12,2) NOT NULL DEFAULT 0,
  surge_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  rider_tip NUMERIC(12,2) NOT NULL DEFAULT 0,
  taxes NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  coupon_code TEXT,
  wallet_redeemed NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,

  status TEXT NOT NULL DEFAULT 'New',

  delivery_otp TEXT,
  delivery_boy TEXT,
  rider_phone TEXT,

  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  transaction_id TEXT,

  eta_minutes INTEGER,
  delivery_progress INTEGER NOT NULL DEFAULT 0,

  schedule_mode TEXT NOT NULL DEFAULT 'now',
  scheduled_slot JSONB,

  chat_history JSONB NOT NULL DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- CHECK constraints
  CONSTRAINT orders_subtotal_check CHECK (subtotal >= 0),
  CONSTRAINT orders_delivery_fee_check CHECK (delivery_fee >= 0),
  CONSTRAINT orders_delivery_fee_included_check CHECK (delivery_fee_included >= 0),
  CONSTRAINT orders_surge_fee_check CHECK (surge_fee >= 0),
  CONSTRAINT orders_rider_tip_check CHECK (rider_tip >= 0),
  CONSTRAINT orders_taxes_check CHECK (taxes >= 0),
  CONSTRAINT orders_discount_check CHECK (discount >= 0),
  CONSTRAINT orders_wallet_redeemed_check CHECK (wallet_redeemed >= 0),
  CONSTRAINT orders_total_check CHECK (total >= 0),
  CONSTRAINT orders_delivery_progress_check CHECK (delivery_progress >= 0 AND delivery_progress <= 100),
  CONSTRAINT orders_service_mode_check CHECK (service_mode IN ('delivery', 'dinein', 'takeaway')),
  CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
  CONSTRAINT orders_schedule_mode_check CHECK (schedule_mode IN ('now', 'later'))
);

-- ============================================================
-- TABLE 2: order_items
-- ============================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  restaurant_id TEXT,
  restaurant_name TEXT,

  food_id TEXT,
  name TEXT NOT NULL,

  base_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  qty INTEGER NOT NULL DEFAULT 1,

  addons JSONB NOT NULL DEFAULT '[]'::jsonb,
  allergies JSONB NOT NULL DEFAULT '[]'::jsonb,
  chef_notes TEXT,

  delivery_share NUMERIC(12,2) NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- CHECK constraints
  CONSTRAINT order_items_qty_check CHECK (qty > 0),
  CONSTRAINT order_items_base_price_check CHECK (base_price >= 0),
  CONSTRAINT order_items_price_check CHECK (price >= 0),
  CONSTRAINT order_items_delivery_share_check CHECK (delivery_share >= 0)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_orders_user_id_created_at ON public.orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_restaurant_id ON public.order_items(restaurant_id);
-- Note: order_code already has a unique index automatically created by UNIQUE constraint.

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
-- Reuses public.handle_updated_at() from 001_init_core_tables.sql
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Customers can view only their own orders
CREATE POLICY orders_select_own
  ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Customers can view only order items belonging to their own orders
CREATE POLICY order_items_select_own
  ON public.order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_items.order_id
        AND public.orders.user_id = auth.uid()
    )
  );

-- Note: No direct customer INSERT, UPDATE, or DELETE policies exist.
-- Direct table mutations by authenticated browsers are disallowed.

-- ============================================================
-- SECURE ATOMIC ORDER CREATION RPC
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_customer_order(
  p_order JSONB,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_order_id UUID := gen_random_uuid();
  v_order_code TEXT;
  v_item JSONB;
  v_item_name TEXT;
  v_item_qty INTEGER;
  v_item_base_price NUMERIC;
  v_item_price NUMERIC;
  v_item_delivery_share NUMERIC;

  v_subtotal NUMERIC(12,2);
  v_delivery_fee NUMERIC(12,2);
  v_delivery_fee_included NUMERIC(12,2);
  v_surge_fee NUMERIC(12,2);
  v_rider_tip NUMERIC(12,2);
  v_taxes NUMERIC(12,2);
  v_discount NUMERIC(12,2);
  v_wallet_redeemed NUMERIC(12,2);
  v_total NUMERIC(12,2);
  v_service_mode TEXT;
  v_payment_method TEXT;
  v_payment_status TEXT;
  v_schedule_mode TEXT;
  v_delivery_address_id UUID;
  v_delivery_address_snapshot JSONB;
BEGIN
  -- 1. Security check: Reject unauthenticated calls
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  -- 2. Validate items array
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item' USING ERRCODE = '22023';
  END IF;

  -- 3. Resolve order code (preserve client code like FB-XXXXX or generate internally)
  v_order_code := COALESCE(
    NULLIF(TRIM(p_order->>'order_code'), ''),
    NULLIF(TRIM(p_order->>'id'), ''),
    'FB-' || floor(10000 + random() * 90000)::TEXT
  );

  -- 4. Parse & validate numeric monetary values
  v_subtotal              := COALESCE((p_order->>'subtotal')::NUMERIC, 0);
  v_delivery_fee          := COALESCE((p_order->>'delivery_fee')::NUMERIC, (p_order->>'deliveryFee')::NUMERIC, 0);
  v_delivery_fee_included := COALESCE((p_order->>'delivery_fee_included')::NUMERIC, (p_order->>'deliveryFeeIncluded')::NUMERIC, 0);
  v_surge_fee             := COALESCE((p_order->>'surge_fee')::NUMERIC, (p_order->>'surgeFee')::NUMERIC, 0);
  v_rider_tip             := COALESCE((p_order->>'rider_tip')::NUMERIC, (p_order->>'riderTip')::NUMERIC, 0);
  v_taxes                 := COALESCE((p_order->>'taxes')::NUMERIC, 0);
  v_discount              := COALESCE((p_order->>'discount')::NUMERIC, 0);
  v_wallet_redeemed       := COALESCE((p_order->>'wallet_redeemed')::NUMERIC, (p_order->>'walletRedeemed')::NUMERIC, 0);
  v_total                 := COALESCE((p_order->>'total')::NUMERIC, 0);

  IF v_subtotal < 0 OR v_delivery_fee < 0 OR v_surge_fee < 0 OR v_rider_tip < 0 OR
     v_taxes < 0 OR v_discount < 0 OR v_wallet_redeemed < 0 OR v_total < 0 THEN
    RAISE EXCEPTION 'Monetary order amounts cannot be negative' USING ERRCODE = '22023';
  END IF;

  v_service_mode := COALESCE(NULLIF(TRIM(p_order->>'service_mode'), ''), NULLIF(TRIM(p_order->>'serviceMode'), ''), 'delivery');
  IF v_service_mode NOT IN ('delivery', 'dinein', 'takeaway') THEN
    v_service_mode := 'delivery';
  END IF;

  v_payment_method := COALESCE(NULLIF(TRIM(p_order->>'payment_method'), ''), NULLIF(TRIM(p_order->>'payment'), ''), 'COD');
  v_payment_status := COALESCE(NULLIF(TRIM(p_order->>'payment_status'), ''), NULLIF(TRIM(p_order->>'paymentStatus'), ''), 'Pending');
  IF v_payment_status NOT IN ('Pending', 'Paid', 'Failed', 'Refunded') THEN
    v_payment_status := 'Pending';
  END IF;

  v_schedule_mode := COALESCE(NULLIF(TRIM(p_order->>'schedule_mode'), ''), NULLIF(TRIM(p_order->>'scheduleMode'), ''), 'now');
  IF v_schedule_mode NOT IN ('now', 'later') THEN
    v_schedule_mode := 'now';
  END IF;

  -- Safe UUID parsing for delivery_address_id
  BEGIN
    v_delivery_address_id := NULLIF(TRIM(COALESCE(
      p_order->>'delivery_address_id',
      p_order->'customer'->>'deliveryAddressId',
      p_order->>'deliveryAddressId'
    )), '')::UUID;
  EXCEPTION WHEN OTHERS THEN
    v_delivery_address_id := NULL;
  END;

  -- Preserve immutable address snapshot exactly as supplied
  v_delivery_address_snapshot := COALESCE(
    p_order->'delivery_address_snapshot',
    p_order->'customer'->'deliveryAddress',
    p_order->'deliveryAddress',
    'null'::jsonb
  );

  -- 5. Insert order header (user_id ALWAYS forced to auth.uid())
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
    COALESCE(p_order->>'status', 'New'),
    COALESCE(p_order->>'delivery_otp', p_order->>'deliveryOtp', floor(1000 + random() * 9000)::TEXT),
    COALESCE(p_order->>'delivery_boy', p_order->>'deliveryBoy'),
    COALESCE(p_order->>'rider_phone', p_order->>'riderPhone'),
    v_payment_method,
    v_payment_status,
    COALESCE(p_order->>'transaction_id', p_order->>'transactionId'),
    COALESCE((p_order->>'eta_minutes')::INTEGER, (p_order->>'etaMinutes')::INTEGER, 30),
    COALESCE((p_order->>'delivery_progress')::INTEGER, (p_order->>'deliveryProgress')::INTEGER, 15),
    v_schedule_mode,
    COALESCE(p_order->'scheduled_slot', p_order->'scheduledSlot'),
    COALESCE(p_order->'chat_history', p_order->'chatHistory', '[]'::jsonb),
    now(),
    now()
  );

  -- 6. Insert order items atomically
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_item_name := TRIM(COALESCE(v_item->>'name', ''));
    IF v_item_name = '' THEN
      RAISE EXCEPTION 'Item name is required' USING ERRCODE = '22023';
    END IF;

    v_item_qty := COALESCE((v_item->>'qty')::INTEGER, 1);
    IF v_item_qty <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be greater than zero' USING ERRCODE = '22023';
    END IF;

    v_item_base_price     := COALESCE((v_item->>'base_price')::NUMERIC, (v_item->>'basePrice')::NUMERIC, 0);
    v_item_price          := COALESCE((v_item->>'price')::NUMERIC, 0);
    v_item_delivery_share := COALESCE((v_item->>'delivery_share')::NUMERIC, (v_item->>'deliveryShare')::NUMERIC, 0);

    IF v_item_base_price < 0 OR v_item_price < 0 OR v_item_delivery_share < 0 THEN
      RAISE EXCEPTION 'Item price amounts cannot be negative' USING ERRCODE = '22023';
    END IF;

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
      delivery_share,
      created_at
    ) VALUES (
      v_order_id,
      COALESCE(v_item->>'restaurant_id', (v_item->>'restaurantId')::TEXT),
      COALESCE(v_item->>'restaurant_name', v_item->>'restaurantName'),
      COALESCE(v_item->>'food_id', (v_item->>'foodId')::TEXT),
      v_item_name,
      v_item_base_price,
      v_item_price,
      v_item_qty,
      COALESCE(v_item->'addons', '[]'::jsonb),
      COALESCE(v_item->'allergies', '[]'::jsonb),
      COALESCE(v_item->>'chef_notes', v_item->>'chefNotes'),
      v_item_delivery_share,
      now()
    );
  END LOOP;

  -- 7. Return database UUID and order code
  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_code', v_order_code
  );
END;
$$;

-- ============================================================
-- PRIVILEGES & PERMISSIONS
-- ============================================================
-- Revoke default public execution
REVOKE ALL ON FUNCTION public.create_customer_order(JSONB, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_customer_order(JSONB, JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_customer_order(JSONB, JSONB) TO authenticated;

-- Direct table access permissions: SELECT only for authenticated users
REVOKE ALL ON TABLE public.orders FROM anon, authenticated;
REVOKE ALL ON TABLE public.order_items FROM anon, authenticated;
GRANT SELECT ON TABLE public.orders TO authenticated;
GRANT SELECT ON TABLE public.order_items TO authenticated;
