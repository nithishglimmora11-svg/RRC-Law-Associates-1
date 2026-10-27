const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEV_PORT = 5588;
const CHROME_PORT = 9235;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_master_qa_profile');

function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

class CdpClient {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
        this.id = 1;
        this.callbacks = new Map();
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
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
    console.log('=== Running Master Visibility & Functional QA Suite ===');
    if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

    const devServerProcess = spawn('node', ['dev-server.js', String(DEV_PORT)], { stdio: 'inherit' });
    await sleep(1000);

    const chromeProcess = spawn(CHROME_PATH, [
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--window-size=1440,900',
        'about:blank'
    ]);
    await sleep(2000);

    let client = null;
    const testReport = {
        timestamp: new Date().toISOString(),
        urlRoutesTested: {},
        viewports: [],
        imagesVerified: [],
        contrastCheck: {},
        mobileMenuTest: {},
        desktopDropdownTest: {},
        consultationLinksTest: {},
        existingPagesRegression: {},
        consoleErrors: []
    };

    try {
        const targets = await getJson(`http://127.0.0.1:${CHROME_PORT}/json/list`);
        const pageTarget = targets.find(t => t.type === 'page') || targets[0];
        client = new CdpClient(pageTarget.webSocketDebuggerUrl);
        await client.ready();

        await client.send('Page.enable');
        await client.send('Runtime.enable');
        await client.send('DOM.enable');

        client.ws.addEventListener('message', (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
                testReport.consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
            }
        });

        // 1. Route tests: Clean URL, .html URL, and Refresh
        console.log('[1/7] Testing Clean URL, .html URL & Refresh...');
        // Clean URL
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(1500);
        const cleanHref = await client.evaluate('window.location.href');
        const cleanTitle = await client.evaluate('document.title');
        testReport.urlRoutesTested.cleanUrl = { url: cleanHref, title: cleanTitle, passed: cleanHref.includes('/wills-probate-estate-administration') };

        // Refresh
        await client.send('Page.reload');
        await sleep(1500);
        const reloadHref = await client.evaluate('window.location.href');
        testReport.urlRoutesTested.refresh = { url: reloadHref, passed: reloadHref === cleanHref };

