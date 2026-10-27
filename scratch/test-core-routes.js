const fs = require('fs');

const OCI_GUIDES = [
    'oci-legal-guides',
    'oci-card-eligibility-legal-status',
    'oci-vs-nri-vs-indian-citizen',
    'oci-card-application-documents',
    'oci-card-indian-ancestry-assistance',
    'oci-foreign-spouse-eligibility',
    'oci-for-children-born-abroad',
    'oci-card-benefits-restrictions-india',
    'oci-cardholders-inherit-sell-ancestral-property-india',
    'nri-oci-property-due-diligence-india',
    'nri-oci-property-tax-india',
    'oci-card-renewal-passport-update',
    'oci-card-cancellation-grounds-remedies',
    'oci-card-cancellation-section-7d-legal-remedies'
];

const ociPattern = OCI_GUIDES.join('|');
const r1Cond = new RegExp('^[A-Z]{3,}\\s/+(' + ociPattern + ')\\.html(?:\\?[^\\s]*)?\\s', 'i');
const r2Rule = new RegExp('^(' + ociPattern + ')$', 'i');
const r3Rule = new RegExp('^(' + ociPattern + ')/$', 'i');
const r4Rule = /^nri-legal-services\/oci-card-assistance\/?$/i;
const r5Cond = /^[A-Z]{3,}\s([^.]+)\.html(?:\?[^\s]*)?\s/i;
const r6Rule = /^([^/]+)$/;

function simulate(reqLine, path) {
    // 1. OCI .html -> /slug/
    let m = reqLine.match(r1Cond);
    if (m) return { status: 301, redirect: `https://rrclawassociates.com/${m[1]}/` };

    // 2. OCI non-slash -> /slug/
    m = path.match(r2Rule);
    if (m) return { status: 301, redirect: `https://rrclawassociates.com/${m[1]}/` };

    // 3. OCI /slug/ -> internal rewrite slug.html
    m = path.match(r3Rule);
    if (m) return { status: 200, file: `${m[1]}.html` };

    // 4. Legacy hierarchical assistance
    if (r4Rule.test(path)) return { status: 301, redirect: 'https://rrclawassociates.com/oci-card-assistance' };

    // 5. Generic .html -> clean URL
    m = reqLine.match(r5Cond);
    if (m) return { status: 301, redirect: m[1] };

    // 6. Generic clean URL -> internal rewrite .html
    m = path.match(r6Rule);
    if (m) return { status: 200, file: `${m[1]}.html` };

    return { status: 404 };
}

const tests = [
    { req: 'GET /partners HTTP/1.1', path: 'partners', expStatus: 200, expFile: 'partners.html' },
    { req: 'GET /partners.html HTTP/1.1', path: 'partners.html', expStatus: 301, expRedirect: '/partners' },
    { req: 'GET /about-us HTTP/1.1', path: 'about-us', expStatus: 200, expFile: 'about-us.html' },
    { req: 'GET /about-us.html HTTP/1.1', path: 'about-us.html', expStatus: 301, expRedirect: '/about-us' },
    { req: 'GET /booking HTTP/1.1', path: 'booking', expStatus: 200, expFile: 'booking.html' },
    { req: 'GET /booking.html HTTP/1.1', path: 'booking.html', expStatus: 301, expRedirect: '/booking' },
    { req: 'GET /oci-card-assistance HTTP/1.1', path: 'oci-card-assistance', expStatus: 200, expFile: 'oci-card-assistance.html' },
    { req: 'GET /oci-card-assistance.html HTTP/1.1', path: 'oci-card-assistance.html', expStatus: 301, expRedirect: '/oci-card-assistance' },
    { req: 'GET /nri-legal-services/oci-card-assistance/ HTTP/1.1', path: 'nri-legal-services/oci-card-assistance/', expStatus: 301, expRedirect: 'https://rrclawassociates.com/oci-card-assistance' },
    { req: 'GET /oci-legal-guides/ HTTP/1.1', path: 'oci-legal-guides/', expStatus: 200, expFile: 'oci-legal-guides.html' },
    { req: 'GET /oci-card-eligibility-legal-status/ HTTP/1.1', path: 'oci-card-eligibility-legal-status/', expStatus: 200, expFile: 'oci-card-eligibility-legal-status.html' }
];

let allPassed = true;
tests.forEach(t => {
    const res = simulate(t.req, t.path);
    const ok = res.status === t.expStatus && (res.file === t.expFile || res.redirect === t.expRedirect);
    console.log(`${ok ? 'PASS' : 'FAIL'}: ${t.req} -> Status ${res.status} (serves: ${res.file || '-'}, redirect: ${res.redirect || '-'})`);
    if (!ok) allPassed = false;
});

console.log('All ordinary and canonical routes passed:', allPassed);
