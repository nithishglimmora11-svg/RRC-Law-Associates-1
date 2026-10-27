import re

with open('oci-card-eligibility-legal-status.html', 'r', encoding='utf-8') as f:
    html = f.read()

anchors = re.findall(r'href="(#[a-zA-Z0-9_\-]+)"', html)
ids = set(re.findall(r'id="([a-zA-Z0-9_\-]+)"', html))

print(f"Total internal hash anchors: {len(anchors)}")
print(f"Total defined IDs: {len(ids)}")

missing_ids = []
for a in set(anchors):
    target = a[1:]
    if target not in ids:
        missing_ids.append(a)

if missing_ids:
    print(f"FAILED: Anchors missing targets: {missing_ids}")
else:
    print("SUCCESS: All internal jump anchors match existing section IDs!")
