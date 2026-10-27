const { spawn } = require('child_process');
const fs = require('fs');

async function testMobile() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9286']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const newTabRes = await fetch('http://127.0.0.1:9286/json/new?about:blank', { method: 'PUT' });
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
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:8080/oci-legal-guides.html' });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll card into view
    await send('Runtime.evaluate', {
      expression: 'document.querySelector(".hero-visual-card").scrollIntoView();'
    });
    await new Promise(r => setTimeout(r, 500));

    const clip = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.hero-visual-card');
        const rect = card.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      })()`,
      returnByValue: true
    });

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: Math.max(0, clip.result.value.x), y: Math.max(0, clip.result.value.y), width: clip.result.value.width, height: Math.min(844, clip.result.value.height), scale: 1 }
    });
    fs.writeFileSync('scratch/hero_card_mobile_scrolled.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved mobile scrolled shot');
    await send('Browser.close');
  } finally {
    browser.kill();
  }
}
testMobile();
