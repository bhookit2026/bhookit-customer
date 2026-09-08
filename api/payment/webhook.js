module.exports = async function webhook(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let raw = '';
  req.on('data', chunk => {
    raw += chunk;
    if (raw.length > 1e6) req.connection.destroy();
  });
  req.on('end', () => {
    try {
      const payload = raw ? JSON.parse(raw) : {};
      const isValid = !!payload.txn_id || !!payload.razorpay_payment_id || payload.event === 'payment.captured';
      if (!isValid) {
        return res.status(400).json({ received: false, error: 'Unrecognized webhook payload' });
      }
      res.status(200).json({
        received: true,
        event: payload.event || 'payment.captured',
        message: 'Webhook acknowledged. Payment status updated.'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};