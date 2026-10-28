const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function validateFormDomAndJs() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const port = 9348;
    console.log(`Starting Edge on port ${port}...`);

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

        const jsErrors = [];
        ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Runtime.exceptionThrown') {
                jsErrors.push(msg.params.exceptionDetails.text);
            }
        });

        await send('Page.enable');
        await send('Runtime.enable');
        await new Promise(r => setTimeout(r, 1000));

        // Evaluate Form Checks
        const domCheck = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    const form = document.getElementById('partnerApplicationForm');
                    if (!form) return { formFound: false };
                    
                    const accessKeyInput = form.querySelector('input[name="access_key"]');
                    const fromNameInput = form.querySelector('input[name="from_name"]');
                    const subjectInput = form.querySelector('input[name="subject"]');
                    const botcheckInput = form.querySelector('input[name="botcheck"]');
                    const submitBtn = document.getElementById('submitAppBtn');
                    const successBox = document.getElementById('successBox');
                    const formWrapper = document.getElementById('formWrapper');

                    const newKey = "c7cfef9d-f2e7-4c43-95e8-9a54f3e5773b";
                    const isNewKey = accessKeyInput ? accessKeyInput.value === newKey : false;

                    return {
                        formFound: true,
                        hasAccessKeyInput: !!accessKeyInput,
                        isExactNewKey: isNewKey,
                        keyMatchesExpectedLength: accessKeyInput ? accessKeyInput.value.length === 36 : false,
                        fromNameValue: fromNameInput ? fromNameInput.value : null,
                        subjectValue: subjectInput ? subjectInput.value : null,
                        hasBotcheck: !!botcheckInput,
                        submitBtnFound: !!submitBtn,
                        successBoxFound: !!successBox,
                        formWrapperFound: !!formWrapper
                    };
                })()
            `,
            returnByValue: true
        });

        console.log('DOM & Key Check Result:', JSON.stringify(domCheck.result.value, null, 2));

        // Test Step-by-Step Navigation & Validation (without submitting)
        const stepCheck = await send('Runtime.evaluate', {
            expression: `
                (() => {
                    // Try to advance to step 2 without filling fields (should fail validation)
                    goToStep(2);
                    const step1Active = document.getElementById('stepIndicator1').classList.contains('active');
                    const step2Active = document.getElementById('stepIndicator2').classList.contains('active');
                    const stepPane1Visible = document.getElementById('stepPane1').style.display !== 'none';

                    // Now fill step 1
                    document.getElementById('appName').value = 'Test Validation Firm';
                    document.getElementById('appCategory').value = 'Law Firm';
                    document.getElementById('appEmail').value = 'test@example.com';
                    document.getElementById('appPhone').value = '+91 97511 82452';
                    document.getElementById('appCountry').value = 'India';
                    document.getElementById('appCity').value = 'Chennai';
                    document.getElementById('appOverview').value = 'Testing validation sequence.';
                    
                    // Advance to step 2
                    goToStep(2);
                    const advancedToStep2 = document.getElementById('stepIndicator2').classList.contains('active');

                    // Check practice areas selection and advance to step 3
                    document.getElementById('pa1').checked = true;
                    document.getElementById('appExp').value = '5-10 Years';
                    document.getElementById('appJurisdictions').value = 'Madras High Court';
                    goToStep(3);
                    const advancedToStep3 = document.getElementById('stepIndicator3').classList.contains('active');

                    // Check consents and advance to step 4
                    document.getElementById('checkDeclaration').checked = true;
                    document.getElementById('checkPrivacy').checked = true;
                    goToStep(4);
                    const advancedToStep4 = document.getElementById('stepIndicator4').classList.contains('active');
                    const summaryCardPopulated = document.getElementById('reviewSummaryCard').innerText.includes('Test Validation Firm');

                    // Reset back to step 1
                    goToStep(1);
                    const resetToStep1 = document.getElementById('stepIndicator1').classList.contains('active');

                    return {
                        validationHaltedWithoutFields: step1Active && !step2Active && stepPane1Visible,
                        advancedToStep2,
                        advancedToStep3,
                        advancedToStep4,
                        summaryCardPopulated,
                        resetToStep1
                    };
                })()
            `,
            returnByValue: true
        });

        console.log('Multi-Step Validation Test Result:', JSON.stringify(stepCheck.result.value, null, 2));
        console.log('JavaScript Console Errors Count:', jsErrors.length);
        if (jsErrors.length > 0) {
            console.log('JS Errors:', jsErrors);
        }

        ws.close();
    } finally {
        browser.kill();
        console.log('Edge process terminated.');
    }
}

validateFormDomAndJs().catch(err => {
    console.error('Validation script error:', err);
    process.exit(1);
});

