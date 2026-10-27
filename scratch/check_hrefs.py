import os
import re

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

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    a_hrefs = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html, re.I)
    
    # Categorize hrefs
    relative_page_links = []
    for href in a_hrefs:
        if href.startswith('#') or href.startswith('tel:') or href.startswith('mailto:') or href.startswith('http'):
            continue
        if href.startswith('/'):
            continue
        relative_page_links.append(href)
        
    print(f"{fname}: {len(relative_page_links)} relative hrefs: {set(relative_page_links)}")
