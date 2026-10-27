const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runSuite() {
    const tempProfile = path.resolve(__dirname, 'edge-temp-val-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9265',
        `--user-data-dir=${tempProfile}`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const startUrl = 'http://localhost:8080/oci-card-assistance.html';
        const newTabRes = await fetch(`http://127.0.0.1:9265/json/new?${startUrl}`, { method: 'PUT' });
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

        const networkErrors = [];
        const consoleErrors = [];

        ws.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data);
            if (data.method === 'Network.responseReceived') {
                const { url, status } = data.params.response;
                if (status >= 400 && !url.includes('favicon.ico')) {
                    networkErrors.push({ url, status });
                }
            }
            if (data.method === 'Runtime.consoleAPICalled') {
                if (data.params.type === 'error') {
                    consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
                }
            }
        });

        await send('Page.enable');
        await send('Network.enable');
        await send('Runtime.enable');

        // Set Desktop Viewport
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
            mobile: false
        });

        console.log("=== STEP 1: TEST OCI CARD ASSISTANCE PAGE (DESKTOP) ===");
        await send('Page.navigate', { url: startUrl });
        await new Promise(r => setTimeout(r, 2500));

        const assistCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const topbar = document.querySelector('.rrc-topbar');
                const logo = document.querySelector('header .logo-img');
                const exploreBtn = document.querySelector('.oci-btn-secondary');
                const video0 = document.getElementById('ociHeroVideo0');
                return {
                    title: document.title,
                    topbarVisible: topbar ? window.getComputedStyle(topbar).display !== 'none' : false,
                    logoWidth: logo ? logo.naturalWidth : 0,
                    logoSrc: logo ? logo.src : '',
                    exploreBtnHref: exploreBtn ? exploreBtn.getAttribute('href') : '',
                    videoReady: video0 ? video0.readyState : -1
                };
            })()`,
            returnByValue: true
        });
        console.log("OCI Card Assistance check:", JSON.stringify(assistCheck.result.value, null, 2));

        console.log("\n=== STEP 2: NAVIGATE TO OCI LEGAL GUIDES HUB ===");
        const targetHubUrl = `http://localhost:8080${assistCheck.result.value.exploreBtnHref}`;
        await send('Page.navigate', { url: targetHubUrl });
        await new Promise(r => setTimeout(r, 2500));

        const hubCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const topbar = document.querySelector('.rrc-topbar');
                const logo = document.querySelector('header .logo-img');
                const cards = document.querySelectorAll('.guide-card');
                const guide3Link = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') && a.getAttribute('href').includes('oci-card-application-documents'));
                return {
                    url: window.location.href,
                    title: document.title,
                    topbarVisible: topbar ? window.getComputedStyle(topbar).display !== 'none' : false,
                    logoWidth: logo ? logo.naturalWidth : 0,
                    cardCount: cards.length,
                    guide3Href: guide3Link ? guide3Link.getAttribute('href') : ''
                };
            })()`,
            returnByValue: true
        });
        console.log("OCI Legal Guides Hub check:", JSON.stringify(hubCheck.result.value, null, 2));

        console.log("\n=== STEP 3: NAVIGATE TO GUIDE 3 (ARTICLE) ===");
        const targetArticleUrl = `http://localhost:8080${hubCheck.result.value.guide3Href}`;
        await send('Page.navigate', { url: targetArticleUrl });
        await new Promise(r => setTimeout(r, 2500));

        const articleCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const topbar = document.querySelector('.rrc-topbar');
                const logo = document.querySelector('header .logo-img');
                const heroImg = document.querySelector('.article-visual img, .article-hero img, .article-shell img');
                const breadcrumbLink = Array.from(document.querySelectorAll('.breadcrumbs-bar a, .breadcrumb a, nav a')).find(a => a.textContent.includes('OCI Legal Guides'));
                const serviceLink = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') && a.getAttribute('href').includes('oci-card-assistance.html') && a.textContent.includes('OCI Legal Services'));
                return {
                    url: window.location.href,
                    title: document.title,
                    topbarVisible: topbar ? window.getComputedStyle(topbar).display !== 'none' : false,
                    logoWidth: logo ? logo.naturalWidth : 0,
                    heroImgWidth: heroImg ? heroImg.naturalWidth : 0,
                    heroImgSrc: heroImg ? heroImg.src : '',
                    breadcrumbHref: breadcrumbLink ? breadcrumbLink.getAttribute('href') : '',
                    serviceLinkHref: serviceLink ? serviceLink.getAttribute('href') : ''
                };
            })()`,
            returnByValue: true
        });
        console.log("Guide 3 Article check:", JSON.stringify(articleCheck.result.value, null, 2));

        console.log("\n=== STEP 4: NAVIGATE VIA SERVICE LINK BACK TO OCI CARD ASSISTANCE ===");
        await send('Page.navigate', { url: `http://localhost:8080${articleCheck.result.value.serviceLinkHref}` });
        await new Promise(r => setTimeout(r, 2000));
        const servicePageTitle = await send('Runtime.evaluate', { expression: `document.title`, returnByValue: true });
        console.log(`Service page reached: "${servicePageTitle.result.value}"`);

        console.log("\n=== STEP 5: NAVIGATE VIA BREADCRUMB BACK TO OCI LEGAL GUIDES HUB ===");
        await send('Page.navigate', { url: targetArticleUrl });
        await new Promise(r => setTimeout(r, 2000));
        await send('Page.navigate', { url: `http://localhost:8080${articleCheck.result.value.breadcrumbHref}` });
        await new Promise(r => setTimeout(r, 2000));
        const backHubTitle = await send('Runtime.evaluate', { expression: `document.title`, returnByValue: true });
        console.log(`Hub page reached via breadcrumb: "${backHubTitle.result.value}"`);

        console.log("\n=== STEP 6: TEST MOBILE VIEWPORT & MENU TOGGLE (375x667) ===");
        await send('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 1000));

        // Click menu toggle
        const menuOpenRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const toggle = document.getElementById('menuToggle');
                const menu = document.getElementById('mobileMenu');
                if (!toggle || !menu) return { error: 'Toggle or menu not found' };
                toggle.click();
                const isOpen = menu.classList.contains('active') || menu.classList.contains('open') || window.getComputedStyle(menu).right === '0px' || window.getComputedStyle(menu).display !== 'none';
                return {
                    clicked: true,
                    menuClasses: menu.className,
                    menuRight: window.getComputedStyle(menu).right,
                    isOpen: isOpen
                };
            })()`,
            returnByValue: true
        });
        console.log("Mobile menu open check:", JSON.stringify(menuOpenRes.result.value, null, 2));

        // Click close button
        const menuCloseRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const closeBtn = document.getElementById('closeMenu');
                const menu = document.getElementById('mobileMenu');
                if (closeBtn) closeBtn.click();
                return {
                    closedClicked: !!closeBtn,
                    menuClasses: menu.className,
                    menuRight: window.getComputedStyle(menu).right
                };
            })()`,
            returnByValue: true
        });
        console.log("Mobile menu close check:", JSON.stringify(menuCloseRes.result.value, null, 2));

        console.log("\n=== NETWORK & CONSOLE SUMMARY ===");
        console.log(`Network 4xx/5xx Errors: ${networkErrors.length}`);
        if (networkErrors.length > 0) {
            console.log("Network errors:", networkErrors);
        }
        console.log(`Console Errors: ${consoleErrors.length}`);
        if (consoleErrors.length > 0) {
            console.log("Console errors:", consoleErrors);
        }

        ws.close();
    } catch (e) {
        console.error("Test error:", e);
    } finally {
        browser.kill();
        process.exit(0);
    }
}

runSuite();
