import zipfile, xml.etree.ElementTree as ET

def get_docx_text(path):
    with zipfile.ZipFile(path) as docx:
        tree = ET.fromstring(docx.read('word/document.xml'))
        text = []
        for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            p_text = ''.join(node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text)
            if p_text:
                text.append(p_text)
        return '\n'.join(text)

raw = get_docx_text(r'C:\Users\nithi\Downloads\Legal Partners Page (1).docx')
for line in raw.split('\n'):
    if 'testim' in line.lower() or 'quote' in line.lower() or 'partner say' in line.lower():
        print(line)

