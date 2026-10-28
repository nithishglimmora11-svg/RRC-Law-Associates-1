import os, re

files = [f for f in os.listdir('.') if f.endswith('.html') and f not in [
    'index.html', 'nri-services.html', 'wills-probate-estate-administration.html', 
    'booking.html', 'nri-landlord-tenant-eviction.html'
]]

print(f"Candidate files: {len(files)}")

# 1. Desktop regex
# Matches: <a class="dropdown-item text-uppercase"... href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>\s*</li>
desktop_pattern = re.compile(
    r'(<a\s+class=["\']dropdown-item\s+text-uppercase["\'][^>]*href=["\']/wills-probate-estate-administration["\']>Wills,\s*Probate\s*&amp;\s*Estate\s*Administration</a>\s*</li>)',
    re.IGNORECASE
)

# 2. Mobile regex
# Matches: <a class="m-sub-item"... href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>
mobile_pattern = re.compile(
    r'(<a\s+class=["\']m-sub-item["\'][^>]*href=["\']/wills-probate-estate-administration["\']>Wills,\s*Probate\s*&amp;\s*Estate\s*Administration</a>)',
    re.IGNORECASE
)

updated_count = 0
for f in files:
    content = open(f, encoding='utf-8').read()
    if 'wills-probate-estate-administration' not in content:
        continue
    
    new_content = content
    if not re.search(r'/nri-landlord-tenant-eviction/?', new_content):
        # Insert in desktop
        new_content, d_count = desktop_pattern.subn(
            r'\1\n                            <li>\n                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="/nri-landlord-tenant-eviction/">Landlord–Tenant &amp; Eviction</a>\n                            </li>',
            new_content
        )
        
        # Insert in mobile
        new_content, m_count = mobile_pattern.subn(
            r'\1\n                        <a class="m-sub-item" href="/nri-landlord-tenant-eviction/">Landlord–Tenant &amp; Eviction</a>',
            new_content
        )
        
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as out:
                out.write(new_content)
            updated_count += 1
            print(f"Updated {f} (desktop: {d_count}, mobile: {m_count})")

print(f"\nDone! Total files updated: {updated_count}")

