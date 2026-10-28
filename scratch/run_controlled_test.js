const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runControlledTest() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const port = 9345;
    console.log(`[TEST RUNNER] Starting Edge headless on port ${port}...`);

    const browser = spawn(edgePath, [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--no-sandbox',
        '--disable-gpu'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const partnersUrl = 'file:///' + path.resolve('partners.html').replace(/\\/g, '/');
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
                        postData: msg.params.request.postData ? '[MULTIPART FORM DATA CONTAINING AUDIT PAYLOAD]' : null,
                        timestamp: new Date().toISOString()
                    };
                    console.log(`[NETWORK EVENT] Intercepted outgoing request to: ${msg.params.request.url}`);
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
                    console.log(`[NETWORK EVENT] Received response: ${msg.params.response.status} ${msg.params.response.statusText}`);

                    // Fetch body
                    try {
                        const bodyRes = await send('Network.getResponseBody', { requestId: msg.params.requestId });
                        web3ResponseBody = bodyRes.body;
                        console.log(`[NETWORK EVENT] Response Body retrieved:`, web3ResponseBody);
                    } catch (e) {
                        console.log('[NETWORK EVENT] Could not fetch response body:', e.message);
                    }
                }
            }
        });

        await new Promise(r => setTimeout(r, 1500));

        console.log('[TEST STEP 1] Filling Step 1 fields...');
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
                    document.getElementById('appOverview').value = '[CONTROLLED AUDIT TEST] Technical verification of Web3Forms API endpoint connectivity, HTTP response handling, and intake pipeline.';
                    goToStep(2);
                })()
            `
        });

        await new Promise(r => setTimeout(r, 600));

        console.log('[TEST STEP 2] Filling Step 2 fields...');
        await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('pa1').checked = true; // NRI Property Protection
                    document.getElementById('pa2').checked = true; // Commercial & Contract Law
                    document.getElementById('appBarNumber').value = 'TN/AUDIT/2026 (Internal Test)';
                    document.getElementById('appExp').value = '15+ Years';
                    document.getElementById('appJurisdictions').value = 'Madras High Court & Supreme Court of India';
                    goToStep(3);
                })()
            `
        });

        await new Promise(r => setTimeout(r, 600));

        console.log('[TEST STEP 3] Filling Step 3 consents...');
        await send('Runtime.evaluate', {
            expression: `
                (() => {
                    document.getElementById('appDocLink').value = 'https://rrclawassociates.com/audit-test-reference';
                    document.getElementById('checkDeclaration').checked = true;
                    document.getElementById('checkPrivacy').checked = true;
                    document.getElementById('checkDirectoryConsent').checked = false;
                    goToStep(4);
                })()
            `
        });

        await new Promise(r => setTimeout(r, 600));

        console.log('[TEST STEP 4] Checking review summary & submitting form...');
        const reviewText = await send('Runtime.evaluate', {
            expression: `document.getElementById('reviewSummaryCard').innerText`,
            returnByValue: true
        });
        console.log('[REVIEW SUMMARY CARD POPULATED]:\n', reviewText.result.value);

        // Click Submit Button
        const testStartTime = new Date().toISOString();
        console.log(`[TEST SUBMISSION STARTED AT: ${testStartTime}] Clicking submitAppBtn...`);
        await send('Runtime.evaluate', {
            expression: `document.getElementById('submitAppBtn').click();`
        });

        // Wait up to 5 seconds for network request to finish
        let waited = 0;
        while (!web3Response && waited < 10) {
            await new Promise(r => setTimeout(r, 500));
            waited++;
        }

        // Wait an additional second for DOM updates
        await new Promise(r => setTimeout(r, 1500));

        // Check DOM state
        const domState = await send('Runtime.evaluate', {
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

        console.log('[DOM STATE AFTER SUBMISSION]:', JSON.stringify(domState.result.value, null, 2));

        const testReport = {
            testTimestamp: testStartTime,
            endpoint: web3Request ? web3Request.url : 'https://api.web3forms.com/submit',
            httpStatus: web3Response ? web3Response.status : null,
            statusText: web3Response ? web3Response.statusText : null,
            apiResponseBody: web3ResponseBody,
            uiConfirmationVisible: domState.result.value.successBoxDisplay === 'block',
            formHidden: domState.result.value.formWrapperDisplay === 'none',
            errorAlertDisplayed: !domState.result.value.errorAlertHidden,
            errorAlertMessage: domState.result.value.errorAlertText
        };

        fs.writeFileSync(path.resolve('scratch/controlled_test_results.json'), JSON.stringify(testReport, null, 2));
        console.log('[SAVED] scratch/controlled_test_results.json');

        // Capture screenshot of result
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve('scratch/controlled_test_screenshot.png'), Buffer.from(screenshot.data, 'base64'));
        console.log('[SAVED] scratch/controlled_test_screenshot.png');

        ws.close();
    } finally {
        browser.kill();
        console.log('[TEST RUNNER] Edge process terminated.');
    }
}

runControlledTest().catch(err => {
    console.error('Controlled test error:', err);
    process.exit(1);
});

