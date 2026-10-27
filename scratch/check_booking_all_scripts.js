const fs = require('fs');

const content = fs.readFileSync('booking.html', 'utf8');
const scripts = content.match(/<script[\s\S]*?<\/script>/g);
for (const s of scripts) {
    console.log('--- Script in booking.html ---');
    console.log(s);
}

