const { spawn } = require('child_process');

async function testOne() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9250',
    '--disable-gpu',
    '--no-first-run'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9250/json/new?about:blank', { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      const timer = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 5000);
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        console.log(`[CONSOLE ${msg.params.type}]`, text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log(`[EXCEPTION]`, msg.params.exceptionDetails);
      }
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Navigating to oci-card-eligibility-legal-status.html...');
    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-eligibility-legal-status.html' });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Evaluating document...');
    const result = await send('Runtime.evaluate', {
      expression: 'document.title + " | " + document.documentElement.scrollWidth + "x" + document.documentElement.scrollHeight'
    });
    console.log('Result:', result);

    console.log('Taking screenshot at 1440x900...');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    console.log('Screenshot length:', shot.data.length);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    browser.kill();
  }
}

testOne();
