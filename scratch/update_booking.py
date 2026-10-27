with open('booking.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_btn = '<button type="submit" class="btn-gold py-3">'
new_btn = '<button type="submit" class="btn-gold py-3 w-100">'

if old_btn in content:
    content = content.replace(old_btn, new_btn)
    with open('booking.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated booking.html button to w-100')
else:
    print('Pattern not found')
