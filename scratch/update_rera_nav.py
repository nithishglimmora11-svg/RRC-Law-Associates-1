with open('nri-rera-builder-disputes.html', encoding='utf-8') as f:
    c = f.read()

# Desktop
old_desktop = """                        <li>
                            <a class="dropdown-item text-uppercase active" href="/nri-rera-builder-disputes/" style="color: var(--gold) !important; font-weight: 600;">RERA &amp; Builder Disputes</a>
                        </li>"""

new_desktop = """                        <li>
                            <a class="dropdown-item text-uppercase active" href="/nri-rera-builder-disputes/" style="color: var(--gold) !important; font-weight: 600;">RERA &amp; Builder Disputes</a>
                        </li>
                        <li>
                            <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a>
                        </li>"""

# Mobile
old_mobile = """                    <a class="m-sub-item" href="/nri-rera-builder-disputes/" style="color: var(--gold) !important; font-weight: 600;">RERA &amp; Builder Disputes</a>"""
new_mobile = """                    <a class="m-sub-item" href="/nri-rera-builder-disputes/" style="color: var(--gold) !important; font-weight: 600;">RERA &amp; Builder Disputes</a>
                    <a class="m-sub-item" href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a>"""

assert old_desktop in c, "old_desktop not found"
c = c.replace(old_desktop, new_desktop, 1)

assert old_mobile in c, "old_mobile not found"
c = c.replace(old_mobile, new_mobile, 1)

with open('nri-rera-builder-disputes.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated nri-rera-builder-disputes.html nav successfully")

