import re
import os

FILES = [
    'oci-card-assistance.html',
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

print("=== CHECKING ASSET REFERENCES ACROSS ALL 15 OCI HTML FILES ===")

relative_assets = []
missing_assets = []
verified_assets = set()

# Regex to find src, href in link, video, img, script
tag_patterns = [
    (r'<img\s+[^>]*src=["\']([^"\']+)["\']', 'img src'),
    (r'<video\s+[^>]*src=["\']([^"\']+)["\']', 'video src'),
    (r'<link\s+[^>]*href=["\']([^"\']+)["\']', 'link href'),
    (r'<script\s+[^>]*src=["\']([^"\']+)["\']', 'script src'),
]

for fname in FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for pat, label in tag_patterns:
        for m in re.finditer(pat, content, re.IGNORECASE):
            url = m.group(1)
            # Skip external URLs, canonical links, font links, and cdn links
            if url.startswith(('http://', 'https://', 'data:', '//', '#')):
                continue
            
            # Check if relative (not starting with /)
            if not url.startswith('/'):
                relative_assets.append((fname, label, url))
            else:
                # Root relative: check if it exists on disk
                clean_path = url.split('?')[0].split('#')[0].lstrip('/')
                if clean_path:
                    exists = os.path.exists(clean_path)
                    if exists:
                        verified_assets.add(clean_path)
                    else:
                        missing_assets.append((fname, label, url))

print(f"Total verified unique assets on disk: {len(verified_assets)}")
for a in sorted(verified_assets):
    print(f"  EXISTS: /{a}")

print(f"\nRemaining relative assets (should be 0): {len(relative_assets)}")
for r in relative_assets:
    print(f"  RELATIVE: {r}")

print(f"\nMissing root-relative assets on disk: {len(missing_assets)}")
for m in set(missing_assets):
    print(f"  MISSING: {m}")
