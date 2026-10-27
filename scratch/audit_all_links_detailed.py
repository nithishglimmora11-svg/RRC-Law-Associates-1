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

# Slugs mapping to html files
SLUG_TO_HTML = {
    'oci-legal-guides': 'oci-legal-guides.html',
    'oci-card-eligibility-legal-status': 'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen': 'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents': 'oci-card-application-documents.html',
    'oci-card-indian-ancestry-assistance': 'oci-card-indian-ancestry-assistance.html',
    'oci-foreign-spouse-eligibility': 'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad': 'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india': 'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india': 'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india': 'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india': 'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update': 'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies': 'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies': 'oci-card-cancellation-section-7d-legal-remedies.html',
}

# Verify all target HTML files exist
print("=== VERIFYING TARGET HTML FILES EXISTENCE ===")
for slug, html_file in SLUG_TO_HTML.items():
    exists = os.path.exists(html_file)
    print(f"{html_file:55}: {'EXISTS' if exists else 'MISSING'}")

print("\n=== SCANNING FOR CLEAN URL ANCHOR LINKS ===")
total_clean_links_found = 0
file_matches = {}

for fname in FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to find <a ... href="/slug/" ...>
    # Note: we should NOT match <link rel="canonical" href="..."> or <meta property="og:url" content="...">
    pattern = r'<a\s+[^>]*href=["\'](/[^"\']+)["\'][^>]*>(.*?)</a>'
    matches = re.finditer(pattern, content, re.DOTALL)
    
    clean_in_file = []
    for m in matches:
        href = m.group(1)
        # Check if it matches /slug/
        for slug in SLUG_TO_HTML:
            if href == f"/{slug}/" or href == f"/{slug}":
                clean_in_file.append((href, slug, m.group(0)))
                total_clean_links_found += 1
                break
    
    file_matches[fname] = clean_in_file
    print(f"{fname:55}: {len(clean_in_file)} clean URL anchor links found")

print(f"\nTOTAL CLEAN URL ANCHOR LINKS TO CONVERT ACROSS ALL FILES: {total_clean_links_found}")
