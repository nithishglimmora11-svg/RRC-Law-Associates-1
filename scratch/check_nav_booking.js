const fs = require('fs');

const indexContent = fs.readFileSync('index.html', 'utf8');

// Find navbar links
const navMatches = indexContent.match(/<nav[\s\S]*?<\/nav>/gi) || [];
console.log('--- Navbars in index.html ---');
navMatches.forEach(nav => {
  const links = nav.match(/<a[^>]*>[\s\S]*?<\/a>/gi) || [];
  links.forEach(l => {
    const text = l.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    const href = (l.match(/href=["']([^"']*)["']/) || [])[1];
    console.log(`  [Nav Link] ${text} -> ${href}`);
  });
});

// Check booking.html service selection dropdown or options
const bookingContent = fs.readFileSync('booking.html', 'utf8');
const selectMatches = bookingContent.match(/<select[\s\S]*?<\/select>/gi) || [];
console.log('\n--- Select elements in booking.html ---');
selectMatches.forEach(sel => {
  const options = sel.match(/<option[^>]*>[\s\S]*?<\/option>/gi) || [];
  options.forEach(opt => {
    console.log(`  [Option] ${opt.replace(/<[^>]+>/g, '').trim()}`);
  });
});
