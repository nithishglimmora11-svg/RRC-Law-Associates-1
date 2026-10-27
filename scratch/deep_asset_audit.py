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

print("=== DEEP AUDIT OF ALL ASSET REFERENCES ACROSS 14 OCI PAGES ===")

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    print(f"\n==================================================")
    print(f"FILE: {fname}")
    print(f"==================================================")

    # 1. CSS background images
    bg_urls = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', html)
    print("CSS background URLs:", bg_urls)

    # 2. og:image and twitter:image
    og_imgs = re.findall(r'<meta[^>]+property=["\'](?:og:image|twitter:image)["\'][^>]+content=["\']([^"\']+)["\']', html)
    print("Meta images:", og_imgs)

    # 3. Icons
    icons = re.findall(r'<link[^>]+rel=["\'](?:icon|shortcut icon|apple-touch-icon|manifest)["\'][^>]+href=["\']([^"\']+)["\']', html)
    print("Icons:", icons)

    # 4. Stylesheets
    css = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', html)
    print("Stylesheets:", css)

    # 5. Images
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    print("Images count:", len(imgs))
    for src in imgs:
        clean = src.split('?')[0].lstrip('/')
        exists = os.path.exists(clean)
        if not src.startswith('/'):
            print(f"  RELATIVE IMG: {src} (exists on disk: {exists})")

    # 6. Scripts
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
    print("Scripts:", scripts)
    for s in scripts:
        if not s.startswith('http') and not s.startswith('/'):
            clean = s.split('?')[0].lstrip('/')
            exists = os.path.exists(clean)
            print(f"  RELATIVE SCRIPT: {s} (exists on disk: {exists})")
