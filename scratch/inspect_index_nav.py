with open('index.html', encoding='utf-8') as f:
    text = f.read()

import re
header = re.search(r'<header[^>]*>.*?</header>', text, re.S)
if header:
    print("=== HEADER IN index.html ===")
    print(header.group(0))

mobile = re.search(r'<div[^>]*class=["\']mobile-menu["\'][^>]*>.*?</div>\s*</div>\s*</div>', text, re.S)
if not mobile:
    mobile = re.search(r'<div[^>]*id=["\']mobileMenu["\'][^>]*>.*?</div>\s*</div>', text, re.S)
if mobile:
    print("=== MOBILE MENU IN index.html ===")
    print(mobile.group(0)[:1500])

