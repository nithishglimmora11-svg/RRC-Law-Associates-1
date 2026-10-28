with open('property-law.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.findall(r'<div class="litigation-row-card.*?</div>\s*</div>\s*</div>', text, re.S)
print(f"Total row cards in property-law: {len(m)}")
for card in m[:4]:
    h = re.search(r'<h3[^>]*>(.*?)</h3>', card)
    print("  ", h.group(1) if h else "No H3")

