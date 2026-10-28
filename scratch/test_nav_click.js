(async () => {
    const { spawn } = require('child_process');
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9256',
        'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 1500));
    const tabs = await fetch('http://127.0.0.1:9256/json').then(r => r.json());
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
    await send('Page.navigate', { url: 'http://127.0.0.1:5501/' });
    await new Promise(r => setTimeout(r, 2500));

    // Find the link to /nri-rera-builder-disputes/ and click it
    const clickResult = await send('Runtime.evaluate', {
        expression: `(() => {
            const link = document.querySelector('a[href="/nri-rera-builder-disputes/"]');
            if (!link) return { found: false };
            link.click();
            return { found: true, href: link.href };
        })()`,
        returnByValue: true
    });
    console.log('Click result:', clickResult.result.value);

    // Wait 2.5s for navigation
    await new Promise(r => setTimeout(r, 2500));

    const navResult = await send('Runtime.evaluate', {
        expression: `({ url: window.location.href, title: document.title, h1: document.querySelector('h1')?.innerText })`,
        returnByValue: true
    });
    console.log('Post-navigation page state:', navResult.result.value);

    ws.close();
    chrome.kill();
})();

