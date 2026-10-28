const { spawn } = require('child_process');

async function checkLoadingFailed() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const port = 9347;
    const browser = spawn(edgePath, [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--no-sandbox',
        '--disable-gpu'
    ]);
    await new Promise(r => setTimeout(r, 2000));

    try {
        const tabRes = await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURIComponent('http://127.0.0.1:5502/partners.html'), { method: 'PUT' });
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
        await send('Network.enable');
        await send('Runtime.enable');

        ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Network.loadingFailed') {
                console.log('[NETWORK FAILURE DETAILS]:', msg.params);
            }
        });

        await new Promise(r => setTimeout(r, 1000));

        // Evaluate fetch directly in page context and log exception
        const fetchEval = await send('Runtime.evaluate', {
            expression: `
                (async () => {
                    try {
                        const fd = new FormData();
                        fd.append('access_key', '070a477f-e139-4bcf-838c-49abddcc0959');
                        fd.append('test', '1');
                        const res = await fetch('https://api.web3forms.com/submit', {
                            method: 'POST',
                            body: fd
                        });
                        return { ok: res.ok, status: res.status, text: await res.text() };
                    } catch (e) {
                        return { error: e.name, message: e.message, stack: e.stack };
                    }
                })()
            `,
            awaitPromise: true,
            returnByValue: true
        });

        console.log('[FETCH EVALUATION RESULT]:', fetchEval.result.value);

        ws.close();
    } finally {
        browser.kill();
    }
}

checkLoadingFailed().catch(console.error);

