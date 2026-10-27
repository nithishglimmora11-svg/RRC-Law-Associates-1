const { spawn } = require('child_process');
const fs = require('fs');

async function runFinalVerification() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9310']);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const tabRes = await fetch('http://127.0.0.1:9310/json/new?about:blank', { method: 'PUT' });
    const tab = await tabRes.json();
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

    const consoleMessages = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        consoleMessages.push(msg.params.args.map(a => a.value).join(' '));
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('--- TEST A: Desktop (1440x900) Dimensions, Positioning & Stacking ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const desktopAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('.oci-hero-section');
        const media = document.querySelector('.oci-hero-video-media');
        const overlay = document.querySelector('.oci-hero-overlay');
        const content = document.querySelector('.oci-hero-content');
        const btnPrimary = document.querySelector('.oci-btn-primary');
        const btnSecondary = document.querySelector('.oci-btn-secondary');
        const header = document.querySelector('.header-area') || document.querySelector('header');
        const topbar = document.querySelector('.topbar-area');
        const wa = document.querySelector('.whatsapp-float');
        const ai = document.querySelector('[data-rrc-ai-chat-root]');
        const footer = document.querySelector('footer');

        const heroRect = hero.getBoundingClientRect();
        const mediaRect = media.getBoundingClientRect();
        const heroStyle = window.getComputedStyle(hero);
        const mediaStyle = window.getComputedStyle(media);
        const overlayStyle = window.getComputedStyle(overlay);
        const contentStyle = window.getComputedStyle(content);

        return {
          heroBounds: {
            top: heroRect.top,
            height: heroRect.height,
            width: heroRect.width,
            position: heroStyle.position,
            overflow: heroStyle.overflow,
            isolation: heroStyle.isolation
          },
          mediaBounds: {
            top: mediaRect.top,
            height: mediaRect.height,
            width: mediaRect.width,
            position: mediaStyle.position,
            zIndex: mediaStyle.zIndex,
            matchesHeroBox: (Math.abs(heroRect.top - mediaRect.top) < 1 && Math.abs(heroRect.height - mediaRect.height) < 1 && Math.abs(heroRect.width - mediaRect.width) < 1)
          },
          stackingOrder: {
            media_zIndex: mediaStyle.zIndex,
            overlay_zIndex: overlayStyle.zIndex,
            content_zIndex: contentStyle.zIndex
          },
          contentVisibility: {
            heading: document.querySelector('.oci-hero-title') ? document.querySelector('.oci-hero-title').innerText.replace(/\\n/g, ' ') : null,
            eyebrow: document.querySelector('.oci-badge-eyebrow') ? document.querySelector('.oci-badge-eyebrow').innerText : null,
            btnPrimary: btnPrimary ? btnPrimary.innerText.trim() : null,
            btnPrimaryHref: btnPrimary ? btnPrimary.getAttribute('href') : null,
            btnSecondary: btnSecondary ? btnSecondary.innerText.trim() : null,
            btnSecondaryHref: btnSecondary ? btnSecondary.getAttribute('href') : null
          },
          peripheralWidgets: {
            headerExists: !!header,
            topbarExists: !!topbar,
            whatsappExists: !!wa,
            aiChatExists: !!ai,
            footerExists: !!footer
          },
          viewport: {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
          }
        };
      })()`,
      returnByValue: true
    });

    console.log('Desktop Audit Result:', JSON.stringify(desktopAudit.result.value, null, 2));

    const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/final_desktop_verified.png', Buffer.from(shotDesktop.data, 'base64'));
    console.log('Saved scratch/final_desktop_verified.png');

    console.log('\n--- TEST B: Continuous Playback Sequence (Scene 1 -> Scene 2 -> Scene 3 -> Scene 1) ---');
    const seqAudit = await send('Runtime.evaluate', {
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

        const sequenceLog = [];

        function getActive() {
          for (let i = 0; i < wrappers.length; i++) {
            if (wrappers[i].classList.contains('is-active')) return i;
          }
          return -1;
        }

        sequenceLog.push({
          step: 'Initial Scene',
          activeSceneNumber: 1,
          videoFile: videos[0].src.split('/').pop(),
          duration: videos[0].duration,
          muted: videos[0].muted,
          volume: videos[0].volume
        });

        // Speed up playback to 8x to observe natural completion of each clip
        const rateTimer = setInterval(() => {
          videos.forEach(v => {
            if (v && !v.paused) v.playbackRate = 8.0;
          });
        }, 50);

        let previous = 0;
        let transitionsCount = 0;

        while (transitionsCount < 4) {
          await new Promise(r => setTimeout(r, 120));
          const current = getActive();
          if (current !== -1 && current !== previous) {
            transitionsCount++;
            sequenceLog.push({
              step: 'Step ' + transitionsCount,
              activeSceneNumber: current + 1,
              videoFile: videos[current].src.split('/').pop(),
              duration: videos[current].duration,
              muted: videos[current].muted,
              volume: videos[current].volume
            });
            previous = current;
          }
        }

        clearInterval(rateTimer);
        return sequenceLog;
      })()`,
      returnByValue: true
    });

    console.log('Sequence Progression Log:\n', JSON.stringify(seqAudit.result.value, null, 2));

    const shotTransition = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/final_transition_verified.png', Buffer.from(shotTransition.data, 'base64'));
    console.log('Saved scratch/final_transition_verified.png');

    console.log('\n--- TEST C: Mobile Viewport (390x844) Responsiveness ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const mobileAudit = await send('Runtime.evaluate', {
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

    console.log('Mobile Audit Result:', JSON.stringify(mobileAudit.result.value, null, 2));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/final_mobile_verified.png', Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved scratch/final_mobile_verified.png');

    console.log('\n--- TEST D: Prefers-reduced-motion Fallback ---');
    await send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 2000));

    const reducedMotionAudit = await send('Runtime.evaluate', {
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

    console.log('Reduced Motion Audit Result:', JSON.stringify(reducedMotionAudit.result.value, null, 2));

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    browser.kill();
    process.exit(0);
  }
}

runFinalVerification();
