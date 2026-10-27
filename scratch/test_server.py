import urllib.request

urls = [
    'http://localhost:8080/oci-card-eligibility-legal-status.html',
    'http://localhost:8080/oci-card-eligibility-legal-status/',
    'http://localhost:8080/oci-card-application-documents.html',
    'http://localhost:8080/oci-card-application-documents/',
    'http://localhost:8080/oci-legal-guides.html',
    'http://localhost:8080/lawfirm-blog.html'
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            print(f"{resp.status} OK: {url} (Length: {len(content)} bytes)")
    except Exception as e:
        print(f"FAILED {url}: {e}")
