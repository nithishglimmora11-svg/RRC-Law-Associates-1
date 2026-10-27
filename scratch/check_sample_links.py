import re

def check_links_in_page(fname):
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    print(f"=== {fname} LINKS ===")
    all_links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html)
    print("Sample links:", all_links[:20])

check_links_in_page('partners.html')
check_links_in_page('oci-card-assistance.html')
check_links_in_page('index.html')
