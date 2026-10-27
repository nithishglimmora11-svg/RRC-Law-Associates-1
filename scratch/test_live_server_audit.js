const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8088;
const ROOT = path.resolve(__dirname, '..');

const OCI_GUIDES = new Set([
    'oci-legal-guides',
    'oci-card-eligibility-legal-status',
    'oci-vs-nri-vs-indian-citizen',
    'oci-card-application-documents',
    'oci-card-indian-ancestry-assistance',
    'oci-foreign-spouse-eligibility',
    'oci-for-children-born-abroad',
    'oci-card-benefits-restrictions-india',
    'oci-cardholders-inherit-sell-ancestral-property-india',
    'nri-oci-property-due-diligence-india',
    'nri-oci-property-tax-india',
    'oci-card-renewal-passport-update',
    'oci-card-cancellation-grounds-remedies',
    'oci-card-cancellation-section-7d-legal-remedies'
]);

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. OCI clean URL with trailing slash: /slug/ -> slug.html
    const mOciTrailing = pathname.match(/^\/([a-z0-9-]+)\/$/);
    if (mOciTrailing && OCI_GUIDES.has(mOciTrailing[1])) {
        const filePath = path.join(ROOT, `${mOciTrailing[1]}.html`);
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(fs.readFileSync(filePath));
        }
    }

    // 2. OCI without trailing slash: /slug -> 301 to /slug/
    const mOciNoTrailing = pathname.match(/^\/([a-z0-9-]+)$/);
    if (mOciNoTrailing && OCI_GUIDES.has(mOciNoTrailing[1])) {
        res.writeHead(301, { 'Location': `/${mOciNoTrailing[1]}/` });
        return res.end();
    }

    // 3. Root / -> index.html
    if (pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(path.join(ROOT, 'index.html')));
    }

    // 4. Clean non-OCI pages: /partners -> partners.html
    if (mOciNoTrailing) {
        const htmlFile = path.join(ROOT, `${mOciNoTrailing[1]}.html`);
        if (fs.existsSync(htmlFile)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(fs.readFileSync(htmlFile));
        }
    }

    // 5. Static files directly from ROOT
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

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
});

server.listen(PORT, async () => {
    console.log(`Apache simulation server listening on port ${PORT}`);

    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9252',
        '--user-data-dir=C:\\Users\\nithi\\RRC-Law-Associates-1\\scratch\\edge-temp-profile5'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = `http://localhost:${PORT}/oci-card-application-documents/`;
        const newTabRes = await fetch(`http://127.0.0.1:9252/json/new?${targetUrl}`, { method: 'PUT' });
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

        const failedRequests = [];
        ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Network.responseReceived') {
                if (msg.params.response.status >= 400) {
                    failedRequests.push({
                        url: msg.params.response.url,
                        status: msg.params.response.status
                    });
                }
            }
        });

        await send('Network.enable');
        await send('Page.enable');
        await send('Runtime.enable');
        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 2500));

        // Evaluate state of header, logo, and images
        const auditResult = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `(() => {
                const topbar = document.querySelector('.rrc-topbar');
                const topbarStyles = topbar ? window.getComputedStyle(topbar) : null;
                const header = document.querySelector('.header');
                const headerStyles = header ? window.getComputedStyle(header) : null;
                
                const logoImg = document.querySelector('.header .logo-img');
                const logoComplete = logoImg ? logoImg.complete : false;
                const logoNaturalWidth = logoImg ? logoImg.naturalWidth : 0;
                const logoSrc = logoImg ? logoImg.src : null;

                const heroImg = document.querySelector('.article-visual img');
                const heroComplete = heroImg ? heroImg.complete : false;
                const heroNaturalWidth = heroImg ? heroImg.naturalWidth : 0;
                const heroSrc = heroImg ? heroImg.src : null;

                return {
                    topbarPresent: !!topbar,
                    topbarPosition: topbarStyles ? topbarStyles.position : null,
                    topbarBg: topbarStyles ? topbarStyles.backgroundColor : null,
                    topbarHeight: topbar ? topbar.offsetHeight : null,
                    headerTop: headerStyles ? headerStyles.top : null,
                    logoSrc,
                    logoLoaded: logoComplete && logoNaturalWidth > 0,
                    logoNaturalWidth,
                    heroSrc,
                    heroLoaded: heroComplete && heroNaturalWidth > 0,
                    heroNaturalWidth
                };
            })()`
        });

        console.log('\n=== BASELINE RUN AUDIT ON CURRENT CODE: /oci-card-application-documents/ ===');
        console.log('Audit Results:', JSON.stringify(auditResult.result.value, null, 2));
        console.log(`Failed HTTP requests (${failedRequests.length}):`, failedRequests);

        ws.close();
    } catch (err) {
        console.error('Error during test:', err);
    } finally {
        browser.kill();
        server.close();
    }
});
