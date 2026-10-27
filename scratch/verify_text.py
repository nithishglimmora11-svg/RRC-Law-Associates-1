import re
from html.parser import HTMLParser

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
    def handle_data(self, data):
        self.text_parts.append(data)
    def get_text(self):
        return " ".join(self.text_parts)

with open('scratch/blog3_content.txt', 'r', encoding='utf-8') as f:
    raw_lines = [l.strip() for l in f if l.strip()]

article_lines = []
for l in raw_lines:
    if l.startswith('[Heading1] How to Apply') or article_lines:
        article_lines.append(l)

print(f"Total article source lines from DOCX: {len(article_lines)}")

with open('oci-card-application-documents.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

parser = HTMLTextExtractor()
parser.feed(html_content)
page_text = parser.get_text()

def norm(t):
    # normalize quotes and hyphens and whitespace
    t = t.replace('“', '"').replace('”', '"').replace('’', "'").replace('‘', "'")
    t = t.replace('—', '-').replace('–', '-')
    return re.sub(r'\s+', ' ', t).strip().lower()

normalized_page_text = norm(page_text)
normalized_html = norm(html_content)

missing = []
for line in article_lines:
    clean_line = re.sub(r'^\[(Heading\d|NormalWeb)\]\s*', '', line).strip()
    if not clean_line:
        continue
    clean_norm = norm(clean_line)
    if clean_norm not in normalized_page_text and clean_norm not in normalized_html:
        # Also check without trailing punctuation
        if clean_norm.rstrip(':') not in normalized_page_text and clean_norm.rstrip(':') not in normalized_html:
            missing.append(clean_line)

if missing:
    print(f"FAILED: {len(missing)} items not found:")
    for item in missing:
        print(f" - {item}")
else:
    print("SUCCESS: 100% of DOCX article text matched in oci-card-application-documents.html!")
