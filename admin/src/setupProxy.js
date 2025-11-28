// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://15.165.124.19:8070',
            changeOrigin: true,
            pathRewrite: { '^/api': '' }, 
            // 프론트는 '/api/member/...' -> 서버에는 '/member/...'
        })
    );
};