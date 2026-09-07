const fs = require('fs');
let html = fs.readFileSync('app.js', 'utf8');

// Exact corrupted sequences identified:
// ✏️ pencil edit: U+e2 U+153(œ) U+8f U+ef U+b8 U+8f
const pencilCorrupt = String.fromCharCode(0xe2, 0x153, 0x8f, 0xef, 0xb8, 0x8f);
// 🗑️ trash delete: U+d83d U+2018(') U+ef U+b8 U+8f (note: trash emoji itself U+d83d is OK as high surrogate)
// The U+2018 is corrupted U+dd51 (low surrogate for 🗑) - js stores as surrogate pair
// So the 5-char sequence: U+d83d + U+2018 + U+ef + U+b8 + U+8f = 🗑️ with variant selector
const trashCorrupt = String.fromCharCode(0xd83d, 0x2018, 0xef, 0xb8, 0x8f);
// ❤️ heart: U+e2 U+9d U+a4 U+ef U+b8 U+8f  
const heartCorrupt = String.fromCharCode(0xe2, 0x9d, 0xa4, 0xef, 0xb8, 0x8f);
// ⏰ alarm: U+e2 U+8f U+b0
const alarmCorrupt = String.fromCharCode(0xe2, 0x8f, 0xb0);

const fixes = [
  [pencilCorrupt, '✏️'],
  [trashCorrupt, '🗑️'],
  [heartCorrupt, '❤️'],
  [alarmCorrupt, '⏰'],
];

let total = 0;
for (const [bad, good] of fixes) {
  const count = html.split(bad).length - 1;
  if (count > 0) {
    html = html.split(bad).join(good);
    total += count;
    console.log(`Fixed ${count}x → ${good}`);
  }
}

fs.writeFileSync('app.js', html, 'utf8');

// Bump service worker to force cache clear
let sw = fs.readFileSync('sw.js', 'utf8');
sw = sw.replace('foodbank-v12.2-cache', 'foodbank-v12.3-cache');
fs.writeFileSync('sw.js', sw, 'utf8');

console.log(`Total: ${total} fixed. SW cache bumped to v12.3.`);
