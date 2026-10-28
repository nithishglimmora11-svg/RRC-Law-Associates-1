import re

for f in ['nri-services.html', 'wills-probate-estate-administration.html', 'nri-rera-builder-disputes.html', 'nri-landlord-tenant-eviction.html', 'nri-power-of-attorney.html', 'nri-property-disputes.html']:
    with open(f, encoding='utf-8') as fp:
        c = fp.read()
    m = re.search(r'<link rel=[\'"]canonical[\'"] href=[\'"](.*?)[\'"]', c, re.I)
    print(f"{f:40}: {m.group(1) if m else 'None'}")

