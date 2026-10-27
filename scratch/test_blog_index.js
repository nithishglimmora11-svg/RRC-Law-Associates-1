const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('lawfirm-blog.html', 'utf-8');

// Find all .blog-card and .featured-post
const cardRegex = /<(div|article)[^>]*?class=["'][^"']*(blog-card|featured-post)[^"']*["'][\s\S]*?<\/\1>/gi;
let m;
const cards = [];

// Alternatively find all blog links inside blog grid
const aRegex = /<a\s+[^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
const blogLinks = [];
let am;
while ((am = aRegex.exec(content)) !== null) {
  const href = am[1].trim();
  const text = am[2].replace(/<[^>]+>/g, '').trim();
  if (href.endsWith('.html') && (href.startsWith('blog-') || href.startsWith('oci-') || href.startsWith('nri-') || href.startsWith('enforce-'))) {
    blogLinks.push({ href, text });
  }
}

console.log(`Found ${blogLinks.length} article links in lawfirm-blog.html:`);

const broken = [];
const uniqueArticles = new Set();

blogLinks.forEach(l => {
  uniqueArticles.add(l.href);
  const filePath = path.join('C:\\Users\\nithi\\RRC-Law-Associates-1', l.href.split('#')[0]);
  const exists = fs.existsSync(filePath);
  console.log(`  [${exists ? 'EXISTS' : '404 NOT FOUND'}] ${l.href} - "${l.text.slice(0, 40)}"`);
  if (!exists) {
    broken.push(l);
  }
});

console.log(`\nUnique article targets: ${uniqueArticles.size}`);
console.log(`Broken article links: ${broken.length}`);
