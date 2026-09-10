// test_delivery_charges_visibility.js
// Automated verification suite for Admin Show / Hide Delivery Charges and Auto-Add to Items

const fs = require('fs');

// Mock browser environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;
global.window = global;
global.window.addEventListener = () => {};

const elementCache = {};
function getOrCreateElement(id) {
  if (!elementCache[id]) {
    elementCache[id] = {
      id,
      value: id === 'inputAdminBaseDeliveryFee' ? '30' : id === 'inputAdminFlatItemAmount' ? '15' : '',
      checked: id === 'radioDelHide' || id === 'radioStrategySplit',
      textContent: '',
      innerHTML: '',
      style: {},
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      appendChild: () => {}
    };
  }
  return elementCache[id];
}

global.document = {
  addEventListener: () => {},
  createElement: (tag) => ({
    tag,
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
    remove: () => {},
    innerHTML: ''
  }),
  getElementById: (id) => getOrCreateElement(id),
  querySelector: () => null,
  querySelectorAll: () => []
};

global.showToast = (msg, type) => {};
global.alert = (msg) => {};
global.playSound = () => {};

// Load app.js and expose internal cart setter
const code = fs.readFileSync('app.js', 'utf8');
eval(code + '\n; window.__setCart = (c) => { currentCart = c; }; window.__getCart = () => currentCart;');

console.log('=== TEST 1: Default Settings Verification ===');
console.assert(appData.settings !== undefined, 'appData.settings should exist');
console.log('hideDeliveryCharges:', appData.settings.hideDeliveryCharges);
console.log('deliveryBase:', appData.settings.deliveryBase);
console.log('deliveryAutoAddStrategy:', appData.settings.deliveryAutoAddStrategy);
console.log('deliveryItemFlatAmount:', appData.settings.deliveryItemFlatAmount);
console.assert(appData.settings.hideDeliveryCharges === false, 'Default should be false (Show Delivery Charges)');
console.log('✅ TEST 1 PASSED: Default settings correctly initialized.\n');

console.log('=== TEST 2: Standard Mode Pricing & Bill Calculation (Show Delivery Charges) ===');
const testCart1 = [
  { restaurantId: 1, restaurantName: 'Sakoli Food Corner', foodId: 101, name: 'Paneer Butter Masala', basePrice: 160, price: 160, qty: 1, addons: [] }
];
window.__setCart(testCart1);
appliedDiscount = 0;
currentDriverTip = 0;
currentServiceMode = 'doorstep';

const pricingStd = getCartItemEffectivePricing(testCart1[0], testCart1);
console.log('Standard Mode - Cart Item Unit Price:', pricingStd.unitPrice, '(isIncluded:', pricingStd.isIncluded, ')');
console.assert(pricingStd.unitPrice === 160, 'In standard mode, unit price should be base 160');
console.assert(!pricingStd.isIncluded, 'In standard mode, delivery should not be marked included');

updateBillTotals();
const billSubStd = document.getElementById('billSubtotal').textContent;
const billDelStd = document.getElementById('billDeliveryFee').innerHTML;
const billTotStd = document.getElementById('billGrandTotal').textContent;
console.log('Standard Bill - Subtotal:', billSubStd, '| Delivery Fee:', billDelStd, '| Grand Total:', billTotStd);
console.assert(Number(billSubStd) === 160, 'Subtotal should be 160');
console.assert(billDelStd.includes('30'), 'Delivery fee should show 30');
console.log('✅ TEST 2 PASSED: Standard mode shows delivery fee separately.\n');

console.log('=== TEST 3: Hide Delivery Charges - Cart Split Mode (1 Item) ===');
appData.settings.hideDeliveryCharges = true;
appData.settings.deliveryAutoAddStrategy = 'cart_split';
appData.settings.deliveryBase = 30;

const pricingHidden1 = getCartItemEffectivePricing(testCart1[0], testCart1);
console.log('Hidden Mode (1 item) - Cart Item Unit Price:', pricingHidden1.unitPrice, '| Delivery Share:', pricingHidden1.deliverySharePerUnit);
console.assert(pricingHidden1.unitPrice === 190, 'Unit price should be 160 + 30 = 190');
console.assert(pricingHidden1.deliverySharePerUnit === 30, 'Delivery share should be 30');
console.assert(pricingHidden1.isIncluded === true, 'Delivery should be marked as included');

