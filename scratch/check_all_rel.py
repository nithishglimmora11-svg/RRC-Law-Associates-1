import re

files = [
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

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find any src attribute that doesn't start with http, /, data:, mailto:, tel:
    all_src = re.findall(r'\bsrc=["\']([^"\']+)["\']', html)
    rel_src = [s for s in all_src if not s.startswith(('http', '/', 'data:', 'mailto:', 'tel:'))]
    if rel_src:
        print(f"{fname} rel_src:", rel_src)

    # Find any href in <link> that doesn't start with http, /
    link_hrefs = re.findall(r'<link\s+[^>]*href=["\']([^"\']+)["\']', html)
    rel_link_hrefs = [h for h in link_hrefs if not h.startswith(('http', '/', '#', 'mailto:', 'tel:'))]
    if rel_link_hrefs:
        print(f"{fname} rel_link_hrefs:", rel_link_hrefs)
