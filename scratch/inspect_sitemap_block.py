with open('sitemap.xml', encoding='utf-8') as f:
    text = f.read()

pos = text.find('litigation-dispute-resolution')
print(text[pos-100:pos+300])

