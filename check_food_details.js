const fs = require('fs');
const html = fs.readFileSync('app.js', 'utf8');
const start = html.indexOf('class="food-details"');
if (start !== -1) {
    console.log(html.substring(start - 200, start + 800));
} else {
    console.log("NOT FOUND");
}
