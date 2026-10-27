const fs = require('fs');

const d = JSON.parse(fs.readFileSync('scratch/static_audit_results.json', 'utf-8'));
const emptyOrHash = d.emptyOrHashLinks;

console.log(`Total empty or hash links: ${emptyOrHash.length}`);

// Group by text / purpose
const grouped = {};
emptyOrHash.forEach(l => {
  const key = `[${l.className || 'no-class'}] "${l.text}"`;
  if (!grouped[key]) grouped[key] = { count: 0, examples: [] };
  grouped[key].count++;
  if (grouped[key].examples.length < 3) grouped[key].examples.push(l.sourceFile);
});

console.log('\n--- Grouped Empty / Hash Links ---');
for (const [k, v] of Object.entries(grouped)) {
  console.log(`${k}: ${v.count} occurrences (e.g. in ${v.examples.join(', ')})`);
}
