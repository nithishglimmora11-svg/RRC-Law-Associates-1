const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function checkCurrent() {
    const tempProfile = path.resolve(__dirname, 'edge-temp-check-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9299',
        '--user-data-dir=' + tempProfile
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = 'http://localhost:8080/oci-card-assistance.html';
        const newTabRes = await fetch('http://127.0.0.1:9299/json/new?' + targetUrl, { method: 'PUT' });
        const tab = await newTabRes.json();
        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        let id = 1;
        const send = (method, params = {}) => new Promise((resolve) => {
            const curId = id++;
            const handler = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.id === curId) {
                    ws.removeEventListener('message', handler);
                    resolve(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: curId, method, params }));
        });

        await new Promise((res) => ws.addEventListener('open', res));
        await send('Page.enable');
        await send('Runtime.enable');

        await send('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            mobile: true
        });

        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 3000));

        // Click menu toggle
        await send('Runtime.evaluate', {
            expression: `(() => {
                const toggle = document.getElementById('menuToggle');
                if (toggle) toggle.click();
            })()`
        });
        await new Promise(r => setTimeout(r, 500));

        // Evaluate styles of .m-link
        const res = await send('Runtime.evaluate', {
            expression: `(() => {
                const menu = document.getElementById('mobileMenu');
                const firstLink = menu ? menu.querySelector('.m-link') : null;
                const closeBtn = document.getElementById('closeMenu');
                const linkStyle = firstLink ? window.getComputedStyle(firstLink) : null;
                const closeStyle = closeBtn ? window.getComputedStyle(closeBtn) : null;
                const menuStyle = menu ? window.getComputedStyle(menu) : null;

                return {
                    menuOpenClass: menu ? menu.className : null,
                    menuRight: menuStyle ? menuStyle.right : null,
                    linkText: firstLink ? firstLink.textContent : null,
                    linkColor: linkStyle ? linkStyle.color : null,
                    linkTextDecoration: linkStyle ? linkStyle.textDecorationLine : null,
                    linkDisplay: linkStyle ? linkStyle.display : null,
                    linkPadding: linkStyle ? linkStyle.padding : null,
                    closeTop: closeStyle ? closeStyle.top : null,
                    closeRight: closeStyle ? closeStyle.right : null,
                    closePosition: closeStyle ? closeStyle.position : null,
                    backdropExists: !!document.getElementById('mobileMenuBackdrop')
                };
            })()`,
            returnByValue: true
        });

        console.log('Current baseline evaluation:', JSON.stringify(res.result.value, null, 2));

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'current_mobile_menu_baseline.png'), Buffer.from(shot.data, 'base64'));
        console.log('Saved scratch/current_mobile_menu_baseline.png');

        ws.close();
    } catch (e) {
        console.error('Error:', e);
    } finally {
        browser.kill();
        process.exit(0);
    }
}

checkCurrent();
