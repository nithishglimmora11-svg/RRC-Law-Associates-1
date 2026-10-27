import urllib.request

pages = [
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
    'oci-card-eligibility-legal-status.html',
    'oci-card-assistance.html',
    'oci-legal-guides.html',
    'lawfirm-blog.html',
    'index.html',
]

all_ok = True
for p in pages:
    try:
        url = 'http://localhost:8080/' + p
        req = urllib.request.urlopen(url, timeout=5)
        status = req.status
        ok = (status == 200)
    except Exception as e:
        status = str(e)
        ok = False
    if not ok:
        all_ok = False
    label = 'OK' if ok else 'FAIL'
    print(f'[{label}] {p} -> {status}')

print()
print('ALL OK' if all_ok else 'SOME FAILURES')
