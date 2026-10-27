const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEV_PORT = 5582;
const CHROME_PORT = 9229;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_style_check');

function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
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
        return new Promise((resolve) => {
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
    if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });
    const devServerProcess = spawn('node', ['dev-server.js', String(DEV_PORT)], { stdio: 'inherit' });
    await sleep(1000);
    const chromeProcess = spawn(CHROME_PATH, [
        `--remote-debugging-port=${CHROME_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
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

        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(2000);

        const styles = await client.evaluate(`
            (() => {
                const probate = document.getElementById('probate');
                if (!probate) return { error: 'No probate found' };
                const ps = Array.from(probate.querySelectorAll('p, li, h2, h4, strong'));
                return ps.map(p => {
                    const comp = window.getComputedStyle(p);
                    return {
                        tag: p.tagName,
                        text: p.textContent.slice(0, 50),
                        color: comp.color,
                        bgColor: comp.backgroundColor,
                        fontSize: comp.fontSize,
                        opacity: comp.opacity,
                        visibility: comp.visibility
                    };
                });
            })()
        `);
        console.log('Probate section text styles:');
        console.log(JSON.stringify(styles, null, 2));

    } finally {
        if (client) client.close();
        chromeProcess.kill();
        devServerProcess.kill();
    }
}
run();

