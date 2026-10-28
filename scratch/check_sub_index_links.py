with open('nri-landlord-tenant-eviction/index.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'(<div class="dropdown">.*?Core Practice Areas.*?</ul>\s*</div>)', text, re.S)
if m:
    print(m.group(0))

