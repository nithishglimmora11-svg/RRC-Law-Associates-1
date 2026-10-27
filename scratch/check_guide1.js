const fs = require('fs');
const content = fs.readFileSync('oci-card-eligibility-legal-status.html', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('<h1') || line.includes('application/ld+json') || line.includes('breadcrumb') || line.includes('class="related-')) {
    console.log(`Line ${idx+1}: ${line.trim().substring(0, 80)}`);
  }
});
