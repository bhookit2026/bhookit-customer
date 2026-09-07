const fs = require('fs');
let html = fs.readFileSync('app.js', 'utf8');

// The new regexes
// The circle
html = html.replace(/â—\x8F/g, '🟢');
html = html.replace(/â— /g, '🟢 '); 

// Star
html = html.replace(/â  /g, '⭐ ');
html = html.replace(/â­ /g, '⭐');
html = html.replace(/â˜…/g, '⭐');

// The Combos emojis
html = html.replace(/ðŸ\x8D”/g, '🍔');
html = html.replace(/ðŸ\x8D•/g, '🍕');
html = html.replace(/ðŸ\x8D›/g, '🍛');

// Rupee
html = html.replace(/â‚¹/g, '₹');

// Shields & general UI 
html = html.replace(/ðŸ›¡ï¸ /g, '🛡️ ');
html = html.replace(/ðŸ›¡ï/g, '🛡️');
html = html.replace(/âœ¨/g, '✨ ');
html = html.replace(/ðŸ ½ï¸ /g, '🍽️ ');
html = html.replace(/ðŸ ½ï/g, '🍽️');
html = html.replace(/ðŸ•’/g, '⏱️ ');
html = html.replace(/â ±/g, '⏱');

// Other common missing emojis
html = html.replace(/ðŸ  /g, '🏠');
html = html.replace(/ðŸ ¢/g, '🏢');
html = html.replace(/ðŸ›µ/g, '🛵');
html = html.replace(/ðŸŽ‰/g, '🎉');
html = html.replace(/ðŸ¥˜/g, '🍲');
html = html.replace(/ðŸ¥—/g, '🥗');
html = html.replace(/ðŸ\x8D—/g, '🍗');
html = html.replace(/ðŸ ª/g, '🏪');
html = html.replace(/ðŸ‘‘/g, '👑');
html = html.replace(/ðŸ“¦/g, '📦');

// Replace any white/black squares for veg/non-veg
html = html.replace(/â–¡/g, '⊡'); 
html = html.replace(/â€”/g, '—');
html = html.replace(/âš¡/g, '⚡');
html = html.replace(/âž”/g, '➔');

fs.writeFileSync('app.js', html, 'utf8');
console.log("SUCCESSFULLY FIXED app.js emojis");
