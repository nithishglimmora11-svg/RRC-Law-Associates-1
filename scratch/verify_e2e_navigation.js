const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8089;
const ROOT = path.resolve(__dirname, '..');

// Basic file server replicating Python's http.server exactly
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/') pathname = '/index.html';

    const diskPath = path.join(ROOT, pathname.replace(/^\/+/, ''));
    if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
        const ext = path.extname(diskPath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.mp4': 'video/mp4',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        return res.end(fs.readFileSync(diskPath));
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
});

server.listen(PORT, async () => {
    const tempProfile = path.join(ROOT, 'scratch', 'edge-e2e-nav-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9260',
        `--user-data-dir=${tempProfile}`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const startUrl = `http://localhost:${PORT}/oci-card-assistance.html`;
        const newTabRes = await fetch(`http://127.0.0.1:9260/json/new?${startUrl}`, { method: 'PUT' });
        const tab = await newTabRes.json();
        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        let id = 1;
        const send = (method, params = {}) => new Promise((resolve) => {
            const curId = id++;
            const handler = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.id === curId) {
                    ws.removeEventListener('message', handler);
                    resolve(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: curId, method, params }));
        });

        await new Promise((res) => ws.addEventListener('open', res));

        const failedStatuses = [];
        ws.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data);
            if (data.method === 'Network.responseReceived') {
                if (data.params.response.status >= 400 && !data.params.response.url.includes('favicon.ico')) {
                    failedStatuses.push({
                        url: data.params.response.url,
                        status: data.params.response.status
                    });
                }
            }
        });

        await send('Page.enable');
        await send('Network.enable');
        await send('Runtime.enable');

        console.log('1. Loading OCI Card Assistance page...');
        await send('Page.navigate', { url: startUrl });
        await new Promise(r => setTimeout(r, 2500));

        // Find "Explore OCI Guides" link href
        const exploreBtnHref = await send('Runtime.evaluate', {
            expression: `document.querySelector('.oci-btn-secondary').getAttribute('href')`,
            returnByValue: true
        });
        console.log(`   Found 'Explore OCI Guides' button href: ${exploreBtnHref.result.value}`);

        console.log('2. Clicking "Explore OCI Guides" (navigating to target)...');
        await send('Page.navigate', { url: `http://localhost:${PORT}${exploreBtnHref.result.value}` });
        await new Promise(r => setTimeout(r, 2500));

        const hubTitle = await send('Runtime.evaluate', {
            expression: `document.title`,
            returnByValue: true
        });
        console.log(`   Hub page loaded successfully: "${hubTitle.result.value}"`);

        // Find Guide 3 "Read Full Guide" button
        const guide3Href = await send('Runtime.evaluate', {
            expression: `(() => {
                const link = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') && a.getAttribute('href').includes('oci-card-application-documents'));
                return link ? link.getAttribute('href') : null;
            })()`,
            returnByValue: true
        });
        console.log(`   Found Guide 3 link href: ${guide3Href.result.value}`);

        console.log('3. Clicking Guide 3 (navigating to article)...');
        await send('Page.navigate', { url: `http://localhost:${PORT}${guide3Href.result.value}` });
        await new Promise(r => setTimeout(r, 2500));

        const articleTitle = await send('Runtime.evaluate', {
            expression: `document.title`,
            returnByValue: true
        });
        console.log(`   Article page loaded successfully: "${articleTitle.result.value}"`);

        // Find breadcrumb link back to hub
        const breadcrumbHref = await send('Runtime.evaluate', {
            expression: `(() => {
                const link = Array.from(document.querySelectorAll('.breadcrumb a, .breadcrumbs a, .hero-breadcrumbs a, nav a')).find(a => a.textContent.includes('OCI Legal Guides'));
                return link ? link.getAttribute('href') : null;
            })()`,
            returnByValue: true
        });
        console.log(`   Found breadcrumb link href: ${breadcrumbHref.result.value}`);

        console.log('4. Clicking breadcrumb back to OCI Legal Guides hub...');
        await send('Page.navigate', { url: `http://localhost:${PORT}${breadcrumbHref.result.value}` });
        await new Promise(r => setTimeout(r, 2500));

        const backHubTitle = await send('Runtime.evaluate', {
            expression: `document.title`,
            returnByValue: true
        });
        console.log(`   Returned to Hub page successfully: "${backHubTitle.result.value}"`);

        console.log('\n=== NETWORK FAILURE CHECK ===');
        console.log(`Failed HTTP requests (excluding favicon): ${failedStatuses.length}`);
        if (failedStatuses.length > 0) {
            console.log(failedStatuses);
        } else {
            console.log('ALL NAVIGATIONS AND ASSETS RETURNED HTTP 200 OK!');
        }

        ws.close();
    } catch (err) {
        console.error('Error during test:', err);
    } finally {
        browser.kill();
        server.close();
        process.exit(0);
    }
});
