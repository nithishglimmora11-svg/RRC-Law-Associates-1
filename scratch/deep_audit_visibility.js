const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEV_PORT = 5580;
const CHROME_PORT = 9227;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = path.resolve(__dirname, 'chrome_visibility_profile');

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

    close() {
        this.ws.close();
    }
}

async function run() {
    console.log('=== Deep Visibility Audit via Chrome ===');
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

        await client.send('Page.navigate', { url: `http://127.0.0.1:${DEV_PORT}/wills-probate-estate-administration` });
        await sleep(2000);

        // Audit function
        const auditResult = await client.evaluate(`
            (() => {
                const issues = [];
                
                // Helper to calculate relative luminance
                function parseRgb(colorStr) {
                    const match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
                    if (!match) return null;
                    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
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

                // Check all text-bearing elements
                const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, p, span, li, a, td, th');
                let invisibleCount = 0;
                let lowContrastCount = 0;
                let hiddenByDisplayCount = 0;

                allElements.forEach(el => {
                    // Ignore elements inside mobile menu if closed
                    if (el.closest('#mobileMenu') && !document.getElementById('mobileMenu').classList.contains('open')) {
                        return;
                    }

                    const style = window.getComputedStyle(el);
                    const text = el.textContent.trim();
                    if (!text) return;

                    // 1. Check display / visibility / opacity
                    if (style.display === 'none') {
                        // Check if it's intentionally responsive
                        if (!el.classList.contains('d-none') && !el.closest('.d-none')) {
                            issues.push({ type: 'display_none', tag: el.tagName, class: el.className, text: text.slice(0, 40) });
                        }
                        hiddenByDisplayCount++;
                        return;
                    }

                    if (style.visibility === 'hidden') {
                        issues.push({ type: 'visibility_hidden', tag: el.tagName, class: el.className, text: text.slice(0, 40) });
                        invisibleCount++;
                        return;
                    }

                    if (parseFloat(style.opacity) < 0.1) {
                        issues.push({ type: 'low_opacity', tag: el.tagName, class: el.className, opacity: style.opacity, text: text.slice(0, 40) });
                        invisibleCount++;
                        return;
                    }

                    // 2. Check dimensions and position
                    const rect = el.getBoundingClientRect();
                    if (rect.width === 0 && rect.height === 0 && style.display !== 'inline') {
                        issues.push({ type: 'zero_dimension', tag: el.tagName, class: el.className, text: text.slice(0, 40) });
                    }

                    // 3. Check color contrast against effective background
                    const textColor = parseRgb(style.color);
                    const bgColor = parseRgb(getEffectiveBg(el));

                    if (textColor && bgColor) {
                        // Check if identical or near-identical
                        const diff = Math.abs(textColor[0] - bgColor[0]) + Math.abs(textColor[1] - bgColor[1]) + Math.abs(textColor[2] - bgColor[2]);
                        if (diff < 30) {
                            issues.push({
                                type: 'near_identical_color_and_bg',
                                tag: el.tagName,
                                class: el.className,
                                color: style.color,
                                bgColor: getEffectiveBg(el),
                                text: text.slice(0, 40)
                            });
                            lowContrastCount++;
                        }
                    }
                });

                // Also check if any element covers the whole screen or sections
                const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
                    const style = window.getComputedStyle(el);
                    return style.position === 'fixed' || style.position === 'absolute';
                }).map(el => {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    return {
                        tag: el.tagName,
                        id: el.id,
                        class: el.className,
                        position: style.position,
                        zIndex: style.zIndex,
                        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
                    };
                });

                return {
                    totalAudited: allElements.length,
                    invisibleCount,
                    lowContrastCount,
                    hiddenByDisplayCount,
                    issues: issues.slice(0, 20),
                    fixedElements: fixedElements.filter(f => f.rect.width > 200 && f.rect.height > 200)
                };
            })()
        `);

        console.log('Audit Results:', JSON.stringify(auditResult, null, 2));

    } catch (err) {
        console.error('Audit Error:', err);
    } finally {
        if (client) client.close();
        chromeProcess.kill();
        devServerProcess.kill();
    }
}

run();

