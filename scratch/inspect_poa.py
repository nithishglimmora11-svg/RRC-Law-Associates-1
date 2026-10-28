with open('nri-power-of-attorney.html', encoding='utf-8') as f:
    text = f.read()

import re
# Print lines around the main content
lines = text.splitlines()
print("Total lines:", len(lines))
for idx, line in enumerate(lines):
    if '<main' in line or '</main>' in line or '<h2' in line or 'faq' in line.lower() or 'card' in line.lower() and idx < 450:
        print(f"{idx+1}: {line[:100]}")

