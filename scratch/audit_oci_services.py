import os
import re

service_pages = [
    'oci-card-assistance.html',
    'oci-card-indian-ancestry-assistance.html',
    'oci-legal-guides.html'
]

print("=" * 80)
print("AUDIT OF OCI SERVICE PAGES & HUB")
print("=" * 80)

for fn in service_pages:
    c = open(fn, encoding='utf-8').read()
    issues = []

    # Title & Meta
    title_m = re.search(r'<title>(.*?)</title>', c)
    desc_m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', c, re.IGNORECASE)
    canonical_m = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', c, re.IGNORECASE)
    
    if not title_m: issues.append("Missing <title>")
    if not desc_m: issues.append("Missing meta description")
    if not canonical_m: issues.append("Missing canonical")

    # H1
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', c, re.DOTALL)
    if len(h1s) != 1: issues.append(f"Expected 1 H1, found {len(h1s)}")

    # Header & Logo
    if 'assets/images/rrclogo.png' not in c:
        issues.append("Missing approved rrclogo.png")

    # Booking buttons
    booking_links = re.findall(r'href=["\']([^"\']*booking\.html[^"\']*)["\']', c)
    if not booking_links:
        issues.append("No booking/consultation links")

    # Internal links to articles
    article_links = [l for l in re.findall(r'href=["\']([^"\']+\.html)["\']', c) if 'oci-' in l or 'nri-' in l]

    # Floating widgets
    if 'whatsapp-float' not in c:
        issues.append("Missing WhatsApp float")
    if 'data-rrc-ai-chat-root' not in c:
        issues.append("Missing AI chat root")

    # Check images
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', c)
    missing_imgs = [src for src in img_srcs if not src.startswith(('http://', 'https://', 'data:')) and not os.path.exists(src)]
    if missing_imgs:
        issues.append(f"Broken images: {missing_imgs}")

    status = "PASS" if not issues else "FAIL"
    print(f"[{status}] {fn}")
    print(f"       Title: {title_m.group(1).strip()[:65] if title_m else 'NONE'}")
    print(f"       H1: {re.sub(r'<[^>]+>', ' ', h1s[0]).strip()[:65] if h1s else 'NONE'}")
    print(f"       Article links found: {len(article_links)}")
    print(f"       Images verified: {len(img_srcs)} (missing: {len(missing_imgs)})")
    if issues:
        print(f"       ISSUES: {', '.join(issues)}")
    print()

print("=" * 80)
