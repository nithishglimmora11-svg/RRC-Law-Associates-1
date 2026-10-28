with open('core-practice-areas.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('DOCUMENTATION, REGISTRATION &amp; DUE DILIGENCE')
if pos != -1:
    print(text[pos-200:pos+1500])

