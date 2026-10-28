const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PORT = 9272;
const PROFILE_DIR = path.resolve(__dirname, 'chrome_qa_profile_seo');

const BASE_URL = 'http://127.0.0.1:5502';
const PAGES_TO_TEST = [
    '/nri-power-of-attorney',
    '/nri-property-disputes',
    '/cheque-bounce-lawyer',
    '/litigation-dispute-resolution',
    '/property-law',
    '/',
    '/wills-probate-estate-administration',
    '/nri-landlord-tenant-eviction/',
    '/nri-rera-builder-disputes/',
    '/nri-business-commercial-advisory/'
];

const VIEWPORTS = [320, 375, 430, 768, 1024, 1440];

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

class CdpClient {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
        this.id = 1;
        this.callbacks = new Map();
        this.events = [];
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method) this.events.push(msg);
            if (msg.id && this.callbacks.has(msg.id)) {
                const { resolve, reject } = this.callbacks.get(msg.id);
                this.callbacks.delete(msg.id);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
            }
        };
    }

    ready() {
        return new Promise(resolve => {
            if (this.ws.readyState === WebSocket.OPEN) return resolve();
            this.ws.onopen = () => resolve();
        });
    }

    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const reqId = this.id++;
            this.callbacks.set(reqId, { resolve, reject });
            this.ws.send(JSON.stringify({ id: reqId, method, params }));
        });
    }

    async evaluate(expression) {
        const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        return res?.result?.value;
    }

    async setViewport(width, height) {
        await this.send('Emulation.setDeviceMetricsOverride', {
            width,
            height,
            deviceScaleFactor: 1,
            mobile: width < 992
        });
    }

    close() { this.ws.close(); }
}

async function run() {
    console.log("==================================================================");
    console.log("      COMPREHENSIVE TECHNICAL, RESPONSIVE & ROUTING QA");
    console.log("==================================================================\n");

    if (fs.existsSync(PROFILE_DIR)) {
        try { fs.rmSync(PROFILE_DIR, { recursive: true, force: true }); } catch (e) {}
    }
    fs.mkdirSync(PROFILE_DIR, { recursive: true });

    const chromeProcess = spawn(CHROME_PATH, [
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--no-first-run',
        '--no-default-browser-check',
        '--headless=new',
        '--disable-gpu',
        'about:blank'
    ]);

    await sleep(2500);

    let endpoints;
    for (let i = 0; i < 5; i++) {
        try {
            endpoints = await getJson(`http://127.0.0.1:${CHROME_PORT}/json`);
            break;
        } catch (e) {
            await sleep(1000);
        }
    }

    if (!endpoints || endpoints.length === 0) {
        console.error("Failed to connect to Chrome debug endpoint.");
        chromeProcess.kill();
        process.exit(1);
    }

    const pageTarget = endpoints.find(e => e.type === 'page');
    const cdp = new CdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.ready();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');

    const results = [];
    let allPassed = true;

    for (const pagePath of PAGES_TO_TEST) {
        const fullUrl = BASE_URL + pagePath;
        console.log(`\n------------------------------------------------------------`);
        console.log(`Testing Route: ${pagePath} (${fullUrl})`);
        console.log(`------------------------------------------------------------`);

        // Navigate
        await cdp.send('Page.navigate', { url: fullUrl });
        await sleep(1500);

        // Check basic page title, h1, canonical
        const meta = await cdp.evaluate(`(() => {
            const title = document.title;
            const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : null;
            const canonical = document.querySelector('link[rel="canonical"]') ? document.querySelector('link[rel="canonical"]').getAttribute('href') : null;
            return { title, h1, canonical };
        })()`);

        console.log(`  Title:     ${meta?.title}`);
        console.log(`  H1:        ${meta?.h1}`);
        console.log(`  Canonical: ${meta?.canonical}`);

        // Scroll to trigger lazy loading
        await cdp.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
        await sleep(800);
        await cdp.evaluate(`window.scrollTo(0, 0)`);
        await sleep(300);

        // Test images
        const imageCheck = await cdp.evaluate(`(() => {
            const imgs = Array.from(document.querySelectorAll('img'));
            const broken = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src || img.getAttribute('src'));
            return { total: imgs.length, brokenCount: broken.length, broken: broken.slice(0, 5) };
        })()`);
        console.log(`  Images:    ${imageCheck?.total} total, ${imageCheck?.brokenCount} broken`);
        if (imageCheck?.brokenCount > 0) {
            console.log(`    Broken samples:`, imageCheck.broken);
            allPassed = false;
        }

        // Test Accordions (if present)
        const accordionCheck = await cdp.evaluate(`(() => {
            const btns = Array.from(document.querySelectorAll('.accordion-button'));
            if (btns.length === 0) return { present: false, count: 0 };
            return { present: true, count: btns.length };
        })()`);
        if (accordionCheck?.present) {
            console.log(`  Accordion: Found ${accordionCheck.count} FAQ items`);
        }

        // Test Viewport Responsiveness
        console.log(`  Responsive Viewports Check (0px Horizontal Overflow):`);
        for (const vp of VIEWPORTS) {
            await cdp.setViewport(vp, 800);
            await sleep(300);

            const overflow = await cdp.evaluate(`(() => {
                const scrollWidth = document.documentElement.scrollWidth;
                const clientWidth = document.documentElement.clientWidth;
                return {
                    scrollWidth,
                    clientWidth,
                    overflow: scrollWidth > clientWidth,
                    diff: scrollWidth - clientWidth
                };
            })()`);

            const status = overflow?.overflow ? `FAIL (${overflow.diff}px overflow)` : `PASS`;
            console.log(`    [${vp}px]: ${status}`);
            if (overflow?.overflow) allPassed = false;
        }

        results.push({
            page: pagePath,
            title: meta?.title ? meta.title.slice(0, 45) + '...' : 'None',
            canonical: meta?.canonical ? meta.canonical.slice(0, 45) + '...' : 'None',
            imageCount: imageCheck?.total,
            brokenImages: imageCheck?.brokenCount
        });
    }

    console.log("\n==================================================================");
    console.log("                      SUMMARY RESULTS");
    console.log("==================================================================");
    console.table(results);
    console.log(`\nOverall QA Status: ${allPassed ? "ALL TESTS PASSED PERFECTLY!" : "WARNING: ISSUES DETECTED"}\n`);

    cdp.close();
    chromeProcess.kill();
    process.exit(allPassed ? 0 : 1);
}

run().catch(err => {
    console.error("QA script failed:", err);
    process.exit(1);
});

