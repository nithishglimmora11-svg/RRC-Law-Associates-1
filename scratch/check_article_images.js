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
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let m;
  const imgs = [];
  while ((m = imgRegex.exec(content)) !== null) {
    imgs.push({ tag: m[0], src: m[1] });
  }
  console.log(file, imgs.map(i => i.src));
});
