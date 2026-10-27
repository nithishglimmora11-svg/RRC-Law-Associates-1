const fs = require('fs');

const pages = [
  'nri-oci-property-due-diligence-india.html',
  'nri-oci-property-tax-india.html',
  'oci-card-benefits-restrictions-india.html',
  'oci-card-cancellation-grounds-remedies.html',
  'oci-card-cancellation-section-7d-legal-remedies.html',
  'oci-card-eligibility-legal-status.html',
  'oci-card-renewal-passport-update.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'oci-for-children-born-abroad.html',
  'oci-foreign-spouse-eligibility.html',
  'oci-vs-nri-vs-indian-citizen.html'
];

for (const file of pages) {
  let content = fs.readFileSync(file, 'utf8');
  const isCRLF = content.includes('\r\n');
  const lines = content.split(/\r?\n/);

  // Find start and end of .rrc-topbar block in <style>
  let topbarStartIndex = -1;
  let topbarEndIndex = -1;
  let inStyle = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<style>')) inStyle = true;
    if (lines[i].includes('</style>')) inStyle = false;

    if (inStyle) {
      if (topbarStartIndex === -1 && (lines[i].includes('/* Topbar & Header Navigation') || lines[i].includes('.rrc-topbar {'))) {
        topbarStartIndex = i;
      }
      if (topbarStartIndex !== -1 && lines[i].includes('.rrc-topbar-divider')) {
        // Find closing brace of .rrc-topbar-divider
        for (let j = i; j < lines.length; j++) {
          if (lines[j].includes('}')) {
            topbarEndIndex = j;
            break;
          }
        }
        break;
      }
    }
  }

  if (topbarStartIndex !== -1 && topbarEndIndex !== -1) {
    console.log(`${file}: Removing topbar styles from line ${topbarStartIndex + 1} to ${topbarEndIndex + 1}`);
    lines.splice(topbarStartIndex, topbarEndIndex - topbarStartIndex + 1, '        /* Header Navigation Styles (Preserved) */');
  } else {
    console.warn(`${file}: Could not find topbar style block`);
  }

  // Update .nav-link-custom to include font-size and font-family if not already present
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.nav-link-custom {')) {
      let hasFontSize = false;
      let hasFontFamily = false;
      for (let j = i + 1; j < i + 10; j++) {
        if (lines[j].includes('}')) break;
        if (lines[j].includes('font-size')) hasFontSize = true;
        if (lines[j].includes('font-family')) hasFontFamily = true;
      }
      if (!hasFontSize && !hasFontFamily) {
        // Insert after margin
        for (let j = i + 1; j < i + 10; j++) {
          if (lines[j].includes('margin: 0 15px;')) {
            lines.splice(j + 1, 0,
              '            font-size: 16px;',
              "            font-family: 'Inter', sans-serif;"
            );
            console.log(`${file}: Added font-size & font-family to .nav-link-custom`);
            break;
          }
        }
      }
      break;
    }
  }

  const joiner = isCRLF ? '\r\n' : '\n';
  fs.writeFileSync(file, lines.join(joiner), 'utf8');
  console.log(`${file}: SUCCESS`);
}
