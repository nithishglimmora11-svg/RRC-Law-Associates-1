const { spawn } = require('child_process');
const fs = require('fs');
const glob = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function auditAllPages() {
  const allHtml = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  console.log(`Auditing all ${allHtml.length} root HTML pages for horizontal overflow...`);

  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9270',
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9270/json/new?about:blank', { method: 'PUT' });
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

    const testVps = [
      { name: '320px', width: 320, height: 640, mobile: true },
      { name: '390px', width: 390, height: 844, mobile: true },
      { name: '768px', width: 768, height: 1024, mobile: false },
      { name: '1440px', width: 1440, height: 900, mobile: false }
    ];

    const failures = [];

    for (const page of allHtml) {
      for (const vp of testVps) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile
        });

        await send('Page.navigate', { url: `http://localhost:8080/${page}` });
        await new Promise(r => setTimeout(r, 400));

        const checkRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const scrollW = document.documentElement.scrollWidth;
            const innerW = window.innerWidth;
            const overflow = scrollW - innerW;
            if (overflow > 1) {
              const all = document.querySelectorAll('*');
              let culprit = null;
              for (const el of all) {
                const r = el.getBoundingClientRect();
                if (r.right > innerW + 2 && r.width > 0 && r.height > 0) {
                  const s = window.getComputedStyle(el);
                  if (s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0') {
                    culprit = el.tagName + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
                    break;
                  }
                }
              }
              return { overflow, culprit };
            }
            return { overflow: 0 };
          })()`,
          returnByValue: true
        });

        const val = checkRes.result.value;
        if (val.overflow > 1) {
          failures.push({ page, vp: vp.name, overflow: val.overflow, culprit: val.culprit });
          console.log(`❌ OVERFLOW on ${page} at ${vp.name}: +${val.overflow}px (${val.culprit})`);
        }
      }
    }

    console.log(`\n========================================`);
    console.log(`Completed audit across ${allHtml.length} pages x 4 viewports (${allHtml.length * 4} tests)!`);
    if (failures.length === 0) {
      console.log(`✅ ZERO horizontal overflows found across all ${allHtml.length * 4} tests!`);
    } else {
      console.log(`⚠️ Found ${failures.length} overflows:`, JSON.stringify(failures, null, 2));
    }
    console.log(`========================================`);

    fs.writeFileSync('scratch/all_pages_overflow_results.json', JSON.stringify(failures, null, 2));
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    browser.kill();
  }
}

auditAllPages();
