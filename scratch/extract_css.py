with open('scratch/generate_partners_html.py', 'r', encoding='utf-8') as f:
    code = f.read()

s_idx = code.find('<style>')
e_idx = code.find('</style>')
print(f"<style> at {s_idx}, </style> at {e_idx}")
with open('scratch/current_css.css', 'w', encoding='utf-8') as out:
    out.write(code[s_idx+7:e_idx])
print("Wrote current_css.css")

