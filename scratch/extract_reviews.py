import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'client|review|feedback', text, re.I):
    idx = m.start()
    snippet = text[max(0, idx-30):min(len(text), idx+100)].strip()
    if 'quote' in snippet.lower() or 'say' in snippet.lower() or 'rating' in snippet.lower() or 'star' in snippet.lower():
        print(snippet)
        print("---")

