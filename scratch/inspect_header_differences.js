const { spawn } = require('child_process');
const fs = require('fs');

async function inspectHeaderStyles() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9240'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9240/json/new?about:blank', { method: 'PUT' });
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

    const testPages = [
      'nri-services.html',
      'lawfirm-blog.html',
      'oci-card-application-documents.html',
      'oci-legal-guides.html',
      'oci-card-assistance.html',
      'oci-card-eligibility-legal-status.html',
      'oci-card-renewal-passport-update.html'
    ];

    const results = {};

    for (const page of testPages) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
      });

      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 1000));

      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const topbar = document.querySelector('.rrc-topbar');
            const header = document.querySelector('.header');
            const nav = document.querySelector('.header nav');
            const logo = document.querySelector('.header .logo-img');
            const homeLink = document.querySelector('.header .nav-link-custom');
            const btnGold = document.querySelector('.header .btn-gold');

            function getStyles(el) {
              if (!el) return null;
              const cs = window.getComputedStyle(el);
              return {
                backgroundColor: cs.backgroundColor,
                color: cs.color,
                borderBottom: cs.borderBottom,
                borderBottomColor: cs.borderBottomColor,
                borderBottomWidth: cs.borderBottomWidth,
                height: cs.height,
                padding: cs.padding,
                margin: cs.margin,
                fontSize: cs.fontSize,
                fontFamily: cs.fontFamily,
                position: cs.position,
                top: cs.top,
                zIndex: cs.zIndex
              };
            }

            return {
              topbar: getStyles(topbar),
              header: getStyles(header),
              nav: getStyles(nav),
              logo: logo ? { height: window.getComputedStyle(logo).height, width: window.getComputedStyle(logo).width } : null,
              homeLink: getStyles(homeLink),
              btnGold: getStyles(btnGold)
            };
          })()
        `,
        returnByValue: true
      });

      results[page] = evalRes.value;
    }

    console.log(JSON.stringify(results, null, 2));

    await send('Browser.close').catch(() => {});
  } catch (err) {
    console.error('Error in inspect:', err);
  } finally {
    browser.kill();
  }
}

inspectHeaderStyles();
