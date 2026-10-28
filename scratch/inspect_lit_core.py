with open('core-practice-areas.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('LITIGATION &amp; DISPUTE RESOLUTION')
if pos == -1:
    pos = text.find('LITIGATION & DISPUTE RESOLUTION')
print(text[pos:pos+1200])

