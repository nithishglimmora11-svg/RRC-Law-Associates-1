# Replace access key in partners.html
old_key = "070a477f-e139-4bcf-838c-49abddcc0959"
new_key = "c7cfef9d-f2e7-4c43-95e8-9a54f3e5773b"

with open("partners.html", "r", encoding="utf-8") as f:
    content = f.read()

if old_key in content:
    content = content.replace(old_key, new_key)
    with open("partners.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully replaced access_key in partners.html")
else:
    print("Old key not found in partners.html")

# Also update generator script for maintainability
with open("scratch/generate_partners_html.py", "r", encoding="utf-8") as f:
    gen_content = f.read()

if old_key in gen_content:
    gen_content = gen_content.replace(old_key, new_key)
    with open("scratch/generate_partners_html.py", "w", encoding="utf-8") as f:
        f.write(gen_content)
    print("Successfully replaced access_key in scratch/generate_partners_html.py")

