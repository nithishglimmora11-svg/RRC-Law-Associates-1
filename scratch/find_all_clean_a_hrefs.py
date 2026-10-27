import re

FILES = [
    'oci-card-assistance.html',
    'oci-legal-guides.html',
    'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
    'oci-card-indian-ancestry-assistance.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html'
]

all_clean_urls = set()
for fname in FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find all a href
    for m in re.finditer(r'<a\s+[^>]*href=["\']([^"\']+)["\']', content):
        href = m.group(1)
        if href.startswith('/') and not href.endswith(('.html', '.png', '.jpg', '.jpeg', '.css', '.js')) and href not in ('/', '/#contact'):
            all_clean_urls.add((href, fname))

print("All non-file root-relative hrefs found in <a> tags:")
for h, f in sorted(all_clean_urls):
    print(f"  {h:55} in {f}")
