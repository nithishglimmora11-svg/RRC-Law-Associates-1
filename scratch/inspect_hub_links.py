import re

with open('oci-legal-guides.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all links in oci-legal-guides.html
pattern = r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>'
matches = re.findall(pattern, text, re.DOTALL)

print(f"Total <a> tags in oci-legal-guides.html: {len(matches)}")
guide_links = []
for href, inner in matches:
    clean_inner = re.sub(r'<[^>]+>', '', inner).strip()
    if any(k in href for k in ['oci', 'nri-oci', 'guide']) or 'read' in clean_inner.lower():
        print(f"href: {href:55} | text: {clean_inner[:40]}")
        guide_links.append((href, clean_inner))

print(f"\nTotal guide-related links: {len(guide_links)}")
