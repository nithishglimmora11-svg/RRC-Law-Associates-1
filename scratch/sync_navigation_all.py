import glob, os, re

files = sorted(glob.glob("*.html")) + ['nri-landlord-tenant-eviction/index.html']
print(f"Total files to process: {len(files)}")

updated_files = []
already_present = []

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        content = fp.read()

    # Determine litigation href for desktop
    desk_lit_m = re.search(r'href="([^"]*litigation-dispute-resolution[^"]*)"', content)
    desk_lit_href = desk_lit_m.group(1) if desk_lit_m else "litigation-dispute-resolution.html"
    
    if desk_lit_href == '/litigation-dispute-resolution':
        cb_desk_href = '/cheque-bounce-lawyer'
    elif desk_lit_href.startswith('/'):
        cb_desk_href = '/cheque-bounce-lawyer.html'
    else:
        cb_desk_href = 'cheque-bounce-lawyer.html'

    # Determine litigation href for mobile
    pos_mob = content.find('mobileMenu')
    if pos_mob != -1:
        mob_lit_m = re.search(r'href="([^"]*litigation-dispute-resolution[^"]*)"', content[pos_mob:])
        mob_lit_href = mob_lit_m.group(1) if mob_lit_m else "litigation-dispute-resolution.html"
    else:
        mob_lit_href = "litigation-dispute-resolution.html"

    if mob_lit_href == '/litigation-dispute-resolution':
        cb_mob_href = '/cheque-bounce-lawyer'
    elif mob_lit_href.startswith('/'):
        cb_mob_href = '/cheque-bounce-lawyer.html'
    else:
        cb_mob_href = 'cheque-bounce-lawyer.html'

    new_content = content
    modified = False

    # 1. Update Property Law label in desktop dropdown
    # Matches: >Due Diligence Frameworks<
    # Replace with: >Property Law &amp; Due Diligence<
    if re.search(r'<a\s+class=["\']dropdown-item\s+text-uppercase["\'][^>]*href=["\'][^"\']*property-law[^"\']*["\'][^>]*>\s*Due Diligence Frameworks\s*</a>', new_content, re.IGNORECASE):
        new_content = re.sub(
            r'(<a\s+class=["\']dropdown-item\s+text-uppercase["\'][^>]*href=["\'][^"\']*property-law[^"\']*["\'][^>]*>)\s*Due Diligence Frameworks\s*(</a>)',
            r'\1Property Law &amp; Due Diligence\2',
            new_content,
            flags=re.IGNORECASE
        )
        modified = True

    # 2. Update Property Law label in mobile menu
    if pos_mob != -1:
        # Match within mobile menu
        mob_chunk = new_content[pos_mob:]
        subbed_mob_chunk, count_mob = re.subn(
            r'(<a\s+class=["\']m-sub-item["\'][^>]*href=["\'][^"\']*property-law[^"\']*["\'][^>]*>)\s*(DOCUMENTATION,?\s*REGISTRATION\s*&amp;\s*DUE\s*DILIGENCE|Documentation,?\s*Registration\s*&amp;\s*Due\s*Diligence|DOCUMENTATION\s*&amp;\s*DUE\s*DILIGENCE|Due\s*Diligence\s*Frameworks)\s*(</a>)',
            r'\1PROPERTY LAW &amp; DUE DILIGENCE\3',
            mob_chunk,
            flags=re.IGNORECASE
        )
        if count_mob > 0:
            new_content = new_content[:pos_mob] + subbed_mob_chunk
            modified = True

    # 3. Add Cheque Bounce Lawyer to desktop dropdown under Core Practice Areas
    # Check if cheque-bounce-lawyer is already in the desktop dropdown
    desk_area = new_content[:pos_mob] if pos_mob != -1 else new_content
    if 'cheque-bounce-lawyer' not in desk_area:
        desk_item_pattern = re.compile(
            r'(<li>\s*<a\s+class=["\']dropdown-item\s+text-uppercase["\'](?:\s+style=["\'][^"\']*["\'])?\s+href=["\'][^"\']*litigation-dispute-resolution[^"\']*["\'][^>]*>.*?</a>\s*</li>)',
            re.IGNORECASE | re.DOTALL
        )
        def replace_desk(m):
            block = m.group(1)
            has_style = 'style="font-size: 14px;"' in block or "style='font-size: 14px;'" in block
            style_attr = ' style="font-size: 14px;"' if has_style else ''
            new_item = f'\n                        <li>\n                            <a class="dropdown-item text-uppercase"{style_attr} href="{cb_desk_href}">Cheque Bounce Lawyer</a>\n                        </li>'
            return block + new_item

        new_content, count = desk_item_pattern.subn(replace_desk, new_content, count=1)
        if count > 0:
            modified = True
        else:
            print(f"WARNING: Desktop litigation item not matched in {f}")

    # 4. Add Cheque Bounce Lawyer to mobile menu under Core Practice Areas
    pos_mob = new_content.find('mobileMenu')
    if pos_mob != -1:
        mob_area = new_content[pos_mob:]
        if 'cheque-bounce-lawyer' not in mob_area:
            # Pattern matching litigation item in mobile menu
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
                    modified = True
                    break

    if modified:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        updated_files.append(f)
    else:
        already_present.append(f)

print(f"\nUpdated {len(updated_files)} files.")
print(f"Skipped / Already present in {len(already_present)} files.")

