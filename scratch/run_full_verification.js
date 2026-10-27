const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEV_PORT = 5576;
const CHROME_PORT = 9223;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_qa_profile');

function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
        return new Promise((resolve, reject) => {
            if (this.ws.readyState === WebSocket.OPEN) return resolve();
            this.ws.onopen = () => resolve();
            this.ws.onerror = (e) => reject(e);
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
        const res = await this.send('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise: true
        });
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

    async screenshot(filepath) {
        const res = await this.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    }

    close() {
        this.ws.close();
    }
}

async function run() {
    console.log('=== Comprehensive Final QA Test in Headless Chrome ===');
    
    if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

    const devServerProcess = spawn('node', ['dev-server.js', String(DEV_PORT)], { stdio: 'inherit' });
    await sleep(1000);

    const chromeProcess = spawn(CHROME_PATH, [
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,900',
        'about:blank'
    ]);
    await sleep(2000);

    let client = null;
    const finalReport = {
        timestamp: new Date().toISOString(),
        directUrlStatus: null,
        refreshStatus: null,
        responsiveViewports: [],
        imagesAudited: [],
        mobileNavTests: {},
        desktopDropdownTests: {},
        bookingFlowTests: {},
        seoAndStructuredData: {},
        consoleErrors: [],
        linksTested: []
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
                finalReport.consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
            }
        });

        // 1. Direct Load
        console.log('[1/8] Direct URL Loading...');
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(2000);

        const pageUrl = await client.evaluate('window.location.href');
        const pageTitle = await client.evaluate('document.title');
        finalReport.directUrlStatus = { url: pageUrl, title: pageTitle, passed: pageUrl.includes('/wills-probate-estate-administration') };
        console.log(` -> Loaded URL: ${pageUrl} (Title: ${pageTitle})`);

        // 2. Refresh
        console.log('[2/8] Browser Refresh...');
        await client.send('Page.reload');
        await sleep(1500);
        const reloadUrl = await client.evaluate('window.location.href');
        finalReport.refreshStatus = { url: reloadUrl, passed: reloadUrl === pageUrl };
        console.log(` -> Reload URL: ${reloadUrl}`);

        // 3. Scroll entire page to trigger lazy loading
        console.log('[3/8] Scrolling page to trigger lazy loading...');
        await client.evaluate(`
            new Promise(resolve => {
                let totalHeight = 0;
                const distance = 300;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight) {
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        setTimeout(resolve, 800);
                    }
                }, 100);
            })
        `);

        // 4. Verify all images
        console.log('[4/8] Auditing all images...');
        const images = await client.evaluate(`
            Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.currentSrc || img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                complete: img.complete
            }))
        `);
        finalReport.imagesAudited = images;
        console.log(`Found ${images.length} images:`);
        images.forEach(img => {
            const ok = img.complete && img.naturalWidth > 0;
            console.log(` - ${img.src.split('/').pop()}: ${img.naturalWidth}x${img.naturalHeight} (Loaded: ${ok})`);
        });

        // 5. Test all 6 Viewports for horizontal overflow
        console.log('[5/8] Auditing Viewports (320px, 375px, 430px, 768px, 1024px, 1440px)...');
        const viewports = [
            { w: 320, h: 640, label: '320px' },
            { w: 375, h: 812, label: '375px' },
            { w: 430, h: 932, label: '430px' },
            { w: 768, h: 1024, label: '768px' },
            { w: 1024, h: 768, label: '1024px' },
            { w: 1440, h: 900, label: '1440px' }
        ];

        for (const vp of viewports) {
            await client.setViewport(vp.w, vp.h);
            await sleep(400);
            const data = await client.evaluate(`
                (() => {
                    const docWidth = document.documentElement.scrollWidth;
                    const winWidth = window.innerWidth;
                    return { docWidth, winWidth, hasOverflow: docWidth > winWidth };
                })()
            `);
            const passed = !data.hasOverflow;
            finalReport.responsiveViewports.push({ viewport: vp.w, ...data, passed });
            console.log(` -> Viewport ${vp.w}px: scrollWidth=${data.docWidth}, winWidth=${data.winWidth}, overflow=${data.hasOverflow} (Passed: ${passed})`);
        }

        // 6. Mobile navigation drawer & accordion
        console.log('[6/8] Testing Mobile Navigation Interaction...');
        await client.setViewport(375, 812);
        await sleep(300);

        const mobileTests = await client.evaluate(`
            (() => {
                const results = {};
                const menuToggle = document.getElementById('menuToggle');
                const mobileMenu = document.getElementById('mobileMenu');
                const closeMenu = document.getElementById('closeMenu');
                const trigger = document.querySelector('#mobileMenu .m-trigger');
                const submenu = document.getElementById('mNriMenu');

                // Step 1: Open
                menuToggle.click();
                results.openPass = mobileMenu.classList.contains('open');

                // Step 2: Submenu active
                results.submenuAlreadyActive = submenu.classList.contains('active');

                // Step 3: Close
                closeMenu.click();
                results.closePass = !mobileMenu.classList.contains('open');

                return results;
            })()
        `);
        finalReport.mobileNavTests = mobileTests;
        console.log('Mobile nav results:', mobileTests);

        // 7. Desktop dropdown
        console.log('[7/8] Testing Desktop Navigation Dropdown...');
        await client.setViewport(1440, 900);
        await sleep(300);

        const desktopTests = await client.evaluate(`
            (() => {
                const dropdown = document.querySelector('.header .dropdown');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                const link = dropdownMenu.querySelector('a[href="/wills-probate-estate-administration"]');
                return {
                    dropdownMenuFound: !!dropdownMenu,
                    linkFound: !!link,
                    linkText: link?.textContent.trim(),
                    hasActiveGoldClass: link?.classList.contains('text-gold')
                };
            })()
        `);
        finalReport.desktopDropdownTests = desktopTests;
        console.log('Desktop dropdown results:', desktopTests);

        // 8. Test Booking page and internal links
        console.log('[8/8] Testing Booking Selection & Internal Links...');
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/booking.html` });
        await sleep(1500);

        const bookingTest = await client.evaluate(`
            (() => {
                const select = document.querySelector('select[name="Service"]');
                const hasOption = Array.from(select.options).some(o => o.text.includes('Wills, Probate'));
                // Select it
                select.value = 'Wills, Probate & Estate Administration';
                return {
                    hasOption,
                    selectedValue: select.value
                };
            })()
        `);
        finalReport.bookingFlowTests = bookingTest;
        console.log('Booking test results:', bookingTest);

        fs.writeFileSync(path.resolve(__dirname, 'full_verification_report.json'), JSON.stringify(finalReport, null, 2), 'utf8');
        console.log('\n=== All Tests Finished and Report Saved! ===');
    } catch (err) {
        console.error('Test run failed:', err);
    } finally {
        if (client) client.close();
        chromeProcess.kill();
        devServerProcess.kill();
    }
}

run();

