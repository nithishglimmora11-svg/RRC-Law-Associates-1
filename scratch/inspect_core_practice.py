with open('core-practice-areas.html', encoding='utf-8') as f:
    text = f.read()

import re
headings = re.findall(r'<(h[123])[^>]*>(.*?)</\1>', text, re.S)
for h, t in headings:
    clean = re.sub(r'<[^>]+>', '', t).strip()
    print(f"  {h}: {clean[:60]}")

