const { spawn } = require('child_process');

async function testLaunch() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9250'
  ]);

  browser.stderr.on('data', d => console.error('Edge stderr:', d.toString()));
  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9250/json/version');
    const version = await listRes.json();
    console.log('Version:', version);

    const newTabRes = await fetch('http://127.0.0.1:9250/json/new?about:blank', { method: 'PUT' });
    const tab = await newTabRes.json();
    console.log('Tab:', tab.webSocketDebuggerUrl);

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });
    console.log('WS connected!');

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

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-application-documents.html' });
    await new Promise(r => setTimeout(r, 1500));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const topbar = document.querySelector('.rrc-topbar');
          const header = document.querySelector('.header');
          const csT = topbar ? window.getComputedStyle(topbar) : null;
          const csH = header ? window.getComputedStyle(header) : null;
          return {
            topbarBg: csT ? csT.backgroundColor : 'none',
            topbarBorder: csT ? csT.borderBottom : 'none',
            headerBg: csH ? csH.backgroundColor : 'none',
            headerBorder: csH ? csH.borderBottom : 'none',
            headerTop: csH ? csH.top : 'none'
          };
        })()
      `,
      returnByValue: true
    });
    console.log('oci-card-application-documents.html:', evalRes.result.value);

    // Now test nri-services.html
    await send('Page.navigate', { url: 'http://localhost:8080/nri-services.html' });
    await new Promise(r => setTimeout(r, 1500));

    const evalRes2 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const topbar = document.querySelector('.rrc-topbar');
          const header = document.querySelector('.header');
          const csT = topbar ? window.getComputedStyle(topbar) : null;
          const csH = header ? window.getComputedStyle(header) : null;
          return {
            topbarBg: csT ? csT.backgroundColor : 'none',
            topbarBorder: csT ? csT.borderBottom : 'none',
            headerBg: csH ? csH.backgroundColor : 'none',
            headerBorder: csH ? csH.borderBottom : 'none',
            headerTop: csH ? csH.top : 'none'
          };
        })()
      `,
      returnByValue: true
    });
    console.log('nri-services.html:', evalRes2.result.value);

    await send('Browser.close').catch(() => {});
  } catch(e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}

testLaunch();
