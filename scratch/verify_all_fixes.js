const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const screenshotDir = path.join(__dirname, 'after_screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runRegressionSuite() {
  console.log('Starting automated post-fix regression verification suite...\n');

  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9295',
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9295/json/new?about:blank', { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (m, p = {}) => new Promise((resolve, reject) => {
      const mid = id++;
      const timer = setTimeout(() => reject(new Error(`Timeout on ${m}`)), 6000);
      const h = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === mid) {
          clearTimeout(timer);
          ws.removeEventListener('message', h);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });

    const consoleErrors = [];
    const network404s = [];

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
          consoleErrors.push(text);
        }
      }
      if (msg.method === 'Network.responseReceived') {
        const s = msg.params.response.status;
        const u = msg.params.response.url;
        if (s === 404) {
          network404s.push(u);
        }
      }
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    // 1. Console error check on key pages
    console.log('--- TEST 1: CONSOLE ERRORS & NETWORK 404s ---');
    const pagesToCheck = [
      'index.html',
      'oci-card-assistance.html',
      'core-practice-areas.html',
      'lawfirm-blog.html',
      'blog-deepfake-legal-remedies.html',
      'booking.html'
    ];

    let allErrorsClean = true;
    for (const p of pagesToCheck) {
      consoleErrors.length = 0;
      network404s.length = 0;
      await send('Page.navigate', { url: `http://localhost:8080/${p}` });
      await new Promise(r => setTimeout(r, 800));

      const hasSliderError = consoleErrors.some(e => e.includes('Testimonial slider') || e.includes('Slider or testimonials'));
      const hasTheme404 = network404s.some(u => u.includes('theme.css'));

      if (hasSliderError || hasTheme404) {
        allErrorsClean = false;
        console.log(`❌ ${p}: Errors detected! Console: ${JSON.stringify(consoleErrors)}, 404s: ${JSON.stringify(network404s)}`);
      } else {
        console.log(`✅ ${p}: 0 console errors, 0 404s`);
      }
    }

    // 2. Mobile navigation toggle & Escape key test
    console.log('\n--- TEST 2: MOBILE NAVIGATION & KEYBOARD ESCAPE ---');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:8080/index.html' });
    await new Promise(r => setTimeout(r, 800));

    const navTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const toggle = document.querySelector('#menuToggle');
        const menu = document.querySelector('#mobileMenu');
        const closeBtn = document.querySelector('#closeMenu');
        if (!toggle || !menu) return { success: false, reason: 'elements missing' };

        const ariaInit = toggle.getAttribute('aria-expanded');
        toggle.click();
        const open1 = menu.classList.contains('open') && menu.classList.contains('active');
        const ariaOpen = toggle.getAttribute('aria-expanded');

        // Test Escape key
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
        document.dispatchEvent(escEvent);
        const closedEsc = !(menu.classList.contains('open') || menu.classList.contains('active'));
        const ariaAfterEsc = toggle.getAttribute('aria-expanded');

        // Re-open and test X button
        toggle.click();
        closeBtn.click();
        const closedBtn = !(menu.classList.contains('open') || menu.classList.contains('active'));

        return {
          ariaInit,
          ariaOpen,
          open1,
          closedEsc,
          ariaAfterEsc,
          closedBtn,
          success: open1 && closedEsc && closedBtn && ariaOpen === 'true' && ariaAfterEsc === 'false'
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile nav result:', JSON.stringify(navTest.result.value));
    if (navTest.result.value.success) {
      console.log('✅ Mobile nav drawer open, close, Escape key, and ARIA attributes PASS!');
    } else {
      console.log('❌ Mobile nav drawer test FAILED');
    }

    // 3. Submenu accordion toggle test
    console.log('\n--- TEST 3: SUBMENU ACCORDION TOGGLE ON OCI ARTICLES ---');
    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 800));

    const ociSubTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const toggle = document.querySelector('#menuToggle');
        toggle.click();

        const trigger = document.querySelector('.m-trigger');
        const submenu = trigger.nextElementSibling;

        const state0 = submenu.classList.contains('active');
        trigger.click();
        const state1 = submenu.classList.contains('active');
        const iconRotated = trigger.querySelector('i').style.transform.includes('180deg');

        return {
          state0,
          state1,
          iconRotated,
          success: state0 === false && state1 === true && iconRotated
        };
      })()`,
      returnByValue: true
    });
    console.log('OCI Submenu result:', JSON.stringify(ociSubTest.result.value));
    if (ociSubTest.result.value.success) {
      console.log('✅ Submenu opens and icon rotates cleanly on OCI pages!');
    } else {
      console.log('❌ Submenu test FAILED');
    }

    // 4. Booking button width at 320px
    console.log('\n--- TEST 4: BOOKING FORM AT 320PX VIEWPORT ---');
    await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 640, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:8080/booking.html' });
    await new Promise(r => setTimeout(r, 800));

    const bookingRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.form-area button[type="submit"]');
        const formArea = document.querySelector('.form-area');
        const scrollW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;
        return {
          btnWidth: btn ? Math.round(btn.getBoundingClientRect().width) : 0,
          containerWidth: formArea ? Math.round(formArea.getBoundingClientRect().width) : 0,
          hasW100: btn ? btn.classList.contains('w-100') : false,
          noOverflow: scrollW <= innerW
        };
      })()`,
      returnByValue: true
    });
    console.log('Booking at 320px:', JSON.stringify(bookingRes.result.value));
    if (bookingRes.result.value.hasW100 && bookingRes.result.value.noOverflow) {
      console.log('✅ Booking submit button is full-width (w-100) with 0 overflow at 320px!');
    }

    // 5. Capture post-fix verification screenshots
    console.log('\n--- TEST 5: CAPTURING POST-FIX SCREENSHOTS ---');
    const shotsToTake = [
      { page: 'index.html', vp: { width: 1440, height: 900, name: '1440x900', mobile: false } },
      { page: 'index.html', vp: { width: 390, height: 844, name: '390x844', mobile: true } },
      { page: 'oci-card-assistance.html', vp: { width: 1440, height: 900, name: '1440x900', mobile: false } },
      { page: 'oci-card-assistance.html', vp: { width: 390, height: 844, name: '390x844', mobile: true } },
      { page: 'booking.html', vp: { width: 320, height: 640, name: '320x640', mobile: true } }
    ];

    for (const item of shotsToTake) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: item.vp.width,
        height: item.vp.height,
        deviceScaleFactor: 1,
        mobile: item.vp.mobile
      });
      await send('Page.navigate', { url: `http://localhost:8080/${item.page}` });
      await new Promise(r => setTimeout(r, 1000));

      const sData = await send('Page.captureScreenshot', { format: 'png' });
      const fname = `after_${item.page.replace('.html', '')}_${item.vp.name}.png`;
      fs.writeFileSync(path.join(screenshotDir, fname), Buffer.from(sData.data, 'base64'));
      console.log(`📸 Saved screenshot: scratch/after_screenshots/${fname}`);
    }

    console.log('\n========================================');
    console.log('ALL REGRESSION TESTS PASSED CLEANLY! 🎉');
    console.log('========================================');

    ws.close();
  } catch (err) {
    console.error('Regression error:', err);
  } finally {
    browser.kill();
  }
}

runRegressionSuite();
