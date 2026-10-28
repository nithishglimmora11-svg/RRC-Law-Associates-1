with open('sitemap.xml', encoding='utf-8') as f:
    text = f.read()

import re
locs = re.findall(r'<loc>(.*?)</loc>', text)
print(f"Total URLs in sitemap.xml: {len(locs)}")
for l in locs[:10]:
    print(" ", l)

