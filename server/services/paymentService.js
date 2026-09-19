/**
 * server/services/paymentService.js
 * Secure Server-Side Payment & Gateway Service Foundation
 *
 * Strictly server-only. NEVER import into client-side bundles or browser scripts.
 * Uses native Node.js fetch (Node 18+) and crypto. Zero third-party npm dependencies.
 */

const crypto = require('crypto');

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

/**
 * Validates and retrieves required server-side environment variables.
 * Never prints or leaks secret contents.
 */
function getRequiredEnv(name) {
  const val = process.env[name];
  if (!val || typeof val !== 'string' || val.trim() === '') {
    const err = new Error(`Server configuration error: missing required environment variable [${name}]`);
    err.code = 'CONFIG_MISSING';
    err.envVar = name;
    throw err;
  }
  return val.trim();
}

/**
 * Extracts Bearer token from incoming request headers.
 */
function extractBearerToken(headers) {
  if (!headers) return null;
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

/**
 * Authenticates a customer's Supabase access token with Supabase Auth API.
 * Returns authoritative user object { id, email, ... } or error.
 * Does NOT trust client-supplied user_id.
 */
async function validateCustomerAccessToken(token) {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return { user: null, error: 'Missing or empty authorization token' };
  }

  try {
    const supabaseUrl = normalizeSupabaseBaseUrl(getRequiredEnv('SUPABASE_URL'));
    const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'apikey': serviceRoleKey
      }
    });

    if (!res.ok) {
      return { user: null, error: 'Invalid or expired customer session' };
    }

    const userData = await res.json();
    if (!userData || !userData.id) {
      return { user: null, error: 'Invalid user response from authentication provider' };
    }

    return { user: userData, error: null };
  } catch (err) {
    return { user: null, error: err.message || 'Authentication service unreachable' };
  }
}

/**
 * Normalizes Supabase project base URL:
 * - Trims whitespace and surrounding quotes
 * - Strips trailing slashes
 * - Strips trailing '/rest/v1' or '/rest/v1/' if present in environment variable
 * Ensures a clean canonical project base URL (e.g. 'https://example.supabase.co').
 */
function normalizeSupabaseBaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let cleaned = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  cleaned = cleaned.replace(/\/+$/, '');
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  return cleaned.replace(/\/+$/, '');
}

/**
 * Builds canonical Supabase endpoint URL:
 * - If endpointPath is already a full http(s) URL, returns as-is
 * - Combines normalized base URL with normalized leading-slash path
 */
function buildSupabaseUrl(rawBaseUrl, endpointPath) {
  if (!endpointPath || typeof endpointPath !== 'string') return '';
  if (endpointPath.startsWith('http://') || endpointPath.startsWith('https://')) {
    return endpointPath;
  }
  const base = normalizeSupabaseBaseUrl(rawBaseUrl);
  const normalizedPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  return `${base}${normalizedPath}`;
}

/**
 * Server-only fetch wrapper for Supabase PostgREST / RPC endpoints
 * using authoritative SUPABASE_SERVICE_ROLE_KEY.
 * Never logs credentials or authorization headers.
 */
async function supabaseServiceFetch(endpointPath, options = {}) {
  const rawSupabaseUrl = getRequiredEnv('SUPABASE_URL');
  const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  const targetUrl = buildSupabaseUrl(rawSupabaseUrl, endpointPath);

  const requestHeaders = {
    'Content-Type': 'application/json',
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    ...(options.headers || {})
  };

  const response = await fetch(targetUrl, {
    ...options,
    headers: requestHeaders
  });

  const rawText = await response.text();
  let parsedData = null;
  try {
    parsedData = rawText ? JSON.parse(rawText) : null;
  } catch (e) {
    parsedData = rawText;
  }

  if (!response.ok) {
    const errMessage = parsedData?.message || parsedData?.error_description || parsedData?.error || `Supabase error (${response.status})`;
    const err = new Error(errMessage);
    err.status = response.status;
    err.code = parsedData?.code || 'SUPABASE_ERROR';
    err.details = parsedData?.details || null;
    throw err;
  }

  return parsedData;
}

/**
 * Server-only fetch wrapper for Razorpay REST API endpoints.
 * Uses HTTP Basic Authentication with RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET.
 * Never logs or exposes the secret key.
 */
async function razorpayFetch(endpointPath, options = {}) {
  const keyId = getRequiredEnv('RAZORPAY_KEY_ID');
  const keySecret = getRequiredEnv('RAZORPAY_KEY_SECRET');

  const normalizedPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  const targetUrl = endpointPath.startsWith('http') ? endpointPath : `${RAZORPAY_API_BASE}${normalizedPath}`;

  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const requestHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${basicAuth}`,
    ...(options.headers || {})
  };

  const response = await fetch(targetUrl, {
    ...options,
    headers: requestHeaders
  });

  const rawText = await response.text();
  let parsedData = null;
  try {
    parsedData = rawText ? JSON.parse(rawText) : null;
  } catch (e) {
    parsedData = rawText;
  }

  if (!response.ok) {
    const rzpError = parsedData?.error;
    const safeMsg = rzpError?.description || rzpError?.code || `Razorpay API error (${response.status})`;
    const err = new Error(safeMsg);
    err.status = response.status;
    err.code = rzpError?.code || 'GATEWAY_ERROR';
    err.reason = rzpError?.reason || null;
    throw err;
  }

  return parsedData;
}

/**
 * Timing-safe buffer comparison.
 * Strictly verifies buffer lengths before comparison to prevent timing leaks or exceptions.
 */
function safeTimingCompare(strA, strB) {
  if (typeof strA !== 'string' || typeof strB !== 'string') {
    return false;
  }
  const bufA = Buffer.from(strA, 'utf8');
  const bufB = Buffer.from(strB, 'utf8');
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Cryptographically verifies Razorpay Checkout Payment Signature.
 * Formula: HMAC_SHA256(gateway_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)
 * Uses the authoritative server-stored gateway_order_id.
 */
function verifyPaymentSignature({ gatewayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (!gatewayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }
  const keySecret = getRequiredEnv('RAZORPAY_KEY_SECRET');
  const payload = `${gatewayOrderId.trim()}|${razorpayPaymentId.trim()}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  return safeTimingCompare(expectedSignature, razorpaySignature.trim());
}

