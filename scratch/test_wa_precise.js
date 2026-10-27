const { spawn } = require('child_process');

async function testWa() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9260',
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9260/json/new?about:blank', { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      const timer = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 5000);
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');

    const pages = [
      'index.html',
      'oci-card-assistance.html',
      'oci-legal-guides.html',
      'oci-card-eligibility-legal-status.html',
      'nri-oci-property-due-diligence-india.html',
      'partners.html'
    ];

    for (const page of pages) {
      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 1000));

      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('a.whatsapp-float');
          if (!btn) return { found: false };
          const rect = btn.getBoundingClientRect();
          const style = window.getComputedStyle(btn);
          return {
            found: true,
            position: style.position,
            bottom: style.bottom,
            right: style.right,
            zIndex: style.zIndex,
            rectRight: Math.round(rect.right),
            rectBottom: Math.round(rect.bottom),
            inViewport: rect.right <= window.innerWidth && rect.bottom <= window.innerHeight
          };
        })()`,
        returnByValue: true
      });
      console.log(`${page}:`, JSON.stringify(res.result.value));
    }

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    browser.kill();
  }
}

testWa();
