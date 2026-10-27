const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8096;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/oci-legal-guides/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(path.join(ROOT, 'oci-legal-guides.html')));
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
    const tempProfile = path.join(ROOT, 'scratch', 'edge-temp-lazy-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9256',
        `--user-data-dir=${tempProfile}`,
        '--disable-extensions'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = `http://localhost:${PORT}/oci-legal-guides/`;
        const newTabRes = await fetch(`http://127.0.0.1:9256/json/new?${targetUrl}`, { method: 'PUT' });
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
        await new Promise(r => setTimeout(r, 1500));

        // Scroll down in steps to trigger lazy loading of all images
        await send('Runtime.evaluate', {
            expression: `(async () => {
                for (let y = 0; y <= document.body.scrollHeight; y += 400) {
                    window.scrollTo(0, y);
                    await new Promise(r => setTimeout(r, 50));
                }
            })()`,
            awaitPromise: true
        });

        await new Promise(r => setTimeout(r, 2000));

        const imgCheck = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `(() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => ({ src: i.src, alt: i.alt }));
                const loaded = imgs.filter(i => i.complete && i.naturalWidth > 0).map(i => ({ src: i.src, width: i.naturalWidth, height: i.naturalHeight }));
                return {
                    total: imgs.length,
                    loadedCount: loaded.length,
                    brokenCount: broken.length,
                    broken
                };
            })()`
        });

        console.log('Hub Page Image Check after scroll:', imgCheck.result.value);
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
