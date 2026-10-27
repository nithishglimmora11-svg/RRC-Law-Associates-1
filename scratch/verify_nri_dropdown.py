import glob
import re

expected_items = [
    'oci-card-assistance.html',
    'nri-property-disputes.html',
    'nri-power-of-attorney.html',
    'nri-criminal-case.html',
    'nri-family-matrimonial.html'
]

print("Checking NRI Services dropdown items across all files:")
print("=" * 60)

for fn in sorted(glob.glob("*.html")):
    c = open(fn, encoding='utf-8').read()
    if 'nri-services.html' in c:
        # find dropdown-menu following nri-services.html
        m = re.search(r'href=["\']nri-services\.html["\'][^>]*>.*?<ul class=["\']dropdown-menu[^"\']*["\']>(.*?)</ul>', c, re.DOTALL)
        if m:
            links = re.findall(r'href=["\']([^"\']+)["\']', m.group(1))
            clean_links = [l.strip('./') for l in links]
            if clean_links != expected_items:
                print(f"[DIFF] {fn}: {clean_links}")

print("Check completed. If no [DIFF] lines above, all match expected_items perfectly.")
