with open('nri-landlord-tenant-eviction.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.findall(r'(html,\s*body\s*\{[^}]+\}|body\s*\{[^}]+\})', text)
for rule in m[:5]:
    print(rule)

