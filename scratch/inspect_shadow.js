const { spawn } = require('child_process');

async function inspectShadow() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9225',
    '--window-size=1280,900'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('http://127.0.0.1:9225/json/new?http://localhost:8080/oci-card-eligibility-legal-status.html', { method: 'PUT' });
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
    await send('Runtime.enable');
    await new Promise(r => setTimeout(r, 1500));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const host = document.querySelector('.rrc-ai-chat');
          if (!host) return { error: 'No .rrc-ai-chat' };
          const shadow = host.shadowRoot;
          if (!shadow) return { error: 'No shadowRoot' };

          const toggle = shadow.querySelector('.rrc-ai-toggle');
          if (!toggle) return { error: 'No .rrc-ai-toggle in shadow' };
          const r = toggle.getBoundingClientRect();
          const cs = window.getComputedStyle(toggle);

          return {
            toggleRect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height },
            display: cs.display,
            visibility: cs.visibility,
            opacity: cs.opacity,
            zIndex: cs.zIndex,
            bg: cs.backgroundColor,
            color: cs.color,
            shadowHTML: shadow.innerHTML.slice(0, 300)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Shadow inspect:', evalRes.result.value);

    // Capture screenshot from CDP
    await send('Page.enable');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    fs.writeFileSync('scratch/cdp_eligibility_shot.png', Buffer.from(shot.data, 'base64'));
    console.log('Wrote scratch/cdp_eligibility_shot.png');

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}

inspectShadow();
