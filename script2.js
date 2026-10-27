(() => {
    // Custom Mobile Dropdown Logic (Handles Multiple Dropdowns)
    const mobileTriggers = document.querySelectorAll('.m-trigger');

    mobileTriggers.forEach(trigger => {
        if (trigger.dataset.boundMTrigger) return;
        trigger.dataset.boundMTrigger = 'true';
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            if (!submenu) return;

            const isCurrentlyActive = submenu.classList.contains('active');

            // Close all open submenus accordion style
            document.querySelectorAll('.m-submenu').forEach(m => {
                m.classList.remove('active');
                m.classList.remove('show');
            });
            document.querySelectorAll('.m-trigger i').forEach(i => i.style.transform = 'rotate(0deg)');

            // Toggle active state
            if (!isCurrentlyActive) {
                submenu.classList.add('active');
                submenu.classList.add('show');
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
})();


    document.addEventListener('DOMContentLoaded', function() {
    // Select the Practice Areas link
    const practiceLink = document.querySelector('.dropdown-toggle[href="nri-services.html"]');

    if (practiceLink && window.innerWidth > 992) {
        practiceLink.addEventListener('click', function(e) {
            // Redirect to the page immediately on click
            window.location.href = this.getAttribute('href');
        });
    }
});

    document.addEventListener('DOMContentLoaded', function() {
    // Select the Practice Areas link
    const practiceLink = document.querySelector('.dropdown-toggle[href="sectors.html"]');

    if (practiceLink && window.innerWidth > 992) {
        practiceLink.addEventListener('click', function(e) {
            // Redirect to the page immediately on click
            window.location.href = this.getAttribute('href');
        });
    }
});

    document.addEventListener('DOMContentLoaded', function() {
    // Select the Practice Areas link
    const practiceLink = document.querySelector('.dropdown-toggle[href="core-practice-areas.html"]');

    if (practiceLink && window.innerWidth > 992) {
        practiceLink.addEventListener('click', function(e) {
            // Redirect to the page immediately on click
            window.location.href = this.getAttribute('href');
        });
    }
});

// Local Development Routing Helper (Only active on localhost / 127.0.0.1)
// Ensures extensionless clean URLs navigate smoothly during local development preview
// without altering production URLs or HTML file links.
(() => {
    if (typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')) {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
            
            try {
                const targetUrl = new URL(href, window.location.origin);
                const pathname = targetUrl.pathname;
                // If clean route without extension (e.g. /wills-probate-estate-administration)
                if (pathname.length > 1 && !pathname.includes('.') && !pathname.endsWith('/')) {
                    e.preventDefault();
                    fetch(targetUrl.href, { method: 'HEAD' })
                        .then(res => {
                            if (res.ok) {
                                window.location.href = targetUrl.pathname + targetUrl.search + targetUrl.hash;
                            } else {
                                window.location.href = targetUrl.pathname + '.html' + targetUrl.search + targetUrl.hash;
                            }
                        })
                        .catch(() => {
                            window.location.href = targetUrl.pathname + '.html' + targetUrl.search + targetUrl.hash;
                        });
                }
            } catch (_) {
                // Ignore any malformed URL
            }
        });
    }
})();
