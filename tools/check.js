// The check to run before anything is published. It changes nothing and needs no installs.
//
//   node tools/check.js
//
// It fails (exit code 1) when:
//   · a page's shared parts are out of step with tools/shared/        (fix: node tools/shared.js)
//   · a page points at a file, image or #section that does not exist
//   · the pages do not all carry the same ?v= stamp                   (fix: node tools/stamp.js <stamp>)
//   · a Foundry piece in foundry/data.js is missing one of its images
//   · the sitemap lists a page that is not there
const fs = require('fs');
const path = require('path');
const shared = require('./shared.js');

const root = path.join(__dirname, '..');
const problems = [];
const bad = (where, what) => problems.push(`${where}: ${what}`);
const read = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r/g, '');
const exists = f => fs.existsSync(path.join(root, f));

/* ---------- shared parts ---------- */
shared.run(false).forEach(f => bad(f, 'shared parts are out of step with tools/shared/ (run: node tools/shared.js)'));

/* ---------- links, images and sections ---------- */
const pages = [...shared.pages(), 'foundry/index.html'];
const html = Object.fromEntries(pages.map(p => [p, read(p)]));
const ids = Object.fromEntries(pages.map(p => [p, new Set([...html[p].matchAll(/\sid="([^"]+)"/g)].map(m => m[1]))]));
const OUTSIDE = /^(https?:|mailto:|tel:|data:|javascript:)/i;

function target(page, url) {
  const [file, hash] = url.split('#');
  const clean = file.split('?')[0];
  if (!clean) return { file: page, hash };
  let rel = clean.startsWith('/') ? clean.slice(1) : path.posix.join(path.posix.dirname(page), clean);
  if (rel === '' || rel === '.') rel = 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  return { file: rel, hash };
}

for (const page of pages) {
  const urls = new Set();
  for (const m of html[page].matchAll(/\s(?:href|src|poster|data-peek)="([^"]*)"/g)) urls.add(m[1]);
  for (const m of html[page].matchAll(/\ssrcset="([^"]*)"/g)) m[1].split(',').forEach(part => urls.add(part.trim().split(/\s+/)[0]));
  for (const url of urls) {
    if (!url || OUTSIDE.test(url)) continue;
    const t = target(page, url);
    if (!exists(t.file)) { bad(page, `points at "${url}", which does not exist`); continue; }
    // "#/..." is a Foundry route, read by its script; any other #name must be a section on the target page.
    if (t.hash && !t.hash.startsWith('/') && ids[t.file] && !ids[t.file].has(t.hash)) bad(page, `links to "${url}", but ${t.file} has no id="${t.hash}"`);
  }
}

/* ---------- one stamp on the root pages ---------- */
const stamps = {};
shared.pages().forEach(p => [...html[p].matchAll(/\?v=([\w.-]+)/g)].forEach(m => { (stamps[m[1]] = stamps[m[1]] || new Set()).add(p); }));
if (Object.keys(stamps).length > 1) bad('stamps', 'pages carry different ?v= stamps: ' + Object.entries(stamps).map(([s, set]) => `${s} (${[...set].join(', ')})`).join(' · '));

/* ---------- stylesheet images and fonts ---------- */
for (const css of fs.readdirSync(path.join(root, 'assets/css')).map(f => 'assets/css/' + f).concat('foundry/foundry.css')) {
  for (const m of read(css).matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    if (OUTSIDE.test(m[1]) || /^(#|%23)/.test(m[1])) continue;   // #name and %23name are SVG filters inside the file itself
    const t = path.posix.join(path.posix.dirname(css), m[1].split(/[?#]/)[0]);
    if (!exists(t)) bad(css, `uses "${m[1]}", which does not exist`);
  }
}

/* ---------- the Foundry: every piece has its viewer image and its wall image ---------- */
global.window = {};
require(path.join(root, 'foundry', 'data.js'));
const D = global.window.FOUNDRY;
const piece = (dir, it) => {
  ['', 'thumb/'].forEach(size => { const f = `foundry/img/${dir}/${size}${it.file}.webp`; if (!exists(f)) bad('foundry/data.js', `"${it.file}" is missing ${f}`); });
  if (it.motion && !exists(`foundry/img/motion/${it.file}.webp`)) bad('foundry/data.js', `"${it.file}" is marked motion but foundry/img/motion/${it.file}.webp is missing`);
};
let count = 0;
const each = (dir, list) => list.forEach(it => { count++; piece(dir, it); });
(D.movies || []).forEach(m => each('movies/' + m.id, m.groups.flatMap(g => g.items)));
(D.campaigns || []).forEach(c => each('campaigns/' + c.id, c.items));
each('concepts', D.concepts || []);
each('vault', D.vault || []);
if (D.harbour) each('social/saagara', D.harbour.groups.flatMap(g => g.items));

/* ---------- sitemap ---------- */
for (const m of read('sitemap.xml').matchAll(/<loc>https:\/\/forgestudio\.web\.lk\/([^<]*)<\/loc>/g)) {
  const f = m[1] === '' ? 'index.html' : m[1].endsWith('/') ? m[1] + 'index.html' : m[1];
  if (!exists(f)) bad('sitemap.xml', `lists ${m[1] || '/'}, which does not exist`);
}

/* ---------- result ---------- */
if (problems.length) {
  console.log(`Not ready to publish: ${problems.length} problem${problems.length > 1 ? 's' : ''}.\n`);
  problems.forEach(p => console.log('  ✗ ' + p));
  process.exit(1);
}
console.log(`Ready to publish. Checked ${pages.length} pages, ${count} Foundry pieces, stamp ${Object.keys(stamps)[0] || 'none'}.`);
