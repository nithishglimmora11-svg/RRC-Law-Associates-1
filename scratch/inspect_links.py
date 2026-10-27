import re

def inspect(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    hrefs = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', text)
    print(f"=== {filename} ===")
    for h in sorted(set(hrefs)):
        if any(k in h.lower() for k in ['oci', 'guide', 'blog', 'booking']):
            print("  ", h)

inspect('oci-card-indian-ancestry-assistance.html')
