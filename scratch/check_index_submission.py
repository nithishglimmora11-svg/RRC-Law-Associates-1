with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script(?![^>]*src=)[^>]*>([\s\S]*?)</script>', text, re.I)
for s in scripts:
    if 'web3forms' in s or 'fetch(' in s or 'submit' in s:
        print("Found in index.html script:\n", s[:400])

with open('script.js', 'r', encoding='utf-8', errors='ignore') as f:
    sjs = f.read()
if 'web3forms' in sjs or 'access_key' in sjs:
    print("Found in script.js")
else:
    print("Not in script.js")

