with open('property-law.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.findall(r'<p class="pub-description">(.*?)</p>', text, re.S)
for idx, p in enumerate(m[:4]):
    print(f"Card {idx+1}: {p.strip()[:200]}...")

