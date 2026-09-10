const fs = require('fs');
const html = fs.readFileSync('demo_all_in_one.html','utf8');
const sections = ['customer','orders','track','restaurant','delivery','admin','cart','partnerRegistration'];
sections.forEach(s => {
  const idx = html.indexOf('id="' + s + '"');
  const idx2 = html.indexOf("id='" + s + "'");
  const found = Math.max(idx, idx2);
  if(found !== -1) {
    const line = html.substring(0, found).split('\n').length;
    console.log('Section:', s, '@ line:', line);
    console.log(html.substring(found, found + 120));
    console.log('---');
  }
});
