const fs = require('fs');
const files = [
  'blog-deepfake-legal-remedies.html',
  'enforce-foreign-divorce-decree-property-india-part2.html',
  'enforce-foreign-divorce-decree-property-india-part3.html',
  'enforce-foreign-divorce-decree-property-india.html',
  'passport-travel-restrictions.html'
];
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf-8');
  const footerMatch = c.match(/<footer\s+class=["']footer["'][\s\S]*?<\/footer>/i);
  console.log('=== ' + f + ' ===');
  if (footerMatch) {
    const ql = footerMatch[0].match(/Quick Links[\s\S]*?<\/ul>/i);
    console.log(ql ? ql[0] : 'NO Quick Links found');
  } else {
    console.log('NO <footer class="footer"> found');
  }
});
