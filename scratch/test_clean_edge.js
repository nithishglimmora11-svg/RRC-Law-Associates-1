const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8092;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/oci-card-application-documents/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(path.join(ROOT, 'oci-card-application-documents.html')));
    }

    const diskPath = path.join(ROOT, pathname.replace(/^\/+/, ''));
    if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
        const ext = path.extname(diskPath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        return res.end(fs.readFileSync(diskPath));
    }

    console.log(`[404 NOT FOUND]: ${pathname}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
});

server.listen(PORT, async () => {
    const tempProfile = path.join(ROOT, 'scratch', 'edge-temp-fresh-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9254',
        `--user-data-dir=${tempProfile}`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = `http://localhost:${PORT}/oci-card-application-documents/`;
        const newTabRes = await fetch(`http://127.0.0.1:9254/json/new?${targetUrl}`, { method: 'PUT' });
        const tab = await newTabRes.json();
        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        await new Promise((res, rej) => {
            ws.addEventListener('open', res);
            ws.addEventListener('error', rej);
        });

        let id = 1;
        const send = (method, params = {}) => new Promise((res) => {
            const msgId = id++;
            const handler = (evt) => {
                const msg = JSON.parse(evt.data);
                if (msg.id === msgId) {
                    ws.removeEventListener('message', handler);
                    res(msg.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: msgId, method, params }));
        });

        const failed = [];
        ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
                failed.push({ url: msg.params.response.url, status: msg.params.response.status });
            }
        });

        await send('Network.enable');
        await send('Page.enable');
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 3000));

        const audit = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `({
                topbarPresent: !!document.querySelector('.rrc-topbar'),
                topbarPosition: window.getComputedStyle(document.querySelector('.rrc-topbar')).position,
                topbarBg: window.getComputedStyle(document.querySelector('.rrc-topbar')).backgroundColor,
                logoLoaded: document.querySelector('.header .logo-img').complete && document.querySelector('.header .logo-img').naturalWidth > 0,
                logoNaturalWidth: document.querySelector('.header .logo-img').naturalWidth,
                heroLoaded: document.querySelector('.article-visual img').complete && document.querySelector('.article-visual img').naturalWidth > 0,
                heroNaturalWidth: document.querySelector('.article-visual img').naturalWidth
            })`
        });
        console.log('DOM Evaluation:', audit.result.value);
        console.log(`Failed HTTP requests (${failed.length}):`, failed);

        ws.close();
    } catch (e) {
        console.error(e);
    } finally {
        browser.kill();
        server.close();
        try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch(_) {}
    }
});
