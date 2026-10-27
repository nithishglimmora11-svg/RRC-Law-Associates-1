const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('scratch/browser_audit_results.json', 'utf-8'));

console.log(`Total pages analyzed: ${data.length}`);

// 1. Header Analysis
console.log('\n--- HEADER ANALYSIS ---');
const missingHeaderElements = [];
const headerHrefVariations = {
  logo: new Set(),
  home: new Set(),
  partners: new Set(),
  blog: new Set(),
  contact: new Set(),
  bookBtn: new Set()
};

data.forEach(p => {
  const h = p.header;
  if (!h.hasLogo || !h.hasHome || !h.hasNriDropdown || !h.hasCoreDropdown || !h.hasPartners || !h.hasBlog || !h.hasContact || !h.hasBookBtn) {
    missingHeaderElements.push({
      page: p.page,
      missing: [
        !h.hasLogo && 'Logo',
        !h.hasHome && 'Home',
        !h.hasNriDropdown && 'NRI Dropdown',
        !h.hasCoreDropdown && 'Core Dropdown',
        !h.hasPartners && 'Partners',
        !h.hasBlog && 'Blog',
        !h.hasContact && 'Contact',
        !h.hasBookBtn && 'Book Button'
      ].filter(Boolean)
    });
  }

  if (h.logoHref) headerHrefVariations.logo.add(`${h.logoHref}`);
  if (h.homeHref) headerHrefVariations.home.add(`${h.homeHref}`);
  if (h.partnersHref) headerHrefVariations.partners.add(`${h.partnersHref}`);
  if (h.blogHref) headerHrefVariations.blog.add(`${h.blogHref}`);
  if (h.contactHref) headerHrefVariations.contact.add(`${h.contactHref}`);
  if (h.bookHref) headerHrefVariations.bookBtn.add(`${h.bookHref}`);
});

console.log('Missing header elements in pages:');
console.log(JSON.stringify(missingHeaderElements, null, 2));

console.log('\nHeader href variations:');
for (const [k, v] of Object.entries(headerHrefVariations)) {
  console.log(`  ${k}: ${Array.from(v).join(', ')}`);
}

// 2. NRI Dropdown Integrity
console.log('\n--- NRI DROPDOWN INTEGRITY ---');
const nriDropdownSets = {};
data.forEach(p => {
  if (p.header.hasNriDropdown) {
    const key = p.header.nriItems.map(i => `${i.text} -> ${i.href}`).join(' | ');
    if (!nriDropdownSets[key]) nriDropdownSets[key] = [];
    nriDropdownSets[key].push(p.page);
  }
});
for (const [key, pages] of Object.entries(nriDropdownSets)) {
  console.log(`Pattern [${pages.length} pages]:`);
  console.log(`  Pages: ${pages.slice(0, 3).join(', ')}...`);
  console.log(`  Items:\n    ${key.split(' | ').join('\n    ')}\n`);
}

// 3. Mobile Menu Analysis
console.log('\n--- MOBILE MENU ANALYSIS ---');
const missingMobileMenu = data.filter(p => !p.mobileMenu.hasToggle || !p.mobileMenu.hasMenu);
console.log(`Pages missing mobile toggle or menu: ${missingMobileMenu.map(p => p.page).join(', ') || 'NONE'}`);

// 4. Horizontal Scroll
console.log('\n--- HORIZONTAL SCROLL ---');
const hScrollPages = data.filter(p => p.hasHScroll);
console.log(`Pages with horizontal scroll: ${hScrollPages.map(p => p.page).join(', ') || 'NONE'}`);

