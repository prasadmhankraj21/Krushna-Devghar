const localtunnel = require('./backend/node_modules/localtunnel');

(async () => {
  try {
    const subdomain = 'krushna-devghar-' + Math.floor(1000 + Math.random() * 9000);
    const tunnel = await localtunnel({ port: 5000, subdomain });
    console.log('=== TUNNEL READY ===');
    console.log('TUNNEL_LIVE_URL:' + tunnel.url);
    console.log('====================');
    
    tunnel.on('close', () => {
      console.log('Tunnel was closed');
    });
    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
  }
})();
