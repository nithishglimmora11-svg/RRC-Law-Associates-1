with open('property-law.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.findall(r'<p class="pub-description">(.*?)</p>', text, re.S)
if len(m) > 1:
    print(m[1].strip())

