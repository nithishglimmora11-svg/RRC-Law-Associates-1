import glob, re

files = sorted(glob.glob("*.html")) + ['nri-landlord-tenant-eviction/index.html']

due_diligence_desktop = []
due_diligence_mobile = []

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    if 'Due Diligence Frameworks' in c:
        due_diligence_desktop.append(f)
    if 'DOCUMENTATION, REGISTRATION &amp; DUE DILIGENCE' in c:
        due_diligence_mobile.append(f)

print(f"Files with 'Due Diligence Frameworks' in desktop: {len(due_diligence_desktop)}")
print(f"Files with 'DOCUMENTATION, REGISTRATION &amp; DUE DILIGENCE' in mobile: {len(due_diligence_mobile)}")

