with open('nri-property-disputes.html', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('article-hero')
if pos != -1:
    print(text[pos-50:pos+500])

