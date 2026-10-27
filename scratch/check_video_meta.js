const { spawn } = require('child_process');

async function check() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9305']);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const tabRes = await fetch('http://127.0.0.1:9305/json/new?about:blank', { method: 'PUT' });
    const tab = await tabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const mId = id++;
      const h = evt => {
        const m = JSON.parse(evt.data);
        if (m.id === mId) {
          ws.removeEventListener('message', h);
          res(m.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mId, method, params }));
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');

    const files = ['oci-scene-1.mp4', 'oci-scene-2.mp4', 'oci-scene-3.mp4'];
    for (const f of files) {
      await send('Page.navigate', { url: 'http://localhost:8080/assets/videos/' + f });
      await new Promise(r => setTimeout(r, 1200));

      const info = await send('Runtime.evaluate', {
        expression: `(() => {
          const v = document.querySelector('video');
          return {
            file: '${f}',
            videoWidth: v ? v.videoWidth : null,
            videoHeight: v ? v.videoHeight : null,
            duration: v ? v.duration : null,
            hasAudio: v ? (Boolean(v.mozHasAudio) || Boolean(v.webkitAudioDecodedByteCount) || Boolean(v.audioTracks && v.audioTracks.length)) : null
          };
        })()`,
        returnByValue: true
      });
      console.log('VIDEO_META:', JSON.stringify(info.result.value));
    }
  } catch (e) {
    console.error(e);
  } finally {
    browser.kill();
    process.exit(0);
  }
}

check();
