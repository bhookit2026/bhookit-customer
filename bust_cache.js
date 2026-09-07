const fs = require('fs');
let html = fs.readFileSync('app.js', 'utf8');
html = html.replace("STORAGE_KEY = 'foodbank_v11_data';", "STORAGE_KEY = 'foodbank_v11_data_v2';");
fs.writeFileSync('app.js', html, 'utf8');
console.log("LocalStorage key updated.");
