import re

with open('oci-card-renewal-passport-update.html', 'r', encoding='utf-8') as f:
    html = f.read()

toc_matches = re.findall(r'<a href="#(section-[^"]+)">', html)
print(f"TOC links found: {len(toc_matches)}")
all_ids = set(re.findall(r'id="([^"]+)"', html))

all_ok = True
for m in toc_matches:
    found = m in all_ids
    print(f"Anchor #{m} -> exists: {found}")
    if not found:
        all_ok = False

if all_ok:
    print("ALL TOC ANCHORS RESOLVE PERFECTLY!")
else:
    print("SOME ANCHORS BROKEN!")
