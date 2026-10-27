const fs = require('fs');

const content = fs.readFileSync('oci-card-eligibility-legal-status.html', 'utf-8');

console.log('Has menuToggle in HTML:', content.includes('id="menuToggle"'));
console.log('Has mobileMenu in HTML:', content.includes('id="mobileMenu"'));

// Search for menuToggle in scripts
const scripts = content.match(/<script[\s\S]*?<\/script>/gi) || [];
scripts.forEach((s, idx) => {
  if (s.includes('menuToggle') || s.includes('mobileMenu')) {
    console.log(`Script #${idx+1} mentions menuToggle/mobileMenu`);
  }
});

// Also check external scripts loaded
const extScripts = content.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
console.log('External scripts:', extScripts);
