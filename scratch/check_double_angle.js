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
  const head = content.substring(0, content.indexOf('</head>'));
  const lines = head.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('>>')) {
      console.log(`${file}:${idx+1}: ${l}`);
    }
  });
});
