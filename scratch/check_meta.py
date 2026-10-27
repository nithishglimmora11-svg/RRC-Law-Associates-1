with open('oci-card-eligibility-legal-status.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
m = re.findall(r'<meta[^>]*viewport[^>]*>', html)
print('Viewport meta tags:', m)
