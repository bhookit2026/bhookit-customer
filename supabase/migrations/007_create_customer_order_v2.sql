-- supabase/migrations/007_create_customer_order_v2.sql
-- Atomic Customer Order Placement with Wallet Checkout RPC (v2)
-- Architecture:
-- 1. Atomic Order & Wallet Mutation: Order header, items, wallet validation, debit,
--    and ledger transaction happen within a single PL/pgSQL transaction.
-- 2. Strict Arithmetic Semantics: gross_before_wallet = subtotal + fees + taxes - discount
--    gross_before_wallet = total + wallet_redeemed. Rejects arithmetic discrepancies.
-- 3. Row-Level Wallet Locking: SELECT ... FOR UPDATE on customer_wallets prevents overdrafts.
-- 4. Order & Wallet Idempotency: Retries with same order_code return 'already_processed'
--    without duplicate orders or double-debiting. Mismatched retries fail safely.
-- 5. Limitations Note:
--    This RPC validates internal mathematical consistency and wallet balance, but current
--    menu/catalog pricing is client-supplied and is not yet validated against server-authoritative
--    menu pricing tables.

-- ============================================================
-- RPC: public.create_customer_order_v2
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_customer_order_v2(
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
  v_service_mode TEXT;
  v_payment_method TEXT;
  v_payment_status TEXT;
  v_schedule_mode TEXT;
  v_delivery_address_id UUID;
  v_delivery_address_snapshot JSONB;

  -- Monetary variables
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

  -- Wallet variables
  v_current_wallet_balance NUMERIC(12,2) := 0.00;
  v_wallet_balance_after NUMERIC(12,2) := 0.00;
  v_wallet_idempotency_key TEXT;

  -- Item iteration
  v_item JSONB;
  v_item_name TEXT;
  v_item_qty INTEGER;
  v_item_base_price NUMERIC(12,2);
  v_item_price NUMERIC(12,2);
  v_item_delivery_share NUMERIC(12,2);

  -- Idempotency checking records
  v_existing_order RECORD;
  v_existing_tx RECORD;
BEGIN
  -- 1. Authentication Check
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  -- 2. Input Structure Validation
  IF p_order IS NULL OR jsonb_typeof(p_order) <> 'object' THEN
    RAISE EXCEPTION 'Order payload must be a valid JSON object' USING ERRCODE = '22023';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item' USING ERRCODE = '22023';
  END IF;

  -- Order code is required and cannot be empty
  v_order_code := TRIM(COALESCE(p_order->>'order_code', p_order->>'id', ''));
  IF v_order_code = '' THEN
    RAISE EXCEPTION 'Order code is required' USING ERRCODE = '22023';
  END IF;

  v_payment_method := TRIM(COALESCE(p_order->>'payment_method', p_order->>'payment', ''));
  IF v_payment_method = '' THEN
    RAISE EXCEPTION 'Payment method is required' USING ERRCODE = '22023';
  END IF;

  v_payment_status := TRIM(COALESCE(p_order->>'payment_status', p_order->>'paymentStatus', ''));
  IF v_payment_status = '' THEN
    RAISE EXCEPTION 'Payment status is required' USING ERRCODE = '22023';
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

  -- Calculate Gross Amount & Validate Arithmetic Invariants
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

  -- 4. Payment Semantics Validation
  IF v_total = 0 AND v_wallet_redeemed > 0 THEN
    IF v_payment_method <> 'WALLET' OR v_payment_status <> 'Paid' THEN
      RAISE EXCEPTION 'Full wallet order must specify payment_method = WALLET and payment_status = Paid' USING ERRCODE = '22023';
    END IF;
  ELSIF v_payment_method = 'COD' THEN
    IF v_payment_status <> 'Pending' THEN
      RAISE EXCEPTION 'COD order must have payment_status = Pending' USING ERRCODE = '22023';
    END IF;
  ELSIF v_payment_method IN ('UPI', 'CARD') THEN
    IF v_payment_status <> 'Paid' THEN
      RAISE EXCEPTION 'Online payment order must have payment_status = Paid' USING ERRCODE = '22023';
    END IF;
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

  v_delivery_address_snapshot := COALESCE(
    p_order->'delivery_address_snapshot',
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
    -- A. Verify ownership
    IF v_existing_order.user_id <> v_user_id THEN
      RAISE EXCEPTION 'Order code belongs to another user' USING ERRCODE = '22023';
    END IF;

    -- B. Verify financial & routing semantics
    IF v_existing_order.subtotal <> v_subtotal
       OR v_existing_order.delivery_fee <> v_delivery_fee
       OR v_existing_order.surge_fee <> v_surge_fee
       OR v_existing_order.rider_tip <> v_rider_tip
       OR v_existing_order.taxes <> v_taxes
       OR v_existing_order.discount <> v_discount
       OR v_existing_order.wallet_redeemed <> v_wallet_redeemed
       OR v_existing_order.total <> v_total
       OR v_existing_order.payment_method <> v_payment_method
       OR v_existing_order.payment_status <> v_payment_status
       OR COALESCE(v_existing_order.restaurant_id, '') <> COALESCE(p_order->>'restaurant_id', (p_order->>'restaurantId')::TEXT, '') THEN
      RAISE EXCEPTION 'Idempotency conflict: order_code already used for a different order' USING ERRCODE = '22023';
    END IF;

    -- C. Validate wallet transaction consistency for retry
    IF v_existing_order.wallet_redeemed > 0 THEN
      v_wallet_idempotency_key := 'checkout:' || v_user_id || ':' || v_order_code;

      SELECT *
      INTO v_existing_tx
      FROM public.wallet_transactions
      WHERE idempotency_key = v_wallet_idempotency_key;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Database inconsistency: existing order specifies wallet redemption but ledger transaction is missing' USING ERRCODE = '22023';
      END IF;

      IF v_existing_tx.user_id <> v_user_id
         OR v_existing_tx.order_id <> v_existing_order.id
         OR v_existing_tx.type <> 'debit'
         OR v_existing_tx.transaction_type <> 'checkout_debit'
         OR v_existing_tx.amount <> v_existing_order.wallet_redeemed THEN
        RAISE EXCEPTION 'Database inconsistency: wallet transaction details mismatch existing order' USING ERRCODE = '22023';
      END IF;

      v_wallet_balance_after := v_existing_tx.balance_after;
    ELSE
      -- Read current balance for return payload without mutating
      SELECT balance INTO v_wallet_balance_after
      FROM public.customer_wallets
      WHERE user_id = v_user_id;

      IF v_wallet_balance_after IS NULL THEN
        v_wallet_balance_after := 0.00;
      END IF;
    END IF;

    RETURN jsonb_build_object(
      'status', 'already_processed',
      'order_id', v_existing_order.id,
      'order_code', v_existing_order.order_code,
      'wallet_redeemed', v_existing_order.wallet_redeemed,
      'wallet_balance_after', v_wallet_balance_after
    );
  END IF;

  -- 6. Lock Wallet Row for New Orders with Wallet Redemption
  IF v_wallet_redeemed > 0 THEN
    -- Ensure wallet exists
    INSERT INTO public.customer_wallets (user_id, balance)
    VALUES (v_user_id, 0.00)
    ON CONFLICT (user_id) DO NOTHING;

    -- Exclusive row lock serializes checkouts on the same wallet
    SELECT balance
    INTO v_current_wallet_balance
    FROM public.customer_wallets
    WHERE user_id = v_user_id
    FOR UPDATE;

    IF v_current_wallet_balance IS NULL OR v_current_wallet_balance < v_wallet_redeemed THEN
      RAISE EXCEPTION 'Insufficient wallet balance. Current balance is %, requested redemption is %',
        COALESCE(v_current_wallet_balance, 0.00), v_wallet_redeemed
        USING ERRCODE = '22023';
    END IF;

    v_wallet_balance_after := v_current_wallet_balance - v_wallet_redeemed;
  ELSE
    -- No wallet redemption; fetch current balance for return payload
    SELECT balance INTO v_wallet_balance_after
    FROM public.customer_wallets
    WHERE user_id = v_user_id;

    IF v_wallet_balance_after IS NULL THEN
      v_wallet_balance_after := 0.00;
    END IF;
  END IF;

  -- 7. Insert Order Header with Concurrency Unique Defense
  BEGIN
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
  EXCEPTION
    WHEN unique_violation THEN
      -- Handle concurrent race if another transaction with this order_code committed in parallel
      SELECT *
      INTO v_existing_order
      FROM public.orders
      WHERE order_code = v_order_code;

      IF FOUND THEN
        IF v_existing_order.user_id <> v_user_id THEN
          RAISE EXCEPTION 'Order code belongs to another user' USING ERRCODE = '22023';
        END IF;

        IF v_existing_order.subtotal <> v_subtotal
           OR v_existing_order.total <> v_total
           OR v_existing_order.wallet_redeemed <> v_wallet_redeemed
           OR v_existing_order.payment_method <> v_payment_method THEN
          RAISE EXCEPTION 'Idempotency conflict: order_code already used for a different order' USING ERRCODE = '22023';
        END IF;

        IF v_existing_order.wallet_redeemed > 0 THEN
          SELECT * INTO v_existing_tx
          FROM public.wallet_transactions
          WHERE idempotency_key = 'checkout:' || v_user_id || ':' || v_order_code;

          IF FOUND THEN
            v_wallet_balance_after := v_existing_tx.balance_after;
          END IF;
        END IF;

        RETURN jsonb_build_object(
          'status', 'already_processed',
          'order_id', v_existing_order.id,
          'order_code', v_existing_order.order_code,
          'wallet_redeemed', v_existing_order.wallet_redeemed,
          'wallet_balance_after', v_wallet_balance_after
        );
      ELSE
        RAISE;
      END IF;
  END;

  -- 8. Insert Order Items
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

    v_item_base_price     := COALESCE((v_item->>'base_price')::NUMERIC, (v_item->>'basePrice')::NUMERIC, 0.00);
    v_item_price          := COALESCE((v_item->>'price')::NUMERIC, 0.00);
    v_item_delivery_share := COALESCE((v_item->>'delivery_share')::NUMERIC, (v_item->>'deliveryShare')::NUMERIC, 0.00);

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

  -- 9. Debit Customer Wallet & Record Ledger Transaction
  IF v_wallet_redeemed > 0 THEN
    v_wallet_idempotency_key := 'checkout:' || v_user_id || ':' || v_order_code;

    -- Append-only ledger record
    INSERT INTO public.wallet_transactions (
      user_id,
      order_id,
      type,
      amount,
      balance_after,
      transaction_type,
      description,
      idempotency_key,
      created_at
    ) VALUES (
      v_user_id,
      v_order_id,
      'debit',
      v_wallet_redeemed,
      v_wallet_balance_after,
      'checkout_debit',
      '🛍️ Order #' || v_order_code || ' Payment',
      v_wallet_idempotency_key,
      now()
    );

    -- Update balance on customer_wallets
    UPDATE public.customer_wallets
    SET
      balance = v_wallet_balance_after,
      updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  -- 10. Return Result
  RETURN jsonb_build_object(
    'status', 'success',
    'order_id', v_order_id,
    'order_code', v_order_code,
    'wallet_redeemed', v_wallet_redeemed,
    'wallet_balance_after', v_wallet_balance_after
  );
END;
$$;

-- ============================================================
-- PRIVILEGES & PERMISSIONS (AUTHENTICATED CUSTOMER ONLY)
-- ============================================================
REVOKE ALL ON FUNCTION public.create_customer_order_v2(JSONB, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_customer_order_v2(JSONB, JSONB) FROM anon;

GRANT EXECUTE ON FUNCTION public.create_customer_order_v2(JSONB, JSONB) TO authenticated;

COMMENT ON FUNCTION public.create_customer_order_v2(JSONB, JSONB) IS
  'Atomic order placement and wallet checkout RPC (v2). Validates arithmetic, locks customer wallet, inserts order and order items, debits wallet balance, and writes to wallet ledger within a single ACID transaction.';
