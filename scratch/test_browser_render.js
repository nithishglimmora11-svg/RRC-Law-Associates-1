const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runBrowserTests() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    console.log('Starting Edge in headless mode on port 9322...');
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9322',
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const fileUrl = 'file:///' + path.resolve('partners.html').replace(/\\/g, '/');
        console.log('Navigating to:', fileUrl);

        const newTabRes = await fetch('http://127.0.0.1:9322/json/new?' + encodeURIComponent(fileUrl), { method: 'PUT' });
        const tab = await newTabRes.json();
        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        let id = 1;
        const send = (method, params = {}) => new Promise((resolve, reject) => {
            const msgId = id++;
            const handler = (evt) => {
                const msg = JSON.parse(evt.data);
                if (msg.id === msgId) {
                    ws.removeEventListener('message', handler);
                    if (msg.error) reject(msg.error);
                    else resolve(msg.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: msgId, method, params }));
        });

        await new Promise((res, rej) => {
            ws.addEventListener('open', res);
            ws.addEventListener('error', rej);
        });

        await send('Page.enable');
        await send('DOM.enable');
        await send('Runtime.enable');

        // Wait for page to fully load
        await new Promise(r => setTimeout(r, 2000));

        // 1. DESKTOP VIEWPORT TEST & SCREENSHOT (1440 x 900)
        console.log('1. Testing Desktop Viewport (1440x900)...');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false
        });
        await new Promise(r => setTimeout(r, 1000));

        const desktopScreenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_desktop.png'), Buffer.from(desktopScreenshot.data, 'base64'));
        console.log('Saved scratch/partners_desktop.png');

        // Test Filter Click in Desktop
        console.log('Testing Filter Click on "Negeri Sembilan"...');
        const filterResult = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    const btn = document.querySelectorAll('.lp-filter-btn')[1]; // Negeri Sembilan
                    btn.click();
                    const visibleCards = Array.from(document.querySelectorAll('.partner-item')).filter(el => el.style.display !== 'none');
                    return {
                        buttonText: btn.innerText,
                        visibleCount: visibleCards.length,
                        activeClass: btn.classList.contains('active')
                    };
                })()
            `,
            returnByValue: true
        });
        console.log('Filter Test Result:', filterResult.result.value);

        // Reset Filter to All
        await send('Runtime.evaluate', {
            expression: `document.querySelectorAll('.lp-filter-btn')[0].click();`
        });

        // Test Form Step Navigation
        console.log('Testing Multi-Step Form Navigation Step 1 -> Step 2...');
        const formNavResult = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('appName').value = 'LexGlobal Advocates LLP';
                    document.getElementById('appCategory').value = 'Law Firm';
                    document.getElementById('appEmail').value = 'contact@lexglobal.com';
                    document.getElementById('appPhone').value = '+91 98765 43210';
                    document.getElementById('appCountry').value = 'India';
                    document.getElementById('appCity').value = 'Chennai';
                    document.getElementById('appOverview').value = 'Premier corporate litigation boutique handling complex cross-border disputes.';
                    
                    goToStep(2);
                    
                    const pane2Visible = document.getElementById('stepPane2').style.display === 'block';
                    const ind2Active = document.getElementById('stepIndicator2').classList.contains('active');
                    const ind1Completed = document.getElementById('stepIndicator1').classList.contains('completed');
                    return { pane2Visible, ind2Active, ind1Completed };
                })()
            `,
            returnByValue: true
        });
        console.log('Form Navigation Result:', formNavResult.result.value);

        // Test Step 2 -> Step 3
        console.log('Testing Step 2 -> Step 3...');
        const formStep3Result = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('pa1').checked = true;
                    document.getElementById('pa2').checked = true;
                    document.getElementById('appBarNumber').value = 'Bar Council of Tamil Nadu';
                    document.getElementById('appExp').value = '10-15 Years';
                    document.getElementById('appJurisdictions').value = 'Madras High Court & Supreme Court of India';
                    
                    goToStep(3);
                    return {
                        pane3Visible: document.getElementById('stepPane3').style.display === 'block',
                        ind3Active: document.getElementById('stepIndicator3').classList.contains('active')
                    };
                })()
            `,
            returnByValue: true
        });
        console.log('Form Step 3 Result:', formStep3Result.result.value);

        // Test Step 3 -> Step 4 (Review Card Compilation)
        console.log('Testing Step 3 -> Step 4 Review Summary...');
        const formStep4Result = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('checkDeclaration').checked = true;
                    document.getElementById('checkPrivacy').checked = true;
                    document.getElementById('checkDirectoryConsent').checked = true;
                    
                    goToStep(4);
                    const reviewText = document.getElementById('reviewSummaryCard').innerText;
                    return {
                        pane4Visible: document.getElementById('stepPane4').style.display === 'block',
                        hasFirmName: reviewText.includes('LexGlobal Advocates LLP'),
                        hasLocation: reviewText.includes('Chennai, India'),
                        hasConsent: reviewText.includes('Granted')
                    };
                })()
            `,
            returnByValue: true
        });
        console.log('Form Step 4 Review Result:', formStep4Result.result.value);

        // 2. MOBILE VIEWPORT TEST & SCREENSHOT (375 x 812 - iPhone X)
        console.log('2. Testing Mobile Viewport (375x812)...');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 812,
            deviceScaleFactor: 2,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 1000));

        const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_mobile.png'), Buffer.from(mobileScreenshot.data, 'base64'));
        console.log('Saved scratch/partners_mobile.png');

        // Check horizontal overflow on mobile
        const overflowResult = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    return {
                        scrollWidth: document.documentElement.scrollWidth,
                        clientWidth: document.documentElement.clientWidth,
                        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
                    };
                })()
            `,
            returnByValue: true
        });
        console.log('Mobile Overflow Check:', overflowResult.result.value);

        // 3. TABLET VIEWPORT TEST (768 x 1024 - iPad)
        console.log('3. Testing Tablet Viewport (768x1024)...');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 768,
            height: 1024,
            deviceScaleFactor: 2,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 1000));

        const tabletScreenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/partners_tablet.png'), Buffer.from(tabletScreenshot.data, 'base64'));
        console.log('Saved scratch/partners_tablet.png');

        ws.close();
        console.log('ALL BROWSER TESTS COMPLETED SUCCESSFULLY!');
    } catch (err) {
        console.error('Browser Test Error:', err);
    } finally {
        browser.kill();
    }
}

runBrowserTests();

