(async () => {
    const { spawn } = require('child_process');
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9260',
        'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 1500));
    const tabs = await fetch('http://127.0.0.1:9260/json').then(r => r.json());
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
        const reqId = id++;
        const handler = (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.id === reqId) {
                ws.removeEventListener('message', handler);
                res(msg.result);
            }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
    });
    await send('Page.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url: 'http://127.0.0.1:5501/nri-services.html' });
    await new Promise(r => setTimeout(r, 2500));

    // Find card link to /nri-rera-builder-disputes/ and click it
    const clickEv = await send('Runtime.evaluate', {
        expression: `(() => {
            const card = document.querySelector('a[href="/nri-rera-builder-disputes/"]');
            if (card) {
                card.click();
                return { clicked: true, text: card.innerText.trim() };
            }
            return { clicked: false };
        })()`,
        returnByValue: true
    });
    console.log('Card Click:', clickEv.result.value);

    await new Promise(r => setTimeout(r, 3000));

    const finalState = await send('Runtime.evaluate', {
        expression: `({ url: window.location.href, title: document.title, h1: document.querySelector('h1')?.innerText })`,
        returnByValue: true
    });
    console.log('Card Destination State:', finalState.result.value);

    ws.close();
    chrome.kill();
})();

