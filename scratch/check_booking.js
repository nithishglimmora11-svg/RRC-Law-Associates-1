const fs = require('fs');

const content = fs.readFileSync('booking.html', 'utf8');
const selectMatches = content.match(/<select[\s\S]*?<\/select>/g);
if (selectMatches) {
    for (const s of selectMatches) {
        console.log(s);
    }
} else {
    console.log('No select found');
}

