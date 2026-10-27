/**
 * RRC Law Associates — Local Development Server
 * 
 * Provides an exact local emulation of Apache / LiteSpeed .htaccess routing,
 * including clean URL resolution (e.g. /wills-probate-estate-administration -> wills-probate-estate-administration.html),
 * trailing-slash normalization, and static asset streaming.
 * 
 * Zero dependencies — runs on standard Node.js.
 * Usage: node dev-server.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = parseInt(process.argv[2] || process.env.PORT || '5502', 10);
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.xml': 'application/xml; charset=UTF-8',
    '.webmanifest': 'application/manifest+json'
};

function sendFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': data.length,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
    }

    const parsedUrl = url.parse(req.url);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Root mapping
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const fullPath = path.join(ROOT, pathname);

    // 1. Exact file match
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        sendFile(res, fullPath, contentType);
        return;
    }

    // 2. Trailing slash redirect (mirroring .htaccess)
    if (pathname.length > 1 && pathname.endsWith('/')) {
        const trimmed = pathname.slice(0, -1);
        const candidateHtml = path.join(ROOT, trimmed + '.html');
        if (fs.existsSync(candidateHtml) && fs.statSync(candidateHtml).isFile()) {
            res.writeHead(301, {
                'Location': trimmed + (parsedUrl.search || '')
            });
            res.end();
            return;
        }
    }

    // 3. Clean URL rewrite: pathname -> pathname.html (mirroring .htaccess RewriteRule ^([^/]+)$ $1.html [L])
    const candidateHtml = path.join(ROOT, pathname + '.html');
    if (fs.existsSync(candidateHtml) && fs.statSync(candidateHtml).isFile()) {
        sendFile(res, candidateHtml, MIME_TYPES['.html']);
        return;
    }

    // 4. 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>The requested URL ${pathname} was not found on this server.</p></body></html>`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${DEFAULT_PORT} is in use. Trying port ${DEFAULT_PORT + 1}...`);
        server.listen(DEFAULT_PORT + 1);
    } else {
        console.error('Server error:', err);
    }
});

server.listen(DEFAULT_PORT, '127.0.0.1', () => {
    const address = server.address();
    console.log(`[RRC Dev Server] Running at http://127.0.0.1:${address.port}/`);
    console.log(`[RRC Dev Server] Clean URLs (/wills-probate-estate-administration) fully supported.`);
});

