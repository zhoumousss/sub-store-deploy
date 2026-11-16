// Launcher for the Sub-Store backend bundle.
//
// The official Sub-Store bundle always listens on port 3000 and ignores the
// PORT environment variable. PaaS platforms usually assign their own port
// through PORT, so when PORT differs from 3000 this launcher also runs a
// small reverse proxy from PORT to 127.0.0.1:3000.
const { spawn } = require('child_process');
const http = require('http');

const TARGET_PORT = 3000;
const platformPort = process.env.PORT ? parseInt(process.env.PORT, 10) : null;

const child = spawn('node', ['sub-store.bundle.js'], {
  stdio: 'inherit',
  env: process.env,
});
child.on('exit', (code) => process.exit(code == null ? 1 : code));

if (platformPort && platformPort !== TARGET_PORT) {
  const server = http.createServer((req, res) => {
    const upstream = http.request(
      {
        host: '127.0.0.1',
        port: TARGET_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (up) => {
        res.writeHead(up.statusCode || 502, up.headers);
        up.pipe(res);
      }
    );
    upstream.on('error', () => {
      if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('backend is starting');
    });
    req.pipe(upstream);
  });
  server.listen(platformPort, () =>
    console.log(`[launcher] proxy listening on ${platformPort} -> ${TARGET_PORT}`)
  );
}
