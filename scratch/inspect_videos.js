const { spawn } = require('child_process');
const fs = require('fs');

async function inspectVideos() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9290']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const newTabRes = await fetch('http://127.0.0.1:9290/json/new?about:blank', { method: 'PUT' });
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

    const videoFiles = ['oci-scene-1.mp4', 'oci-scene-2.mp4', 'oci-scene-3.mp4'];
    const info = {};

    for (const v of videoFiles) {
      console.log(`Analyzing ${v}...`);
      await send('Page.navigate', { url: `http://localhost:8080/assets/videos/${v}` });
      await new Promise(r => setTimeout(r, 2000));

      const vInfo = await send('Runtime.evaluate', {
        expression: `(async () => {
          const v = document.querySelector('video');
          if (!v) return { error: 'No video element found' };

          // Wait until metadata is loaded
          if (v.readyState < 1) {
            await new Promise(res => { v.onloadedmetadata = res; });
          }

          const duration = v.duration;
          const width = v.videoWidth;
          const height = v.videoHeight;

          // Check audio
          const hasAudio = Boolean(v.mozHasAudio || Boolean(v.webkitAudioDecodedByteCount) || (v.audioTracks && v.audioTracks.length > 0));

          // Capture frames at 25%, 50%, 75%
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          async function getFrameAt(time) {
            v.currentTime = time;
            await new Promise(res => { v.onseeked = res; });
            ctx.drawImage(v, 0, 0, width, height);
            return canvas.toDataURL('image/png').split(',')[1];
          }

          const f1 = await getFrameAt(Math.min(1.0, duration * 0.2));
          const f2 = await getFrameAt(duration * 0.5);
          const f3 = await getFrameAt(Math.max(duration - 1.0, duration * 0.8));

          return {
            duration,
            width,
            height,
            hasAudio,
            f1, f2, f3
          };
        })()`,
        awaitPromise: true,
        returnByValue: true
      });

      const res = vInfo.result.value;
      if (res.error) {
        console.error(v, res.error);
        continue;
      }

      info[v] = {
        duration: res.duration,
        width: res.width,
        height: res.height,
        hasAudio: res.hasAudio
      };

      fs.writeFileSync(`scratch/${v}_f1.png`, Buffer.from(res.f1, 'base64'));
      fs.writeFileSync(`scratch/${v}_f2.png`, Buffer.from(res.f2, 'base64'));
      fs.writeFileSync(`scratch/${v}_f3.png`, Buffer.from(res.f3, 'base64'));
      console.log(`Saved frames for ${v}`);
    }

    console.log('Video Info:', JSON.stringify(info, null, 2));

    await send('Browser.close');
  } catch(e) {
    console.error('Error during video inspection:', e);
  } finally {
    browser.kill();
  }
}

inspectVideos();
