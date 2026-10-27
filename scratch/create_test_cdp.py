import subprocess
import time
import urllib.request
import json
import websocket # if available or let's check

# Let's test if we can run node with CDP or simple fetch
code = """
const http = require('http');

// We can launch edge with remote debugging port
const { spawn } = require('child_process');
const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';

const browser = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9222',
  '--window-size=390,844',
  'http://localhost:8080/oci-card-eligibility-legal-status.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    console.log('Tabs:', tabs.map(t => ({ title: t.title, url: t.url, ws: t.webSocketDebuggerUrl })));
  } catch (err) {
    console.error('Error connecting to CDP:', err);
  } finally {
    browser.kill();
  }
}, 2000);
"""

with open('scratch/test_cdp.js', 'w') as f:
    f.write(code)
print("Wrote scratch/test_cdp.js")
