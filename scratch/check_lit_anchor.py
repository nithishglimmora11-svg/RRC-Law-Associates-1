import glob, re

files = sorted(glob.glob("*.html")) + ['nri-landlord-tenant-eviction/index.html']

lit_in_desktop = []
lit_in_mobile = []

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Check desktop Core Practice Areas dropdown for litigation
    m_desk = re.search(r'<div class="dropdown">.*?Core Practice Areas.*?</ul>', c, re.S)
    if m_desk and 'litigation-dispute-resolution' in m_desk.group(0):
        lit_in_desktop.append(f)
        
    # Check mobile Core Practice Areas for litigation
    m_mob = re.search(r'(<div class="m-dropdown">.*?Core Practice Areas.*?</div>\s*</div>|id=["\']mobileMenu["\'].*?Core Practice Areas.*?</div>\s*</div>)', c, re.S)
    if m_mob and 'litigation-dispute-resolution' in m_mob.group(0):
        lit_in_mobile.append(f)

print(f"Total files: {len(files)}")
print(f"litigation in desktop Core Practice Areas: {len(lit_in_desktop)}")
print(f"litigation in mobile Core Practice Areas: {len(lit_in_mobile)}")

