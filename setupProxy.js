const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware...');
  
  const proxyOptions = {
    target: 'http://localhost:3001',
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ 
        error: 'Proxy error',
        details: err.message 
      }));
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request: ${req.method} ${req.path} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`Received response: ${proxyRes.statusCode} ${req.method} ${req.path}`);
    }
  };

  app.use(
    '/api',
    createProxyMiddleware(proxyOptions)
  );
  
  console.log('Proxy middleware configured for /api -> http://localhost:3001');
};
