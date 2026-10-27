import zipfile
import xml.etree.ElementTree as ET

docx_path = r'assets/docs/OCI Eligibility_Meaning and Legal Status.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml_content = z.read('word/document.xml')

root = ET.fromstring(xml_content)

namespaces = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

paragraphs = []

for elem in root.iter():
    if elem.tag.endswith('p'):
        # Get paragraph style if any
        pStyle = elem.find('.//w:pStyle', namespaces)
        style_name = pStyle.attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', 'Normal') if pStyle is not None else 'Normal'
        
        # Get all text runs
        texts = [t.text for t in elem.iter() if t.tag.endswith('t') and t.text]
        full_text = "".join(texts).strip()
        if full_text:
            paragraphs.append(f"[{style_name}] {full_text}")
    elif elem.tag.endswith('tbl'):
        pass # tables will have paragraphs inside cells anyway

with open('scratch/blog1_content.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(paragraphs))

print(f"Extracted {len(paragraphs)} paragraphs to scratch/blog1_content.txt")
