const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const scriptMatches = content.match(/<script[\s\S]*?<\/script>/g);
for (const s of scriptMatches) {
    if (s.includes('menuToggle') || s.includes('mobileMenu') || s.includes('m-trigger')) {
        console.log('--- Script match ---');
        console.log(s);
    }
}

