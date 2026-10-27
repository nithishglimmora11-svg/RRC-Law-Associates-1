"""
RRC Law Associates — Website-Wide Header, Footer & Widget Audit Fix
===================================================================
This script fixes inconsistent headers, footers, WhatsApp floats and AI chat
widgets across all OCI article pages and service pages.

Approved Reference (from index.html):
- Topbar phone: +91 97511 82452
- Topbar email: dr.kumar@rrclawassociates.com
- Topbar hours: Mon – Sat: 10:00 AM – 10:00 PM
- Social icons: LinkedIn, Instagram, Facebook
- Logo: assets/images/rrclogo.png
- Nav: Home | NRI Services dropdown | Core Practice Areas dropdown | Partners | Blog | Contact | Book Consultation
- WhatsApp float: wa.me/919751182452
- AI chat: <div data-rrc-ai-chat-root></div>
"""

import re
import os
import shutil
from datetime import datetime

# ─────────────────────────────────────────────────────────────────────────────
# APPROVED TOPBAR (from index.html)
# ─────────────────────────────────────────────────────────────────────────────
APPROVED_TOPBAR = '''<!-- =========================================================
     TOP BAR
========================================================== -->

<div class="rrc-topbar">

    <div class="rrc-topbar-container">

        <!-- LEFT SIDE -->
        <div class="rrc-topbar-left">

            <a href="tel:+9197511 82452">
                <i class="bi bi-telephone-fill"></i>
                +91 97511 82452
            </a>

            <span class="rrc-topbar-divider"></span>

            <a href="mailto:dr.kumar@rrclawassociates.com">
                <i class="bi bi-envelope-fill"></i>
                dr.kumar@rrclawassociates.com
            </a>

        </div>


        <!-- RIGHT SIDE -->
        <div class="rrc-topbar-right">

            <span>
                <i class="bi bi-clock"></i>
                Mon &#8211; Sat: 10:00 AM &#8211; 10:00 PM
            </span>

            <span class="rrc-topbar-divider"></span>

            <a href="https://www.linkedin.com/company/rrclawassociates/" aria-label="LinkedIn">
                <i class="bi bi-linkedin"></i>
            </a>

            <a href="https://www.instagram.com/rrclawassociates/" aria-label="Instagram">
                <i class="bi bi-instagram"></i>
            </a>

            <a href="https://www.facebook.com/rrclawassociates/" aria-label="Facebook">
                <i class="bi bi-facebook"></i>
            </a>

        </div>

    </div>

</div>
'''

