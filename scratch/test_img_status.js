(async () => {
    const { spawn } = require('child_process');
    const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chrome = spawn(CHROME_PATH, [
        '--headless=new',
        '--remote-debugging-port=9244',
        'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 1500));
    const tabs = await fetch('http://127.0.0.1:9244/json').then(r => r.json());
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
    await send('Page.navigate', { url: 'http://127.0.0.1:5501/nri-landlord-tenant-eviction/' });
    await new Promise(r => setTimeout(r, 2000));
    
    const pageInfo = await send('Runtime.evaluate', {
        expression: "JSON.stringify({ url: window.location.href, title: document.title, imgCount: document.querySelectorAll('img').length, mainImgCount: document.querySelectorAll('main img').length })",
        returnByValue: true
    });
    console.log('Page info:', JSON.parse(pageInfo.result.value));
    
    const details = await send('Runtime.evaluate', {
        expression: "Array.from(document.querySelectorAll('main img')).map(img => ({ src: img.currentSrc || img.src, complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight }))",
        returnByValue: true
    });
    console.log('Images:', details.result.value);
    ws.close();
    chrome.kill();
})();
