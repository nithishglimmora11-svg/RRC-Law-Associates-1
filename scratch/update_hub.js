const fs = require('fs');

let content = fs.readFileSync('oci-legal-guides.html', 'utf8');

// 1. Title & Meta
content = content.replace(
  /<title>.*?<\/title>/s,
  '<title>OCI Legal Guides: Eligibility, Ancestry &amp; Law | RRC Law</title>'
);

content = content.replace(
  /<meta\s+name="description"\s+content="[^"]*"/i,
  '<meta name="description" content="Practical OCI legal guides by RRC Law Associates covering OCI card eligibility, ancestry records, property rights, renewals, and cancellation legal remedies."'
);

content = content.replace(
  /<meta\s+property="og:title"\s+content="[^"]*"/i,
  '<meta property="og:title" content="OCI Legal Guides: Eligibility, Ancestry &amp; Law | RRC Law"'
);

content = content.replace(
  /<meta\s+property="og:description"\s+content="[^"]*"/i,
  '<meta property="og:description" content="Practical OCI legal guides by RRC Law Associates covering OCI card eligibility, ancestry records, property rights, renewals, and cancellation legal remedies."'
);

content = content.replace(
  /<meta\s+name="twitter:title"\s+content="[^"]*"/i,
  '<meta name="twitter:title" content="OCI Legal Guides: Eligibility, Ancestry &amp; Law | RRC Law"'
);

content = content.replace(
  /<meta\s+name="twitter:description"\s+content="[^"]*"/i,
  '<meta name="twitter:description" content="Practical OCI legal guides by RRC Law Associates covering OCI card eligibility, ancestry records, property rights, renewals, and cancellation legal remedies."'
);

// 2. Schema item list URLs and duplicate title
content = content.replace(
  '"url": "https://rrclawassociates.com/oci-card-indian-ancestry-assistance.html"',
  '"url": "https://rrclawassociates.com/oci-card-indian-ancestry-assistance/"'
);
content = content.replace(
  '"name": "Guide 9: Can OCI Cardholders Own Agricultural Land in India?",\n          "description": "Examine the special restrictions that may apply to agricultural land, plantation property and farmhouses, and why a proposed acquisition must be assessed under the applicable property and foreign-exchange laws.",\n          "url": "https://rrclawassociates.com/oci-card-assistance.html"',
  '"name": "Advisory: Can OCI Cardholders Own Agricultural Land in India?",\n          "description": "Examine the special restrictions that may apply to agricultural land, plantation property and farmhouses, and why a proposed acquisition must be assessed under the applicable property and foreign-exchange laws.",\n          "url": "https://rrclawassociates.com/oci-card-assistance"'
);
content = content.replace(
  '"name": "Guide 13: OCI Re-Issuance After a New Passport: Rules for OCI Cardholders",\n          "description": "Review the documentary questions that may arise after obtaining a new passport or changing personal particulars, and learn why the applicable OCI update procedure should be verified before taking action.",\n          "url": "https://rrclawassociates.com/oci-card-assistance.html"',
  '"name": "Advisory: OCI Re-Issuance After a New Passport: Rules for OCI Cardholders",\n          "description": "Review the documentary questions that may arise after obtaining a new passport or changing personal particulars, and learn why the applicable OCI update procedure should be verified before taking action.",\n          "url": "https://rrclawassociates.com/oci-card-assistance"'
);

// 3. Duplicate Guide 13 heading in body
content = content.replace(
  'alt="Guide 13: OCI Re-Issuance After a New Passport: Rules for OCI Cardholders"',
  'alt="Advisory: OCI Re-Issuance After a New Passport: Rules for OCI Cardholders"'
);
content = content.replace(
  '<h4 class="guide-card-title">Guide 13: OCI Re-Issuance After a New Passport: Rules for OCI Cardholders</h4>',
  '<h4 class="guide-card-title">Practice Advisory: OCI Re-Issuance After a New Passport</h4>'
);

