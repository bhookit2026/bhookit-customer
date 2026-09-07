const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const onclicks = html.match(/onclick="[^"]*Partner[^"]*"/g) || [];
const onsubmits = html.match(/onsubmit="[^"]*Partner[^"]*"/g) || [];
const all = [...onclicks, ...onsubmits, ...html.match(/onclick="[^"]*Invite[^"]*"/g) || []];
console.log(Array.from(new Set(all)));
