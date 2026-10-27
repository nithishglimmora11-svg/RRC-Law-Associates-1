const fs = require('fs');
const html = fs.readFileSync('oci-legal-guides.html', 'utf8');
const regex = /<article class="guide-card"[\s\S]*?<\/article>/g;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null) {
  count++;
  const card = match[0];
  const title = ((card.match(/<h4 class="guide-card-title">([\s\S]*?)<\/h4>/) || [])[1] || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const link = (card.match(/href="([^"]+)"/) || [])[1] || '';
  const category = ((card.match(/<span class="guide-category-pill">([\s\S]*?)<\/span>/) || [])[1] || '').replace(/&amp;/g, '&').trim();
  console.log(`${count}|${category}|${title}|${link}`);
}
