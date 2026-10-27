const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'wills-probate-estate-administration.html');

const failedDesktop = [];
const failedMobile = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  const desktopRegex = /(<li>\s*<a\s+class=["']dropdown-item[^"']*["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;
  const mobileRegex = /(<a\s+class=["']m-sub-item["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>)/i;

  if (!desktopRegex.test(content)) {
    failedDesktop.push(file);
  }
  if (!mobileRegex.test(content)) {
    failedMobile.push(file);
  }
});

console.log(`Tested ${files.length} files.`);
console.log(`Failed Desktop matches: ${failedDesktop.length}`, failedDesktop);
console.log(`Failed Mobile matches: ${failedMobile.length}`, failedMobile);
