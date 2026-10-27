import re
import os

ARTICLES = [
    'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
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

pattern = r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>'

for art in ARTICLES:
    with open(art, 'r', encoding='utf-8') as f:
        text = f.read()
    
    matches = re.findall(pattern, text, re.DOTALL)
    print(f"\n==================== {art} ====================")
    clean_url_links = []
    for href, inner in matches:
        clean_inner = re.sub(r'<[^>]+>', '', inner).strip()
        if href.startswith('/') and href.endswith('/') and href != '/':
            clean_url_links.append((href, clean_inner))
    print(f"Total clean URL links with trailing slash: {len(clean_url_links)}")
    for h, txt in clean_url_links:
        print(f"  {h:55} | text: {txt[:40]}")
