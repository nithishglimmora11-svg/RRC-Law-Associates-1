with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)
print(f"Total JSON-LD scripts: {len(scripts)}")
for s in scripts:
    print(s[:300])

