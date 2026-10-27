import re

with open('oci-legal-guides.html', 'r', encoding='utf-8') as f:
    text = f.read()

schema_pos = text.find('ItemList')
if schema_pos != -1:
    schema_end = text.find('</script>', schema_pos)
    print(text[schema_pos-100:schema_end])
