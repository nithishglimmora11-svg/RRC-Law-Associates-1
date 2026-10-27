const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const stats = {
  totalFiles: files.length,
  hasDesktopNRI: [],
  missingDesktopNRI: [],
  hasMobileNRI: [],
  missingMobileNRI: []
};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check desktop: contains NRI Services followed by dropdown-menu
  const hasDesktop = /NRI Services[\s\S]*?<ul[^>]*class=["'][^"']*dropdown-menu/i.test(content) ||
                     /<ul[^>]*class=["'][^"']*dropdown-menu[\s\S]*?nri-property-disputes/i.test(content);
  
  // Check mobile: contains m-submenu or mobile menu with NRI items
  const hasMobile = /m-submenu[\s\S]*?nri-property-disputes/i.test(content) ||
                    /m-sub-item[\s\S]*?nri-property-disputes/i.test(content);

  if (hasDesktop) stats.hasDesktopNRI.push(file);
  else stats.missingDesktopNRI.push(file);

  if (hasMobile) stats.hasMobileNRI.push(file);
  else stats.missingMobileNRI.push(file);
});

console.log(`Total files: ${stats.totalFiles}`);
console.log(`Has Desktop NRI dropdown: ${stats.hasDesktopNRI.length}`);
console.log(`Missing Desktop NRI dropdown: ${stats.missingDesktopNRI.length}`, stats.missingDesktopNRI);
console.log(`Has Mobile NRI dropdown: ${stats.hasMobileNRI.length}`);
console.log(`Missing Mobile NRI dropdown: ${stats.missingMobileNRI.length}`, stats.missingMobileNRI);
