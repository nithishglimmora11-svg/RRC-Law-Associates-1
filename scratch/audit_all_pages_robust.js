const { spawn } = require('child_process');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function auditAllPagesRobust() {
  const allHtml = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  console.log(`Starting robust overflow scan across ${allHtml.length} root HTML pages...`);

  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9280',
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9280/json/new?about:blank', { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      const timer = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 6000);
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

    const testVps = [
      { name: '320px', width: 320, height: 640, mobile: true },
      { name: '390px', width: 390, height: 844, mobile: true },
      { name: '768px', width: 768, height: 1024, mobile: false },
      { name: '1440px', width: 1440, height: 900, mobile: false }
    ];

    const results = [];

    for (let i = 0; i < allHtml.length; i++) {
      const page = allHtml[i];
      process.stdout.write(`[${i+1}/${allHtml.length}] ${page}: `);
      let pageOverflows = [];

      for (const vp of testVps) {
        try {
          await send('Emulation.setDeviceMetricsOverride', {
            width: vp.width,
            height: vp.height,
            deviceScaleFactor: 1,
            mobile: vp.mobile
          });

          await send('Page.navigate', { url: `http://localhost:8080/${page}` });
          await new Promise(r => setTimeout(r, 250));

          const checkRes = await send('Runtime.evaluate', {
            expression: `(() => {
              const scrollW = document.documentElement.scrollWidth;
              const innerW = window.innerWidth;
              const overflow = scrollW - innerW;
              return { overflow: overflow > 1 ? overflow : 0 };
            })()`,
            returnByValue: true
          });

          const val = checkRes.result && checkRes.result.value ? checkRes.result.value : { overflow: 0 };
          if (val.overflow > 1) {
            pageOverflows.push(`${vp.name}(+${val.overflow}px)`);
          }
        } catch (err) {
          pageOverflows.push(`${vp.name}(err: ${err.message})`);
        }
      }

      if (pageOverflows.length === 0) {
        console.log(`OK`);
      } else {
        console.log(`FAIL -> ${pageOverflows.join(', ')}`);
        results.push({ page, issues: pageOverflows });
      }
    }

    console.log(`\n========================================`);
    console.log(`Full scan finished!`);
    console.log(`Failures: ${results.length}`);
    if (results.length > 0) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log(`ALL 45 PAGES PASSED ACROSS ALL VIEWPORTS!`);
    }
    console.log(`========================================`);

    ws.close();
  } catch (e) {
    console.error('Fatal:', e);
  } finally {
    browser.kill();
  }
}

auditAllPagesRobust();
