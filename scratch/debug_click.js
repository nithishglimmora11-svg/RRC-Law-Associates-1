(async () => {
    const { spawn } = require('child_process');
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=9258',
        'about:blank'
    ]);
    await new Promise(r => setTimeout(r, 1500));
    const tabs = await fetch('http://127.0.0.1:9258/json').then(r => r.json());
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

    ws.addEventListener('message', (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('[Browser Console]', msg.params.args.map(a => a.value || a.description).join(' '));
        }
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5501/' });
    await new Promise(r => setTimeout(r, 2500));

    const checkScripts = await send('Runtime.evaluate', {
        expression: `Array.from(document.querySelectorAll('script')).map(s => s.src)`
    });
    console.log('Scripts on page:', checkScripts.result.value);

    // Test the click
    const clickEv = await send('Runtime.evaluate', {
        expression: `(() => {
            const link = document.querySelector('a[href="/nri-rera-builder-disputes/"]');
            console.log('Target link:', link ? link.outerHTML : 'NOT FOUND');
            if (link) link.click();
        })()`
    });

    await new Promise(r => setTimeout(r, 3000));

    const finalState = await send('Runtime.evaluate', {
        expression: `({ url: window.location.href, title: document.title })`,
        returnByValue: true
    });
    console.log('Final State:', finalState.result.value);

    ws.close();
    chrome.kill();
})();

