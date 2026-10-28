with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    text = f.read()

import re
lines = text.splitlines()
print("litigation-dispute-resolution lines:", len(lines))
for idx, line in enumerate(lines):
    if '<main' in line or '</main>' in line or '<h1' in line or '<h2' in line or 'Debt Recovery' in line:
        print(f"{idx+1}: {line.strip()[:100]}")

