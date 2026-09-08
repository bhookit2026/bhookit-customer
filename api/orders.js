const serverOrders = [];

module.exports = function orders(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, orders: serverOrders });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let raw = '';
  req.on('data', chunk => {
    raw += chunk;
    if (raw.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on('end', () => {
    try {
      const order = raw ? JSON.parse(raw) : {};
      order.receivedAt = new Date().toISOString();
      serverOrders.push(order);
      res.status(201).json({ success: true, orderId: order.id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};