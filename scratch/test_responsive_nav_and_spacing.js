const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runTests() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const port = 9333;
    console.log(`Starting Edge headless on port ${port}...`);

    const browser = spawn(edgePath, [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const partnersUrl = 'file:///' + path.resolve('partners.html').replace(/\\/g, '/');
        const indexUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

        // Create tab for partners.html
        const tabRes = await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURIComponent(partnersUrl), { method: 'PUT' });
        const tab = await tabRes.json();
        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        let id = 1;
        const send = (method, params = {}) => new Promise((resolve, reject) => {
            const msgId = id++;
            const handler = (evt) => {
                const msg = JSON.parse(evt.data);
                if (msg.id === msgId) {
                    ws.removeEventListener('message', handler);
                    if (msg.error) reject(msg.error);
                    else resolve(msg.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: msgId, method, params }));
        });

        await new Promise((res, rej) => {
            ws.addEventListener('open', res);
            ws.addEventListener('error', rej);
        });

        await send('Page.enable');
        await send('DOM.enable');
        await send('Runtime.enable');

        await new Promise(r => setTimeout(r, 1500));

        console.log('\n--- 1. TESTING NAV LINE WRAPPING AT MULTIPLE VIEWPORTS ---');
        const viewports = [1440, 1200, 1080, 1024, 992];
        for (const w of viewports) {
            await send('Emulation.setDeviceMetricsOverride', {
                width: w,
                height: 900,
                deviceScaleFactor: 1,
                mobile: false
            });
            await new Promise(r => setTimeout(r, 500));

            const navCheck = await send('Runtime.evaluate', {
                expression: `
                    (() => {
                        const links = Array.from(document.querySelectorAll('.nav-link-custom'));
                        const partnerLink = links.find(l => l.innerText.includes('Legal Partners') || l.innerText.includes('Partners'));
                        if (!partnerLink) return { found: false };
                        const rects = partnerLink.getClientRects();
                        const computed = window.getComputedStyle(partnerLink);
                        return {
                            found: true,
                            text: partnerLink.innerText.trim(),
                            rectCount: rects.length,
                            width: partnerLink.offsetWidth,
                            height: partnerLink.offsetHeight,
                            lineHeight: computed.lineHeight,
                            whiteSpace: computed.whiteSpace,
                            wrapped: rects.length > 1 || (partnerLink.offsetHeight > 35)
                        };
                    })()
                `,
                returnByValue: true
            });
            console.log(`Viewport ${w}px:`, JSON.stringify(navCheck.result.value));
        }

        // Capture screenshot at 1024px (the critical breakpoint where wrapping occurred earlier)
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1024,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false
        });
        await new Promise(r => setTimeout(r, 500));
        const shot1024 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/nav_desktop_1024.png'), Buffer.from(shot1024.data, 'base64'));
        console.log('Saved scratch/nav_desktop_1024.png');

        // Capture screenshot at 1440px
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false
        });
        await new Promise(r => setTimeout(r, 500));
        const shot1440 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/nav_desktop_1440.png'), Buffer.from(shot1440.data, 'base64'));
        console.log('Saved scratch/nav_desktop_1440.png');

        console.log('\n--- 2. SECTION SPACING & PADDING METRICS ---');
        const spacingMetrics = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    const sections = [
                        { name: 'Hero', sel: '.lp-hero' },
                        { name: 'Benefits', sel: '.lp-benefits' },
                        { name: 'Network', sel: '.lp-network-section' },
                        { name: 'CTA Banner', sel: '.lp-cta-banner' },
                        { name: 'Testimonials', sel: '.lp-testimonials' },
                        { name: 'Application', sel: '.lp-app-section' },
                        { name: 'Preserved Desks', sel: '.lp-preserved-section' }
                    ];
                    return sections.map(s => {
                        const el = document.querySelector(s.sel);
                        if (!el) return { name: s.name, found: false };
                        const comp = window.getComputedStyle(el);
                        return {
                            name: s.name,
                            found: true,
                            height: el.offsetHeight,
                            paddingTop: comp.paddingTop,
                            paddingBottom: comp.paddingBottom
                        };
                    });
                })()
            `,
            returnByValue: true
        });
        console.log('Section Spacing:', JSON.stringify(spacingMetrics.result.value, null, 2));

        console.log('\n--- 3. MOBILE VIEWPORT TEST (375x812) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 812,
            deviceScaleFactor: 2,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 500));

        const mobileCheck = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    const scrollW = document.documentElement.scrollWidth;
                    const innerW = window.innerWidth;
                    const mobLink = document.querySelector('.m-link[href="partners.html"]');
                    return {
                        scrollWidth: scrollW,
                        innerWidth: innerW,
                        hasHorizontalOverflow: scrollW > innerW,
                        mobilePartnerLinkText: mobLink ? mobLink.innerText.trim() : null
                    };
                })()
            `,
            returnByValue: true
        });
        console.log('Mobile Check:', JSON.stringify(mobileCheck.result.value));

        const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_mobile_tightened.png'), Buffer.from(shotMobile.data, 'base64'));
        console.log('Saved scratch/partners_mobile_tightened.png');

        // Close WebSocket
        ws.close();

        console.log('\n--- 4. TESTING INDEX.HTML HOMEPAGE NAVIGATION ---');
        const indexTabRes = await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURIComponent(indexUrl), { method: 'PUT' });
        const indexTab = await indexTabRes.json();
        const wsIndex = new WebSocket(indexTab.webSocketDebuggerUrl);

        let idxId = 1;
        const sendIdx = (method, params = {}) => new Promise((resolve, reject) => {
            const msgId = idxId++;
            const handler = (evt) => {
                const msg = JSON.parse(evt.data);
                if (msg.id === msgId) {
                    wsIndex.removeEventListener('message', handler);
                    if (msg.error) reject(msg.error);
                    else resolve(msg.result);
                }
            };
            wsIndex.addEventListener('message', handler);
            wsIndex.send(JSON.stringify({ id: msgId, method, params }));
        });

        await new Promise((res, rej) => {
            wsIndex.addEventListener('open', res);
            wsIndex.addEventListener('error', rej);
        });

        await sendIdx('Page.enable');
        await sendIdx('Runtime.enable');
        await new Promise(r => setTimeout(r, 1000));

        // Test at 1440 and 1024 on index.html
        for (const w of [1440, 1024]) {
            await sendIdx('Emulation.setDeviceMetricsOverride', {
                width: w,
                height: 900,
                deviceScaleFactor: 1,
                mobile: false
            });
            await new Promise(r => setTimeout(r, 500));

            const indexNavCheck = await sendIdx('Runtime.evaluate', {
                expression: `
                    (() => {
                        const links = Array.from(document.querySelectorAll('.nav-link-custom'));
                        const pLink = links.find(l => l.innerText.includes('Legal Partners') || l.innerText.includes('Partners'));
                        if (!pLink) return { found: false };
                        const rects = pLink.getClientRects();
                        const comp = window.getComputedStyle(pLink);
                        return {
                            found: true,
                            text: pLink.innerText.trim(),
                            rectCount: rects.length,
                            whiteSpace: comp.whiteSpace,
                            wrapped: rects.length > 1 || (pLink.offsetHeight > 35)
                        };
                    })()
                `,
                returnByValue: true
            });
            console.log(`Index.html at ${w}px:`, JSON.stringify(indexNavCheck.result.value));
        }

        const shotIndex = await sendIdx('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/index_nav_verified.png'), Buffer.from(shotIndex.data, 'base64'));
        console.log('Saved scratch/index_nav_verified.png');

        wsIndex.close();

    } finally {
        browser.kill();
        console.log('Edge process terminated.');
    }
}

runTests().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});

