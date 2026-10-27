const fs = require('fs');

const content = fs.readFileSync('oci-legal-guides.html', 'utf-8');
const lines = content.split('\n');

console.log('--- Filter buttons in oci-legal-guides.html ---');
lines.forEach((l, i) => {
  if (l.includes('data-filter') || l.includes('filter-pill') || l.includes('filter-btn')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

console.log('\n--- Guide cards in oci-legal-guides.html ---');
const cardRegex = /<div[^>]*?class=["'][^"']*guide-card[^"']*["'][^>]*data-category=["']([^"']+)["'][\s\S]*?<a\s+[^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
let m;
let cardCount = 0;
while ((m = cardRegex.exec(content)) !== null) {
  cardCount++;
  console.log(`Card ${cardCount}: Category="${m[1]}", Link="${m[2]}", Text="${m[3].replace(/<[^>]+>/g, '').trim().slice(0, 40)}"`);
}

// Find all article links inside the guides grid
const gridMatch = content.match(/<div[^>]*class=["'][^"']*guides-grid[^"']*["'][\s\S]*?<\/section>/i);
if (gridMatch) {
  const aRegex = /<a\s+[^>]*?href=["']([^"']+)["'][^>]*class=["'][^"']*guide-card-cta[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  let am;
  let linkCount = 0;
  console.log('\n--- Guide Card CTA Links ---');
  while ((am = aRegex.exec(gridMatch[0])) !== null) {
    linkCount++;
    console.log(`CTA ${linkCount}: href="${am[1]}" | text="${am[2].replace(/<[^>]+>/g, '').trim()}"`);
  }
}
