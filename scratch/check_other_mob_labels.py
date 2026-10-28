import glob, re

files = sorted(glob.glob("*.html")) + ['nri-landlord-tenant-eviction/index.html']

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    if 'property-law' in c:
        pos = c.find('property-law')
        # find in mobile menu if exists
        pos_mob = c.find('mobileMenu')
        if pos_mob != -1 and 'property-law' in c[pos_mob:]:
            m_pos = c.find('property-law', pos_mob)
            start = c.rfind('<a', 0, m_pos)
            end = c.find('</a>', m_pos)
            if 'DOCUMENTATION, REGISTRATION &amp; DUE DILIGENCE' not in c[start:end+4]:
                print(f"{f}: {c[start:end+4]}")

