import os
import re
import xml.etree.ElementTree as ET

articles = [
    ('oci-card-eligibility-legal-status', 'oci-card-eligibility-legal-status.html'),
    ('oci-vs-nri-vs-indian-citizen', 'oci-vs-nri-vs-indian-citizen.html'),
    ('oci-card-application-documents', 'oci-card-application-documents.html'),
    ('oci-foreign-spouse-eligibility', 'oci-foreign-spouse-eligibility.html'),
    ('oci-for-children-born-abroad', 'oci-for-children-born-abroad.html'),
    ('oci-card-benefits-restrictions-india', 'oci-card-benefits-restrictions-india.html'),
    ('oci-cardholders-inherit-sell-ancestral-property-india', 'oci-cardholders-inherit-sell-ancestral-property-india.html'),
    ('nri-oci-property-due-diligence-india', 'nri-oci-property-due-diligence-india.html'),
    ('nri-oci-property-tax-india', 'nri-oci-property-tax-india.html'),
    ('oci-card-renewal-passport-update', 'oci-card-renewal-passport-update.html'),
    ('oci-card-cancellation-grounds-remedies', 'oci-card-cancellation-grounds-remedies.html'),
    ('oci-card-cancellation-section-7d-legal-remedies', 'oci-card-cancellation-section-7d-legal-remedies.html'),
    ('oci-card-assistance', 'oci-card-assistance.html'),
    ('oci-card-indian-ancestry-assistance', 'oci-card-indian-ancestry-assistance.html'),
    ('oci-legal-guides', 'oci-legal-guides.html')
]

print("=" * 80)
print("TECHNICAL SEO & LINK AUDIT")
print("=" * 80)

# 1. Sitemap check
sitemap_text = open("sitemap.xml", encoding="utf-8").read()
print("1. Sitemap.xml Entries Check:")
for slug, html_fn in articles:
    in_sitemap = f"https://rrclawassociates.com/{slug}/" in sitemap_text or f"https://rrclawassociates.com/{html_fn}" in sitemap_text
    print(f"   [{'PASS' if in_sitemap else 'MISSING'}] {slug}")

# 2. .htaccess RewriteRule check
htaccess_text = open(".htaccess", encoding="utf-8").read()
print("\n2. .htaccess RewriteRules Check:")
for slug, html_fn in articles:
    # check rewrite rule for slug -> html
    has_rule = re.search(rf'RewriteRule\s+\^{slug}/\?\$\s+{html_fn}', htaccess_text, re.IGNORECASE) is not None
    # service pages might have their own rule or exist as static files
    print(f"   [{'PASS' if has_rule else 'INFO/STATIC'}] {slug} -> {html_fn}")

# 3. Directory fallback check
print("\n3. Directory Fallback index.html Check:")
for slug, html_fn in articles:
    dir_idx = os.path.join(slug, "index.html")
    exists = os.path.exists(dir_idx)
    print(f"   [{'PASS' if exists else 'NONE'}] {dir_idx}")

# 4. Check internal links in all OCI articles
print("\n4. Internal Link Resolution Check:")
all_pass = True
for slug, html_fn in articles:
    c = open(html_fn, encoding="utf-8").read()
    links = re.findall(r'href=["\']([^"\'#]+)["\']', c)
    broken = []
    for l in set(links):
        if l.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:')):
            continue
        # clean query params
        path = l.split('?')[0].strip('/')
        if not path:
            continue
        # check if path or path.html exists
        if not os.path.exists(path) and not os.path.exists(path + '.html') and not os.path.exists(os.path.join(path, 'index.html')):
            broken.append(l)
    if broken:
        print(f"   [FAIL] {html_fn} has broken links: {broken}")
        all_pass = False
    else:
        print(f"   [PASS] {html_fn}: All internal links resolve cleanly")

print("=" * 80)
