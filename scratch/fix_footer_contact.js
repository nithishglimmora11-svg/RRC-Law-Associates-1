const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

let fixedCount = 0;
const fixedFiles = [];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  
  // Find footer
  const footerRegex = /(<footer[\s\S]*?<\/footer>)/i;
  const match = content.match(footerRegex);
  
  if (match) {
    const originalFooter = match[1];
    // Replace href="#contact" inside footer with href="index.html#contact"
    if (originalFooter.includes('href="#contact"')) {
      const updatedFooter = originalFooter.replace(/href=["']#contact["']/g, 'href="index.html#contact"');
      content = content.replace(originalFooter, updatedFooter);
      fs.writeFileSync(f, content, 'utf-8');
      fixedCount++;
      fixedFiles.push(f);
    }
  }
});

console.log(`Updated footer contact links in ${fixedCount} files:`);
console.log(fixedFiles.join('\n'));
