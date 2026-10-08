/* FORGE Studio · catalogue builder (local tool, no packages needed)

   Run from the repo root after changing any work on the site:

     node tools/build-catalogue.js

   It does two jobs, both from data the site already has:

   1. THE HOME ARCHIVE. The ten posters behind the mark come from the POSTERS list at the top of
      assets/js/forge.js. Change a line there (title, year, image name), put the 1200px image in assets/img/
      and the 640px one in assets/img/thumb/, run this tool, and the poster wall in index.html is rewritten to
      match. The wall always shows ten.

   2. THE CATALOGUE. work.json is rewritten: every case study, every home poster and every piece in the Foundry,
      with titles, years, descriptions and image addresses. AI assistants and search tools read it, and anything
      built later (a chat assistant, a feed) can read it too. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://forgestudio.web.lk/';
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* Pixel size of a WebP, read from its header (so the wall can reserve the right space). */
function webpSize(file) {
  const b = fs.readFileSync(file);
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (kind === 'VP8L') { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
  throw new Error(`Not a WebP file: ${file}`);
}

/* ---------- 1. Home archive ---------- */
const js = read('assets/js/forge.js');
const m = js.match(/const POSTERS = (\[[\s\S]*?\n {2}\]);/);
if (!m) throw new Error('Could not find the POSTERS list in assets/js/forge.js');
const POSTERS = Function(`"use strict"; return ${m[1]};`)();
if (POSTERS.length !== 10) throw new Error(`The home archive shows exactly ten posters; POSTERS has ${POSTERS.length}.`);

// Where each poster hangs: five columns of four. A number is a poster's place in POSTERS; "h" marks the repeats
// that only fill the wall (hidden from keyboards and screen readers).
const WALL = [['0', '4', '6', '9h'], ['1', '5', '8', '0h'], ['2', '7', '3h', '1h'], ['3', '9', '2h', '6h'], ['7h', '8h', '4h', '5h']];
const sizes = POSTERS.map(([title, , file]) => {
  for (const f of [`assets/img/${file}.webp`, `assets/img/thumb/${file}.webp`]) {
    if (!fs.existsSync(path.join(ROOT, f))) throw new Error(`"${title}" needs ${f}`);
  }
  return webpSize(path.join(ROOT, `assets/img/thumb/${file}.webp`));
});
const wall = WALL.map((col) => {
  const items = col.map((slot) => {
    const i = parseInt(slot, 10), hidden = slot.endsWith('h');
    const [title, year, file] = POSTERS[i], [w, h] = sizes[i];
    return `      <button class="poster" type="button" data-lb="${i}"${hidden ? ' tabindex="-1" aria-hidden="true"' : ''}>`
      + `<img src="assets/img/thumb/${file}.webp" width="${w}" height="${h}" alt="${hidden ? '' : `${esc(title)} poster design`}"${hidden ? ' loading="lazy"' : ''}>`
      + `<span class="cap"><b>${esc(title)}</b><span>${year}</span></span></button>`;
  });
  return `    <div class="wall-col">\n${items.join('\n')}\n    </div>`;
}).join('\n');

let index = read('index.html');
const nl = index.includes('\r\n') ? '\r\n' : '\n';
const wallRe = /( {2}<div class="ignite-wall" id="archive"[^>]*>\r?\n)[\s\S]*?(\r?\n {2}<\/div>\r?\n {2}<div class="ignite-shade")/;
if (!wallRe.test(index)) throw new Error('Could not find the poster wall in index.html');
const nextIndex = index.replace(wallRe, (all, open, close) => open + wall.replace(/\n/g, nl) + close);
const wallChanged = nextIndex !== index;
if (wallChanged) fs.writeFileSync(path.join(ROOT, 'index.html'), nextIndex);

/* ---------- 2. Catalogue ---------- */
// Case studies: read from the structured details each page already carries.
const caseStudies = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => {
  const block = read(f).match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!block) return null;
  const graph = JSON.parse(block[1])['@graph'] || [];
  const work = graph.find((n) => n['@type'] === 'CreativeWork' || n['@type'] === 'VisualArtwork');
  return work ? { title: work.name, type: work.genre, summary: work.description, url: work.url, image: work.image } : null;
}).filter(Boolean);

