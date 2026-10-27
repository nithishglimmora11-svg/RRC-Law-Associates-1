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

print("=== AUDIT OF 14 OCI PAGES ===")
for fname in files:
    if not os.path.exists(fname):
        print(f"MISSING FILE: {fname}")
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    has_topbar = 'class="rrc-topbar"' in html or "class='rrc-topbar'" in html
    base_tag = re.findall(r'<base[^>]+>', html, re.I)
    topbar_css = re.findall(r'<link[^>]+topbar\.css[^>]*>', html)
    style_css = re.findall(r'<link[^>]+style\.css[^>]*>', html)
    style2_css = re.findall(r'<link[^>]+style2\.css[^>]*>', html)
    
    logo_imgs = re.findall(r'<img[^>]+logo-img[^>]*>', html, re.I)
    all_imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.I)
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html, re.I)

    print(f"\n--- {fname} ---")
    print(f"has_topbar: {has_topbar}")
    print(f"base_tag: {base_tag}")
    print(f"topbar_css: {topbar_css}")
    print(f"style_css: {style_css}")
    print(f"style2_css: {style2_css}")
    print(f"logo_img: {logo_imgs}")
    print(f"total imgs: {len(all_imgs)}")
    for img in all_imgs:
        clean_path = img.split('?')[0].lstrip('/')
        exists = os.path.exists(clean_path)
        print(f"  img: src='{img}' -> root path exists: {exists}")
    for s in scripts:
        if not s.startswith('http'):
            clean_path = s.split('?')[0].lstrip('/')
            exists = os.path.exists(clean_path)
            print(f"  script: src='{s}' -> root path exists: {exists}")
