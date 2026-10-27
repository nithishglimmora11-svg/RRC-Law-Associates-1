import os
import re

with open('oci-card-eligibility-legal-status.html', 'r', encoding='utf-8') as f:
    html = f.read()

hrefs = re.findall(r'href=["\']([^"\']+)["\']', html)
srcs = re.findall(r'src=["\']([^"\']+)["\']', html)

print(f"Total hrefs: {len(hrefs)}")
print(f"Total srcs: {len(srcs)}")

broken_links = []
for h in hrefs:
    if h.startswith('#') or h.startswith('mailto:') or h.startswith('tel:') or h.startswith('http'):
        continue
    path = h.split('#')[0].split('?')[0]
    if not path:
        continue
    if path.startswith('./'):
        path = path[2:]
    if not os.path.exists(path):
        broken_links.append(h)

broken_images = []
for s in srcs:
    if s.startswith('http'):
        continue
    path = s.split('#')[0].split('?')[0]
    if path.startswith('./'):
        path = path[2:]
    if not os.path.exists(path):
        broken_images.append(s)

print(f"Broken links: {broken_links}")
print(f"Broken images: {broken_images}")
