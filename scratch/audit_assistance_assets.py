import re
import os

fname = 'oci-card-assistance.html'
with open(fname, 'r', encoding='utf-8') as f:
    content = f.read()

print("=== 1. LINK TAGS ===")
link_tags = re.findall(r'<link[^>]+>', content, re.I)
for tag in link_tags:
    href_m = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
    rel_m = re.search(r'rel=["\']([^"\']+)["\']', tag, re.I)
    if href_m:
        h = href_m.group(1)
        rel = rel_m.group(1) if rel_m else ''
        if not h.startswith('http'):
            clean = h.split('?')[0].lstrip('/')
            exists = os.path.exists(clean)
            is_root_rel = h.startswith('/')
            print(f"  rel='{rel}' href='{h}' -> root_relative={is_root_rel}, exists={exists}")

print("\n=== 2. IMG TAGS ===")
img_tags = re.findall(r'<img[^>]+>', content, re.I)
for tag in img_tags:
    src_m = re.search(r'src=["\']([^"\']+)["\']', tag, re.I)
    alt_m = re.search(r'alt=["\']([^"\']+)["\']', tag, re.I)
    if src_m:
        s = src_m.group(1)
        alt = alt_m.group(1) if alt_m else ''
        if not s.startswith('http'):
            clean = s.split('?')[0].lstrip('/')
            exists = os.path.exists(clean)
            is_root_rel = s.startswith('/')
            print(f"  src='{s}' alt='{alt}' -> root_relative={is_root_rel}, exists={exists}")

print("\n=== 3. VIDEO AND SOURCE TAGS ===")
video_tags = re.findall(r'<(?:video|source)[^>]+>', content, re.I)
for tag in video_tags:
    src_m = re.search(r'src=["\']([^"\']+)["\']', tag, re.I)
    poster_m = re.search(r'poster=["\']([^"\']+)["\']', tag, re.I)
    if src_m:
        s = src_m.group(1)
        if not s.startswith('http'):
            clean = s.split('?')[0].lstrip('/')
            exists = os.path.exists(clean)
            is_root_rel = s.startswith('/')
            print(f"  src='{s}' -> root_relative={is_root_rel}, exists={exists}")
    if poster_m:
        p = poster_m.group(1)
        if not p.startswith('http'):
            clean = p.split('?')[0].lstrip('/')
            exists = os.path.exists(clean)
            is_root_rel = p.startswith('/')
            print(f"  poster='{p}' -> root_relative={is_root_rel}, exists={exists}")

print("\n=== 4. SCRIPT TAGS ===")
script_tags = re.findall(r'<script[^>]+>', content, re.I)
for tag in script_tags:
    src_m = re.search(r'src=["\']([^"\']+)["\']', tag, re.I)
    if src_m:
        s = src_m.group(1)
        if not s.startswith('http'):
            clean = s.split('?')[0].lstrip('/')
            exists = os.path.exists(clean)
            is_root_rel = s.startswith('/')
            print(f"  src='{s}' -> root_relative={is_root_rel}, exists={exists}")

print("\n=== 5. CSS URL() REFERENCES ===")
urls = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', content, re.I)
for u in urls:
    if not u.startswith(('http', 'data:')):
        clean = u.split('?')[0].lstrip('/')
        exists = os.path.exists(clean)
        is_root_rel = u.startswith('/')
        print(f"  url='{u}' -> root_relative={is_root_rel}, exists={exists}")

print("\n=== 6. A HREF TAGS (relative internal page links) ===")
a_tags = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', content, re.I)
rel_a = [a for a in a_tags if not a.startswith(('http', '/', '#', 'mailto:', 'tel:'))]
for a in sorted(set(rel_a)):
    clean = a.split('?')[0].split('#')[0].lstrip('/')
    exists = os.path.exists(clean)
    print(f"  href='{a}' -> exists={exists}")
