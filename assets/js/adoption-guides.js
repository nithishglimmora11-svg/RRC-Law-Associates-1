/**
 * RRC Law Associates — Adoption Legal Guides Interactive Client Scripts
 * File: assets/js/adoption-guides.js
 * Version: 20261121-1
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Table of Contents Smooth Scroll with 120px Sticky Header Offset
    const tocLinks = document.querySelectorAll('.adoption-toc-list a[href^="#"]');
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

                // Update URL hash
                history.pushState(null, null, targetId);

                // If mobile TOC is open, close it after clicking
                const tocCard = document.querySelector('.adoption-toc-card');
                if (tocCard && tocCard.classList.contains('show-mobile')) {
                    tocCard.classList.remove('show-mobile');
                    const toggleBtn = document.querySelector('.adoption-mobile-toc-toggle');
                    if (toggleBtn) {
                        toggleBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // 2. Active Section Highlighting in Table of Contents
    const sections = [];
    tocLinks.forEach(link => {
        const id = link.getAttribute('href');
        if (id && id.startsWith('#') && id.length > 1) {
            const el = document.querySelector(id);
            if (el) sections.push({ link, el });
        }
    });

    if (sections.length > 0) {
        const onScroll = () => {
            const scrollPos = window.pageYOffset + 140;
            let current = sections[0];

            for (let i = 0; i < sections.length; i++) {
                if (sections[i].el.offsetTop <= scrollPos) {
                    current = sections[i];
                }
            }

            sections.forEach(s => s.link.classList.remove('active'));
            if (current) {
                current.link.classList.add('active');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // initialize
    }

    // 3. Mobile Table of Contents Toggle
    const mobileTocBtn = document.querySelector('.adoption-mobile-toc-toggle');
    const tocCard = document.querySelector('.adoption-toc-card');
    if (mobileTocBtn && tocCard) {
        mobileTocBtn.addEventListener('click', () => {
            const isShown = tocCard.classList.toggle('show-mobile');
            mobileTocBtn.setAttribute('aria-expanded', isShown ? 'true' : 'false');
            const icon = mobileTocBtn.querySelector('i');
            if (icon) {
                icon.className = isShown ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
            }
        });
    }

    // 4. Accessible FAQ Accordions
    const faqItems = document.querySelectorAll('.adoption-faq-item');
    faqItems.forEach((item, index) => {
        const btn = item.querySelector('.adoption-faq-question');
        const ans = item.querySelector('.adoption-faq-answer');

        if (btn && ans) {
            const qId = `adoption-faq-q-${index}`;
            const aId = `adoption-faq-a-${index}`;
            btn.id = qId;
            btn.setAttribute('aria-controls', aId);
            ans.id = aId;
            ans.setAttribute('aria-labelledby', qId);

            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close other items in the same accordion group
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.adoption-faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                item.classList.toggle('active', !isActive);
                btn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
            });
        }
    });

    // 5. Update Dynamic Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

