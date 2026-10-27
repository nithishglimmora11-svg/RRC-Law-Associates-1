import re

with open('oci-card-application-documents.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>'
matches = re.finditer(pattern, text, re.DOTALL)

for m in matches:
    href = m.group(1)
    inner = re.sub(r'<[^>]+>', '', m.group(2)).strip()
    # print line number
    line_num = text[:m.start()].count('\n') + 1
    if any(k in href for k in ['oci', 'legal-guide', 'nri-oci']) or href.startswith('/'):
        print(f"Line {line_num:4d} | href: {href:55} | text: {inner[:35]}")
