const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureSections() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9323',
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const fileUrl = 'file:///' + path.resolve('partners.html').replace(/\\/g, '/');
        const newTabRes = await fetch('http://127.0.0.1:9323/json/new?' + encodeURIComponent(fileUrl), { method: 'PUT' });
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

        await new Promise(r => setTimeout(r, 2000));

        // 1. Scroll to Network Section & Screenshot
        await send('Runtime.evaluate', {
            expression: `document.getElementById('partner-network').scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 800));
        const shotNetwork = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_network_section.png'), Buffer.from(shotNetwork.data, 'base64'));
        console.log('Saved scratch/partners_network_section.png');

        // 2. Scroll to Application Form & Screenshot
        await send('Runtime.evaluate', {
            expression: `document.getElementById('partner-application').scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 800));
        const shotForm = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_form_section.png'), Buffer.from(shotForm.data, 'base64'));
        console.log('Saved scratch/partners_form_section.png');

        // 3. Open Modal & Screenshot
        await send('Runtime.evaluate', {
            expression: `
                const myModal = new bootstrap.Modal(document.getElementById('modalCheeSeremban'));
                myModal.show();
            `
        });
        await new Promise(r => setTimeout(r, 800));
        const shotModal = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_modal.png'), Buffer.from(shotModal.data, 'base64'));
        console.log('Saved scratch/partners_modal.png');

        ws.close();
        console.log('All section screenshots captured successfully!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        browser.kill();
    }
}

captureSections();

