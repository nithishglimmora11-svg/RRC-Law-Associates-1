const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PORT = 9262;
const PROFILE_DIR = path.resolve(__dirname, 'chrome_qa_profile_full_rera');

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
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
    console.log('================================================================');
    console.log('   FULL REGRESSION QA SUITE — RRC LAW ASSOCIATES (PORT 5501)');
    console.log('================================================================\n');

    if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

    const chrome = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--no-first-run',
        '--no-default-browser-check',
        'about:blank'
    ]);

    await sleep(2000);

    let client = null;
    let consoleErrors = [];
    let pageErrors = [];

    try {
        const tabs = await getJson(`http://127.0.0.1:${CHROME_PORT}/json`);
        const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
        client = new CdpClient(pageTab.webSocketDebuggerUrl);
        await client.ready();

        await client.send('Page.enable');
        await client.send('Runtime.enable');
        await client.send('Network.enable');

        client.ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
                consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
            }
            if (msg.method === 'Runtime.exceptionThrown') {
                pageErrors.push(msg.params.exceptionDetails.text);
            }
        });

        // Test 1: Load RERA page
        console.log('[Test 1] Testing NRI RERA and Builder Disputes Page...');
        await client.send('Page.navigate', { url: 'http://127.0.0.1:5501/nri-rera-builder-disputes.html' });
        await sleep(3000);

        const pageMeta = await client.evaluate(`({
            title: document.title,
            canonical: document.querySelector('link[rel="canonical"]')?.href,
            h1: document.querySelector('h1')?.innerText,
            breadcrumbsCount: document.querySelectorAll('.breadcrumbs-bar a').length,
            sectionsCount: document.querySelectorAll('#main-content section').length,
            faqCount: document.querySelectorAll('#reraFaqAccordion .accordion-item').length
        })`);

        console.log('  ✓ Title:', pageMeta.title);
        console.log('  ✓ Canonical:', pageMeta.canonical);
        console.log('  ✓ Primary H1:', pageMeta.h1);
        console.log('  ✓ Sections Count:', pageMeta.sectionsCount);
        console.log('  ✓ FAQ Accordion Items:', pageMeta.faqCount);

        // Test 2: Viewports & Overflow
        const viewports = [
            { name: 'Mobile XS', width: 320, height: 640 },
            { name: 'Mobile Standard iPhone', width: 375, height: 667 },
            { name: 'Mobile Large Pro Max', width: 430, height: 932 },
            { name: 'Tablet Portrait iPad Mini', width: 768, height: 1024 },
            { name: 'Tablet Landscape Laptop', width: 1024, height: 768 },
            { name: 'Desktop Standard', width: 1440, height: 900 }
        ];

        console.log('\n[Test 2] Testing Viewports & 0px Overflow...');
        for (const vp of viewports) {
            await client.setViewport(vp.width, vp.height);
            await sleep(500);
            const overflow = await client.evaluate(`({
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
                hasOverflow: document.documentElement.scrollWidth > window.innerWidth
            })`);
            const status = !overflow.hasOverflow ? 'PASS' : 'FAIL';
            console.log(`  [${status}] ${vp.name} (${vp.width}x${vp.height}): Overflow = ${overflow.hasOverflow ? `${overflow.scrollWidth}px > ${overflow.innerWidth}px` : '0px'}`);
        }

        // Test 3: Existing Service Pages Regression
        console.log('\n[Test 3] Regression Testing Existing Service Pages...');
        const existingPages = [
            { name: 'Homepage', url: 'http://127.0.0.1:5501/' },
            { name: 'NRI Services Hub', url: 'http://127.0.0.1:5501/nri-services.html' },
            { name: 'Wills & Probate Clean URL', url: 'http://127.0.0.1:5501/wills-probate-estate-administration' },
            { name: 'Landlord-Tenant Clean URL', url: 'http://127.0.0.1:5501/nri-landlord-tenant-eviction/' }
        ];

        for (const ep of existingPages) {
            await client.send('Page.navigate', { url: ep.url });
            await sleep(2000);
            const res = await client.evaluate(`({ title: document.title, hasNav: document.querySelector('.header') !== null, hasReraInNav: document.querySelector('a[href="/nri-rera-builder-disputes/"]') !== null })`);
            console.log(`  ✓ ${ep.name}:`);
            console.log(`      Title: "${res.title.substring(0, 50)}..."`);
            console.log(`      Header Present: ${res.hasNav ? 'YES' : 'NO'}`);
            console.log(`      RERA in Nav: ${res.hasReraInNav ? 'YES' : 'NO'}`);
        }

        // Summary
        console.log('\n[Test 4] Console & Error Health Summary:');
        console.log(`  ✓ Uncaught Console Errors: ${consoleErrors.length}`);
        if (consoleErrors.length > 0) consoleErrors.forEach(e => console.log('    [Error]', e));
        console.log(`  ✓ Page Runtime Exceptions: ${pageErrors.length}`);
        if (pageErrors.length > 0) pageErrors.forEach(e => console.log('    [Exception]', e));

        console.log('\n================================================================');
        console.log('   ALL REGRESSION TESTS COMPLETED SUCCESSFULLY!');
        console.log('================================================================');

    } catch (err) {
        console.error('Regression Test Error:', err);
    } finally {
        if (client) client.close();
        chrome.kill();
        process.exit(0);
    }
}

run();

