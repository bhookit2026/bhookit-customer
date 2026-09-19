/**
 * api/payment/webhook.js
 * Vercel Serverless Function: Authoritative Razorpay Webhook Handler
 * 
 * Strict Security Guarantees:
 * - Disables bodyParser so raw bytes are preserved for HMAC verification.
 * - Enforces max body size limit (1MB).
 * - POST only (405 for other methods).
 * - Delegates directly to shared paymentService.handleRazorpayWebhook.
 */

const paymentService = require('../../server/services/paymentService');

// Disable Vercel automatic body parsing to preserve raw Buffer bytes for HMAC-SHA256 signature verification
module.exports.config = {
  api: {
    bodyParser: false
  }
};

module.exports = async function webhook(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Method not allowed'
    });
  }

  const chunks = [];
  let totalLength = 0;
  const MAX_SIZE = 1e6; // 1MB body limit

  req.on('data', chunk => {
    chunks.push(chunk);
    totalLength += chunk.length;
    if (totalLength > MAX_SIZE) {
      req.destroy(new Error('Payload too large'));
    }
  });

  req.on('error', err => {
    console.error('[VercelWebhook] Request stream error:', err.message);
    if (!res.headersSent) {
      return res.status(400).json({
        success: false,
        code: 'BAD_REQUEST',
        error: 'Error reading request body'
      });
    }
  });

  req.on('end', async () => {
    try {
      const rawBody = Buffer.concat(chunks);
      const result = await paymentService.handleRazorpayWebhook({
        headers: req.headers,
        rawBody
      });

      return res.status(result.status).json(result.response);
    } catch (err) {
      console.error('[VercelWebhook] Handler error:', err.message);
      return res.status(500).json({
        success: false,
        code: 'INTERNAL_ERROR',
        error: 'Internal server error processing webhook'
      });
    }
  });
};