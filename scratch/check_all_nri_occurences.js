const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of "NRI Services" in index.html
let pos = 0;
while ((pos = content.indexOf('NRI Services', pos)) !== -1) {
  console.log(`\n=== Occurrence at position ${pos} ===`);
  const start = Math.max(0, pos - 150);
  const end = Math.min(content.length, pos + 800);
  console.log(content.substring(start, end));
  pos += 'NRI Services'.length;
}
