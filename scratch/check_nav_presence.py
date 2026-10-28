import glob, re

files = sorted(glob.glob("*.html"))
cb_in_desktop = []
cb_in_mobile = []
prop_in_desktop = []
prop_in_mobile = []

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Check header desktop nav
    header = re.search(r'<header[^>]*>.*?</header>', c, re.S)
    if header:
        h_text = header.group(0)
        if 'cheque-bounce-lawyer' in h_text:
            cb_in_desktop.append(f)
        if 'property-law' in h_text:
            prop_in_desktop.append(f)
            
    # Check mobile menu
    mobile = re.search(r'(<div[^>]*class=["\']mobile-menu["\'][^>]*>.*?</div>\s*</div>|id=["\']mobileMenu["\'].*?</div>\s*</div>)', c, re.S)
    if mobile:
        m_text = mobile.group(0)
        if 'cheque-bounce-lawyer' in m_text:
            cb_in_mobile.append(f)
        if 'property-law' in m_text:
            prop_in_mobile.append(f)

print(f"Total HTML files: {len(files)}")
print(f"cheque-bounce-lawyer in desktop nav: {len(cb_in_desktop)} files -> {cb_in_desktop}")
print(f"cheque-bounce-lawyer in mobile nav: {len(cb_in_mobile)} files -> {cb_in_mobile}")
print(f"property-law in desktop nav: {len(prop_in_desktop)} files")
print(f"property-law in mobile nav: {len(prop_in_mobile)} files")

