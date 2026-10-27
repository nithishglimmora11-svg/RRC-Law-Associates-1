const { spawn } = require('child_process');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9256']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const newTabRes = await fetch('http://127.0.0.1:9256/json/new?about:blank', { method: 'PUT' });
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

    for (const page of ['nri-services.html', 'lawfirm-blog.html', 'index.html', 'oci-card-application-documents.html']) {
      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 1200));
      const res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const topbar = document.querySelector('.rrc-topbar');
            const header = document.querySelector('.header');
            return {
              page: "${page}",
              topbarFound: !!topbar,
              topbarBg: topbar ? window.getComputedStyle(topbar).backgroundColor : null,
              topbarColor: topbar ? window.getComputedStyle(topbar).color : null,
              topbarBorderBottom: topbar ? window.getComputedStyle(topbar).borderBottom : null,
              topbarHeight: topbar ? window.getComputedStyle(topbar).height : null,
              headerFound: !!header,
              headerBg: header ? window.getComputedStyle(header).backgroundColor : null,
              headerBorderBottom: header ? window.getComputedStyle(header).borderBottom : null,
              headerHeight: header ? window.getComputedStyle(header).height : null,
              headerTop: header ? window.getComputedStyle(header).top : null,
            };
          })()
        `,
        returnByValue: true
      });
      console.log(res.result.value);
    }
    await send('Browser.close');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}
test();
