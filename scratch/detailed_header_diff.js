const { spawn } = require('child_process');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, ['--headless=new', '--remote-debugging-port=9257']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const newTabRes = await fetch('http://127.0.0.1:9257/json/new?about:blank', { method: 'PUT' });
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

    for (const page of ['lawfirm-blog.html', 'oci-card-application-documents.html']) {
      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 1200));
      const res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const topbar = document.querySelector('.rrc-topbar');
            const topbarPhone = document.querySelector('.rrc-topbar-left a[href*="tel"]');
            const topbarPhoneIcon = document.querySelector('.rrc-topbar-left a[href*="tel"] i');
            const topbarEmail = document.querySelector('.rrc-topbar-left a[href*="mailto"]');
            const topbarEmailIcon = document.querySelector('.rrc-topbar-left a[href*="mailto"] i');
            const topbarDivider = document.querySelector('.rrc-topbar-divider');
            const topbarClock = document.querySelector('.rrc-topbar-right span');
            const topbarClockIcon = document.querySelector('.rrc-topbar-right span i');
            const topbarSocial = document.querySelector('.rrc-topbar-right a');
            const header = document.querySelector('.header');
            const logo = document.querySelector('.header .logo-img');
            const navLink = document.querySelector('.header .nav-link-custom');
            const btnGold = document.querySelector('.header .btn-gold');

            function s(el) {
              if (!el) return null;
              const c = window.getComputedStyle(el);
              return {
                bg: c.backgroundColor,
                color: c.color,
                fontFamily: c.fontFamily,
                fontSize: c.fontSize,
                fontWeight: c.fontWeight,
                borderBottom: c.borderBottom,
                border: c.border,
                width: c.width,
                height: c.height,
                padding: c.padding,
                margin: c.margin
              };
            }

            return {
              page: "${page}",
              topbar: s(topbar),
              topbarPhone: s(topbarPhone),
              topbarPhoneIcon: s(topbarPhoneIcon),
              topbarEmail: s(topbarEmail),
              topbarEmailIcon: s(topbarEmailIcon),
              topbarDivider: s(topbarDivider),
              topbarClock: s(topbarClock),
              topbarClockIcon: s(topbarClockIcon),
              topbarSocial: s(topbarSocial),
              header: s(header),
              logo: s(logo),
              navLink: s(navLink),
              btnGold: s(btnGold)
            };
          })()
        `,
        returnByValue: true
      });
      console.log(JSON.stringify(res.result.value, null, 2));
    }
    await send('Browser.close');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}
test();