# ─────────────────────────────────────────────────────────────────────────────
# APPROVED HEADER NAV (from index.html)
# ─────────────────────────────────────────────────────────────────────────────
APPROVED_HEADER = '''        <header class="header">
            <nav class="container d-flex align-items-center justify-content-between">
                <a href="index.html">
                    <img src="assets/images/rrclogo.png" alt="RRC Logo" class="logo-img">
                </a>

                <div class="d-none d-lg-flex align-items-center ms-auto">
                    <div class="dropdown">
                        <a
                            class="nav-link-custom border-0 bg-transparent p-0"
                            href="index.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Home
                        </a>
                    </div>
                    <div class="dropdown">
                        <a
                            class="nav-link-custom dropdown-toggle border-0 bg-transparent p-0"
                            href="nri-services.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            NRI Services
                        </a>
                        <ul class="dropdown-menu shadow-lg">
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="oci-card-assistance.html">OCI Card &amp; Ancestry Assistance</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-property-disputes.html">Property Dispute</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-power-of-attorney.html">Power of Attorney</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-criminal-case.html">Criminal Cases</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-family-matrimonial.html">Family &amp; Matrimonial</a>
                            </li>
                        </ul>
                    </div>
                    <div class="dropdown">
                        <a
                            class="nav-link-custom dropdown-toggle border-0 bg-transparent p-0"
                            href="core-practice-areas.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Core Practice Areas
                        </a>
                        <ul class="dropdown-menu shadow-lg">
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="family-law.html">Family Law Workspace</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="intellectual-property.html">Intellectual Property Advisory</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="employment-law.html">Labour &amp; Employment Protection</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="white-collar-crime.html">White Collar Crime Defense</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="property-law.html">Due Diligence Frameworks</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="cyber-law.html">Cyber Law Desk</a>
                            </li>
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="litigation-dispute-resolution.html">Litigation &amp; Dispute Resolution</a>
                            </li>
                        </ul>
                    </div>
                    <div class="dropdown">
                        <a
                            class="nav-link-custom border-0 bg-transparent p-0"
                            href="./partners.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Partners
                        </a>
                    </div>
                    <div class="dropdown">
                        <a
                            class="nav-link-custom border-0 bg-transparent p-0"
                            href="lawfirm-blog.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Blog
                        </a>
                    </div>
                    <div class="dropdown">
                        <a
                            class="nav-link-custom border-0 bg-transparent p-0"
                            href="index.html#contact"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Contact
                        </a>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-3">
                    <div class="cta d-none d-sm-block">
                        <a href="./booking.html" class="btn btn-gold">Book Consultation</a>
                    </div>
                    <button class="btn text-white d-lg-none fs-3 p-0" id="menuToggle">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>
            </nav>
        </header>

        <div class="mobile-menu" id="mobileMenu">
            <button class="close-menu" id="closeMenu">&#x2715;</button>
            <div class="mt-5">
                <a href="index.html" class="m-link">Home</a>
                <div class="m-dropdown">
                    <a class="m-link m-trigger" href="nri-services.html">
                        NRI Services <i class="fa fa-chevron-down ms-2"></i>
                    </a>
                    <div class="m-submenu" id="mPracticeMenu">
                        <a class="m-sub-item" href="oci-card-assistance.html">OCI Card &amp; Ancestry Assistance</a>
                        <a class="m-sub-item" href="nri-property-disputes.html">Property Dispute</a>
                        <a class="m-sub-item" href="nri-power-of-attorney.html">Power of Attorney</a>
                        <a class="m-sub-item" href="nri-criminal-case.html">Criminal Case</a>
                        <a class="m-sub-item" href="nri-family-matrimonial.html">Family &amp; Matrimonial</a>
                    </div>
                </div>
                <div class="m-dropdown">
                    <a class="m-link m-trigger" href="core-practice-areas.html">
                        Core Practice Areas <i class="fa fa-chevron-down ms-2"></i>
                    </a>
                    <div class="m-submenu" id="mPracticeMenu2">
                        <a class="m-sub-item" href="family-law.html">FAMILY, SUCCESSION &amp; PRIVATE CLIENT PRACTICE</a>
                        <a class="m-sub-item" href="intellectual-property.html">INTELLECTUAL PROPERTY &amp; INNOVATION PROTECTION</a>
                        <a class="m-sub-item" href="employment-law.html">LABOUR, EMPLOYMENT &amp; INDUSTRIAL RELATIONS</a>
                        <a class="m-sub-item" href="white-collar-crime.html">WHITE COLLAR CRIMES &amp; FINANCIAL INVESTIGATIONS</a>
                        <a class="m-sub-item" href="property-law.html">DOCUMENTATION, REGISTRATION &amp; DUE DILIGENCE</a>
                        <a class="m-sub-item" href="cyber-law.html">CYBER LAW, DATA PROTECTION &amp; DIGITAL EVIDENCE</a>
                        <a class="m-sub-item" href="litigation-dispute-resolution.html">LITIGATION &amp; DISPUTE RESOLUTION</a>
                    </div>
                </div>
                <a href="partners.html" class="m-link">Partners</a>
                <a href="lawfirm-blog.html" class="m-link">Blog</a>
                <a href="index.html#contact" class="m-link">Contact</a>

                <div class="mt-4">
                    <a href="./booking.html" class="btn btn-gold w-100 py-3 text-center">Book Consultation</a>
                </div>
            </div>
        </div>
'''

