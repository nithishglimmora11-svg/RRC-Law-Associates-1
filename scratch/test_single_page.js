const { spawn } = require('child_process');

async function test() {
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless', '--remote-debugging-port=9285']);
  await new Promise(r => setTimeout(r, 1500));
  try {
    const res = await fetch('http://127.0.0.1:9285/json/new?about:blank', { method: 'PUT' });
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
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://localhost:8080/oci-vs-nri-vs-indian-citizen.html' });
    await new Promise(r => setTimeout(r, 800));
    const evalRes = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollWidth + " vs " + window.innerWidth' });
    console.log('Result for oci-vs-nri-vs-indian-citizen.html at 1440px:', evalRes.result.value);
    ws.close();
  } finally {
    browser.kill();
  }
}

test();
