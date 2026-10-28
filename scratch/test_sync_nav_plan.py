import glob
import re

html_files = sorted(glob.glob('*.html'))
print(f"Total HTML files to inspect: {len(html_files)}")

changes_plan = {}

for html in html_files:
    if html == 'partners.html':
        continue
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    file_changes = []

    # 1. Desktop navigation: nav-link-custom
    def repl_desktop(match):
        full = match.group(0)
        open_tag = match.group(1)
        inner = match.group(2)
        close_tag = match.group(3)
        if inner.strip() == 'Partners':
            # preserve original whitespace/indentation style
            new_inner = inner.replace('Partners', 'Legal Partners')
            file_changes.append(('desktop', inner.strip(), 'Legal Partners'))
            return f"{open_tag}{new_inner}{close_tag}"
        return full

    # Pattern where class comes first or href comes first
    pattern_desk = r'(<a[^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>)([\s\S]*?)(</a>)'
    pattern_desk2 = r'(<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*>)([\s\S]*?)(</a>)'

    # 2. Mobile navigation: m-link or mobile-link
    pattern_mob = r'(<a[^>]*class=["\'][^"\']*(?:m-link|mobile-link)[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>)([\s\S]*?)(</a>)'
    pattern_mob2 = r'(<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*(?:m-link|mobile-link)[^"\']*["\'][^>]*>)([\s\S]*?)(</a>)'

    new_content = re.sub(pattern_desk, repl_desktop, content, flags=re.I)
    new_content = re.sub(pattern_desk2, repl_desktop, new_content, flags=re.I)

    def repl_mobile(match):
        full = match.group(0)
        open_tag = match.group(1)
        inner = match.group(2)
        close_tag = match.group(3)
        if inner.strip() == 'Partners':
            new_inner = inner.replace('Partners', 'Legal Partners')
            file_changes.append(('mobile', inner.strip(), 'Legal Partners'))
            return f"{open_tag}{new_inner}{close_tag}"
        return full

    new_content = re.sub(pattern_mob, repl_mobile, new_content, flags=re.I)
    new_content = re.sub(pattern_mob2, repl_mobile, new_content, flags=re.I)

    if file_changes:
        changes_plan[html] = (file_changes, new_content)

print(f"Files requiring updates: {len(changes_plan)}")
for html, (changes, _) in changes_plan.items():
    print(f"  {html}: {changes}")

