with open('oci-legal-guides.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'<[^>]+whatsapp[^>]*>', text, re.I)
for m in matches:
    print(m.group(0))
