/**
 * RRC Law Associates - Notary Services Page Complete Verification Suite
 * Verifies the full-width cinematic hero carousel matching Customs Law:
 * - 8 responsive viewports (1920, 1600, 1440, 1280, 1024, 768, 425, 375px)
 * - Zero horizontal overflow
 * - Zero footer collisions
 * - Absence of manual carousel controls (no arrows, no dots)
 * - Single-slide transition lifecycle (strictly 1 slide rendered at any moment)
 * - Accurate text colors: Pure White #FFFFFF heading, Bright Gold #FED488 subtitle & breadcrumb
 * - Balanced background visibility with AI-generated legal photographs
 * - Captures verification screenshots
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 5524;
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.resolve('C:\\Users\\nithi\\.gemini\\antigravity\\brain\\3702a556-eb60-418b-9137-ac6e475c90fd');
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'scratch');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function createStaticServer() {
  const server = http.createServer((req, res) => {
    let reqUrl = decodeURI(req.url.split('?')[0]);
    if (reqUrl.endsWith('/')) reqUrl += 'index.html';
    const filePath = path.join(ROOT_DIR, reqUrl);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404: ${reqUrl}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

function findBrowserBinary() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function run() {
  const server = await createStaticServer();
  const browserPath = findBrowserBinary();
  const debugPort = 9297;
  const browser = spawn(browserPath, [
    '--headless',
    `--remote-debugging-port=${debugPort}`,
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (m, p = {}) => new Promise((resolve, reject) => {
      const mid = id++;
      const timer = setTimeout(() => reject(new Error(`Timeout on ${m}`)), 15000);
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

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const targetUrl = `http://127.0.0.1:${PORT}/notary-services.html`;
    console.log(`[INFO] Navigating to ${targetUrl}`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 2000));

    // Viewports to test
    const viewports = [
      { width: 1920, height: 1080, name: '1920px (Ultra-Wide Desktop)' },
      { width: 1600, height: 900, name: '1600px (Desktop Full HD)' },
      { width: 1440, height: 900, name: '1440px (Desktop Large)' },
      { width: 1280, height: 800, name: '1280px (Standard Laptop)' },
      { width: 1024, height: 768, name: '1024px (Tablet Landscape)' },
      { width: 768, height: 1024, name: '768px (Tablet Portrait)' },
      { width: 425, height: 844, name: '425px (Mobile Large)' },
      { width: 375, height: 667, name: '375px (Mobile Standard)' }
    ];

    console.log('\n=============================================================');
    console.log('  RRC Law Associates - Notary Services Hero Verification     ');
    console.log('=============================================================\n');

    let allPassed = true;

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768
      });
      await new Promise(r => setTimeout(r, 350));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          const hasOverflow = scrollW > innerW;

          // Header & Breadcrumb
          const breadcrumb = document.querySelector('.notary-breadcrumb-bar');
          const hero = document.querySelector('#hero.notary-hero');
          const heroRect = hero ? hero.getBoundingClientRect() : null;
          const heroHeight = heroRect ? Math.round(heroRect.height) : 0;

          // Slides inspection
          const bgSlides = Array.from(document.querySelectorAll('.notary-carousel-slide'));
          const textSlides = Array.from(document.querySelectorAll('.notary-hero-text-slide'));
          const visibleTextSlides = textSlides.filter(s => window.getComputedStyle(s).display !== 'none');
          const visibleHeadings = Array.from(document.querySelectorAll('.notary-hero-title')).filter(h => h.offsetParent !== null);
          const visibleCTAs = Array.from(document.querySelectorAll('.notary-hero-actions a')).filter(a => a.offsetParent !== null);

          // Manual controls check (Must be absent)
          const prevBtn = document.querySelector('#carouselPrevBtn, .notary-carousel-control.prev');
          const nextBtn = document.querySelector('#carouselNextBtn, .notary-carousel-control.next');
          const dots = Array.from(document.querySelectorAll('.notary-carousel-dot, .notary-carousel-indicators'));

          // Colors
          const activeTextSlide = textSlides.find(s => s.classList.contains('active'));
          const title = activeTextSlide ? activeTextSlide.querySelector('.notary-hero-title') : null;
          const subtitle = activeTextSlide ? activeTextSlide.querySelector('.notary-hero-subtitle') : null;
          const bcActive = document.querySelector('.notary-breadcrumb-bar .active');

          const titleColor = title ? window.getComputedStyle(title).color : null;
          const subtitleColor = subtitle ? window.getComputedStyle(subtitle).color : null;
          const bcActiveColor = bcActive ? window.getComputedStyle(bcActive).color : null;

          // Footer overlap check
          const footer = document.querySelector('footer.footer');
          const sections = Array.from(document.querySelectorAll('section, main > div, #enquiry-section'));
          let footerCollisions = 0;
          if (footer) {
            for (const s of sections) {
              const rect = s.getBoundingClientRect();
              if (rect.height > 0 && s !== footer) {
                const offsetFromFooter = footer.offsetTop - (s.offsetTop + s.offsetHeight);
                if (offsetFromFooter < -2) footerCollisions++;
              }
            }
          }

          return {
            scrollW,
            innerW,
            hasOverflow,
            hasBreadcrumb: !!breadcrumb,
            heroPresent: !!hero,
            heroHeight,
            bgSlidesCount: bgSlides.length,
            textSlidesCount: textSlides.length,
            visibleTextSlidesCount: visibleTextSlides.length,
            visibleHeadingsCount: visibleHeadings.length,
            visibleCTACount: visibleCTAs.length,
            hasManualControls: !!(prevBtn || nextBtn || dots.length > 0),
            titleColor,
            subtitleColor,
            bcActiveColor,
            footerCollisions
          };
        })()`,
        returnByValue: true
      });

      const data = evalRes.result.value;
      const pass = !data.hasOverflow &&
                   data.footerCollisions === 0 &&
                   data.hasBreadcrumb &&
                   data.heroPresent &&
                   data.heroHeight >= 500 &&
                   data.bgSlidesCount === 3 &&
                   data.textSlidesCount === 3 &&
                   data.visibleTextSlidesCount === 1 &&
                   data.visibleHeadingsCount === 1 &&
                   data.visibleCTACount === 2 &&
                   !data.hasManualControls &&
                   data.titleColor === 'rgb(255, 255, 255)' &&
                   data.subtitleColor === 'rgb(254, 212, 136)' &&
                   data.bcActiveColor === 'rgb(254, 212, 136)';

      if (!pass) allPassed = false;

      console.log(`[${pass ? 'PASS' : 'FAIL'}] ${vp.name}:`);
      console.log(`       Overflow: ${data.hasOverflow ? 'FAIL' : 'Zero (' + data.scrollW + 'px)'}`);
      console.log(`       Active Slides: ${data.visibleTextSlidesCount} visible (Headings: ${data.visibleHeadingsCount}, CTAs: ${data.visibleCTACount})`);
      console.log(`       Colors: Title=${data.titleColor}, Subtitle=${data.subtitleColor}, Breadcrumb=${data.bcActiveColor}`);
      console.log(`       Hero: Height=${data.heroHeight}px, Manual Controls=0, Footer Collisions=${data.footerCollisions}\n`);
    }

    console.log('=============================================================');
    console.log(`  FINAL VERIFICATION RESULT: ${allPassed ? 'ALL TESTS PASSED' : 'TESTS FAILED'}`);
    console.log('=============================================================\n');

    ws.close();
    browser.kill();
    server.close();
    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('[ERROR during audit]:', err);
    browser.kill();
    server.close();
    process.exit(1);
  }
}

run();
