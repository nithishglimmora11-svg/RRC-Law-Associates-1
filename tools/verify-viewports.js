const { spawn } = require('child_process');
const fs = require('fs');

const PORT = 5502;
const TARGET_URL = `http://127.0.0.1:${PORT}/practice-areas/customs-law/`;

function findBrowserBinary() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function testViewports() {
  const browserPath = findBrowserBinary();
  if (!browserPath) {
    console.log('[SKIP] No browser found');
    return true;
  }

  const debugPort = 9297;
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

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: TARGET_URL });
    await new Promise(r => setTimeout(r, 1500));

    const viewports = [
      { width: 1920, height: 1080, name: '1920px (Desktop Full HD)' },
      { width: 1440, height: 900, name: '1440px (Desktop Large)' },
      { width: 1366, height: 768, name: '1366px (Desktop Standard Laptop)' },
      { width: 1024, height: 768, name: '1024px (Tablet Landscape)' },
      { width: 768, height: 1024, name: '768px (Tablet Portrait)' },
      { width: 430, height: 932, name: '430px (iPhone Pro Max)' },
      { width: 375, height: 667, name: '375px (Mobile Standard)' }
    ];

    console.log('====================================================');
    console.log('  Customs Law Hero Section - Multi-Viewport Check   ');
    console.log('====================================================\n');

    let allPassed = true;

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768
      });
      await new Promise(r => setTimeout(r, 500));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          const hasOverflow = scrollW > innerW;

          // 1. Visible HTML attributes in text
          const bodyText = document.body.innerText;
          const hasVisibleAttrText = bodyText.includes('alt="') || bodyText.includes('loading="') || bodyText.includes('width="1200"');

          // 2. Duplicate subtitle count
          const subtitleCount = document.querySelectorAll('.customs-hero-subtitle').length;

          // 3. CTA button text counts
          const exploreBtn = document.querySelector('.btn-customs-explore');
          const exploreText = exploreBtn ? exploreBtn.innerText.replace(/\\s+/g, ' ').trim() : '';
          const articlesBtn = document.querySelector('.btn-customs-articles');
          const articlesText = articlesBtn ? articlesBtn.innerText.replace(/\\s+/g, ' ').trim() : '';

          // 4. Hero image checks
          const heroImg = document.querySelector('.customs-hero-image-card img');
          const imgNaturalW = heroImg ? heroImg.naturalWidth : 0;
          const imgNaturalH = heroImg ? heroImg.naturalHeight : 0;
          const imgClientH = heroImg ? heroImg.getBoundingClientRect().height : 0;
          const imgLoaded = heroImg ? heroImg.complete && heroImg.naturalWidth > 0 : false;

          // 5. Overlap between text and image
          const heroTextCol = document.querySelector('.customs-hero-text-col');
          const heroImgCol = document.querySelector('.customs-hero-image-col');
          let textImgOverlap = false;
          if (heroTextCol && heroImgCol && window.innerWidth >= 992) {
            const tr = heroTextCol.getBoundingClientRect();
            const ir = heroImgCol.getBoundingClientRect();
            textImgOverlap = !(tr.right <= ir.left || tr.left >= ir.right || tr.bottom <= ir.top || tr.top >= ir.bottom);
          }

          // 6. Heading visibility and dimensions
          const heroTitle = document.querySelector('.customs-hero-title');
          const titleRect = heroTitle ? heroTitle.getBoundingClientRect() : null;
          const titleVisible = titleRect && titleRect.height > 0 && titleRect.width > 0;

          // 7. Topics count and separators
          const topics = document.querySelectorAll('.customs-hero-topics span:not(.topic-sep)').length;
          const separators = document.querySelectorAll('.customs-hero-topics .topic-sep').length;

          return {
            hasOverflow,
            scrollW,
            innerW,
            hasVisibleAttrText,
            subtitleCount,
            exploreText,
            articlesText,
            imgLoaded,
            imgNaturalW,
            imgNaturalH,
            imgClientH,
            textImgOverlap,
            titleVisible,
            topics,
            separators
          };
        })()`,
        returnByValue: true
      });

      const res = evalRes.result.value;
      const pass = !res.hasOverflow &&
                   !res.hasVisibleAttrText &&
                   res.subtitleCount === 1 &&
                   res.exploreText === 'Explore Practice Areas' &&
                   res.articlesText === 'View Priority Articles' &&
                   res.imgLoaded &&
                   !res.textImgOverlap &&
                   res.titleVisible &&
                   res.topics === 7 &&
                   res.separators === 6;

      if (!pass) allPassed = false;

      console.log(`[${pass ? 'PASS' : 'FAIL'}] ${vp.name}:`);
      console.log(`       Overflow: ${res.hasOverflow ? 'YES (' + res.scrollW + ' > ' + res.innerW + ')' : 'None (0px)'}`);
      console.log(`       Visible Attributes: ${res.hasVisibleAttrText ? 'DETECTED!' : 'None (Clean)'}`);
      console.log(`       Subtitle Count: ${res.subtitleCount} (Expected: 1)`);
      console.log(`       Explore Button: "${res.exploreText}" | Articles Button: "${res.articlesText}"`);
      console.log(`       Image: loaded=${res.imgLoaded} (${res.imgNaturalW}x${res.imgNaturalH}), renderHeight=${res.imgClientH}px, overlap=${res.textImgOverlap}`);
      console.log(`       Topics: ${res.topics} items with ${res.separators} separators\n`);
    }

    ws.close();
    browser.kill();
    return allPassed;
  } catch (err) {
    console.error('Error during viewport check:', err);
    browser.kill();
    return false;
  }
}

if (require.main === module) {
  testViewports().then(success => {
    process.exitCode = success ? 0 : 1;
  });
}
