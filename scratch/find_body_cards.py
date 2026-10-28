with open('core-practice-areas.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('<main')
if pos == -1:
    pos = text.find('class="practice-card"')
if pos == -1:
    pos = text.find('Our Core Practice Areas')
print("Position:", pos)
print(text[pos:pos+2000].encode('ascii', errors='replace').decode('ascii'))

