const fs = require('fs');

const content = fs.readFileSync('nri-services.html', 'utf8');
const lines = content.split('\n');

console.log('Total lines in nri-services.html:', lines.length);

// Extract headings
const headings = [];
lines.forEach((l, idx) => {
  if (/<h[1-4]/i.test(l)) {
    headings.push({ line: idx + 1, text: l.replace(/<[^>]+>/g, '').trim() });
  }
});
console.log('Headings in nri-services.html:');
headings.forEach(h => console.log(`  L${h.line}: ${h.text}`));

// Extract stylesheets linked
const css = [];
lines.forEach((l, idx) => {
  if (/<link[^>]*rel=["']stylesheet["']/i.test(l)) {
    css.push(l.trim());
  }
});
console.log('\nStylesheets:');
css.forEach(c => console.log('  ' + c));
