import zipfile
import xml.etree.ElementTree as ET

docx_path = r'assets/docs/OCI vs NRI vs Indian Citizen.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml_content = z.read('word/document.xml')

root = ET.fromstring(xml_content)

namespaces = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

output_lines = []

# Iterate through body children in order
body = root.find('.//w:body', namespaces)

for child in body:
    if child.tag.endswith('p'):
        pStyle = child.find('.//w:pStyle', namespaces)
        style_name = pStyle.attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', 'Normal') if pStyle is not None else 'Normal'
        texts = [t.text for t in child.iter() if t.tag.endswith('t') and t.text]
        full_text = "".join(texts).strip()
        if full_text:
            output_lines.append(f"[{style_name}] {full_text}")
    elif child.tag.endswith('tbl'):
        output_lines.append("[TABLE_START]")
        for row in child.findall('.//w:tr', namespaces):
            cells = []
            for cell in row.findall('.//w:tc', namespaces):
                cell_texts = [t.text for t in cell.iter() if t.tag.endswith('t') and t.text]
                cells.append("".join(cell_texts).strip())
            output_lines.append("[ROW] " + " | ".join(cells))
        output_lines.append("[TABLE_END]")

with open('scratch/blog2_content.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(output_lines))

print(f"Extracted {len(output_lines)} lines to scratch/blog2_content.txt")
