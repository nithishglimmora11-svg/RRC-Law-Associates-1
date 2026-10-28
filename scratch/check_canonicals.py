import glob, re

for f in sorted(glob.glob("*.html"))[:20]:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    m = re.search(r'<link rel=[\'"]canonical[\'"] href=[\'"](.*?)[\'"]', c, re.I)
    print(f"{f:45}: {m.group(1) if m else 'None'}")

