const { spawn } = require('child_process');

async function inspectMatchedRules() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9251'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const newTabRes = await fetch('http://127.0.0.1:9251/json/new?about:blank', { method: 'PUT' });
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
    await send('DOM.enable');
    await send('CSS.enable');

    // Navigate to oci-card-application-documents.html
    await send('Page.navigate', { url: 'http://localhost:8080/oci-card-application-documents.html' });
    await new Promise(r => setTimeout(r, 1500));

    const doc = await send('DOM.getDocument');
    const topbarNode = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '.rrc-topbar' });
    const headerNode = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '.header' });

    const topbarRules = await send('CSS.getMatchedStylesForNode', { nodeId: topbarNode.nodeId });
    const headerRules = await send('CSS.getMatchedStylesForNode', { nodeId: headerNode.nodeId });

    console.log('=== TOPBAR MATCHED RULES (oci-card-application-documents.html) ===');
    for (const match of topbarRules.matchedCSSRules) {
      const sel = match.rule.selectorList.text;
      const bg = match.rule.style.cssProperties.find(p => p.name === 'background' || p.name === 'background-color');
      const border = match.rule.style.cssProperties.find(p => p.name === 'border-bottom' || p.name.includes('border'));
      if (bg || border) {
        console.log(`Selector: "${sel}" from stylesheet ${match.rule.styleSheetId || 'inline'}`);
        if (bg) console.log(`   ${bg.name}: ${bg.value}`);
        if (border) console.log(`   ${border.name}: ${border.value}`);
      }
    }

    console.log('\n=== HEADER MATCHED RULES (oci-card-application-documents.html) ===');
    for (const match of headerRules.matchedCSSRules) {
      const sel = match.rule.selectorList.text;
      const bg = match.rule.style.cssProperties.find(p => p.name === 'background' || p.name === 'background-color');
      const border = match.rule.style.cssProperties.find(p => p.name === 'border-bottom' || p.name.includes('border'));
      if (bg || border) {
        console.log(`Selector: "${sel}" from stylesheet ${match.rule.styleSheetId || 'inline'}`);
        if (bg) console.log(`   ${bg.name}: ${bg.value}`);
        if (border) console.log(`   ${border.name}: ${border.value}`);
      }
    }

    // Also inspect navigation link, button, dropdown, container padding
    const navNode = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '.header nav' });
    const navRules = await send('CSS.getMatchedStylesForNode', { nodeId: navNode.nodeId });
    console.log('\n=== HEADER NAV MATCHED RULES ===');
    for (const match of navRules.matchedCSSRules) {
      console.log(`Selector: "${match.rule.selectorList.text}"`);
    }

    await send('Browser.close').catch(() => {});
  } catch(e) {
    console.error('Error:', e);
  } finally {
    browser.kill();
  }
}

inspectMatchedRules();
