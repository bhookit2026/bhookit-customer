const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const title = html.match(/<title>[^<]+<\/title>/)[0];
console.log('Page title:', title);
const remaining = (html.match(/FoodBank|foodbank/gi) || []);
console.log('Remaining FoodBank refs:', remaining.length, remaining.slice(0,5));
