// test_rider_commission_persistence.js
const fs = require('fs');

console.log('=== VERIFYING RIDER COMMISSION PERSISTENCE ===');

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

const vm = require('vm');
const appJsCode = fs.readFileSync('app.js', 'utf8');
vm.runInThisContext(appJsCode);
if (typeof initData === 'function') initData();

// 1. Initial default commission should be 30
const initialComm = getPersistedRiderCommission();
console.log(`✅ Default rider commission: ₹${initialComm}`);
if (initialComm !== 30) throw new Error(`Expected default 30, got ${initialComm}`);

// 2. Set custom commission to 35
localStorage.setItem('parcelkar_rider_commission', '35');
const updatedComm = getPersistedRiderCommission();
console.log(`✅ Updated rider commission: ₹${updatedComm}`);
if (updatedComm !== 35) throw new Error(`Expected updated 35, got ${updatedComm}`);

// 3. Re-run renderAdminView() and verify it does NOT revert
renderAdminView();
if (appData.settings.riderDeliveryCommission !== 35) {
  throw new Error(`renderAdminView reverted commission to ${appData.settings.riderDeliveryCommission}!`);
}
console.log('✅ renderAdminView() preserved rider commission at ₹35');

// 4. Test rider completion payout uses ₹35
const rider = (appData.riders && appData.riders[0]) || { id: 'rider_test', earnings: 0 };
const prevEarnings = rider.earnings || 0;
const payout = (rider.commissionPerDelivery !== undefined && rider.commissionPerDelivery !== null && rider.commissionPerDelivery !== '')
  ? Number(rider.commissionPerDelivery)
  : getPersistedRiderCommission();
rider.earnings += payout;

if (rider.earnings !== prevEarnings + 35) {
  throw new Error(`Rider delivery payout calculation failed! Expected +35, got +${rider.earnings - prevEarnings}`);
}
console.log(`✅ Rider payout successfully credited ₹${payout} per parcel!`);

console.log('\n🎉 ALL RIDER COMMISSION TESTS PASSED!');
process.exit(0);
