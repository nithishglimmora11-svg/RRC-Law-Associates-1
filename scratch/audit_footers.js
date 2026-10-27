const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\nithi\\RRC-Law-Associates-1';
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const footerResults = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf-8');
  
  // Find footer
  const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
  if (!footerMatch) {
    footerResults.push({ file: f, hasFooter: false });
    continue;
  }

  const footer = footerMatch[0];
  const links = [];
  const regex = /<a\s+[^>]*?href=["']([^"']*)["'][^>]*?>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = regex.exec(footer)) !== null) {
    const href = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    links.push({ text, href });
  }

  const contactLink = links.find(l => l.text.toLowerCase() === 'contact' || l.text.toLowerCase().includes('contact us'));
  const homeLink = links.find(l => l.text.toLowerCase() === 'home');
  const nriLink = links.find(l => l.text.toLowerCase().includes('nri'));
  const ociLink = links.find(l => l.text.toLowerCase().includes('oci'));
  const blogLink = links.find(l => l.text.toLowerCase().includes('blog'));

  footerResults.push({
    file: f,
    hasFooter: true,
    contactHref: contactLink ? contactLink.href : 'NOT FOUND',
    homeHref: homeLink ? homeLink.href : 'NOT FOUND',
    nriHref: nriLink ? nriLink.href : 'NOT FOUND',
    ociHref: ociLink ? ociLink.href : 'NOT FOUND',
    blogHref: blogLink ? blogLink.href : 'NOT FOUND',
    hashLinksCount: links.filter(l => l.href === '#' || l.href === '').length,
    allFooterLinks: links
  });
}

console.log('Footer Audit Results:');
console.log(`Files with footer contactHref == '#contact':`);
const hashContactFiles = footerResults.filter(r => r.contactHref === '#contact');
console.log(hashContactFiles.map(r => r.file).join('\n'));

console.log(`\nFiles with footer contactHref == 'index.html#contact':`);
const indexContactFiles = footerResults.filter(r => r.contactHref === 'index.html#contact');
console.log(indexContactFiles.map(r => r.file).join('\n'));

console.log(`\nOther contactHref values:`);
footerResults.filter(r => r.contactHref !== '#contact' && r.contactHref !== 'index.html#contact').forEach(r => {
  console.log(`${r.file}: ${r.contactHref}`);
});
