const { spawn } = require('child_process');
const fs = require('fs');

const allPages = fs.readdirSync('.').filter(f => f.endsWith('.html'));

async function testMobileMenu() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9236'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9236/json/new?about:blank', { method: 'PUT' });
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

    console.log(`--- Testing Mobile Menu on 390x844 viewport across all ${allPages.length} pages ---`);

    let allPassed = true;
    const failures = [];

    for (let i = 0; i < allPages.length; i++) {
      const page = allPages[i];
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true
      });

      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 1200));

      const menuRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            // Dismiss disclaimer if present
            const disclaimer = document.querySelector('#disclaimerOverlay');
            if (disclaimer) disclaimer.style.display = 'none';

            const toggle = document.querySelector('#menuToggle, .menu-toggle');
            const menu = document.querySelector('#mobileMenu, .mobile-menu');
            const closeBtn = document.querySelector('#closeMenu, .close-menu');
            
            if (!toggle || !menu) {
              return { hasToggle: !!toggle, hasMenu: !!menu, error: 'Toggle or menu missing' };
            }

            const isOpen = () => menu.classList.contains('open') || menu.classList.contains('active');

            toggle.click();
            const openedAfterClick = isOpen();
            
            // Check triggers
            const triggers = Array.from(menu.querySelectorAll('.m-trigger, [data-bs-toggle="collapse"]'));
            const submenus = Array.from(menu.querySelectorAll('.m-submenu, .collapse'));
            
            let triggerWorks = false;
            if (triggers.length > 0) {
              triggers[0].click();
              triggerWorks = submenus.some(sm => sm.classList.contains('active') || sm.classList.contains('show') || sm.style.display === 'block');
            } else {
              triggerWorks = true; // No triggers needed
            }

            if (closeBtn) {
              closeBtn.click();
            }
            const closedAfterCloseBtn = !isOpen();

            return {
              hasToggle: true,
              hasMenu: true,
              openedAfterClick,
              triggerWorks,
              closedAfterCloseBtn
            };
          })()
        `,
        returnByValue: true
      });

      const val = menuRes.result.value;
      const pass = val.openedAfterClick && val.closedAfterCloseBtn && val.triggerWorks;
      if (!pass) {
        allPassed = false;
        failures.push({ page, ...val });
      }
      console.log(`[${i+1}/${allPages.length}] ${page} -> Pass: ${pass} | Open: ${val.openedAfterClick} | Close: ${val.closedAfterCloseBtn} | Accordion: ${val.triggerWorks}`);
    }

    console.log(`\n================ SUMMARY ================`);
    console.log(`Total pages tested: ${allPages.length}`);
    console.log(`Failures: ${failures.length}`);
    console.log(`All passed: ${allPassed}`);
    if (failures.length > 0) {
      console.log('Failed pages:', JSON.stringify(failures, null, 2));
    }
    ws.close();
  } finally {
    browser.kill();
  }
}

testMobileMenu();
