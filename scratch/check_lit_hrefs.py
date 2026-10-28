import glob, re

files = sorted(glob.glob("*.html")) + ['nri-landlord-tenant-eviction/index.html']

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Find desktop href
    m_desk = re.search(r'href="([^"]*litigation-dispute-resolution[^"]*)"', c)
    # Find mobile href
    pos_mob = c.find('mobileMenu')
    m_mob = re.search(r'href="([^"]*litigation-dispute-resolution[^"]*)"', c[pos_mob:] if pos_mob != -1 else "")
    
    desk_href = m_desk.group(1) if m_desk else "None"
    mob_href = m_mob.group(1) if m_mob else "None"
    print(f"{f:55} | desk={desk_href:35} | mob={mob_href}")

