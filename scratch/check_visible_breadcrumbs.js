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
  const navMatch = html.match(/<nav[^>]*aria-label=["']breadcrumb["'][^>]*>([\s\S]*?)<\/nav>/i) ||
                   html.match(/<ol class=["']breadcrumb["']>([\s\S]*?)<\/ol>/i);
  if (navMatch) {
    const items = [...navMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    console.log(f, 'Visible Breadcrumbs:', items.join(' > '));
  } else {
    console.log(f, 'Visible Breadcrumbs: NONE');
  }
}
