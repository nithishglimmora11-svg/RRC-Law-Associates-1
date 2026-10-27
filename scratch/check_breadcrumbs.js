const fs = require('fs');
['oci-card-eligibility-legal-status.html', 'oci-vs-nri-vs-indian-citizen.html', 'oci-card-indian-ancestry-assistance.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (m) {
    const d = JSON.parse(m[1]);
    const b = (d['@graph'] || []).find(x => x['@type'] === 'BreadcrumbList');
    console.log(f, 'BreadcrumbList:', JSON.stringify(b ? b.itemListElement : 'NONE'));
  }
});
