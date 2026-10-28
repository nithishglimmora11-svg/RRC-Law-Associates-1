with open('sectors.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

import re
m = re.findall(r'<div[^>]*mobile-menu[^>]*>[\s\S]*?</div>\s*</div>', c, re.I)
if m:
    with open('scratch/sectors_mobile.txt', 'w', encoding='utf-8') as out:
        out.write(m[0])
    print("Wrote sectors_mobile.txt")
else:
    print("No mobile-menu found in sectors.html")