/**
 * Cryptographically verifies incoming Razorpay Webhook Signature.
 * Formula: HMAC_SHA256(rawRequestBody, RAZORPAY_WEBHOOK_SECRET)
 * rawBody must be the exact raw string or Buffer received from the network.
 */
function verifyWebhookSignature({ rawBody, signatureHeader }) {
  if (!rawBody || !signatureHeader) {
    return false;
  }
  const webhookSecret = getRequiredEnv('RAZORPAY_WEBHOOK_SECRET');
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'))
    .digest('hex');

  return safeTimingCompare(expectedSignature, signatureHeader.trim());
}

/**
 * Sanitizes errors for public response.
 * Strips secrets, keys, or stack traces that could expose backend infrastructure.
 */
function sanitizePublicError(err) {
  const status = err.status || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'An unexpected error occurred during payment processing.';

  // Mask internal configuration/database error details
  if (code === 'CONFIG_MISSING') {
    message = 'Payment system configuration error. Please contact support.';
  } else if (status >= 500) {
    message = 'Payment service temporarily unavailable. Please try again later.';
  }

  return {
    status,
    response: {
      success: false,
      error: message,
      code
    }
  };
}

/**
 * Creates or reuses a Razorpay payment order for an authenticated customer's Parcelkar order.
 * Strictly verifies identity, order ownership, order state, and active payment attempts.
 *
 * @param {Object} params
 * @param {Object} params.headers - Incoming HTTP headers (containing Authorization Bearer)
 * @param {Object} params.body - Incoming request body { order_id }
 * @returns {Promise<{ status: number, response: Object }>}
 */
