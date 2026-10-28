with open('nri-power-of-attorney.html', encoding='utf-8') as f:
    text = f.read()

import re
head = re.search(r'<head>.*?</head>', text, re.S)
if head:
    for line in head.group(0).splitlines()[:40]:
        print(line)

