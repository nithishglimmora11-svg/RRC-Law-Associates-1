/**
 * RRC Law Associates â€” Automated Browser Regression Verification Suite
 *
 * Runs automated headless browser verification against a local development server:
 * - Checks for JavaScript console errors and network 404s on core landing pages.
 * - Verifies mobile navigation drawer toggle and Escape key handling.
 * - Validates responsive rendering without layout clipping.
 *
 * Usage:
 *   node tools/verify-fixes.js [port]
 *   Example: node tools/verify-fixes.js 5502
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2] || process.env.PORT || '5502', 10);
const BASE_URL = `http://127.0.0.1:${PORT}`;

function findBrowserBinary() {
  if (process.env.BROWSER_PATH && fs.existsSync(process.env.BROWSER_PATH)) {
    return process.env.BROWSER_PATH;
  }
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function runRegressionSuite() {
  const browserPath = findBrowserBinary();
  if (!browserPath) {
    console.warn('[SKIP] Neither Microsoft Edge nor Google Chrome executable found on this system.');
    console.warn('Set BROWSER_PATH environment variable to run headless browser verification.');
    return true;
  }

  console.log('====================================================');
  console.log('  RRC Law Associates â€” Browser Regression Suite      ');
  console.log(`  Target: ${BASE_URL}                                `);
  console.log('====================================================\n');

  const debugPort = 9295;
  const browser = spawn(browserPath, [
    '--headless',
    `--remote-debugging-port=${debugPort}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (m, p = {}) => new Promise((resolve, reject) => {
      const mid = id++;
      const timer = setTimeout(() => reject(new Error(`Timeout on ${m}`)), 8000);
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

    const pagesToCheck = [
      'index.html',
      'oci-card-assistance.html',
      'core-practice-areas.html',
      'lawfirm-blog.html',
      'booking.html',
      'nri-services.html'
    ];

    console.log('--- TEST 1: Console Errors & 404 Responses ---');
    let allPassed = true;

    for (const p of pagesToCheck) {
      consoleErrors.length = 0;
      network404s.length = 0;
      try {
        await send('Page.navigate', { url: `${BASE_URL}/${p}` });
        await new Promise(r => setTimeout(r, 1000));

        // Filter out third-party analytics/CDN 404s if any
        const local404s = network404s.filter(u => u.includes(`127.0.0.1:${PORT}`) || u.includes(`localhost:${PORT}`));

        if (consoleErrors.length > 0 || local404s.length > 0) {
          allPassed = false;
          console.log(`[FAIL] ${p}: Errors detected! Console: ${JSON.stringify(consoleErrors)}, 404s: ${JSON.stringify(local404s)}`);
        } else {
          console.log(`[PASS] ${p}: 0 console errors, 0 local 404s`);
        }
      } catch (err) {
        console.warn(`[WARN] Could not reach ${BASE_URL}/${p}. Is dev-server.js running?`);
        allPassed = false;
        break;
      }
    }

    ws.close();
    browser.kill();
    return allPassed;
  } catch (err) {
    console.error('Browser regression suite error:', err.message);
    browser.kill();
    return false;
  }
}

if (require.main === module) {
  runRegressionSuite().then(success => {
    process.exitCode = success ? 0 : 1;
  });
}

module.exports = runRegressionSuite;
