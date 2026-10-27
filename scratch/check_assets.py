import os
import re
from urllib.parse import urlparse

with open('oci-card-application-documents.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all href and src
hrefs = re.findall(r'href=["\']([^"\']+)["\']', html)
srcs = re.findall(r'src=["\']([^"\']+)["\']', html)

print(f"Total hrefs: {len(hrefs)}")
print(f"Total srcs: {len(srcs)}")

# Check local links
broken_links = []
for h in hrefs:
    # Ignore anchors, external http(s), mailto, tel
    if h.startswith('#') or h.startswith('mailto:') or h.startswith('tel:') or h.startswith('http'):
        continue
    # Clean query / hash
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
