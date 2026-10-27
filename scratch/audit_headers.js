const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\nithi\\RRC-Law-Associates-1';

const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const headerSummary = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf-8');
  
  // Extract nav or header
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
  const navMatch = content.match(/<nav[\s\S]*?<\/nav>/i);
  
  const headerContent = (headerMatch ? headerMatch[0] : '') + (navMatch ? navMatch[0] : '');

  // Extract navigation links
  const links = [];
  const linkRegex = /<a\s+[^>]*?href=["']([^"']*)["'][^>]*?>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkRegex.exec(headerContent)) !== null) {
    const href = match[1].trim();
    const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    links.push({ text, href });
  }

  // Find specific key nav items
  const homeLink = links.find(l => l.text.toLowerCase() === 'home' || l.text.toLowerCase().includes('logo'));
  const partnersLink = links.find(l => l.text.toLowerCase().includes('partner'));
  const blogLink = links.find(l => l.text.toLowerCase().includes('blog'));
  const contactLink = links.find(l => l.text.toLowerCase() === 'contact' || l.text.toLowerCase().includes('contact us'));
  const bookBtn = links.find(l => l.text.toLowerCase().includes('consult') || l.text.toLowerCase().includes('book'));

  // Extract Core Practice Areas dropdown links
  const corePracticeMatch = headerContent.match(/Core Practice Areas[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/i) ||
                             headerContent.match(/Practice Areas[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/i);
  const coreLinks = [];
  if (corePracticeMatch) {
    let cm;
    const cRegex = /<a\s+[^>]*?href=["']([^"']*)["'][^>]*?>([\s\S]*?)<\/a>/gi;
    while ((cm = cRegex.exec(corePracticeMatch[1])) !== null) {
      coreLinks.push({ text: cm[2].replace(/<[^>]+>/g, '').trim(), href: cm[1].trim() });
    }
  }

  // Extract NRI Services dropdown links
  const nriMatch = headerContent.match(/NRI Services[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/i);
  const nriLinks = [];
  if (nriMatch) {
    let nm;
    const nRegex = /<a\s+[^>]*?href=["']([^"']*)["'][^>]*?>([\s\S]*?)<\/a>/gi;
    while ((nm = nRegex.exec(nriMatch[1])) !== null) {
      nriLinks.push({ text: nm[2].replace(/<[^>]+>/g, '').trim(), href: nm[1].trim() });
    }
  }

  headerSummary.push({
    file: f,
    hasHeader: !!headerMatch,
    hasNav: !!navMatch,
    contactHref: contactLink ? contactLink.href : 'NOT FOUND',
    blogHref: blogLink ? blogLink.href : 'NOT FOUND',
    bookHref: bookBtn ? bookBtn.href : 'NOT FOUND',
    nriDropdownCount: nriLinks.length,
    coreDropdownCount: coreLinks.length,
    coreLinks
  });
}

console.log('Audit of Header Navigation across all 45 pages:');
console.log(`Files with contactHref == '#contact': ${headerSummary.filter(h => h.contactHref === '#contact').map(h => h.file).join(', ')}`);
console.log(`\nCore Practice dropdown variations:`);
const coreTypes = {};
headerSummary.forEach(h => {
  const key = h.coreLinks.map(l => `${l.text}:${l.href}`).join(' | ');
  if (!coreTypes[key]) coreTypes[key] = [];
  coreTypes[key].push(h.file);
});

for (const [k, flist] of Object.entries(coreTypes)) {
  console.log(`\nPattern [${flist.length} files]:`);
  console.log(`Files: ${flist.slice(0, 5).join(', ')}${flist.length > 5 ? '... and ' + (flist.length - 5) + ' more' : ''}`);
  console.log(`Links:\n  ${k.split(' | ').join('\n  ')}`);
}
