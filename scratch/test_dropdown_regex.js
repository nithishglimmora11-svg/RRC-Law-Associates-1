const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'wills-probate-estate-administration.html');

let desktopMatched = [];
let desktopMissing = [];
let mobileMatched = [];
let mobileMissing = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Desktop check
  const desktopRegex = /(<li>\s*<a\s+class=["']dropdown-item[^"']*["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;
  if (desktopRegex.test(content)) {
    desktopMatched.push(f);
  } else {
    desktopMissing.push(f);
  }

  // Mobile check
  const mobileRegex = /(<a\s+class=["']m-sub-item["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>)/i;
  if (mobileRegex.test(content)) {
    mobileMatched.push(f);
  } else {
    mobileMissing.push(f);
  }
});

console.log(`Total files inspected: ${files.length}`);
console.log(`Desktop matched: ${desktopMatched.length}, missing: ${desktopMissing.length}`);
if (desktopMissing.length > 0) console.log('Desktop missing files:', desktopMissing);
console.log(`Mobile matched: ${mobileMatched.length}, missing: ${mobileMissing.length}`);
if (mobileMissing.length > 0) console.log('Mobile missing files:', mobileMissing);
