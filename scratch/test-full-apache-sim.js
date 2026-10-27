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

// Updated Rule 1 Regex supporting optional query strings
const r1Cond = new RegExp('^[A-Z]{3,}\\s/+(' + ociPattern + ')\\.html(?:\\?[^\\s]*)?\\s', 'i');
const r2Rule = new RegExp('^(' + ociPattern + ')$', 'i');
const r3Rule = new RegExp('^(' + ociPattern + ')/$', 'i');
const r4Rule = /^\/nri-legal-services\/oci-card-assistance\/?$/i;
const r5Cond = /^[A-Z]{3,}\s([^.]+)\.html(?:\?[^\s]*)?\s/i;
const r6Rule = /^([^/]+)$/;

function parseRequest(rawRequestLine) {
    // rawRequestLine e.g. "GET /path/file.ext?query HTTP/1.1"
    const parts = rawRequestLine.split(' ');
    const method = parts[0];
    const fullUri = parts[1];
    const proto = parts[2];
    const [pathPart, queryPart] = fullUri.split('?');
    const queryString = queryPart || '';
    const relUri = pathPart.replace(/^\/+/, '');
    return { rawRequestLine, method, fullUri, pathPart, queryString, relUri };
}

function simulateApache(rawRequestLine) {
    const req = parseRequest(rawRequestLine);
    
    // --- Rule 1: OCI .html redirect ---
    const m1 = req.rawRequestLine.match(r1Cond);
    if (m1) {
        const slug = m1[1];
        const qs = req.queryString ? '?' + req.queryString : '';
        return {
            status: 301,
            rule: 'Rule 1 (OCI .html -> /slug/)',
            capturedSlug: slug,
            redirect: 'https://rrclawassociates.com/' + slug + '/' + qs
        };
    }

    // --- Rule 2: OCI non-trailing slash redirect ---
    const m2 = req.relUri.match(r2Rule);
    if (m2) {
        const slug = m2[1];
        const qs = req.queryString ? '?' + req.queryString : '';
        return {
            status: 301,
            rule: 'Rule 2 (OCI /slug -> /slug/)',
            capturedSlug: slug,
            redirect: 'https://rrclawassociates.com/' + slug + '/' + qs
        };
    }

    // --- Rule 3: OCI trailing slash internal rewrite ---
    const m3 = req.relUri.match(r3Rule);
    if (m3) {
        const slug = m3[1];
        const targetFile = slug + '.html';
        return {
            status: 200,
            rule: 'Rule 3 (Internal Rewrite -> .html)',
            servesFile: targetFile,
            queryString: req.queryString
        };
    }

    // --- Rule 4: Legacy hierarchical assistance redirect ---
    if (r4Rule.test(req.pathPart)) {
        return {
            status: 301,
            rule: 'Rule 4 (Legacy nri-legal-services/oci-card-assistance)',
            redirect: 'https://rrclawassociates.com/oci-card-assistance'
        };
    }

    // --- Rule 5: Site-wide generic .html redirect ---
    const m5 = req.rawRequestLine.match(r5Cond);
    if (m5) {
        const cleanPath = m5[1];
        const qs = req.queryString ? '?' + req.queryString : '';
        return {
            status: 301,
            rule: 'Rule 5 (Site-wide .html -> clean URL)',
            redirect: cleanPath + qs
        };
    }

    // --- Rule 6: Site-wide clean URL internal rewrite ---
    const m6 = req.relUri.match(r6Rule);
    if (m6) {
        const cleanName = m6[1];
        return {
            status: 200,
            rule: 'Rule 6 (Site-wide clean URL -> .html)',
            servesFile: cleanName + '.html',
            queryString: req.queryString
        };
    }

    return { status: 404, rule: 'None matched' };
}

// Run comprehensive test suite
let total = 0;
let passed = 0;
const failures = [];

