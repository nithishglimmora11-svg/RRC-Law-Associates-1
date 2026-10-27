import re
import glob

html_files = glob.glob('*.html')
for f in sorted(html_files):
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    has_root = 'data-rrc-ai-chat-root' in text
    scripts = re.findall(r'<script[^>]*src=["\'][^"\']*script\.js[^"\']*["\'][^>]*>', text)
    if has_root or scripts:
        print(f"{f:55}: root={has_root}, scripts={scripts}")
