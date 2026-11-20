const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'notary-services.html');
let html = fs.readFileSync(filePath, 'utf8');

const newHeroHtml = `<!-- Top Breadcrumb Bar (Matches Customs Law Reference) -->
        <nav class="notary-breadcrumb-bar" aria-label="Breadcrumb">
            <div class="container">
                <ol>
                    <li><a href="/">Home</a></li>
                    <li class="separator">/</li>
                    <li class="active" aria-current="page">Notary Services</li>
                </ol>
            </div>
        </nav>

        <!-- =====================================================
             1. HERO SECTION: FULL-WIDTH AUTOMATIC CAROUSEL
             ===================================================== -->
        <section class="notary-hero" id="hero" aria-label="Notary and Legal Documentation Services">
            <!-- 3 AI-Generated Photographic Background Slides -->
            <div class="notary-carousel-track" aria-hidden="true">
                <!-- Slide 1: Professional Notary Services -->
                <div class="notary-carousel-slide active" data-index="0" aria-hidden="false">
                    <img src="/assets/images/notary-hero-slide-1.webp"
                        alt="Professional Indian notary and legal documentation specialist reviewing sworn instruments at an executive desk"
                        loading="eager" fetchpriority="high" width="1920" height="1080">
                </div>
                <!-- Slide 2: Legal Documentation Assistance -->
                <div class="notary-carousel-slide" data-index="1" aria-hidden="true">
                    <img src="/assets/images/notary-hero-slide-2.webp"
                        alt="Advocate workspace with official legal bond papers, notary seal embosser, and verification documents"
                        loading="lazy" width="1920" height="1080">
                </div>
                <!-- Slide 3: NRI Legal Documentation -->
                <div class="notary-carousel-slide" data-index="2" aria-hidden="true">
                    <img src="/assets/images/notary-hero-slide-3.webp"
                        alt="NRI legal documentation assistance scene with Indian passport, power of attorney documents, and notary stamp"
                        loading="lazy" width="1920" height="1080">
                </div>
            </div>

            <!-- Sophisticated Dark Navy & Gold-Toned Gradient Overlay -->
            <div class="notary-hero-bg-overlay" aria-hidden="true"></div>

            <!-- Centered Constrained Hero Content Container -->
            <div class="notary-hero-inner">
                <div class="notary-hero-content-wrapper">
                    <!-- Slide 1 Content -->
                    <div class="notary-hero-text-slide active" data-index="0" aria-hidden="false">
                        <div class="notary-hero-eyebrow">
                            <i class="fa-solid fa-stamp" aria-hidden="true"></i> NOTARY &amp; LEGAL DOCUMENTATION SERVICES
                        </div>
                        <h1 class="notary-hero-title">Professional Notary Services</h1>
                        <div class="notary-hero-subtitle">Reliable Legal Documentation Support for Your Important Legal Needs.</div>
                        <div class="notary-hero-topics">
                            <span>Affidavits</span>
                            <span class="topic-sep">|</span>
                            <span>Power of Attorney</span>
                            <span class="topic-sep">|</span>
                            <span>Agreements</span>
                        </div>
                        <p class="notary-hero-desc">
                            Get professional assistance with eligible legal documents and applicable notarization formalities.
                        </p>
                        <div class="notary-hero-actions">
                            <a href="#enquiry-section" class="btn-notary-explore">
                                <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
                                <span>Request a Consultation</span>
                                <i class="fa-solid fa-arrow-right ms-1" aria-hidden="true"></i>
                            </a>
                            <a href="#our-services" class="btn-notary-articles">
                                <i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                                <span>Explore Notary Services</span>
                            </a>
                        </div>
                    </div>

                    <!-- Slide 2 Content -->
                    <div class="notary-hero-text-slide" data-index="1" aria-hidden="true">
                        <div class="notary-hero-eyebrow">
                            <i class="fa-solid fa-file-shield" aria-hidden="true"></i> DOCUMENTATION &amp; LEGAL ASSISTANCE
                        </div>
                        <h2 class="notary-hero-title">Trusted Legal Documentation Assistance</h2>
                        <div class="notary-hero-subtitle">Professional Guidance for Your Important Documents.</div>
                        <div class="notary-hero-topics">
                            <span>Document Review</span>
                            <span class="topic-sep">|</span>
                            <span>Verification</span>
                            <span class="topic-sep">|</span>
                            <span>Declarations</span>
                            <span class="topic-sep">|</span>
                            <span>Agreements</span>
                        </div>
                        <p class="notary-hero-desc">
                            Get assistance with reviewing and preparing legal documents and identifying applicable notarization requirements.
                        </p>
                        <div class="notary-hero-actions">
                            <a href="#enquiry-section" class="btn-notary-explore">
                                <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
                                <span>Request a Consultation</span>
                                <i class="fa-solid fa-arrow-right ms-1" aria-hidden="true"></i>
                            </a>
                            <a href="#our-services" class="btn-notary-articles">
                                <i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                                <span>Explore Notary Services</span>
                            </a>
                        </div>
                    </div>

                    <!-- Slide 3 Content -->
                    <div class="notary-hero-text-slide" data-index="2" aria-hidden="true">
                        <div class="notary-hero-eyebrow">
                            <i class="fa-solid fa-passport" aria-hidden="true"></i> NRI LEGAL DOCUMENTATION
                        </div>
                        <h2 class="notary-hero-title">Notary Assistance for NRIs</h2>
                        <div class="notary-hero-subtitle">Documentation Support for Indians Living Across the World.</div>
                        <div class="notary-hero-topics">
                            <span>NRI Documents</span>
                            <span class="topic-sep">|</span>
                            <span>Power of Attorney</span>
                            <span class="topic-sep">|</span>
                            <span>Affidavits</span>
                            <span class="topic-sep">|</span>
                            <span>Legal Declarations</span>
                        </div>
                        <p class="notary-hero-desc">
                            Get assistance with eligible documentation requirements relating to your legal matters in India.
                        </p>
                        <div class="notary-hero-actions">
                            <a href="#enquiry-section" class="btn-notary-explore">
                                <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
                                <span>Request a Consultation</span>
                                <i class="fa-solid fa-arrow-right ms-1" aria-hidden="true"></i>
                            </a>
                            <a href="#our-services" class="btn-notary-articles">
                                <i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                                <span>Explore Notary Services</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;

const newJsController = `// =========================================================
            // 1. DYNAMIC AI-GENERATED HERO SLIDESHOW (Automatic Transitions Only)
            // =========================================================
            (function initNotaryHeroSlideshow() {
                const hero = document.getElementById('hero');
                if (!hero) return;

                const bgSlides = Array.from(hero.querySelectorAll('.notary-carousel-slide'));
                const textSlides = Array.from(hero.querySelectorAll('.notary-hero-text-slide'));
                if (!bgSlides.length || !textSlides.length) return;

                let currentIndex = 0;
                const totalSlides = bgSlides.length;
                const SLIDE_INTERVAL = 6000;
                let slideshowTimer = null;

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                function preloadNext(index) {
                    const nextIdx = (index + 1) % totalSlides;
                    const nextImg = bgSlides[nextIdx].querySelector('img');
                    if (nextImg && nextImg.src) {
                        const preloader = new Image();
                        preloader.src = nextImg.src;
                    }
                }

                function showSlide(index) {
                    const targetIndex = (index + totalSlides) % totalSlides;
                    if (targetIndex === currentIndex && bgSlides[currentIndex].classList.contains('active')) return;

                    bgSlides[currentIndex].classList.remove('active');
                    bgSlides[currentIndex].setAttribute('aria-hidden', 'true');
                    if (textSlides[currentIndex]) {
                        textSlides[currentIndex].classList.remove('active');
                        textSlides[currentIndex].setAttribute('aria-hidden', 'true');
                    }

                    currentIndex = targetIndex;

                    bgSlides[currentIndex].classList.add('active');
                    bgSlides[currentIndex].setAttribute('aria-hidden', 'false');
                    if (textSlides[currentIndex]) {
                        textSlides[currentIndex].classList.add('active');
                        textSlides[currentIndex].setAttribute('aria-hidden', 'false');
                    }

                    preloadNext(currentIndex);
                }

                function nextSlide() {
                    showSlide(currentIndex + 1);
                }

                function startAutoplay() {
                    if (prefersReducedMotion) return;
                    stopAutoplay();
                    slideshowTimer = setInterval(() => {
                        if (document.visibilityState === 'visible') {
                            nextSlide();
                        }
                    }, SLIDE_INTERVAL);
                }

                function stopAutoplay() {
                    if (slideshowTimer) {
                        clearInterval(slideshowTimer);
                        slideshowTimer = null;
                    }
                }

                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        stopAutoplay();
                    } else {
                        startAutoplay();
                    }
                });

                if (prefersReducedMotion) {
                    bgSlides.forEach((slide, i) => {
                        slide.classList.toggle('active', i === 0);
                        slide.setAttribute('aria-hidden', String(i !== 0));
                    });
                    textSlides.forEach((slide, i) => {
                        slide.classList.toggle('active', i === 0);
                        slide.setAttribute('aria-hidden', String(i !== 0));
                    });
                    return;
                }

                preloadNext(0);
                startAutoplay();
            })();`;

const heroRegex = /<!-- =+[\r\n\s]+1\. HERO SECTION[\s\S]*?<\/section>/;
const jsRegex = /\/\/ =+[\r\n\s]+\/\/ 1\. MULTI-CARD HERO CAROUSEL CONTROLLER[\s\S]*?showSlide\(0\);\s*startAutoplay\(\);\s*\}/;

if (!heroRegex.test(html)) {
  console.error('Failed to match hero regex');
  process.exit(1);
}
if (!jsRegex.test(html)) {
  console.error('Failed to match JS regex');
  process.exit(1);
}

html = html.replace(heroRegex, newHeroHtml);
html = html.replace(jsRegex, newJsController);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated notary-services.html');

