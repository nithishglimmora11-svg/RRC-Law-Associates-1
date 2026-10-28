import re
import os

with open('partners.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("=== SEO METADATA ===")
titles = re.findall(r'<title>(.*?)</title>', text, re.DOTALL)
print("Title:", titles[0].strip() if titles else "None")

descs = re.findall(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', text, re.IGNORECASE)
print("Description:", descs[0].strip() if descs else "None")

canonicals = re.findall(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', text, re.IGNORECASE)
print("Canonical:", canonicals[0].strip() if canonicals else "None")

schemas = re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', text, re.DOTALL | re.IGNORECASE)
print("JSON-LD schemas count:", len(schemas))
for i, s in enumerate(schemas):
    print(f"Schema {i+1}:", s.strip()[:100], "...")

print("\n=== INTERNAL LINKS IN PARTNERS.HTML ===")
links = re.findall(r'href=["\'](.*?)["\']', text)
internal_links = [l for l in links if not l.startswith('http') and not l.startswith('#') and not l.startswith('mailto:') and not l.startswith('tel:')]
unique_internal = sorted(set(internal_links))
print(f"Total internal links: {len(internal_links)}, Unique: {len(unique_internal)}")
for l in unique_internal[:20]:
    print("  ", l)

print("\n=== EXTERNAL & SOCIAL LINKS ===")
external_links = [l for l in links if l.startswith('http')]
for l in sorted(set(external_links))[:15]:
    print("  ", l)

