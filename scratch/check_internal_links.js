const fs = require('fs');

const pages = [
  'oci-card-assistance.html',
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

const ociSlugs = [
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

let totalLegacyHtmlLinks = 0;
let totalNonTrailingSlashOciLinks = 0;

for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const links = [...html.matchAll(/href=["']([^"']*)["']/gi)].map(m => m[1]);
  
  const legacyHtml = links.filter(l => {
    return ociSlugs.some(slug => l === `/${slug}.html` || l === `./${slug}.html` || l === `${slug}.html`);
  });
  
  const nonTrailingSlash = links.filter(l => {
    return ociSlugs.some(slug => l === `/${slug}` || l === `https://rrclawassociates.com/${slug}`);
  });

  const brokenHash = links.filter(l => l.startsWith('#') && l !== '#' && l.length > 1).filter(h => {
    const id = h.substring(1);
    return !html.includes(`id="${id}"`) && !html.includes(`name="${id}"`);
  });

  console.log(`\n=== ${f} ===`);
  console.log(`  Legacy .html OCI links: ${legacyHtml.length}`);
  if (legacyHtml.length > 0) {
    console.log(`    Examples: ${legacyHtml.slice(0, 5).join(', ')}`);
    totalLegacyHtmlLinks += legacyHtml.length;
  }
  console.log(`  Non-trailing-slash OCI links: ${nonTrailingSlash.length}`);
  if (nonTrailingSlash.length > 0) {
    console.log(`    Examples: ${nonTrailingSlash.slice(0, 5).join(', ')}`);
    totalNonTrailingSlashOciLinks += nonTrailingSlash.length;
  }
  if (brokenHash.length > 0) {
    console.log(`  BROKEN in-page hash links: ${brokenHash.join(', ')}`);
  }
}

console.log(`\nTOTAL legacy .html links found: ${totalLegacyHtmlLinks}`);
console.log(`TOTAL non-trailing-slash OCI links found: ${totalNonTrailingSlashOciLinks}`);
