const { spawn } = require('child_process');

async function testPage(page) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9252'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9252/json/new?about:blank', { method: 'PUT' });
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
    await send('Page.navigate', { url: `http://localhost:8080/${page}` });
    await new Promise(r => setTimeout(r, 1500));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const topbar = document.querySelector('.rrc-topbar');
          const header = document.querySelector('.header');
          const nav = document.querySelector('.header nav');
          const logo = document.querySelector('.header .logo-img');
          const homeLink = document.querySelector('.header .nav-link-custom');
          const btnGold = document.querySelector('.header .btn-gold');
          const dropdown = document.querySelector('.header .dropdown-menu');
          const dropdownItem = document.querySelector('.header .dropdown-item');

          function getStyles(el) {
            if (!el) return null;
            const cs = window.getComputedStyle(el);
            return {
              backgroundColor: cs.backgroundColor,
              color: cs.color,
              borderBottom: cs.borderBottom,
              border: cs.border,
              boxShadow: cs.boxShadow,
              height: cs.height,
              minHeight: cs.minHeight,
              padding: cs.padding,
              fontSize: cs.fontSize,
              fontFamily: cs.fontFamily,
              top: cs.top,
              zIndex: cs.zIndex
            };
          }

          return {
            page: location.pathname,
            topbar: getStyles(topbar),
            header: getStyles(header),
            nav: getStyles(nav),
            homeLink: getStyles(homeLink),
            btnGold: getStyles(btnGold),
            dropdown: getStyles(dropdown),
            dropdownItem: getStyles(dropdownItem)
          };
        })()
      `,
      returnByValue: true
    });

    console.log(JSON.stringify(evalRes.result.value, null, 2));

    await send('Browser.close').catch(() => {});
  } catch(e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}

testPage(process.argv[2] || 'lawfirm-blog.html');
