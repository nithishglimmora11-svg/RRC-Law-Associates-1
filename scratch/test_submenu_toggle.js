const { spawn } = require('child_process');

async function testSubmenu() {
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless', '--remote-debugging-port=9290']);
  await new Promise(r => setTimeout(r, 1500));
  try {
    const res = await fetch('http://127.0.0.1:9290/json/new?about:blank', { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    let id = 1;
    const send = (m, p = {}) => new Promise(resolve => {
      const mid = id++;
      const h = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === mid) {
          ws.removeEventListener('message', h);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:8080/index.html' });
    await new Promise(r => setTimeout(r, 800));

    const testRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const toggle = document.querySelector('#menuToggle');
        toggle.click();
        
        const trigger = document.querySelector('.m-trigger');
        const submenu = trigger.nextElementSibling;
        
        const state0 = submenu.classList.contains('active');
        trigger.click();
        const state1 = submenu.classList.contains('active');
        trigger.click(); // click again: should close!
        const state2 = submenu.classList.contains('active');
        
        return { state0, state1, state2, canClose: state2 === false };
      })()`,
      returnByValue: true
    });
    console.log('Submenu accordion toggle test:', testRes.result.value);
    ws.close();
  } finally {
    browser.kill();
  }
}

testSubmenu();
