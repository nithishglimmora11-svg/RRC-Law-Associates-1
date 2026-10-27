const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runAudit() {
    const tempProfile = path.resolve(__dirname, 'edge-temp-audit-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9288',
        '--user-data-dir=' + tempProfile
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = 'http://localhost:8080/oci-legal-guides.html';
        const newTabRes = await fetch('http://127.0.0.1:9288/json/new?' + targetUrl, { method: 'PUT' });
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

        await send('Page.enable');
        await send('Runtime.enable');

        console.log('=== TEST 1: Desktop Viewport (1280x800) ===');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
            mobile: false
        });

        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 3000));

        // Evaluate closed state
        const closedEval = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host ? host.shadowRoot : null;
                const toggle = shadow ? shadow.querySelector('.rrc-ai-toggle') : null;
                const panel = shadow ? shadow.querySelector('#rrc-ai-window') : null;
                const label = shadow ? shadow.querySelector('.rrc-ai-sr-only') : null;
                const headerEl = document.querySelector('.header');
                const topbarEl = document.querySelector('.rrc-topbar');

                const hostRect = host ? host.getBoundingClientRect() : null;
                const toggleRect = toggle ? toggle.getBoundingClientRect() : null;
                const panelRect = panel ? panel.getBoundingClientRect() : null;
                const headerRect = headerEl ? headerEl.getBoundingClientRect() : null;
                const topbarRect = topbarEl ? topbarEl.getBoundingClientRect() : null;

                const labelStyle = label ? window.getComputedStyle(label) : null;
                const panelStyle = panel ? window.getComputedStyle(panel) : null;

                return {
                    hostRect,
                    toggleRect,
                    panelRect,
                    headerBottom: headerRect ? headerRect.bottom : null,
                    panelVisible: panelStyle ? panelStyle.visibility === 'visible' : null,
                    labelHidden: labelStyle ? (labelStyle.clip !== 'auto' || labelStyle.clipPath !== 'none' || labelStyle.width === '1px') : null
                };
            })()`,
            returnByValue: true
        });
        console.log('Desktop Closed State:', JSON.stringify(closedEval.result.value, null, 2));

        // Click launcher to open
        await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const toggle = host.shadowRoot.querySelector('.rrc-ai-toggle');
                toggle.click();
            })()`
        });
        await new Promise(r => setTimeout(r, 500));

        // Evaluate opened state
        const openEval = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host.shadowRoot;
                const panel = shadow.querySelector('#rrc-ai-window');
                const title = shadow.querySelector('.rrc-ai-title');
                const icon = shadow.querySelector('.rrc-ai-icon');
                const refreshBtn = shadow.querySelector('.rrc-ai-refresh');
                const closeBtn = shadow.querySelector('.rrc-ai-close');
                const bookingLink = shadow.querySelector('.rrc-ai-action');
                const messages = shadow.querySelector('.rrc-ai-messages');
                const quickQuestions = shadow.querySelectorAll('.rrc-ai-quick-question');
                const input = shadow.querySelector('#rrc-ai-input');
                const sendBtn = shadow.querySelector('.rrc-ai-send');
                const disclaimer = shadow.querySelector('.rrc-ai-disclaimer');
                const headerEl = document.querySelector('.header');

                const panelRect = panel.getBoundingClientRect();
                const headerRect = headerEl ? headerEl.getBoundingClientRect() : null;
                const panelStyle = window.getComputedStyle(panel);
                const titleStyle = window.getComputedStyle(title);

                return {
                    panelRect: { top: panelRect.top, bottom: panelRect.bottom, left: panelRect.left, right: panelRect.right, width: panelRect.width, height: panelRect.height },
                    headerBottom: headerRect ? headerRect.bottom : null,
                    gapToHeader: headerRect ? panelRect.top - headerRect.bottom : null,
                    panelVisibility: panelStyle.visibility,
                    panelOpacity: panelStyle.opacity,
                    titleText: title ? title.textContent : null,
                    titleColor: titleStyle.color,
                    iconSrc: icon ? icon.src : null,
                    hasRefresh: !!refreshBtn,
                    hasClose: !!closeBtn,
                    bookingHref: bookingLink ? bookingLink.getAttribute('href') : null,
                    quickQuestionsCount: quickQuestions.length,
                    hasInput: !!input,
                    hasSendBtn: !!sendBtn,
                    hasDisclaimer: !!disclaimer
                };
            })()`,
            returnByValue: true
        });
        console.log('Desktop Open State:', JSON.stringify(openEval.result.value, null, 2));

        // Screenshot desktop open
        const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'desktop_open_verified.png'), Buffer.from(shotDesktop.data, 'base64'));
        console.log('Saved desktop_open_verified.png');

        // Test clicking a quick question
        const quickClickRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host.shadowRoot;
                const firstBtn = shadow.querySelector('.rrc-ai-quick-question');
                if (firstBtn) {
                    firstBtn.click();
                    return { clicked: true, text: firstBtn.textContent };
                }
                return { clicked: false };
            })()`,
            returnByValue: true
        });
        console.log('Quick Question Click:', quickClickRes.result.value);
        await new Promise(r => setTimeout(r, 600));

        // Check messages after click
        const messageCount = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const msgs = host.shadowRoot.querySelectorAll('.rrc-ai-message');
                return msgs.length;
            })()`,
            returnByValue: true
        });
        console.log('Messages count after quick question:', messageCount.result.value);

        // Test refresh
        await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                host.shadowRoot.querySelector('.rrc-ai-refresh').click();
            })()`
        });
        await new Promise(r => setTimeout(r, 300));
        const afterRefreshCount = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                return host.shadowRoot.querySelectorAll('.rrc-ai-message').length;
            })()`,
            returnByValue: true
        });
        console.log('Messages count after refresh (should be 0):', afterRefreshCount.result.value);

        // Test close button
        await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                host.shadowRoot.querySelector('.rrc-ai-close').click();
            })()`
        });
        await new Promise(r => setTimeout(r, 300));
        const closedAgain = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                return window.getComputedStyle(host.shadowRoot.querySelector('#rrc-ai-window')).visibility;
            })()`,
            returnByValue: true
        });
        console.log('Panel visibility after close button (should be hidden):', closedAgain.result.value);

        console.log('\n=== TEST 2: Mobile Viewport (375x667) ===');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            mobile: true
        });
        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 3000));

        // Open on mobile
        await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                host.shadowRoot.querySelector('.rrc-ai-toggle').click();
            })()`
        });
        await new Promise(r => setTimeout(r, 500));

        const mobileOpenEval = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host.shadowRoot;
                const panel = shadow.querySelector('#rrc-ai-window');
                const toggle = shadow.querySelector('.rrc-ai-toggle');
                const headerEl = document.querySelector('.header');
                const wa = document.querySelector('.whatsapp-float');

                const panelRect = panel.getBoundingClientRect();
                const headerRect = headerEl ? headerEl.getBoundingClientRect() : null;
                const waRect = wa ? wa.getBoundingClientRect() : null;

                return {
                    panelRect: { top: panelRect.top, bottom: panelRect.bottom, left: panelRect.left, right: panelRect.right, width: panelRect.width, height: panelRect.height },
                    headerBottom: headerRect ? headerRect.bottom : null,
                    gapToHeader: headerRect ? panelRect.top - headerRect.bottom : null,
                    waTop: waRect ? waRect.top : null,
                    gapToWa: waRect ? waRect.top - panelRect.bottom : null,
                    fitsHorizontally: panelRect.left >= 0 && panelRect.right <= 375,
                    fitsVertically: panelRect.top >= 0 && panelRect.bottom <= 667
                };
            })()`,
            returnByValue: true
        });
        console.log('Mobile Open State:', JSON.stringify(mobileOpenEval.result.value, null, 2));

        // Screenshot mobile open
        const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'mobile_open_verified.png'), Buffer.from(shotMobile.data, 'base64'));
        console.log('Saved mobile_open_verified.png');

        // Test 3: Check oci-card-assistance.html
        console.log('\n=== TEST 3: oci-card-assistance.html ===');
        await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
        await new Promise(r => setTimeout(r, 2500));
        await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                if (host && host.shadowRoot) host.shadowRoot.querySelector('.rrc-ai-toggle').click();
            })()`
        });
        await new Promise(r => setTimeout(r, 500));
        const assistEval = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host ? host.shadowRoot : null;
                const panel = shadow ? shadow.querySelector('#rrc-ai-window') : null;
                return {
                    mounted: !!host,
                    hasShadow: !!shadow,
                    visibility: panel ? window.getComputedStyle(panel).visibility : null,
                    top: panel ? panel.getBoundingClientRect().top : null
                };
            })()`,
            returnByValue: true
        });
        console.log('Assistance page result:', JSON.stringify(assistEval.result.value, null, 2));

        // Test 4: Check oci-card-application-documents.html
        console.log('\n=== TEST 4: oci-card-application-documents.html ===');
        await send('Page.navigate', { url: 'http://localhost:8080/oci-card-application-documents.html' });
        await new Promise(r => setTimeout(r, 2500));
        await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                if (host && host.shadowRoot) host.shadowRoot.querySelector('.rrc-ai-toggle').click();
            })()`
        });
        await new Promise(r => setTimeout(r, 500));
        const docEval = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host ? host.shadowRoot : null;
                const panel = shadow ? shadow.querySelector('#rrc-ai-window') : null;
                return {
                    mounted: !!host,
                    hasShadow: !!shadow,
                    visibility: panel ? window.getComputedStyle(panel).visibility : null,
                    top: panel ? panel.getBoundingClientRect().top : null
                };
            })()`,
            returnByValue: true
        });
        console.log('Documents article page result:', JSON.stringify(docEval.result.value, null, 2));

        ws.close();
    } catch (e) {
        console.error('Error during audit:', e);
    } finally {
        browser.kill();
        process.exit(0);
    }
}

runAudit();
