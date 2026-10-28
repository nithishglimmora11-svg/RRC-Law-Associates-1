with open('scratch/extracted_form.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

inputs = re.findall(r'<input[^>]*>', text, re.I)
selects = re.findall(r'<select[^>]*>[\s\S]*?</select>', text, re.I)
textareas = re.findall(r'<textarea[^>]*>[\s\S]*?</textarea>', text, re.I)
buttons = re.findall(r'<button[^>]*>[\s\S]*?</button>', text, re.I)

print(f"Total inputs: {len(inputs)}")
for inp in inputs:
    # extract name, type, value, required
    name = re.search(r'name=["\']([^"\']+)["\']', inp)
    typ = re.search(r'type=["\']([^"\']+)["\']', inp)
    val = re.search(r'value=["\']([^"\']+)["\']', inp)
    req = 'required' in inp
    n = name.group(1) if name else 'NO_NAME'
    t = typ.group(1) if typ else 'text'
    v = val.group(1) if val else ''
    if 'access_key' in n:
        v = v[:4] + '-****-****-****-********' + v[-4:]
    print(f"  Input: name='{n}', type='{t}', required={req}, value='{v}'")

print(f"\nTotal selects: {len(selects)}")
for sel in selects:
    name = re.search(r'name=["\']([^"\']+)["\']', sel)
    req = 'required' in sel
    print(f"  Select: name='{name.group(1) if name else 'NO_NAME'}', required={req}")

print(f"\nTotal textareas: {len(textareas)}")
for ta in textareas:
    name = re.search(r'name=["\']([^"\']+)["\']', ta)
    req = 'required' in ta
    print(f"  Textarea: name='{name.group(1) if name else 'NO_NAME'}', required={req}")