// 4. Update OCI internal hrefs to canonical clean URLs
const linkReplacements = [
  ['href="/oci-card-assistance.html"', 'href="/oci-card-assistance"'],
  ['href="/oci-card-eligibility-legal-status.html"', 'href="/oci-card-eligibility-legal-status/"'],
  ['href="/oci-vs-nri-vs-indian-citizen.html"', 'href="/oci-vs-nri-vs-indian-citizen/"'],
  ['href="/oci-card-application-documents.html"', 'href="/oci-card-application-documents/"'],
  ['href="/oci-card-indian-ancestry-assistance.html"', 'href="/oci-card-indian-ancestry-assistance/"'],
  ['href="/oci-foreign-spouse-eligibility.html"', 'href="/oci-foreign-spouse-eligibility/"'],
  ['href="/oci-for-children-born-abroad.html"', 'href="/oci-for-children-born-abroad/"'],
  ['href="/oci-card-benefits-restrictions-india.html"', 'href="/oci-card-benefits-restrictions-india/"'],
  ['href="/oci-cardholders-inherit-sell-ancestral-property-india.html"', 'href="/oci-cardholders-inherit-sell-ancestral-property-india/"'],
  ['href="/nri-oci-property-due-diligence-india.html"', 'href="/nri-oci-property-due-diligence-india/"'],
  ['href="/nri-oci-property-tax-india.html"', 'href="/nri-oci-property-tax-india/"'],
  ['href="/oci-card-renewal-passport-update.html"', 'href="/oci-card-renewal-passport-update/"'],
  ['href="/oci-card-cancellation-grounds-remedies.html"', 'href="/oci-card-cancellation-grounds-remedies/"'],
  ['href="/oci-card-cancellation-section-7d-legal-remedies.html"', 'href="/oci-card-cancellation-section-7d-legal-remedies/"'],
  ['<a href="/nri-services.html">NRI Legal Services</a>', '<a href="/nri-services">NRI Legal Services</a>']
];

for (const [target, repl] of linkReplacements) {
  content = content.split(target).join(repl);
}

// 5. Image dimensions additions
const imageDims = [
  { match: 'src="/assets/images/rrclogo.png"', width: 666, height: 182 },
  { match: 'src="/assets/images/logo.png"', width: 500, height: 500 },
  { match: 'src="/assets/images/oci-blog-eligibility.jpg"', width: 1200, height: 896 },
  { match: 'src="/assets/images/oci-blog-records.jpg"', width: 1200, height: 896 },
  { match: 'src="/assets/images/oci-blog-family.jpg"', width: 1200, height: 896 },
  { match: 'src="/assets/images/property.jpeg"', width: 736, height: 368 },
  { match: 'src="/assets/images/poa-attestation.png"', width: 1408, height: 768 },
  { match: 'src="/assets/images/justice.jpeg"', width: 626, height: 417 },
  { match: 'src="/assets/images/nri-law-1.jpg"', width: 626, height: 417 },
  { match: 'src="/assets/images/law-office-meeting.jpg"', width: 800, height: 1024 },
  { match: 'src="/assets/images/oci-foreign-spouse-eligibility.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/oci-for-children-born-abroad.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/oci-card-benefits-restrictions.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/oci-ancestral-property-india.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/revenue.png"', width: 1408, height: 768 },
  { match: 'src="/assets/images/nri-oci-property-due-diligence.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/nri-oci-property-tax-india.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/oci-card-renewal-passport-update.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/deed-drafting.png"', width: 1408, height: 768 },
  { match: 'src="/assets/images/oci-card-cancellation-grounds-remedies.jpg"', width: 1376, height: 768 },
  { match: 'src="/assets/images/oci-card-cancellation-section-7d-legal-remedies.jpg"', width: 1376, height: 768 }
];

for (const img of imageDims) {
  // Regex to find img tag containing this src without width/height
  const regex = new RegExp(`(<img\\s+[^>]*?${img.match.replace('/', '\\/')}[^>]*?)(/?>)`, 'g');
  content = content.replace(regex, (match, prefix, suffix) => {
    if (!prefix.includes('width=')) {
      prefix += ` width="${img.width}" height="${img.height}"`;
    }
    return prefix + suffix;
  });
}

fs.writeFileSync('oci-legal-guides.html', content, 'utf8');
console.log('Successfully updated oci-legal-guides.html');
