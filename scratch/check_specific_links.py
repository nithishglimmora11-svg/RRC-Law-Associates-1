import re

for fname in ['oci-card-eligibility-legal-status.html', 'oci-card-application-documents.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r'<a\s+[^>]*href=["\'](/[^"\']+)["\'][^>]*>(.*?)</a>'
    print(f"=== {fname} ===")
    for m in re.finditer(pattern, content, re.DOTALL):
        href = m.group(1)
        if any(s in href for s in ['oci', 'nri-oci', 'legal-guide']):
            print(f"  {href:55} | text: {re.sub(r'<[^>]+>', '', m.group(2)).strip()[:35]}")
