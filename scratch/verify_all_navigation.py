import glob, os, re

files = sorted(glob.glob("*.html")) + ['nri-landlord-tenant-eviction/index.html']
print(f"Total HTML files to verify: {len(files)}")

desk_cb_present = 0
desk_cb_missing = []
mob_cb_present = 0
mob_cb_missing = []

desk_pl_present = 0
desk_pl_missing = []
mob_pl_present = 0
mob_pl_missing = []

nri_has_cb = []
nri_has_pl = []

duplicate_issues = []

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()

    pos_mob = content.find('id="mobileMenu"')
    if pos_mob == -1:
        pos_mob = content.find('id=\'mobileMenu\'')
    if pos_mob == -1:
        pos_mob = content.find('mobileMenu')

    desk_content = content[:pos_mob] if pos_mob != -1 else content
    mob_content = content[pos_mob:] if pos_mob != -1 else ""

    # --- DESKTOP CHECKS ---
    # Specifically match the dropdown anchor for Core Practice Areas
    m_desk_core = re.search(r'<a[^>]*>\s*Core Practice Areas.*?</ul>', desk_content, re.DOTALL | re.IGNORECASE)
    if m_desk_core:
        core_block = m_desk_core.group(0)
        # Check cheque bounce lawyer
        if 'cheque-bounce-lawyer' in core_block:
            desk_cb_present += 1
            cb_count = len(re.findall(r'href=["\'][^"\']*cheque-bounce-lawyer', core_block))
            if cb_count > 1:
                duplicate_issues.append((f, "desktop cheque-bounce-lawyer duplicated", cb_count))
        else:
            desk_cb_missing.append(f)

        # Check property law
        if 'property-law' in core_block and ('Property Law &amp; Due Diligence' in core_block or 'Property Law & Due Diligence' in core_block):
            desk_pl_present += 1
            pl_count = len(re.findall(r'href=["\'][^"\']*property-law', core_block))
            if pl_count > 1:
                duplicate_issues.append((f, "desktop property-law duplicated", pl_count))
        else:
            desk_pl_missing.append(f)
    else:
        desk_cb_missing.append((f, "no desktop Core Practice Areas dropdown found"))
        desk_pl_missing.append((f, "no desktop Core Practice Areas dropdown found"))

    # --- NRI SERVICES DESKTOP CHECK ---
    m_desk_nri = re.search(r'<a[^>]*>\s*NRI Services.*?</ul>', desk_content, re.DOTALL | re.IGNORECASE)
    if m_desk_nri:
        nri_block = m_desk_nri.group(0)
        if 'cheque-bounce-lawyer' in nri_block:
            nri_has_cb.append((f, "desktop NRI has cheque bounce"))
        if 'property-law' in nri_block:
            nri_has_pl.append((f, "desktop NRI has property law"))

    # --- MOBILE CHECKS ---
    if pos_mob != -1:
        # Find CORE PRACTICE AREAS in mobile
        # Matches <a ...>CORE PRACTICE AREAS...</div>
        m_mob_core = re.search(r'PRACTICE AREAS.*?</div>\s*(?:</div>|<a)', mob_content, re.DOTALL | re.IGNORECASE)
        if m_mob_core:
            mob_core_block = m_mob_core.group(0)
            if 'cheque-bounce-lawyer' in mob_core_block:
                mob_cb_present += 1
                cb_count = len(re.findall(r'href=["\'][^"\']*cheque-bounce-lawyer', mob_core_block))
                if cb_count > 1:
                    duplicate_issues.append((f, "mobile cheque-bounce-lawyer duplicated", cb_count))
            else:
                mob_cb_missing.append(f)

            if 'property-law' in mob_core_block and ('PROPERTY LAW &amp; DUE DILIGENCE' in mob_core_block or 'PROPERTY LAW & DUE DILIGENCE' in mob_core_block):
                mob_pl_present += 1
                pl_count = len(re.findall(r'href=["\'][^"\']*property-law', mob_core_block))
                if pl_count > 1:
                    duplicate_issues.append((f, "mobile property-law duplicated", pl_count))
            else:
                mob_pl_missing.append(f)
        else:
            mob_cb_missing.append((f, "no mobile PRACTICE AREAS block found"))
            mob_pl_missing.append((f, "no mobile PRACTICE AREAS block found"))

        # NRI Services mobile check
        m_mob_nri = re.search(r'NRI SERVICES.*?</div>\s*(?:</div>|<a)', mob_content, re.DOTALL | re.IGNORECASE)
        if m_mob_nri:
            mob_nri_block = m_mob_nri.group(0)
            if 'cheque-bounce-lawyer' in mob_nri_block:
                nri_has_cb.append((f, "mobile NRI has cheque bounce"))
            if 'property-law' in mob_nri_block:
                nri_has_pl.append((f, "mobile NRI has property law"))
    else:
        mob_cb_missing.append((f, "no mobileMenu found"))
        mob_pl_missing.append((f, "no mobileMenu found"))

print("\n--- FINAL AUDIT SUMMARY ---")
print(f"Desktop Core Practice Areas with Cheque Bounce Lawyer: {desk_cb_present} / {len(files)}")
if desk_cb_missing:
    print(f"  Missing: {desk_cb_missing}")

print(f"Mobile Core Practice Areas with Cheque Bounce Lawyer: {mob_cb_present} / {len(files)}")
if mob_cb_missing:
    print(f"  Missing: {mob_cb_missing}")

print(f"Desktop Core Practice Areas with Property Law & Due Diligence: {desk_pl_present} / {len(files)}")
if desk_pl_missing:
    print(f"  Missing: {desk_pl_missing}")

print(f"Mobile Core Practice Areas with PROPERTY LAW & DUE DILIGENCE: {mob_pl_present} / {len(files)}")
if mob_pl_missing:
    print(f"  Missing: {mob_pl_missing}")

print(f"Accidental NRI Services presence - Cheque Bounce: {len(nri_has_cb)}")
if nri_has_cb:
    print(f"  Found in: {nri_has_cb}")

print(f"Accidental NRI Services presence - Property Law: {len(nri_has_pl)}")
if nri_has_pl:
    print(f"  Found in: {nri_has_pl}")

print(f"Duplicates detected: {len(duplicate_issues)}")
if duplicate_issues:
    print(f"  Duplicates: {duplicate_issues}")