# ─────────────────────────────────────────────────────────────────────────────
# APPROVED FOOTER (from index.html style, adapted for article pages)
# ─────────────────────────────────────────────────────────────────────────────
APPROVED_FOOTER = '''        <footer class="footer">
        <div class="footer-contain">

            <div class="footer-grid">

                <!-- Brand -->
                <div class="footer-brand">
                    <div class="logo-icon">
                        <a href="index.html" title="Home">
                            <img src="assets/images/logo.png" alt="Law Firm Logo" class="logo-img">

                            <div>
                                <strong>RRC</strong>
                                <strong>Law Associates</strong>
                            </div>
                        </a>
                    </div>

                    <p>
                        Providing trusted legal solutions with integrity since 2008. Your reliable
                        partner for all legal matters in Tamil Nadu.
                    </p>

                    <div class="social"></div>
                </div>

                <!-- Practice Areas -->
                <div>
                    <h4>Practice Areas</h4>
                    <ul>
                        <li>
                            <a href="family-law.html">Family Law</a>
                        </li>
                        <li>
                            <a href="property-law.html">Property Law</a>
                        </li>
                        <li>
                            <a href="employment-law.html">Employment Law</a>
                        </li>
                        <li>
                            <a href="white-collar-crime.html">White Collar Crimes</a>
                        </li>
                        <li>
                            <a href="intellectual-property.html">Intellectual Property</a>
                        </li>
                        <li>
                            <a href="litigation-dispute-resolution.html">Litigation Dispute</a>
                        </li>
                    </ul>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4>Quick Links</h4>
                    <ul>
                        <li>
                            <a href="index.html">Home</a>
                        </li>
                        <li>
                            <a href="nri-services.html">NRI Services</a>
                        </li>
                        <li>
                            <a href="oci-card-assistance.html">OCI Card &amp; Ancestry</a>
                        </li>
                        <li>
                            <a href="core-practice-areas.html">Practice Areas</a>
                        </li>
                        <li>
                            <a href="lawfirm-blog.html">Blog</a>
                        </li>
                        <li>
                            <a href="index.html#contact">Contact</a>
                        </li>
                    </ul>
                </div>

                <!-- Contact -->
                <div>
                    <h4>Contact Us</h4>
                    <ul class="contact">
                        <li>
                            <span>Address</span>
                            <p>
                                No 82/6B, Deen Complex, Mary's Corner, Parisutham Nagar, Thanjavur, Tamil Nadu-613001
                            </p>
                        </li>
                        <li>
                            <span>Phone</span>
                            <a href="tel:+919751182452">+91 97511 82452</a>
                        </li>
                        <li>
                            <span>Email</span>
                            <a href="mailto:dr.kumar@rrclawassociates.com">
                                dr.kumar@rrclawassociates.com
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            <!-- Bottom -->
            <div class="footer-bottom">
                <p>&copy;
                    <span id="year">2026</span>
                    RRC Law Associates. All rights reserved.</p>
                <div class="legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms</a>
                    <a href="#">Disclaimer</a>
                </div>
            </div>

        </div>
        </footer>
'''

# ─────────────────────────────────────────────────────────────────────────────
# WHATSAPP FLOAT + AI CHAT ROOT (from index.html)
# ─────────────────────────────────────────────────────────────────────────────
WHATSAPP_FLOAT = '''        <a
            href="https://wa.me/919751182452?text=Hello RRC Law Associates, I am looking for legal consultation."
            class="whatsapp-float"
            target="_blank">
            <i class="fab fa-whatsapp"></i>
            <span class="float-text">Chat with us</span>
        </a>

<div data-rrc-ai-chat-root></div>'''

