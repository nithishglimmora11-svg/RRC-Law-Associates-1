with open('nri-property-disputes.html', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'<section[^>]*hero', text, re.I)]
print("Hero matches:", matches)
for m in matches:
    print(text[m:m+400])

