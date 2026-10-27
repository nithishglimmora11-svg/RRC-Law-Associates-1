const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const samplePages = [
  'index.html',
  'oci-card-assistance.html',
  'oci-legal-guides.html',
  'core-practice-areas.html',
  'nri-services.html',
  'oci-card-eligibility-legal-status.html',
  'nri-oci-property-due-diligence-india.html',
  'lawfirm-blog.html',
  'blog-cross-border-child-custody-india.html',
  'blog-deepfake-legal-remedies.html',
  'partners.html',
  'booking.html'
];

const viewports = [
  { name: '320x640', width: 320, height: 640, isMobile: true, capture: true },
  { name: '360x800', width: 360, height: 800, isMobile: true, capture: false },
  { name: '375x812', width: 375, height: 812, isMobile: true, capture: false },
  { name: '390x844', width: 390, height: 844, isMobile: true, capture: true },
  { name: '400x642', width: 400, height: 642, isMobile: true, capture: false },
  { name: '430x932', width: 430, height: 932, isMobile: true, capture: false },
  { name: '768x1024', width: 768, height: 1024, isMobile: false, capture: true },
  { name: '1024x768', width: 1024, height: 768, isMobile: false, capture: false },
  { name: '1280x720', width: 1280, height: 720, isMobile: false, capture: false },
  { name: '1366x768', width: 1366, height: 768, isMobile: false, capture: false },
  { name: '1440x900', width: 1440, height: 900, isMobile: false, capture: true },
  { name: '1920x1080', width: 1920, height: 1080, isMobile: false, capture: false }
];

