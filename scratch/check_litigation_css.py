with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'(\.litigation-row-card\s*\{.*?\n\s*\})', text, re.S)
if m:
    print(m.group(0))

m2 = re.search(r'(\.custom-faq-accordion.*?\n\s*\})', text, re.S)
if m2:
    print(m2.group(0))

