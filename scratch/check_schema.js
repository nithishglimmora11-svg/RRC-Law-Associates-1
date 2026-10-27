const fs = require('fs');
const content = fs.readFileSync('oci-legal-guides.html', 'utf8');
const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;
while ((m = scriptRegex.exec(content)) !== null) {
  count++;
  try {
    const json = JSON.parse(m[1]);
    console.log('Script', count, 'valid JSON. Graph types:', json['@graph'] ? json['@graph'].map(g => g['@type']) : json['@type']);
  } catch(e) {
    console.error('Script', count, 'INVALID JSON:', e.message);
  }
}
