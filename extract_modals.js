const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Extract everything from first modal to end of body (before scripts)
const modalStart = html.indexOf('<!-- MODAL: Food Item Customization');
const scriptStart = html.indexOf('<script src="https://www.gstatic.com/firebasejs');
const scripts = html.substring(scriptStart);

console.log('Modal start line:', html.substring(0, modalStart).split('\n').length);
console.log('Scripts start line:', html.substring(0, scriptStart).split('\n').length);

// Extract all modals between mobile-nav end and scripts
const mobileNavEnd = html.indexOf('</div>', html.indexOf('Mobile Bottom Sticky Navigation')) + 6;
const modals = html.substring(mobileNavEnd, scriptStart).trim();

// Write modals to a temp file
fs.writeFileSync('_extracted_modals.html', modals, 'utf8');
console.log('Modals extracted to _extracted_modals.html');
console.log('Modals char length:', modals.length);
console.log('Scripts block:', scripts.substring(0, 800));
