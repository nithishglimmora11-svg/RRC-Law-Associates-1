const { spawn } = require('child_process');

async function testMobile(width, height, filename) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9226',
    `--window-size=${width},${height}`
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch(`http://127.0.0.1:9226/json/new?http://localhost:8080/oci-card-eligibility-legal-status.html`, { method: 'PUT' });
    const tab = await res.json();
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
      width,
      height,
      deviceScaleFactor: 1,
      mobile: true
    });
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const wa = document.querySelector('.whatsapp-float');
          const waRect = wa ? wa.getBoundingClientRect() : null;
          const host = document.querySelector('.rrc-ai-chat');
          const toggle = host && host.shadowRoot ? host.shadowRoot.querySelector('.rrc-ai-toggle') : null;
          const aiRect = toggle ? toggle.getBoundingClientRect() : null;

          return {
            vw, vh,
            waRect: waRect ? { left: waRect.left, top: waRect.top, right: waRect.right, bottom: waRect.bottom, width: waRect.width, height: waRect.height } : null,
            aiRect: aiRect ? { left: aiRect.left, top: aiRect.top, right: aiRect.right, bottom: aiRect.bottom, width: aiRect.width, height: aiRect.height } : null,
            hasOverlap: (waRect && aiRect) ? !(waRect.bottom <= aiRect.top || waRect.top >= aiRect.bottom || waRect.right <= aiRect.left || waRect.left >= aiRect.right) : false
          };
        })()
      `,
      returnByValue: true
    });

    console.log(`[${width}x${height}] Result:`, evalRes.result.value);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    fs.writeFileSync(filename, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${filename}`);

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}

async function runAll() {
  await testMobile(390, 844, 'scratch/elig_mobile_390.png');
  await new Promise(r => setTimeout(r, 1000));
  await testMobile(360, 780, 'scratch/elig_mobile_360.png');
}

runAll();
