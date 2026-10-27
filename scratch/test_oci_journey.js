const { spawn } = require('child_process');

async function testOciJourney() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9231'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9231/json/new?about:blank', { method: 'PUT' });
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

    await send('Page.navigate', { url: 'http://localhost:8080/oci-legal-guides.html' });
    await new Promise(r => setTimeout(r, 1200));

    // Test filter buttons
    const filterRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const filterBtns = Array.from(document.querySelectorAll('.cat-filter-btn'));
          const groups = Array.from(document.querySelectorAll('.category-group-block'));
          
          const results = [];
          
          for (const btn of filterBtns) {
            btn.click();
            const filterVal = btn.getAttribute('data-filter');
            const visibleGroups = groups.filter(g => window.getComputedStyle(g).display !== 'none');
            results.push({
              filter: filterVal,
              active: btn.classList.contains('active'),
              visibleGroupsCount: visibleGroups.length,
              visibleGroupIds: visibleGroups.map(g => g.id)
            });
          }

          // Click Clear button
          const clearBtn = document.querySelector('#filterClearBtn');
          if (clearBtn) {
            clearBtn.click();
            const visibleAfterClear = groups.filter(g => window.getComputedStyle(g).display !== 'none');
            results.push({
              action: 'clear_button',
              visibleGroupsCount: visibleAfterClear.length
            });
          }

          return results;
        })()
      `,
      returnByValue: true
    });

    console.log('OCI Legal Guides Hub Filter Test Results:');
    console.log(JSON.stringify(filterRes.result.value, null, 2));

    // Test all guide links in hub
    const linksRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const guideLinks = Array.from(document.querySelectorAll('.guide-card a, .category-group-block a'));
          return guideLinks.map(a => ({
            text: a.textContent.trim().replace(/\\s+/g, ' ').slice(0, 50),
            href: a.getAttribute('href')
          }));
        })()
      `,
      returnByValue: true
    });

    console.log(`\nFound ${linksRes.result.value.length} guide links in hub. Checking destinations...`);
    const brokenHubLinks = [];
    for (const l of linksRes.result.value) {
      if (!l.href || l.href === '#') {
        brokenHubLinks.push({ ...l, reason: 'Empty or hash' });
        continue;
      }
      try {
        const fullUrl = new URL(l.href, 'http://localhost:8080/oci-legal-guides.html').href;
        const res = await fetch(fullUrl);
        if (res.status !== 200) {
          brokenHubLinks.push({ ...l, status: res.status });
        }
      } catch (e) {
        brokenHubLinks.push({ ...l, error: e.message });
      }
    }

    console.log(`Broken hub links count: ${brokenHubLinks.length}`);
    if (brokenHubLinks.length > 0) {
      console.log(JSON.stringify(brokenHubLinks, null, 2));
    }

    ws.close();
  } finally {
    browser.kill();
  }
}

testOciJourney();
