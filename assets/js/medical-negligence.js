/**
 * RRC Law Associates — Medical Negligence Legal Guides Interactive Features
 * File: assets/js/medical-negligence.js
 * Scoped to: body.medneg-page
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. In-Hero Quick TOC Toggle (Expand / Collapse)
  const tocBox = document.getElementById('articleQuickToc');
  const tocToggleBtn = document.querySelector('.medneg-toc-toggle-btn');
  const tocHeader = document.querySelector('.medneg-toc-header');

  function toggleToc() {
    if (!tocBox) return;
    const isCollapsed = tocBox.classList.toggle('collapsed');
    if (tocToggleBtn) {
      tocToggleBtn.setAttribute('aria-expanded', !isCollapsed);
      const textSpan = tocToggleBtn.querySelector('.toggle-text');
      if (textSpan) {
        textSpan.textContent = isCollapsed ? 'Show' : 'Hide';
      }
    }
  }

  if (tocToggleBtn) {
    tocToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleToc();
    });
  }

  if (tocHeader) {
    tocHeader.addEventListener('click', function (e) {
      if (e.target !== tocToggleBtn && !tocToggleBtn.contains(e.target)) {
        toggleToc();
      }
    });
  }

  // Auto-collapse TOC on small screens by default to save vertical viewport space
  if (window.innerWidth <= 768 && tocBox) {
    tocBox.classList.add('collapsed');
    if (tocToggleBtn) {
      tocToggleBtn.setAttribute('aria-expanded', 'false');
      const textSpan = tocToggleBtn.querySelector('.toggle-text');
      if (textSpan) textSpan.textContent = 'Show';
    }
  }

  // 2. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.medneg-faq-question');
  faqQuestions.forEach(function (q) {
    q.addEventListener('click', function () {
      const item = this.closest('.medneg-faq-item');
      if (!item) return;
      const isActive = item.classList.contains('active');

      // Close all other FAQs in the same section
      document.querySelectorAll('.medneg-faq-item').forEach(function (el) {
        el.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 3. Smooth Scrolling with Fixed Header Stack Offset (135px)
  const allTocLinks = document.querySelectorAll('.medneg-toc-list a, .medneg-quick-toc-grid a');
  allTocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const isMobile = window.innerWidth <= 600;
          const headerOffset = isMobile ? 115 : 135;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update active link in sidebar TOC
          document.querySelectorAll('.medneg-toc-list a').forEach(function (l) {
            l.classList.remove('active');
          });
          const matchingSidebarLink = document.querySelector('.medneg-toc-list a[href="' + href + '"]');
          if (matchingSidebarLink) {
            matchingSidebarLink.classList.add('active');
          }
        }
      }
    });
  });

  // 4. Scrollspy for Active Heading Highlight in Sidebar TOC
  const headings = Array.from(document.querySelectorAll('.medneg-main-content h2'));
  const sidebarLinks = document.querySelectorAll('.medneg-toc-list a');

  if ('IntersectionObserver' in window && headings.length > 0 && sidebarLinks.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            sidebarLinks.forEach(function (l) {
              if (l.getAttribute('href') === '#' + id) {
                l.classList.add('active');
              } else {
                l.classList.remove('active');
              }
            });
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-135px 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(function (h) {
      if (h.id) observer.observe(h);
    });
  }
});
