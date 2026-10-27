const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8098;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/oci-card-application-documents/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(path.join(ROOT, 'oci-card-application-documents.html')));
    }
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

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});

server.listen(PORT, async () => {
    const tempProfile = path.join(ROOT, 'scratch', 'edge-temp-shot-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9258',
        `--user-data-dir=${tempProfile}`,
        '--disable-extensions'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const newTabRes = await fetch(`http://127.0.0.1:9258/json/new?about:blank`, { method: 'PUT' });
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

        await send('Page.enable');
        await send('Runtime.enable');

        // 1. Desktop Screenshot of /oci-card-application-documents/
        await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
        await send('Page.navigate', { url: `http://localhost:${PORT}/oci-card-application-documents/` });
        await new Promise(r => setTimeout(r, 2000));

        const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(ROOT, 'scratch', 'oci_docs_desktop_verified.png'), Buffer.from(shotDesktop.data, 'base64'));
        console.log('Saved scratch/oci_docs_desktop_verified.png');

        // 2. Mobile Screenshot of /oci-card-application-documents/
        await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 750, deviceScaleFactor: 2, mobile: true });
        await send('Page.navigate', { url: `http://localhost:${PORT}/oci-card-application-documents/` });
        await new Promise(r => setTimeout(r, 2000));

        const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(ROOT, 'scratch', 'oci_docs_mobile_verified.png'), Buffer.from(shotMobile.data, 'base64'));
        console.log('Saved scratch/oci_docs_mobile_verified.png');

        // 3. Desktop Screenshot of /oci-legal-guides/
        await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
        await send('Page.navigate', { url: `http://localhost:${PORT}/oci-legal-guides/` });
        await new Promise(r => setTimeout(r, 2000));

        const shotHub = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(ROOT, 'scratch', 'oci_hub_desktop_verified.png'), Buffer.from(shotHub.data, 'base64'));
        console.log('Saved scratch/oci_hub_desktop_verified.png');

        ws.close();
    } catch (e) {
        console.error(e);
    } finally {
        browser.kill();
        server.close();
        try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch(_) {}
    }
});
