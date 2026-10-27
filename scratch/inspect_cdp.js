const { spawn } = require('child_process');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9222',
    '--window-size=1280,900',
    'http://localhost:8080/oci-card-eligibility-legal-status.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    console.log('Tabs available:', tabs.length);
    const tab = tabs.find(t => t.url.includes('oci-card-eligibility-legal-status')) || tabs[0];
    console.log('Selected tab:', tab.url);
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

    await send('Runtime.enable');
    await new Promise(r => setTimeout(r, 1000));

    // Evaluate
    const result = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const waElements = Array.from(document.querySelectorAll('.whatsapp-float, .floating-whatsapp')).map(el => {
            const r = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            return {
              tag: el.tagName,
              cls: el.className,
              rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height },
              csRight: cs.right,
              csBottom: cs.bottom,
              zIndex: cs.zIndex
            };
          });

          const aiRoot = document.querySelector('[data-rrc-ai-chat-root]');
          let aiInfo = null;
          if (aiRoot) {
            const r = aiRoot.getBoundingClientRect();
            const cs = window.getComputedStyle(aiRoot);
            const chatHost = aiRoot.querySelector('.rrc-ai-chat');
            aiInfo = {
              rootRect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height },
              hasChatHost: !!chatHost,
              hasShadowRoot: !!(chatHost && chatHost.shadowRoot)
            };
          }

          return { vw, vh, waElements, aiInfo };
        })()
      `,
      returnByValue: true
    });

    console.log(JSON.stringify(result.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    browser.kill();
  }
}

run();
