with open('sectors.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('href="lawfirm-blog.html" class="m-link"')
print(repr(c[idx:idx+300]))

