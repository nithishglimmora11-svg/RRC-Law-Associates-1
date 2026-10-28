import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.finditer(r'<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*>(.*?)</a>', text, re.DOTALL | re.I)
for m in matches:
    print('Match:')
    print(m.group(0))
    print('Line around:', text[:m.start()].count('\n') + 1)

