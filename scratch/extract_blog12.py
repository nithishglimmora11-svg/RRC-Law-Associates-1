import zipfile
import xml.etree.ElementTree as ET

docx_path = r'assets/docs/OCI Card Renewal, Re-Issue and Passport Changes.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml_content = z.read('word/document.xml')

root = ET.fromstring(xml_content)

namespaces = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

paragraphs = []

for elem in root.iter():
    if elem.tag.endswith('p'):
        pStyle = elem.find('.//w:pStyle', namespaces)
        style_name = pStyle.attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', 'Normal') if pStyle is not None else 'Normal'
        
        # Check numbering
        numPr = elem.find('.//w:numPr', namespaces)
        is_num = (numPr is not None)

        texts = [t.text for t in elem.iter() if t.tag.endswith('t') and t.text]
        full_text = "".join(texts).strip()
        if full_text:
            paragraphs.append(f"[{style_name}|num={is_num}] {full_text}")

with open('scratch/blog12_extracted.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(paragraphs))

print(f"Extracted {len(paragraphs)} paragraphs to scratch/blog12_extracted.txt")
