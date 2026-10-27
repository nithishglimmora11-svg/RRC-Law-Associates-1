const fs = require('fs');
const html = fs.readFileSync('oci-card-eligibility-legal-status.html', 'utf8');
const m = html.match(/<div class="breadcrumbs-bar"[\s\S]*?<\/div>/);
console.log(m ? m[0] : 'NONE');