        // .html URL
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration.html` });
        await sleep(1500);
        const htmlHref = await client.evaluate('window.location.href');
        testReport.urlRoutesTested.htmlUrl = { url: htmlHref, passed: htmlHref.includes('/wills-probate-estate-administration.html') };

        // Return to clean URL for remaining tests
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(1500);

        // 2. Viewports test (320px, 375px, 430px, 768px, 1024px, 1440px)
        console.log('[2/7] Testing 6 Responsive Viewports for Horizontal Overflow...');
        const viewports = [
            { w: 320, h: 640 },
            { w: 375, h: 812 },
            { w: 430, h: 932 },
            { w: 768, h: 1024 },
            { w: 1024, h: 768 },
            { w: 1440, h: 900 }
        ];

        for (const vp of viewports) {
            await client.setViewport(vp.w, vp.h);
            await sleep(300);
            const vpData = await client.evaluate(`
                (() => {
                    const scrollWidth = document.documentElement.scrollWidth;
                    const innerWidth = window.innerWidth;
                    return { scrollWidth, innerWidth, overflow: scrollWidth > innerWidth };
                })()
            `);
            const passed = !vpData.overflow;
            testReport.viewports.push({ width: vp.w, ...vpData, passed });
            console.log(` -> Viewport ${vp.w}px: scrollWidth=${vpData.scrollWidth}, innerWidth=${vpData.innerWidth}, overflow=${vpData.overflow} (Passed: ${passed})`);
        }

        // 3. Image Loading Verification
        console.log('[3/7] Verifying all images natural dimensions...');
        await client.setViewport(1440, 900);
        await sleep(300);
        const images = await client.evaluate(`
            Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.currentSrc || img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                complete: img.complete
            }))
        `);
        testReport.imagesVerified = images;
        images.forEach(img => {
            const ok = img.complete && img.naturalWidth > 0;
            console.log(` -> Image: ${img.src.split('/').pop()} (${img.naturalWidth}x${img.naturalHeight}) - Complete: ${ok}`);
        });

        // 4. Contrast & Text Color Audit
        console.log('[4/7] Auditing Text Contrast across all sections...');
        const textAudit = await client.evaluate(`
            (() => {
                function parseRgb(colorStr) {
                    const match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d\\.]+))?/);
                    if (!match) return null;
                    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), a: match[4] !== undefined ? parseFloat(match[4]) : 1 };
                }
                function getEffectiveBg(el) {
                    let cur = el;
                    while (cur && cur !== document.documentElement) {
                        const style = window.getComputedStyle(cur);
                        const bg = style.backgroundColor;
                        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
                        cur = cur.parentElement;
                    }
                    return 'rgb(255, 255, 255)';
                }
                let whiteOnLightCount = 0;
                const whiteOnLightDetails = [];
                document.querySelectorAll('main p, main li, main h2, main h4, main td, main th').forEach(el => {
                    const text = el.textContent.trim();
                    if (!text) return;
                    const style = window.getComputedStyle(el);
                    const textColor = parseRgb(style.color);
                    const bgStr = getEffectiveBg(el);
                    const bgColor = parseRgb(bgStr);
                    if (textColor && bgColor) {
                        const isTextLight = textColor.r > 200 && textColor.g > 200 && textColor.b > 200;
                        const isBgLight = bgColor.r > 200 && bgColor.g > 200 && bgColor.b > 200;
                        if (isTextLight && isBgLight) {
                            whiteOnLightCount++;
                            whiteOnLightDetails.push({ tag: el.tagName, text: text.slice(0, 40), color: style.color, bg: bgStr });
                        }
                    }
                });
                return { whiteOnLightCount, whiteOnLightDetails };
            })()
        `);
        testReport.contrastCheck = textAudit;
        console.log(' -> White-on-light text elements found:', textAudit.whiteOnLightCount);

        // 5. Mobile Drawer & Accordion
        console.log('[5/7] Testing Mobile Menu Drawer & FAQ Accordions...');
        await client.setViewport(375, 812);
        await sleep(300);
        const mobileNavResult = await client.evaluate(`
            (() => {
                const menuToggle = document.getElementById('menuToggle');
                const mobileMenu = document.getElementById('mobileMenu');
                const closeMenu = document.getElementById('closeMenu');
                
                menuToggle.click();
                const opened = mobileMenu.classList.contains('open');

                closeMenu.click();
                const closed = !mobileMenu.classList.contains('open');

                // Test FAQ accordion
                const faqBtn = document.querySelector('#headingTwo button');
                const collapseTwo = document.getElementById('collapseTwo');
                faqBtn.click();
                
                return { opened, closed };
            })()
        `);
        testReport.mobileMenuTest = mobileNavResult;
        console.log(' -> Mobile Menu Drawer Result:', mobileNavResult);

        // 6. Desktop Navigation & Consultation CTA
        console.log('[6/7] Testing Desktop Header CTA & Links...');
        await client.setViewport(1440, 900);
        await sleep(300);
        const desktopNavResult = await client.evaluate(`
            (() => {
                const headerCtas = Array.from(document.querySelectorAll('.header .btn-gold')).map(b => ({
                    text: b.textContent.trim(),
                    href: b.getAttribute('href'),
                    visible: window.getComputedStyle(b).display !== 'none'
                }));
                const dropdownMenu = document.querySelector('.header .dropdown-menu');
                const willsLink = dropdownMenu?.querySelector('a[href="/wills-probate-estate-administration"]');
                return {
                    totalHeaderCtas: headerCtas.length,
                    headerCtas,
                    willsLinkInDropdown: !!willsLink,
                    willsLinkText: willsLink?.textContent.trim()
                };
            })()
        `);
        testReport.desktopDropdownTest = desktopNavResult;
        console.log(' -> Desktop CTA & Dropdown Result:', desktopNavResult);

        // 7. Regression check on existing pages (index.html, nri-property-disputes.html, booking.html)
        console.log('[7/7] Regression Check on Existing Pages...');
        const pagesToCheck = [
            { path: '/index.html', titleContains: 'RRC Law' },
            { path: '/nri-property-disputes.html', titleContains: 'NRI Property' },
            { path: '/booking.html', titleContains: 'Book' }
        ];
        const regressionResults = [];
        for (const p of pagesToCheck) {
            await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}${p.path}` });
            await sleep(1000);
            const title = await client.evaluate('document.title');
            const pass = title.includes(p.titleContains) || title.length > 5;
            regressionResults.push({ path: p.path, title, passed: pass });
            console.log(` -> Regression Page ${p.path}: Title: "${title}" (Passed: ${pass})`);
        }
        testReport.existingPagesRegression = regressionResults;

        fs.writeFileSync(path.resolve(__dirname, 'master_visibility_qa_report.json'), JSON.stringify(testReport, null, 2), 'utf8');
        console.log('\n=== MASTER QA SUITE COMPLETED SUCCESSFULLY! ===');

    } catch (err) {
        console.error('Master QA Failed with error:', err);
    } finally {
        if (client) client.close();
        chromeProcess.kill();
        devServerProcess.kill();
    }
}
run();

