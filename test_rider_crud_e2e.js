const fs = require('fs');

console.log('=== VERIFYING RIDER CREDENTIALS MANAGEMENT END-TO-END ===\n');

// Mock localStorage and sessionStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  removeItem: (k) => { delete storage[k]; }
};
global.sessionStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  removeItem: (k) => { delete storage[k]; }
};

// Mock DOM
const domElements = {};
function mockElement(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id,
      value: '',
      checked: false,
      textContent: '',
      style: {},
      appendChild: () => {},
      classList: {
        classes: new Set(['hidden']),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      querySelector: () => null
    };
  }
  return domElements[id];
}

global.document = {
  getElementById: (id) => mockElement(id),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => ({ style: {}, classList: { add: () => {} }, appendChild: () => {}, remove: () => {} }),
  body: { style: {}, appendChild: () => {} }
};
global.window = global;
global.window.addEventListener = () => {};
global.window.scrollTo = () => {};
global.window.location = { origin: 'http://localhost', pathname: '/admin' };
global.prompt = (msg, text) => text;
global.confirm = () => true;
global.alert = (msg) => console.log('ALERT:', msg);
global.showToast = (msg, type) => console.log(`TOAST [${type}]: ${msg}`);

// Evaluate app.js
const appCode = fs.readFileSync('app.js', 'utf8');
eval(appCode);

console.log('\n--- 1. Testing openCreateRiderCredsModal() for NEW rider ---');
openCreateRiderCredsModal();
const modal = document.getElementById('createRiderCredsModal');
console.log('Modal hidden class removed?', !modal.classList.contains('hidden'));
console.log('Modal display style:', modal.style.display);
console.log('Generated PIN:', document.getElementById('rcredPin').value);

console.log('\n--- 2. Testing saveRiderCredentials() for NEW rider ---');
document.getElementById('rcredName').value = 'Ramesh Pawar';
document.getElementById('rcredPhone').value = '9876543219';
document.getElementById('rcredEmail').value = 'ramesh@parcelkar.com';
document.getElementById('rcredPin').value = '4321';
document.getElementById('rcredVehicle').value = '🛵 Motorcycle';
document.getElementById('rcredApproved').checked = true;

saveRiderCredentials({ preventDefault: () => {} });

const appDataObj = global.appData || JSON.parse(storage['parcelkar_v11_data_v2']);
const createdRider = appDataObj.riders.find(r => r.phone === '9876543219');
if (!createdRider) throw new Error('❌ Rider was not added to appData.riders');
console.log('✅ Rider created successfully:', createdRider.name, '| ID:', createdRider.id);

console.log('\n--- 3. Testing openCreateRiderCredsModal(riderId) for EDIT ---');
openCreateRiderCredsModal(createdRider.id);
console.log('Populated Name in form:', document.getElementById('rcredName').value);
console.log('Populated PIN in form:', document.getElementById('rcredPin').value);
if (document.getElementById('rcredName').value !== 'Ramesh Pawar') {
  throw new Error('❌ Form did not populate correctly for edit');
}
console.log('✅ Edit modal populated correctly!');

console.log('\n--- 4. Testing adminToggleRiderApproval ---');
adminToggleRiderApproval(createdRider.id, false);
let freshData = JSON.parse(storage['parcelkar_v11_data_v2']);
let targetRider = freshData.riders.find(r => r.id === createdRider.id);
console.log('Rider active status after suspend:', targetRider.active);
if (targetRider.active !== false) throw new Error('❌ Rider was not suspended');

adminToggleRiderApproval(createdRider.id, true);
freshData = JSON.parse(storage['parcelkar_v11_data_v2']);
targetRider = freshData.riders.find(r => r.id === createdRider.id);
console.log('Rider active status after activate:', targetRider.active);
if (targetRider.active !== true) throw new Error('❌ Rider was not reactivated');
console.log('✅ Status toggle works!');

console.log('\n--- 5. Testing copyRiderWhatsAppCreds ---');
copyRiderWhatsAppCreds(createdRider.id);
console.log('✅ copyRiderWhatsAppCreds executed cleanly!');

console.log('\n--- 6. Testing adminDeleteRiderCredentials ---');
adminDeleteRiderCredentials(createdRider.id);
freshData = JSON.parse(storage['parcelkar_v11_data_v2']);
const found = freshData.riders.find(r => r.id === createdRider.id);
if (found) throw new Error('❌ Rider was not deleted');
console.log('✅ Rider deleted successfully!');

console.log('\n=== ALL RIDER CREDENTIAL TESTS PASSED! ===\n');
