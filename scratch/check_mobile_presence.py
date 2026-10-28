import glob, re

files = sorted(glob.glob("*.html"))
prop_in_mobile = []
cb_in_mobile = []

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    pos = c.find('mobileMenu')
    if pos != -1:
        # Search from mobileMenu to either </header> or end of nav / start of main / next section
        mobile_chunk = c[pos:pos+5000]
        if 'property-law' in mobile_chunk:
            prop_in_mobile.append(f)
        if 'cheque-bounce-lawyer' in mobile_chunk:
            cb_in_mobile.append(f)

print(f"property-law in mobileMenu: {len(prop_in_mobile)} files")
print(f"cheque-bounce-lawyer in mobileMenu: {len(cb_in_mobile)} files")

