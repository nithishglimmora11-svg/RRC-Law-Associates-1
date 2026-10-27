const fs = require('fs');
const html = fs.readFileSync('oci-legal-guides.html', 'utf8');
const regex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('Found script at index', m.index, 'length', m[0].length);
  console.log(m[0].substring(0, 300));
}
