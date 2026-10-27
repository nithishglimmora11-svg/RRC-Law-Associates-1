import re
import os

FILES_TO_CHECK = [
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

print("=== CHECKING FILES EXISTENCE ===")
for fname in FILES_TO_CHECK:
    print(f"{fname}: {'EXISTS' if os.path.exists(fname) else 'MISSING'}")

print("\n=== AUDITING INTERNAL LINKS IN EACH FILE ===")
for fname in FILES_TO_CHECK:
    if not os.path.exists(fname):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all hrefs
    hrefs = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', content)
    
    # Filter for OCI / guide related links or clean URLs
    oci_links = []
    clean_urls = []
    for h in hrefs:
        if any(term in h for term in ['oci', 'legal-guides']):
            oci_links.append(h)
        elif h.startswith('/') and not h.endswith(('.html', '.png', '.jpg', '.jpeg', '.css', '.js', '.webmanifest')) and h not in ('/', '/#contact'):
            clean_urls.append(h)
            
    print(f"\n--- {fname} ---")
    print(f"Total links: {len(hrefs)}")
    # Find specific patterns
    explore_guides = [h for h in hrefs if 'oci-legal-guides' in h]
    print(f"  Links to OCI Legal Guides hub: {set(explore_guides)}")
    
    # Find all clean URLs (ending with /)
    slash_clean = [h for h in set(hrefs) if h.endswith('/') and h != '/']
    print(f"  Clean URLs with trailing slash ({len(slash_clean)}): {slash_clean}")
