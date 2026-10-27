const fs = require('fs');

const content = fs.readFileSync('oci-card-assistance.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
    if (l.includes('hero') || l.includes('section') && l.includes('class=')) {
        console.log(`${i+1}: ${l.trim().slice(0, 100)}`);
    }
});

