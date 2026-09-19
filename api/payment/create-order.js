/**
 * api/payment/create-order.js
 * Vercel Serverless Function Adapter for Real Razorpay Create Order
 * Delegates all business logic to server/services/paymentService.js.
 */

const { createPaymentOrder } = require('../../server/services/paymentService');

function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.connection?.destroy?.();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

module.exports = async function handleCreateOrder(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(204).end();
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== 'POST') {
    const errPayload = {
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    };
    if (typeof res.status === 'function') return res.status(405).json(errPayload);
    res.writeHead(405);
    return res.end(JSON.stringify(errPayload));
  }

  try {
    const body = await parseJsonBody(req);
    const result = await createPaymentOrder({
      headers: req.headers,
      body
    });

    if (typeof res.status === 'function') {
      return res.status(result.status).json(result.response);
    }
    res.writeHead(result.status);
    return res.end(JSON.stringify(result.response));
  } catch (err) {
    console.error('[API create-order] Unhandled adapter error:', err.message);
    const errResp = {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    };
    if (typeof res.status === 'function') return res.status(500).json(errResp);
    res.writeHead(500);
    return res.end(JSON.stringify(errResp));
  }
};