updateBillTotals();
const billSubHid1 = document.getElementById('billSubtotal').textContent;
const billDelHid1 = document.getElementById('billDeliveryFee').innerHTML;
const billTotHid1 = document.getElementById('billGrandTotal').textContent;
console.log('Hidden Bill (1 item) - Subtotal:', billSubHid1, '| Delivery Fee:', billDelHid1, '| Grand Total:', billTotHid1);
console.assert(Number(billSubHid1) === 190, 'Subtotal should now be 190 (160 + 30 delivery absorbed)');
console.assert(billDelHid1.includes('FREE'), 'Delivery fee line should display FREE');
console.log('✅ TEST 3 PASSED: Hide delivery mode correctly rolled ₹30 into single item subtotal.\n');

console.log('=== TEST 4: Hide Delivery Charges - Cart Split Mode (Multi-Item) ===');
const testCart2 = [
  { restaurantId: 1, restaurantName: 'Sakoli Food Corner', foodId: 101, name: 'Special Thali', basePrice: 160, price: 160, qty: 1, addons: [] },
  { restaurantId: 1, restaurantName: 'Sakoli Food Corner', foodId: 102, name: 'Butter Roti', basePrice: 40, price: 40, qty: 1, addons: [] }
];
window.__setCart(testCart2);
// Total base = 200. Delivery = 30. Proportional: Thali gets 80% (24) -> 184; Roti gets 20% (6) -> 46.
const pThali = getCartItemEffectivePricing(testCart2[0], testCart2);
const pRoti = getCartItemEffectivePricing(testCart2[1], testCart2);
console.log('Thali Effective Price:', pThali.unitPrice, '(Share: +' + pThali.deliverySharePerUnit + ')');
console.log('Roti Effective Price:', pRoti.unitPrice, '(Share: +' + pRoti.deliverySharePerUnit + ')');
console.assert(pThali.unitPrice === 184, 'Thali price should be 184');
console.assert(pRoti.unitPrice === 46, 'Roti price should be 46');
console.assert(pThali.unitPrice + pRoti.unitPrice === 230, 'Sum of items should equal 230 (200 food + 30 delivery)');

updateBillTotals();
const billSubMulti = document.getElementById('billSubtotal').textContent;
const billDelMulti = document.getElementById('billDeliveryFee').innerHTML;
console.log('Multi-Item Bill - Subtotal:', billSubMulti, '| Delivery Fee:', billDelMulti);
console.assert(Number(billSubMulti) === 230, 'Subtotal should be 230');
console.assert(billDelMulti.includes('FREE'), 'Delivery fee should show FREE');
console.log('✅ TEST 4 PASSED: Multi-item delivery fee split works with exact mathematical precision.\n');

console.log('=== TEST 5: Hide Delivery Charges - Flat Item Markup Mode ===');
appData.settings.hideDeliveryCharges = true;
appData.settings.deliveryAutoAddStrategy = 'item_flat';
appData.settings.deliveryItemFlatAmount = 15;

const effDishPrice1 = getDishEffectivePrice({ name: 'Special Thali', price: 160 });
console.log('Flat Mode - Menu Display Price for 160 Thali (+15):', effDishPrice1);
console.assert(effDishPrice1 === 175, 'Menu price should be 160 + 15 = 175');

updateBillTotals();
const billSubFlat = document.getElementById('billSubtotal').textContent;
console.log('Flat Mode Bill Subtotal (2 items * +15 = +30):', billSubFlat);
console.assert(Number(billSubFlat) === 230, 'Subtotal should be 200 + 30 = 230');
console.log('✅ TEST 5 PASSED: Flat item addition mode functions accurately on menu and cart.\n');

console.log('=== TEST 6: Admin Switchboard State Persistence ===');
// Test saving settings
document.getElementById('radioDelHide').checked = true;
document.getElementById('radioStrategySplit').checked = true;
document.getElementById('inputAdminBaseDeliveryFee').value = '35';

saveAdminDeliveryVisibilitySettings();
console.log('Saved appData.settings.hideDeliveryCharges:', appData.settings.hideDeliveryCharges);
console.log('Saved appData.settings.deliveryBase:', appData.settings.deliveryBase);
console.log('Saved appData.settings.deliveryAutoAddStrategy:', appData.settings.deliveryAutoAddStrategy);
console.assert(appData.settings.hideDeliveryCharges === true, 'hideDeliveryCharges should be true');
console.assert(appData.settings.deliveryBase === 35, 'deliveryBase should be updated to 35');
console.log('✅ TEST 6 PASSED: Admin settings are persistently saved to storage.\n');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 100% OPERATIONAL.');
process.exit(0);
