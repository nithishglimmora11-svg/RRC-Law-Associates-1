import re
import os
import difflib

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

def transform(html):
    new_html = html
    for slug in SLUGS:
        # Match href="/slug/" or href="/slug"
        new_html = re.sub(rf'href=["\']/{slug}/?["\']', f'href="/{slug}.html"', new_html)
    return new_html

total_changes = 0
for fname in FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    transformed = transform(orig)
    if orig != transformed:
        # Count replacements
        diff = list(difflib.unified_diff(orig.splitlines(), transformed.splitlines()))
        changes = len([l for l in diff if l.startswith('+ ') and not l.startswith('+++ ')])
        total_changes += changes
        print(f"{fname:55}: {changes} links changed")
        
        # Verify canonical URL was preserved
        orig_canon = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', orig)
        new_canon = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', transformed)
        if orig_canon and new_canon:
            assert orig_canon.group(1) == new_canon.group(1), f"CANONICAL CHANGED in {fname}!"
            
        # Verify og:url was preserved
        orig_og = re.search(r'<meta\s+property="og:url"\s+content="([^"]+)"', orig)
        new_og = re.search(r'<meta\s+property="og:url"\s+content="([^"]+)"', transformed)
        if orig_og and new_og:
            assert orig_og.group(1) == new_og.group(1), f"OG:URL CHANGED in {fname}!"
    else:
        print(f"{fname:55}: 0 links changed")

print(f"\nTotal links changed across all files: {total_changes}")
print("ALL CANONICAL AND OG:URL METADATA VERIFIED PRESERVED!")