# ─────────────────────────────────────────────────────────────────────────────
# MOBILE MENU JS (from index.html pattern)
# ─────────────────────────────────────────────────────────────────────────────
MOBILE_MENU_JS = '''<script>
document.addEventListener('DOMContentLoaded', function () {
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });
}

if (closeMenu && mobileMenu) {
    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
}

// Close on outside click
document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mobileMenu.classList.remove('open');
        }
    }
});

// Mobile submenu accordion
const mobileTriggers = document.querySelectorAll('.m-trigger');
mobileTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
        const submenu = this.nextElementSibling;
        if (!submenu) return;
        if (!submenu.classList.contains('active')) {
            e.preventDefault();
            document.querySelectorAll('.m-submenu').forEach(m => m.classList.remove('active'));
            submenu.classList.add('active');
        }
    });
});
});
</script>
'''

# ─────────────────────────────────────────────────────────────────────────────
# GROUP 1: Pages with WRONG topbar (phone, email), wrong logo, missing footer/widgets
# These pages have their OWN topbar+header+footer that need to be replaced entirely.
# ─────────────────────────────────────────────────────────────────────────────
GROUP1_PAGES = [
    # OCI article blogs (Blogs 5-8, 10-14 pattern)
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html',
    'oci-vs-nri-vs-indian-citizen.html',
]

# ─────────────────────────────────────────────────────────────────────────────
# GROUP 2: Pages with correct topbar but missing whatsapp float + ai chat
# ─────────────────────────────────────────────────────────────────────────────
GROUP2_PAGES = [
    'oci-card-application-documents.html',
    'oci-card-eligibility-legal-status.html',
]

# ─────────────────────────────────────────────────────────────────────────────
# GROUP 3: Pages with correct topbar+whatsapp but missing ai chat only
# ─────────────────────────────────────────────────────────────────────────────
GROUP3_PAGES = [
    'oci-card-assistance.html',
]


def backup_file(filepath):
    """Create a timestamped backup before modifying."""
    backup_path = filepath + '.bak'
    shutil.copy2(filepath, backup_path)
    print(f'  [BACKUP] {os.path.basename(filepath)} -> {os.path.basename(backup_path)}')


