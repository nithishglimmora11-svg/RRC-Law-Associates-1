const fs = require('fs');

let code = fs.readFileSync('script2.js', 'utf8');
const helper = `

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
`;

if (!code.includes('Local Development Routing Helper')) {
    fs.writeFileSync('script2.js', code + helper, 'utf8');
    console.log('Successfully appended helper to script2.js');
} else {
    console.log('Helper already exists');
}

