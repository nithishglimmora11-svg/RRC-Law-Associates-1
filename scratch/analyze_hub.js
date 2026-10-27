const fs = require('fs');

const content = fs.readFileSync('oci-legal-guides.html', 'utf8');
const links = [];
const regex = /href=["']([^"']*\.html[^"']*)["']/g;
let m;
while ((m = regex.exec(content)) !== null) {
  links.push(m[1]);
}
console.log('Total .html href matches:', links.length);
const counts = {};
links.forEach(l => counts[l] = (counts[l] || 0) + 1);
console.log(JSON.stringify(counts, null, 2));

// Check images without width / height
const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
let imgMatches = [];
while ((m = imgRegex.exec(content)) !== null) {
  const tag = m[0];
  const hasWidth = /width=/i.test(tag);
  const hasHeight = /height=/i.test(tag);
  imgMatches.push({ src: m[1], hasWidth, hasHeight, tag });
}
console.log('\nImages in oci-legal-guides.html:', imgMatches.length);
imgMatches.forEach(img => {
  if (!img.hasWidth || !img.hasHeight) {
    console.log('Missing dimensions:', img.src);
  }
});
