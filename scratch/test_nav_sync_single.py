import re

def update_nav_content(content, filename):
    # Determine the link format used in this file for litigation
    # Check desktop
    desk_lit_m = re.search(r'href="([^"]*litigation-dispute-resolution[^"]*)"', content)
    desk_lit_href = desk_lit_m.group(1) if desk_lit_m else "litigation-dispute-resolution.html"
    
    if desk_lit_href.startswith('/litigation-dispute-resolution.html'):
        cb_desk_href = '/cheque-bounce-lawyer.html'
    elif desk_lit_href.startswith('/litigation-dispute-resolution'):
        cb_desk_href = '/cheque-bounce-lawyer'
    elif desk_lit_href.startswith('https://'):
        cb_desk_href = 'cheque-bounce-lawyer.html'
    else:
        cb_desk_href = 'cheque-bounce-lawyer.html'

    # Check mobile
    pos_mob = content.find('mobileMenu')
    if pos_mob != -1:
        mob_lit_m = re.search(r'href="([^"]*litigation-dispute-resolution[^"]*)"', content[pos_mob:])
        mob_lit_href = mob_lit_m.group(1) if mob_lit_m else "litigation-dispute-resolution.html"
    else:
        mob_lit_href = "litigation-dispute-resolution.html"

    if mob_lit_href.startswith('/litigation-dispute-resolution.html'):
        cb_mob_href = '/cheque-bounce-lawyer.html'
    elif mob_lit_href.startswith('/litigation-dispute-resolution'):
        cb_mob_href = '/cheque-bounce-lawyer'
    else:
        cb_mob_href = 'cheque-bounce-lawyer.html'

    new_content = content

    # 1. Update Property Law label in desktop dropdown
    # Matches: >Due Diligence Frameworks<
    # Replace with: >Property Law &amp; Due Diligence<
    new_content = re.sub(
        r'(<a\s+class=["\']dropdown-item\s+text-uppercase["\'][^>]*href=["\'][^"\']*property-law[^"\']*["\'][^>]*>)\s*Due Diligence Frameworks\s*(</a>)',
        r'\1Property Law &amp; Due Diligence\2',
        new_content,
        flags=re.IGNORECASE
    )

    # 2. Update Property Law label in mobile menu
    new_content = re.sub(
        r'(<a\s+class=["\']m-sub-item["\'][^>]*href=["\'][^"\']*property-law[^"\']*["\'][^>]*>)\s*(DOCUMENTATION,?\s*REGISTRATION\s*&amp;\s*DUE\s*DILIGENCE|Documentation,?\s*Registration\s*&amp;\s*Due\s*Diligence|DOCUMENTATION\s*&amp;\s*DUE\s*DILIGENCE|Due\s*Diligence\s*Frameworks)\s*(</a>)',
        r'\1PROPERTY LAW &amp; DUE DILIGENCE\3',
        new_content,
        flags=re.IGNORECASE
    )

    # 3. Add Cheque Bounce Lawyer to desktop dropdown under Core Practice Areas
    # If not already present
    if cb_desk_href not in new_content and 'cheque-bounce-lawyer' not in new_content[:pos_mob if pos_mob != -1 else len(new_content)]:
        # Find the <li> for litigation in desktop dropdown
        # Pattern matching: <li>\s*<a class="dropdown-item text-uppercase"[^>]*href="[^"]*litigation-dispute-resolution[^"]*"[^>]*>.*?</a>\s*</li>
        desk_item_pattern = re.compile(
            r'(<li>\s*<a\s+class=["\']dropdown-item\s+text-uppercase["\'](?:\s+style=["\'][^"\']*["\'])?\s+href=["\'][^"\']*litigation-dispute-resolution[^"\']*["\'][^>]*>.*?</a>\s*</li>)',
            re.IGNORECASE | re.DOTALL
        )
        def replace_desk(m):
            block = m.group(1)
            # detect if font-size: 14px style was used
            has_style = 'style="font-size: 14px;"' in block or "style='font-size: 14px;'" in block
            style_attr = ' style="font-size: 14px;"' if has_style else ''
            new_item = f'\n                        <li>\n                            <a class="dropdown-item text-uppercase"{style_attr} href="{cb_desk_href}">Cheque Bounce Lawyer</a>\n                        </li>'
            return block + new_item

        new_content, count = desk_item_pattern.subn(replace_desk, new_content, count=1)
        if count == 0:
            print(f"WARNING: Desktop item not matched in {filename}")

    # 4. Add Cheque Bounce Lawyer to mobile menu under Core Practice Areas
    # Search within mobileMenu
    if pos_mob != -1:
        # Check if cheque-bounce-lawyer already in mobileMenu
        if 'cheque-bounce-lawyer' not in new_content[pos_mob:]:
            mob_item_pattern = re.compile(
                r'(<a\s+class=["\']m-sub-item["\']\s+href=["\'][^"\']*litigation-dispute-resolution[^"\']*["\']>.*?</a>)',
                re.IGNORECASE
            )
            # Find the match after pos_mob
            matches = list(mob_item_pattern.finditer(new_content))
            for m in matches:
                if m.start() >= pos_mob:
                    block = m.group(1)
                    new_item = f'\n                        <a class="m-sub-item" href="{cb_mob_href}">CHEQUE BOUNCE LAWYER</a>'
                    new_content = new_content[:m.end()] + new_item + new_content[m.end():]
                    break

    return new_content

# Test on index.html
with open('index.html', encoding='utf-8') as f:
    orig = f.read()

updated = update_nav_content(orig, 'index.html')
print("Changes in index.html:")
print("  'Property Law &amp; Due Diligence' in updated:", 'Property Law &amp; Due Diligence' in updated)
print("  'PROPERTY LAW &amp; DUE DILIGENCE' in updated:", 'PROPERTY LAW &amp; DUE DILIGENCE' in updated)
print("  'Cheque Bounce Lawyer' in updated:", 'Cheque Bounce Lawyer' in updated)
print("  'CHEQUE BOUNCE LAWYER' in updated:", 'CHEQUE BOUNCE LAWYER' in updated)

# Show snippet of desktop Core Practice Areas
m = re.search(r'<div class="dropdown">.*?Core Practice Areas.*?</ul>\s*</div>', updated, re.S)
if m:
    print("\n--- NEW DESKTOP CORE PRACTICE AREAS DROPDOWN ---")
    print(m.group(0))

# Show snippet of mobile Core Practice Areas
pos = updated.find('Core Practice Areas')
pos2 = updated.find('Core Practice Areas', pos+20)
if pos2 != -1:
    end = updated.find('</div>\n                </div>', pos2)
    print("\n--- NEW MOBILE CORE PRACTICE AREAS MENU ---")
    print(updated[pos2-100:end+20].encode('ascii', errors='replace').decode('ascii'))

