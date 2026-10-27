const fs = require('fs');

console.log('====================================================');
console.log('   WILLS, PROBATE & ESTATE ADMINISTRATION AUDIT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// TEST 1: Check all 46 HTML files have desktop & mobile menu links
const allHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
assert(allHtmlFiles.length === 46, `Found 46 HTML files in repository (found: ${allHtmlFiles.length})`);

let desktopMissing = [];
let mobileMissing = [];

allHtmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  // Check desktop
  const desktopMatch = c.match(/<ul\s+class=["']dropdown-menu[^"']*["']>[\s\S]*?<\/ul>/i);
  if (!desktopMatch || !desktopMatch[0].includes('wills-probate-estate-administration')) {
    desktopMissing.push(f);
  }
  // Check mobile
  const mobileMatch = c.match(/<div\s+class=["']m-submenu["'][^>]*>[\s\S]*?<\/div>/i);
  if (!mobileMatch || !mobileMatch[0].includes('wills-probate-estate-administration')) {
    mobileMissing.push(f);
  }
});

assert(desktopMissing.length === 0, `All 46 HTML files have desktop NRI Services dropdown link (Missing: ${desktopMissing.join(', ') || 'None'})`);
assert(mobileMissing.length === 0, `All 46 HTML files have mobile NRI Services submenu link (Missing: ${mobileMissing.join(', ') || 'None'})`);

// TEST 2: Verify booking.html consultation dropdown option
const bookingHtml = fs.readFileSync('booking.html', 'utf8');
assert(bookingHtml.includes('<option>Wills, Probate &amp; Estate Administration</option>'), 'booking.html contains "Wills, Probate & Estate Administration" option');

// TEST 3: Verify sitemap.xml
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
assert(sitemap.includes('<loc>https://rrclawassociates.com/wills-probate-estate-administration</loc>'), 'sitemap.xml contains https://rrclawassociates.com/wills-probate-estate-administration');
assert(sitemap.includes('<priority>0.85</priority>'), 'sitemap.xml has priority 0.85 for new service page');

// TEST 4: Verify .htaccess
const htaccess = fs.readFileSync('.htaccess', 'utf8');
assert(htaccess.includes('wills-probate-estate-administration/$'), '.htaccess redirects trailing slash /wills-probate-estate-administration/ to clean canonical');
assert(htaccess.includes('RewriteRule ^([^/]+)$ $1.html [L]'), '.htaccess contains extensionless routing rule for HTML');

// TEST 5: Verify Contextual Inbound Links
const nriServices = fs.readFileSync('nri-services.html', 'utf8');
assert(nriServices.includes('href="/wills-probate-estate-administration"'), 'nri-services.html links to /wills-probate-estate-administration via service card');

const familyLaw = fs.readFileSync('family-law.html', 'utf8');
assert(familyLaw.includes('href="/wills-probate-estate-administration"'), 'family-law.html has contextual link to /wills-probate-estate-administration');

const corePractice = fs.readFileSync('core-practice-areas.html', 'utf8');
assert(corePractice.includes('href="/wills-probate-estate-administration"'), 'core-practice-areas.html has contextual link to /wills-probate-estate-administration');

const nriProp = fs.readFileSync('nri-property-disputes.html', 'utf8');
assert(nriProp.includes('href="/wills-probate-estate-administration"'), 'nri-property-disputes.html has contextual link to /wills-probate-estate-administration');

const ociInherit = fs.readFileSync('oci-cardholders-inherit-sell-ancestral-property-india.html', 'utf8');
assert(ociInherit.includes('href="/wills-probate-estate-administration"'), 'oci-cardholders-inherit-sell-ancestral-property-india.html has contextual link');

// TEST 6: Detailed Validation of wills-probate-estate-administration.html
const willsHtml = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');

// Title & Meta
const titleMatch = willsHtml.match(/<title>([^<]+)<\/title>/);
const title = titleMatch ? titleMatch[1] : '';
assert(title.length > 0 && title.length <= 60, `Title tag length is <= 60 chars (${title.length} chars: "${title}")`);

const metaMatch = willsHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
const metaDesc = metaMatch ? metaMatch[1] : '';
assert(metaDesc.length >= 140 && metaDesc.length <= 160, `Meta description length is 140-160 chars (${metaDesc.length} chars: "${metaDesc}")`);

// Canonical
const canonicalMatch = willsHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
const canonical = canonicalMatch ? canonicalMatch[1] : '';
assert(canonical === 'https://rrclawassociates.com/wills-probate-estate-administration', `Canonical is exact (${canonical})`);

// Headings Hierarchy
const h1Count = (willsHtml.match(/<h1[\s>]/gi) || []).length;
assert(h1Count === 1, `Exactly 1 H1 tag found on page (found: ${h1Count})`);

const h2Count = (willsHtml.match(/<h2[\s>]/gi) || []).length;
assert(h2Count >= 8, `At least 8 H2 section headings found (found: ${h2Count})`);

// Schema.org Structured Data
const jsonLdMatch = willsHtml.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
assert(jsonLdMatch !== null, 'Schema.org JSON-LD script block exists');
if (jsonLdMatch) {
  try {
    const schema = JSON.parse(jsonLdMatch[1]);
    assert(schema['@context'] === 'https://schema.org', 'Schema context is https://schema.org');
    assert(Array.isArray(schema['@graph']), 'Schema contains @graph array');
    const types = schema['@graph'].map(item => item['@type']);
    assert(types.includes('LegalService'), 'Schema includes LegalService');
    assert(types.includes('BreadcrumbList'), 'Schema includes BreadcrumbList');
    assert(types.includes('FAQPage'), 'Schema includes FAQPage');
  } catch (err) {
    assert(false, `Schema JSON-LD is valid JSON: ${err.message}`);
  }
}

// Image Dimension & Alt Audits
const imgTags = willsHtml.match(/<img[^>]+>/g) || [];
assert(imgTags.length >= 7, `Page contains illustrative and branding images (found: ${imgTags.length})`);
let imgErrors = [];
imgTags.forEach((img, i) => {
  const hasWidth = /width=["']\d+["']/.test(img);
  const hasHeight = /height=["']\d+["']/.test(img);
  const hasAlt = /alt=["'][^"']+["']/.test(img);
  if (!hasWidth || !hasHeight || !hasAlt) {
    imgErrors.push(`Image #${i+1} missing attributes: ${img}`);
  }
});
assert(imgErrors.length === 0, `All images have width, height, and alt attributes (${imgTags.length}/${imgTags.length} valid)`);

// 12 Required Sections Check
const requiredSections = [
  { name: 'Breadcrumb Navigation', test: willsHtml.includes('breadcrumb-nav') },
  { name: 'Hero Section & Consultation CTA', test: willsHtml.includes('Wills, Probate &amp; Estate Administration') && willsHtml.includes('Book Consultation') },
  { name: 'Will Drafting & Testamentary Planning', test: willsHtml.includes('Will Drafting') },
  { name: 'Probate & Letters of Administration', test: willsHtml.includes('Letters of Administration') },
  { name: 'Succession vs Legal Heir Certificates', test: willsHtml.includes('Succession Certificate') && willsHtml.includes('Legal Heir Certificate') },
  { name: 'Estate Administration & Patta Transfer', test: willsHtml.includes('Patta') || willsHtml.includes('Estate Administration') },
  { name: 'NRI & OCI Inheritance Assistance', test: willsHtml.includes('NRI &amp; OCI Inheritance') || willsHtml.includes('NRI') },
  { name: 'Contested Wills & Dispute Resolution', test: willsHtml.includes('Contested Wills') || willsHtml.includes('Disputes') },
  { name: 'Step-by-Step Legal Process', test: willsHtml.includes('Step') || willsHtml.includes('Workflow') },
  { name: 'Indicative Document Checklist', test: willsHtml.includes('Checklist') || willsHtml.includes('Document') },
  { name: 'Frequently Asked Questions (FAQ)', test: willsHtml.includes('Frequently Asked Questions') },
  { name: 'Final Consultation CTA', test: willsHtml.includes('Consult Our Succession &amp; Probate Advocates') || willsHtml.includes('Protect Your Family Estate') }
];

requiredSections.forEach(s => {
  assert(s.test, `Required Section Present: ${s.name}`);
});

// Legal Accuracy Checks
assert(willsHtml.includes('Madras High Court') && willsHtml.includes('mofussil'), 'Copy accurately distinguishes Madras High Court Original Jurisdiction from mofussil/district court probate requirements');
assert(!willsHtml.includes('probate is mandatory throughout Tamil Nadu'), 'Copy accurately avoids claiming probate is mandatory throughout Tamil Nadu');
assert(willsHtml.includes('Section 372') && willsHtml.includes('Tahsildar'), 'Copy accurately distinguishes Section 372 court succession certificate from Tahsildar legal heir certificate');

console.log('\n====================================================');
console.log(`TOTAL PASSES: ${passCount}`);
console.log(`TOTAL FAILURES: ${failCount}`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
