const fs = require('fs');
const html = fs.readFileSync('app.js', 'utf8');
const start = html.indexOf('class="food-item"');
if (start !== -1) {
    console.log(html.substring(start, start + 400));
} else {
    console.log("NOT FOUND");
}