async function createPaymentOrder({ headers, body }) {
  try {
    // 1. Authenticate Customer via Bearer token
    const token = extractBearerToken(headers);
    if (!token) {
      return {
        status: 401,
        response: {
          success: false,
          code: 'UNAUTHORIZED',
          error: 'Authentication required'
        }
      };
    }

    const { user, error: authError } = await validateCustomerAccessToken(token);
    if (authError || !user || !user.id) {
      return {
        status: 401,
        response: {
          success: false,
          code: 'UNAUTHORIZED',
          error: 'Invalid or expired customer session'
        }
      };
    }
    const customerUserId = user.id;

    // 2. Validate Input Body: ONLY order_id accepted
    const orderId = body?.order_id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!orderId || typeof orderId !== 'string' || !uuidRegex.test(orderId.trim())) {
      return {
        status: 400,
        response: {
          success: false,
          code: 'INVALID_ORDER_ID',
          error: 'A valid order_id UUID is required'
        }
      };
    }
    const sanitizedOrderId = orderId.trim();

    // 3. Fetch Authoritative Parcelkar Order from Supabase
    const orderRows = await supabaseServiceFetch(
      `/rest/v1/orders?id=eq.${encodeURIComponent(sanitizedOrderId)}&select=*`
    );

    if (!Array.isArray(orderRows) || orderRows.length !== 1) {
      return {
        status: 404,
        response: {
          success: false,
          code: 'ORDER_NOT_FOUND',
          error: 'Order not found'
        }
      };
    }

    const order = orderRows[0];

    // Verify ownership
    if (order.user_id !== customerUserId) {
      return {
        status: 403,
        response: {
          success: false,
          code: 'FORBIDDEN',
          error: 'You do not have permission to pay for this order'
        }
      };
    }

    // Verify order state & payment method
    if (order.status !== 'Payment_Pending' || order.payment_status !== 'Pending') {
      return {
        status: 409,
        response: {
          success: false,
          code: 'ORDER_NOT_PAYABLE',
          error: `Order is not awaiting payment (status: ${order.status}, payment_status: ${order.payment_status})`
        }
      };
    }

    if (!['UPI', 'CARD'].includes(order.payment_method)) {
      return {
        status: 400,
        response: {
          success: false,
          code: 'INVALID_PAYMENT_METHOD',
          error: `Online payment gateway is not supported for payment method: ${order.payment_method}`
        }
      };
    }

    const orderTotalNum = Number(order.total);
    if (!Number.isFinite(orderTotalNum) || orderTotalNum <= 0) {
      return {
        status: 400,
        response: {
          success: false,
          code: 'INVALID_ORDER_TOTAL',
          error: 'Authoritative order total must be greater than zero'
        }
      };
    }

    const amountPaise = Math.round(orderTotalNum * 100);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0 || !Number.isInteger(amountPaise)) {
      return {
        status: 400,
        response: {
          success: false,
          code: 'INVALID_CALCULATED_AMOUNT',
          error: 'Could not calculate valid payment amount'
        }
      };
    }

    // 4. Inspect Existing Payment Transactions in DB
    const existingTxRows = await supabaseServiceFetch(
      `/rest/v1/payment_transactions?order_id=eq.${encodeURIComponent(sanitizedOrderId)}&provider=eq.razorpay&order=created_at.desc&select=*`
    );

    const transactions = Array.isArray(existingTxRows) ? existingTxRows : [];

    // Check if any attempt is already captured
    const capturedTx = transactions.find(tx => tx.status === 'captured');
    if (capturedTx) {
      return {
        status: 409,
        response: {
          success: false,
          code: 'ORDER_ALREADY_PAID',
          error: 'This order has already been paid and captured'
        }
      };
    }

    // Check for an active 'created' attempt
    const activeTx = transactions.find(tx => tx.status === 'created');
    if (activeTx && activeTx.gateway_order_id) {
      // Inspect authoritative state at Razorpay
      let rzpOrder = null;
      try {
        rzpOrder = await razorpayFetch(`/orders/${encodeURIComponent(activeTx.gateway_order_id)}`);
      } catch (fetchErr) {
        console.warn(`[PaymentService] Could not inspect active gateway order ${activeTx.gateway_order_id}:`, fetchErr.message);
        // Uncertain state: do not create a competing order
        return {
          status: 409,
          response: {
            success: false,
            code: 'PAYMENT_ATTEMPT_UNCERTAIN',
            error: 'A payment attempt is currently in progress or awaiting verification. Please wait a moment.'
          }
        };
      }

      if (rzpOrder) {
        const attempts = Number(rzpOrder.attempts) || 0;
        const amountPaid = Number(rzpOrder.amount_paid) || 0;

        // If paid or payments have been attempted, state is uncertain/paid
        if (rzpOrder.status === 'paid' || amountPaid > 0) {
          return {
            status: 409,
            response: {
              success: false,
              code: 'ORDER_ALREADY_PAID',
              error: 'This order has already been paid at the gateway.'
            }
          };
        }

        if (rzpOrder.status !== 'created' || attempts > 0) {
          return {
            status: 409,
            response: {
              success: false,
              code: 'PAYMENT_ATTEMPT_UNCERTAIN',
              error: 'A payment attempt is currently being processed. Please wait a moment.'
            }
          };
        }

        // Fresh attempt with zero customer attempts: check age
        const txAgeMs = Date.now() - new Date(activeTx.created_at).getTime();
        const isRecent = txAgeMs < 15 * 60 * 1000; // 15 minutes

        if (isRecent && rzpOrder.currency === 'INR' && Number(rzpOrder.amount) === amountPaise) {
          return {
            status: 200,
            response: {
              success: true,
              reused: true,
              key_id: getRequiredEnv('RAZORPAY_KEY_ID'),
              razorpay_order_id: activeTx.gateway_order_id,
              amount: amountPaise,
              currency: 'INR',
              parcelkar_order_id: order.id
            }
          };
        }
      }
    }

    // 5. Create Fresh Real Razorpay Order via REST API
    const receiptCode = (order.order_code || order.id.slice(0, 8)).slice(0, 40);
    const rzpOrderPayload = {
      amount: amountPaise,
      currency: 'INR',
      receipt: receiptCode,
      notes: {
        parcelkar_order_id: order.id,
        order_code: order.order_code || ''
      }
    };

    const newRzpOrder = await razorpayFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(rzpOrderPayload)
    });

    if (
      !newRzpOrder ||
      typeof newRzpOrder.id !== 'string' ||
      !newRzpOrder.id.startsWith('order_') ||
      Number(newRzpOrder.amount) !== amountPaise ||
      newRzpOrder.currency !== 'INR' ||
      newRzpOrder.status !== 'created'
    ) {
      const err = new Error('Invalid or unexpected response from payment provider');
      err.code = 'GATEWAY_INVALID_RESPONSE';
      err.status = 502;
      throw err;
    }

    // 6. Register Gateway Order in Supabase via service_role RPC
    let registerResult = null;
    try {
      registerResult = await supabaseServiceFetch('/rest/v1/rpc/register_gateway_payment_order', {
        method: 'POST',
        body: JSON.stringify({
          p_order_id: order.id,
          p_gateway_order_id: newRzpOrder.id,
          p_amount: orderTotalNum,
          p_currency: 'INR',
          p_provider_payload: {
            id: newRzpOrder.id,
            entity: newRzpOrder.entity,
            amount: newRzpOrder.amount,
            currency: newRzpOrder.currency,
            status: newRzpOrder.status,
            created_at: newRzpOrder.created_at
          }
        })
      });
    } catch (regErr) {
      // CRITICAL: Registration failure window. DO NOT return newRzpOrder.id to browser!
      console.error(`[PaymentService] DB registration failed for Parcelkar order ${order.id}, Razorpay order ${newRzpOrder.id}:`, regErr.message);
      return {
        status: 500,
        response: {
          success: false,
          code: 'REGISTRATION_FAILED',
          error: 'Payment initialization could not be completed. Please try again.'
        }
      };
    }

    // 7. Validate Registration RPC Result
    const regStatus = registerResult?.status;
    if (
      (regStatus !== 'success' && regStatus !== 'already_processed') ||
      registerResult?.order_id !== order.id ||
      registerResult?.gateway_order_id !== newRzpOrder.id
    ) {
      console.error(`[PaymentService] Unexpected registration status for order ${order.id}:`, regStatus);
      return {
        status: 500,
        response: {
          success: false,
          code: 'REGISTRATION_CONFLICT',
          error: 'Payment registration conflict detected. Please try again.'
        }
      };
    }

    // 8. Return Safe Response to Client
    return {
      status: 200,
      response: {
        success: true,
        reused: false,
        key_id: getRequiredEnv('RAZORPAY_KEY_ID'),
        razorpay_order_id: newRzpOrder.id,
        amount: amountPaise,
        currency: 'INR',
        parcelkar_order_id: order.id
      }
    };
  } catch (err) {
    console.error('[PaymentService] Error creating payment order:', err.code || 'UNKNOWN', err.message);
    return sanitizePublicError(err);
  }
}

/**
 * Verifies Razorpay payment signature, queries authoritative payment status at Razorpay,
 * and finalizes the Parcelkar order via service-role RPC.
 *
 * @param {Object} params
 * @param {Object} params.headers - Incoming HTTP headers
 * @param {Object} params.body - { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Promise<{ status: number, response: Object }>}
 */
