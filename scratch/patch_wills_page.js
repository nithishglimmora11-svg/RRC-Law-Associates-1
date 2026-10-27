const fs = require('fs');

let content = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');

// 1. Standardize Header & Navigation button to match site standard
content = content.replace(
  `<button class="btn btn-dark d-lg-none" type="button" id="mobileMenuToggle" aria-label="Toggle navigation">\n                <i class="fas fa-bars text-white fs-4"></i>\n            </button>`,
  `<div class="d-flex align-items-center gap-3">\n                <div class="cta d-none d-sm-block">\n                    <a href="/booking.html" class="btn btn-gold">Book Consultation</a>\n                </div>\n                <button class="btn text-white d-lg-none fs-3 p-0" id="menuToggle" aria-label="Toggle navigation">\n                    <i class="fa fa-bars"></i>\n                </button>\n            </div>`
);

// 2. Standardize Mobile Menu Drawer to match the site's mobile-menu structure
const oldMobileDrawerRegex = /<!-- MOBILE MENU DRAWER -->[\s\S]*?<\/div>\s*<\/div>/i;
const newMobileDrawer = `<!-- MOBILE MENU -->
    <div class="mobile-menu" id="mobileMenu">
        <button class="close-menu" id="closeMenu" aria-label="Close menu">&times;</button>
        <div class="mt-5">
            <a href="/" class="m-link">Home</a>
            <div class="m-dropdown">
                <a class="m-link m-trigger" href="/nri-services.html" role="button">
                    NRI Services <i class="fa fa-chevron-down ms-2"></i>
                </a>
                <div class="m-submenu" id="mNriMenu">
                    <a class="m-sub-item" href="/oci-card-assistance">OCI Card &amp; Ancestry Assistance</a>
                    <a class="m-sub-item text-gold fw-semibold" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>
                    <a class="m-sub-item" href="/nri-property-disputes.html">Property Dispute</a>
                    <a class="m-sub-item" href="/nri-power-of-attorney.html">Power of Attorney</a>
                    <a class="m-sub-item" href="/nri-criminal-case.html">Criminal Case</a>
                    <a class="m-sub-item" href="/nri-family-matrimonial.html">Family &amp; Matrimonial</a>
                </div>
            </div>
            <div class="m-dropdown">
                <a class="m-link m-trigger" href="/core-practice-areas.html" role="button">
                    Core Practice Areas <i class="fa fa-chevron-down ms-2"></i>
                </a>
                <div class="m-submenu" id="mPracticeMenu">
                    <a class="m-sub-item" href="/family-law.html">FAMILY, SUCCESSION &amp; PRIVATE CLIENT PRACTICE</a>
                    <a class="m-sub-item" href="/intellectual-property.html">INTELLECTUAL PROPERTY &amp; INNOVATION PROTECTION</a>
                    <a class="m-sub-item" href="/employment-law.html">LABOUR, EMPLOYMENT &amp; INDUSTRIAL RELATIONS</a>
                    <a class="m-sub-item" href="/white-collar-crime.html">WHITE COLLAR CRIMES &amp; FINANCIAL INVESTIGATIONS</a>
                    <a class="m-sub-item" href="/property-law.html">DOCUMENTATION, REGISTRATION &amp; DUE DILIGENCE</a>
                    <a class="m-sub-item" href="/cyber-law.html">CYBER LAW, DATA PROTECTION &amp; DIGITAL EVIDENCE</a>
                    <a class="m-sub-item" href="/litigation-dispute-resolution.html">LITIGATION &amp; DISPUTE RESOLUTION</a>
                </div>
            </div>
            <a href="/partners.html" class="m-link">Partners</a>
            <a href="/lawfirm-blog.html" class="m-link">Blog</a>
            <a href="/#contact" class="m-link">Contact</a>
            <div class="mt-4">
                <a href="/booking.html" class="btn btn-gold w-100 py-3 text-center">Book Consultation</a>
            </div>
        </div>
    </div>`;

content = content.replace(oldMobileDrawerRegex, newMobileDrawer);

// 3. Standardize Breadcrumbs Bar
const oldBreadcrumbRegex = /<nav class="breadcrumbs-bar" aria-label="Breadcrumb">[\s\S]*?<\/nav>/i;
const newBreadcrumb = `<nav aria-label="breadcrumb" class="breadcrumb-nav">
                    <div class="container px-0">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="/">Home</a></li>
                            <li class="breadcrumb-item"><a href="/nri-services.html">NRI Services</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Wills, Probate &amp; Estate Administration</li>
                        </ol>
                    </div>
                </nav>`;
content = content.replace(oldBreadcrumbRegex, newBreadcrumb);

// 4. Update FAQ heading and copy
content = content.replace(
  '<h2 class="section-heading">Frequently Asked Legal Questions</h2>',
  '<h2 class="section-heading">Frequently Asked Questions</h2>'
);

content = content.replace(
  'Outside Chennai presidency limits (such as in Thanjavur, Trichy, Madurai, or Coimbatore)',
  'Outside Chennai presidency limits in mofussil jurisdictions (such as in Thanjavur, Trichy, Madurai, or Coimbatore)'
);

// 5. Update Final CTA heading & button
content = content.replace(
  '<h3 class="h2 fw-bold text-white mb-3">Protect Your Family\'s Generational Legacy</h3>',
  '<h3 class="h2 fw-bold text-white mb-3">Protect Your Family Estate &amp; Generational Legacy</h3>'
);

content = content.replace(
  'Book a Consultation Online <i class="bi bi-arrow-right"></i>',
  'Consult Our Succession &amp; Probate Advocates <i class="bi bi-arrow-right"></i>'
);

// 6. Update Mobile Menu Script
const oldScriptRegex = /\/\/ Simple mobile menu toggle script[\s\S]*?}<\/script>/i;
const newScript = `// Mobile menu toggle & dropdown handler
        const menuToggle = document.getElementById('menuToggle');
        const closeMenu = document.getElementById('closeMenu');
        const mobileMenu = document.getElementById('mobileMenu');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.add('open');
            });
        }
        if (closeMenu && mobileMenu) {
            closeMenu.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.remove('open');
            });
        }

        // Submenu accordion toggle in mobile
        document.querySelectorAll('.m-dropdown .m-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const submenu = trigger.nextElementSibling;
                if (submenu) {
                    submenu.style.display = (submenu.style.display === 'block') ? 'none' : 'block';
                }
            });
        });
    </script>`;

content = content.replace(oldScriptRegex, newScript);

// 7. Add mobile menu open/submenu CSS if needed
if (!content.includes('.mobile-menu.open')) {
  content = content.replace(
    '</style>',
    `        .mobile-menu.open { right: 0 !important; }
        .m-submenu { display: none; }
    </style>`
  );
}

fs.writeFileSync('wills-probate-estate-administration.html', content, 'utf8');
console.log('Successfully patched wills-probate-estate-administration.html');
