const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8098;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/oci-card-assistance' || pathname === '/oci-card-assistance.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(path.join(ROOT, 'oci-card-assistance.html')));
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
            '.mp4': 'video/mp4',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.webmanifest': 'application/manifest+json'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        return res.end(fs.readFileSync(diskPath));
    }

    console.log(`[404 NOT FOUND]: ${pathname}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
});

server.listen(PORT, async () => {
    const tempProfile = path.join(ROOT, 'scratch', 'edge-temp-assist-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9258',
        `--user-data-dir=${tempProfile}`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = `http://localhost:${PORT}/oci-card-assistance.html`;
        const newTabRes = await fetch(`http://127.0.0.1:9258/json/new?${targetUrl}`, { method: 'PUT' });
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

        const failedReqs = [];
        const consoleMessages = [];

        ws.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data);
            if (data.method === 'Network.responseReceived') {
                if (data.params.response.status >= 400) {
                    failedReqs.push({
                        url: data.params.response.url,
                        status: data.params.response.status
                    });
                }
            }
            if (data.method === 'Runtime.consoleAPICalled') {
                consoleMessages.push(data.params.args.map(a => a.value).join(' '));
            }
        });

        await send('Page.enable');
        await send('Network.enable');
        await send('Runtime.enable');

        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 3500));

        // Scroll down to trigger lazy images
        await send('Runtime.evaluate', {
            expression: `window.scrollTo(0, document.body.scrollHeight)`
        });
        await new Promise(r => setTimeout(r, 2000));

        // Evaluate layout, elements, logos, images, videos
        const evalRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const headerLogo = document.querySelector('header .logo-img');
                const footerLogo = document.querySelector('footer .logo-img');
                const topbar = document.querySelector('.rrc-topbar');
                const videos = Array.from(document.querySelectorAll('video.oci-hero-video')).map(v => ({
                    id: v.id,
                    src: v.getAttribute('src'),
                    currentSrc: v.currentSrc,
                    readyState: v.readyState
                }));
                const blogImgs = Array.from(document.querySelectorAll('.oci-guide-img-wrap img')).map(img => ({
                    src: img.getAttribute('src'),
                    complete: img.complete,
                    naturalWidth: img.naturalWidth
                }));

                return {
                    title: document.title,
                    topbarPresent: !!topbar,
                    topbarVisible: topbar ? window.getComputedStyle(topbar).display !== 'none' : false,
                    headerLogoSrc: headerLogo ? headerLogo.getAttribute('src') : null,
                    headerLogoNaturalWidth: headerLogo ? headerLogo.naturalWidth : 0,
                    footerLogoSrc: footerLogo ? footerLogo.getAttribute('src') : null,
                    footerLogoNaturalWidth: footerLogo ? footerLogo.naturalWidth : 0,
                    videoCount: videos.length,
                    videos: videos,
                    blogImgCount: blogImgs.length,
                    blogImgs: blogImgs
                };
            })()`,
            returnByValue: true
        });

        console.log('=== Browser Evaluation Results ===');
        console.log(JSON.stringify(evalRes.result.value, null, 2));

        console.log('\n=== Failed HTTP Requests ===');
        console.log(failedReqs);

        console.log('\n=== Console Messages ===');
        console.log(consoleMessages.filter(m => !m.includes('favicon')));

        ws.close();
    } catch (e) {
        console.error('Test error:', e);
    } finally {
        browser.kill();
        server.close();
        process.exit(0);
    }
});
