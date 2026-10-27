const { spawn } = require('child_process');

const samplePages = [
  'index.html',
  'nri-services.html',
  'core-practice-areas.html',
  'oci-legal-guides.html',
  'oci-card-eligibility-legal-status.html',
  'nri-oci-property-due-diligence-india.html',
  'lawfirm-blog.html',
  'booking.html',
  'partners.html'
];

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'desktop-1280', width: 1280, height: 800, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'mobile-360', width: 360, height: 780, mobile: true }
];

async function runViewportSuite() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9237'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9237/json/new?about:blank', { method: 'PUT' });
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

    console.log(`Testing Navigation & Layout across ${viewports.length} viewports...`);
    let allPassed = true;

    for (const page of samplePages) {
      for (const vp of viewports) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile
        });

        await send('Page.navigate', { url: `http://localhost:8080/${page}` });
        await new Promise(r => setTimeout(r, 1000));

        const evalRes = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const sw = document.documentElement.scrollWidth;
              const vw = window.innerWidth;
              const hScroll = sw > vw + 1;

              const wa = document.querySelector('.whatsapp-float');
              const host = document.querySelector('.rrc-ai-chat');
              const ai = host && host.shadowRoot ? host.shadowRoot.querySelector('.rrc-ai-toggle') : null;

              const waRect = wa ? wa.getBoundingClientRect() : null;
              const aiRect = ai ? ai.getBoundingClientRect() : null;

              const overlap = (waRect && aiRect) ? !(waRect.bottom <= aiRect.top || waRect.top >= aiRect.bottom || waRect.right <= aiRect.left || waRect.left >= aiRect.right) : false;

              // Check nav element visibility
              const header = document.querySelector('.header, header, nav');
              const headerVisible = header ? (header.offsetWidth > 0 && header.offsetHeight > 0) : false;

              return {
                hScroll,
                overlap,
                headerVisible,
                waVisible: !!wa,
                aiVisible: !!ai
              };
            })()
          `,
          returnByValue: true
        });

        const res = evalRes.result.value;
        const pass = !res.hScroll && !res.overlap && res.headerVisible;
        if (!pass) allPassed = false;
        console.log(`[${vp.name}] ${page} -> Pass: ${pass} | HScroll: ${res.hScroll} | Overlap: ${res.overlap} | Header: ${res.headerVisible} | WA: ${res.waVisible} | AI: ${res.aiVisible}`);
      }
    }

    console.log(`\nAll Viewport Navigation Tests Passed: ${allPassed}`);
    ws.close();
  } finally {
    browser.kill();
  }
}

runViewportSuite();
