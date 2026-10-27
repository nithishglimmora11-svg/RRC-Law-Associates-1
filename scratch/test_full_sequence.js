const { spawn } = require('child_process');

async function testFullSequence() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9298']);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9298/json/new?about:blank', { method: 'PUT' });
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

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value).join(' ');
        if (text.includes('[HeroVideo] Triggering transition') || text.includes('Transition Complete')) {
          console.log('BROWSER:', text);
        }
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 1500));

    // Monitor sequence progression through 8 transitions
    const transitions = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const vA = document.getElementById('ociHeroVideoA');
        const vB = document.getElementById('ociHeroVideoB');
        const log = [];

        function getCurrentPlaying() {
          const isA = vA.classList.contains('is-active');
          const active = isA ? vA : vB;
          const inactive = isA ? vB : vA;
          return {
            activeId: active.id,
            activeClip: active.src.split('/').pop(),
            activeMuted: active.muted,
            activeVolume: active.volume,
            inactiveId: inactive.id,
            inactiveClip: inactive.src.split('/').pop(),
            inactiveMuted: inactive.muted,
            inactiveVolume: inactive.volume
          };
        }

        log.push({ event: 'Initial Playback', ...getCurrentPlaying() });

        // Accelerate playback to 8x to cycle through all 7 clips in ~8 seconds total
        const interval = setInterval(() => {
          if (vA && !vA.paused) vA.playbackRate = 8.0;
          if (vB && !vB.paused) vB.playbackRate = 8.0;
        }, 100);

        let previousClip = getCurrentPlaying().activeClip;
        let previousActiveId = getCurrentPlaying().activeId;
        let transitionCount = 0;

        while (transitionCount < 7) {
          await new Promise(r => setTimeout(r, 200));
          const current = getCurrentPlaying();
          if (current.activeId !== previousActiveId) {
            transitionCount++;
            log.push({
              event: 'Step ' + transitionCount + ' (to ' + current.activeClip + ')',
              ...current
            });
            previousActiveId = current.activeId;
            previousClip = current.activeClip;
          }
        }

        clearInterval(interval);
        return log;
      })()`,
      returnByValue: true
    });

    console.log('\n================ SEQUENCE VERIFICATION LOG ================');
    transitions.result.value.forEach((entry, idx) => {
      console.log(`[${idx}] ${entry.event}: Active=${entry.activeId} playing "${entry.activeClip}" (muted: ${entry.activeMuted}, volume: ${entry.activeVolume}) | Inactive=${entry.inactiveId} preloaded "${entry.inactiveClip}" (muted: ${entry.inactiveMuted}, volume: ${entry.inactiveVolume})`);
    });
    console.log('===========================================================\n');

  } catch (e) {
    console.error(e);
  } finally {
    browser.kill();
    process.exit(0);
  }
}

testFullSequence();
