const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
  app.use(
    '/api0',
    createProxyMiddleware({
      target: 'https://localhost:8000',
      //target: 'https://192.168.21.199:8041',      
      changeOrigin: true,
      pathRewrite: {
        '^/api0': '/api'
      },
    })
  );
  app.use(
    '/api2',
    createProxyMiddleware({
      target: 'https://localhost:8000',
      //target: 'https://192.168.21.199:8041',   
      changeOrigin: true,
      pathRewrite: {
        '^/api2': '/api'  
      }    
    })
  );
}; 