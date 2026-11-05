/**
 * RRC Law Associates - Premium Unified Navigation Mega-Menu Controller
 * Version: 20261105-4
 * Unified Black & Gold System for NRI Services and Practice Areas
 * Split Navigation Trigger: Practice Areas text link navigates; down arrow button toggles dropdown
 */
(function () {
    let activeMenu = null; // 'nri-services' | 'practice-areas' | null

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
            } else {
                // Close both menus
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
        // Natural link behavior preserved; closes menu on navigation
        if (practiceTextLink) {
            practiceTextLink.addEventListener('click', function () {
                setActiveMenu(null);
            });
        }

        // --- HOVER INTERACTIONS ---
        if (nriContainer) {
            nriContainer.addEventListener('mouseenter', function () {
                if (activeMenu === null) {
                    if (nriMenu) nriMenu.classList.remove('is-closed');
                    if (nriToggle) nriToggle.setAttribute('aria-expanded', 'true');
                    if (practiceMenu) practiceMenu.classList.add('is-closed');
                }
            });
            nriContainer.addEventListener('mouseleave', function () {
                if (activeMenu !== 'nri-services') {
                    if (nriMenu) {
                        nriMenu.classList.remove('is-active', 'show');
                        nriMenu.classList.remove('is-closed');
                    }
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
                }
            });
            practiceContainer.addEventListener('mouseleave', function () {
                if (activeMenu !== 'practice-areas') {
                    if (practiceMenu) {
                        practiceMenu.classList.remove('is-active', 'show');
                        practiceMenu.classList.remove('is-closed');
                    }
                    if (practiceArrowToggle) practiceArrowToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Outside Click closes active menu
        document.addEventListener('click', function (e) {
            const inNri = nriContainer && nriContainer.contains(e.target);
            const inPa = practiceContainer && practiceContainer.contains(e.target);
            if (!inNri && !inPa) {
                if (activeMenu !== null) {
                    setActiveMenu(null);
                } else {
                    if (nriMenu) nriMenu.classList.remove('is-closed');
                    if (practiceMenu) practiceMenu.classList.remove('is-closed');
                }
            }
        });

        // Escape Key closes and restores trigger focus (useCapture ensures we intercept before Bootstrap stopPropagation)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const prev = activeMenu;
                if (prev !== null) {
                    setActiveMenu(null);
                    if (prev === 'nri-services' && nriToggle) {
                        nriToggle.focus();
                    } else if (prev === 'practice-areas' && practiceArrowToggle) {
                        practiceArrowToggle.focus();
                    }
                }
            }
        }, true);

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

        // Link Navigation closes menu
        document.querySelectorAll('.dropdown-menu-nri a, .dropdown-menu-practice a').forEach(link => {
            link.addEventListener('click', function () {
                setActiveMenu(null);
            });
        });

        // --- MOBILE DRAWER ACCORDIONS ---
        const mobileDrawer = document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
        if (mobileDrawer) {
            // Guarantee NRI Services exists in mobile drawer
            if (!mobileDrawer.querySelector('#mNriMenu')) {
                const practiceDropdown = mobileDrawer.querySelector('#mPracticeMenu')?.closest('.m-dropdown');
                if (practiceDropdown) {
                    const nriDropdown = document.createElement('div');
                    nriDropdown.className = 'm-dropdown';
                    nriDropdown.innerHTML = `
                        <a class="m-link m-trigger" href="/nri-services.html">
                            NRI Services <i class="fa fa-chevron-down ms-2"></i>
                        </a>
                        <div class="m-submenu" id="mNriMenu">
                            <a class="m-sub-item" href="/oci-card-assistance">OCI Card &amp; Ancestry Assistance</a>
                            <a class="m-sub-item" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>
                            <a class="m-sub-item" href="/nri-landlord-tenant-eviction/">Landlord–Tenant &amp; Eviction</a>
                            <a class="m-sub-item" href="/nri-rera-builder-disputes/">RERA &amp; Builder Disputes</a>
                            <a class="m-sub-item" href="/nri-business-commercial-advisory/">Business &amp; Commercial Advisory</a>
                            <a class="m-sub-item" href="/nri-property-disputes">Property Disputes</a>
                            <a class="m-sub-item" href="/nri-power-of-attorney">Power of Attorney</a>
                            <a class="m-sub-item" href="/us-india-documentation-services/">U.S.–India Documentation</a>
                            <a class="m-sub-item" href="/nri-criminal-case">Criminal Cases</a>
                            <a class="m-sub-item" href="/nri-family-matrimonial">Family &amp; Matrimonial</a>
                        </div>
                    `;
                    practiceDropdown.parentNode.insertBefore(nriDropdown, practiceDropdown);
                }
            }

            // Accordion interactions with 180deg chevron rotation
            const mobileTriggers = mobileDrawer.querySelectorAll('.m-trigger');
            mobileTriggers.forEach(trigger => {
                if (trigger.dataset.megaMenuInit === 'true') return;
                trigger.dataset.megaMenuInit = 'true';

                const icon = trigger.querySelector('i');
                if (icon) {
                    icon.style.transition = 'transform 0.25s ease';
                }

                trigger.addEventListener('click', function (e) {
                    const submenu = this.nextElementSibling;
                    if (!submenu || !submenu.classList.contains('m-submenu')) return;

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const wasActive = submenu.classList.contains('active') || submenu.classList.contains('show');

                    // Collapse all accordions in mobile drawer
                    mobileDrawer.querySelectorAll('.m-submenu').forEach(sub => {
                        sub.classList.remove('active', 'show');
                    });
                    mobileDrawer.querySelectorAll('.m-trigger i').forEach(ic => {
                        ic.style.transform = 'rotate(0deg)';
                    });

                    // Toggle selected accordion
                    if (!wasActive) {
                        submenu.classList.add('active', 'show');
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMegaMenuController);
    } else {
        initMegaMenuController();
    }
})();
