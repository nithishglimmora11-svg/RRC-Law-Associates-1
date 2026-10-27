const fs = require('fs');

const filesToInspect = [
  'family-law.html',
  'core-practice-areas.html',
  'index.html',
  'nri-services.html',
  'property-law.html',
  'nri-property-disputes.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'blog-brother-claim-ancestral-property-long-possession.html'
];

filesToInspect.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n======================================================`);
  console.log(`FILE: ${f}`);
  console.log(`======================================================`);
  
  // Extract Headings
  const headings = content.match(/<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/gi) || [];
  console.log('--- Relevant Headings ---');
  headings.forEach(h => {
    const text = h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().replace(/\s+/g, ' ');
    if (/will|probate|estate|succession|heir|inherit|ancestral|partition/i.test(text)) {
      console.log(`  ${text}`);
    }
  });

  // Extract paragraphs/sections mentioning probate, wills, estate, succession certificate
  console.log('--- Key Snippets ---');
  const clean = content.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const paras = clean.match(/<(?:p|li|div)[^>]*>[\s\S]*?<\/(?:p|li|div)>/gi) || [];
  const found = new Set();
  paras.forEach(p => {
    const text = p.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().replace(/\s+/g, ' ');
    if (/(?:probate|will drafting|estate administration|succession certificate|legal heir certificate|letters of administration)/i.test(text)) {
      if (text.length > 20 && text.length < 300 && !found.has(text)) {
        found.add(text);
        console.log(`  * ${text}`);
      }
    }
  });
});
