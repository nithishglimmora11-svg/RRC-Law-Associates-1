const fs = require('fs');
const path = require('path');

const keywords = [
  'will',
  'wills',
  'will drafting',
  'probate',
  'estate administration',
  'estate planning',
  'succession certificate',
  'succession',
  'legal heir',
  'legal heir certificate',
  'inheritance',
  'inherit',
  'ancestral property',
  'intestate',
  'executor',
  'administrator',
  'transfer of property after death',
  'patta transfer',
  'disputes between legal heirs',
  'partition',
  'family settlement',
  'relinquishment deed',
  'nri inheritance',
  'oci inheritance'
];

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const fileAudits = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Extract metadata
  const titleM = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleM ? titleM[1].replace(/&amp;/g, '&').trim() : '';

  const descM = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const desc = descM ? descM[1].replace(/&amp;/g, '&').trim() : '';

  const canonM = content.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  const canonical = canonM ? canonM[1].trim() : '';

  const h1M = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1M ? h1M[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().replace(/\s+/g, ' ') : '';

  // Count keyword occurrences
  const keywordMatches = {};
  let totalMatches = 0;

  keywords.forEach(kw => {
    // regex word boundary or exact phrase
    const regex = new RegExp(`\\b${kw.replace(/ /g, '\\s+')}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      keywordMatches[kw] = matches.length;
      totalMatches += matches.length;
    }
  });

  // Find sample contextual snippets for top keywords
  const snippets = [];
  const searchKws = ['probate', 'will drafting', 'will', 'succession certificate', 'legal heir certificate', 'legal heir', 'ancestral property', 'inheritance', 'estate administration', 'estate planning', 'intestate', 'executor'];
  
  // Extract sentences or paragraphs
  const cleanBody = content.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const sentences = cleanBody.split(/[.?!]\s+/);
  sentences.forEach(s => {
    const sLower = s.toLowerCase();
    for (const sk of searchKws) {
      const reg = new RegExp(`\\b${sk}\\b`, 'i');
      if (reg.test(sLower)) {
        if (s.trim().length > 30 && s.trim().length < 350) {
          snippets.push({ kw: sk, text: s.trim() });
          break;
        }
      }
    }
  });

  // Extract internal links from this page
  const internalLinks = [];
  const linkRegex = /href=["']([^"']+)["']/gi;
  let lm;
  while ((lm = linkRegex.exec(content)) !== null) {
    const href = lm[1];
    if (href.startsWith('/') || href.includes('rrclawassociates.com')) {
      internalLinks.push(href);
    }
  }

  if (totalMatches > 0) {
    fileAudits.push({
      file,
      title,
      desc,
      canonical,
      h1,
      totalMatches,
      keywordMatches,
      sampleSnippets: snippets.slice(0, 10),
      internalLinksCount: internalLinks.length
    });
  }
});

// Sort by total matches descending
fileAudits.sort((a, b) => b.totalMatches - a.totalMatches);

fs.writeFileSync('scratch/wills_probate_audit_results.json', JSON.stringify(fileAudits, null, 2), 'utf8');

console.log(`Found ${fileAudits.length} files mentioning relevant keywords.\n`);
fileAudits.forEach(fa => {
  console.log(`[${fa.file}] Total: ${fa.totalMatches} matches`);
  console.log(`  Title: ${fa.title}`);
  console.log(`  Top KWs:`, Object.entries(fa.keywordMatches).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} (${v})`).join(', '));
  console.log('');
});