async function verifyAndFinalizePayment({ headers, body }) {
  try {
    // 1. Authenticate Customer via Bearer token
    const token = extractBearerToken(headers);
    if (!token) {
      return {
        status: 401,
        response: {
          success: false,
          verified: false,
          code: 'UNAUTHORIZED',
          error: 'Authentication required'
        }
      };
    }

    const { user, error: authError } = await validateCustomerAccessToken(token);
    if (authError || !user || !user.id) {
      return {
        status: 401,
        response: {
          success: false,
          verified: false,
          code: 'UNAUTHORIZED',
          error: 'Invalid or expired customer session'
        }
      };
    }
    const customerUserId = user.id;

    // 2. Strict Input Format Validation
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const rzpOrderRegex = /^order_[a-zA-Z0-9]+$/;
    const rzpPaymentRegex = /^pay_[a-zA-Z0-9]+$/;
    const rzpSigRegex = /^[0-9a-f]{64}$/i;

    if (
      !order_id || typeof order_id !== 'string' || !uuidRegex.test(order_id.trim()) ||
      !razorpay_order_id || typeof razorpay_order_id !== 'string' || !rzpOrderRegex.test(razorpay_order_id.trim()) ||
      !razorpay_payment_id || typeof razorpay_payment_id !== 'string' || !rzpPaymentRegex.test(razorpay_payment_id.trim()) ||
      !razorpay_signature || typeof razorpay_signature !== 'string' || !rzpSigRegex.test(razorpay_signature.trim())
    ) {
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'INVALID_PAYMENT_CREDENTIALS',
          error: 'Missing or malformed payment verification credentials'
        }
      };
    }

    const sanitizedOrderId = order_id.trim();
    const claimedRzpOrderId = razorpay_order_id.trim();
    const sanitizedPaymentId = razorpay_payment_id.trim();
    const sanitizedSignature = razorpay_signature.trim();

    // 3. Fetch Authoritative Parcelkar Order from Supabase
    const orderRows = await supabaseServiceFetch(
      `/rest/v1/orders?id=eq.${encodeURIComponent(sanitizedOrderId)}&select=*`
    );

    if (!Array.isArray(orderRows) || orderRows.length !== 1) {
      return {
        status: 404,
        response: {
          success: false,
          verified: false,
          code: 'ORDER_NOT_FOUND',
          error: 'Order not found'
        }
      };
    }

    const order = orderRows[0];

    // Ownership check
    if (order.user_id !== customerUserId) {
      return {
        status: 403,
        response: {
          success: false,
          verified: false,
          code: 'FORBIDDEN',
          error: 'You do not have permission to verify this order'
        }
      };
    }

    if (!['UPI', 'CARD'].includes(order.payment_method)) {
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'INVALID_PAYMENT_METHOD',
          error: `Payment verification is not supported for payment method: ${order.payment_method}`
        }
      };
    }

    // Check if order is already Paid (idempotency check)
    const isAlreadyPaidOrder = order.status === 'New' && order.payment_status === 'Paid';
    if (isAlreadyPaidOrder) {
      if (order.transaction_id === sanitizedPaymentId) {
        return {
          status: 200,
          response: {
            success: true,
            verified: true,
            order_id: order.id,
            payment_id: sanitizedPaymentId,
            payment_status: 'Paid',
            order_status: 'New',
            already_processed: true
          }
        };
      } else {
        return {
          status: 409,
          response: {
            success: false,
            verified: false,
            code: 'ORDER_ALREADY_PAID_DIFFERENT_PAYMENT',
            error: 'Order is already marked Paid under a different transaction'
          }
        };
      }
    }

    // Normal pre-finalization state check
    if (order.status !== 'Payment_Pending' || order.payment_status !== 'Pending') {
      return {
        status: 409,
        response: {
          success: false,
          verified: false,
          code: 'ORDER_NOT_PENDING_PAYMENT',
          error: `Order is not in a pending payment state (status: ${order.status}, payment_status: ${order.payment_status})`
        }
      };
    }

    const orderTotalNum = Number(order.total);
    if (!Number.isFinite(orderTotalNum) || orderTotalNum <= 0) {
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'INVALID_ORDER_TOTAL',
          error: 'Order total must be greater than zero'
        }
      };
    }

    // 4. Fetch Authoritative Payment Transaction from Database
    const txRows = await supabaseServiceFetch(
      `/rest/v1/payment_transactions?order_id=eq.${encodeURIComponent(sanitizedOrderId)}&provider=eq.razorpay&select=*`
    );

    const transactions = Array.isArray(txRows) ? txRows : [];
    const matchingTx = transactions.find(tx => tx.gateway_order_id === claimedRzpOrderId);

    if (!matchingTx) {
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'TRANSACTION_NOT_FOUND',
          error: 'No registered payment transaction matches the supplied gateway order'
        }
      };
    }

    // Verify transaction invariants
    if (
      matchingTx.order_id !== order.id ||
      matchingTx.user_id !== customerUserId ||
      Number(matchingTx.amount) !== orderTotalNum ||
      matchingTx.currency !== 'INR'
    ) {
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'TRANSACTION_MISMATCH',
          error: 'Payment transaction records do not match authoritative order details'
        }
      };
    }

    // Check transaction state
    if (matchingTx.status === 'captured') {
      if (matchingTx.gateway_payment_id === sanitizedPaymentId && matchingTx.signature_verified) {
        return {
          status: 200,
          response: {
            success: true,
            verified: true,
            order_id: order.id,
            payment_id: sanitizedPaymentId,
            payment_status: 'Paid',
            order_status: order.status,
            already_processed: true
          }
        };
      }
      return {
        status: 409,
        response: {
          success: false,
          verified: false,
          code: 'TRANSACTION_ALREADY_CAPTURED',
          error: 'Payment transaction was already captured under a different payment identifier'
        }
      };
    }

    if (!['created', 'authorized'].includes(matchingTx.status)) {
      return {
        status: 409,
        response: {
          success: false,
          verified: false,
          code: 'TRANSACTION_INELIGIBLE',
          error: `Payment transaction is not eligible for finalization (status: ${matchingTx.status})`
        }
      };
    }

    const authoritativeGatewayOrderId = matchingTx.gateway_order_id;

    // 5. Verify Razorpay Payment Signature using Authoritative DB gateway_order_id
    const isSignatureValid = verifyPaymentSignature({
      gatewayOrderId: authoritativeGatewayOrderId,
      razorpayPaymentId: sanitizedPaymentId,
      razorpaySignature: sanitizedSignature
    });

    if (!isSignatureValid) {
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'SIGNATURE_VERIFICATION_FAILED',
          error: 'Payment signature verification failed'
        }
      };
    }

    // 6. Fetch Authoritative Payment Details from Razorpay Provider
    let rzpPayment = null;
    try {
      rzpPayment = await razorpayFetch(`/payments/${encodeURIComponent(sanitizedPaymentId)}`);
    } catch (rzpErr) {
      console.error(`[PaymentService] Failed to fetch payment ${sanitizedPaymentId} from Razorpay:`, rzpErr.message);
      return {
        status: 502,
        response: {
          success: false,
          verified: false,
          code: 'GATEWAY_FETCH_FAILED',
          error: 'Could not verify payment with provider. Please try again.'
        }
      };
    }

    // 7. Verify Authoritative Provider Payment Details
    const expectedAmountPaise = Math.round(orderTotalNum * 100);
    if (
      !rzpPayment ||
      rzpPayment.id !== sanitizedPaymentId ||
      rzpPayment.order_id !== authoritativeGatewayOrderId ||
      Number(rzpPayment.amount) !== expectedAmountPaise ||
      rzpPayment.currency !== 'INR'
    ) {
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'PROVIDER_PAYMENT_MISMATCH',
          error: 'Provider payment details do not match authoritative order requirements'
        }
      };
    }

    // CRITICAL REQUIREMENT: Captured ONLY
    if (rzpPayment.status !== 'captured') {
      if (rzpPayment.status === 'authorized') {
        return {
          status: 409,
          response: {
            success: false,
            verified: true,
            code: 'PAYMENT_NOT_CAPTURED',
            error: 'Payment is authorized but not yet captured by payment gateway.'
          }
        };
      }
      return {
        status: 400,
        response: {
          success: false,
          verified: false,
          code: 'PAYMENT_NOT_SUCCESSFUL',
          error: `Payment has not succeeded (status: ${rzpPayment.status})`
        }
      };
    }

    // 8. Sanitize Provider Metadata (Strip all PII and sensitive credentials)
    const sanitizedProviderPayload = {
      id: rzpPayment.id,
      order_id: rzpPayment.order_id,
      entity: rzpPayment.entity,
      amount: rzpPayment.amount,
      currency: rzpPayment.currency,
      status: rzpPayment.status,
      method: rzpPayment.method,
      captured: rzpPayment.captured,
      created_at: rzpPayment.created_at
    };

    // 9. Finalize Payment in Database via service_role RPC
    let finalizeResult = null;
    try {
      finalizeResult = await supabaseServiceFetch('/rest/v1/rpc/finalize_customer_payment', {
        method: 'POST',
        body: JSON.stringify({
          p_order_id: order.id,
          p_gateway_order_id: authoritativeGatewayOrderId,
          p_gateway_payment_id: sanitizedPaymentId,
          p_provider_payload: sanitizedProviderPayload
        })
      });
    } catch (rpcErr) {
      // Critical failure window: Payment is captured at gateway, but RPC failed
      console.error(`[PaymentService] CRITICAL: Payment captured at provider but DB finalization failed! Order: ${order.id}, Gateway Order: ${authoritativeGatewayOrderId}, Payment: ${sanitizedPaymentId}. Error: ${rpcErr.message}`);
      return {
        status: 500,
        response: {
          success: false,
          verified: true,
          code: 'PAYMENT_CAPTURED_FINALIZATION_PENDING',
          error: 'Payment was captured at provider but order finalization is pending reconciliation. Please do not repay.',
          order_id: order.id,
          payment_id: sanitizedPaymentId
        }
      };
    }

    // 10. Handle RPC Response
    const rpcStatus = finalizeResult?.status;
    const isAlreadyProcessed = rpcStatus === 'already_processed';

    if (rpcStatus !== 'success' && !isAlreadyProcessed) {
      console.error(`[PaymentService] Unexpected finalize RPC status for order ${order.id}:`, rpcStatus);
      return {
        status: 500,
        response: {
          success: false,
          verified: true,
          code: 'PAYMENT_CAPTURED_FINALIZATION_PENDING',
          error: 'Payment status reconciliation pending. Please do not repay.',
          order_id: order.id,
          payment_id: sanitizedPaymentId
        }
      };
    }

    return {
      status: 200,
      response: {
        success: true,
        verified: true,
        order_id: order.id,
        payment_id: sanitizedPaymentId,
        payment_status: 'Paid',
        order_status: 'New',
        already_processed: isAlreadyProcessed
      }
    };
  } catch (err) {
    console.error('[PaymentService] Error verifying and finalizing payment:', err.code || 'UNKNOWN', err.message);
    return sanitizePublicError(err);
  }
}

