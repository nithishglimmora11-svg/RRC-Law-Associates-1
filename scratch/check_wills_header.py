with open('wills-probate-estate-administration.html', encoding='utf-8') as f:
    text = f.read()

import re
header = re.search(r'<header[^>]*>.*?</header>', text, re.S)
if header:
    for line in header.group(0).splitlines()[:60]:
        print(line)

