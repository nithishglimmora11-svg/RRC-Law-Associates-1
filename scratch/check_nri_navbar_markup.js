const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find NRI Services in index.html
const idx = content.indexOf('NRI Services');
if (idx !== -1) {
  console.log('--- Context around "NRI Services" in index.html ---');
  console.log(content.substring(idx - 200, idx + 800));
} else {
  console.log('Not found in index.html');
}
