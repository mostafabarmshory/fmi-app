const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://181.174.164.148:8765',
			changeOrigin: true,
		})
	);
};