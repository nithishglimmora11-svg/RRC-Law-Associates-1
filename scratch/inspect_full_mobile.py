with open('index.html', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('id="mobileMenu"')
end_pos = text.find('</nav>', pos)
if end_pos == -1:
    end_pos = text.find('<main', pos)
if end_pos == -1:
    end_pos = text.find('<section', pos)
print(text[pos:pos+2500].encode('ascii', errors='replace').decode('ascii'))

