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

articles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const m = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (m) {
    try {
      const parsed = JSON.parse(m[1]);
      const graph = parsed['@graph'] || [parsed];
      console.log(`\n=== ${file} ===`);
      graph.forEach(node => {
        console.log(`  Type: ${node['@type']}, Name/Headline: ${node.name || node.headline}`);
        if (node['@type'] === 'BreadcrumbList') {
          console.log(`    Breadcrumb items:`, node.itemListElement.map(i => `${i.position}: ${i.name} -> ${i.item}`));
        }
      });
    } catch(e) {
      console.log(file, 'Error parsing JSON-LD:', e.message);
    }
  } else {
    console.log(file, 'No JSON-LD found');
  }
});
