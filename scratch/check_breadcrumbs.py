import re

ARTICLES = [
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

print("=== CHECKING ALL BREADCRUMBS IN ALL 13 ARTICLES ===")
for art in ARTICLES:
    with open(art, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find any breadcrumb element
    bc_matches = re.findall(r'<(?P<tag>div|nav)\s+[^>]*class=["\'][^"\']*breadcrumb[^"\']*["\'][^>]*>(.*?)</(?P=tag)>', content, re.DOTALL | re.IGNORECASE)
    if bc_matches:
        for tag, inner in bc_matches:
            links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', inner)
            print(f"{art:55}: <{tag}> {links}")
    else:
        print(f"{art:55}: NO BREADCRUMB ELEMENT")
