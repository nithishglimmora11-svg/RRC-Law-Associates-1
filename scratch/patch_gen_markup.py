with open('scratch/generate_partners_html.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace excessive mb-5 with balanced mb-4 in HTML body
code = code.replace('<div class="text-center mb-5">', '<div class="text-center mb-4">')
code = code.replace('<div class="row g-4 mb-5">', '<div class="row g-3 mb-4">')
code = code.replace('<div class="row align-items-center g-4 p-4 rounded-4 bg-light border mb-5">', '<div class="row align-items-center g-3 p-3 rounded-4 bg-light border mb-4">')

with open('scratch/generate_partners_html.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated HTML markup margins in scratch/generate_partners_html.py")

