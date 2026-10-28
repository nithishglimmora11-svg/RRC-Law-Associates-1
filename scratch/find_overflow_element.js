const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PORT = 9273;
const PROFILE_DIR = path.resolve(__dirname, 'chrome_overflow_diag');

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
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
        return new Promise(resolve => {
            if (this.ws.readyState === WebSocket.OPEN) return resolve();
            this.ws.onopen = () => resolve();
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
        const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        return res?.result?.value;
    }
    close() { this.ws.close(); }
}

async function run() {
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--no-first-run',
        '--headless=new',
        'about:blank'
    ]);
    await sleep(2000);
    const endpoints = await getJson(`http://127.0.0.1:${CHROME_PORT}/json`);
    const cdp = new CdpClient(endpoints.find(e => e.type === 'page').webSocketDebuggerUrl);
    await cdp.ready();

    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:5502/cheque-bounce-lawyer' });
    await sleep(1500);

    await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: 320,
        height: 800,
        deviceScaleFactor: 1,
        mobile: true
    });
    await sleep(500);

    const overflowingElements = await cdp.evaluate(`(() => {
        const winW = window.innerWidth;
        const all = Array.from(document.querySelectorAll('*'));
        const bad = [];
        for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winW + 1) {
                bad.push({
                    tag: el.tagName,
                    id: el.id,
                    className: el.className,
                    right: rect.right,
                    width: rect.width,
                    diff: rect.right - winW,
                    outerHTML: el.outerHTML.slice(0, 100)
                });
            }
        }
        return bad.slice(0, 10);
    })()`);

    console.log("Overflowing elements in cheque-bounce-lawyer at 320px:");
    console.table(overflowingElements);

    cdp.close();
    chrome.kill();
    process.exit(0);
}

run();

