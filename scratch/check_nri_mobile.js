const fs = require('fs');

const content = fs.readFileSync('nri-services.html', 'utf8');
const lines = content.split('\n');

let inMenu = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('mobile-menu') || lines[i].includes('menuToggle')) {
        console.log(`Line ${i+1}: ${lines[i]}`);
    }
    if (lines[i].includes('script') && (lines[i].includes('script.js') || lines[i].includes('script2.js') || lines[i].includes('bootstrap'))) {
        console.log(`Line ${i+1}: ${lines[i]}`);
    }
}