def fix_group1_page(filepath):
    """
    Replace the old topbar+header section with the approved topbar+header.
    Replace the old footer with the approved footer.
    Add WhatsApp float + AI chat root before </body>.
    Remove the old mobile menu JavaScript and replace with approved version.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # ── 1. Replace topbar block ──────────────────────────────────────────────
    # Old pattern: starts with <!-- Preserved Topbar --> or similar comment,
    # goes through <div class="rrc-topbar">...</div>
    # then <header class="header">...</header>
    # then mobile drawer <div class="mobile-menu"...>...</div>
    # We replace all of that with the approved topbar + approved header.

    # Find start of the old topbar (first occurrence of rrc-topbar div in body)
    body_start = content.find('<body>')
    if body_start == -1:
        body_start = 0

    # Find the old topbar start (may be preceded by a comment)
    topbar_div_pos = content.find('<div class="rrc-topbar">', body_start)
    if topbar_div_pos == -1:
        print(f'  [SKIP] No rrc-topbar found in {filepath}')
        return False

    # Go back to find any preceding comment for topbar
    # Check 200 chars before topbar_div_pos for a comment
    preamble_search = content[max(body_start, topbar_div_pos - 300):topbar_div_pos]
    comment_match = list(re.finditer(r'<!--[^>]*[Tt]op\s*[Bb]ar[^>]*-->', preamble_search))
    if comment_match:
        last_comment = comment_match[-1]
        insert_start = max(body_start, topbar_div_pos - 300) + last_comment.start()
    else:
        insert_start = topbar_div_pos

    # Find end of mobile drawer </div>
    # The mobile drawer is <div class="mobile-menu" ...>...</div>
    mobile_div_pos = content.find('<div class="mobile-menu"', topbar_div_pos)
    if mobile_div_pos == -1:
        # No mobile menu — find end of </header> instead
        header_end_pos = content.find('</header>', topbar_div_pos)
        if header_end_pos == -1:
            print(f'  [SKIP] Cannot find </header> in {filepath}')
            return False
        insert_end = header_end_pos + len('</header>') + 1
    else:
        # Find the matching </div> for the mobile-menu div
        # Count depth from mobile_div_pos
        depth = 0
        i = mobile_div_pos
        while i < len(content):
            if content[i:i+4] == '<div':
                depth += 1
                i += 4
            elif content[i:i+6] == '</div>':
                depth -= 1
                if depth == 0:
                    insert_end = i + len('</div>') + 1
                    # consume trailing newline
                    break
                i += 6
            else:
                i += 1
        else:
            print(f'  [WARN] Could not find end of mobile-menu in {filepath}')
            insert_end = mobile_div_pos

    # Perform replacement
    content = content[:insert_start] + '\n' + APPROVED_TOPBAR + '\n' + APPROVED_HEADER + '\n' + content[insert_end:]

    # ── 2. Replace old footer ────────────────────────────────────────────────
    footer_start = content.find('<footer class="footer">')
    if footer_start == -1:
        # Try alternate footer patterns used in some pages
        footer_start = content.find('<footer ')
    if footer_start == -1:
        print(f'  [WARN] No footer found in {filepath}')
    else:
        footer_end_marker = '</footer>'
        footer_end = content.find(footer_end_marker, footer_start)
        if footer_end != -1:
            footer_end += len(footer_end_marker)
            # Check for a preceding comment
            pre_footer = content[max(0, footer_start - 100):footer_start]
            comment_match = re.search(r'<!--[^>]*[Ff]ooter[^>]*-->\s*$', pre_footer)
            if comment_match:
                actual_footer_start = footer_start - (len(pre_footer) - comment_match.start())
            else:
                actual_footer_start = footer_start

            content = content[:actual_footer_start] + '\n' + APPROVED_FOOTER + '\n' + content[footer_end:]

    # ── 3. Add/Replace WhatsApp float + AI chat before </body> ───────────────
    # First, remove any existing whatsapp-float anchor
    content = re.sub(
        r'<a[^>]+class="whatsapp-float"[^>]*>.*?</a>\s*',
        '',
        content,
        flags=re.DOTALL
    )
    # Remove any existing data-rrc-ai-chat-root
    content = re.sub(r'<div data-rrc-ai-chat-root[^>]*>\s*</div>\s*', '', content)

    # Insert before </body>
    body_close = content.rfind('</body>')
    if body_close != -1:
        content = content[:body_close] + '\n' + WHATSAPP_FLOAT + '\n' + content[body_close:]

    # ── 4. Fix mobile menu JS ─────────────────────────────────────────────────
    # Remove old mobile menu toggle scripts (look for specific patterns)
    # Pattern used in blog 13 pages: references menuToggle, menuClose, m-trigger with style.display
    # We'll remove the specific script block and add the approved one

    # Remove the old mobile drawer script block (between <!-- Mobile Drawer & Interactive TOC Script -->
    # and the end of the first <script> block containing menuToggle/menuClose)
    old_mobile_script_pattern = re.compile(
        r'<!--\s*Mobile\s*(?:Drawer|Navigation).*?(?:Script|JS)\s*-->\s*<script>(.*?)</script>',
        re.DOTALL | re.IGNORECASE
    )
    content = old_mobile_script_pattern.sub('', content)

    # Also remove any inline scripts that contain menuClose (old pattern) referencing m-trigger style.display
    # (the "menuClose" ID is used in the old blog nav, vs "closeMenu" in the approved nav)
    old_menu_script_pattern = re.compile(
        r"<script>\s*(?://[^\n]*\n\s*)*const menuToggle.*?(?:menuClose|menuToggle).*?</script>",
        re.DOTALL
    )
    # Only remove if it's the OLD pattern (references 'menuClose' not 'closeMenu')
    def replace_old_menu_script(m):
        s = m.group(0)
        if 'menuClose' in s and 'closeMenu' not in s:
            return ''
        return s
    content = old_menu_script_pattern.sub(replace_old_menu_script, content)

    # Add approved mobile menu JS before </body> (after whatsapp/ai-chat)
    body_close = content.rfind('</body>')
    if body_close != -1 and 'closeMenu' not in content[:body_close]:
        content = content[:body_close] + '\n' + MOBILE_MENU_JS + '\n' + content[body_close:]

    # ── 5. Fix wrong phone/email references in CTA sections (not topbar) ─────
    # Fix phone numbers in CTA buttons and in-content links
    content = content.replace('919840299699', '919751182452')
    content = content.replace('+91 98402 99699', '+91 97511 82452')
    content = content.replace('98402 99699', '97511 82452')
    content = content.replace('admin@rrclawassociates.com', 'dr.kumar@rrclawassociates.com')

    # Fix wrong address
    content = content.replace(
        'No. 12, Ground Floor, High Court Chambers, Chennai - 600 104, Tamil Nadu, India',
        'No 82/6B, Deen Complex, Mary\'s Corner, Parisutham Nagar, Thanjavur, Tamil Nadu-613001'
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  [FIXED] {os.path.basename(filepath)}')
        return True
    else:
        print(f'  [NO CHANGE] {os.path.basename(filepath)}')
        return False


def fix_group2_page(filepath):
    """
    Pages with correct topbar/header/footer but missing WhatsApp float + AI chat.
    Just add the missing widgets before </body>.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove duplicates first
    content = re.sub(r'<a[^>]+class="whatsapp-float"[^>]*>.*?</a>\s*', '', content, flags=re.DOTALL)
    content = re.sub(r'<div data-rrc-ai-chat-root[^>]*>\s*</div>\s*', '', content)

    # Insert before </body>
    body_close = content.rfind('</body>')
    if body_close != -1:
        content = content[:body_close] + '\n' + WHATSAPP_FLOAT + '\n' + content[body_close:]

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  [FIXED] {os.path.basename(filepath)}')
        return True
    else:
        print(f'  [NO CHANGE] {os.path.basename(filepath)}')
        return False


