const fs = require('fs');

const allHtml = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const OCI_GUIDES = [
    'oci-legal-guides.html',
    'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
    'oci-card-indian-ancestry-assistance.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html'
];

const nonOciHtml = allHtml.filter(f => !OCI_GUIDES.includes(f) && f !== 'index.html');

console.log(`Testing all ${nonOciHtml.length} non-OCI HTML pages...`);

const r5Cond = /^[A-Z]{3,}\s([^.]+)\.html(?:\?[^\s]*)?\s/i;
const r6Rule = /^([^/]+)$/;

let allPassed = true;

nonOciHtml.forEach(file => {
    const slug = file.replace(/\.html$/, '');
    
    // Test 1: .html request
    const reqLine = `GET /${file} HTTP/1.1`;
    const m5 = reqLine.match(r5Cond);
    if (!m5 || m5[1] !== `/${slug}`) {
        console.error(`FAIL Rule 5: ${file} did not match clean URL redirect:`, m5);
        allPassed = false;
    }

    // Test 2: clean URL internal rewrite
    const m6 = slug.match(r6Rule);
    if (!m6 || m6[1] !== slug) {
        console.error(`FAIL Rule 6: ${slug} did not match internal rewrite:`, m6);
        allPassed = false;
    }
});

console.log(`All ${nonOciHtml.length} non-OCI pages tested. Status: ${allPassed ? 'ALL PASSED 100%' : 'FAILURES OCCURRED'}`);
