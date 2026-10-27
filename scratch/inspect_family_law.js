const fs = require('fs');
const content = fs.readFileSync('family-law.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (/wills & estate|probate|succession|legal heir|settlement deed/i.test(l)) {
    console.log(`Line ${idx+1}: ${l.trim().substring(0, 110)}`);
  }
});
