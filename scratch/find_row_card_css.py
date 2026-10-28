with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.litigation-row-card')
print("Position:", pos)
if pos != -1:
    print(text[pos-100:pos+800])

