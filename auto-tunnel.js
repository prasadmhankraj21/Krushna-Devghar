const { spawn } = require('child_process');

function startTunnel() {
  console.log('[Auto-Tunnel] Connecting to serveo.net...');
  const proc = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=15',
    '-o', 'ServerAliveCountMax=3',
    '-R', '80:localhost:5000',
    'serveo.net'
  ]);

  proc.stdout.on('data', (data) => {
    const text = data.toString();
    console.log('[Auto-Tunnel URL]:\n' + text.trim());
  });

  proc.stderr.on('data', (data) => {
    console.error('[Auto-Tunnel Status]:', data.toString().trim());
  });

  proc.on('close', (code) => {
    console.log(`[Auto-Tunnel] Disconnected with code ${code}. Reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
