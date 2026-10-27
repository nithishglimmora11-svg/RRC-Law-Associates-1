const { spawn } = require('child_process');

async function testTargeted() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9271']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const newTabRes = await fetch('http://127.0.0.1:9271/json/new?about:blank', { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');

    const testPages = ['oci-card-indian-ancestry-assistance.html', 'oci-cardholders-inherit-sell-ancestral-property-india.html'];
    const vps = [
      { name: 'Mobile Large', width: 390, height: 844 },
      { name: 'Mobile Compact', width: 360, height: 780 },
      { name: 'Tablet Portrait', width: 768, height: 1024 }
    ];

    for (const p of testPages) {
      for (const vp of vps) {
        await send('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: true });
        await send('Page.navigate', { url: `http://localhost:8080/${p}` });
        await new Promise(r => setTimeout(r, 1500));
        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const t = document.querySelector('.rrc-topbar');
            const h = document.querySelector('.header');
            return {
              topbarBg: t ? window.getComputedStyle(t).backgroundColor : null,
              topbarBorder: t ? window.getComputedStyle(t).borderBottom : null,
              headerBg: h ? window.getComputedStyle(h).backgroundColor : null
            };
          })()`,
          returnByValue: true
        });
        console.log(p, vp.name, res.result.value);
      }
    }
    await send('Browser.close');
  } finally {
    browser.kill();
  }
}
testTargeted();
