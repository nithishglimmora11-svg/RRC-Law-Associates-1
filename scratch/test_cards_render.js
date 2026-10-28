const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureMore() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9324',
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const fileUrl = 'file:///' + path.resolve('partners.html').replace(/\\/g, '/');
        const newTabRes = await fetch('http://127.0.0.1:9324/json/new?' + encodeURIComponent(fileUrl), { method: 'PUT' });
        const tab = await newTabRes.json();
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

        await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false
        });

        await new Promise(r => setTimeout(r, 1500));

        // 1. Scroll to partner directory cards
        await send('Runtime.evaluate', {
            expression: `document.getElementById('partner-directory').scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 600));
        const shotCards = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_cards.png'), Buffer.from(shotCards.data, 'base64'));
        console.log('Saved scratch/partners_cards.png');

        // 2. Scroll to CTA banner and testimonials
        await send('Runtime.evaluate', {
            expression: `document.getElementById('become-partner').scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 600));
        const shotCTA = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_cta_testimonials.png'), Buffer.from(shotCTA.data, 'base64'));
        console.log('Saved scratch/partners_cta_testimonials.png');

        ws.close();
        console.log('Done!');
    } catch (e) {
        console.error(e);
    } finally {
        browser.kill();
    }
}

captureMore();

