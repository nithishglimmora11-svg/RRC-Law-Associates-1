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

for fname in FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    rel = re.findall(r'<a\s+[^>]*href=["\'](?!\/|https?:\/\/|mailto:|tel:|#)([^"\']+)["\']', content)
    if rel:
        print(f"{fname}: {rel}")
print("Relative links check finished.")
