import re
import os

files = [
    'index.html',
    'oci-card-application-documents.html',
    'oci-card-eligibility-legal-status.html',
    'oci-legal-guides.html',
    'oci-card-assistance.html',
    'oci-card-indian-ancestry-assistance.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html'
]

for fn in files:
    if not os.path.exists(fn):
        continue
    c = open(fn, encoding='utf-8').read()
    print(f'=== {fn} ===')
    
    # Check stylesheets linked
    css_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', c)
    print('  Stylesheets:', [re.search(r'href=["\']([^"\']+)["\']', l).group(1) for l in css_links if re.search(r'href=["\']([^"\']+)["\']', l)])
    
    # Check header element
    header_m = re.search(r'(<header[^>]*>.*?</header>)', c, re.DOTALL)
    if header_m:
        h_text = header_m.group(1)
        # Find logo tag inside header
        logo_m = re.search(r'(<a[^>]*>\s*<img[^>]*>\s*</a>|<div class="logo"[^>]*>.*?</div>)', h_text, re.DOTALL)
        if logo_m:
            print('  Logo container:', logo_m.group(0).strip()[:180].replace('\n', ' '))
    
    # Check embedded CSS for logo or header
    rules = re.findall(r'(\.[a-zA-Z0-9_\-]*logo[a-zA-Z0-9_\-]*\s*\{[^}]+\})', c, re.IGNORECASE)
    for r in rules:
        print('  Embedded logo rule:', r.strip().replace('\n', ' ')[:140])
    header_rules = re.findall(r'(\.header\s*\{[^}]+\})', c, re.IGNORECASE)
    for r in header_rules:
        print('  Embedded header rule:', r.strip().replace('\n', ' ')[:140])
    print()
