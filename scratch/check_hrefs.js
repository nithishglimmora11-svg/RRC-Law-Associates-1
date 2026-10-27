const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const desktopFormats = new Set();
const mobileFormats = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const desktopMatch = content.match(/<ul class=["']dropdown-menu[^"']*["']>[\s\S]*?<\/ul>/i);
  if (desktopMatch) {
    const ociMatch = desktopMatch[0].match(/href=["']([^"']*oci-card-assistance[^"']*)["']/i);
    if (ociMatch) desktopFormats.add(ociMatch[1]);
  }
  const mobileMatch = content.match(/<div class=["']m-submenu["'][^>]*>[\s\S]*?<\/div>/i);
  if (mobileMatch) {
    const ociMobile = mobileMatch[0].match(/href=["']([^"']*oci-card-assistance[^"']*)["']/i);
    if (ociMobile) mobileFormats.add(ociMobile[1]);
  }
});

console.log('Desktop dropdown OCI formats:', Array.from(desktopFormats));
console.log('Mobile submenu OCI formats:', Array.from(mobileFormats));
