import sys, re
sys.path.append('scratch')
from test_transform import transform_html, OCI_SLUGS

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

all_clean = True
for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        orig = f.read()

    new_html = transform_html(orig, fname)
    
    rem_src = [s for s in re.findall(r'\bsrc=["\']([^"\']+)["\']', new_html) if not s.startswith(('http', '/', 'data:', 'mailto:', 'tel:'))]
    rem_link = [h for h in re.findall(r'<link\s+[^>]*href=["\']([^"\']+)["\']', new_html) if not h.startswith(('http', '/', '#', 'mailto:', 'tel:'))]
    rem_a = [h for h in re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', new_html) if not h.startswith(('http', '/', '#', 'mailto:', 'tel:'))]

    if rem_src or rem_link or rem_a:
        all_clean = False
        print(f"FAILED CLEAN CHECK for {fname}:")
        if rem_src: print(f"  rem_src: {rem_src}")
        if rem_link: print(f"  rem_link: {rem_link}")
        if rem_a: print(f"  rem_a: {rem_a}")
    else:
        print(f"{fname}: PERFECT! 0 remaining relative references.")

print("\nALL 14 FILES CLEAN?", all_clean)
