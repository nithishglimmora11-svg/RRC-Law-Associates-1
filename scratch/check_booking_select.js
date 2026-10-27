const fs = require('fs');

const content = fs.readFileSync('booking.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('<select')) {
    console.log(`Line ${idx+1}: ${l}`);
    console.log(lines.slice(idx, idx + 20).join('\n'));
    console.log('------------------------------');
  }
});
