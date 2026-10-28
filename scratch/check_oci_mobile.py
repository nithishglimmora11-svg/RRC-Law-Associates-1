with open('oci-legal-guides.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('mobileMenu')
if pos != -1:
    print(text[pos:pos+1500].encode('ascii', errors='replace').decode('ascii'))

