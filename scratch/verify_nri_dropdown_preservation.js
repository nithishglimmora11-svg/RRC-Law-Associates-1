const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const approvedItems = [
  { text: 'OCI Card & Ancestry Assistance', href: 'oci-card-assistance.html' },
  { text: 'Property Dispute', href: 'nri-property-disputes.html' },
  { text: 'Power of Attorney', href: 'nri-power-of-attorney.html' },
  { text: 'Criminal Cases', href: 'nri-criminal-case.html' },
  { text: 'Family & Matrimonial', href: 'nri-family-matrimonial.html' }
];

let allMatch = true;
const mismatchedPages = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const nriMatch = content.match(/NRI Services[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!nriMatch) {
    allMatch = false;
    mismatchedPages.push({ file: f, reason: 'No NRI dropdown found' });
    return;
  }

  const items = [];
  const regex = /<a\s+[^>]*?href=["']([^"']*)["'][^>]*?>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = regex.exec(nriMatch[1])) !== null) {
    items.push({ text: m[2].replace(/<[^>]+>/g, '').trim(), href: m[1].trim() });
  }

  if (items.length !== 5) {
    allMatch = false;
    mismatchedPages.push({ file: f, reason: `Found ${items.length} items instead of 5`, items });
  }
});

console.log(`NRI Services Dropdown Preservation Check:`);
console.log(`Total pages checked: ${files.length}`);
console.log(`All matched approved 5-item menu: ${allMatch}`);
if (!allMatch) {
  console.log('Mismatches:', JSON.stringify(mismatchedPages, null, 2));
}
