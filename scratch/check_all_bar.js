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

for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/class=["'][^"']*breadcrumb[^"']*["'][\s\S]*?<\/(?:div|nav|ol)>/i);
  console.log(`\n=== ${f} ===\n${m ? m[0].replace(/\s+/g, ' ').trim() : 'NO BREADCRUMB FOUND'}`);
}
