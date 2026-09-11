// api/settings.js
// Vercel Serverless Function to sync platform settings across all subdomains & devices

let globalSettings = {
  riderDeliveryCommission: 30,
  deliveryBase: 30,
  hideDeliveryCharges: true,
  deliveryAutoAddStrategy: 'cart_split',
  deliveryItemFlatAmount: 15,
  perKm: 8,
  gstRate: 5,
  platformFee: 5,
  defaultCommission: 10
};

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, settings: globalSettings });
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e5) req.connection.destroy();
    });
    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        if (payload && typeof payload === 'object') {
          globalSettings = { ...globalSettings, ...payload };
        }
        return res.status(200).json({ success: true, settings: globalSettings });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    });
    return;
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
