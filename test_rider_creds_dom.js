const fs = require('fs');

console.log('=== TEST REPRODUCING RIDER CREDENTIALS MODAL ISSUE ===\n');

const adminHtml = fs.readFileSync('admin.html', 'utf8');

// Parse input IDs inside createRiderCredsModal
const modalStart = adminHtml.indexOf('id="createRiderCredsModal"');
const modalEnd = adminHtml.indexOf('</div>\n  </div>', modalStart);
const modalSnippet = adminHtml.substring(modalStart, modalEnd + 30);

console.log('createRiderCredsModal snippet found? ', modalStart > -1);

// Find all id="..." inside createRiderCredsModal
const idMatches = [...modalSnippet.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
console.log('IDs present in createRiderCredsModal:', idMatches);

// Check if rcredEmail exists in modal
console.log('Does rcredEmail exist in modal?', idMatches.includes('rcredEmail'));

// Simulate exact DOM element lookups from app.js openCreateRiderCredsModal
const domElements = {};
idMatches.forEach(id => {
  domElements[id] = { id, value: '', checked: false };
});

function testOpenCreateRiderCredsModal() {
  try {
    const modal = domElements['createRiderCredsModal'] || { classList: { remove: () => {} } };
    const getEl = (id) => domElements[id] || null;

    console.log('Attempting to set values like app.js:');
    getEl('rcredId').value = '';
    getEl('rcredName').value = '';
    getEl('rcredPhone').value = '';
    console.log('Setting rcredEmail.value...');
    getEl('rcredEmail').value = ''; // This will fail if getEl returns null!
    getEl('rcredPin').value = '1234';
    console.log('SUCCESS');
  } catch (err) {
    console.error('CRASHED WITH ERROR:', err.message);
  }
}

testOpenCreateRiderCredsModal();
