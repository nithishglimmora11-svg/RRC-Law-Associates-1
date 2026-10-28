with open('index.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('DOCUMENTATION, REGISTRATION &amp; DUE DILIGENCE')
print(text[pos-100:pos+800].encode('ascii', errors='replace').decode('ascii'))

