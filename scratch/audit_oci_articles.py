import glob
import os
import re
import urllib.parse

articles = [
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

print("=" * 80)
print("COMPREHENSIVE AUDIT OF ALL 12 OCI ARTICLES")
print("=" * 80)

all_pass = True

for fn in articles:
    if not os.path.exists(fn):
        print(f"[FAIL] {fn} does not exist!")
        all_pass = False
        continue

    c = open(fn, encoding='utf-8').read()
    issues = []

    # 1. Title
    title_m = re.search(r'<title>(.*?)</title>', c)
    if not title_m or not title_m.group(1).strip():
        issues.append("Missing <title>")

    # 2. Meta description
    meta_desc = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', c, re.IGNORECASE)
    if not meta_desc or len(meta_desc.group(1).strip()) < 30:
        issues.append("Missing or too short meta description")

    # 3. Canonical
    canonical = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', c, re.IGNORECASE)
    if not canonical:
        issues.append("Missing canonical URL")

    # 4. H1
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', c, re.DOTALL)
    if len(h1s) != 1:
        issues.append(f"Expected 1 H1, found {len(h1s)}")

    # 5. Heading hierarchy: check H2s and H3s
    h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', c, re.DOTALL)
    if len(h2s) < 3:
        issues.append(f"Low H2 count: {len(h2s)}")

    # 6. TOC links check (if TOC exists, do anchors resolve?)
    toc_links = re.findall(r'<a[^>]+href=["\']#([^"\']+)["\'][^>]*>', c)
    broken_anchors = []
    for anchor in toc_links:
        # Ignore generic empty anchors or standard modal ids
        if anchor in ['', 'top', 'contact', 'explore-guides']:
            continue
        if f'id="{anchor}"' not in c and f"id='{anchor}'" not in c:
            broken_anchors.append(anchor)
    if broken_anchors:
        issues.append(f"Broken TOC/anchor links: {broken_anchors[:3]}")

    # 7. Reading time check (should be ZERO)
    if re.search(r'\b\d+\s*min(?:\s*read)?\b', c, re.IGNORECASE):
        issues.append("Still contains reading time!")

    # 8. Disclaimer check
    if 'disclaimer' not in c.lower():
        issues.append("Missing legal disclaimer")

    # 9. FAQ section check
    if 'faq' not in c.lower():
        issues.append("Missing FAQ section")

    # 10. Floating widgets check
    if 'whatsapp-float' not in c:
        issues.append("Missing WhatsApp float")
    if 'data-rrc-ai-chat-root' not in c:
        issues.append("Missing AI chat root")

    # 11. Logo check
    if 'assets/images/rrclogo.png' not in c:
        issues.append("Missing approved rrclogo.png")

    # 12. Check images inside article
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', c)
    missing_imgs = [src for src in img_srcs if not src.startswith(('http://', 'https://', 'data:')) and not os.path.exists(src)]
    if missing_imgs:
        issues.append(f"Broken local images: {missing_imgs}")

    status = "PASS" if not issues else "FAIL"
    if issues:
        all_pass = False
    print(f"[{status}] {fn}")
    print(f"       Title: {title_m.group(1).strip()[:65] if title_m else 'NONE'}")
    print(f"       H1: {h1s[0].strip()[:65] if h1s else 'NONE'}")
    print(f"       H2 count: {len(h2s)} | Img count: {len(img_srcs)}")
    if issues:
        print(f"       ISSUES: {', '.join(issues)}")
    print()

print("=" * 80)
print("AUDIT RESULT:", "ALL 12 ARTICLES PASSED!" if all_pass else "ISSUES FOUND")
print("=" * 80)
