import re

with open('oci-card-assistance.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("=== ALL RELATIVE ATTRIBUTES IN oci-card-assistance.html ===")
for i, line in enumerate(lines, 1):
    # hrefs
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', line)
    for h in hrefs:
        if not h.startswith(('http', '/', '#', 'mailto:', 'tel:')):
            print(f"Line {i} [HREF]: {h}  --> Full line: {line.strip()[:100]}")

    # srcs
    srcs = re.findall(r'src=["\']([^"\']+)["\']', line)
    for s in srcs:
        if not s.startswith(('http', '/', 'data:', 'mailto:', 'tel:')):
            print(f"Line {i} [SRC]: {s}  --> Full line: {line.strip()[:100]}")
