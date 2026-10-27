const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const desktopVariations = {};
const mobileVariations = {};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Desktop block: from <a ...>NRI Services</a> to </ul>
  const dM = content.match(/<a[^>]*nav-link[^>]*dropdown-toggle[^>]*>[\s\S]*?NRI Services[\s\S]*?<\/a>[\s\S]*?<ul[^>]*dropdown-menu[^>]*>([\s\S]*?)<\/ul>/i);
  if (dM) {
    const raw = dM[1].trim();
    desktopVariations[raw] = desktopVariations[raw] || [];
    desktopVariations[raw].push(file);
  } else {
    desktopVariations['NO_MATCH'] = desktopVariations['NO_MATCH'] || [];
    desktopVariations['NO_MATCH'].push(file);
  }

  // Mobile block: from <div class="m-dropdown"> with NRI Services to </div> (inner submenu)
  const mM = content.match(/<div[^>]*class=["']m-dropdown["'][^>]*>[\s\S]*?NRI Services[\s\S]*?<div[^>]*class=["']m-submenu["'][^>]*>([\s\S]*?)<\/div>/i);
  if (mM) {
    const raw = mM[1].trim();
    mobileVariations[raw] = mobileVariations[raw] || [];
    mobileVariations[raw].push(file);
  } else {
    mobileVariations['NO_MATCH'] = mobileVariations['NO_MATCH'] || [];
    mobileVariations['NO_MATCH'].push(file);
  }
});

console.log('--- Desktop Dropdown Variations ---');
Object.entries(desktopVariations).forEach(([block, flist], idx) => {
  console.log(`\nVariation ${idx + 1} (${flist.length} files):`);
  console.log(`Files sample: ${flist.slice(0, 3).join(', ')}`);
  console.log('Content:\n' + block);
});

console.log('\n--- Mobile Submenu Variations ---');
Object.entries(mobileVariations).forEach(([block, flist], idx) => {
  console.log(`\nVariation ${idx + 1} (${flist.length} files):`);
  console.log(`Files sample: ${flist.slice(0, 3).join(', ')}`);
  console.log('Content:\n' + block);
});
