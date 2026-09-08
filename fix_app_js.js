const fs = require('fs');
let html = fs.readFileSync('app.js', 'utf8');

// The new regexes
// The circle
html = html.replace(/â—\x8F/g, '🟢');
html = html.replace(/â— /g, '🟢 '); 

// Star
html = html.replace(/â  /g, '⭐ ');
html = html.replace(/â­ /g, '⭐');
html = html.replace(/★/g, '⭐');

// The Combos emojis
html = html.replace(/ðŸ\x8D”/g, '🍔');
html = html.replace(/ðŸ\x8D•/g, '🍕');
html = html.replace(/ðŸ\x8D›/g, '🍛');

// Rupee
html = html.replace(/₹/g, '₹');

// Shields & general UI 
html = html.replace(/🛡ï¸ /g, '🛡️ ');
html = html.replace(/🛡ï/g, '🛡️');
html = html.replace(/✨/g, '✨ ');
html = html.replace(/ðŸ ½ï¸ /g, '🍽️ ');
html = html.replace(/ðŸ ½ï/g, '🍽️');
html = html.replace(/🕒/g, '⏱️ ');
html = html.replace(/â ±/g, '⏱');

// Other common missing emojis
html = html.replace(/ðŸ  /g, '🏠');
html = html.replace(/ðŸ ¢/g, '🏢');
html = html.replace(/🛵/g, '🛵');
html = html.replace(/🎉/g, '🎉');
html = html.replace(/🥘/g, '🍲');
html = html.replace(/🥗/g, '🥗');
html = html.replace(/ðŸ\x8D—/g, '🍗');
html = html.replace(/ðŸ ª/g, '🏪');
html = html.replace(/👑/g, '👑');
html = html.replace(/📦/g, '📦');

// Replace any white/black squares for veg/non-veg
html = html.replace(/□/g, '⊡'); 
html = html.replace(/—/g, '—');
html = html.replace(/⚡/g, '⚡');
html = html.replace(/➔/g, '➔');

fs.writeFileSync('app.js', html, 'utf8');
console.log("SUCCESSFULLY FIXED app.js emojis");
