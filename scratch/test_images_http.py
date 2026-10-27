import urllib.request

urls = [
    'http://localhost:8080/assets/images/oci-foreign-spouse-eligibility.jpg',
    'http://localhost:8080/assets/images/oci-for-children-born-abroad.jpg',
    'http://localhost:8080/lawfirm-blog.html',
    'http://localhost:8080/oci-foreign-spouse-eligibility.html',
    'http://localhost:8080/oci-for-children-born-abroad.html',
    'http://localhost:8080/oci-legal-guides.html'
]

all_pass = True
for url in urls:
    try:
        resp = urllib.request.urlopen(url, timeout=5)
        length = resp.headers.get('Content-Length', 'unknown')
        print(f'{resp.status} OK: {url} ({length} bytes)')
    except Exception as e:
        print(f'FAIL: {url} -> {e}')
        all_pass = False

print('Overall status:', 'ALL PASS' if all_pass else 'FAILURES DETECTED')
