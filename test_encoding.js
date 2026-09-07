const fs = require('fs');
const iconv = require('iconv-lite'); // if available, or we can do it manually
try {
    let str = fs.readFileSync('index.html', 'utf8');
    // For every character in str that was incorrectly mapped from Windows-1252, we can recover its byte.
    // However, some Windows-1252 characters are tricky. 
    // Let's just output the first few lines to see their char codes.
    const match = str.match(/dY\?,/);
    if (match) {
        console.log("Found: ", match[0]);
        for(let i=0; i<match[0].length; i++) {
            console.log(match[0].charCodeAt(i).toString(16));
        }
    }
} catch(e) {
    console.log(e);
}
