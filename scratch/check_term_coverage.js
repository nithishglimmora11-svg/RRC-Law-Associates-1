const fs = require('fs');

const termsToAudit = [
  { name: 'Wills and Will Drafting', regex: /\b(?:will\s+drafting|drafting\s+a\s+will|drafting\s+wills|testamentary\s+planning|codicils?)\b/gi },
  { name: 'Probate of Wills', regex: /\b(?:probate(?:\s+of\s+wills?)?|letters\s+of\s+administration)\b/gi },
  { name: 'Estate Administration', regex: /\b(?:estate\s+administration|generational\s+estate\s+administration|administering\s+the\s+estate)\b/gi },
  { name: 'Estate Planning', regex: /\b(?:estate\s+planning|testamentary\s+structures|succession\s+planning)\b/gi },
  { name: 'Succession Certificate', regex: /\bsuccession\s+certificate\b/gi },
  { name: 'Legal Heir Certificate', regex: /\b(?:legal\s+heir\s+certificate|varisu\s+certificate)\b/gi },
  { name: 'Inheritance of Property', regex: /\b(?:inheritance\s+of\s+property|inheriting\s+property|inherited\s+property|property\s+inheritance)\b/gi },
  { name: 'Ancestral Property', regex: /\bancestral\s+property\b/gi },
  { name: 'Intestate Succession', regex: /\b(?:intestate\s+succession|dying\s+intestate|without\s+a\s+will)\b/gi },
  { name: 'Executor and Administrator Services', regex: /\b(?:executors?|administrators?)\s+(?:services?|duties|appointment|responsibilities)?\b/gi },
  { name: 'Transfer of Property after Death', regex: /\b(?:transfer\s+of\s+property\s+after\s+death|mutation\s+after\s+death|patta\s+transfer\s+after\s+death|transmission\s+of\s+property)\b/gi },
  { name: 'Disputes between Legal Heirs', regex: /\b(?:disputes?\s+between\s+legal\s+heirs|legal\s+heir\s+disputes?|partition\s+suits?|family\s+settlement\s+deeds?|relinquishment\s+deeds?)\b/gi },
  { name: 'NRI and OCI Inheritance Assistance', regex: /\b(?:nri\s+inheritance|oci\s+inheritance|fema\s+inheritance|inheriting\s+property\s+as\s+(?:an?\s+)?(?:nri|oci))\b/gi }
];

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const termCoverage = {};

termsToAudit.forEach(t => {
  termCoverage[t.name] = [];
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(t.regex);
    if (matches && matches.length > 0) {
      termCoverage[t.name].push({
        file,
        count: matches.length,
        samples: matches.slice(0, 3)
      });
    }
  });
  termCoverage[t.name].sort((a, b) => b.count - a.count);
});

console.log('=== TERM COVERAGE BREAKDOWN ===\n');
Object.entries(termCoverage).forEach(([term, pages]) => {
  console.log(`\n------------------------------------------------`);
  console.log(`TERM: ${term}`);
  console.log(`Pages mentioning term (${pages.length}):`);
  if (pages.length === 0) {
    console.log(`   *** NOT FOUND ANYWHERE ON SITE ***`);
  } else {
    pages.slice(0, 5).forEach(p => {
      console.log(`   - ${p.file} (${p.count} matches)`);
    });
  }
});

fs.writeFileSync('scratch/term_coverage_breakdown.json', JSON.stringify(termCoverage, null, 2), 'utf8');
