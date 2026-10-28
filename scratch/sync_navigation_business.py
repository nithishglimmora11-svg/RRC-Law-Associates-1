import os, re

files = [f for f in os.listdir('.') if f.endswith('.html')]
print(f"Total HTML files found: {len(files)}")

# 1. Desktop pattern: Match the <li> block containing /nri-rera-builder-disputes/
desktop_pattern = re.compile(
    r'(<li>\s*<a\s+class=["\']dropdown-item\s+text-uppercase["\'][^>]*href=["\']/nri-rera-builder-disputes/["\']>.*?</a>\s*</li>)',
    re.IGNORECASE | re.DOTALL
)

# 2. Mobile pattern: Match the <a class="m-sub-item"... /nri-rera-builder-disputes/
mobile_pattern = re.compile(
    r'(<a\s+class=["\']m-sub-item["\'][^>]*href=["\']/nri-rera-builder-disputes/["\']>.*?</a>)',
    re.IGNORECASE
)

# 3. Footer pattern if present:
footer_pattern = re.compile(
    r'(<li><a\s+href=["\']/nri-rera-builder-disputes/["\'][^>]*>.*?</a></li>)',
    re.IGNORECASE
)

updated_files = []

for f in files:
    content = open(f, encoding='utf-8').read()
    if '/nri-rera-builder-disputes/' not in content:
        continue
    
    # Skip if already has /nri-business-commercial-advisory/
    if '/nri-business-commercial-advisory/' in content:
        continue
        
    new_content = content
    
    # Desktop insert
    new_content, d_count = desktop_pattern.subn(
        r'\1\n                            <li>\n                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a>\n                            </li>',
        new_content
    )
    
    # Mobile insert
    new_content, m_count = mobile_pattern.subn(
        r'\1\n                        <a class="m-sub-item" href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a>',
        new_content
    )
    
    # Footer insert
    new_content, f_count = footer_pattern.subn(
        r'\1\n                        <li><a href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a></li>',
        new_content
    )
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as out:
            out.write(new_content)
        updated_files.append((f, d_count, m_count, f_count))
        print(f"Updated {f}: Desktop={d_count}, Mobile={m_count}, Footer={f_count}")

print(f"\nTotal files updated: {len(updated_files)}")

