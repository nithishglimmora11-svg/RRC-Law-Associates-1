import glob
import re

html_files = sorted(glob.glob('*.html'))
updated_count = 0

for html in html_files:
    if html == 'partners.html':
        continue
    
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    original_content = content

    # 1. Desktop navigation: nav-link-custom
    def repl_desktop(match):
        open_tag = match.group(1)
        inner = match.group(2)
        close_tag = match.group(3)
        if inner.strip() == 'Partners':
            new_inner = inner.replace('Partners', 'Legal Partners')
            return f"{open_tag}{new_inner}{close_tag}"
        return match.group(0)

    pattern_desk = r'(<a[^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>)([\s\S]*?)(</a>)'
    pattern_desk2 = r'(<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*>)([\s\S]*?)(</a>)'

    content = re.sub(pattern_desk, repl_desktop, content, flags=re.I)
    content = re.sub(pattern_desk2, repl_desktop, content, flags=re.I)

    # 2. Mobile navigation: m-link or mobile-link
    def repl_mobile(match):
        open_tag = match.group(1)
        inner = match.group(2)
        close_tag = match.group(3)
        if inner.strip() == 'Partners':
            new_inner = inner.replace('Partners', 'Legal Partners')
            return f"{open_tag}{new_inner}{close_tag}"
        return match.group(0)

    pattern_mob = r'(<a[^>]*class=["\'][^"\']*(?:m-link|mobile-link)[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>)([\s\S]*?)(</a>)'
    pattern_mob2 = r'(<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*(?:m-link|mobile-link)[^"\']*["\'][^>]*>)([\s\S]*?)(</a>)'

    content = re.sub(pattern_mob, repl_mobile, content, flags=re.I)
    content = re.sub(pattern_mob2, repl_mobile, content, flags=re.I)

    # Special check for sectors.html to add mobile partners link if missing
    if html == 'sectors.html' and 'href="partners.html" class="m-link"' not in content:
        # insert right before <a href="index.html#contact" class="m-link">Contact</a>
        target_str = '<a href="index.html#contact" class="m-link">Contact</a>'
        replacement_str = '<a href="partners.html" class="m-link">Legal Partners</a>\n                ' + target_str
        if target_str in content:
            content = content.replace(target_str, replacement_str, 1)

    if content != original_content:
        with open(html, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_count += 1
        print(f"Updated {html}")

print(f"Total files updated: {updated_count}")