def fix_group3_page(filepath):
    """
    Pages with correct topbar/header/footer/whatsapp but missing AI chat only.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove any existing AI chat root
    content = re.sub(r'<div data-rrc-ai-chat-root[^>]*>\s*</div>\s*', '', content)

    # Insert just the AI chat div before </body>
    body_close = content.rfind('</body>')
    if body_close != -1:
        content = content[:body_close] + '\n<div data-rrc-ai-chat-root></div>\n' + content[body_close:]

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  [FIXED] {os.path.basename(filepath)}')
        return True
    else:
        print(f'  [NO CHANGE] {os.path.basename(filepath)}')
        return False


def main():
    print('=' * 70)
    print('RRC Law Associates — Header/Footer/Widget Audit Fix')
    print('=' * 70)
    print()

    total_fixed = 0

    print('GROUP 1: Full topbar + header + footer + widget replacement')
    print('-' * 60)
    for page in GROUP1_PAGES:
        if not os.path.exists(page):
            print(f'  [MISSING] {page}')
            continue
        backup_file(page)
        if fix_group1_page(page):
            total_fixed += 1

    print()
    print('GROUP 2: Add missing WhatsApp float + AI chat')
    print('-' * 60)
    for page in GROUP2_PAGES:
        if not os.path.exists(page):
            print(f'  [MISSING] {page}')
            continue
        backup_file(page)
        if fix_group2_page(page):
            total_fixed += 1

    print()
    print('GROUP 3: Add missing AI chat only')
    print('-' * 60)
    for page in GROUP3_PAGES:
        if not os.path.exists(page):
            print(f'  [MISSING] {page}')
            continue
        backup_file(page)
        if fix_group3_page(page):
            total_fixed += 1

    print()
    print('=' * 70)
    print(f'DONE: {total_fixed} files fixed.')
    print('=' * 70)


if __name__ == '__main__':
    main()
