(async () => {
    const { spawn } = require('child_process');
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9254',
        'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 1500));
    const tabs = await fetch('http://127.0.0.1:9254/json').then(r => r.json());
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
    await send('Page.navigate', { url: 'http://127.0.0.1:5501/nri-rera-builder-disputes.html' });
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to bottom to ensure lazy images load
    await send('Runtime.evaluate', { expression: "window.scrollTo(0, document.body.scrollHeight)" });
    await new Promise(r => setTimeout(r, 1500));

    const details = await send('Runtime.evaluate', {
        expression: "JSON.stringify(Array.from(document.querySelectorAll('main img')).map(img => ({ src: img.src, currentSrc: img.currentSrc, complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, loading: img.loading })))",
        returnByValue: true
    });
    console.log('Main images:', JSON.parse(details.result.value));
    ws.close();
    chrome.kill();
})();

