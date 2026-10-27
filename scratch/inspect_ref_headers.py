import re

def inspect_nav(fname):
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    print(f"=== NAV IN {fname} ===")
    header_m = re.search(r'<header[^>]*>.*?</header>', html, re.DOTALL)
    if header_m:
        header_html = header_m.group(0)
        links = re.findall(r'href=["\']([^"\']+)["\']', header_html)
        imgs = re.findall(r'<img[^>]+>', header_html)
        print("Header links:", links)
        print("Header imgs:", imgs)
    else:
        print("No header found")

inspect_nav('partners.html')
inspect_nav('oci-card-assistance.html')
inspect_nav('index.html')
inspect_nav('booking.html')