function assertTest(desc, rawReq, expected) {
    total++;
    const res = simulateApache(rawReq);
    let ok = res.status === expected.status;
    if (expected.redirect && res.redirect !== expected.redirect) ok = false;
    if (expected.servesFile && res.servesFile !== expected.servesFile) ok = false;
    if (expected.capturedSlug && res.capturedSlug !== expected.capturedSlug) ok = false;

    if (ok) {
        passed++;
    } else {
        failures.push({ desc, rawReq, expected, actual: res });
    }
}

// 1. Test all 14 OCI articles across 4 permutations:
//   a) .html (no query)
//   b) .html with query params
//   c) non-trailing slash (no query)
//   d) non-trailing slash with query params
//   e) canonical trailing slash (no query)
//   f) canonical trailing slash with query params
OCI_GUIDES.forEach(slug => {
    // a
    assertTest(`${slug} .html`, `GET /${slug}.html HTTP/1.1`, {
        status: 301,
        redirect: `https://rrclawassociates.com/${slug}/`,
        capturedSlug: slug
    });
    // b
    assertTest(`${slug} .html with query`, `GET /${slug}.html?utm_source=google&gclid=xyz123 HTTP/1.1`, {
        status: 301,
        redirect: `https://rrclawassociates.com/${slug}/?utm_source=google&gclid=xyz123`,
        capturedSlug: slug
    });
    // c
    assertTest(`${slug} non-trailing slash`, `GET /${slug} HTTP/1.1`, {
        status: 301,
        redirect: `https://rrclawassociates.com/${slug}/`,
        capturedSlug: slug
    });
    // d
    assertTest(`${slug} non-trailing slash with query`, `GET /${slug}?ref=twitter&lang=en HTTP/1.1`, {
        status: 301,
        redirect: `https://rrclawassociates.com/${slug}/?ref=twitter&lang=en`,
        capturedSlug: slug
    });
    // e
    assertTest(`${slug} canonical trailing slash`, `GET /${slug}/ HTTP/1.1`, {
        status: 200,
        servesFile: `${slug}.html`
    });
    // f
    assertTest(`${slug} canonical trailing slash with query`, `GET /${slug}/?session=abc HTTP/1.1`, {
        status: 200,
        servesFile: `${slug}.html`
    });
});

// 2. Test site-wide pages:
const generalPages = ['partners', 'oci-card-assistance', 'about-us', 'family-law', 'booking', 'core-practice-areas'];
generalPages.forEach(p => {
    assertTest(`${p} .html`, `GET /${p}.html HTTP/1.1`, {
        status: 301,
        redirect: `/${p}`
    });
    assertTest(`${p} .html with query`, `GET /${p}.html?source=newsletter HTTP/1.1`, {
        status: 301,
        redirect: `/${p}?source=newsletter`
    });
    assertTest(`${p} clean URL`, `GET /${p} HTTP/1.1`, {
        status: 200,
        servesFile: `${p}.html`
    });
    assertTest(`${p} clean URL with query`, `GET /${p}?ref=web HTTP/1.1`, {
        status: 200,
        servesFile: `${p}.html`
    });
});

// 3. Test legacy hierarchical route
assertTest('legacy oci service URL', `GET /nri-legal-services/oci-card-assistance/ HTTP/1.1`, {
    status: 301,
    redirect: 'https://rrclawassociates.com/oci-card-assistance'
});
assertTest('legacy oci service URL without slash', `GET /nri-legal-services/oci-card-assistance HTTP/1.1`, {
    status: 301,
    redirect: 'https://rrclawassociates.com/oci-card-assistance'
});

console.log(`SIMULATION RESULTS:`);
console.log(`Total test cases: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);

if (failures.length > 0) {
    console.error('FAILURES:', JSON.stringify(failures, null, 2));
    process.exit(1);
} else {
    console.log('ALL SIMULATION CASES PASSED PERFECTLY!');
    process.exit(0);
}
