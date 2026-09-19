/**
 * Parcelकर V1 — Multi-Restaurant System
 * High-Performance Node.js Backend Server & REST API
 * Features: Static file server, Payment Gateway simulation (Razorpay/UPI),
 * and Order Verification API.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// ============================================================
// Safe Local Environment Ingestion (.env.local)
// ============================================================
function loadLocalEnv(envFileName = '.env.local') {
  const envPath = path.resolve(__dirname, envFileName);
  if (!fs.existsSync(envPath)) return;
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      if (!key) continue;
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // Do not overwrite environment variables already explicitly set
      if (process.env[key] === undefined || process.env[key] === '') {
        process.env[key] = val;
      }
    }
  } catch (err) {
    console.warn(`[Env] Notice: could not load ${envFileName}:`, err.message);
  }
}

// Load .env.local BEFORE reading process.env values
try {
  require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
} catch (e) {
  loadLocalEnv('.env.local');
}

// ============================================================
// Startup Validation & Test-Mode Safety Guard
// ============================================================
function validateStartupEnv() {
  const requiredVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missing = requiredVars.filter(name => {
    const v = process.env[name];
    return !v || typeof v !== 'string' || v.trim() === '';
  });

  if (missing.length > 0) {
    console.warn(`[Env] Warning: Missing required payment environment variable(s): ${missing.join(', ')}`);
  }

  // Local Test-Mode Safety Guard
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  if (keyId) {
    if (keyId.startsWith('rzp_live_')) {
      console.error('[Env] ERROR: Local payment server requires Razorpay Test Mode key.');
      throw new Error('Local payment server requires Razorpay Test Mode key.');
    }
    if (!keyId.startsWith('rzp_test_')) {
      console.warn('[Env] Warning: RAZORPAY_KEY_ID does not start with rzp_test_. Controlled local payments require Test Mode.');
    }
  }
}

validateStartupEnv();

const paymentService = require('./server/services/paymentService');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Helper: Parse incoming JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.connection.destroy();
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

// Helper: Read raw body buffer (strictly preserving byte-level integrity for HMAC verification)
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalLength = 0;
    const MAX_SIZE = 1e6; // 1MB limit

    req.on('data', chunk => {
      chunks.push(chunk);
      totalLength += chunk.length;
      if (totalLength > MAX_SIZE) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });

    req.on('error', err => reject(err));
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

// Helper: Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Razorpay-Signature, X-Razorpay-Event-Id'
  });
  res.end(JSON.stringify(data));
}

// In-memory backend database for verification
const serverOrders = [];

const server = http.createServer(handleRequest);

async function handleRequest(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // -----------------------------------------------------------
  // REST API ROUTES (/api/*)
  // -----------------------------------------------------------

  // 1. Health Check
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'healthy',
      system: 'Parcelकर V1 Engine',
      version: '11.2.0',
      timestamp: new Date().toISOString()
    });
  }

  // 2. Create Payment Order (Real Razorpay / UPI integration)
  if (pathname === '/api/payment/create-order' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const result = await paymentService.createPaymentOrder({
        headers: req.headers,
        body
      });
      return sendJson(res, result.status, result.response);
    } catch (err) {
      console.error('[Server] create-order unhandled error:', err.message);
      return sendJson(res, 500, {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // 3. Verify Payment Signature and Finalize Order
  if (pathname === '/api/payment/verify' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const result = await paymentService.verifyAndFinalizePayment({
        headers: req.headers,
        body
      });
      return sendJson(res, result.status, result.response);
    } catch (err) {
      console.error('[Server] verify unhandled error:', err.message);
      return sendJson(res, 500, {
        success: false,
        verified: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // 4. Payment Gateway Webhook Receiver (Authoritative Raw-Body HMAC Verification)
  if (pathname === '/api/payment/webhook') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return sendJson(res, 405, {
        success: false,
        code: 'METHOD_NOT_ALLOWED',
        error: 'Method not allowed'
      });
    }

    try {
      const rawBody = await readRawBody(req);
      const result = await paymentService.handleRazorpayWebhook({
        headers: req.headers,
        rawBody
      });
      return sendJson(res, result.status, result.response);
    } catch (err) {
      console.error('[Server] Webhook handling error:', err.message);
      return sendJson(res, 500, {
        success: false,
        code: 'INTERNAL_ERROR',
        error: 'Internal server error processing webhook'
      });
    }
  }

  // 5. Server-Side Orders API
  if (pathname === '/api/orders' && req.method === 'POST') {
    try {
      const order = await parseJsonBody(req);
      order.receivedAt = new Date().toISOString();
      serverOrders.push(order);
      return sendJson(res, 201, { success: true, orderId: order.id });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // -----------------------------------------------------------
  // STATIC FILE SERVING & STANDALONE PORTAL ROUTING
  // -----------------------------------------------------------
  // Security block: Prevent static access to /server, hidden/dot files, and .env files
  const normalizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const pathSegments = normalizedPath.split(/[\\/]/).filter(Boolean);
  if (
    pathSegments.length > 0 && (
      pathSegments[0].toLowerCase() === 'server' ||
      pathSegments.some(seg => seg.startsWith('.')) ||
      normalizedPath.toLowerCase().startsWith('.env')
    )
  ) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const host = (req.headers.host || '').toLowerCase();
  const isPartnerDomain = host.startsWith('partner.');
  const isVendorDomain = host.startsWith('vendor.');
  const isRiderDomain = host.startsWith('rider.');
  const isAdminDomain = host.startsWith('admin.');

  let targetFile = pathname;
  if (pathname === '/') {
    if (isVendorDomain) targetFile = 'vendor.html';
    else if (isRiderDomain) targetFile = 'rider.html';
    else if (isAdminDomain) targetFile = 'admin.html';
    else if (isPartnerDomain) targetFile = 'partner.html';
    else targetFile = 'customer.html';
  } else if (pathname === '/vendor' || pathname === '/vendor/') {
    targetFile = 'vendor.html';
  } else if (pathname === '/rider' || pathname === '/rider/') {
    targetFile = 'rider.html';
  } else if (pathname === '/admin' || pathname === '/admin/') {
    targetFile = 'admin.html';
  } else if (pathname === '/partner' || pathname === '/partner/') {
    targetFile = 'partner.html';
  }

  let filePath = path.join(__dirname, targetFile);
  const relativeFromRoot = path.relative(__dirname, filePath);
  if (
    relativeFromRoot.startsWith('..') ||
    path.isAbsolute(relativeFromRoot) ||
    relativeFromRoot.toLowerCase().startsWith('server') ||
    relativeFromRoot.split(/[\\/]/).some(seg => seg.startsWith('.'))
  ) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      });
      res.end(content);
    }
  });
}

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Parcelकर V1 Server & REST API running at http://localhost:${PORT}/`);
  });
}

// Vercel serverless entrypoint
module.exports = handleRequest;
