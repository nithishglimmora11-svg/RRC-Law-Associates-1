/**
 * ====================================================================
 * RRC LAW ASSOCIATES — NRI TAX DISPUTE RESOLUTION SCRIPT
 * Production Interactive Engine v1.0 (2026)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ----------------------------------------------------------------
    // 1. DYNAMIC HERO CAROUSEL CONTROLLER
    // ----------------------------------------------------------------
    (function initHeroCarousel() {
        const heroSection = document.getElementById('disputeHero');
        if (!heroSection) return;

        const slides = heroSection.querySelectorAll('.ntd-carousel-slide');
        const dots = heroSection.querySelectorAll('.ntd-dot');
        const prevBtn = document.getElementById('disputeHeroPrev');
        const nextBtn = document.getElementById('disputeHeroNext');
        const controls = heroSection.querySelector('.ntd-carousel-controls');

        if (!slides.length) return;

        let currentIndex = 0;
        const totalSlides = slides.length;
        const SLIDE_DURATION = 5000;
        let autoplayTimer = null;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Preload all slide background images
        slides.forEach(function (slide) {
            const img = slide.querySelector('img');
            if (img && img.src) {
                var preloader = new Image();
                preloader.src = img.src;
            }
        });

        function showSlide(index) {
            var targetIndex = (index + totalSlides) % totalSlides;

            slides.forEach(function (slide, i) {
                var isActive = (i === targetIndex);
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', (!isActive).toString());
            });

            dots.forEach(function (dot, i) {
                var isActive = (i === targetIndex);
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive.toString());
            });

            currentIndex = targetIndex;
        }

        function nextSlide() { showSlide(currentIndex + 1); }
        function prevSlide() { showSlide(currentIndex - 1); }

        function startAutoplay() {
            if (prefersReducedMotion) return;
            stopAutoplay();
            autoplayTimer = setInterval(function () {
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

        // Navigation button listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault(); nextSlide(); resetAutoplay();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault(); prevSlide(); resetAutoplay();
            });
        }

        // Dot navigation
        dots.forEach(function (dot) {
            dot.addEventListener('click', function (e) {
                e.preventDefault();
                var target = parseInt(this.getAttribute('data-slide-to'), 10);
                if (!isNaN(target)) { showSlide(target); resetAutoplay(); }
            });
        });

        // Pause only on control hover (not hero content)
        if (controls) {
            controls.addEventListener('mouseenter', stopAutoplay);
            controls.addEventListener('mouseleave', startAutoplay);
            controls.addEventListener('focusin', stopAutoplay);
            controls.addEventListener('focusout', startAutoplay);
        }

        // Pause when tab hidden
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { stopAutoplay(); } else { startAutoplay(); }
        });

        // Keyboard navigation
        if (controls) {
            controls.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); resetAutoplay(); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); resetAutoplay(); }
            });
        }

        // Initialize
        showSlide(0);
        if (!prefersReducedMotion) { startAutoplay(); }
    })();

    // ----------------------------------------------------------------
    // 2. ACCESSIBLE FAQ ACCORDION CONTROLLER
    // ----------------------------------------------------------------
    (function initFaqAccordion() {
        var faqContainer = document.getElementById('disputeFaqAccordion');
        if (!faqContainer) return;

        var faqItems = faqContainer.querySelectorAll('.ntd-faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(function (item, index) {
            var btn = item.querySelector('.ntd-faq-btn');
            var panel = item.querySelector('.ntd-faq-panel');

            if (item.classList.contains('active') && panel) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
                if (btn) btn.setAttribute('aria-expanded', 'true');
            }

            if (btn && panel) {
                btn.addEventListener('click', function () {
                    var isCurrentlyActive = item.classList.contains('active');

                    faqItems.forEach(function (otherItem) {
                        otherItem.classList.remove('active');
                        var otherBtn = otherItem.querySelector('.ntd-faq-btn');
                        var otherPanel = otherItem.querySelector('.ntd-faq-panel');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherPanel) otherPanel.style.maxHeight = null;
                    });

                    if (!isCurrentlyActive) {
                        item.classList.add('active');
                        btn.setAttribute('aria-expanded', 'true');
                        panel.style.maxHeight = panel.scrollHeight + 'px';
                    }
                });

                btn.addEventListener('keydown', function (e) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        var nextItem = faqItems[index + 1] || faqItems[0];
                        var nextBtn = nextItem.querySelector('.ntd-faq-btn');
                        if (nextBtn) nextBtn.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        var prevItem = faqItems[index - 1] || faqItems[faqItems.length - 1];
                        var prevBtn = prevItem.querySelector('.ntd-faq-btn');
                        if (prevBtn) prevBtn.focus();
                    } else if (e.key === 'Home') {
                        e.preventDefault();
                        var firstBtn = faqItems[0].querySelector('.ntd-faq-btn');
                        if (firstBtn) firstBtn.focus();
                    } else if (e.key === 'End') {
                        e.preventDefault();
                        var lastBtn = faqItems[faqItems.length - 1].querySelector('.ntd-faq-btn');
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
        var menuToggle = document.getElementById('menuToggle');
        var closeMenu = document.getElementById('closeMenu');
        var mobileMenu = document.getElementById('mobileMenu');

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

        var triggers = document.querySelectorAll('.m-trigger');
        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                var submenu = this.nextElementSibling;
                if (submenu) {
                    var isNowActive = submenu.classList.toggle('active');
                    var icon = this.querySelector('i');
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
        var disclaimerOverlay = document.getElementById('disclaimerOverlay');
        var agreeBtn = document.querySelector('.agreeBtn');
        var closeBtn = document.querySelector('.closeBtn');

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
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

