with open('partners.html.bak', 'r', encoding='utf-8', errors='ignore') as f:
    orig = f.read()

import re
print("access_key in partners.html.bak:", re.findall(r'access_key[^>]*', orig))
print("web3forms in partners.html.bak:", re.findall(r'web3forms[^>]*', orig))
print("forms in partners.html.bak:", re.findall(r'<form[^>]*>', orig))

