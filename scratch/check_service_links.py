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

print("=== CHECKING OCI CARD ASSISTANCE SERVICE LINK IN EACH ARTICLE ===")
for art in ARTICLES:
    with open(art, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'<a\s+[^>]*href=["\'](/oci-card-assistance\.html)["\'][^>]*>(.*?)</a>', content, re.DOTALL)
    print(f"{art:55}: {len(matches)} links to /oci-card-assistance.html")
    for href, text in matches:
        clean = re.sub(r'<[^>]+>', '', text).strip()
        print(f"    - {clean}")
