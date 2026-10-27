const fs = require('fs');

const files = [
  'blog-evolution-of-digital-evidence-india.html',
  'enforce-foreign-divorce-decree-property-india.html',
  'enforce-foreign-divorce-decree-property-india-part2.html',
  'enforce-foreign-divorce-decree-property-india-part3.html'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf-8');
  console.log('=== ' + f + ' ===');
  const partnersMatches = c.match(/<a\s+[^>]*?href=["'][^"']*["'][^>]*?>\s*Partners\s*<\/a>/gi);
  console.log(partnersMatches);
});
