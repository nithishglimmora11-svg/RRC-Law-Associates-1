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

def audit_file(fname):
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    print(f"==================================================")
    print(f"FILE: {fname}")
    print(f"==================================================")

    # Stylesheets
    css_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', html)
    print(f"--- Stylesheets ({len(css_links)}) ---")
    for link in css_links:
        href_m = re.search(r'href=["\']([^"\']+)["\']', link)
        if href_m:
            href = href_m.group(1)
            print(f"  {href}")

    # Favicon / Icons
    icon_links = re.findall(r'<link[^>]+rel=["\'](?:icon|shortcut icon|apple-touch-icon|manifest)["\'][^>]*>', html)
    print(f"--- Icons/Manifest ({len(icon_links)}) ---")
    for link in icon_links:
        href_m = re.search(r'href=["\']([^"\']+)["\']', link)
        if href_m:
            print(f"  {href_m.group(1)}")

    # Images
    img_tags = re.findall(r'<img[^>]+>', html)
    print(f"--- Images ({len(img_tags)}) ---")
    for img in img_tags:
        src_m = re.search(r'src=["\']([^"\']+)["\']', img)
        alt_m = re.search(r'alt=["\']([^"\']+)["\']', img)
        cls_m = re.search(r'class=["\']([^"\']+)["\']', img)
        src = src_m.group(1) if src_m else 'NO_SRC'
        alt = alt_m.group(1) if alt_m else 'NO_ALT'
        cls = cls_m.group(1) if cls_m else 'NO_CLASS'
        exists = os.path.exists(src.split('?')[0].lstrip('/'))
        print(f"  src='{src}' class='{cls}' alt='{alt}' exists={exists}")

    # Scripts
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\'][^>]*>', html)
    print(f"--- Scripts ({len(scripts)}) ---")
    for s in scripts:
        print(f"  {s}")

    # Topbar check
    has_topbar = 'class="rrc-topbar"' in html
    print(f"--- Topbar present: {has_topbar} ---")

    # Header check
    has_header = '<header class="header">' in html or '<header class="header' in html
    print(f"--- Header present: {has_header} ---")

for f in files:
    audit_file(f)
