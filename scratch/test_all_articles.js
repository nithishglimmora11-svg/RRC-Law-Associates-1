const { spawn } = require('child_process');

const articles = [
  'oci-card-eligibility-legal-status.html',
  'oci-vs-nri-vs-indian-citizen.html',
  'oci-card-application-documents.html',
  'oci-foreign-spouse-eligibility.html',
  'oci-for-children-born-abroad.html',
  'oci-card-benefits-restrictions-india.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'nri-oci-property-due-diligence-india.html',
  'nri-oci-property-tax-india.html',
  'oci-card-renewal-passport-update.html',
  'oci-card-cancellation-grounds-remedies.html',
  'oci-card-cancellation-section-7d-legal-remedies.html'
];

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'desktop-1280', width: 1280, height: 800, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'mobile-360', width: 360, height: 780, mobile: true }
];

async function runTestSuite() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9227'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const results = [];

  try {
    const newTabRes = await fetch('http://127.0.0.1:9227/json/new?about:blank', { method: 'PUT' });
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

    for (const art of articles) {
      console.log(`\n================ Testing ${art} ================`);
      for (const vp of viewports) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile
        });

        await send('Page.navigate', { url: `http://localhost:8080/${art}` });
        await new Promise(r => setTimeout(r, 1200));

        const evalRes = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const vw = window.innerWidth;
              const vh = window.innerHeight;
              const sw = document.documentElement.scrollWidth;

              const wa = document.querySelector('.whatsapp-float');
              const waRect = wa ? wa.getBoundingClientRect() : null;
              const waCs = wa ? window.getComputedStyle(wa) : null;

              const host = document.querySelector('.rrc-ai-chat');
              const toggle = host && host.shadowRoot ? host.shadowRoot.querySelector('.rrc-ai-toggle') : null;
              const aiRect = toggle ? toggle.getBoundingClientRect() : null;
              const aiCs = toggle ? window.getComputedStyle(toggle) : null;

              const overlap = (waRect && aiRect) ? !(waRect.bottom <= aiRect.top || waRect.top >= aiRect.bottom || waRect.right <= aiRect.left || waRect.left >= aiRect.right) : true;
              const waInVp = waRect ? (waRect.left >= 0 && waRect.right <= vw + 1 && waRect.top >= 0 && waRect.bottom <= vh + 1) : false;
              const aiInVp = aiRect ? (aiRect.left >= 0 && aiRect.right <= vw + 1 && aiRect.top >= 0 && aiRect.bottom <= vh + 1) : false;
              const hScroll = sw > vw + 1;

              return {
                vw, vh, sw,
                hasWa: !!wa,
                hasAi: !!toggle,
                overlap,
                waInVp,
                aiInVp,
                hScroll,
                verticalGap: (waRect && aiRect) ? Math.round(waRect.top - aiRect.bottom) : null,
                waRightOffset: waRect ? Math.round(vw - waRect.right) : null,
                aiRightOffset: aiRect ? Math.round(vw - aiRect.right) : null
              };
            })()
          `,
          returnByValue: true
        });

        const res = evalRes.result.value;
        const passed = res.hasWa && res.hasAi && !res.overlap && res.waInVp && res.aiInVp && !res.hScroll;
        console.log(`  [${vp.name}] Pass: ${passed} | WA: inVp=${res.waInVp} rightOff=${res.waRightOffset}px | AI: inVp=${res.aiInVp} rightOff=${res.aiRightOffset}px | Gap=${res.verticalGap}px | Overlap=${res.overlap} | HScroll=${res.hScroll}`);
        results.push({ article: art, viewport: vp.name, passed, ...res });
      }
    }

    ws.close();
  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    browser.kill();
  }

  const allPassed = results.every(r => r.passed);
  console.log(`\n================ SUMMARY ================`);
  console.log(`Total tests run: ${results.length}`);
  console.log(`Total passed: ${results.filter(r => r.passed).length}`);
  console.log(`All passed: ${allPassed}`);
}

runTestSuite();
