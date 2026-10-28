import re

def inspect_nav(fname):
    with open(fname, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    print(f"=== {fname} ===")
    
    # Desktop Core Practice Areas
    m_desk = re.search(r'(<div class="dropdown">.*?Core Practice Areas.*?</ul>\s*</div>)', c, re.S)
    if m_desk:
        print("Desktop dropdown items:")
        for item in re.findall(r'<a class="dropdown-item[^"]*"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', m_desk.group(0)):
            print(f"   href={item[0]:35} text={item[1].strip()}")
    else:
        print("No desktop Core Practice Areas dropdown found!")
        
    # Mobile Core Practice Areas
    m_mob = re.search(r'(<div class="m-dropdown">.*?Core Practice Areas.*?</div>\s*</div>)', c, re.S)
    if m_mob:
        print("Mobile menu items:")
        for item in re.findall(r'<a class="m-sub-item"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', m_mob.group(0)):
            print(f"   href={item[0]:35} text={item[1].strip()}")
    else:
        print("No mobile Core Practice Areas menu found!")

for f in ['index.html', 'cheque-bounce-lawyer.html', 'property-law.html', 'litigation-dispute-resolution.html', 'core-practice-areas.html']:
    inspect_nav(f)

