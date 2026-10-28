with open('sitemap.xml', encoding='utf-8') as f:
    text = f.read()

import re
entries = re.findall(r'<url>\s*<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>', text)
for loc, lastmod in entries:
    if any(k in loc for k in ['litigation', 'power-of-attorney', 'property-disputes', 'cheque', 'due-diligence', 'property-law']):
        print(f"  {loc:60} | {lastmod}")

