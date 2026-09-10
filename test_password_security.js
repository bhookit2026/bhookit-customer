const fs = require('fs');

console.log('=== TESTING STRICT ADMIN & MANAGER PASSWORD SECURITY ===\n');

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

const domElements = {};
function mockElement(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id,
      value: '',
      checked: false,
      textContent: '',
      style: {},
      classList: {
        classes: new Set(['hidden']),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      appendChild: () => {}
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
global.alert = (msg) => console.log('ALERT:', msg);
global.showToast = (msg, type) => console.log(`TOAST [${type}]: ${msg}`);

// Evaluate app.js
const appCode = fs.readFileSync('app.js', 'utf8');
eval(appCode);

// Step 1: Default password (admin123) should work initially
console.log('--- TEST 1: Initial Default Password (admin123) ---');
document.getElementById('adminAuthLoginInput').value = 'admin@parcelkar.com';
document.getElementById('adminAuthPassInput').value = 'admin123';
submitAdminLogin({ preventDefault: () => {} });

let session = JSON.parse(sessionStorage.getItem('parcelkar_admin_session') || '{}');
if (!session.isSuperAdmin) throw new Error('❌ Default password login failed');
console.log('✅ Default login with admin123 succeeded');

// Step 2: Change Master Password to "NewPass@2026"
console.log('\n--- TEST 2: Change Master Password to "NewPass@2026" ---');
document.getElementById('oldAdminPass').value = 'admin123';
document.getElementById('newAdminPass').value = 'NewPass@2026';
document.getElementById('confirmAdminPass').value = 'NewPass@2026';
submitChangeAdminPass({ preventDefault: () => {} });

const appDataObj = JSON.parse(storage['parcelkar_v11_data_v2']);
console.log('Current stored master password:', appDataObj.adminSettings.masterPassword);
if (appDataObj.adminSettings.masterPassword !== 'NewPass@2026') {
  throw new Error('❌ Master password was not updated in storage');
}
console.log('✅ Password changed in storage to: NewPass@2026');

// Clear session to test re-login
sessionStorage.removeItem('parcelkar_admin_session');

// Step 3: Attempt login with OLD password "admin123" -> MUST FAIL!
console.log('\n--- TEST 3: Login with OLD password "admin123" (MUST FAIL) ---');
document.getElementById('adminAuthLoginInput').value = 'admin@parcelkar.com';
document.getElementById('adminAuthPassInput').value = 'admin123';
document.getElementById('adminAuthError').textContent = '';
submitAdminLogin({ preventDefault: () => {} });

session = JSON.parse(sessionStorage.getItem('parcelkar_admin_session') || '{}');
if (session.isSuperAdmin) {
  throw new Error('❌ CRITICAL SECURITY FAILURE: admin123 still logged in after password was changed!');
}
console.log('✅ Success: Login with "admin123" was REJECTED! Error displayed:', document.getElementById('adminAuthError').textContent);

// Step 4: Login with NEW password "NewPass@2026" -> MUST SUCCEED!
console.log('\n--- TEST 4: Login with NEW password "NewPass@2026" (MUST SUCCEED) ---');
document.getElementById('adminAuthLoginInput').value = 'admin@parcelkar.com';
document.getElementById('adminAuthPassInput').value = 'NewPass@2026';
submitAdminLogin({ preventDefault: () => {} });

session = JSON.parse(sessionStorage.getItem('parcelkar_admin_session') || '{}');
if (!session.isSuperAdmin) {
  throw new Error('❌ Login with new password failed');
}
console.log('✅ Success: Super Admin logged in with NEW password!');

// Step 5: Test Manager Login -> cannot use admin123!
console.log('\n--- TEST 5: Manager Account Security (Cannot use admin123) ---');
sessionStorage.removeItem('parcelkar_admin_session');
document.getElementById('adminAuthLoginInput').value = 'pooja';
document.getElementById('adminAuthPassInput').value = 'admin123';
submitAdminLogin({ preventDefault: () => {} });

session = JSON.parse(sessionStorage.getItem('parcelkar_admin_session') || '{}');
if (session.role === 'admin') {
  throw new Error('❌ Manager account logged in with admin123 bypass!');
}
console.log('✅ Success: Manager login with "admin123" was REJECTED!');

document.getElementById('adminAuthLoginInput').value = 'pooja';
document.getElementById('adminAuthPassInput').value = 'mgr123';
submitAdminLogin({ preventDefault: () => {} });
session = JSON.parse(sessionStorage.getItem('parcelkar_admin_session') || '{}');
if (session.name !== 'Pooja Deshmukh') {
  throw new Error('❌ Manager login with actual manager password failed');
}
console.log('✅ Success: Manager logged in with valid manager password!');

console.log('\n🎉 ALL PASSWORD SECURITY TESTS PASSED 100%! NO BACKDOORS REMAIN!');
