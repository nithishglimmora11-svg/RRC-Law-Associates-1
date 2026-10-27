const { spawn } = require('child_process');

async function testPage() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9235'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const tabRes = await fetch('http://127.0.0.1:9235/json/new?about:blank', { method: 'PUT' });
    const tab = await tabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (m, p = {}) => new Promise(res => {
      const mid = id++;
      const h = e => {
        const msg = JSON.parse(e.data);
        if (msg.id === mid) {
          ws.removeEventListener('message', h);
          res(msg.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });

    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Runtime.consoleAPICalled' || msg.method === 'Runtime.exceptionThrown') {
        console.log('BROWSER LOG/ERROR:', JSON.stringify(msg.params));
      }
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:8080/nri-oci-property-due-diligence-india.html' });
    await new Promise(r => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const t = document.querySelector('#menuToggle');
          const m = document.querySelector('#mobileMenu');
          const typeofInit = typeof initMobileNavigation;
          const menuOpenBefore = m ? (m.classList.contains('open') || m.classList.contains('active')) : null;
          if (t) t.click();
          const menuOpenAfter = m ? (m.classList.contains('open') || m.classList.contains('active')) : null;
          return {
            hasToggle: !!t,
            hasMenu: !!m,
            typeofInit,
            menuOpenBefore,
            menuOpenAfter
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Evaluation result on due-diligence:');
    console.log(evalRes.result.value);

    ws.close();
  } finally {
    browser.kill();
  }
}

testPage();
