const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const dropdownAudit = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check desktop dropdown for NRI Services
  const nriDesktopRegex = /<li[^>]*class=["'][^"']*dropdown[^"']*["'][^>]*>[\s\S]*?NRI Services[\s\S]*?<\/ul>/gi;
  const nriDesktopMatches = content.match(nriDesktopRegex) || [];

  // Also check mobile menu for NRI Services
  const nriMobileRegex = /<(?:div|li|a)[^>]*>[\s\S]*?NRI Services[\s\S]*?<\/(?:div|ul)>/gi;
  
  // Find all items in any NRI dropdown
  const dropdownItems = [];
  const itemRegex = /<a[^>]*class=["'](?:dropdown-item|m-sub-item)[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  
  // Look specifically within the NRI dropdown block
  const nriBlockRegex = /<li[^>]*dropdown[^>]*>[\s\S]*?NRI Services[\s\S]*?<ul[^>]*dropdown-menu[^>]*>([\s\S]*?)<\/ul>/i;
  const blockM = content.match(nriBlockRegex);
  
  if (blockM) {
    let im;
    while ((im = itemRegex.exec(blockM[1])) !== null) {
      dropdownItems.push({ href: im[1], text: im[2].replace(/<[^>]+>/g, '').trim() });
    }
  }

  // Also check mobile sub-items under NRI Services
  const mobileItems = [];
  const mobileBlockRegex = /(?:class=["']m-has-submenu["']|class=["']mobile-nav["']|class=["']mobile-menu["'])[\s\S]*?NRI Services[\s\S]*?<(?:div|ul)[^>]*class=["']m-submenu["'][^>]*>([\s\S]*?)<\/(?:div|ul)>/i;
  const mobM = content.match(mobileBlockRegex);
  if (mobM) {
    const mobItemRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let mim;
    while ((mim = mobItemRegex.exec(mobM[1])) !== null) {
      mobileItems.push({ href: mim[1], text: mim[2].replace(/<[^>]+>/g, '').trim() });
    }
  }

  if (blockM || mobM || content.includes('NRI Services')) {
    dropdownAudit.push({
      file,
      hasDesktopBlock: !!blockM,
      desktopItemsCount: dropdownItems.length,
      desktopItems: dropdownItems,
      hasMobileBlock: !!mobM,
      mobileItemsCount: mobileItems.length,
      mobileItems
    });
  }
});

fs.writeFileSync('scratch/nri_dropdown_audit.json', JSON.stringify(dropdownAudit, null, 2), 'utf8');

console.log(`Total HTML files with NRI Services: ${dropdownAudit.length} / ${htmlFiles.length}`);

// Group files by exact desktop items signature
const signatures = {};
dropdownAudit.forEach(d => {
  const sig = d.desktopItems.map(i => `${i.text} (${i.href})`).join(' | ');
  signatures[sig] = (signatures[sig] || 0) + 1;
});

console.log('\nDesktop Dropdown Signatures:');
Object.entries(signatures).forEach(([sig, count]) => {
  console.log(`[Count: ${count}] ${sig || 'NONE'}`);
});
