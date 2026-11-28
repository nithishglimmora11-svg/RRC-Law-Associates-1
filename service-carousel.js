/**
 * RRC Law Associates — Accessible Touch-Enabled Service Hero Carousel
 */
(function() {
  'use strict';

  function initCarousel(carouselEl) {
    if (!carouselEl) return;

    var slides = carouselEl.querySelectorAll('.srv-carousel-slide');
    var dots = carouselEl.querySelectorAll('.srv-carousel-dot');
    var prevBtn = carouselEl.querySelector('.srv-carousel-arrow.prev');
    var nextBtn = carouselEl.querySelector('.srv-carousel-arrow.next');

    if (!slides.length) return;

    var currentIndex = 0;
    var totalSlides = slides.length;
    var autoplayInterval = null;
    var autoplayDelay = 6000;
    var isPaused = false;

    // Touch variables
    var touchStartX = 0;
    var touchEndX = 0;

    function goToSlide(index) {
      if (index < 0) {
        index = totalSlides - 1;
      } else if (index >= totalSlides) {
        index = 0;
      }

      for (var i = 0; i < totalSlides; i++) {
        slides[i].classList.remove('active');
        slides[i].setAttribute('aria-hidden', 'true');
        if (dots[i]) {
          dots[i].classList.remove('active');
          dots[i].setAttribute('aria-selected', 'false');
        }
      }

      slides[index].classList.add('active');
      slides[index].setAttribute('aria-hidden', 'false');
      if (dots[index]) {
        dots[index].classList.add('active');
        dots[index].setAttribute('aria-selected', 'true');
      }

      currentIndex = index;
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
      // Don't autoplay if user prefers reduced motion
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      stopAutoplay();
      autoplayInterval = setInterval(function() {
        if (!isPaused) {
          nextSlide();
        }
      }, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    // Events
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prevSlide();
        stopAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
        stopAutoplay();
      });
    }

    dots.forEach(function(dot, idx) {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        goToSlide(idx);
        stopAutoplay();
      });
    });

    // Pause on mouse hover & keyboard focus
    carouselEl.addEventListener('mouseenter', function() {
      isPaused = true;
    });

    carouselEl.addEventListener('mouseleave', function() {
      isPaused = false;
    });

    carouselEl.addEventListener('focusin', function() {
      isPaused = true;
    });

    carouselEl.addEventListener('focusout', function() {
      isPaused = false;
    });

    // Keyboard support
    carouselEl.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
      }
    });

    // Touch & Swipe gestures
    carouselEl.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    carouselEl.addEventListener('touchend', function(e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].clientX;
        var diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40) { // threshold
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          stopAutoplay();
        }
      }
    }, { passive: true });

    function syncBreadcrumbOffset() {
      var bcWrap = carouselEl.querySelector('.srv-hero-breadcrumb-wrap');
      if (!bcWrap) return;
      var topPx = parseFloat(window.getComputedStyle(bcWrap).top) || 24;
      var gapPx = window.innerWidth < 768 ? 20 : 24;
      carouselEl.style.setProperty('--srv-hero-content-top', Math.ceil(topPx + bcWrap.offsetHeight + gapPx) + 'px');
    }

    // Initialize
    syncBreadcrumbOffset();
    window.addEventListener('resize', syncBreadcrumbOffset);
    goToSlide(0);
    startAutoplay();
  }

  document.addEventListener('DOMContentLoaded', function() {
    var carousels = document.querySelectorAll('.srv-carousel-wrapper');
    carousels.forEach(function(c) {
      initCarousel(c);
    });
  });
})();
