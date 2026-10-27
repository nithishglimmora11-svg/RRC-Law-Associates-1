import urllib.request
import re

endpoints = [
    '/',
    '/oci-legal-guides.html',
    '/lawfirm-blog.html',
    '/oci-card-cancellation-section-7d-legal-remedies.html',
    '/oci-card-cancellation-section-7d-legal-remedies/',
    '/assets/images/oci-card-cancellation-section-7d-legal-remedies.jpg',
    '/oci-card-cancellation-grounds-remedies.html',
    '/oci-card-cancellation-grounds-remedies/',
    '/assets/images/oci-card-cancellation-grounds-remedies.jpg',
    '/oci-card-renewal-passport-update.html',
    '/nri-oci-property-tax-india.html',
    '/nri-oci-property-due-diligence-india.html',
    '/oci-cardholders-inherit-sell-ancestral-property-india.html',
    '/oci-card-benefits-restrictions-india.html',
    '/oci-for-children-born-abroad.html',
    '/oci-foreign-spouse-eligibility.html',
    '/oci-card-application-documents.html',
    '/oci-vs-nri-vs-indian-citizen.html',
    '/oci-card-eligibility-legal-status.html',
    '/sitemap.xml',
    '/.htaccess'
]

base_url = 'http://localhost:8080'
all_ok = True

print(f"{'Endpoint':<65} | {'Status':<6} | {'Bytes':<10} | {'Title / Note'}")
print("-" * 115)

for ep in endpoints:
    url = base_url + ep
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'TestClient/1.0'})
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read()
            length = len(body)
            
            title = ""
            if ep.endswith('.html') or ep.endswith('/') or ep == '/':
                match = re.search(r'<title>(.*?)</title>', body.decode('utf-8', errors='ignore'), re.IGNORECASE | re.DOTALL)
                if match:
                    title = match.group(1).strip().replace('\n', ' ')
                    if len(title) > 40:
                        title = title[:37] + '...'
            elif ep.endswith('.jpg'):
                title = "[JPEG Image OK]"
            elif ep.endswith('.xml'):
                title = "[XML Sitemap OK]"
            elif ep.endswith('.htaccess'):
                title = "[Config File OK]"

            print(f"{ep:<65} | {status:<6} | {length:<10} | {title}")
    except Exception as e:
        print(f"{ep:<65} | ERROR  | -          | {str(e)}")
        all_ok = False

if all_ok:
    print("\nALL ENDPOINTS RETURNED HTTP 200 OK!")
else:
    print("\nSOME ENDPOINTS FAILED!")
