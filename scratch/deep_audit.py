import os
import re

def analyze(fname):
    print('=== ' + fname + ' ===')
    with open(fname, encoding='utf-8') as f:
        html = f.read()
    
    # Meta / Title
    title = re.search(r'<title>(.*?)</title>', html, re.S)
    print('Title:', title.group(1).strip() if title else 'None')
    meta_desc = re.search(r'<meta name=[\'"]description[\'"] content=[\'"](.*?)[\'"]', html, re.I)
    print('Meta Desc:', meta_desc.group(1).strip() if meta_desc else 'None')
    canonical = re.search(r'<link rel=[\'"]canonical[\'"] href=[\'"](.*?)[\'"]', html, re.I)
    print('Canonical:', canonical.group(1).strip() if canonical else 'None')

    # Main content wrapper or sections
    main = re.search(r'(<main.*?</main>)', html, re.S)
    content_area = main.group(1) if main else html
    headings = re.findall(r'<(h[123])[^>]*>(.*?)</\1>', content_area, re.S)
    for h, t in headings:
        clean = re.sub(r'<[^>]+>', '', t).strip()
        print(f'  {h}: {clean[:85]}')

for f in ['nri-power-of-attorney.html', 'nri-property-disputes.html', 'cheque-bounce-lawyer.html', 'litigation-dispute-resolution.html', 'property-law.html']:
    analyze(f)

