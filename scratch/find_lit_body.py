with open('core-practice-areas.html', encoding='utf-8') as f:
    text = f.read()

pos = text.rfind('LITIGATION &amp; DISPUTE RESOLUTION')
print(text[pos:pos+1200])

