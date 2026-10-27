const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEV_PORT = 5577;
const CHROME_PORT = 9222;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_test_profile');

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
        this.events = [];

        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id && this.callbacks.has(msg.id)) {
                const { resolve, reject } = this.callbacks.get(msg.id);
                this.callbacks.delete(msg.id);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
            } else if (msg.method) {
                this.events.push(msg);
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
    console.log('=== Starting Browser QA Testing ===');
    
    if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

    // 1. Start dev-server
    const devServerProcess = spawn('node', ['dev-server.js', String(DEV_PORT)], {
        stdio: 'inherit'
    });
    await sleep(1000);

    // 2. Launch headless Chrome with clean profile
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
    const testResults = {
        viewports: {},
        overflowErrors: [],
        consoleErrors: [],
        images: [],
        navigation: {},
        accessibility: {}
    };

    try {
        const targets = await getJson(`http://127.0.0.1:${CHROME_PORT}/json/list`);
        console.log(`Chrome attached. Total targets: ${targets.length}`);
        const pageTarget = targets.find(t => t.type === 'page') || targets[0];
        console.log(`Using target page: ${pageTarget.url}`);

        client = new CdpClient(pageTarget.webSocketDebuggerUrl);
        await client.ready();
        console.log('Connected to Chrome DevTools Protocol');

        await client.send('Page.enable');
        await client.send('Runtime.enable');
        await client.send('DOM.enable');

        // Capture console errors
        client.ws.addEventListener('message', (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
                testResults.consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
            }
        });

        // Test 1: Load clean URL directly
        console.log('\n[TEST 1] Direct clean URL loading...');
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(2000);

        const currentUrl = await client.evaluate('window.location.href');
        const documentTitle = await client.evaluate('document.title');
        console.log(`Page URL: ${currentUrl}`);
        console.log(`Page Title: ${documentTitle}`);
        testResults.navigation.directUrl = currentUrl;
        testResults.navigation.title = documentTitle;

        // Test 2: Browser Refresh
        console.log('\n[TEST 2] Browser refresh...');
        await client.send('Page.reload');
        await sleep(1500);
        const refreshedUrl = await client.evaluate('window.location.href');
        console.log(`After reload URL: ${refreshedUrl}`);
        testResults.navigation.reloadUrl = refreshedUrl;

        // Test 3: Viewports and Horizontal Overflow Check
        console.log('\n[TEST 3] Responsive Viewport Audits (320px, 375px, 430px, 768px, 1024px, 1440px)...');
        const viewports = [
            { w: 320, h: 640, label: '320px (Small Mobile)' },
            { w: 375, h: 812, label: '375px (iPhone SE/Mini)' },
            { w: 430, h: 932, label: '430px (iPhone 14/15 Pro Max)' },
            { w: 768, h: 1024, label: '768px (iPad Mini/Tablet Portrait)' },
            { w: 1024, h: 768, label: '1024px (Small Desktop/Tablet Landscape)' },
            { w: 1440, h: 900, label: '1440px (Standard Desktop)' }
        ];

        for (const vp of viewports) {
            await client.setViewport(vp.w, vp.h);
            await sleep(500);

            const overflowData = await client.evaluate(`
                (() => {
                    const docWidth = document.documentElement.scrollWidth;
                    const winWidth = window.innerWidth;
                    const hasOverflow = docWidth > winWidth;
                    
                    const overflowingElements = [];
                    if (hasOverflow) {
                        const all = document.querySelectorAll('*');
                        all.forEach(el => {
                            const rect = el.getBoundingClientRect();
                            if (rect.right > winWidth + 1) {
                                overflowingElements.push({
                                    tag: el.tagName,
                                    id: el.id,
                                    class: el.className,
                                    right: rect.right
                                });
                            }
                        });
                    }
                    return { docWidth, winWidth, hasOverflow, overflowingElements: overflowingElements.slice(0, 5) };
                })()
            `);

            console.log(`Viewport ${vp.label}: width=${overflowData.winWidth}, scrollWidth=${overflowData.docWidth}, overflow=${overflowData.hasOverflow}`);
            testResults.viewports[vp.w] = overflowData;
            if (overflowData.hasOverflow) {
                testResults.overflowErrors.push({ viewport: vp.w, elements: overflowData.overflowingElements });
            }

            const ssPath = path.resolve(__dirname, `screenshot_${vp.w}px.png`);
            await client.screenshot(ssPath);
        }

        // Test 4: Image loading check
        console.log('\n[TEST 4] Image verification...');
        const imageCheck = await client.evaluate(`
            (() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                return imgs.map(img => ({
                    src: img.currentSrc || img.src,
                    alt: img.alt,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    complete: img.complete
                }));
            })()
        `);
        console.log(`Found ${imageCheck.length} images on page:`);
        imageCheck.forEach((img, idx) => {
            const ok = img.complete && img.naturalWidth > 0;
            console.log(` [${idx + 1}] ${img.src} -> ${img.naturalWidth}x${img.naturalHeight} (Loaded: ${ok})`);
        });
        testResults.images = imageCheck;

        // Test 5: Mobile Navigation Drawer & Accordion
        console.log('\n[TEST 5] Testing Mobile Navigation...');
        await client.setViewport(375, 812);
        await sleep(300);

        const toggleResult = await client.evaluate(`
            (() => {
                const btn = document.getElementById('menuToggle');
                const drawer = document.getElementById('mobileMenu');
                if (!btn || !drawer) return { error: 'Toggle or drawer not found' };
                btn.click();
                return {
                    clicked: true,
                    isOpen: drawer.classList.contains('open')
                };
            })()
        `);
        console.log('Mobile menu open toggle:', toggleResult);
        testResults.navigation.mobileMenuOpen = toggleResult;

        const accordionResult = await client.evaluate(`
            (() => {
                const trigger = document.querySelector('#mobileMenu .m-trigger');
                const submenu = document.getElementById('mNriMenu');
                if (!trigger || !submenu) return { error: 'Trigger or submenu not found' };
                trigger.click();
                return {
                    clicked: true,
                    isActive: submenu.classList.contains('active')
                };
            })()
        `);
        console.log('Mobile submenu accordion toggle:', accordionResult);
        testResults.navigation.mobileSubmenuToggle = accordionResult;

        const closeResult = await client.evaluate(`
            (() => {
                const closeBtn = document.getElementById('closeMenu');
                const drawer = document.getElementById('mobileMenu');
                if (!closeBtn || !drawer) return { error: 'Close button not found' };
                closeBtn.click();
                return {
                    clicked: true,
                    isOpen: drawer.classList.contains('open')
                };
            })()
        `);
        console.log('Mobile menu close toggle:', closeResult);
        testResults.navigation.mobileMenuClose = closeResult;

        // Test 6: Desktop Navigation Dropdown
        console.log('\n[TEST 6] Testing Desktop Navigation Dropdown...');
        await client.setViewport(1440, 900);
        await sleep(300);

        const desktopDropdownCheck = await client.evaluate(`
            (() => {
                const dropdown = document.querySelector('.header .dropdown');
                const dropdownMenu = dropdown ? dropdown.querySelector('.dropdown-menu') : null;
                const link = dropdownMenu ? dropdownMenu.querySelector('a[href="/wills-probate-estate-administration"]') : null;
                return {
                    dropdownExists: !!dropdown,
                    menuExists: !!dropdownMenu,
                    willsLinkExists: !!link,
                    willsLinkText: link ? link.textContent.trim() : null
                };
            })()
        `);
        console.log('Desktop dropdown check:', desktopDropdownCheck);
        testResults.navigation.desktopDropdown = desktopDropdownCheck;

        // Test 7: Booking Form & Link Check
        console.log('\n[TEST 7] Testing Booking Link & Booking Page...');
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/booking.html` });
        await sleep(1500);

        const bookingPageCheck = await client.evaluate(`
            (() => {
                const serviceSelect = document.querySelector('select[name="Service"]');
                const options = serviceSelect ? Array.from(serviceSelect.options).map(o => o.text.trim()) : [];
                const hasWillsOption = options.some(o => o.includes('Wills, Probate'));
                return {
                    url: window.location.href,
                    serviceSelectExists: !!serviceSelect,
                    hasWillsOption: hasWillsOption,
                    options: options
                };
            })()
        `);
        console.log('Booking page check:', bookingPageCheck);
        testResults.navigation.bookingPage = bookingPageCheck;

        // Test 8: SEO and Structured Data Check
        console.log('\n[TEST 8] Testing Structured Data & SEO tags on Wills page...');
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(1500);

        const seoCheck = await client.evaluate(`
            (() => {
                const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim());
                const canonical = document.querySelector('link[rel="canonical"]')?.href;
                const metaDesc = document.querySelector('meta[name="description"]')?.content;
                const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
                const ogUrl = document.querySelector('meta[property="og:url"]')?.content;
                const ogImage = document.querySelector('meta[property="og:image"]')?.content;
                const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
                    try { return JSON.parse(s.textContent); } catch(e) { return { error: e.message }; }
                });

                return {
                    h1Count: h1s.length,
                    h1: h1s[0],
                    canonical,
                    metaDesc,
                    ogTitle,
                    ogUrl,
                    ogImage,
                    jsonLdCount: jsonLdScripts.length
                };
            })()
        `);
        console.log('SEO tags check:', seoCheck);
        testResults.accessibility.seo = seoCheck;

        // Test 9: Client-Side Routing Test on 127.0.0.1:5501 (Simulating click from home/nri)
        console.log('\n[TEST 9] Testing local dropdown click on 127.0.0.1:5501...');
        try {
            await client.send('Page.navigate', { url: 'http://127.0.0.1:5501/index.html' });
            await sleep(1500);
            const clickNavResult = await client.evaluate(`
                new Promise(resolve => {
                    const link = document.querySelector('a[href="/wills-probate-estate-administration"]');
                    if (!link) return resolve({ error: 'Link not found' });
                    link.click();
                    setTimeout(() => {
                        resolve({ newUrl: window.location.href });
                    }, 1000);
                })
            `);
            console.log('Live Server 5501 click navigation result:', clickNavResult);
            testResults.navigation.liveServerClickResult = clickNavResult;
        } catch (e) {
            console.log('Live Server 5501 test note:', e.message);
        }

        fs.writeFileSync(path.resolve(__dirname, 'browser_qa_results.json'), JSON.stringify(testResults, null, 2), 'utf8');
        console.log('\n=== All Automated Browser QA Tests Completed Successfully ===');
    } catch (err) {
        console.error('Test run failed with error:', err);
    } finally {
        if (client) client.close();
        chromeProcess.kill();
        devServerProcess.kill();
    }
}

run();

