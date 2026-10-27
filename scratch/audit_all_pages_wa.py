import glob
import re

pages = glob.glob('*.html')
has_fw = []
has_wf = []
has_both = []

for p in pages:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    fw = bool(re.search(r'floating-whatsapp', c))
    wf = bool(re.search(r'whatsapp-float', c))
    if fw and wf:
        has_both.append(p)
    elif fw:
        has_fw.append(p)
    elif wf:
        has_wf.append(p)

print("Pages with BOTH (DUPLICATES):", has_both)
print("Pages with ONLY floating-whatsapp:", has_fw)
print("Pages with ONLY whatsapp-float:", len(has_wf), "pages")
