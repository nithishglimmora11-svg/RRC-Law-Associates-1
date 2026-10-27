import glob, re

for f in ['index.html', 'nri-services.html', 'oci-card-assistance.html', 'partners.html', 'booking.html']:
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', c)
    oci_links = [l for l in links if 'oci' in l]
    print(f"=== {f} OCI links ===")
    print(set(oci_links))
