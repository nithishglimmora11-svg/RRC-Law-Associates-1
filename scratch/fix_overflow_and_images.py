import re

# 1. Fix cheque-bounce-lawyer.html
with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    c = f.read()

if 'html, body {' not in c:
    c = c.replace('body {', 'html, body {\n                overflow-x: hidden;\n                width: 100%;\n            }\n\n            body {', 1)
    with open('cheque-bounce-lawyer.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Added overflow-x: hidden to cheque-bounce-lawyer.html")

# 2. Fix litigation-dispute-resolution.html
with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    c = f.read()

if 'html, body {' not in c:
    c = c.replace('body {', 'html, body {\n                overflow-x: hidden;\n                width: 100%;\n            }\n\n            body {', 1)

# Replace broken unsplash image
c = re.sub(r'src=["\']https://images\.unsplash\.com/[^"\']+["\']', 'src="assets/images/hero-law-office.jpg"', c)

with open('litigation-dispute-resolution.html', 'w', encoding='utf-8') as f:
    f.write(c)
print("Updated litigation-dispute-resolution.html with overflow fix and local hero image")

# 3. Fix property-law.html
with open('property-law.html', encoding='utf-8') as f:
    c = f.read()

if 'html, body {' not in c:
    c = c.replace('body {', 'html, body {\n                overflow-x: hidden;\n                width: 100%;\n            }\n\n            body {', 1)

# Replace broken unsplash image
c = re.sub(r'src=["\']https://images\.unsplash\.com/[^"\']+["\']', 'src="assets/images/property.jpeg"', c)

with open('property-law.html', 'w', encoding='utf-8') as f:
    f.write(c)
print("Updated property-law.html with overflow fix and local hero image")

