const http = require('http');
const { execSync, spawn } = require('child_process');

async function getCDPPage() {
    // Check if Edge is running on 9222
    try {
        const list = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:9222/json/list', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });
        if (list && list.length > 0) return;
    } catch(e) {
        // Launch Edge
        console.log('Launching Edge on 9222...');
        const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        spawn(edgePath, [
            '--headless=new',
            '--remote-debugging-port=9222',
            '--disable-gpu',
            '--no-first-run',
            '--no-default-browser-check'
        ], { detached: true, stdio: 'ignore' }).unref();
        await new Promise(r => setTimeout(r, 1500));
    }
}

function cdpRequest(endpoint) {
    return new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:9222${endpoint}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

const WebSocket = require('ws'); // If ws not installed, we can use built-in or inspect via fetch/script

// Let's test if ws is available, otherwise we use simple script
