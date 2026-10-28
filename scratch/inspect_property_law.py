with open('property-law.html', encoding='utf-8') as f:
    text = f.read()

import re
print("property-law lines:", len(text.splitlines()))
m = re.search(r'<head>.*?</head>', text, re.S)
if m:
    head = m.group(0)
    for line in head.splitlines()[:25]:
        print(line)

