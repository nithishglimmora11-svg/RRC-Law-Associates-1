with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.litigation-row-card')
style_end = text.find('</style>', pos)
print(text[pos-50:style_end])

