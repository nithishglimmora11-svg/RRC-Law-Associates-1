const fs = require('fs');

const content = fs.readFileSync('booking.html', 'utf8');
const scripts = content.match(/<script[\s\S]*?<\/script>/g);
for (const s of scripts) {
    if (s.includes('Service') || s.includes('URLSearchParams') || s.includes('location.search')) {
        console.log('Script with URL params:');
        console.log(s);
    }
}

