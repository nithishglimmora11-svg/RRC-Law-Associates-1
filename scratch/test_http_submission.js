const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testHttpSubmission() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const port = 9346;
    console.log(`[TEST RUNNER] Starting Edge headless on port ${port}...`);

    const browser = spawn(edgePath, [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const partnersUrl = 'http://127.0.0.1:5502/partners.html';
        const tabRes = await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURIComponent(partnersUrl), { method: 'PUT' });
        const tab = await tabRes.json();
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
        await send('Network.enable');
        await send('Runtime.enable');

        let web3Request = null;
        let web3Response = null;
        let web3ResponseBody = null;

        ws.addEventListener('message', async (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Network.requestWillBeSent') {
                if (msg.params.request.url.includes('web3forms.com')) {
                    web3Request = {
                        url: msg.params.request.url,
                        method: msg.params.request.method,
                        headers: msg.params.request.headers,
                        timestamp: new Date().toISOString()
                    };
                    console.log(`[NETWORK] Outgoing request to: ${msg.params.request.url}`);
                }
            } else if (msg.method === 'Network.responseReceived') {
                if (msg.params.response.url.includes('web3forms.com')) {
                    web3Response = {
                        url: msg.params.response.url,
                        status: msg.params.response.status,
                        statusText: msg.params.response.statusText,
                        headers: msg.params.response.headers,
                        timestamp: new Date().toISOString()
                    };
                    console.log(`[NETWORK] Response received: ${msg.params.response.status} ${msg.params.response.statusText}`);

                    try {
                        const bodyRes = await send('Network.getResponseBody', { requestId: msg.params.requestId });
                        web3ResponseBody = bodyRes.body;
                        console.log(`[NETWORK] Response body:\n`, web3ResponseBody);
                    } catch (e) {
                        console.log('[NETWORK] Error getting response body:', e.message);
                    }
                }
            }
        });

        await new Promise(r => setTimeout(r, 1500));

        console.log('[STEP 1] Filling form fields...');
        await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('appName').value = '[AUDIT TEST] RRC Tech Verification Desk';
                    document.getElementById('appCategory').value = 'Law Firm';
                    document.getElementById('appEmail').value = 'audit-test@rrclawassociates.com';
                    document.getElementById('appPhone').value = '+91 97511 82452';
                    document.getElementById('appCountry').value = 'India';
                    document.getElementById('appCity').value = 'Thanjavur (Internal Test Scope)';
                    document.getElementById('appYear').value = '2026';
                    document.getElementById('appWebsite').value = 'https://rrclawassociates.com';
                    document.getElementById('appOverview').value = '[CONTROLLED AUDIT TEST] Technical verification of Web3Forms API endpoint connectivity, HTTP response code, and delivery pipeline.';
                    goToStep(2);
                })()
            `
        });

        await new Promise(r => setTimeout(r, 500));

        console.log('[STEP 2] Practice Areas...');
        await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('pa1').checked = true;
                    document.getElementById('pa2').checked = true;
                    document.getElementById('appBarNumber').value = 'TN/AUDIT/2026';
                    document.getElementById('appExp').value = '15+ Years';
                    document.getElementById('appJurisdictions').value = 'Madras High Court';
                    goToStep(3);
                })()
            `
        });

        await new Promise(r => setTimeout(r, 500));

        console.log('[STEP 3] Consents...');
        await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('appDocLink').value = 'https://rrclawassociates.com/audit-test-ref';
                    document.getElementById('checkDeclaration').checked = true;
                    document.getElementById('checkPrivacy').checked = true;
                    document.getElementById('checkDirectoryConsent').checked = false;
                    goToStep(4);
                })()
            `
        });

        await new Promise(r => setTimeout(r, 500));

        console.log('[STEP 4] Submitting form via submit button...');
        const testStartTime = new Date().toISOString();
        await send('Runtime.evaluate', {
            expression: `document.getElementById('submitAppBtn').click();`
        });

        let waited = 0;
        while (!web3Response && waited < 12) {
            await new Promise(r => setTimeout(r, 500));
            waited++;
        }

        await new Promise(r => setTimeout(r, 2000));

        const finalDomState = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    const formBox = document.getElementById('formWrapper');
                    const successBox = document.getElementById('successBox');
                    const errorAlert = document.getElementById('submissionErrorAlert');
                    const errorMsg = document.getElementById('submissionErrorMessage');
                    return {
                        formWrapperDisplay: window.getComputedStyle(formBox).display,
                        successBoxDisplay: window.getComputedStyle(successBox).display,
                        errorAlertHidden: errorAlert.classList.contains('d-none'),
                        errorAlertText: errorMsg ? errorMsg.innerText : null
                    };
                })()
            `,
            returnByValue: true
        });

        console.log('[FINAL DOM STATE]:', JSON.stringify(finalDomState.result.value, null, 2));

        const auditResult = {
            testTimestamp: testStartTime,
            environment: 'Local HTTP Dev Server (http://127.0.0.1:5502/partners.html)',
            requestUrl: web3Request ? web3Request.url : 'https://api.web3forms.com/submit',
            requestMethod: web3Request ? web3Request.method : 'POST',
            requestHeaders: web3Request ? web3Request.headers : null,
            responseStatus: web3Response ? web3Response.status : null,
            responseStatusText: web3Response ? web3Response.statusText : null,
            responseHeaders: web3Response ? web3Response.headers : null,
            responseBody: web3ResponseBody,
            successScreenShown: finalDomState.result.value.successBoxDisplay === 'block',
            formHidden: finalDomState.result.value.formWrapperDisplay === 'none',
            errorAlertShown: !finalDomState.result.value.errorAlertHidden,
            errorAlertMessage: finalDomState.result.value.errorAlertText
        };

        fs.writeFileSync(path.resolve('scratch/controlled_test_http_results.json'), JSON.stringify(auditResult, null, 2));
        console.log('[SAVED] scratch/controlled_test_http_results.json');

        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/controlled_test_http_screenshot.png'), Buffer.from(screenshot.data, 'base64'));
        console.log('[SAVED] scratch/controlled_test_http_screenshot.png');

        ws.close();
    } finally {
        browser.kill();
        console.log('[TEST RUNNER] Edge process terminated.');
    }
}

testHttpSubmission().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});

