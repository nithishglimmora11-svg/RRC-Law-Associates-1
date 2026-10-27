const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEV_PORT = 5586;
const CHROME_PORT = 9233;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_white_text_scan');

function getJson(urlStr) {
    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

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

        const invisibleElements = await client.evaluate(`
            (() => {
                function parseRgb(colorStr) {
                    const match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d\\.]+))?/);
                    if (!match) return null;
                    return {
                        r: parseInt(match[1]),
                        g: parseInt(match[2]),
                        b: parseInt(match[3]),
                        a: match[4] !== undefined ? parseFloat(match[4]) : 1
                    };
                }

                function getEffectiveBg(el) {
                    let cur = el;
                    while (cur && cur !== document.documentElement) {
                        const style = window.getComputedStyle(cur);
                        const bg = style.backgroundColor;
                        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                            return bg;
                        }
                        cur = cur.parentElement;
                    }
                    return 'rgb(255, 255, 255)';
                }

                const results = [];
                const all = document.querySelectorAll('main *');

                all.forEach(el => {
                    const text = Array.from(el.childNodes)
                        .filter(n => n.nodeType === Node.TEXT_NODE)
                        .map(n => n.textContent.trim())
                        .join(' ');
                    if (!text) return;

                    const style = window.getComputedStyle(el);
                    const textColor = parseRgb(style.color);
                    const bgStr = getEffectiveBg(el);
                    const bgColor = parseRgb(bgStr);

                    if (textColor && bgColor) {
                        // Check if text is white/light (r>200, g>200, b>200) and bg is white/light (r>200, g>200, b>200)
                        const isTextLight = textColor.r > 200 && textColor.g > 200 && textColor.b > 200;
                        const isBgLight = bgColor.r > 200 && bgColor.g > 200 && bgColor.b > 200;

                        if (isTextLight && isBgLight) {
                            results.push({
                                tag: el.tagName,
                                id: el.id,
                                class: el.className,
                                parentSection: el.closest('section')?.id || el.closest('section')?.className,
                                text: text.slice(0, 60),
                                textColor: style.color,
                                bgColor: bgStr
                            });
                        }
                    }
                });

                return results;
            })()
        `);

        console.log('Total invisible white-on-light text elements found:', invisibleElements.length);
        console.log(JSON.stringify(invisibleElements, null, 2));

    } finally {
        if (client) client.close();
        chromeProcess.kill();
        devServerProcess.kill();
    }
}
run();

