import re
import os

with open('partners.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("=== 1. DUPLICATE ID CHECK ===")
ids = re.findall(r'\sid=["\'](.*?)["\']', html)
import collections
counts = collections.Counter(ids)
dups = {k: v for k, v in counts.items() if v > 1}
if dups:
    print("FAIL: Duplicate IDs found:", dups)
else:
    print("PASS: No duplicate IDs found. Total unique IDs:", len(set(ids)))

print("\n=== 2. ASSET EXISTENCE CHECK ===")
# Check images
img_srcs = re.findall(r'<img[^>]+src=["\'](.*?)["\']', html)
for src in img_srcs:
    clean_src = src.split('?')[0]
    exists = os.path.exists(clean_src)
    print(f"Img: {clean_src} -> {'EXISTS' if exists else 'MISSING'}")

# Check CSS url() backgrounds
bg_urls = re.findall(r'url\(["\']?(.*?)["\']?\)', html)
for url in bg_urls:
    if not url.startswith('http') and not url.startswith('data:'):
        clean_url = url.split('?')[0]
        exists = os.path.exists(clean_url)
        print(f"CSS BG: {clean_url} -> {'EXISTS' if exists else 'MISSING'}")

print("\n=== 3. INTERNAL LINK CHECK ===")
links = re.findall(r'href=["\'](.*?)["\']', html)
internal_links = [l for l in links if not l.startswith('http') and not l.startswith('#') and not l.startswith('mailto:') and not l.startswith('tel:') and not l.startswith('javascript:')]
missing_links = []
for l in sorted(set(internal_links)):
    clean_l = l.split('?')[0].split('#')[0]
    if clean_l.startswith('./'):
        clean_l = clean_l[2:]
    if clean_l.startswith('/'):
        clean_l = clean_l[1:]
    # Check if file exists as clean_l or clean_l.html or clean_l/index.html
    found = False
    candidates = [clean_l, clean_l + '.html', clean_l.rstrip('/') + '.html', os.path.join(clean_l, 'index.html')]
    for c in candidates:
        if os.path.exists(c):
            found = True
            break
    if not found:
        missing_links.append(l)

if missing_links:
    print("FAIL: Missing internal links:", missing_links)
else:
    print(f"PASS: All {len(set(internal_links))} internal links resolve to existing files.")

print("\n=== 4. SEO & CANONICAL CHECK ===")
print("Canonical:", re.findall(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', html))
print("Title:", re.findall(r'<title>(.*?)</title>', html))
print("Schema.org present:", '<script type="application/ld+json">' in html)

print("\n=== 5. FORM ATTRIBUTES CHECK ===")
print("Web3Forms token present:", '070a477f-e139-4bcf-838c-49abddcc0959' in html)
print("Form has novalidate:", 'novalidate' in html)
print("Submit endpoint:", 'https://api.web3forms.com/submit' in html)

print("\n=== 6. PRESERVED PARTNER CONTENT CHECK ===")
required_strings = [
    "Chee & Partners",
    "Negeri Sembilan Hub",
    "1700-G, Jalan S2 A39, Aviva Green, Seremban 2",
    "Kuala Lumpur HQ",
    "S-26-13, Wisma YNH, Kiara 163",
    "S. Gunasegaran",
    "J. Chandrika",
    "Guna &amp; Chandrika Advocates &amp; Solicitors",
    "Suite 1409, 14th Floor, Johor Tower",
    "janggunaoffice@gmail.com",
    "+607-222 1599",
    "https://wa.me/919751182452"
]
all_preserved = True
for req in required_strings:
    if req in html:
        print(f"PASS: Found '{req}'")
    else:
        print(f"FAIL: Missing '{req}'")
        all_preserved = False

print("\nPreservation result:", "ALL PASSED" if all_preserved else "SOME FAILED")
