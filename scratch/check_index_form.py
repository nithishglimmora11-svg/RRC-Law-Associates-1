with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.findall(r'<form[\s\S]*?</form>', text, re.I)
for f in m:
    if 'web3forms' in f:
        print(f[:800])