const screenshotDir = path.join(__dirname, 'baseline_screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9255',
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9255/json/new?about:blank', { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      const timer = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 8000);
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

    const pageConsoleLogs = [];
    const pageNetworkFailures = [];

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        pageConsoleLogs.push({ type: msg.params.type, text });
      }
      if (msg.method === 'Network.responseReceived') {
        const status = msg.params.response.status;
        const url = msg.params.response.url;
        if (status >= 400) {
          pageNetworkFailures.push({ status, url });
        }
      }
      if (msg.method === 'Network.loadingFailed') {
        pageNetworkFailures.push({ status: 'FAILED', url: msg.params.requestId });
      }
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    const auditResults = {};

    for (const pageName of samplePages) {
      auditResults[pageName] = {
        viewports: {},
        consoleLogs: [],
        networkFailures: [],
        navInteraction: null,
        floatingWidgets: null
      };

      const url = `http://localhost:8080/${pageName}`;
      console.log(`\n========================================`);
      console.log(`Auditing: ${pageName}`);
      console.log(`========================================`);

      for (const vp of viewports) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.isMobile
        });

        pageConsoleLogs.length = 0;
        pageNetworkFailures.length = 0;

        await send('Page.navigate', { url });
        await new Promise(r => setTimeout(r, 800));

        // Evaluate scrollWidth and check for overflowing elements
        const evalRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const docWidth = document.documentElement.offsetWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const innerWidth = window.innerWidth;
            const hasOverflow = scrollWidth > innerWidth + 1;
            
            let overflowingElements = [];
            if (hasOverflow) {
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > innerWidth + 2 && rect.width > 0 && rect.height > 0) {
                  const style = window.getComputedStyle(el);
                  if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                    overflowingElements.push({
                      tag: el.tagName,
                      id: el.id || '',
                      className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join(' ') : '',
                      right: Math.round(rect.right),
                      width: Math.round(rect.width)
                    });
                  }
                }
              }
            }

            // Floating widget visibility & positioning
            const wa = document.querySelector('.whatsapp-btn, .whatsapp-float, [class*="whatsapp"]');
            let waData = null;
            if (wa) {
              const r = wa.getBoundingClientRect();
              const s = window.getComputedStyle(wa);
              waData = {
                visible: s.display !== 'none' && s.visibility !== 'hidden',
                right: Math.round(r.right),
                bottom: Math.round(r.bottom),
                width: Math.round(r.width),
                inViewport: r.right <= innerWidth && r.left >= 0 && r.bottom <= window.innerHeight
              };
            }

            const ai = document.querySelector('[data-rrc-ai-chat-root], .chat-widget, #rrc-ai-chat-root');
            let aiData = null;
            if (ai) {
              const r = ai.getBoundingClientRect();
              aiData = {
                present: true,
                width: Math.round(r.width),
                height: Math.round(r.height)
              };
            }

            return {
              scrollWidth,
              innerWidth,
              hasOverflow,
              overflowAmount: Math.max(0, scrollWidth - innerWidth),
              overflowingElements: overflowingElements.slice(0, 5),
              waData,
              aiData
            };
          })()`,
          returnByValue: true
        });

        const data = evalRes.result ? evalRes.result.value : { hasOverflow: false, error: 'eval failed' };
        auditResults[pageName].viewports[vp.name] = data;

        // Record any logs / network failures from first viewport
        if (vp.name === '390x844') {
          auditResults[pageName].consoleLogs = [...pageConsoleLogs];
          auditResults[pageName].networkFailures = [...pageNetworkFailures];
          auditResults[pageName].floatingWidgets = { wa: data.waData, ai: data.aiData };
        }

        const statusStr = data.hasOverflow ? `FAIL (Overflow +${data.overflowAmount}px)` : 'PASS';
        console.log(`  [${vp.name}] ${statusStr}`);
        if (data.hasOverflow) {
          console.log(`     Overflowing elements:`, JSON.stringify(data.overflowingElements));
        }

        // Capture screenshot
        if (vp.capture && ['index.html', 'oci-card-assistance.html', 'oci-legal-guides.html', 'oci-card-eligibility-legal-status.html', 'blog-deepfake-legal-remedies.html'].includes(pageName)) {
          const shotName = `baseline_${pageName.replace('.html', '')}_${vp.name}.png`;
          const shotPath = path.join(screenshotDir, shotName);
          try {
            const shotData = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(shotPath, Buffer.from(shotData.data, 'base64'));
          } catch (e) {
            console.warn(`Could not save shot ${shotName}:`, e.message);
          }
        }
      }

      // Test mobile navigation interaction on 390x844
      try {
        await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
        await send('Page.navigate', { url });
        await new Promise(r => setTimeout(r, 600));

        const navTest = await send('Runtime.evaluate', {
          expression: `(() => {
            const toggle = document.querySelector('#menuToggle, .navbar-toggler');
            const menu = document.querySelector('#mobileMenu, .mobile-menu');
            if (!toggle || !menu) return { supported: false, reason: 'No toggle/menu' };

            const initialOpen = menu.classList.contains('open') || menu.classList.contains('active');
            toggle.click();
            const afterOpen = menu.classList.contains('open') || menu.classList.contains('active');
            const scrollWidthOpen = document.documentElement.scrollWidth;
            const innerWidthOpen = window.innerWidth;
            const causesOverflow = scrollWidthOpen > innerWidthOpen;

            const closeBtn = document.querySelector('#closeMenu, .close-menu');
            let afterClose = null;
            if (closeBtn) {
              closeBtn.click();
              afterClose = !(menu.classList.contains('open') || menu.classList.contains('active'));
            }

            return {
              supported: true,
              toggleExists: !!toggle,
              menuExists: !!menu,
              opensOnClick: afterOpen,
              closesOnCloseBtn: afterClose,
              causesOverflowOnOpen: causesOverflow
            };
          })()`,
          returnByValue: true
        });
        auditResults[pageName].navInteraction = navTest.result.value;
        console.log(`  [Nav Test 390px]`, JSON.stringify(navTest.result.value));
      } catch (e) {
        console.warn(`Nav test failed on ${pageName}:`, e.message);
      }
    }

    fs.writeFileSync(
      path.join(__dirname, 'baseline_audit_results.json'),
      JSON.stringify(auditResults, null, 2)
    );
    console.log(`\n========================================`);
    console.log(`Full baseline audit completed successfully!`);
    console.log(`Results saved to scratch/baseline_audit_results.json`);
    console.log(`========================================`);

    ws.close();
  } catch (err) {
    console.error('Fatal audit error:', err);
  } finally {
    browser.kill();
  }
}

runAudit();
