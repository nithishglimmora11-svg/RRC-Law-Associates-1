import re

with open('partners.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("=== SCRIPT TAGS IN PARTNERS.HTML ===")
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
print(f"Total inline script blocks: {len(scripts)}")
for i, s in enumerate(scripts):
    first_line = [l.strip() for l in s.split('\n') if l.strip()][:2]
    print(f"Script block {i+1}: {' '.join(first_line)[:90]}")

print("\n=== EXTERNAL SCRIPTS ===")
srcs = re.findall(r'<script[^>]*src=["\'](.*?)["\']', text)
for src in srcs:
    print(" ", src)

print("\n=== MEDIA QUERIES IN STYLES ===")
mqs = re.findall(r'@media[^{]+\{', text)
print(f"Total media queries defined: {len(mqs)}")
for m in set(mqs):
    print(" ", m.strip())

print("\n=== IDs IN PARTNERS.HTML ===")
ids = re.findall(r'\sid=["\'](.*?)["\']', text)
print(f"Total IDs: {len(ids)}, Unique: {len(set(ids))}")
import collections
counts = collections.Counter(ids)
dups = {k: v for k, v in counts.items() if v > 1}
if dups:
    print("Duplicate IDs found!")
    for k, v in dups.items():
        print(f"  ID '{k}' appears {v} times")
else:
    print("No duplicate IDs found.")

