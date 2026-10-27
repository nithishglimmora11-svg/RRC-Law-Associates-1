const { spawn } = require('child_process');
const fs = require('fs');

async function testHeroVideo() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9295']);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9295/json/new?about:blank', { method: 'PUT' });
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

    const consoleLogs = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push({ type: msg.params.type, text: msg.params.args.map(a => a.value).join(' ') });
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('--- Test 1: Desktop Viewport (1440x900) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2500));

    // Inspect initial DOM, video elements, muting, and hero content
    const test1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const vA = document.getElementById('ociHeroVideoA');
        const vB = document.getElementById('ociHeroVideoB');
        const vBg = document.querySelector('.oci-hero-video-bg');
        const hTitle = document.querySelector('.oci-hero-title');
        const hSub = document.querySelector('.oci-hero-subtitle');
        const btnPrimary = document.querySelector('.oci-btn-primary');
        const btnSec = document.querySelector('.oci-btn-secondary');

        return {
          vA_exists: !!vA,
          vB_exists: !!vB,
          vBg_exists: !!vBg,
          vA_src: vA ? vA.src : null,
          vB_src: vB ? vB.src : null,
          vA_muted: vA ? vA.muted : null,
          vA_volume: vA ? vA.volume : null,
          vB_muted: vB ? vB.muted : null,
          vB_volume: vB ? vB.volume : null,
          vA_active: vA ? vA.classList.contains('is-active') : false,
          vB_active: vB ? vB.classList.contains('is-active') : false,
          vA_paused: vA ? vA.paused : null,
          vA_currentTime: vA ? vA.currentTime : null,
          titleText: hTitle ? hTitle.innerText.trim() : null,
          subText: hSub ? hSub.innerText.trim() : null,
          btnPrimaryText: btnPrimary ? btnPrimary.innerText.trim() : null,
          btnPrimaryHref: btnPrimary ? btnPrimary.getAttribute('href') : null,
          btnSecText: btnSec ? btnSec.innerText.trim() : null,
          btnSecHref: btnSec ? btnSec.getAttribute('href') : null,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      })()`,
      returnByValue: true
    });

    console.log('Initial desktop state:', JSON.stringify(test1.result.value, null, 2));

    // Let's capture desktop screenshot
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/desktop_hero_video.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/desktop_hero_video.png');

    // Test sequence transitions over time
    console.log('--- Test 2: Verify Transitions and Playback Sequence ---');
    // We will fast-forward / monitor transitions
    const sequenceLog = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const vA = document.getElementById('ociHeroVideoA');
        const vB = document.getElementById('ociHeroVideoB');
        const history = [];

        function record(step) {
          history.push({
            step,
            vA_src: vA.src ? vA.src.split('/').pop() : '',
            vA_active: vA.classList.contains('is-active'),
            vA_muted: vA.muted,
            vA_volume: vA.volume,
            vB_src: vB.src ? vB.src.split('/').pop() : '',
            vB_active: vB.classList.contains('is-active'),
            vB_muted: vB.muted,
            vB_volume: vB.volume
          });
        }

        record('Initial');

        // Step through the 7 clips
        for (let i = 0; i < 7; i++) {
          const active = vA.classList.contains('is-active') ? vA : vB;
          // seek active to duration - 0.5s to trigger natural timeupdate transition
          if (active.duration) {
            active.currentTime = active.duration - 0.5;
          }
          await new Promise(r => setTimeout(r, 1200));
          record('After Step ' + (i + 1));
        }

        return history;
      })()`,
      returnByValue: true
    });

    console.log('Sequence history:\n', JSON.stringify(sequenceLog.result.value, null, 2));

    // Capture screenshot after several transitions
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/desktop_hero_transitioned.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/desktop_hero_transitioned.png');

    // Test mobile layout (390x844 iPhone 12)
    console.log('--- Test 3: Mobile Viewport (390x844) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const testMobile = await send('Runtime.evaluate', {
      expression: `(() => {
        const vA = document.getElementById('ociHeroVideoA');
        const vB = document.getElementById('ociHeroVideoB');
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          vA_muted: vA ? vA.muted : null,
          vB_muted: vB ? vB.muted : null,
          vA_volume: vA ? vA.volume : null,
          vB_volume: vB ? vB.volume : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile state:', JSON.stringify(testMobile.result.value, null, 2));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/mobile_hero_video.png', Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved scratch/mobile_hero_video.png');

    // Test reduced motion
    console.log('--- Test 4: Prefers-reduced-motion check ---');
    await send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const testReducedMotion = await send('Runtime.evaluate', {
      expression: `(() => {
        const vBg = document.querySelector('.oci-hero-video-bg');
        const style = window.getComputedStyle(vBg);
        return {
          display: style.display,
          isNone: style.display === 'none'
        };
      })()`,
      returnByValue: true
    });
    console.log('Reduced motion result:', JSON.stringify(testReducedMotion.result.value, null, 2));

    console.log('Console logs during tests:', consoleLogs);
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    browser.kill();
    process.exit(0);
  }
}

testHeroVideo();
