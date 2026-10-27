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

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  console.log(`\n=== FILE: ${file} (JSON-LD blocks: ${matches.length}) ===`);
  matches.forEach((m, idx) => {
    try {
      const data = JSON.parse(m[1].trim());
      console.log(`Block ${idx + 1}: @type = ${data['@type'] || (data['@graph'] ? data['@graph'].map(x => x['@type']).join(', ') : 'no type')}`);
      if (data['@type'] === 'LegalService') {
        console.log(`  LegalService name: "${data.name}", url: "${data.url}", priceRange: "${data.priceRange}"`);
      }
      if (data['@graph']) {
        data['@graph'].forEach(node => {
          console.log(`  Graph item: @type: ${node['@type']}, @id: ${node['@id'] || 'none'}, headline/name: ${node.headline || node.name || 'none'}`);
          if (node['@type'] === 'Article') {
            console.log(`    Article author: ${JSON.stringify(node.author)}, publisher: ${JSON.stringify(node.publisher ? node.publisher.name : 'none')}, datePublished: ${node.datePublished}`);
          }
          if (node['@type'] === 'BreadcrumbList') {
            console.log(`    Breadcrumbs: ${node.itemListElement ? node.itemListElement.length : 0} items`);
          }
        });
      } else if (data['@type'] === 'Article') {
        console.log(`  Standalone Article: author: ${JSON.stringify(data.author)}, datePublished: ${data.datePublished}`);
      }
    } catch (e) {
      console.log(`Block ${idx + 1}: JSON PARSE ERROR: ${e.message}`);
    }
  });
}
