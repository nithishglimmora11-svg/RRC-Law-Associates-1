import re

pages = ['index.html', 'booking.html', 'nri-landlord-tenant-eviction.html', 'nri-business-commercial-advisory.html']

for page in pages:
    try:
        with open(page, 'r', encoding='utf-8', errors='ignore') as f:
            c = f.read()
        forms = re.findall(r'<form[\s\S]*?</form>', c, re.I)
        print(f"=== {page} ({len(forms)} forms) ===")
        for f in forms:
            if 'web3forms' in f:
                ak = re.findall(r'name=["\']access_key["\'][^>]*value=["\']([^"\']+)["\']', f)
                sub = re.findall(r'name=["\']subject["\'][^>]*value=["\']([^"\']+)["\']', f)
                fn = re.findall(r'name=["\']from_name["\'][^>]*value=["\']([^"\']+)["\']', f)
                redir = re.findall(r'name=["\']redirect["\'][^>]*value=["\']([^"\']+)["\']', f)
                ak_red = [k[:4] + '-****-****-****-********' + k[-4:] for k in ak]
                print(f"  Access Key: {ak_red}")
                print(f"  Subject: {sub}")
                print(f"  From Name: {fn}")
                print(f"  Redirect: {redir}")
    except Exception as e:
        print(f"Error {page}: {e}")

