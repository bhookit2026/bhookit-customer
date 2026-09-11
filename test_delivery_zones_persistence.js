// test_delivery_zones_persistence.js
const fs = require('fs');

console.log('=== VERIFYING DELIVERY ZONES PERSISTENCE & SYNC RESILIENCE ===');

const mockLocalStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

global.localStorage = mockLocalStorage;
global.window = {
  location: { origin: 'https://parcelkar.com', pathname: '/admin' },
  addEventListener() {}
};
global.document = {
  getElementById: (id) => ({
    value: '',
    textContent: '',
    innerHTML: '',
    style: {},
    appendChild() {},
    classList: { add() {}, remove() {} }
  }),
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => ({ className: '', style: {}, textContent: '', remove() {} }),
  body: { appendChild() {} },
  addEventListener() {}
};
global.navigator = {};
global.showToast = () => {};
global.playSound = () => {};
global.openModal = () => {};
global.closeModal = () => {};

// Load app.js code
const vm = require('vm');
const appJsCode = fs.readFileSync('app.js', 'utf8');
vm.runInThisContext(appJsCode);

// 1. Check initial zones
const initialZones = getPersistedDeliveryZones();
console.log(`✅ Initial zones count: ${initialZones.length}`);
if (initialZones.length < 7) {
  throw new Error('Initial zones count expected at least 7');
}

// 2. Add a new custom delivery zone (e.g. Ward 10 Sakoli)
const customZone = {
  id: 'zone_sakoli_custom_99',
  city: 'Sakoli',
  name: 'Ward 10 Ambedkar Nagar',
  eta: '15-20 mins',
  baseFee: 25,
  active: true
};

const updatedList = [...initialZones, customZone];
persistDeliveryZones(updatedList);

console.log('✅ Added custom delivery zone: Ward 10 Ambedkar Nagar');

// 3. Verify it is persisted in dedicated DELIVERY_ZONES_KEY
const savedRaw = mockLocalStorage.getItem('parcelkar_delivery_zones');
if (!savedRaw || !savedRaw.includes('Ward 10 Ambedkar Nagar')) {
  throw new Error('Custom delivery zone was not persisted in parcelkar_delivery_zones!');
}
console.log('✅ Verified custom zone is in localStorage[parcelkar_delivery_zones]');

// 4. Simulate appData reset / re-seed
appData.deliveryZones = [];
if (typeof renderAdminView === 'function') {
  renderAdminView();
}

if (!appData.deliveryZones.some(z => z.name === 'Ward 10 Ambedkar Nagar')) {
  throw new Error('renderAdminView() wiped custom delivery zones!');
}
console.log('✅ renderAdminView() successfully preserved and restored custom delivery zone');

// 5. Simulate triggerAdminDataSync()
triggerAdminDataSync();
if (!appData.deliveryZones.some(z => z.name === 'Ward 10 Ambedkar Nagar')) {
  throw new Error('triggerAdminDataSync() wiped custom delivery zones!');
}
console.log('✅ triggerAdminDataSync() successfully preserved custom delivery zone');

console.log('\n🎉 ALL DELIVERY ZONE PERSISTENCE TESTS PASSED!');
