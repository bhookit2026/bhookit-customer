const crypto = require('crypto');

const RZP_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_BhookIt_Demo';
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'bhookit_rzp_mock_secret_key_2026';

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
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

module.exports = async function createOrder(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await parseJsonBody(req);
    const amount = Number(body.amount) || 0;
    const orderId = body.orderId || 'FB-' + Date.now();

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    const rzpOrderId = 'order_' + crypto.randomBytes(8).toString('hex');
    const amountInPaise = Math.round(amount * 100);
    const preSignData = `${rzpOrderId}|${amountInPaise}`;
    const mockSignature = crypto.createHmac('sha256', RZP_KEY_SECRET).update(preSignData).digest('hex');

    return res.status(200).json({
      success: true,
      gateway: 'Razorpay / UPI Instant',
      order_id: rzpOrderId,
      internal_order_id: orderId,
      amount: amountInPaise,
      currency: 'INR',
      key_id: RZP_KEY_ID,
      mock_signature: mockSignature,
      created_at: Math.floor(Date.now() / 1000)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};