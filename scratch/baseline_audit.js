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
    '--remote-debugging-port=9244',
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9244/json/new?about:blank', { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    const consoleLogs = [];
    const networkFailures = [];

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        consoleLogs.push({ type: msg.params.type, text });
      }
      if (msg.method === 'Network.responseReceived') {
        const status = msg.params.response.status;
        const url = msg.params.response.url;
        if (status >= 400) {
          networkFailures.push({ status, url });
        }
      }
      if (msg.method === 'Network.loadingFailed') {
        networkFailures.push({ status: 'FAILED', url: msg.params.requestId });
      }
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    const auditResults = {};

    for (const pageName of samplePages) {
      auditResults[pageName] = {};
      const url = `http://localhost:8080/${pageName}`;
      console.log(`\nAuditing page: ${pageName}...`);

      for (const vp of viewports) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.isMobile
        });

        consoleLogs.length = 0;
        networkFailures.length = 0;

        await send('Page.navigate', { url });
        await new Promise(r => setTimeout(r, 1200));

        // Evaluate scrollWidth and check for overflowing elements
        const evalRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const docWidth = document.documentElement.offsetWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const innerWidth = window.innerWidth;
            const hasOverflow = scrollWidth > innerWidth + 1; // 1px threshold for subpixels
            
            let overflowingElements = [];
            if (hasOverflow) {
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > innerWidth + 2 && rect.width > 0 && rect.height > 0) {
                  // Ignore elements that are hidden or offscreen intentional fixed/absolute drawers if hidden
                  const style = window.getComputedStyle(el);
                  if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                    overflowingElements.push({
                      tag: el.tagName,
                      id: el.id || '',
                      className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join(' ') : '',
                      right: Math.round(rect.right),
                      width: Math.round(rect.width),
                      scrollWidth: el.scrollWidth,
                      overflowX: style.overflowX
                    });
                  }
                }
              }
            }
            
            // Header & nav metrics
            const navToggler = document.querySelector('.navbar-toggler, .mobile-toggle, .navbar-toggle');
            const navTogglerVisible = navToggler ? (window.getComputedStyle(navToggler).display !== 'none') : false;
            const desktopNav = document.querySelector('.navbar-collapse, .desktop-nav');
            const desktopNavVisible = desktopNav ? (window.getComputedStyle(desktopNav).display !== 'none') : false;

            // OCI hero metrics if present
            const ociHero = document.querySelector('.oci-hero-section');
            let ociHeroMetrics = null;
            if (ociHero) {
              const heroRect = ociHero.getBoundingClientRect();
              const videoMedia = document.querySelector('.oci-hero-video-media');
              const mediaRect = videoMedia ? videoMedia.getBoundingClientRect() : null;
              const h1 = ociHero.querySelector('h1');
              const h1Rect = h1 ? h1.getBoundingClientRect() : null;
              ociHeroMetrics = {
                heroHeight: Math.round(heroRect.height),
                mediaHeight: mediaRect ? Math.round(mediaRect.height) : 0,
                h1Top: h1Rect ? Math.round(h1Rect.top) : 0
              };
            }

            return {
              docWidth,
              scrollWidth,
              innerWidth,
              hasOverflow,
              overflowAmount: Math.max(0, scrollWidth - innerWidth),
              overflowingElements: overflowingElements.slice(0, 8),
              navTogglerVisible,
              desktopNavVisible,
              ociHeroMetrics
            };
          })()`,
          returnByValue: true
        });

        const data = evalRes.result.value;
        data.consoleLogs = [...consoleLogs];
        data.networkFailures = [...networkFailures];

        auditResults[pageName][vp.name] = data;

        const statusStr = data.hasOverflow ? `FAIL (Overflow +${data.overflowAmount}px)` : 'PASS';
        console.log(`  [${vp.name}] ${statusStr}`);
        if (data.hasOverflow) {
          console.log(`     Elements:`, JSON.stringify(data.overflowingElements));
        }

        // Capture baseline screenshot for key viewports
        if (vp.capture && ['index.html', 'oci-card-assistance.html', 'oci-legal-guides.html', 'oci-card-eligibility-legal-status.html'].includes(pageName)) {
          const shotName = `baseline_${pageName.replace('.html', '')}_${vp.name}.png`;
          const shotPath = path.join(screenshotDir, shotName);
          const shotData = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(shotPath, Buffer.from(shotData.data, 'base64'));
          // console.log(`     Saved baseline screenshot: ${shotName}`);
        }
      }
    }

    fs.writeFileSync(
      path.join(__dirname, 'baseline_audit_results.json'),
      JSON.stringify(auditResults, null, 2)
    );
    console.log(`\nAudit finished! Results written to scratch/baseline_audit_results.json`);

    ws.close();
  } catch (err) {
    console.error('Error during audit:', err);
  } finally {
    browser.kill();
  }
}

runAudit();
