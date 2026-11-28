/**
 * RRC Law Associates - Premium Unified Navigation Mega-Menu Controller
 * Version: 20261111-1
 * Unified Black & Gold System for NRI Services, Practice Areas, and Legal Partners (featuring International Professional Associates)
 * Split Navigation Trigger: Practice Areas text link navigates; down arrow button toggles dropdown
 */
(function () {
    let activeMenu = null; // 'nri-services' | 'practice-areas' | 'partners' | null

    function initMegaMenuController() {
        const header = document.querySelector('header.header');
        if (!header) return;

        // 1. Locate NRI dropdown elements
        const nriContainer = header.querySelector('.dropdown:has(.dropdown-menu-nri)') ||
            document.querySelector('.dropdown-menu-nri')?.closest('.dropdown');
        const nriToggle = nriContainer?.querySelector('.dropdown-toggle');
        const nriMenu = header.querySelector('.dropdown-menu-nri');

        if (nriToggle) {
            if (!nriToggle.id) nriToggle.id = 'nriDropdown';
            nriToggle.setAttribute('role', 'button');
            nriToggle.setAttribute('aria-haspopup', 'true');
            nriToggle.setAttribute('aria-expanded', 'false');
            nriToggle.setAttribute('aria-controls', 'nriMenu');
        }
        if (nriMenu) {
            if (!nriMenu.id) nriMenu.id = 'nriMenu';
            nriMenu.setAttribute('aria-labelledby', 'nriDropdown');

            // Remove any legacy category headers in NRI dropdown
            nriMenu.querySelectorAll('.dropdown-header').forEach(el => el.remove());

            // Standardize NRI Services Mega Menu: Guarantee all 21 NRI services in 2 balanced columns without category headers
            if (!nriMenu.querySelector('.nri-column-wrap') || nriMenu.querySelectorAll('.dropdown-item').length < 21) {
                const activeItem = nriMenu.querySelector('.dropdown-item.active, .dropdown-item.active-item, .dropdown-item.text-gold');
                const activeHref = activeItem ? activeItem.getAttribute('href') : null;
                const currentPath = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '');

                nriMenu.innerHTML = `
                        <li class="nri-column-wrap">
                            <a class="dropdown-item text-uppercase" href="/oci-card-assistance">OCI Card &amp; Ancestry Assistance</a>
                            <a class="dropdown-item text-uppercase" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>
                            <a class="dropdown-item text-uppercase" href="/nri-landlord-tenant-eviction/">Landlord–Tenant &amp; Eviction</a>
                            <a class="dropdown-item text-uppercase" href="/nri-rera-builder-disputes/">RERA &amp; Builder Disputes</a>
                            <a class="dropdown-item text-uppercase" href="/nri-property-disputes">Property Disputes</a>
                            <a class="dropdown-item text-uppercase" href="/nri-power-of-attorney">Power of Attorney</a>
                            <a class="dropdown-item text-uppercase" href="/nri-tax-return-filing/">NRI Tax Return Filing</a>
                            <a class="dropdown-item text-uppercase" href="/us-india-documentation-services/">U.S.–India Documentation</a>
                            <a class="dropdown-item text-uppercase" href="/immigration-services/">Immigration &amp; Visa Advisory</a>
                            <a class="dropdown-item text-uppercase" href="/translation-services/">Certified Legal Translations</a>
                            <a class="dropdown-item text-uppercase" href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a>
                        </li>
                        <li class="nri-column-wrap">
                            <a class="dropdown-item text-uppercase" href="/nri-criminal-case">Criminal Cases</a>
                            <a class="dropdown-item text-uppercase" href="/nri-family-matrimonial">Family &amp; Matrimonial</a>
                            <a class="dropdown-item text-uppercase" href="/nri-tax-dispute-resolution/">NRI Tax Dispute Resolution</a>
                            <a class="dropdown-item text-uppercase" href="/trademark-filing-registration/">Trademark Filing &amp; Registration</a>
                            <a class="dropdown-item text-uppercase" href="/copyright-filing-registration/">Copyright Filing &amp; Registration</a>
                            <a class="dropdown-item text-uppercase" href="/patent-filing-registration/">Patent Filing &amp; Registration</a>
                            <a class="dropdown-item text-uppercase" href="/industrial-design-registration/">Industrial Design Filing &amp; Registration</a>
                            <a class="dropdown-item text-uppercase" href="/gst-registration-services/">GST Registration &amp; Compliance</a>
                            <a class="dropdown-item text-uppercase" href="/msme-udyam-registration/">MSME / Udyam Registration</a>
                            <a class="dropdown-item text-uppercase" href="/startup-india-dpiit-recognition/">Startup India / DPIIT Recognition</a>
                        </li>
                    `;

                nriMenu.querySelectorAll('.dropdown-item').forEach(link => {
                    const href = (link.getAttribute('href') || '').replace(/\/$/, '').replace(/\.html$/, '');
                    if ((activeHref && link.getAttribute('href') === activeHref) ||
                        (href && href === currentPath && currentPath !== '')) {
                        link.classList.add('active', 'text-gold', 'fw-bold');
                    }
                });
            } else {
                // Ensure headers removed even if 21 items already exist
                nriMenu.querySelectorAll('.dropdown-header').forEach(el => el.remove());
            }
        }

        // 2. Locate Practice Areas dropdown elements & auto-split fallback
        const practiceContainer = header.querySelector('.dropdown:has(.dropdown-menu-practice)') ||
            header.querySelector('.practice-dropdown-container') ||
            document.querySelector('.dropdown-menu-practice')?.closest('.dropdown');

        if (practiceContainer) {
            practiceContainer.classList.add('practice-dropdown-container');

            // Dynamic split enhancement fallback if HTML is unsplit
            let existingToggle = practiceContainer.querySelector('#practiceDropdown');
            let arrowBtn = practiceContainer.querySelector('.practice-arrow-btn');
            let textLink = practiceContainer.querySelector('.practice-text-link');

            if (!arrowBtn && existingToggle && existingToggle.tagName.toLowerCase() === 'a') {
                const href = existingToggle.getAttribute('href') || '/core-practice-areas.html';
                const text = existingToggle.textContent.trim().replace(/▼|▾/g, '').trim() || 'Practice Areas';

                // Replace the single anchor with text link + arrow button
                const splitWrapper = document.createElement('span');
                splitWrapper.style.display = 'contents';
                splitWrapper.innerHTML = `
                    <a class="nav-link-custom practice-text-link border-0 bg-transparent p-0" href="${href}">${text}</a>
                    <button class="nav-link-custom practice-arrow-btn dropdown-toggle dropdown-toggle-split border-0 bg-transparent p-0"
                        type="button" id="practiceDropdown" aria-expanded="false" aria-controls="practiceMenu" aria-label="Toggle Practice Areas dropdown">
                        <span class="visually-hidden">Toggle Practice Areas</span>
                    </button>
                `;
                existingToggle.replaceWith(...splitWrapper.childNodes);
            }
        }

        const practiceArrowToggle = practiceContainer?.querySelector('.practice-arrow-btn') ||
            practiceContainer?.querySelector('#practiceDropdown') ||
            practiceContainer?.querySelector('.dropdown-toggle');
        const practiceTextLink = practiceContainer?.querySelector('.practice-text-link');
        const practiceMenu = header.querySelector('.dropdown-menu-practice');

        if (practiceArrowToggle) {
            if (!practiceArrowToggle.id) practiceArrowToggle.id = 'practiceDropdown';
            practiceArrowToggle.setAttribute('aria-haspopup', 'true');
            practiceArrowToggle.setAttribute('aria-expanded', 'false');
            practiceArrowToggle.setAttribute('aria-controls', 'practiceMenu');
            if (!practiceArrowToggle.getAttribute('aria-label')) {
                practiceArrowToggle.setAttribute('aria-label', 'Toggle Practice Areas dropdown');
            }
        }
        if (practiceMenu) {
            if (!practiceMenu.id) practiceMenu.id = 'practiceMenu';
            practiceMenu.setAttribute('aria-labelledby', 'practiceDropdown');
        }

        // 3. Locate Legal Partners dropdown elements & auto-dropdown fallback
        const partnersContainer = header.querySelector('.dropdown.partners-dropdown-container') ||
            header.querySelector('.dropdown:has(.dropdown-menu-partners)') ||
            Array.from(header.querySelectorAll('.dropdown')).find(d => {
                const a = d.querySelector('a');
                return a && a.textContent.trim().startsWith('Legal Partners');
            });

        if (partnersContainer) {
            partnersContainer.classList.add('partners-dropdown-container');
            let partnersToggle = partnersContainer.querySelector('#partnersDropdown') ||
                partnersContainer.querySelector('.dropdown-toggle') ||
                partnersContainer.querySelector('a');
            let partnersMenu = header.querySelector('.dropdown-menu-partners');

            if (partnersToggle) {
                if (!partnersToggle.id) partnersToggle.id = 'partnersDropdown';
                partnersToggle.classList.add('dropdown-toggle');
                partnersToggle.setAttribute('role', 'button');
                partnersToggle.setAttribute('aria-haspopup', 'true');
                partnersToggle.setAttribute('aria-expanded', 'false');
                partnersToggle.setAttribute('aria-controls', 'partnersMenu');
                partnersToggle.setAttribute('data-bs-toggle', 'dropdown');
            }

            if (!partnersMenu) {
                partnersMenu = document.createElement('ul');
                partnersMenu.className = 'dropdown-menu dropdown-menu-partners shadow-lg';
                partnersMenu.id = 'partnersMenu';
                partnersMenu.setAttribute('aria-labelledby', 'partnersDropdown');
                partnersMenu.innerHTML = `
                    <li><a class="dropdown-item text-uppercase" href="/partners.html">Legal Partners Network</a></li>
                    <li><a class="dropdown-item text-uppercase" href="/international-professional-associates.html">International Professional Associates</a></li>
                `;
                partnersContainer.appendChild(partnersMenu);
            }

            // Standardize / Active item highlighting
            const currentPath = window.location.pathname.replace(/\/$/, '');
            partnersMenu.querySelectorAll('.dropdown-item').forEach(link => {
                const href = (link.getAttribute('href') || '').replace(/\/$/, '').replace('.html', '');
                const normCurrent = currentPath.replace('.html', '');
                if ((href && href === normCurrent && normCurrent !== '') ||
                    (normCurrent.includes('international-professional-associates') && link.getAttribute('href').includes('international-professional-associates')) ||
                    (normCurrent.endsWith('partners') && link.getAttribute('href').endsWith('partners.html'))) {
                    link.classList.add('active', 'text-gold', 'fw-bold');
                }
            });
        }

        const partnersToggle = partnersContainer?.querySelector('#partnersDropdown') || partnersContainer?.querySelector('.dropdown-toggle');
        const partnersMenu = header.querySelector('.dropdown-menu-partners');

        // Active State Coordinator
        function setActiveMenu(target) {
            activeMenu = target;

            if (target === 'nri-services') {
                // Open NRI Services
                if (nriMenu) {
                    nriMenu.classList.add('is-active', 'show');
                    nriMenu.classList.remove('is-closed');
                }
                if (nriToggle) nriToggle.setAttribute('aria-expanded', 'true');

                // Close Practice Areas immediately (zero simultaneous display)
                if (practiceMenu) {
                    practiceMenu.classList.remove('is-active', 'show');
                    practiceMenu.classList.add('is-closed');
                }
                if (practiceArrowToggle) practiceArrowToggle.setAttribute('aria-expanded', 'false');

                // Close Partners Menu
                if (partnersMenu) {
                    partnersMenu.classList.remove('is-active', 'show');
                    partnersMenu.classList.add('is-closed');
                }
                if (partnersToggle) partnersToggle.setAttribute('aria-expanded', 'false');

            } else if (target === 'practice-areas') {
                // Open Practice Areas
                if (practiceMenu) {
                    practiceMenu.classList.add('is-active', 'show');
                    practiceMenu.classList.remove('is-closed');
                }
                if (practiceArrowToggle) practiceArrowToggle.setAttribute('aria-expanded', 'true');

                // Close NRI Services immediately (zero simultaneous display)
                if (nriMenu) {
                    nriMenu.classList.remove('is-active', 'show');
                    nriMenu.classList.add('is-closed');
                }
                if (nriToggle) nriToggle.setAttribute('aria-expanded', 'false');

                // Close Partners Menu
                if (partnersMenu) {
                    partnersMenu.classList.remove('is-active', 'show');
                    partnersMenu.classList.add('is-closed');
                }
                if (partnersToggle) partnersToggle.setAttribute('aria-expanded', 'false');

            } else if (target === 'partners') {
                // Open Partners Menu
                if (partnersMenu) {
                    partnersMenu.classList.add('is-active', 'show');
                    partnersMenu.classList.remove('is-closed');
                }
                if (partnersToggle) partnersToggle.setAttribute('aria-expanded', 'true');

                // Close NRI and Practice
                if (nriMenu) {
                    nriMenu.classList.remove('is-active', 'show');
                    nriMenu.classList.add('is-closed');
                }
                if (nriToggle) nriToggle.setAttribute('aria-expanded', 'false');

                if (practiceMenu) {
                    practiceMenu.classList.remove('is-active', 'show');
                    practiceMenu.classList.add('is-closed');
                }
                if (practiceArrowToggle) practiceArrowToggle.setAttribute('aria-expanded', 'false');

            } else {
                // Close all menus
                if (nriMenu) {
                    nriMenu.classList.remove('is-active', 'show');
                    nriMenu.classList.add('is-closed');
                }
                if (nriToggle) nriToggle.setAttribute('aria-expanded', 'false');

                if (practiceMenu) {
                    practiceMenu.classList.remove('is-active', 'show');
                    practiceMenu.classList.add('is-closed');
                }
                if (practiceArrowToggle) practiceArrowToggle.setAttribute('aria-expanded', 'false');

                if (partnersMenu) {
                    partnersMenu.classList.remove('is-active', 'show');
                    partnersMenu.classList.add('is-closed');
                }
                if (partnersToggle) partnersToggle.setAttribute('aria-expanded', 'false');
            }
        }

        // Expose state controller globally for testing & external inspection
        window.__rrcMegaMenu = {
            getActiveMenu: () => activeMenu,
            setActiveMenu: setActiveMenu
        };

        // --- CLICK INTERACTIONS ---
        // 1. NRI Services Toggle Click
        if (nriToggle) {
            nriToggle.addEventListener('click', function (e) {
                if (this.closest('.mobile-menu') || this.closest('#mobileMenu')) return;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if (activeMenu === 'nri-services') {
                    setActiveMenu(null);
                } else {
                    setActiveMenu('nri-services');
                }
            });
        }

        // 2. Practice Areas Arrow Toggle Click (ONLY opens/closes menu, NEVER navigates)
        if (practiceArrowToggle) {
            practiceArrowToggle.addEventListener('click', function (e) {
                if (this.closest('.mobile-menu') || this.closest('#mobileMenu')) return;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if (activeMenu === 'practice-areas') {
                    setActiveMenu(null);
                } else {
                    setActiveMenu('practice-areas');
                }
            });
        }

        // 3. Practice Areas Text Link (Clicking text navigates to Practice Areas page)
        if (practiceTextLink) {
            practiceTextLink.addEventListener('click', function () {
                setActiveMenu(null);
            });
        }

        // 4. Legal Partners Toggle Click
        if (partnersToggle) {
            partnersToggle.addEventListener('click', function (e) {
                if (this.closest('.mobile-menu') || this.closest('#mobileMenu')) return;
                // If on mobile or simple tap
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (activeMenu === 'partners') {
                        setActiveMenu(null);
                    } else {
                        setActiveMenu('partners');
                    }
                }
            });
        }

        // --- HOVER INTERACTIONS ---
        if (nriContainer) {
            nriContainer.addEventListener('mouseenter', function () {
                if (activeMenu === null) {
                    if (nriMenu) nriMenu.classList.remove('is-closed');
                    if (nriToggle) nriToggle.setAttribute('aria-expanded', 'true');
                    if (practiceMenu) practiceMenu.classList.add('is-closed');
                    if (partnersMenu) partnersMenu.classList.add('is-closed');
                }
            });

            nriContainer.addEventListener('mouseleave', function () {
                if (activeMenu !== 'nri-services') {
                    if (nriMenu) nriMenu.classList.remove('show', 'is-active');
                    if (nriToggle) nriToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        if (practiceContainer) {
            practiceContainer.addEventListener('mouseenter', function () {
                if (activeMenu === null) {
                    if (practiceMenu) practiceMenu.classList.remove('is-closed');
                    if (practiceArrowToggle) practiceArrowToggle.setAttribute('aria-expanded', 'true');
                    if (nriMenu) nriMenu.classList.add('is-closed');
                    if (partnersMenu) partnersMenu.classList.add('is-closed');
                }
            });

            practiceContainer.addEventListener('mouseleave', function () {
                if (activeMenu !== 'practice-areas') {
                    if (practiceMenu) practiceMenu.classList.remove('show', 'is-active');
                    if (practiceArrowToggle) practiceArrowToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        if (partnersContainer) {
            partnersContainer.addEventListener('mouseenter', function () {
                if (activeMenu === null) {
                    if (partnersMenu) {
                        partnersMenu.classList.remove('is-closed');
                        partnersMenu.classList.add('show');
                    }
                    if (partnersToggle) partnersToggle.setAttribute('aria-expanded', 'true');
                    if (nriMenu) nriMenu.classList.add('is-closed');
                    if (practiceMenu) practiceMenu.classList.add('is-closed');
                }
            });

            partnersContainer.addEventListener('mouseleave', function () {
                if (activeMenu !== 'partners') {
                    if (partnersMenu) partnersMenu.classList.remove('show', 'is-active');
                    if (partnersToggle) partnersToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Close on clicking outside header
        document.addEventListener('click', function (e) {
                if (!header.contains(e.target)) {
                    setActiveMenu(null);
                }
            });

        // Close on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                    if (activeMenu !== null) {
                        const prev = activeMenu;
                        setActiveMenu(null);
                        if (prev === 'nri-services' && nriToggle) nriToggle.focus();
                        if (prev === 'practice-areas' && practiceArrowToggle) practiceArrowToggle.focus();
                        if (prev === 'partners' && partnersToggle) partnersToggle.focus();
                    }
                }
    });

    // Bootstrap dropdown hide integration
    if (practiceMenu) {
        practiceMenu.addEventListener('hidden.bs.dropdown', function () {
            if (activeMenu === 'practice-areas') setActiveMenu(null);
        });
    }
    if (nriMenu) {
        nriMenu.addEventListener('hidden.bs.dropdown', function () {
            if (activeMenu === 'nri-services') setActiveMenu(null);
        });
    }
    if (partnersMenu) {
        partnersMenu.addEventListener('hidden.bs.dropdown', function () {
            if (activeMenu === 'partners') setActiveMenu(null);
        });
    }

    // Link Navigation closes menu
    header.addEventListener('click', function (e) {
            if (e.target.closest('.dropdown-menu-nri a, .dropdown-menu-practice a, .dropdown-menu-partners a')) {
                setActiveMenu(null);
            }
        });
        document.querySelectorAll('.dropdown-menu-nri a, .dropdown-menu-practice a, .dropdown-menu-partners a').forEach(link => {
            link.addEventListener('click', function () {
                setActiveMenu(null);
            });
        });

        // --- MOBILE DRAWER ACCORDIONS ---
        const mobileDrawer = document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
        if (mobileDrawer) {
            // Guarantee all 21 NRI Services exist in mobile drawer without category headings
            const mNriItemsHtml = `
                    <a class="m-sub-item" href="/oci-card-assistance">OCI Card &amp; Ancestry Assistance</a>
                    <a class="m-sub-item" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>
                    <a class="m-sub-item" href="/nri-landlord-tenant-eviction/">Landlord–Tenant &amp; Eviction</a>
                    <a class="m-sub-item" href="/nri-rera-builder-disputes/">RERA &amp; Builder Disputes</a>
                    <a class="m-sub-item" href="/nri-property-disputes">Property Disputes</a>
                    <a class="m-sub-item" href="/nri-power-of-attorney">Power of Attorney</a>
                    <a class="m-sub-item" href="/nri-tax-return-filing/">NRI Tax Return Filing</a>
                    <a class="m-sub-item" href="/us-india-documentation-services/">U.S.–India Documentation</a>
                    <a class="m-sub-item" href="/immigration-services/">Immigration &amp; Visa Advisory</a>
                    <a class="m-sub-item" href="/translation-services/">Certified Legal Translations</a>
                    <a class="m-sub-item" href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a>
                    <a class="m-sub-item" href="/nri-criminal-case">Criminal Cases</a>
                    <a class="m-sub-item" href="/nri-family-matrimonial">Family &amp; Matrimonial</a>
                    <a class="m-sub-item" href="/nri-tax-dispute-resolution/">NRI Tax Dispute Resolution</a>
                    <a class="m-sub-item" href="/trademark-filing-registration/">Trademark Filing &amp; Registration</a>
                    <a class="m-sub-item" href="/copyright-filing-registration/">Copyright Filing &amp; Registration</a>
                    <a class="m-sub-item" href="/patent-filing-registration/">Patent Filing &amp; Registration</a>
                    <a class="m-sub-item" href="/industrial-design-registration/">Industrial Design Filing &amp; Registration</a>
                    <a class="m-sub-item" href="/gst-registration-services/">GST Registration &amp; Compliance</a>
                    <a class="m-sub-item" href="/msme-udyam-registration/">MSME / Udyam Registration</a>
                    <a class="m-sub-item" href="/startup-india-dpiit-recognition/">Startup India / DPIIT Recognition</a>
                `;
            let mNriMenuEl = mobileDrawer.querySelector('#mNriMenu');
            if (!mNriMenuEl) {
                const practiceDropdown = mobileDrawer.querySelector('#mPracticeMenu')?.closest('.m-dropdown');
                if (practiceDropdown) {
                    const nriDropdown = document.createElement('div');
                    nriDropdown.className = 'm-dropdown';
                    nriDropdown.innerHTML = `
                        <a class="m-link m-trigger" href="/nri-services.html">
                            NRI Services <i class="fa fa-chevron-down ms-2"></i>
                        </a>
                        <div class="m-submenu" id="mNriMenu">${mNriItemsHtml}</div>
                    `;
                    practiceDropdown.parentNode.insertBefore(nriDropdown, practiceDropdown);
                    mNriMenuEl = nriDropdown.querySelector('#mNriMenu');
                }
            } else if (mNriMenuEl.querySelectorAll('.m-sub-item').length < 21) {
                const activeMobHref = mNriMenuEl.querySelector('.m-sub-item.active, .m-sub-item.text-gold')?.getAttribute('href');
                mNriMenuEl.innerHTML = mNriItemsHtml;
                const normPath = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '');
                mNriMenuEl.querySelectorAll('.m-sub-item').forEach(link => {
                    const hrefNorm = (link.getAttribute('href') || '').replace(/\/$/, '').replace(/\.html$/, '');
                    if ((activeMobHref && link.getAttribute('href') === activeMobHref) || (hrefNorm && hrefNorm === normPath && normPath !== '')) {
                        link.classList.add('active', 'text-gold', 'fw-bold');
                    }
                });
            }

            // Guarantee Legal Partners exists in mobile drawer as accordion
            if (!mobileDrawer.querySelector('#mPartnersMenu')) {
                const partnersMobileLink = Array.from(mobileDrawer.querySelectorAll('.m-link, a')).find(a => {
                    return a.textContent.trim() === 'Legal Partners' && !a.classList.contains('m-trigger');
                });

                if (partnersMobileLink) {
                    const partnersDropdown = document.createElement('div');
                    partnersDropdown.className = 'm-dropdown';
                    partnersDropdown.innerHTML = `
                        <a class="m-link m-trigger" href="javascript:void(0);">
                            Legal Partners <i class="fa fa-chevron-down ms-2"></i>
                        </a>
                        <div class="m-submenu" id="mPartnersMenu">
                            <a class="m-sub-item" href="/partners.html">Legal Partners Network</a>
                            <a class="m-sub-item" href="/international-professional-associates.html">International Professional Associates</a>
                        </div>
                    `;
                    partnersMobileLink.replaceWith(partnersDropdown);
                }
            }

            // Highlight active item in mobile drawer if on current page
            const currentPath = window.location.pathname.replace(/\/$/, '').replace('.html', '');
            if (currentPath.includes('international-professional-associates')) {
                const activeMob = mobileDrawer.querySelector('a[href*="international-professional-associates"]');
                if (activeMob) {
                    activeMob.classList.add('text-gold', 'fw-bold');
                    activeMob.style.color = '#C9A24D';
                }
            } else if (currentPath.endsWith('partners')) {
                const activeMob = mobileDrawer.querySelector('a[href*="partners.html"]');
                if (activeMob) {
                    activeMob.classList.add('text-gold', 'fw-bold');
                    activeMob.style.color = '#C9A24D';
                }
            }

            // Accordion interactions with 180deg chevron rotation (capture phase prevents double-toggle with inline/legacy scripts)
            if (mobileDrawer.dataset.megaMenuAccordionInit !== 'true') {
                mobileDrawer.dataset.megaMenuAccordionInit = 'true';

                mobileDrawer.querySelectorAll('.m-trigger i').forEach(ic => {
                    ic.style.transition = 'transform 0.25s ease';
                });

                mobileDrawer.addEventListener('click', function (e) {
                    const trigger = e.target.closest('.m-trigger');
                    if (!trigger || !mobileDrawer.contains(trigger)) return;

                    const submenu = trigger.nextElementSibling;
                    if (!submenu || !submenu.classList.contains('m-submenu')) return;

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const icon = trigger.querySelector('i');
                    const wasActive = submenu.classList.contains('active') || submenu.classList.contains('show');

                    // Collapse all accordions in mobile drawer
                    mobileDrawer.querySelectorAll('.m-submenu').forEach(sub => {
                        sub.classList.remove('active', 'show');
                    });
                    mobileDrawer.querySelectorAll('.m-trigger i').forEach(ic => {
                        ic.style.transition = 'transform 0.25s ease';
                        ic.style.transform = 'rotate(0deg)';
                    });

                    // Toggle selected accordion
                    if (!wasActive) {
                        submenu.classList.add('active', 'show');
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    }
                }, true);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMegaMenuController);
    } else {
        initMegaMenuController();
    }
})();
