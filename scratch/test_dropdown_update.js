const fs = require('fs');

function updateDropdown(content) {
  // 1. Desktop dropdown: insert after OCI Card & Ancestry Assistance li
  // Regex to match the <li> containing oci-card-assistance in dropdown-menu
  const desktopRegex = /(<li>\s*<a\s+class=["']dropdown-item[^"']*["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;

  if (desktopRegex.test(content) && !content.includes('/wills-probate-estate-administration')) {
    content = content.replace(desktopRegex, '$1\n                            <li>\n                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>\n                            </li>');
  }

  // 2. Mobile submenu: insert after OCI Card & Ancestry Assistance a
  const mobileRegex = /(<a\s+class=["']m-sub-item["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>)/i;
  // Make sure not already inserted in mobile
  const ociCount = (content.match(/wills-probate-estate-administration/g) || []).length;
  if (mobileRegex.test(content) && ociCount < 2) {
    content = content.replace(mobileRegex, '$1\n                        <a class="m-sub-item" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>');
  }

  return content;
}

// Test on index.html
const indexBefore = fs.readFileSync('index.html', 'utf8');
const indexAfter = updateDropdown(indexBefore);
console.log('index.html before has wills:', indexBefore.includes('wills-probate-estate-administration'));
console.log('index.html after has wills:', indexAfter.includes('wills-probate-estate-administration'));

// Show the diff snippet
const idx1 = indexAfter.indexOf('wills-probate-estate-administration');
const idx2 = indexAfter.indexOf('wills-probate-estate-administration', idx1 + 1);

console.log('\n--- Desktop Snippet ---');
console.log(indexAfter.substring(idx1 - 100, idx1 + 250));

console.log('\n--- Mobile Snippet ---');
if (idx2 !== -1) {
  console.log(indexAfter.substring(idx2 - 100, idx2 + 250));
} else {
  console.log('Mobile snippet not found!');
}
