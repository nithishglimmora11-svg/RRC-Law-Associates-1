# Fix cheque-bounce-lawyer.html desktop dropdown
with open('cheque-bounce-lawyer.html', 'r', encoding='utf-8') as fp:
    c = fp.read()

target_str = '''                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="litigation-dispute-resolution.html">Litigation &amp; Dispute Resolution</a>
                            </li>'''

replacement_str = '''                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="litigation-dispute-resolution.html">Litigation &amp; Dispute Resolution</a>
                            </li>
                        <li>
                            <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="cheque-bounce-lawyer.html">Cheque Bounce Lawyer</a>
                        </li>'''

if target_str in c:
    c = c.replace(target_str, replacement_str, 1)
    with open('cheque-bounce-lawyer.html', 'w', encoding='utf-8') as fp:
        fp.write(c)
    print("Updated cheque-bounce-lawyer.html desktop dropdown successfully.")
else:
    print("Could not find target in cheque-bounce-lawyer.html")

# Fix litigation-dispute-resolution.html mobile menu
with open('litigation-dispute-resolution.html', 'r', encoding='utf-8') as fp:
    c2 = fp.read()

target_mob = '''                        <a class="m-sub-item" href="litigation-dispute-resolution.html">LITIGATION &amp; DISPUTE RESOLUTION</a>'''
replacement_mob = '''                        <a class="m-sub-item" href="litigation-dispute-resolution.html">LITIGATION &amp; DISPUTE RESOLUTION</a>
                        <a class="m-sub-item" href="cheque-bounce-lawyer.html">CHEQUE BOUNCE LAWYER</a>'''

if target_mob in c2:
    c2 = c2.replace(target_mob, replacement_mob, 1)
    with open('litigation-dispute-resolution.html', 'w', encoding='utf-8') as fp:
        fp.write(c2)
    print("Updated litigation-dispute-resolution.html mobile menu successfully.")
else:
    print("Could not find target in litigation-dispute-resolution.html")

