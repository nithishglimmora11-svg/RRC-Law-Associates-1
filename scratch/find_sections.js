const fs = require('fs');

const content = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

// Find all section tags and their line numbers
lines.forEach((line, index) => {
    if (line.includes('<section') || line.includes('</section>') || line.includes('<header') || line.includes('<footer')) {
        console.log(`${index + 1}: ${line.trim().slice(0, 80)}`);
    }
});

