const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function testClick() {
    const tempProfile = path.resolve(__dirname, 'edge-temp-click-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9272',
        `--user-data-dir=${tempProfile}`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = 'https://rrclawassociates.com/oci-legal-guides/';
        const newTabRes = await fetch(`http://127.0.0.1:9272/json/new?${targetUrl}`, { method: 'PUT' });
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
        await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });

        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 4000));

        // Click the toggle button inside the shadowRoot
        const clickRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const host = document.querySelector('.rrc-ai-chat');
                const shadow = host ? host.shadowRoot : null;
                const toggle = shadow ? shadow.querySelector('.rrc-ai-toggle') : null;
                const panel = shadow ? shadow.querySelector('#rrc-ai-window') : null;
                if (!toggle || !panel) return { error: 'Not found' };
                toggle.click();
                return {
                    clicked: true,
                    hostClasses: host.className,
                    panelClasses: panel.className,
                    panelVisibleClass: panel.classList.contains('rrc-ai-visible'),
                    panelComputedVisibility: window.getComputedStyle(panel).visibility,
                    panelComputedDisplay: window.getComputedStyle(panel).display,
                    panelComputedPosition: window.getComputedStyle(panel).position,
                    panelComputedTop: window.getComputedStyle(panel).top,
                    panelComputedBottom: window.getComputedStyle(panel).bottom,
                    panelComputedRight: window.getComputedStyle(panel).right,
                    panelComputedBackground: window.getComputedStyle(panel).backgroundColor,
                    panelComputedWidth: window.getComputedStyle(panel).width,
                    panelComputedHeight: window.getComputedStyle(panel).height
                };
            })()`,
            returnByValue: true
        });

        console.log('Click Evaluation:', JSON.stringify(clickRes.result.value, null, 2));

        await new Promise(r => setTimeout(r, 1000));
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'live_clicked_screenshot.png'), Buffer.from(shot.data, 'base64'));
        console.log('Screenshot saved to scratch/live_clicked_screenshot.png');

        ws.close();
    } catch (e) {
        console.error('Error:', e);
    } finally {
        browser.kill();
        process.exit(0);
    }
}

testClick();
