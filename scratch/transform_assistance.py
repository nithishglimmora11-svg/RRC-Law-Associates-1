import re

with open('oci-card-assistance.html', 'r', encoding='utf-8') as f:
    orig = f.read()

html = orig

# 1. Favicon, Apple touch icon, manifest
html = re.sub(r'href="assets/images/logo\.png"', 'href="/assets/images/logo.png"', html)
html = re.sub(r'href="favicon\.ico"', 'href="/favicon.ico"', html)
html = re.sub(r'href="assets/images/apple-touch-icon\.png"', 'href="/assets/images/apple-touch-icon.png"', html)

# 2. Stylesheets
html = re.sub(r'href="style2\.css(\?[^"]*)?"', r'href="/style2.css\1"', html)
html = re.sub(r'href="style\.css(\?[^"]*)?"', r'href="/style.css\1"', html)
html = re.sub(r'href="topbar\.css(\?[^"]*)?"', r'href="/topbar.css\1"', html)
html = re.sub(r'href="oci-style\.css(\?[^"]*)?"', r'href="/oci-style.css\1"', html)

# 3. Header Logo & Images
html = re.sub(r'src="assets/images/', 'src="/assets/images/', html)

# 4. Hero Videos
html = re.sub(r'src="assets/videos/', 'src="/assets/videos/', html)

# 5. JavaScript
html = re.sub(r'src="script\.js(\?[^"]*)?"', r'src="/script.js\1"', html)
html = re.sub(r'src="script2\.js(\?[^"]*)?"', r'src="/script2.js\1"', html)

# 6. OCI Guide links to canonical clean URLs
OCI_SLUGS = [
    'oci-legal-guides',
    'oci-card-eligibility-legal-status',
    'oci-card-application-documents'
]
for slug in OCI_SLUGS:
    html = re.sub(rf'href=["\']{slug}\.html(["\'])', rf'href="/{slug}/\1', html)
    html = re.sub(rf'href=["\']\./{slug}\.html(["\'])', rf'href="/{slug}/\1', html)

# 7. Navigation and internal page links
html = re.sub(r'href=["\']index\.html#contact["\']', 'href="/#contact"', html)
html = re.sub(r'href=["\']index\.html["\']', 'href="/"', html)
html = re.sub(r'href=["\']\./index\.html["\']', 'href="/"', html)

SITE_PAGES = [
    'booking', 'partners', 'nri-services', 'core-practice-areas',
    'family-law', 'intellectual-property', 'employment-law',
    'white-collar-crime', 'property-law', 'cyber-law',
    'litigation-dispute-resolution', 'lawfirm-blog',
    'oci-card-assistance', 'nri-property-disputes', 'nri-power-of-attorney',
    'nri-criminal-case', 'nri-family-matrimonial'
]
for page in SITE_PAGES:
    html = re.sub(rf'href=["\'](?:\./)?{page}\.html(["\'])', rf'href="/{page}.html\1', html)

# Check remaining relative paths
rem_src = [s for s in re.findall(r'\bsrc=["\']([^"\']+)["\']', html) if not s.startswith(('http', '/', 'data:', 'mailto:', 'tel:'))]
rem_link = [h for h in re.findall(r'<link\s+[^>]*href=["\']([^"\']+)["\']', html) if not h.startswith(('http', '/', '#', 'mailto:', 'tel:'))]
rem_a = [h for h in re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html) if not h.startswith(('http', '/', '#', 'mailto:', 'tel:'))]

print("Remaining relative src:", rem_src)
print("Remaining relative link hrefs:", rem_link)
print("Remaining relative a hrefs:", rem_a)

with open('scratch/transformed_oci_card_assistance.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved transformed file to scratch/transformed_oci_card_assistance.html")
