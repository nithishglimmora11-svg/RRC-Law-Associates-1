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