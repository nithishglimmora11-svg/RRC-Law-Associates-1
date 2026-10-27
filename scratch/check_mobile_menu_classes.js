const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const classUsage = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf-8');
  const hasOpenCss = c.includes('.mobile-menu.open');
  const hasActiveCss = c.includes('.mobile-menu.active');
  
  const scriptAddsOpen = c.includes("classList.add('open')") || c.includes('classList.add("open")');
  const scriptAddsActive = c.includes("classList.add('active')") || c.includes('classList.add("active")');

  classUsage.push({
    file: f,
    css: (hasOpenCss ? 'open ' : '') + (hasActiveCss ? 'active ' : ''),
    script: (scriptAddsOpen ? 'open ' : '') + (scriptAddsActive ? 'active ' : '')
  });
});

console.log('Mobile menu class usage across all pages:');
const groups = {};
classUsage.forEach(u => {
  const key = `CSS: [${u.css.trim()}] | Script: [${u.script.trim()}]`;
  if (!groups[key]) groups[key] = [];
  groups[key].push(u.file);
});

for (const [k, flist] of Object.entries(groups)) {
  console.log(`\n${k} (${flist.length} files):`);
  console.log(`  ${flist.slice(0, 5).join(', ')}${flist.length > 5 ? '... and ' + (flist.length - 5) + ' more' : ''}`);
}
