const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8097;
const ROOT = path.resolve(__dirname, '..');

const OCI_GUIDES = [
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
];

const OCI_SET = new Set(OCI_GUIDES);

const REFERENCE_PAGES = [
    'partners',
    'booking',
    'oci-card-assistance'
];

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. OCI clean URL with trailing slash: /slug/ -> slug.html
    const mOciTrailing = pathname.match(/^\/([a-z0-9-]+)\/$/);
    if (mOciTrailing && OCI_SET.has(mOciTrailing[1])) {
        const filePath = path.join(ROOT, `${mOciTrailing[1]}.html`);
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(fs.readFileSync(filePath));
        }
    }

    // 2. OCI without trailing slash: /slug -> 301 to /slug/
    const mOciNoTrailing = pathname.match(/^\/([a-z0-9-]+)$/);
    if (mOciNoTrailing && OCI_SET.has(mOciNoTrailing[1])) {
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

    console.log(`[SERVER 404]: ${pathname}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
});

server.listen(PORT, async () => {
    console.log(`Verification Server listening on port ${PORT}`);
    const tempProfile = path.join(ROOT, 'scratch', 'edge-temp-verify-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9257',
        `--user-data-dir=${tempProfile}`,
        '--disable-extensions'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const newTabRes = await fetch(`http://127.0.0.1:9257/json/new?about:blank`, { method: 'PUT' });
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

        await send('Network.enable');
        await send('Page.enable');
        await send('Runtime.enable');
        await send('DOM.enable');

        const VIEWPORTS = [
            { name: 'Desktop', width: 1280, height: 800 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Mobile', width: 375, height: 667 }
        ];

        const allResults = [];

        for (const slug of OCI_GUIDES) {
            const routeUrl = `http://localhost:${PORT}/${slug}/`;

            for (const vp of VIEWPORTS) {
                await send('Emulation.setDeviceMetricsOverride', {
                    width: vp.width,
                    height: vp.height,
                    deviceScaleFactor: 1,
                    mobile: vp.name === 'Mobile'
                });

                const failedRequests = [];
                const netHandler = (evt) => {
                    const msg = JSON.parse(evt.data);
                    if (msg.method === 'Network.responseReceived') {
                        const url = msg.params.response.url;
                        if (msg.params.response.status >= 400 && url.includes(`localhost:${PORT}`)) {
                            failedRequests.push({ url, status: msg.params.response.status });
                        }
                    }
                };
                ws.addEventListener('message', netHandler);

                await send('Page.navigate', { url: routeUrl });
                await new Promise(r => setTimeout(r, 1000));

                // Scroll to bottom to trigger lazy-loaded images, then back to top
                await send('Runtime.evaluate', {
                    expression: `(async () => {
                        window.scrollTo(0, document.body.scrollHeight);
                        await new Promise(r => setTimeout(r, 200));
                        window.scrollTo(0, 0);
                    })()`,
                    awaitPromise: true
                });
                await new Promise(r => setTimeout(r, 800));

                const evalResult = await send('Runtime.evaluate', {
                    returnByValue: true,
                    expression: `(() => {
                        const topbar = document.querySelector('.rrc-topbar');
                        const topbarStyles = topbar ? window.getComputedStyle(topbar) : null;
                        const header = document.querySelector('.header');
                        const headerStyles = header ? window.getComputedStyle(header) : null;
                        
                        const logoImg = document.querySelector('.header .logo-img');
                        const logoLoaded = logoImg ? (logoImg.complete && logoImg.naturalWidth > 0) : false;
                        const logoWidth = logoImg ? logoImg.naturalWidth : 0;
                        const logoSrc = logoImg ? logoImg.src : null;

                        const heroImg = document.querySelector('.article-visual img, .hero-image img, .featured-image');
                        const heroLoaded = heroImg ? (heroImg.complete && heroImg.naturalWidth > 0) : null;
                        const heroWidth = heroImg ? heroImg.naturalWidth : null;

                        const allImgs = Array.from(document.querySelectorAll('img'));
                        const brokenImgs = allImgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);

                        const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

                        let mobileMenuWorks = null;
                        const menuToggle = document.getElementById('menuToggle');
                        const mobileMenu = document.getElementById('mobileMenu');
                        if (menuToggle && mobileMenu) {
                            menuToggle.click();
                            mobileMenuWorks = mobileMenu.classList.contains('active');
                            const closeBtn = document.getElementById('closeMenu');
                            if (closeBtn) closeBtn.click();
                        }

                        // Check contact details in topbar
                        const phoneLink = document.querySelector('.rrc-topbar a[href^="tel:"]');
                        const emailLink = document.querySelector('.rrc-topbar a[href^="mailto:"]');

                        return {
                            topbarPresent: !!topbar,
                            topbarPosition: topbarStyles ? topbarStyles.position : null,
                            topbarBg: topbarStyles ? topbarStyles.backgroundColor : null,
                            topbarPhone: phoneLink ? phoneLink.textContent.trim() : null,
                            topbarEmail: emailLink ? emailLink.textContent.trim() : null,
                            headerTop: headerStyles ? headerStyles.top : null,
                            logoLoaded,
                            logoWidth,
                            heroLoaded,
                            heroWidth,
                            totalImgs: allImgs.length,
                            brokenImgs,
                            hasOverflow,
                            mobileMenuWorks
                        };
                    })()`
                });

                ws.removeEventListener('message', netHandler);

                const resVal = evalResult.result.value;
                const passed = resVal.topbarPresent &&
                               resVal.topbarPosition === 'fixed' &&
                               resVal.logoLoaded &&
                               (resVal.heroLoaded === null || resVal.heroLoaded === true) &&
                               resVal.brokenImgs.length === 0 &&
                               failedRequests.length === 0 &&
                               !resVal.hasOverflow &&
                               (vp.name !== 'Mobile' || resVal.mobileMenuWorks === true);

                const summary = {
                    slug,
                    viewport: vp.name,
                    passed,
                    topbarPosition: resVal.topbarPosition,
                    topbarBg: resVal.topbarBg,
                    topbarPhone: resVal.topbarPhone,
                    topbarEmail: resVal.topbarEmail,
                    headerTop: resVal.headerTop,
                    logoLoaded: resVal.logoLoaded,
                    heroLoaded: resVal.heroLoaded,
                    brokenImgsCount: resVal.brokenImgs.length,
                    failedHttpCount: failedRequests.length,
                    hasOverflow: resVal.hasOverflow,
                    mobileMenuWorks: resVal.mobileMenuWorks
                };

                allResults.push(summary);
                console.log(`[${vp.name}] /${slug}/: ${passed ? 'PASS' : 'FAIL'} (brokenImgs=${resVal.brokenImgs.length}, 404s=${failedRequests.length}, logo=${resVal.logoLoaded}, hero=${resVal.heroLoaded}, overflow=${resVal.hasOverflow}, menu=${resVal.mobileMenuWorks})`);
            }
        }

        console.log(`\n==================================================`);
        console.log(`TESTING 3 REFERENCE PAGES`);
        console.log(`==================================================`);
        const refResults = {};
        for (const ref of REFERENCE_PAGES) {
            const refUrl = `http://localhost:${PORT}/${ref}`;
            await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
            await send('Page.navigate', { url: refUrl });
            await new Promise(r => setTimeout(r, 1000));
            await send('Runtime.evaluate', {
                expression: `(async () => {
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(r => setTimeout(r, 200));
                    window.scrollTo(0, 0);
                })()`,
                awaitPromise: true
            });
            await new Promise(r => setTimeout(r, 500));

            const refEval = await send('Runtime.evaluate', {
                returnByValue: true,
                expression: `(() => {
                    const topbar = document.querySelector('.rrc-topbar');
                    const header = document.querySelector('.header');
                    const logoImg = document.querySelector('.header .logo-img');
                    const allImgs = Array.from(document.querySelectorAll('img'));
                    const broken = allImgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
                    return {
                        topbarPresent: !!topbar,
                        headerPresent: !!header,
                        logoLoaded: logoImg ? (logoImg.complete && logoImg.naturalWidth > 0) : false,
                        totalImgs: allImgs.length,
                        brokenImgs: broken
                    };
                })()`
            });
            refResults[ref] = refEval.result.value;
            console.log(`Reference page /${ref}:`, refEval.result.value);
        }

        const totalPassed = allResults.filter(r => r.passed).length;
        console.log(`\n==================================================`);
        console.log(`FINAL RESULT: ${totalPassed} / ${allResults.length} TESTS PASSED!`);
        console.log(`==================================================`);

        fs.writeFileSync(path.join(ROOT, 'scratch', 'final_test_summary.json'), JSON.stringify({ ociTests: allResults, referencePages: refResults }, null, 2));

        ws.close();
    } catch (e) {
        console.error('Error during suite run:', e);
    } finally {
        browser.kill();
        server.close();
        try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch(_) {}
    }
});
