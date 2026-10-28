files = ['nri-criminal-case.html', 'nri-family-matrimonial.html', 'nri-power-of-attorney.html']
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    # 1. Update Property Law label in desktop dropdown
    c = c.replace(
        '<li><a class="dropdown-item" href="property-law.html">Due Diligence Frameworks</a></li>',
        '<li><a class="dropdown-item" href="property-law.html">Property Law &amp; Due Diligence</a></li>'
    )
    
    # 2. Add Cheque Bounce Lawyer right after Litigation & Dispute Resolution
    old_lit = '<li><a class="dropdown-item" href="litigation-dispute-resolution.html">Litigation &amp; Dispute Resolution</a></li>'
    new_lit = old_lit + '\n                        <li><a class="dropdown-item" href="cheque-bounce-lawyer.html">Cheque Bounce Lawyer</a></li>'
    c = c.replace(old_lit, new_lit)
    
    with open(f, 'w', encoding='utf-8') as fp:
        fp.write(c)
    print(f, 'updated successfully.')

