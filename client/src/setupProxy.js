// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8070',
            //target: 'http://15.165.124.19:8070',
            changeOrigin: true,
            pathRewrite: { '^/api': '' }, 
            // 프론트는 '/api/member/...' -> 서버에는 '/member/...'
        })
    );

    
    // WebSocket 프록시
    app.use(
        '/ws',
        createProxyMiddleware({
            target: 'http://localhost:8070',
            //target: 'http://15.165.124.19:8070',
            changeOrigin: true,
            ws: true,  // 웹소켓 허용
             pathRewrite: { "^/ws": "/ws"  }, // 실제 서버 경로
        })
    );
};