with open('partners.html', 'rb') as f:
    raw = f.read()

target = b'<input type="hidden" name="access_key" value="070a477f-e139-4bcf-838c-49abddcc0959">'
print(f"Target found in partners.html: {target in raw}")

