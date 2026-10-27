const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEV_PORT = 5578;
const CHROME_PORT = 9225;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_diagnose_profile');

function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class CdpClient {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
        this.id = 1;
        this.callbacks = new Map();

        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id && this.callbacks.has(msg.id)) {
                const { resolve, reject } = this.callbacks.get(msg.id);
                this.callbacks.delete(msg.id);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
            }
        };
    }

    ready() {
        return new Promise((resolve, reject) => {
            if (this.ws.readyState === WebSocket.OPEN) return resolve();
            this.ws.onopen = () => resolve();
            this.ws.onerror = (e) => reject(e);
        });
    }

    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const reqId = this.id++;
            this.callbacks.set(reqId, { resolve, reject });
            this.ws.send(JSON.stringify({ id: reqId, method, params }));
        });
    }

    async evaluate(expression) {
        const res = await this.send('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise: true
        });
        return res?.result?.value;
    }

    async setViewport(width, height) {
        await this.send('Emulation.setDeviceMetricsOverride', {
            width,
            height,
            deviceScaleFactor: 1,
            mobile: width < 992
        });
    }

    async screenshot(filepath) {
        const res = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
        fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    }

    close() {
        this.ws.close();
    }
}

async function run() {
    console.log('=== Diagnosing Invisible Content ===');
    if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

    const devServerProcess = spawn('node', ['dev-server.js', String(DEV_PORT)], { stdio: 'inherit' });
    await sleep(1000);

    const chromeProcess = spawn(CHROME_PATH, [
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,900',
        'about:blank'
    ]);
    await sleep(2000);

    let client = null;
    try {
        const targets = await getJson(`http://127.0.0.1:${CHROME_PORT}/json/list`);
        const pageTarget = targets.find(t => t.type === 'page') || targets[0];
        client = new CdpClient(pageTarget.webSocketDebuggerUrl);
        await client.ready();

        await client.send('Page.enable');
        await client.send('Runtime.enable');
        await client.send('DOM.enable');

        const consoleLogs = [];
        client.ws.addEventListener('message', (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Runtime.consoleAPICalled') {
                consoleLogs.push({ type: msg.params.type, text: msg.params.args.map(a => a.value || a.description).join(' ') });
            }
        });

        console.log('Navigating to http://127.0.0.1:' + DEV_PORT + '/wills-probate-estate-administration');
        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(2000);

        // Take full page screenshot
        const screenshotPath = path.resolve(__dirname, 'wills_full_page.png');
        await client.screenshot(screenshotPath);
        console.log('Saved full page screenshot to:', screenshotPath);

        // Inspect all sections under main
        const sectionsData = await client.evaluate(`
            (() => {
                const main = document.querySelector('main');
                if (!main) return { error: 'No <main> found' };

                const children = Array.from(main.children);
                return children.map((el, index) => {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    const heading = el.querySelector('h1, h2, h3')?.textContent.trim() || 'No heading';
                    
                    // Check text contrast / color of text nodes
                    const pElements = Array.from(el.querySelectorAll('p, li, h1, h2, h3, a, span'));
                    const sampleTextElements = pElements.slice(0, 5).map(p => {
                        const pStyle = window.getComputedStyle(p);
                        return {
                            tag: p.tagName,
                            text: p.textContent.slice(0, 30),
                            color: pStyle.color,
                            bgColor: pStyle.backgroundColor,
                            opacity: pStyle.opacity,
                            visibility: pStyle.visibility,
                            display: pStyle.display
                        };
                    });

                    return {
                        index,
                        tag: el.tagName,
                        id: el.id,
                        className: el.className,
                        heading,
                        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                        computedStyle: {
                            display: style.display,
                            visibility: style.visibility,
                            opacity: style.opacity,
                            color: style.color,
                            backgroundColor: style.backgroundColor,
                            zIndex: style.zIndex,
                            position: style.position,
                            overflow: style.overflow
                        },
                        childCount: el.children.length,
                        sampleTexts: sampleTextElements
                    };
                });
            })()
        `);

        console.log('=== Sections Analysis ===');
        console.log(JSON.stringify(sectionsData, null, 2));

        // Also check if any enquiry form or other section was expected
        const formCheck = await client.evaluate(`
            (() => {
                const form = document.querySelector('form');
                const enquiry = document.querySelector('[id*="enquiry"], [id*="contact"], [class*="enquiry"], [class*="form"]');
                return {
                    formFound: !!form,
                    formId: form?.id,
                    formClass: form?.className,
                    enquiryFound: !!enquiry,
                    enquiryTag: enquiry?.tagName,
                    enquiryId: enquiry?.id
                };
            })()
        `);
        console.log('=== Form Check ===', formCheck);

        // Check console logs
        console.log('=== Console Logs ===', consoleLogs);

    } catch (err) {
        console.error('Error during diagnosis:', err);
    } finally {
        if (client) client.close();
        chromeProcess.kill();
        devServerProcess.kill();
    }
}

run();

