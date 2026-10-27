const { spawn } = require('child_process');

async function testNewTab() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9224'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9224/json/new?http://localhost:8080/oci-card-eligibility-legal-status.html', { method: 'PUT' });
    const tab = await newTabRes.json();
    console.log('Created tab:', tab.id, tab.webSocketDebuggerUrl);

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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            vw: window.innerWidth,
            vh: window.innerHeight,
            bodyWidth: document.body.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            h1Text: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Result:', evalRes.result.value);

    // Take screenshot
    const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    fs.writeFileSync('scratch/mobile_390_test.png', Buffer.from(screenshotRes.data, 'base64'));
    console.log('Saved scratch/mobile_390_test.png');

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}

testNewTab();
