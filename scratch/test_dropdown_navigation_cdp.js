const { spawn } = require('child_process');

(async () => {
    console.log("Starting Chrome CDP Navigation Test Suite on port 5502...");

    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9277',
        '--disable-gpu',
        '--no-sandbox',
        'about:blank'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    let tabs;
    try {
        tabs = await fetch('http://127.0.0.1:9277/json').then(r => r.json());
    } catch (e) {
        console.error("Failed to connect to Chrome debugging port:", e);
        chrome.kill();
        process.exit(1);
    }

    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
        const reqId = id++;
        const handler = (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.id === reqId) {
                ws.removeEventListener('message', handler);
                if (msg.error) {
                    reject(msg.error);
                } else {
                    resolve(msg.result);
                }
            }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    const testResults = [];

    // Helper: evaluate expression
    const evaluate = async (expr) => {
        const res = await send('Runtime.evaluate', {
            expression: expr,
            returnByValue: true,
            awaitPromise: true
        });
        return res.result.value;
    };

    try {
        // ==========================================
        // TEST 1: DESKTOP NAVIGATION ON index.html
        // ==========================================
        console.log("\n--- TEST 1: Desktop Navigation (1440x900) ---");
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false
        });

        await send('Page.navigate', { url: 'http://127.0.0.1:5502/' });
        await new Promise(r => setTimeout(r, 2000));

        const deskNavCheck = await evaluate(`(() => {
            // Find Core Practice Areas dropdown
            const toggle = Array.from(document.querySelectorAll('.dropdown-toggle'))
                .find(el => el.textContent.includes('Core Practice Areas'));
            if (!toggle) return { error: 'Core Practice Areas toggle not found' };

            const dropdownMenu = toggle.nextElementSibling;
            if (!dropdownMenu) return { error: 'Dropdown menu not found' };

            const items = Array.from(dropdownMenu.querySelectorAll('a.dropdown-item')).map(a => ({
                text: a.textContent.trim(),
                href: a.getAttribute('href'),
                resolvedHref: a.href
            }));

            const cbItem = items.find(i => i.href.includes('cheque-bounce-lawyer'));
            const plItem = items.find(i => i.href.includes('property-law'));

            return {
                totalItems: items.length,
                items,
                cbItem,
                plItem
            };
        })()`);

        console.log("Desktop Dropdown Items Count:", deskNavCheck.totalItems);
        console.log("Found Cheque Bounce Link:", deskNavCheck.cbItem);
        console.log("Found Property Law Link:", deskNavCheck.plItem);

        const t1_cb_ok = deskNavCheck.cbItem && deskNavCheck.cbItem.text.toUpperCase().includes('CHEQUE BOUNCE');
        const t1_pl_ok = deskNavCheck.plItem && deskNavCheck.plItem.text.includes('Property Law & Due Diligence');

        testResults.push({
            name: "Desktop Core Practice Areas Links Presence",
            passed: Boolean(t1_cb_ok && t1_pl_ok),
            details: { cb: deskNavCheck.cbItem, pl: deskNavCheck.plItem }
        });

        // Click Desktop Cheque Bounce Lawyer Link
        console.log("Clicking Desktop Cheque Bounce Lawyer link...");
        await evaluate(`(() => {
            const toggle = Array.from(document.querySelectorAll('.dropdown-toggle'))
                .find(el => el.textContent.includes('Core Practice Areas'));
            const dropdownMenu = toggle.nextElementSibling;
            const a = dropdownMenu.querySelector('a[href*="cheque-bounce-lawyer"]');
            a.click();
        })()`);
        await new Promise(r => setTimeout(r, 2000));

        const cbPageState = await evaluate(`({
            url: window.location.href,
            title: document.title,
            h1: document.querySelector('h1')?.innerText?.trim(),
            status: 'Loaded'
        })`);
        console.log("Cheque Bounce Page State:", cbPageState);

        testResults.push({
            name: "Desktop Navigation to Cheque Bounce Lawyer Page",
            passed: cbPageState.url.includes('cheque-bounce-lawyer') && cbPageState.title.includes('Cheque Bounce'),
            details: cbPageState
        });

        // Click Desktop Property Law Link from Cheque Bounce page
        console.log("Clicking Desktop Property Law link from Cheque Bounce page...");
        await evaluate(`(() => {
            const toggle = Array.from(document.querySelectorAll('.dropdown-toggle'))
                .find(el => el.textContent.includes('Core Practice Areas'));
            const dropdownMenu = toggle.nextElementSibling;
            const a = dropdownMenu.querySelector('a[href*="property-law"]');
            a.click();
        })()`);
        await new Promise(r => setTimeout(r, 2000));

        const plPageState = await evaluate(`({
            url: window.location.href,
            title: document.title,
            h1: document.querySelector('h1')?.innerText?.trim(),
            status: 'Loaded'
        })`);
        console.log("Property Law Page State:", plPageState);

        testResults.push({
            name: "Desktop Navigation to Property Law Page",
            passed: plPageState.url.includes('property-law') && plPageState.title.length > 0,
            details: plPageState
        });

        // ==========================================
        // TEST 2: MOBILE NAVIGATION (375x812)
        // ==========================================
        console.log("\n--- TEST 2: Mobile Navigation (375x812) ---");
        await send('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 812,
            deviceScaleFactor: 2,
            mobile: true
        });

        await send('Page.navigate', { url: 'http://127.0.0.1:5502/' });
        await new Promise(r => setTimeout(r, 2000));

        // Open mobile menu
        console.log("Opening mobile drawer via #menuToggle...");
        const openDrawerRes = await evaluate(`(() => {
            const toggleBtn = document.querySelector('#menuToggle') || document.querySelector('.menu-toggle');
            if (toggleBtn) {
                toggleBtn.click();
                const menu = document.querySelector('#mobileMenu');
                return { opened: true, hasClassOpen: menu ? (menu.classList.contains('open') || menu.classList.contains('active')) : false };
            }
            return { opened: false };
        })()`);
        console.log("Mobile Drawer Open Result:", openDrawerRes);
        await new Promise(r => setTimeout(r, 500));

        // Toggle mobile practice areas submenu (2nd .m-trigger)
        console.log("Toggling Practice Areas mobile submenu...");
        const openSubmenuRes = await evaluate(`(() => {
            const triggers = Array.from(document.querySelectorAll('.m-link.m-trigger'));
            const practiceTrigger = triggers.find(el => el.textContent.includes('Practice Areas') || el.textContent.includes('PRACTICE AREAS'));
            if (practiceTrigger) {
                practiceTrigger.click();
                const submenu = practiceTrigger.nextElementSibling;
                return {
                    toggled: true,
                    text: practiceTrigger.textContent.trim(),
                    active: submenu ? (submenu.classList.contains('active') || submenu.classList.contains('show')) : false
                };
            }
            return { toggled: false };
        })()`);
        console.log("Practice Submenu Open Result:", openSubmenuRes);
        await new Promise(r => setTimeout(r, 500));

        // Verify mobile items in Core Practice Areas
        const mobileItemsCheck = await evaluate(`(() => {
            const triggers = Array.from(document.querySelectorAll('.m-link.m-trigger'));
            const practiceTrigger = triggers.find(el => el.textContent.includes('Practice Areas') || el.textContent.includes('PRACTICE AREAS'));
            if (!practiceTrigger) return { error: 'Practice trigger not found' };
            const subMenu = practiceTrigger.nextElementSibling;
            if (!subMenu) return { error: 'Submenu not found' };

            const items = Array.from(subMenu.querySelectorAll('a.m-sub-item')).map(a => ({
                text: a.textContent.trim(),
                href: a.getAttribute('href'),
                resolvedHref: a.href,
                visible: a.offsetParent !== null
            }));
            const cb = items.find(i => i.href.includes('cheque-bounce-lawyer'));
            const pl = items.find(i => i.href.includes('property-law'));
            return {
                totalItems: items.length,
                items,
                cb,
                pl
            };
        })()`);
        console.log("Mobile Submenu Items Count:", mobileItemsCheck.totalItems);
        console.log("Mobile Cheque Bounce Item:", mobileItemsCheck.cb);
        console.log("Mobile Property Law Item:", mobileItemsCheck.pl);

        const t2_cb_ok = mobileItemsCheck.cb && mobileItemsCheck.cb.text.includes('CHEQUE BOUNCE LAWYER');
        const t2_pl_ok = mobileItemsCheck.pl && mobileItemsCheck.pl.text.includes('PROPERTY LAW & DUE DILIGENCE');

        testResults.push({
            name: "Mobile Core Practice Areas Links Presence & Labels",
            passed: Boolean(t2_cb_ok && t2_pl_ok),
            details: mobileItemsCheck
        });

        // Click Mobile Cheque Bounce Lawyer
        console.log("Clicking Mobile Cheque Bounce Lawyer link...");
        await evaluate(`(() => {
            const triggers = Array.from(document.querySelectorAll('.m-link.m-trigger'));
            const practiceTrigger = triggers.find(el => el.textContent.includes('Practice Areas') || el.textContent.includes('PRACTICE AREAS'));
            const subMenu = practiceTrigger.nextElementSibling;
            const a = subMenu.querySelector('a[href*="cheque-bounce-lawyer"]');
            a.click();
        })()`);
        await new Promise(r => setTimeout(r, 2000));

        const mobCbNav = await evaluate(`({
            url: window.location.href,
            title: document.title,
            h1: document.querySelector('h1')?.innerText?.trim()
        })`);
        console.log("Mobile Nav to Cheque Bounce Result:", mobCbNav);

        testResults.push({
            name: "Mobile Navigation to Cheque Bounce Lawyer Page",
            passed: mobCbNav.url.includes('cheque-bounce-lawyer'),
            details: mobCbNav
        });

        // ==========================================
        // TEST 3: SUBDIRECTORY PAGE NAVIGATION
        // (nri-landlord-tenant-eviction/index.html)
        // ==========================================
        console.log("\n--- TEST 3: Subdirectory Navigation (nri-landlord-tenant-eviction/) ---");
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false
        });

        await send('Page.navigate', { url: 'http://127.0.0.1:5502/nri-landlord-tenant-eviction/' });
        await new Promise(r => setTimeout(r, 2000));

        const subDirNavCheck = await evaluate(`(() => {
            const toggle = Array.from(document.querySelectorAll('.dropdown-toggle'))
                .find(el => el.textContent.includes('Core Practice Areas'));
            const dropdownMenu = toggle ? toggle.nextElementSibling : null;
            if (!dropdownMenu) return { error: 'Not found' };
            const cb = dropdownMenu.querySelector('a[href*="cheque-bounce-lawyer"]');
            const pl = dropdownMenu.querySelector('a[href*="property-law"]');
            return {
                cbHref: cb ? cb.getAttribute('href') : null,
                plHref: pl ? pl.getAttribute('href') : null,
                cbResolved: cb ? cb.href : null,
                plResolved: pl ? pl.href : null
            };
        })()`);
        console.log("Subdirectory dropdown resolved URLs:", subDirNavCheck);

        testResults.push({
            name: "Subdirectory Navigation Links Integrity",
            passed: subDirNavCheck.cbResolved && subDirNavCheck.cbResolved.includes('http://127.0.0.1:5502/') && !subDirNavCheck.cbResolved.includes('/nri-landlord-tenant-eviction/cheque-bounce-lawyer'),
            details: subDirNavCheck
        });

    } catch (err) {
        console.error("Test execution error:", err);
    } finally {
        ws.close();
        chrome.kill();
    }

    console.log("\n==========================================");
    console.log("TEST SUITE RESULTS SUMMARY:");
    console.log("==========================================");
    let allPassed = true;
    for (const res of testResults) {
        const icon = res.passed ? "PASS" : "FAIL";
        console.log(`[${icon}] ${res.name}`);
        if (!res.passed) allPassed = false;
    }
    console.log(`\nOverall Status: ${allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);
})();
