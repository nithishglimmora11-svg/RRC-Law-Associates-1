with open('nri-landlord-tenant-eviction.html', encoding='utf-8') as f:
    c = f.read()

# Desktop
old_desktop = """                        <li>
                            <a class="dropdown-item text-uppercase active" href="/nri-landlord-tenant-eviction/" style="color: var(--gold) !important; font-weight: 600;">Landlord\u2013Tenant &amp; Eviction</a>
                        </li>"""

new_desktop = """                        <li>
                            <a class="dropdown-item text-uppercase active" href="/nri-landlord-tenant-eviction/" style="color: var(--gold) !important; font-weight: 600;">Landlord\u2013Tenant &amp; Eviction</a>
                        </li>
                        <li>
                            <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="/nri-rera-builder-disputes/">RERA &amp; Builder Disputes</a>
                        </li>"""

# Mobile
old_mobile = """                    <a class="m-sub-item" href="/nri-landlord-tenant-eviction/" style="color: var(--gold) !important; font-weight: 600;">Landlord\u2013Tenant &amp; Eviction</a>"""
new_mobile = """                    <a class="m-sub-item" href="/nri-landlord-tenant-eviction/" style="color: var(--gold) !important; font-weight: 600;">Landlord\u2013Tenant &amp; Eviction</a>
                    <a class="m-sub-item" href="/nri-rera-builder-disputes/">RERA &amp; Builder Disputes</a>"""

assert old_desktop in c, "old_desktop not found"
c = c.replace(old_desktop, new_desktop, 1)

assert old_mobile in c, "old_mobile not found"
c = c.replace(old_mobile, new_mobile, 1)

with open('nri-landlord-tenant-eviction.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Successfully updated nri-landlord-tenant-eviction.html navigation")

