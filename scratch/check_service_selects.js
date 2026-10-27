const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const found = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('name="Service"') || content.includes('name="service"') || content.includes('Select Category')) {
    found.push(file);
  }
});

console.log('Files with Service Category select:', found);
