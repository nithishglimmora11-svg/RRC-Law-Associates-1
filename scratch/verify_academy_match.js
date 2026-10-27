const { spawn } = require('child_process');
const fs = require('fs');

async function verifyHero() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9300']);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9300/json/new?about:blank', { method: 'PUT' });
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

    console.log('=== TEST 1: Desktop Viewport (1440x900) & Positioning Context ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const desktopMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('.oci-hero-section');
        const media = document.querySelector('.oci-hero-video-media');
        const w0 = document.getElementById('ociHeroWrapper0');
        const w1 = document.getElementById('ociHeroWrapper1');
        const w2 = document.getElementById('ociHeroWrapper2');
        const v0 = document.getElementById('ociHeroVideo0');
        const v1 = document.getElementById('ociHeroVideo1');
        const v2 = document.getElementById('ociHeroVideo2');
        const overlay = document.querySelector('.oci-hero-overlay');
        const content = document.querySelector('.oci-hero-content');
        const container = document.querySelector('.oci-hero-section .container');

        const heroRect = hero.getBoundingClientRect();
        const mediaRect = media.getBoundingClientRect();

        const heroStyle = window.getComputedStyle(hero);
        const mediaStyle = window.getComputedStyle(media);
        const overlayStyle = window.getComputedStyle(overlay);
        const contentStyle = window.getComputedStyle(content);
        const containerStyle = window.getComputedStyle(container);

        return {
          hero: {
            position: heroStyle.position,
            overflow: heroStyle.overflow,
            isolation: heroStyle.isolation,
            top: heroRect.top,
            height: heroRect.height,
            width: heroRect.width
          },
          media: {
            position: mediaStyle.position,
            top: mediaRect.top,
            height: mediaRect.height,
            width: mediaRect.width,
            zIndex: mediaStyle.zIndex,
            matchesHeroBox: (Math.abs(heroRect.top - mediaRect.top) < 1 && Math.abs(heroRect.height - mediaRect.height) < 1)
          },
          stackingOrder: {
            media_zIndex: mediaStyle.zIndex,
            overlay_zIndex: overlayStyle.zIndex,
            container_zIndex: containerStyle.zIndex,
            content_zIndex: contentStyle.zIndex
          },
          videos: {
            v0_src: v0.src.split('/').pop(),
            v0_muted: v0.muted,
            v0_volume: v0.volume,
            v1_src: v1.src.split('/').pop(),
            v1_muted: v1.muted,
            v1_volume: v1.volume,
            v2_src: v2.src.split('/').pop(),
            v2_muted: v2.muted,
            v2_volume: v2.volume
          },
          initialActiveWrapper: w0.classList.contains('is-active') ? 0 : (w1.classList.contains('is-active') ? 1 : 2),
          overflow: {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
          }
        };
      })()`,
      returnByValue: true
    });

    console.log('Desktop positioning analysis:', JSON.stringify(desktopMetrics.result.value, null, 2));

    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/academy_match_desktop.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved scratch/academy_match_desktop.png');

    console.log('\n=== TEST 2: Sequence & Duration Progression (Video 1 -> Video 2 -> Video 3 -> Video 1) ===');
    // We will accelerate playback rate to 8x so each 8.06s clip plays its full duration in ~1 second
    const sequenceProgression = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const wrappers = [
          document.getElementById('ociHeroWrapper0'),
          document.getElementById('ociHeroWrapper1'),
          document.getElementById('ociHeroWrapper2')
        ];
        const videos = [
          document.getElementById('ociHeroVideo0'),
          document.getElementById('ociHeroVideo1'),
          document.getElementById('ociHeroVideo2')
        ];

        const log = [];

        function getActiveIndex() {
          for (let i = 0; i < wrappers.length; i++) {
            if (wrappers[i].classList.contains('is-active')) return i;
          }
          return -1;
        }

        log.push({
          step: 'Initial (Start of Video 1)',
          activeSceneIndex: 0,
          clipPlaying: videos[0].src.split('/').pop(),
          currentTime: videos[0].currentTime,
          duration: videos[0].duration,
          muted: videos[0].muted,
          volume: videos[0].volume
        });

        // Set playback rate to 8x to let videos play their full durations
        const rateInterval = setInterval(() => {
          videos.forEach(v => {
            if (v && !v.paused) v.playbackRate = 8.0;
          });
        }, 80);

        let lastActive = 0;
        let transitionsObserved = 0;

        while (transitionsObserved < 4) {
          await new Promise(r => setTimeout(r, 150));
          const current = getActiveIndex();
          if (current !== -1 && current !== lastActive) {
            transitionsObserved++;
            log.push({
              step: 'Transition ' + transitionsObserved + ' (Advanced to Scene ' + (current + 1) + ')',
              activeSceneIndex: current,
              clipPlaying: videos[current].src.split('/').pop(),
              currentTime: videos[current].currentTime,
              duration: videos[current].duration,
              muted: videos[current].muted,
              volume: videos[current].volume
            });
            lastActive = current;
          }
        }

        clearInterval(rateInterval);
        return log;
      })()`,
      returnByValue: true
    });

    console.log('Sequence progression log:\n', JSON.stringify(sequenceProgression.result.value, null, 2));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/academy_match_transitioned.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved scratch/academy_match_transitioned.png');

    console.log('\n=== TEST 3: Mobile Viewport (390x844) ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const mobileMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('.oci-hero-section');
        const media = document.querySelector('.oci-hero-video-media');
        const heroRect = hero.getBoundingClientRect();
        const mediaRect = media.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          heroHeight: heroRect.height,
          mediaHeight: mediaRect.height,
          matchesHeroBox: (Math.abs(heroRect.top - mediaRect.top) < 1 && Math.abs(heroRect.height - mediaRect.height) < 1)
        };
      })()`,
      returnByValue: true
    });

    console.log('Mobile metrics:', JSON.stringify(mobileMetrics.result.value, null, 2));

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/academy_match_mobile.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved scratch/academy_match_mobile.png');

    console.log('\n=== TEST 4: Prefers-reduced-motion ===');
    await send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const reducedMotionMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const media = document.querySelector('.oci-hero-video-media');
        const style = window.getComputedStyle(media);
        return {
          display: style.display,
          isNone: style.display === 'none'
        };
      })()`,
      returnByValue: true
    });

    console.log('Reduced motion check:', JSON.stringify(reducedMotionMetrics.result.value, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    browser.kill();
    process.exit(0);
  }
}

verifyHero();
