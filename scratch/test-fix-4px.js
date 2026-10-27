const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8087;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(process.cwd(), reqPath.replace(/^\//, ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, async () => {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const userDataDir = path.join(process.cwd(), 'scratch', 'edge-temp-profile3');
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9224',
        '--disable-gpu',
        '--no-sandbox',
        `--user-data-dir=${userDataDir}`,
        'about:blank'
    ]);

    await new Promise(r => setTimeout(r, 2000));
    const newPageRes = await fetch('http://127.0.0.1:9224/json/new', { method: 'PUT' });
    const pageData = await newPageRes.json();

    const ws = new WebSocket(pageData.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function sendCommand(method, params = {}) {
        return new Promise(resolve => {
            const id = msgId++;
            const handler = (event) => {
                const data = JSON.parse(event.data);
                if (data.id === id) {
                    ws.removeEventListener('message', handler);
                    resolve(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
        width: 320,
        height: 640,
        deviceScaleFactor: 1,
        mobile: true
    });

    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/oci-card-benefits-restrictions-india.html` });
    await new Promise(r => setTimeout(r, 1500));

    // Test fix by injecting CSS style
    await sendCommand('Runtime.evaluate', {
        expression: `
            const s = document.createElement('style');
            s.innerHTML = '@media (max-width: 991px) { .article-container { padding-left: 24px; padding-right: 24px; } .row.g-5 { --bs-gutter-x: 1.5rem; } }';
            document.head.appendChild(s);
        `
    });

    await new Promise(r => setTimeout(r, 500));

    const evalRes = await sendCommand('Runtime.evaluate', {
        expression: `
            (() => {
                const winW = window.innerWidth;
                const docW = document.documentElement.scrollWidth;
                const bodyW = document.body.scrollWidth;
                return {
                    docScrollWidth: docW,
                    bodyScrollWidth: bodyW,
                    windowInnerWidth: winW,
                    overflow: Math.max(docW, bodyW) - winW
                };
            })()
        `,
        returnByValue: true
    });

    console.log('Result after fix:', JSON.stringify(evalRes?.result?.value, null, 2));

    browser.kill();
    server.close();
    process.exit(0);
});
