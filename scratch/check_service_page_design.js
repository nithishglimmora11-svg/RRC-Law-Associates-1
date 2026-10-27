const fs = require('fs');

const ociContent = fs.readFileSync('oci-card-assistance.html', 'utf8');
const ociLines = ociContent.split('\n');

console.log('--- Head of oci-card-assistance.html ---');
console.log(ociLines.slice(0, 50).join('\n'));

console.log('--- CSS linked in oci-card-assistance.html ---');
ociLines.forEach(l => {
  if (l.includes('<link rel="stylesheet"') || l.includes(':root')) {
    console.log(l.trim());
  }
});
