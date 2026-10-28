with open('core-practice-areas.html', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<h3[^>]*>(.*?)</h3>', text)
for m in matches:
    print("H3:", m.strip())

