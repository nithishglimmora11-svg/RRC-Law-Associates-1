import re
import os

with open('scratch/transformed_oci_card_assistance.html', 'r', encoding='utf-8') as f:
    content = f.read()

patterns = [
    (r'\bsrc=["\']([^"\']+)["\']', 'src'),
    (r'\bhref=["\']([^"\']+)["\']', 'href'),
    (r'\bposter=["\']([^"\']+)["\']', 'poster'),
    (r'\baction=["\']([^"\']+)["\']', 'action'),
    (r'url\([\'"]?([^\'"\)]+)[\'"]?\)', 'url()')
]

print("=== Scanning scratch/transformed_oci_card_assistance.html ===")
for pat, name in patterns:
    matches = re.findall(pat, content, re.IGNORECASE)
    relative = [m for m in matches if not m.startswith(('http://', 'https://', '/', '#', 'mailto:', 'tel:', 'data:', 'javascript:'))]
    print(f'{name}: total={len(matches)}, relative={len(relative)} -> {relative}')

# Verify all root-relative assets exist on disk
assets_checked = []
missing_assets = []
root_assets = set(re.findall(r'(?:href|src)=["\'](/[^"\']+)["\']', content))
for asset in root_assets:
    # remove query string if any
    clean_path = asset.split('?')[0].split('#')[0]
    if clean_path in ('/', ''):
        continue
    # check if directory with trailing slash (e.g. /oci-legal-guides/)
    if clean_path.endswith('/'):
        clean_dir = clean_path.strip('/')
        # Check if html file exists
        if os.path.exists(f"{clean_dir}.html") or os.path.isdir(clean_dir):
            assets_checked.append((asset, True))
        else:
            assets_checked.append((asset, False))
            missing_assets.append(asset)
    else:
        disk_path = clean_path.lstrip('/')
        exists = os.path.exists(disk_path)
        assets_checked.append((asset, exists))
        if not exists:
            missing_assets.append(asset)

print("\n=== Verified Root Assets Existence on Disk ===")
print(f"Total checked: {len(assets_checked)}")
print(f"Missing count: {len(missing_assets)}")
if missing_assets:
    print("MISSING:", missing_assets)
else:
    print("ALL ROOT ASSETS EXIST LOCALLY!")
