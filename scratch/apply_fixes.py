import re

OCI_SLUGS = [
    'oci-legal-guides',
    'oci-card-eligibility-legal-status',
    'oci-vs-nri-vs-indian-citizen',
    'oci-card-application-documents',
    'oci-card-indian-ancestry-assistance',
    'oci-foreign-spouse-eligibility',
    'oci-for-children-born-abroad',
    'oci-card-benefits-restrictions-india',
    'oci-cardholders-inherit-sell-ancestral-property-india',
    'nri-oci-property-due-diligence-india',
    'nri-oci-property-tax-india',
    'oci-card-renewal-passport-update',
    'oci-card-cancellation-grounds-remedies',
    'oci-card-cancellation-section-7d-legal-remedies'
]

SITE_PAGES = [
    'booking', 'partners', 'nri-services', 'core-practice-areas',
    'family-law', 'intellectual-property', 'employment-law',
    'white-collar-crime', 'property-law', 'cyber-law',
    'litigation-dispute-resolution', 'sectors', 'lawfirm-blog',
    'oci-card-assistance', 'nri-property-disputes', 'nri-power-of-attorney',
    'nri-criminal-case', 'nri-family-matrimonial'
]

MENU_SCRIPT = """    <script>
        // Mobile Drawer Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const closeMenu = document.getElementById('closeMenu');
        const mobileMenu = document.getElementById('mobileMenu');

        if (menuToggle && closeMenu && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('active');
            });
            closeMenu.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        }

        // Submenu triggers in mobile menu
        document.querySelectorAll('.m-trigger').forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    </script>
"""

def fix_html_content(html, fname):
    # 1. Stylesheets
    html = re.sub(r'href="style\.css(\?[^"]*)?"', r'href="/style.css\1"', html)
    html = re.sub(r'href="style2\.css(\?[^"]*)?"', r'href="/style2.css\1"', html)
    html = re.sub(r'href="topbar\.css(\?[^"]*)?"', r'href="/topbar.css\1"', html)
    html = re.sub(r'href="oci-style\.css(\?[^"]*)?"', r'href="/oci-style.css\1"', html)

    # 2. Favicons / Manifest
    html = re.sub(r'href="assets/images/logo\.png"', r'href="/assets/images/logo.png"', html)
    html = re.sub(r'href="assets/images/apple-touch-icon\.png"', r'href="/assets/images/apple-touch-icon.png"', html)
    html = re.sub(r'href="favicon\.ico"', r'href="/favicon.ico"', html)

    # 3. All images with relative src="assets/images/..."
    html = re.sub(r'src="assets/images/', r'src="/assets/images/', html)

    # 4. Scripts with relative src="script.js..."
    html = re.sub(r'src="script\.js(\?[^"]*)?"', r'src="/script.js\1"', html)
    html = re.sub(r'src="script2\.js(\?[^"]*)?"', r'src="/script2.js\1"', html)

    # 5. OCI guide hrefs -> canonical clean URLs /<slug>/
    for slug in OCI_SLUGS:
        html = re.sub(rf'href=["\']{slug}\.html(["\'])', rf'href="/{slug}/\1', html)
        html = re.sub(rf'href=["\']\./{slug}\.html(["\'])', rf'href="/{slug}/\1', html)

    # 6. Common navigation and site-wide page links
    # index.html
    html = re.sub(r'href=["\']index\.html#contact["\']', 'href="/#contact"', html)
    html = re.sub(r'href=["\']index\.html["\']', 'href="/"', html)
    html = re.sub(r'href=["\']\./index\.html["\']', 'href="/"', html)

    # other site pages
    for page in SITE_PAGES:
        html = re.sub(rf'href=["\'](?:\./)?{page}\.html(["\'])', rf'href="/{page}.html\1', html)
        html = re.sub(rf'href=["\'](?:\./)?sectors\.html#([^"\']+)["\']', r'href="/sectors.html#\1"', html)

    # 7. Add mobile menu toggle script if missing
    has_toggle = 'id="menuToggle"' in html
    has_listener = 'menuToggle.addEventListener' in html or "getElementById('menuToggle')" in html
    if has_toggle and not has_listener:
        bootstrap_needle = 'src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>'
        if bootstrap_needle in html:
            html = html.replace(bootstrap_needle, bootstrap_needle + '\n' + MENU_SCRIPT)
        else:
            bootstrap_needle_530 = 'src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>'
            if bootstrap_needle_530 in html:
                html = html.replace(bootstrap_needle_530, bootstrap_needle_530 + '\n' + MENU_SCRIPT)
            else:
                html = html.replace('</body>', MENU_SCRIPT + '\n</body>')

    return html

files = [
    'oci-legal-guides.html',
    'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
    'oci-card-indian-ancestry-assistance.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html'
]

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        original = f.read()
    updated = fix_html_content(original, fname)
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(updated)
    print(f"Applied fixes to {fname} (length changed by {len(updated) - len(original)} chars)")
