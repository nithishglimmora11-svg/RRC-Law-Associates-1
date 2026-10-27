const fs = require('fs');

const targetFiles = [
  'family-law.html',
  'core-practice-areas.html',
  'property-law.html',
  'litigation-dispute-resolution.html',
  'nri-services.html',
  'nri-property-disputes.html',
  'nri-power-of-attorney.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'blog-brother-claim-ancestral-property-long-possession.html',
  'blog-nri-property-remedies.html',
  'nri-oci-property-due-diligence-india.html',
  'nri-oci-property-tax-india.html',
  'index.html',
  'booking.html'
];

const checkTerms = [
  'Wills and Will Drafting',
  'Probate of Wills',
  'Estate Administration',
  'Estate Planning',
  'Succession Certificate',
  'Legal Heir Certificate',
  'Inheritance of Property',
  'Ancestral Property',
  'Intestate Succession',
  'Executor and Administrator Services',
  'Transfer of Property after Death',
  'Disputes between Legal Heirs',
  'NRI and OCI Inheritance Assistance'
];

const analysis = [];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');

  // Title
  const tm = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = tm ? tm[1].replace(/&amp;/g, '&').trim() : '';

  // Meta description
  const dm = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const desc = dm ? dm[1].replace(/&amp;/g, '&').trim() : '';

  // Canonical
  const cm = content.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  const canonical = cm ? cm[1].trim() : '';

  // H1
  const h1m = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1m ? h1m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().replace(/\s+/g, ' ') : '';

  // Check specific terms
  const termMatches = {};
  checkTerms.forEach(term => {
    // split words for flexible matching
    const words = term.split(/\s+/).filter(w => !['and', 'of', 'between', 'after'].includes(w.toLowerCase()));
    const pattern = words.join('[\\s\\S]{1,15}');
    const reg = new RegExp(`\\b${pattern}\\b`, 'gi');
    const matches = content.match(reg);
    termMatches[term] = matches ? matches.length : 0;
  });

  // Also check individual core words:
  const coreWords = {
    'will': (content.match(/\bwill\b/gi) || []).length,
    'wills': (content.match(/\bwills\b/gi) || []).length,
    'probate': (content.match(/\bprobate\b/gi) || []).length,
    'estate': (content.match(/\bestate\b/gi) || []).length,
    'succession': (content.match(/\bsuccession\b/gi) || []).length,
    'heir': (content.match(/\bheir\b/gi) || []).length,
    'ancestral': (content.match(/\bancestral\b/gi) || []).length,
    'patta': (content.match(/\bpatta\b/gi) || []).length,
    'partition': (content.match(/\bpartition\b/gi) || []).length,
    'codicil': (content.match(/\bcodicil\b/gi) || []).length,
    'executor': (content.match(/\bexecutor\b/gi) || []).length,
    'administrator': (content.match(/\badministrator\b/gi) || []).length,
    'letters of administration': (content.match(/letters\s+of\s+administration/gi) || []).length
  };

  analysis.push({
    file,
    title,
    desc,
    canonical,
    h1,
    termMatches,
    coreWords
  });
});

fs.writeFileSync('scratch/detailed_wills_terms_check.json', JSON.stringify(analysis, null, 2), 'utf8');

analysis.forEach(a => {
  console.log(`\n========================================================`);
  console.log(`PAGE: ${a.file}`);
  console.log(`Title: ${a.title}`);
  console.log(`H1: ${a.h1}`);
  console.log(`Canonical: ${a.canonical}`);
  console.log(`Core Words:`, Object.entries(a.coreWords).filter(([k, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(', '));
  console.log(`Check Terms matched:`);
  Object.entries(a.termMatches).filter(([k, v]) => v > 0).forEach(([k, v]) => {
    console.log(`   - ${k}: ${v}`);
  });
});
