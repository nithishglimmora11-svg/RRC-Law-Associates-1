const fs = require('fs');

const files = [
  'blog-deepfake-legal-remedies.html',
  'enforce-foreign-divorce-decree-property-india.html',
  'enforce-foreign-divorce-decree-property-india-part2.html',
  'enforce-foreign-divorce-decree-property-india-part3.html',
  'passport-travel-restrictions.html'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf-8');
  if (c.includes('href="#contact"')) {
    c = c.replace(/href=["']#contact["']/g, 'href="index.html#contact"');
    fs.writeFileSync(f, c, 'utf-8');
    console.log(`Updated ${f}`);
  } else {
    console.log(`No href="#contact" in ${f}`);
  }
});
