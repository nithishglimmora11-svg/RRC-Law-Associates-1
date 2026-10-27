const { spawn } = require('child_process');

async function debugTransition() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9296']);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9296/json/new?about:blank', { method: 'PUT' });
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
    await new Promise(r => setTimeout(r, 2000));

    const check1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const vA = document.getElementById('ociHeroVideoA');
        const vB = document.getElementById('ociHeroVideoB');
        return {
          vA_duration: vA.duration,
          vA_currentTime: vA.currentTime,
          vA_paused: vA.paused,
          vA_readyState: vA.readyState,
          vB_duration: vB.duration,
          vB_currentTime: vB.currentTime,
          vB_paused: vB.paused,
          vB_readyState: vB.readyState
        };
      })()`,
      returnByValue: true
    });
    console.log('Diagnostic 1:', check1.result.value);

    // Let's trigger a transition directly via dispatchEvent or calling timeupdate
    const check2 = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const vA = document.getElementById('ociHeroVideoA');
        const vB = document.getElementById('ociHeroVideoB');

        console.log('Seeking vA to duration - 0.5s...');
        vA.currentTime = vA.duration - 0.5;
        // dispatch timeupdate event explicitly
        vA.dispatchEvent(new Event('timeupdate'));

        await new Promise(r => setTimeout(r, 1200));

        return {
          vA_src: vA.src,
          vA_active: vA.classList.contains('is-active'),
          vB_src: vB.src,
          vB_active: vB.classList.contains('is-active')
        };
      })()`,
      returnByValue: true
    });
    console.log('Diagnostic 2 (after seeking and timeupdate):', check2.result.value);

  } catch (e) {
    console.error(e);
  } finally {
    browser.kill();
    process.exit(0);
  }
}

debugTransition();
