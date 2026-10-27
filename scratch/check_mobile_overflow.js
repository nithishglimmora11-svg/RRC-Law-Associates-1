const { spawn } = require('child_process');

async function testOverflow() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9223',
    '--window-size=390,844',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

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
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-eligibility-legal-status.html' });
    await new Promise(r => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const vw = window.innerWidth;
          const bodySW = document.body.scrollWidth;
          const docSW = document.documentElement.scrollWidth;

          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > vw + 1) {
              overflowing.push({
                tag: el.tagName,
                cls: el.className,
                id: el.id,
                right: Math.round(r.right),
                width: Math.round(r.width),
                text: (el.textContent || '').trim().slice(0, 30)
              });
            }
          });

          return { vw, bodySW, docSW, overflowingCount: overflowing.length, items: overflowing.slice(0, 20) };
        })()
      `,
      returnByValue: true
    });

    console.log(JSON.stringify(evalRes.result.value, null, 2));

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}

testOverflow();
