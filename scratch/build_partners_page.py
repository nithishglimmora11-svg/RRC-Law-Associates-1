# -*- coding: utf-8 -*-
"""
Builds the redesigned partners.html in strict accordance with:
1. Manager's reference image: WhatsApp Image 2026-10-27 at 12.49.01 PM.jpeg
2. Specification document: Legal Partners Page (1).docx
3. Audit report: legal_partners_audit_report.md
4. Mandatory preservation rules: Header, Footer, Topbar, existing Malaysian partners, and real Web3Forms backend.
"""

import os
import re

# Read original backup to extract exact header and footer
with open('partners.html.bak', 'r', encoding='utf-8') as f:
    orig = f.read()

# Extract topbar and header up to hero section
topbar_idx = orig.find('<div class="rrc-topbar">')
hero_idx = orig.find('<section class="opps-hero"')
nav_markup = orig[topbar_idx:hero_idx].strip()

# Fix the duplicate ID defect identified in audit:
# Change the second id="mPracticeMenu" to id="mCorePracticeMenu"
nav_markup = nav_markup.replace(
    '<a class="m-link m-trigger" href="core-practice-areas.html">\n                        Core Practice Areas <i class="fa fa-chevron-down ms-2"></i>\n                    </a>\n                    <div class="m-submenu" id="mPracticeMenu">',
    '<a class="m-link m-trigger" href="core-practice-areas.html">\n                        Core Practice Areas <i class="fa fa-chevron-down ms-2"></i>\n                    </a>\n                    <div class="m-submenu" id="mCorePracticeMenu">'
)

# Highlight Partners link in desktop navigation
nav_markup = nav_markup.replace(
    '<a\n                            class="nav-link-custom border-0 bg-transparent p-0"\n                            href="partners.html"\n                            role="button"\n                            data-bs-toggle="dropdown"\n                            aria-expanded="false">\n                            Partners\n                        </a>',
    '<a\n                            class="nav-link-custom border-0 bg-transparent p-0 active-partner-link"\n                            href="partners.html"\n                            role="button"\n                            data-bs-toggle="dropdown"\n                            aria-expanded="false"\n                            style="color: #c9a24d !important; font-weight: 700; border-bottom: 2px solid #c9a24d; padding-bottom: 2px;">\n                            Legal Partners\n                        </a>'
)

# Highlight Partners link in mobile menu
nav_markup = nav_markup.replace(
    '<a href="partners.html" class="m-link">Partners</a>',
    '<a href="partners.html" class="m-link" style="color: #c9a24d !important; font-weight: 700;">Legal Partners</a>'
)

# Extract footer and whatsapp float
footer_idx = orig.find('<footer class="footer">')
script_idx = orig.find('<script src="https://cdn.jsdelivr.net/npm/bootstrap')
footer_markup = orig[footer_idx:script_idx].strip()

print("Extracted navigation markup length:", len(nav_markup))
print("Extracted footer markup length:", len(footer_markup))

