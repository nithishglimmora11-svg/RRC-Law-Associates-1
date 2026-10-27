const fs = require('fs');
const path = require('path');

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

const imageUsage = new Map();

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(/<img\s+([^>]*?)>/gi)];
  for (const m of matches) {
    const srcMatch = m[1].match(/src=["']([^"']*)["']/i);
    const altMatch = m[1].match(/alt=["']([^"']*)["']/i);
    const loadingMatch = m[1].match(/loading=["']([^"']*)["']/i);
    const widthMatch = m[1].match(/width=["']([^"']*)["']/i);
    const heightMatch = m[1].match(/height=["']([^"']*)["']/i);
    if (srcMatch) {
      const src = srcMatch[1];
      const alt = altMatch ? altMatch[1] : null;
      const loading = loadingMatch ? loadingMatch[1] : null;
      const width = widthMatch ? widthMatch[1] : null;
      const height = heightMatch ? heightMatch[1] : null;

      if (!imageUsage.has(src)) {
        imageUsage.set(src, []);
      }
      imageUsage.get(src).push({ file, alt, loading, width, height });
    }
  }
}

console.log(`Total unique image sources referenced: ${imageUsage.size}`);
for (const [src, refs] of imageUsage.entries()) {
  const localPath = src.startsWith('/') ? src.substring(1) : src;
  const exists = fs.existsSync(localPath);
  let size = 0;
  if (exists) {
    size = Math.round(fs.statSync(localPath).size / 1024);
  }
  const missingAlt = refs.filter(r => r.alt === null || r.alt.trim() === '');
  const missingDimensions = refs.filter(r => !r.width || !r.height);
  console.log(`- ${src}: exists? ${exists} (${size} KB), referenced in ${refs.length} places, missingAlt: ${missingAlt.length}, missingDimensions: ${missingDimensions.length}`);
}
