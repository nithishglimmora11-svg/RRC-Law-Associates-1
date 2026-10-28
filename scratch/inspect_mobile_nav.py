with open('index.html', encoding='utf-8') as f:
    text = f.read()

import re
mobile = re.search(r'<div[^>]*id=["\']mobileMenu["\'][^>]*>.*?</div>\s*</div>', text, re.S)
if mobile:
    content = mobile.group(0).encode('ascii', errors='replace').decode('ascii')
    print("=== MOBILE MENU IN index.html ===")
    print(content)

