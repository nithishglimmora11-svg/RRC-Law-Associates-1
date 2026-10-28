with open('core-practice-areas.html', encoding='utf-8') as f:
    text = f.read()

import re
cards = re.findall(r'<div class="col-lg-6 mb-4">.*?</div>\s*</div>\s*</div>', text, re.S)
print(f"Total cards in core-practice-areas: {len(cards)}")
for c in cards:
    h = re.search(r'<h3[^>]*>(.*?)</h3>', c, re.S)
    a = re.search(r'<a[^>]*href=["\']([^"\']+)["\']', c, re.S)
    print("  Link:", a.group(1) if a else "No link", "| Title:", h.group(1).strip() if h else "No H3")

