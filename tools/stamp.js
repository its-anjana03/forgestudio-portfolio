// Gives the site's own stylesheets and scripts a new ?v= stamp, so browsers fetch fresh copies after a publish.
// The stamp lives in tools/shared/ (head and script tags), in 404.html and in foundry/index.html; this script
// changes all of them and then writes the shared parts back into the pages.
//
//   node tools/stamp.js 20261012a
//
// Use the date and a letter (a, b, c for more than one publish in a day).
const fs = require('fs');
const path = require('path');
const shared = require('./shared.js');

const stamp = process.argv[2];
if (!/^[\w.-]+$/.test(stamp || '')) { console.log('Give a stamp, for example: node tools/stamp.js 20261012a'); process.exit(1); }

const root = path.join(__dirname, '..');
const files = fs.readdirSync(path.join(__dirname, 'shared')).map(f => 'tools/shared/' + f).concat('404.html', 'foundry/index.html', 'README.md');
let n = 0;
for (const f of files) {
  const full = path.join(root, f);
  const before = fs.readFileSync(full, 'utf8');
  const after = before.replace(/\?v=[\w.-]+/g, () => { n++; return '?v=' + stamp; });
  if (after !== before) fs.writeFileSync(full, after);
}
shared.run(true);
console.log(`Stamp ${stamp} set in ${n} places.`);
