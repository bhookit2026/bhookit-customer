const fs = require('fs');

console.log('=== VERIFYING ADMIN UNLOCK FLOW & DOM INTERACTION ===\n');

// 1. Read admin.html and app.js
const adminHtml = fs.readFileSync('admin.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// Verify button in admin.html has type="button" and non-reloading onclick
if (!adminHtml.includes('type="button" onclick="submitAdminLogin(event)"')) {
  throw new Error('❌ admin.html unlock button is not configured as type="button" onclick="submitAdminLogin(event)"');
}
console.log('✅ Button in admin.html has type="button" onclick="submitAdminLogin(event)"');

// Verify cache buster in admin.html
const cacheBusterMatch = adminHtml.match(/src="app\.js\?v=(\d+)"/);
if (!cacheBusterMatch) {
  throw new Error('❌ admin.html is missing app.js?v= cache buster');
}
console.log(`✅ admin.html has app.js cache buster: ?v=${cacheBusterMatch[1]}`);

// 2. Simulate DOM and window environment
const dom = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        value: '',
        textContent: '',
        innerText: '',
        innerHTML: '',
        style: {},
        appendChild: () => {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        }
      };
    }
    return this.elements[id];
  },
  createElement(tag) {
    return {
      tagName: tag,
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      remove: () => {}
    };
  },
  addEventListener: () => {},
  querySelectorAll(sel) {
    return [];
  }
};

const storage = {};
const mockSessionStorage = {
  getItem(key) { return storage[key] || null; },
  setItem(key, val) { storage[key] = String(val); },
  removeItem(key) { delete storage[key]; }
};

const mockLocalStorage = {
  getItem(key) { return storage['local_' + key] || null; },
  setItem(key, val) { storage['local_' + key] = String(val); },
  removeItem(key) { delete storage['local_' + key]; }
};

// Create a sandbox execution environment for app.js
const vm = require('vm');
const context = {
  console,
  document: dom,
  window: {
    location: { href: '/admin', hostname: 'parcelkar.com', pathname: '/admin' },
    scrollTo: () => {},
    addEventListener: () => {},
    sessionStorage: mockSessionStorage,
    localStorage: mockLocalStorage
  },
  sessionStorage: mockSessionStorage,
  localStorage: mockLocalStorage,
  navigator: { serviceWorker: {} },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  alert: (msg) => console.log('[MOCK ALERT]', msg),
  confirm: () => true
};

vm.createContext(context);
vm.runInContext(appJs, context);

console.log('✅ app.js loaded and evaluated in mock DOM sandbox');

// Setup DOM elements as in admin.html
const emailInput = dom.getElementById('adminAuthLoginInput');
const passInput = dom.getElementById('adminAuthPassInput');
const gateEl = dom.getElementById('adminAuthGate');
const dashEl = dom.getElementById('adminDashboardContainer');
const errEl = dom.getElementById('adminAuthError');

emailInput.value = 'admin@parcelkar.com';
passInput.value = 'Therak@123456';

console.log(`\nAttempting login with: ${emailInput.value} / ${passInput.value}`);

// Execute submitAdminLogin
const fakeEvent = { preventDefault: () => {} };
const res = context.submitAdminLogin(fakeEvent);

// Verify session is stored
const storedSession = mockSessionStorage.getItem('parcelkar_admin_session');
console.log('Stored Session:', storedSession);
if (!storedSession) {
  throw new Error('❌ parcelkar_admin_session was not set in sessionStorage');
}
const sessionObj = JSON.parse(storedSession);
if (!sessionObj.isSuperAdmin || sessionObj.role !== 'admin') {
  throw new Error('❌ Session object is invalid: ' + JSON.stringify(sessionObj));
}
console.log('✅ Super Admin session successfully validated');

// Verify Gate is hidden and Dashboard is visible
if (gateEl.style.display !== 'none' || !gateEl.classList.contains('hidden')) {
  throw new Error('❌ adminAuthGate was not hidden! Display: ' + gateEl.style.display);
}
if (dashEl.style.display !== 'block' || dashEl.classList.contains('hidden')) {
  throw new Error('❌ adminDashboardContainer was not made visible! Display: ' + dashEl.style.display);
}
console.log('✅ adminAuthGate is hidden (display: none, class: hidden)');
console.log('✅ adminDashboardContainer is displayed (display: block)');

// Verify Manager accounts also work
console.log('\nTesting Manager Account login: pooja / mgr123');
emailInput.value = 'pooja';
passInput.value = 'mgr123';
context.submitAdminLogin(fakeEvent);

const mgrSession = JSON.parse(mockSessionStorage.getItem('parcelkar_admin_session'));
if (mgrSession.name !== 'Pooja Deshmukh' || mgrSession.isSuperAdmin !== false) {
  throw new Error('❌ Manager login failed for pooja');
}
console.log(`✅ Manager Pooja Deshmukh logged in with role: ${mgrSession.roleTitle}`);

console.log('\n🎉 ALL ADMIN LOGIN DOM TESTS PASSED!');
process.exit(0);
