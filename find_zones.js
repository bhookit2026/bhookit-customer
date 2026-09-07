const fs = require('fs');
let html = fs.readFileSync('app.js', 'utf8');

// Edit button has: U+e2 U+153(œ) U+8f U+ef U+b8 U+8f = corrupted ✏️
// U+270f = ✏, corrupted as latin1 read of 3-byte UTF-8 \xe2\x9c\x8f → â,œ,\x8f
const pencilCorrupt = String.fromCharCode(0xe2, 0x153, 0x8f, 0xef, 0xb8, 0x8f);
console.log('Pencil in html?', html.includes(pencilCorrupt));

// Delete button has: U+d83d U+2018(') U+ef U+b8 U+8f = corrupted 🗑️
// U+d83d is the high surrogate for emojis, U+2018 is left single quote used for U+dd51
// This is because the file was saved with some UTF-16 surrogate pair handling
const trashCorrupt = String.fromCharCode(0xd83d, 0x2018, 0xef, 0xb8, 0x8f);
console.log('Trash in html?', html.includes(trashCorrupt));

// U+d83d is surrogate - this is actually the correct 🗑️ emoji stored as UTF-16 surrogates!
// U+d83d + U+dd51 = 🗑 (wastebasket)
// But we see U+d83d + U+2018 + var-sel... let's check what U+2018 maps to as a byte
// Actually U+2018 (' left single quote) = \xe2\x80\x98 in UTF-8 (3 bytes)
// But what we see as U+2018 might be index 0xdd51 stored as latin1... unlikely

// Let's check what the actual character is at pos 10 in delete button
const deleteIdx = html.indexOf(' Delete</button>');
const deleteChar = html.substring(deleteIdx - 6, deleteIdx);
console.log('Delete prefix chars:');
Array.from(deleteChar).forEach(c => {
  console.log(`  U+${c.charCodeAt(0).toString(16).padStart(4,'0')} "${c}"`);
});
