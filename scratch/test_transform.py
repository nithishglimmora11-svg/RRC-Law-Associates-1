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

def transform_html(html, fname):
    original = html
    
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
        # replace href="slug.html" with href="/slug/"
        html = re.sub(rf'href=["\']{slug}\.html(["\'])', rf'href="/{slug}/\1', html)
        html = re.sub(rf'href=["\']\./{slug}\.html(["\'])', rf'href="/{slug}/\1', html)

    # 6. Common navigation and site-wide page links
    # index.html
    html = re.sub(r'href=["\']index\.html#contact["\']', 'href="/#contact"', html)
    html = re.sub(r'href=["\']index\.html["\']', 'href="/"', html)
    html = re.sub(r'href=["\']\./index\.html["\']', 'href="/"', html)

    # other site pages
    site_pages = [
        'booking', 'partners', 'nri-services', 'core-practice-areas',
        'family-law', 'intellectual-property', 'employment-law',
        'white-collar-crime', 'property-law', 'cyber-law',
        'litigation-dispute-resolution', 'sectors', 'lawfirm-blog',
        'oci-card-assistance', 'nri-property-disputes', 'nri-power-of-attorney',
        'nri-criminal-case', 'nri-family-matrimonial'
    ]
    for page in site_pages:
        html = re.sub(rf'href=["\'](?:\./)?{page}\.html(["\'])', rf'href="/{page}.html\1', html)
        # sectors anchors
        html = re.sub(rf'href=["\'](?:\./)?sectors\.html#([^"\']+)["\']', r'href="/sectors.html#\1"', html)

    # 7. Add mobile menu toggle script if missing
    has_toggle = 'id="menuToggle"' in html
    has_listener = 'menuToggle.addEventListener' in html or "getElementById('menuToggle')" in html
    if has_toggle and not has_listener:
        menu_script = """    <script>
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
        # Insert after bootstrap bundle script
        bootstrap_needle = 'src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>'
        if bootstrap_needle in html:
            html = html.replace(bootstrap_needle, bootstrap_needle + '\n' + menu_script)
        else:
            # fallback: before </body>
            html = html.replace('</body>', menu_script + '\n</body>')

    return html

with open('oci-card-application-documents.html', 'r', encoding='utf-8') as f:
    orig = f.read()

new_html = transform_html(orig, 'oci-card-application-documents.html')
print("Transformed length diff:", len(new_html) - len(orig))

# Check remaining relative links
rem_src = re.findall(r'\bsrc=["\']([^"\']+)["\']', new_html)
rem_src_rel = [s for s in rem_src if not s.startswith(('http', '/', 'data:', 'mailto:', 'tel:'))]
print("Remaining relative src:", rem_src_rel)

rem_link = re.findall(r'<link\s+[^>]*href=["\']([^"\']+)["\']', new_html)
rem_link_rel = [h for h in rem_link if not h.startswith(('http', '/', '#', 'mailto:', 'tel:'))]
print("Remaining relative link hrefs:", rem_link_rel)

rem_a = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', new_html)
rem_a_rel = [h for h in rem_a if not h.startswith(('http', '/', '#', 'mailto:', 'tel:'))]
print("Remaining relative a hrefs:", rem_a_rel)
