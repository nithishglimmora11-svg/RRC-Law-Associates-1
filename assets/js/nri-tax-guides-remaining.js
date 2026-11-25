/**
 * RRC Law Associates — NRI Tax Legal Guides Client Interactions
 * File: assets/js/nri-tax-guides-remaining.js
 * Version: 20261121-1
 *
 * Dedicated interactions for:
 * 1. nri-residential-status-india.html (Article 4)
 * 2. dtaa-benefits-for-nris-india.html (Article 5)
 * 3. nri-tds-refund-india.html (Article 6)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Table of Contents Smooth Scroll with Precise Offset
    const tocLinks = document.querySelectorAll('.nri-toc-list a[href^="#"]');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without abrupt jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // 2. Highlight Active Table of Contents Item on Scroll
    const observerSections = document.querySelectorAll('.nri-guide-section[id], section[id^="section-"]');
    if (observerSections.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-130px 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    tocLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.fontWeight = '700';
                            link.style.color = '#775A19';
                            link.style.backgroundColor = '#f1f5f9';
                            link.style.borderLeft = '3px solid #775A19';
                            link.style.paddingLeft = '12px';
                        } else {
                            link.style.fontWeight = 'normal';
                            link.style.color = '#475569';
                            link.style.backgroundColor = 'transparent';
                            link.style.borderLeft = 'none';
                            link.style.paddingLeft = '8px';
                        }
                    });
                }
            });
        }, observerOptions);

        observerSections.forEach(sec => observer.observe(sec));
    }

    // 3. Current Year Auto-Update
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Mobile Menu Drawer Synchronization (if drawer exists)
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // 5. Disclaimer Overlay Handler (if present)
    const agreeBtn = document.getElementById('agree-btn');
    const disclaimerOverlay = document.getElementById('disclaimerOverlay');
    if (agreeBtn && disclaimerOverlay) {
        agreeBtn.addEventListener('click', () => {
            disclaimerOverlay.style.display = 'none';
        });
    }
});

