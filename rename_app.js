const fs = require('fs');

const files = ['index.html', 'app.js', 'style.css', 'sw.js', 'manifest.json', 'package.json', 'server.js', 'README.md'];

const replacements = [
  // Exact casing variants
  ['FoodBank V11', 'BhookIt V1'],
  ['FoodBank V12', 'BhookIt V1'],
  ['FoodBank V14', 'BhookIt V1'],
  ['FoodBank V1', 'BhookIt V1'],
  ['FoodBank', 'BhookIt'],
  ['FOODBANK', 'BHOOKIT'],
  ['foodbank', 'bhookit'],
  // Package/cache names
  ['food-delivery-app', 'bhookit-app'],
  ['foodbank-delivery-app', 'bhookit-app'],
  ['foodbank-v12.3-cache', 'bhookit-v1.0-cache'],
  ['foodbank-v12', 'bhookit-v1'],
  ['foodbank-v11', 'bhookit-v1'],
  ['bhookit-v11', 'bhookit-v1'], // prevent double replace
  // Storage key
  ['foodbank_v11_data_v2', 'bhookit_v1_data'],
  // System name in translations
  ['FoodBank V11 System', 'BhookIt System'],
  ['फूडबँक V11 सिस्टीम', 'भूकीट सिस्टीम'],
  ['फूडबैंक V11 सिस्टम', 'भूकीट सिस्टम'],
  // Food Delivery App folder name references
  ['Food Delivery App', 'BhookIt'],
];

let totalChanges = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let changes = 0;
    for (const [from, to] of replacements) {
      const count = content.split(from).length - 1;
      if (count > 0) {
        content = content.split(from).join(to);
        changes += count;
      }
    }
    if (changes > 0) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ ${file}: ${changes} replacements`);
      totalChanges += changes;
    }
  } catch (e) {
    console.log(`⚠️  ${file}: skipped (${e.message})`);
  }
});

console.log(`\n🎉 Total: ${totalChanges} replacements across all files!`);
console.log('App is now: BhookIt 🚀');
