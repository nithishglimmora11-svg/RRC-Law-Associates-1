const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9258']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const newTabRes = await fetch('http://127.0.0.1:9258/json/new?about:blank', { method: 'PUT' });
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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const pages = [
      'nri-services.html',
      'lawfirm-blog.html',
      'index.html',
      'oci-card-indian-ancestry-assistance.html',
      'oci-card-application-documents.html'
    ];

    for (const page of pages) {
      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 1200));

      // Capture clip of top 150px
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: 0,
          y: 0,
          width: 1440,
          height: 140,
          scale: 1
        }
      });
      const fname = `scratch/header_${page.replace('.html', '')}.png`;
      fs.writeFileSync(fname, Buffer.from(shot.data, 'base64'));
      console.log('Saved', fname);
    }
    await send('Browser.close');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}
capture();