// The Foundry: everything in foundry/data.js.
global.window = {};
require(path.join(ROOT, 'foundry/data.js'));
const D = global.window.FOUNDRY;
const piece = (dir) => (it) => ({
  title: it.title || undefined, type: it.type || it.medium || undefined, year: it.year || undefined,
  description: it.alt, note: it.note || undefined, width: it.w, height: it.h,
  image: `${SITE}foundry/img/${dir}/${it.file}.webp`, thumbnail: `${SITE}foundry/img/${dir}/thumb/${it.file}.webp`,
});
const foundry = {
  url: `${SITE}foundry/`,
  film: D.movies.map((f) => ({
    title: f.title, year: f.year, note: f.note || undefined, url: `${SITE}foundry/#/film/${f.id}`,
    pieces: f.groups.flatMap((g) => g.items.map((it) => ({ group: g.name, ...piece(`movies/${f.id}`)(it) }))),
  })),
  events: D.campaigns.map((c) => ({
    title: c.title, year: c.year, client: c.client, role: c.role, note: c.note || undefined, url: `${SITE}foundry/#/events/${c.id}`,
    pieces: c.items.map(piece(`campaigns/${c.id}`)),
  })),
  concepts: [
    { title: 'Concept posters', url: `${SITE}foundry/#/concepts/posters`, pieces: D.concepts.map(piece('concepts')) },
    { title: 'From the sketchbook', url: `${SITE}foundry/#/concepts/sketchbook`, pieces: D.vault.map(piece('vault')) },
  ],
  social: [{
    title: D.harbour.title, year: D.harbour.year, client: D.harbour.client, note: D.harbour.note || undefined, url: `${SITE}foundry/#/social/saagara`,
    pieces: D.harbour.groups.flatMap((g) => g.items.map((it) => ({ group: g.name, ...piece('social/saagara')(it) }))),
  }],
};
const count = (list) => list.reduce((n, c) => n + c.pieces.length, 0);
const total = POSTERS.length + count(foundry.film) + count(foundry.events) + count(foundry.concepts) + count(foundry.social);

const catalogue = {
  about: 'Machine-readable catalogue of FORGE Studio, the design practice of Thinura Anjana. Built from the site by tools/build-catalogue.js. A plain-language summary is at ' + SITE + 'llms.txt',
  studio: { name: 'FORGE Studio', designer: 'Thinura Anjana', url: SITE, email: 'anjanathinura07@gmail.com' },
  notes: [
    'Movie posters are personal tribute and concept work, not official studio artwork. Film titles and characters belong to their owners.',
    'Campaign and client work is shown with thanks to the organisers and clients named on each collection.',
  ],
  updated: new Date().toISOString().slice(0, 10),
  counts: { caseStudies: caseStudies.length, homeArchive: POSTERS.length, foundryPieces: total - POSTERS.length },
  caseStudies,
  homeArchive: POSTERS.map(([title, year, file]) => ({
    title, year, type: 'Tribute poster', image: `${SITE}assets/img/${file}.webp`, thumbnail: `${SITE}assets/img/thumb/${file}.webp`,
    url: `${SITE}#poster-${file.replace(/-poster$/, '')}`,
  })),
  foundry,
};
fs.writeFileSync(path.join(ROOT, 'work.json'), JSON.stringify(catalogue, null, 1) + '\n');

console.log(`Home archive: ${POSTERS.length} posters, wall ${wallChanged ? 'REWRITTEN in index.html' : 'already up to date'}.`);
console.log(`work.json: ${caseStudies.length} case studies, ${POSTERS.length} home posters, ${total - POSTERS.length} Foundry pieces.`);
