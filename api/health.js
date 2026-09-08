module.exports = function health(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'healthy',
    system: 'BhookIt V1 Engine (Vercel)',
    version: '11.2.0',
    timestamp: new Date().toISOString()
  });
};