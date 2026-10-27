import re

files = [
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-application-documents.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html',
    'oci-card-eligibility-legal-status.html',
    'oci-card-renewal-passport-update.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'oci-for-children-born-abroad.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-vs-nri-vs-indian-citizen.html'
]

for fn in files:
    c = open(fn, encoding='utf-8').read()
    lines = c.splitlines()
    print(f'=== {fn} ===')
    for i, line in enumerate(lines, 1):
        if re.search(r'\b\d+\s*min(?:\s*read)?\b', line, re.IGNORECASE):
            # print surrounding 5 lines
            for j in range(max(0, i - 3), min(len(lines), i + 3)):
                print(f'  L{j+1}: {lines[j]}')
            print()
