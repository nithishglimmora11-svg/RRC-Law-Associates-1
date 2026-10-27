const { spawn } = require('child_process');

const ociPages = [
  'oci-card-application-documents.html',
  'oci-card-eligibility-legal-status.html',
  'oci-vs-nri-vs-indian-citizen.html',
  'oci-card-indian-ancestry-assistance.html',
  'oci-foreign-spouse-eligibility.html',
  'oci-for-children-born-abroad.html',
  'oci-card-benefits-restrictions-india.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'nri-oci-property-due-diligence-india.html',
  'nri-oci-property-tax-india.html',
  'oci-card-renewal-passport-update.html',
  'oci-card-cancellation-grounds-remedies.html',
  'oci-card-cancellation-section-7d-legal-remedies.html',
  'oci-legal-guides.html',
  'lawfirm-blog.html',
  'nri-services.html'
];

const viewports = [
  { name: 'Desktop Widescreen', width: 1440, height: 900, mobile: false },
  { name: 'Desktop Standard', width: 1280, height: 800, mobile: false },
  { name: 'Tablet Portrait', width: 768, height: 1024, mobile: true },
  { name: 'Mobile Large', width: 390, height: 844, mobile: true },
  { name: 'Mobile Compact', width: 360, height: 780, mobile: true }
];

async function runVerification() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9265']);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9265/json/new?about:blank', { method: 'PUT' });
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

    const summaryResults = [];

    for (const page of ociPages) {
      let pagePass = true;
      const issues = [];

      for (const vp of viewports) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile
        });

        await send('Page.navigate', { url: `http://localhost:8080/${page}` });
        await new Promise(r => setTimeout(r, 700));

        const testRes = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const topbar = document.querySelector('.rrc-topbar');
              const header = document.querySelector('.header');
              const logo = document.querySelector('.header .logo-img');
              const csT = topbar ? window.getComputedStyle(topbar) : null;
              const csH = header ? window.getComputedStyle(header) : null;
              const csL = logo ? window.getComputedStyle(logo) : null;

              // Topbar color check
              const topbarBg = csT ? csT.backgroundColor : 'missing';
              const topbarBorder = csT ? csT.borderBottom : 'missing';
              const isTopbarOk = topbarBg === 'rgb(8, 8, 8)' && topbarBorder.includes('rgba(201, 162, 39, 0.2)');

              // Header color check
              const headerBg = csH ? csH.backgroundColor : 'missing';
              const isHeaderOk = headerBg === 'rgb(0, 0, 0)';

              // Overflow check
              const hasOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

              // Check NRI Dropdown items in desktop or mobile
              let nriItemsCount = 0;
              const nriDesktopDropdown = document.querySelectorAll('.header .dropdown-menu a[href*="nri-"], .header .dropdown-menu a[href*="oci-card-assistance"]');
              const nriMobileDropdown = document.querySelectorAll('.mobile-menu a[href*="nri-"], .mobile-menu a[href*="oci-card-assistance"]');
              nriItemsCount = Math.max(nriDesktopDropdown.length, nriMobileDropdown.length);

              // Logo visibility
              const logoVisible = logo && parseFloat(csL.height) > 0;

              return {
                topbarBg,
                topbarBorder,
                isTopbarOk,
                headerBg,
                isHeaderOk,
                hasOverflow,
                nriItemsCount,
                logoVisible,
                logoHeight: csL ? csL.height : 0
              };
            })()
          `,
          returnByValue: true
        });

        const r = testRes.result.value;
        if (!r.isTopbarOk && page !== 'index.html') {
          pagePass = false;
          issues.push(`${vp.name}: topbarBg=${r.topbarBg}, border=${r.topbarBorder}`);
        }
        if (!r.isHeaderOk) {
          pagePass = false;
          issues.push(`${vp.name}: headerBg=${r.headerBg}`);
        }
        if (r.hasOverflow) {
          pagePass = false;
          issues.push(`${vp.name}: horizontal overflow detected`);
        }
        if (!r.logoVisible) {
          pagePass = false;
          issues.push(`${vp.name}: logo invisible or 0px`);
        }
      }

      // Check mobile toggle on 390x844
      await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 600));

      const menuTest = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const toggle = document.querySelector('#menuToggle');
            const menu = document.querySelector('#mobileMenu');
            const closeBtn = document.querySelector('#closeMenu');
            if (!toggle || !menu) return { toggleFound: false };

            toggle.click();
            const isOpenAfterClick = menu.classList.contains('open') || menu.classList.contains('active');
            if (closeBtn) closeBtn.click();
            const isClosedAfterClose = !menu.classList.contains('open') && !menu.classList.contains('active');

            return {
              toggleFound: true,
              drawerOpens: isOpenAfterClick,
              drawerCloses: isClosedAfterClose
            };
          })()
        `,
        returnByValue: true
      });

      const m = menuTest.result.value;
      if (!m.toggleFound || !m.drawerOpens || !m.drawerCloses) {
        pagePass = false;
        issues.push(`Mobile menu failure: ${JSON.stringify(m)}`);
      }

      summaryResults.push({
        page,
        status: pagePass ? 'PASS' : 'FAIL',
        issues
      });
      console.log(`Page: ${page} -> ${pagePass ? 'PASS (100% compliant)' : 'FAIL: ' + issues.join(', ')}`);
    }

    console.log('\n=== FINAL SUMMARY RESULTS ===');
    console.table(summaryResults);

    await send('Browser.close');
  } catch(e) {
    console.error('Error during verification:', e);
  } finally {
    browser.kill();
  }
}

runVerification();
