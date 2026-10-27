const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function testLive() {
    const tempProfile = path.resolve(__dirname, 'edge-temp-live-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9270',
        `--user-data-dir=${tempProfile}`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = 'https://rrclawassociates.com/oci-legal-guides/';
        const newTabRes = await fetch(`http://127.0.0.1:9270/json/new?${targetUrl}`, { method: 'PUT' });
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

        const networkEvents = [];
        const consoleEvents = [];

        ws.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data);
            if (data.method === 'Network.responseReceived') {
                networkEvents.push({
                    url: data.params.response.url,
                    status: data.params.response.status
                });
            }
            if (data.method === 'Runtime.consoleAPICalled') {
                consoleEvents.push(data.params.args.map(a => a.value || a.description).join(' '));
            }
        });

        await send('Page.enable');
        await send('Network.enable');
        await send('Runtime.enable');

        await send('Emulation.setDeviceMetricsOverride', {
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
            mobile: false
        });

        console.log('Navigating to live page...');
        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 5000));

        // Evaluate DOM & styles
        const evalRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const mount = document.querySelector('[data-rrc-ai-chat-root]');
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host ? host.shadowRoot : null;
                const toggle = shadow ? shadow.querySelector('.rrc-ai-toggle') : null;
                const panel = shadow ? shadow.querySelector('#rrc-ai-window') : null;
                const link = shadow ? shadow.querySelector('link[rel="stylesheet"]') : null;
                const critical = shadow ? shadow.querySelector('style') : null;

                const hostRect = host ? host.getBoundingClientRect() : null;
                const panelRect = panel ? panel.getBoundingClientRect() : null;
                const toggleRect = toggle ? toggle.getBoundingClientRect() : null;

                const hostStyle = host ? window.getComputedStyle(host) : null;
                const panelStyle = panel ? shadow.getSelection ? null : window.getComputedStyle(panel) : null;

                // Also check if any unstyled elements are sitting in light DOM!
                const lightForm = document.querySelector('form.rrc-ai-form');
                const lightWindow = document.querySelector('#rrc-ai-window');
                const lightInputs = Array.from(document.querySelectorAll('textarea, input, button')).filter(el => el.className && el.className.includes('rrc-ai'));

                return {
                    mountExists: !!mount,
                    hostExists: !!host,
                    hasShadowRoot: !!shadow,
                    stylesheetHref: link ? link.href : null,
                    criticalStylePresent: !!critical,
                    criticalContent: critical ? critical.textContent : null,
                    hostRect: hostRect ? { top: hostRect.top, left: hostRect.left, width: hostRect.width, height: hostRect.height } : null,
                    panelRect: panelRect ? { top: panelRect.top, left: panelRect.left, width: panelRect.width, height: panelRect.height } : null,
                    toggleRect: toggleRect ? { top: toggleRect.top, left: toggleRect.left, width: toggleRect.width, height: toggleRect.height } : null,
                    hostPosition: hostStyle ? hostStyle.position : null,
                    hostDisplay: hostStyle ? hostStyle.display : null,
                    hostZIndex: hostStyle ? hostStyle.zIndex : null,
                    panelVisibility: panelStyle ? panelStyle.visibility : null,
                    panelDisplay: panelStyle ? panelStyle.display : null,
                    panelPosition: panelStyle ? panelStyle.position : null,
                    lightFormFound: !!lightForm,
                    lightWindowFound: !!lightWindow,
                    lightAiElementsCount: lightInputs.length
                };
            })()`,
            returnByValue: true
        });

        console.log('Live Evaluation:', JSON.stringify(evalRes.result.value, null, 2));

        // Take a screenshot of the top-right and full viewport
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'live_top_screenshot.png'), Buffer.from(shot.data, 'base64'));
        console.log('Screenshot saved to scratch/live_top_screenshot.png');

        console.log('\nRelevant Network Requests:');
        const styleReqs = networkEvents.filter(e => e.url.includes('style') || e.url.includes('script'));
        console.log(styleReqs);

        console.log('\nConsole Events:');
        console.log(consoleEvents);

        ws.close();
    } catch (e) {
        console.error('Error:', e);
    } finally {
        browser.kill();
        process.exit(0);
    }
}

testLive();
