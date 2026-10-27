import re

with open('oci-legal-guides.html', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'data-category="([^"]+)"', text)
print('matches with data-category:', len(matches))
for m in matches:
    print('  category:', m)

# Find first occurrence of data-category="cat-5"
pos = text.find('data-category="cat-5"')
if pos != -1:
    print("\n--- Card around cat-5 ---")
    print(text[pos-200:pos+1500])
