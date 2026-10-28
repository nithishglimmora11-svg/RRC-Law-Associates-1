with open('sitemap.xml', encoding='utf-8') as f:
    text = f.read()

import re
locs = re.findall(r'<loc>(.*?)</loc>', text)
for l in locs:
    print(l)

