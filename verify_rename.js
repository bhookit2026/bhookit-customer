const fs = require('fs');

const portals = ['index.html', 'customer.html', 'vendor.html', 'rider.html', 'admin.html', 'partner.html'];

console.log('=== PARCELKAR PORTALS VERIFICATION ===\n');

portals.forEach(p => {
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  const title = (content.match(/<title>([^<]+)<\/title>/) || [])[1] || 'No title';
  const logo = content.includes('parcelkar-logo.png') ? '✅ Logo OK' : '❌ Logo missing';
  const oldRefs = (content.match(/bhookit|foodbank/gi) || []).length;
  console.log(`[${p}]`);
  console.log(`  Title: ${title}`);
  console.log(`  Logo:  ${logo}`);
  console.log(`  Legacy refs: ${oldRefs === 0 ? '✅ 0' : '⚠️ ' + oldRefs}\n`);
});
