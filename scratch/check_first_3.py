files = [
    'oci-legal-guides.html',
    'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen.html'
]
import os, re

for fname in files[:3]:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    print(f"\n==================================================")
    print(f"FILE: {fname}")
    print(f"==================================================")

    bg_urls = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', html)
    print("CSS background URLs:", bg_urls)

    og_imgs = re.findall(r'<meta[^>]+property=["\'](?:og:image|twitter:image)["\'][^>]+content=["\']([^"\']+)["\']', html)
    print("Meta images:", og_imgs)

    icons = re.findall(r'<link[^>]+rel=["\'](?:icon|shortcut icon|apple-touch-icon|manifest)["\'][^>]+href=["\']([^"\']+)["\']', html)
    print("Icons:", icons)

    css = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', html)
    print("Stylesheets:", css)

    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    print("Images count:", len(imgs))
    for src in imgs:
        clean = src.split('?')[0].lstrip('/')
        exists = os.path.exists(clean)
        if not src.startswith('/'):
            print(f"  RELATIVE IMG: {src} (exists on disk: {exists})")

    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
    print("Scripts:", scripts)
    for s in scripts:
        if not s.startswith('http') and not s.startswith('/'):
            clean = s.split('?')[0].lstrip('/')
            exists = os.path.exists(clean)
            print(f"  RELATIVE SCRIPT: {s} (exists on disk: {exists})")
