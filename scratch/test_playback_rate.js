const { spawn } = require('child_process');

async function testPlaybackRate() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9297']);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9297/json/new?about:blank', { method: 'PUT' });
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
        console.log('BROWSER CONSOLE:', msg.params.type, msg.params.args.map(a => a.value).join(' '));
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-assistance.html' });
    await new Promise(r => setTimeout(r, 1500));

    // Increase playback rate to 4x to observe natural transitions
    console.log('Setting playbackRate = 4.0 on active video...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const vA = document.getElementById('ociHeroVideoA');
        vA.playbackRate = 4.0;
      })()`
    });

    // Wait 3 seconds (equivalent to 12s of playback, clip is 8s)
    await new Promise(r => setTimeout(r, 3500));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const vA = document.getElementById('ociHeroVideoA');
        const vB = document.getElementById('ociHeroVideoB');
        return {
          vA_src: vA.src.split('/').pop(),
          vA_active: vA.classList.contains('is-active'),
          vA_paused: vA.paused,
          vB_src: vB.src.split('/').pop(),
          vB_active: vB.classList.contains('is-active'),
          vB_paused: vB.paused,
          vB_currentTime: vB.currentTime
        };
      })()`,
      returnByValue: true
    });

    console.log('State after 3.5s at 4x speed:', check.result.value);
  } catch (e) {
    console.error(e);
  } finally {
    browser.kill();
    process.exit(0);
  }
}

testPlaybackRate();
