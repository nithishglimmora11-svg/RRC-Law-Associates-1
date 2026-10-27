const fs = require('fs');

const articles = [
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

const results = [];

for (const file of articles) {
  const html = fs.readFileSync(file, 'utf8');

  // Text content & word count
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = bodyText.split(/\s+/).length;

  // Check TOC
  const hasToc = html.includes('table-of-contents') || html.includes('toc-') || html.includes('Table of Contents');

  // Check links to service page
  const serviceLinks = [...html.matchAll(/href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => ({ href: m[1], anchor: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }))
    .filter(l => l.href.includes('oci-card-assistance'));

  // Check links to hub
  const hubLinks = [...html.matchAll(/href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => ({ href: m[1], anchor: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }))
    .filter(l => l.href.includes('oci-legal-guides'));

  // Check FAQs
  const faqItems = [...html.matchAll(/class=["'][^"']*accordion-item[^"']*["']/gi)].length;

  // Author / Review info
  const hasAuthorMeta = html.includes('name="author"') || html.includes('itemprop="author"');
  const authorMatch = html.match(/class=["'][^"']*author[^"']*["'][\s\S]*?<\/[a-z]+>/i);

  results.push({
    file,
    wordCount,
    hasToc,
    serviceLinksCount: serviceLinks.length,
    serviceLinks: serviceLinks.map(l => `${l.href} ("${l.anchor}")`),
    hubLinksCount: hubLinks.length,
    hubLinks: hubLinks.map(l => `${l.href} ("${l.anchor}")`),
    faqItems,
    hasAuthorMeta
  });
}

console.log(JSON.stringify(results, null, 2));
