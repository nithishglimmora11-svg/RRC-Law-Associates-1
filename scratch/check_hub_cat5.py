import re

with open('oci-legal-guides.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Filter buttons
btns = re.findall(r'<button[^>]*class="[^"]*filter-btn[^"]*"[^>]*>.*?</button>', text, re.DOTALL)
print("Filter buttons:")
for b in btns:
    print(" ", re.sub(r'\s+', ' ', b))

# Cat 5 cards
cat5_blocks = re.findall(r'<div[^>]*data-category="cat-5"[^>]*>.*?</div>\s*</div>\s*</div>', text, re.DOTALL)
print(f"\nCat 5 cards count: {len(cat5_blocks)}")
for cb in cat5_blocks:
    title = re.search(r'<h3[^>]*>(.*?)</h3>', cb, re.DOTALL)
    if title:
        print("  Card title:", re.sub(r'\s+', ' ', title.group(1)).strip())