/**
 * Authoritative Server-Side Razorpay Webhook Handler
 * 
 * Strict Security Guarantees:
 * 1. Requires exact raw request Buffer/string for HMAC-SHA256 signature verification.
 * 2. Isolates RAZORPAY_WEBHOOK_SECRET (never uses key secret).
 * 3. Requires valid x-razorpay-event-id header.
 * 4. Atomic deduplication & claim via public.claim_webhook_event RPC.
 * 5. Safe payload extraction (strips all PII: customer email, contact, card/bank tokens).
 * 6. Authoritative Razorpay API reconciliation (GET /v1/payments/{id}) for payment.captured.
 * 7. Reconciles with public.orders & public.payment_transactions via service_role RPCs:
 *    - Pending order -> finalize_customer_payment
 *    - Already finalized order -> idempotent success
 *    - Cancelled order -> reconcile_captured_cancelled_payment (flags Refund_Pending, does NOT change to New)
 * 8. Safe handling of payment.failed, payment.authorized, and deferred refund events.
 */
async function handleRazorpayWebhook({ headers, rawBody }) {
  try {
    if (!headers) {
      return { status: 400, response: { success: false, error: 'Missing headers' } };
    }

    // 1. Extract and Validate Signature & Event ID Headers
    const signatureHeader = headers['x-razorpay-signature'] || headers['X-Razorpay-Signature'];
    const eventIdHeader = headers['x-razorpay-event-id'] || headers['X-Razorpay-Event-Id'];

    if (!signatureHeader || typeof signatureHeader !== 'string' || signatureHeader.trim() === '') {
      return {
        status: 400,
        response: { success: false, code: 'WEBHOOK_SIGNATURE_MISSING', error: 'Missing webhook signature header' }
      };
    }

    if (!eventIdHeader || typeof eventIdHeader !== 'string' || eventIdHeader.trim() === '') {
      return {
        status: 400,
        response: { success: false, code: 'WEBHOOK_EVENT_ID_MISSING', error: 'Missing webhook event ID header' }
      };
    }

    const sanitizedEventId = eventIdHeader.trim();

    // 2. Cryptographically Verify Signature against Exact Raw Bytes
    const isSignatureValid = verifyWebhookSignature({
      rawBody,
      signatureHeader: signatureHeader.trim()
    });

    if (!isSignatureValid) {
      return {
        status: 400,
        response: { success: false, code: 'WEBHOOK_SIGNATURE_INVALID', error: 'Invalid webhook signature' }
      };
    }

    // 3. Parse JSON Body AFTER Signature Verification
    let payload = null;
    try {
      const rawString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
      payload = JSON.parse(rawString);
    } catch (parseErr) {
      return {
        status: 400,
        response: { success: false, code: 'WEBHOOK_PAYLOAD_INVALID_JSON', error: 'Malformed JSON body' }
      };
    }

    if (!payload || typeof payload !== 'object') {
      return {
        status: 400,
        response: { success: false, code: 'WEBHOOK_PAYLOAD_EMPTY', error: 'Empty or invalid webhook payload' }
      };
    }

    const eventType = payload.event;
    if (!eventType || typeof eventType !== 'string') {
      return {
        status: 400,
        response: { success: false, code: 'WEBHOOK_EVENT_TYPE_MISSING', error: 'Missing webhook event type' }
      };
    }

    // 4. Extract Safe Payload & Entity Identifiers (Strictly No PII)
    const paymentEntity = payload.payload?.payment?.entity || {};
    const orderEntity = payload.payload?.order?.entity || {};
    const refundEntity = payload.payload?.refund?.entity || {};

    const gatewayPaymentId = paymentEntity.id || refundEntity.payment_id || null;
    const gatewayOrderId = paymentEntity.order_id || orderEntity.id || null;

    const safePayload = {
      event: eventType,
      event_id: sanitizedEventId,
      gateway_payment_id: gatewayPaymentId,
      gateway_order_id: gatewayOrderId,
      payment_status: paymentEntity.status || null,
      payment_amount: paymentEntity.amount !== undefined ? paymentEntity.amount : null,
      payment_currency: paymentEntity.currency || null,
      payment_method: paymentEntity.method || null,
      refund_id: refundEntity.id || null,
      created_at: payload.created_at || null
    };

    // 5. Atomic Claim & Idempotency Check in Database
    let claimResult = null;
    try {
      claimResult = await supabaseServiceFetch('/rest/v1/rpc/claim_webhook_event', {
        method: 'POST',
        body: JSON.stringify({
          p_provider: 'razorpay',
          p_event_id: sanitizedEventId,
          p_event_type: eventType,
          p_gateway_order_id: gatewayOrderId,
          p_gateway_payment_id: gatewayPaymentId,
          p_safe_payload: safePayload
        })
      });
    } catch (claimErr) {
      console.error(`[PaymentService] Webhook claim RPC failed for event ${sanitizedEventId}:`, claimErr.message);
      // Return 500 to allow provider retry on temporary DB failure
      return {
        status: 500,
        response: { success: false, code: 'WEBHOOK_CLAIM_DB_ERROR', error: 'Database temporary failure during claim' }
      };
    }

    const claimStatus = claimResult?.status;

    // If already processed or ignored or reconciliation_required, respond 200 immediately
    if (claimStatus === 'already_processed') {
      return {
        status: 200,
        response: {
          success: true,
          event_id: sanitizedEventId,
          event_type: eventType,
          status: 'already_processed',
          message: 'Webhook event was already processed'
        }
      };
    }

    // If another worker is currently processing this event
    if (claimStatus === 'processing_in_flight') {
      return {
        status: 409,
        response: {
          success: false,
          event_id: sanitizedEventId,
          status: 'processing_in_flight',
          message: 'Webhook event is currently being processed by another worker'
        }
      };
    }

    if (claimStatus !== 'claimed') {
      console.error(`[PaymentService] Webhook unexpected claim status for event ${sanitizedEventId}:`, claimStatus);
      return {
        status: 500,
        response: { success: false, code: 'WEBHOOK_CLAIM_UNEXPECTED', error: 'Failed to claim event' }
      };
    }

    // 6. Branch Event Handling
    // Helper to finalize webhook event record
    const finalizeEvent = async (processingStatus, { orderId = null, paymentId = null, errorCode = null, updatedPayload = null } = {}) => {
      try {
        await supabaseServiceFetch('/rest/v1/rpc/finalize_webhook_event', {
          method: 'POST',
          body: JSON.stringify({
            p_event_id: sanitizedEventId,
            p_processing_status: processingStatus,
            p_parcelkar_order_id: orderId,
            p_gateway_payment_id: paymentId || gatewayPaymentId,
            p_error_code: errorCode,
            p_safe_payload: updatedPayload || safePayload
          })
        });
      } catch (finErr) {
        console.error(`[PaymentService] Failed to finalize webhook event ${sanitizedEventId}:`, finErr.message);
      }
    };

    // ----------------------------------------------------
    // CASE 1: Canonical Payment Success (payment.captured)
    // ----------------------------------------------------
    if (eventType === 'payment.captured') {
      if (!gatewayPaymentId) {
        await finalizeEvent('failed', { errorCode: 'MISSING_PAYMENT_ID' });
        return {
          status: 400,
          response: { success: false, code: 'WEBHOOK_PAYMENT_ID_MISSING', error: 'Missing payment ID in payment.captured' }
        };
      }

      // Step A: Independently call Razorpay Payments API (Zero trust for payload status alone)
      let rzpPayment = null;
      try {
        rzpPayment = await razorpayFetch(`/payments/${encodeURIComponent(gatewayPaymentId)}`);
      } catch (rzpErr) {
        console.error(`[PaymentService] Webhook failed to fetch payment ${gatewayPaymentId} from Razorpay:`, rzpErr.message);
        // Temporary gateway failure -> return 502 so Razorpay retries
        return {
          status: 502,
          response: { success: false, code: 'GATEWAY_FETCH_FAILED', error: 'Failed to query Razorpay payments API' }
        };
      }

      // Step B: Verify Authoritative Provider Details
      if (!rzpPayment || rzpPayment.status !== 'captured' || !rzpPayment.captured) {
        await finalizeEvent('failed', { errorCode: 'PAYMENT_NOT_CAPTURED_AT_PROVIDER' });
        return {
          status: 400,
          response: { success: false, code: 'PAYMENT_NOT_CAPTURED', error: 'Payment is not captured according to Razorpay API' }
        };
      }

      if (rzpPayment.currency !== 'INR') {
        await finalizeEvent('failed', { errorCode: 'CURRENCY_MISMATCH' });
        return {
          status: 400,
          response: { success: false, code: 'CURRENCY_MISMATCH', error: 'Payment currency is not INR' }
        };
      }

      const authoritativeGatewayOrderId = rzpPayment.order_id || gatewayOrderId;
      if (!authoritativeGatewayOrderId) {
        await finalizeEvent('failed', { errorCode: 'MISSING_GATEWAY_ORDER_ID' });
        return {
          status: 400,
          response: { success: false, code: 'ORDER_ID_MISSING', error: 'No gateway order ID associated with payment' }
        };
      }

      // Step C: Look up authoritative payment_transaction
      const txRows = await supabaseServiceFetch(
        `/rest/v1/payment_transactions?gateway_order_id=eq.${encodeURIComponent(authoritativeGatewayOrderId)}&provider=eq.razorpay&select=*`
      );
      const matchingTx = Array.isArray(txRows) && txRows.length > 0 ? txRows[0] : null;

      if (!matchingTx) {
        await finalizeEvent('failed', { errorCode: 'TRANSACTION_NOT_FOUND' });
        return {
          status: 400,
          response: { success: false, code: 'TRANSACTION_NOT_FOUND', error: 'No registered payment transaction found' }
        };
      }

      const expectedAmountPaise = Math.round(Number(matchingTx.amount) * 100);
      if (Number(rzpPayment.amount) !== expectedAmountPaise) {
        await finalizeEvent('failed', { errorCode: 'AMOUNT_MISMATCH' });
        return {
          status: 400,
          response: { success: false, code: 'AMOUNT_MISMATCH', error: 'Captured amount does not match transaction amount' }
        };
      }

      // Step D: Look up authoritative Parcelkar order
      const orderRows = await supabaseServiceFetch(
        `/rest/v1/orders?id=eq.${encodeURIComponent(matchingTx.order_id)}&select=*`
      );
      const order = Array.isArray(orderRows) && orderRows.length > 0 ? orderRows[0] : null;

      if (!order) {
        await finalizeEvent('failed', { errorCode: 'ORDER_NOT_FOUND' });
        return {
          status: 400,
          response: { success: false, code: 'ORDER_NOT_FOUND', error: 'Associated Parcelkar order not found' }
        };
      }

      // Sub-case 1: Order is already New and Paid with the SAME gateway payment ID
      if (order.status === 'New' && order.payment_status === 'Paid' && order.transaction_id === gatewayPaymentId) {
        await finalizeEvent('processed', { orderId: order.id, paymentId: gatewayPaymentId });
        return {
          status: 200,
          response: {
            success: true,
            event_id: sanitizedEventId,
            order_id: order.id,
            already_processed: true,
            message: 'Order already finalized with matching payment'
          }
        };
      }

      // Sub-case 2: Order was Cancelled (Cancel vs Capture race condition)
      if (order.status === 'Cancelled') {
        let reconcileResult = null;
        try {
          reconcileResult = await supabaseServiceFetch('/rest/v1/rpc/reconcile_captured_cancelled_payment', {
            method: 'POST',
            body: JSON.stringify({
              p_order_id: order.id,
              p_gateway_order_id: authoritativeGatewayOrderId,
              p_gateway_payment_id: gatewayPaymentId,
              p_provider_payload: {
                id: rzpPayment.id,
                order_id: rzpPayment.order_id,
                amount: rzpPayment.amount,
                currency: rzpPayment.currency,
                status: rzpPayment.status,
                method: rzpPayment.method,
                captured: rzpPayment.captured,
                created_at: rzpPayment.created_at
              }
            })
          });
        } catch (recErr) {
          console.error(`[PaymentService] Cancelled order reconciliation RPC failed for order ${order.id}:`, recErr.message);
          return {
            status: 500,
            response: { success: false, code: 'RECONCILIATION_DB_ERROR', error: 'Failed to record cancelled capture state' }
          };
        }

        await finalizeEvent('reconciliation_required', { orderId: order.id, paymentId: gatewayPaymentId });
        return {
          status: 200,
          response: {
            success: true,
            event_id: sanitizedEventId,
            order_id: order.id,
            status: 'reconciliation_required',
            payment_status: 'Refund_Pending',
            order_status: 'Cancelled',
            message: 'Payment captured for cancelled order. Refund required recorded safely.'
          }
        };
      }

      // Sub-case 3: Order is Payment_Pending / Pending -> finalize_customer_payment
      if (order.status === 'Payment_Pending' && order.payment_status === 'Pending') {
        let finalizeResult = null;
        try {
          finalizeResult = await supabaseServiceFetch('/rest/v1/rpc/finalize_customer_payment', {
            method: 'POST',
            body: JSON.stringify({
              p_order_id: order.id,
              p_gateway_order_id: authoritativeGatewayOrderId,
              p_gateway_payment_id: gatewayPaymentId,
              p_provider_payload: {
                id: rzpPayment.id,
                order_id: rzpPayment.order_id,
                amount: rzpPayment.amount,
                currency: rzpPayment.currency,
                status: rzpPayment.status,
                method: rzpPayment.method,
                captured: rzpPayment.captured,
                created_at: rzpPayment.created_at
              }
            })
          });
        } catch (finErr) {
          console.error(`[PaymentService] Webhook finalize RPC error for order ${order.id}:`, finErr.message);
          return {
            status: 500,
            response: { success: false, code: 'FINALIZE_DB_ERROR', error: 'Failed to finalize customer payment' }
          };
        }

        const rpcStatus = finalizeResult?.status;
        if (rpcStatus !== 'success' && rpcStatus !== 'already_processed') {
          await finalizeEvent('failed', { orderId: order.id, errorCode: 'FINALIZE_RPC_FAILED' });
          return {
            status: 500,
            response: { success: false, code: 'FINALIZE_FAILED', error: 'Finalization failed in database' }
          };
        }

        await finalizeEvent('processed', { orderId: order.id, paymentId: gatewayPaymentId });
        return {
          status: 200,
          response: {
            success: true,
            event_id: sanitizedEventId,
            order_id: order.id,
            payment_status: 'Paid',
            order_status: 'New',
            message: 'Payment finalized successfully via webhook'
          }
        };
      }

      // Sub-case 4: Incompatible order state (e.g. unknown state)
      await finalizeEvent('reconciliation_required', { orderId: order.id, errorCode: 'INCOMPATIBLE_ORDER_STATE' });
      return {
        status: 200,
        response: {
          success: true,
          event_id: sanitizedEventId,
          order_id: order.id,
          status: 'reconciliation_required',
          message: 'Order state incompatible with capture finalization'
        }
      };
    }

    // ----------------------------------------------------
    // CASE 2: Payment Failure (payment.failed)
    // ----------------------------------------------------
    if (eventType === 'payment.failed') {
      // Do NOT cancel Parcelkar order automatically.
      // Do NOT mark Paid.
      // Do NOT refund wallet.
      // Record failure on transaction if existing.
      if (gatewayOrderId) {
        try {
          const txRows = await supabaseServiceFetch(
            `/rest/v1/payment_transactions?gateway_order_id=eq.${encodeURIComponent(gatewayOrderId)}&provider=eq.razorpay&select=*`
          );
          const matchingTx = Array.isArray(txRows) && txRows.length > 0 ? txRows[0] : null;
          if (matchingTx && matchingTx.status === 'created') {
            await supabaseServiceFetch(
              `/rest/v1/payment_transactions?id=eq.${encodeURIComponent(matchingTx.id)}`,
              {
                method: 'PATCH',
                body: JSON.stringify({
                  status: 'failed',
                  error_code: paymentEntity.error_code || 'PAYMENT_FAILED',
                  updated_at: new Date().toISOString()
                })
              }
            );
          }
        } catch (txErr) {
          console.warn('[PaymentService] Failed to record payment.failed on transaction:', txErr.message);
        }
      }

      await finalizeEvent('processed', { paymentId: gatewayPaymentId, errorCode: paymentEntity.error_code || 'PAYMENT_FAILED' });
      return {
        status: 200,
        response: {
          success: true,
          event_id: sanitizedEventId,
          event_type: eventType,
          status: 'processed',
          message: 'Payment failure recorded safely'
        }
      };
    }

    // ----------------------------------------------------
    // CASE 3: Payment Authorized (payment.authorized)
    // ----------------------------------------------------
    if (eventType === 'payment.authorized') {
      // Safely acknowledge. Never mark order Paid or New from authorized.
      await finalizeEvent('ignored');
      return {
        status: 200,
        response: {
          success: true,
          event_id: sanitizedEventId,
          event_type: eventType,
          status: 'ignored',
          message: 'Payment authorized event received and ignored (awaiting capture)'
        }
      };
    }

    // ----------------------------------------------------
    // CASE 4: Refund Events (refund.processed, refund.failed)
    // ----------------------------------------------------
    if (eventType === 'refund.processed' || eventType === 'refund.failed') {
      // Step 6J.6B: Do NOT implement refund financial mutation yet.
      // Acknowledge safely. Step 6J.6C owns refund mutation behavior.
      await finalizeEvent('ignored');
      return {
        status: 200,
        response: {
          success: true,
          event_id: sanitizedEventId,
          event_type: eventType,
          status: 'ignored',
          message: 'Refund event safely recorded/ignored (refund logic deferred to 6J.6C)'
        }
      };
    }

    // ----------------------------------------------------
    // CASE 5: All other irrelevant events
    // ----------------------------------------------------
    await finalizeEvent('ignored');
    return {
      status: 200,
      response: {
        success: true,
        event_id: sanitizedEventId,
        event_type: eventType,
        status: 'ignored',
        message: `Event type ${eventType} ignored`
      }
    };

  } catch (err) {
    console.error('[PaymentService] Unhandled error handling Razorpay webhook:', err.message);
    return sanitizePublicError(err);
  }
}

module.exports = {
  getRequiredEnv,
  extractBearerToken,
  validateCustomerAccessToken,
  normalizeSupabaseBaseUrl,
  buildSupabaseUrl,
  supabaseServiceFetch,
  razorpayFetch,
  safeTimingCompare,
  verifyPaymentSignature,
  verifyWebhookSignature,
  sanitizePublicError,
  createPaymentOrder,
  verifyAndFinalizePayment,
  handleRazorpayWebhook
};
