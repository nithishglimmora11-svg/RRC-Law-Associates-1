import re
import os

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

SLUGS = [
    'oci-legal-guides',
    'oci-card-eligibility-legal-status',
    'oci-vs-nri-vs-indian-citizen',
    'oci-card-application-documents',
    'oci-card-indian-ancestry-assistance',
    'oci-foreign-spouse-eligibility',
    'oci-for-children-born-abroad',
    'oci-card-benefits-restrictions-india',
    'oci-cardholders-inherit-sell-ancestral-property-india',
    'nri-oci-property-due-diligence-india',
    'nri-oci-property-tax-india',
    'oci-card-renewal-passport-update',
    'oci-card-cancellation-grounds-remedies',
    'oci-card-cancellation-section-7d-legal-remedies'
]

def transform(content):
    new_content = content
    for slug in SLUGS:
        # Match href="/slug/" or href="/slug" exactly in quotes
        new_content = re.sub(rf'href=["\']/{slug}/?["\']', f'href="/{slug}.html"', new_content)
    return new_content

modified_files = []
for fname in FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    transformed = transform(orig)
    if orig != transformed:
        with open(fname, 'w', encoding='utf-8', newline='\n') as f:
            f.write(transformed)
        modified_files.append(fname)
        print(f"Updated: {fname}")
    else:
        print(f"No changes needed: {fname}")

print(f"\nTotal files updated: {len(modified_files)}")
