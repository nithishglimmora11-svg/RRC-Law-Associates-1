const { spawn } = require('child_process');
const http = require('http');

// Simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <base href="/">
      <title>Base Test</title>
    </head>
    <body>
      <a id="testlink" href="#section2">Go to section 2</a>
      <div style="height: 1000px;">Spacing</div>
      <h2 id="section2">Section 2</h2>
    </body>
    </html>
  `);
});

server.listen(8099, async () => {
  console.log('Test server listening on 8099');
  
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9251',
    '--user-data-dir=C:\\Users\\nithi\\RRC-Law-Associates-1\\scratch\\edge-temp-profile4'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9251/json/new?http://localhost:8099/oci-card-application-documents/', { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res);
      ws.addEventListener('error', rej);
    });

    let id = 1;
    const send = (method, params = {}) => new Promise((res) => {
      const msgId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          res(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await new Promise(r => setTimeout(r, 1000));

    // Get the href attribute vs the resolved href property
    const evalRes = await send('Runtime.evaluate', {
      expression: 'document.getElementById("testlink").href'
    });
    console.log('Resolved link href in browser with <base href="/">:', evalRes.result.value);

    // Click the link
    await send('Runtime.evaluate', {
      expression: 'document.getElementById("testlink").click()'
    });
    await new Promise(r => setTimeout(r, 500));

    const urlAfterClick = await send('Runtime.evaluate', {
      expression: 'window.location.href'
    });
    console.log('window.location.href after clicking #section2 link:', urlAfterClick.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    browser.kill();
    server.close();
  }
});
