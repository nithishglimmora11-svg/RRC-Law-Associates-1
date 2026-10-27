const { spawn } = require('child_process');

async function test() {
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9229'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const newTabRes = await fetch('http://127.0.0.1:9229/json/new?about:blank', { method: 'PUT' });
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
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://localhost:8080/oci-for-children-born-abroad.html' });
    await new Promise(r => setTimeout(r, 1500));
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const wa = document.querySelector('.whatsapp-float');
        const host = document.querySelector('.rrc-ai-chat');
        const toggle = host && host.shadowRoot ? host.shadowRoot.querySelector('.rrc-ai-toggle') : null;
        const waRect = wa ? wa.getBoundingClientRect() : null;
        const aiRect = toggle ? toggle.getBoundingClientRect() : null;
        const overlap = (waRect && aiRect) ? !(waRect.bottom <= aiRect.top || waRect.top >= aiRect.bottom || waRect.right <= aiRect.left || waRect.left >= aiRect.right) : true;
        const waInVp = waRect ? (waRect.left >= 0 && waRect.right <= vw + 1 && waRect.top >= 0 && waRect.bottom <= vh + 1) : false;
        const aiInVp = aiRect ? (aiRect.left >= 0 && aiRect.right <= vw + 1 && aiRect.top >= 0 && aiRect.bottom <= vh + 1) : false;
        return {
          waInVp,
          aiInVp,
          overlap,
          verticalGap: (waRect && aiRect) ? Math.round(waRect.top - aiRect.bottom) : null,
          waRightOffset: waRect ? Math.round(vw - waRect.right) : null,
          aiRightOffset: aiRect ? Math.round(vw - aiRect.right) : null,
          waBottomOffset: waRect ? Math.round(vh - waRect.bottom) : null,
          aiBottomOffset: aiRect ? Math.round(vh - aiRect.bottom) : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Result for oci-for-children-born-abroad.html at 1440x900:');
    console.log(JSON.stringify(evalRes.result.value, null, 2));
    ws.close();
  } finally {
    browser.kill();
  }
}

test();
