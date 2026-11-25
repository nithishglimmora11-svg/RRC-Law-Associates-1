/**
 * ====================================================================
 * RRC LAW ASSOCIATES — NRI TAX RETURN FILING SCRIPT
 * Production Interactive Engine (2026)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ----------------------------------------------------------------
    // 1. DYNAMIC HERO CAROUSEL CONTROLLER
    // ----------------------------------------------------------------
    (function initHeroCarousel() {
        const heroSection = document.getElementById('taxHero');
        if (!heroSection) return;

        const slides = heroSection.querySelectorAll('.nri-tax-carousel-slide');
        const dots = heroSection.querySelectorAll('.nri-tax-dot');
        const prevBtn = document.getElementById('taxHeroPrev');
        const nextBtn = document.getElementById('taxHeroNext');
        const controls = heroSection.querySelector('.nri-tax-carousel-controls');

        if (!slides.length) return;

        let currentIndex = 0;
        const totalSlides = slides.length;
        const SLIDE_DURATION = 5000; // Exact 5-second automatic rotation interval
        let autoplayTimer = null;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Preload all slide background images for instant smooth crossfade transitions
        slides.forEach((slide) => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloader = new Image();
                preloader.src = img.src;
            }
        });

        function showSlide(index) {
            const targetIndex = (index + totalSlides) % totalSlides;

            // Remove active state from current slide and dot
            slides.forEach((slide, i) => {
                const isActive = (i === targetIndex);
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', (!isActive).toString());
            });

            dots.forEach((dot, i) => {
                const isActive = (i === targetIndex);
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive.toString());
            });

            currentIndex = targetIndex;
        }

        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        function startAutoplay() {
            if (prefersReducedMotion) return;
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    nextSlide();
                }
            }, SLIDE_DURATION);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Attach event listeners to navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                nextSlide();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                prevSlide();
                resetAutoplay();
            });
        }

        // Dot navigation indicators
        dots.forEach((dot) => {
            dot.addEventListener('click', function (e) {
                e.preventDefault();
                const target = parseInt(this.getAttribute('data-slide-to'), 10);
                if (!isNaN(target)) {
                    showSlide(target);
                    resetAutoplay();
                }
            });
        });

        // Pause ONLY when directly hovering or focusing the navigation controls (dots & arrows)
        // Avoid stalling autoplay when hovering over the main hero content or banner
        if (controls) {
            controls.addEventListener('mouseenter', stopAutoplay);
            controls.addEventListener('mouseleave', startAutoplay);
            controls.addEventListener('focusin', stopAutoplay);
            controls.addEventListener('focusout', startAutoplay);
        }

        // Pause when tab is hidden to conserve system resources
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        // Accessible keyboard navigation when focused on carousel controls
        if (controls) {
            controls.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                    resetAutoplay();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSlide();
                    resetAutoplay();
                }
            });
        }

        // Initialize state
        showSlide(0);
        if (!prefersReducedMotion) {
            startAutoplay();
        }
    })();

    // ----------------------------------------------------------------
    // 2. ACCESSIBLE FAQ ACCORDION CONTROLLER
    // ----------------------------------------------------------------
    (function initFaqAccordion() {
        const faqContainer = document.getElementById('taxFaqAccordion');
        if (!faqContainer) return;

        const faqItems = faqContainer.querySelectorAll('.nri-tax-faq-item');
        if (!faqItems.length) return;

        faqItems.forEach((item, index) => {
            const btn = item.querySelector('.nri-tax-faq-btn');
            const panel = item.querySelector('.nri-tax-faq-panel');

            // Initialize active item if pre-marked in HTML
            if (item.classList.contains('active') && panel) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
                if (btn) btn.setAttribute('aria-expanded', 'true');
            }

            if (btn && panel) {
                btn.addEventListener('click', function () {
                    const isCurrentlyActive = item.classList.contains('active');

                    // Close all sibling accordion panels
                    faqItems.forEach((otherItem) => {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.nri-tax-faq-btn');
                        const otherPanel = otherItem.querySelector('.nri-tax-faq-panel');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherPanel) otherPanel.style.maxHeight = null;
                    });

                    // Toggle current item
                    if (!isCurrentlyActive) {
                        item.classList.add('active');
                        btn.setAttribute('aria-expanded', 'true');
                        panel.style.maxHeight = panel.scrollHeight + 'px';
                    }
                });

                // Accessible Keyboard navigation within FAQ list
                btn.addEventListener('keydown', function (e) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextItem = faqItems[index + 1] || faqItems[0];
                        const nextBtn = nextItem.querySelector('.nri-tax-faq-btn');
                        if (nextBtn) nextBtn.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevItem = faqItems[index - 1] || faqItems[faqItems.length - 1];
                        const prevBtn = prevItem.querySelector('.nri-tax-faq-btn');
                        if (prevBtn) prevBtn.focus();
                    } else if (e.key === 'Home') {
                        e.preventDefault();
                        const firstBtn = faqItems[0].querySelector('.nri-tax-faq-btn');
                        if (firstBtn) firstBtn.focus();
                    } else if (e.key === 'End') {
                        e.preventDefault();
                        const lastBtn = faqItems[faqItems.length - 1].querySelector('.nri-tax-faq-btn');
                        if (lastBtn) lastBtn.focus();
                    }
                });
            }
        });
    })();

    // ----------------------------------------------------------------
    // 3. MOBILE NAVIGATION DRAWER
    // ----------------------------------------------------------------
    (function initMobileNav() {
        const menuToggle = document.getElementById('menuToggle');
        const closeMenu = document.getElementById('closeMenu');
        const mobileMenu = document.getElementById('mobileMenu');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function () {
                mobileMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeMenu && mobileMenu) {
            closeMenu.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        }

        // Submenu trigger in mobile drawer
        const triggers = document.querySelectorAll('.m-trigger');
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                if (submenu) {
                    const isNowActive = submenu.classList.toggle('active');
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.style.transform = isNowActive ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                }
            });
        });
    })();

    // ----------------------------------------------------------------
    // 4. BAR COUNCIL DISCLAIMER OVERLAY
    // ----------------------------------------------------------------
    (function initDisclaimer() {
        const disclaimerOverlay = document.getElementById('disclaimerOverlay');
        const agreeBtn = document.querySelector('.agreeBtn');
        const closeBtn = document.querySelector('.closeBtn');

        if (disclaimerOverlay) {
            if (sessionStorage.getItem('disclaimerAgreed') === 'true') {
                disclaimerOverlay.style.display = 'none';
            } else {
                disclaimerOverlay.style.display = 'flex';
            }

            if (agreeBtn) {
                agreeBtn.addEventListener('click', function () {
                    sessionStorage.setItem('disclaimerAgreed', 'true');
                    disclaimerOverlay.style.display = 'none';
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    disclaimerOverlay.style.display = 'none';
                });
            }
        }
    })();

    // ----------------------------------------------------------------
    // 5. COPYRIGHT YEAR AUTO-UPDATE
    // ----------------------------------------------------------------
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

