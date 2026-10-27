// Unit test simulating Apache mod_rewrite for .htaccess rules

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
const rule1Regex = new RegExp(`^/(${ociPattern})\\.html$`, 'i');
const rule2Regex = new RegExp(`^/(${ociPattern})$`, 'i');
const rule3Regex = new RegExp(`^/(${ociPattern})/$`, 'i');
const rule4Regex = /^\/nri-legal-services\/oci-card-assistance\/?$/i;
const rule5Regex = /^\/([^.]+)\.html$/i;
const rule6Regex = /^\/([^/]+)$/;

function simulateRewrite(reqPath) {
    // 1. OCI .html -> 301 to trailing slash canonical
    let m = reqPath.match(rule1Regex);
    if (m) {
        return { status: 301, redirect: `https://rrclawassociates.com/${m[1]}/` };
    }

    // 2. OCI non-slash -> 301 to trailing slash canonical
    m = reqPath.match(rule2Regex);
    if (m) {
        return { status: 301, redirect: `https://rrclawassociates.com/${m[1]}/` };
    }

    // 3. OCI trailing-slash -> 200 internal rewrite to .html
    m = reqPath.match(rule3Regex);
    if (m) {
        return { status: 200, serves: `${m[1]}.html` };
    }

    // 4. Legacy hierarchical OCI assistance -> 301 to canonical /oci-card-assistance
    if (rule4Regex.test(reqPath)) {
        return { status: 301, redirect: 'https://rrclawassociates.com/oci-card-assistance' };
    }

    // 5. Generic .html -> 301 to clean URL
    m = reqPath.match(rule5Regex);
    if (m) {
        return { status: 301, redirect: `/${m[1]}` };
    }

    // 6. Generic clean URL -> 200 internal rewrite to .html
    m = reqPath.match(rule6Regex);
    if (m) {
        return { status: 200, serves: `${m[1]}.html` };
    }

    return { status: 404 };
}

const testCases = [
    { in: '/oci-card-eligibility-legal-status/', expStatus: 200, expServes: 'oci-card-eligibility-legal-status.html' },
    { in: '/oci-card-eligibility-legal-status', expStatus: 301, expRedirect: 'https://rrclawassociates.com/oci-card-eligibility-legal-status/' },
    { in: '/oci-card-eligibility-legal-status.html', expStatus: 301, expRedirect: 'https://rrclawassociates.com/oci-card-eligibility-legal-status/' },
    { in: '/oci-legal-guides/', expStatus: 200, expServes: 'oci-legal-guides.html' },
    { in: '/oci-legal-guides', expStatus: 301, expRedirect: 'https://rrclawassociates.com/oci-legal-guides/' },
    { in: '/oci-legal-guides.html', expStatus: 301, expRedirect: 'https://rrclawassociates.com/oci-legal-guides/' },
    { in: '/oci-card-assistance', expStatus: 200, expServes: 'oci-card-assistance.html' },
    { in: '/oci-card-assistance.html', expStatus: 301, expRedirect: '/oci-card-assistance' },
    { in: '/partners', expStatus: 200, expServes: 'partners.html' },
    { in: '/partners.html', expStatus: 301, expRedirect: '/partners' },
    { in: '/nri-legal-services/oci-card-assistance/', expStatus: 301, expRedirect: 'https://rrclawassociates.com/oci-card-assistance' }
];

let allPassed = true;
testCases.forEach(tc => {
    const res = simulateRewrite(tc.in);
    const pass = res.status === tc.expStatus && (res.serves === tc.expServes || res.redirect === tc.expRedirect);
    console.log(`${pass ? 'PASS' : 'FAIL'}: ${tc.in} -> status ${res.status} (serves: ${res.serves || '-'}, redirect: ${res.redirect || '-'})`);
    if (!pass) allPassed = false;
});

console.log('All rewrite simulations passed:', allPassed);
