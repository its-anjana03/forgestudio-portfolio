#!/usr/bin/env node
/* The Foundry · image preparer
   Turns a folder of exported artwork into the two web sizes the gallery uses, with consistent names,
   and prints the lines to paste into foundry/data.js.

   One-time setup (inside this tools folder):   npm install
   Usage (from the repo root):
     node tools/foundry-images.js <source-folder> <room>/<id> <prefix>

   Examples:
     node tools/foundry-images.js "D:/Exports/Leo/Characters" movies/leo leo-character
     node tools/foundry-images.js "D:/Exports/Enchante/Posters" campaigns/enchante enchante-poster
     node tools/foundry-images.js "D:/Exports/Concepts" concepts concept

   Output, for every image in <source-folder> (sorted by file name):
     foundry/img/<room>/<id>/<prefix>-01.webp          full size, longest side 1600px
     foundry/img/<room>/<id>/thumb/<prefix>-01.webp    thumbnail, 400px wide
   Numbering continues after files that already exist, so batches can be added over time.
   Originals are never copied into the site. */

const fs = require('fs');
const path = require('path');

let sharp;
try { sharp = require('sharp'); } catch (e) {
  console.error('\n  sharp is not installed. Run this once:  cd tools && npm install\n');
  process.exit(1);
}

// Folder names under foundry/img: movies (Film), campaigns (Events), concepts and vault
// (Concepts: concept posters and the sketchbook), social/saagara (Social).
const ROOMS = ['movies', 'concepts', 'social', 'campaigns', 'vault'];
const [src, target, prefixArg] = process.argv.slice(2);
if (!src || !target) {
  console.log('\n  Usage: node tools/foundry-images.js <source-folder> <room>/<id> <prefix>\n  Rooms: ' + ROOMS.join(', ') + '\n');
  process.exit(1);
}
const [room, id = ''] = target.split('/');
if (!ROOMS.includes(room)) { console.error(`\n  Unknown room "${room}". Use one of: ${ROOMS.join(', ')}\n`); process.exit(1); }
if (id && !/^[a-z0-9-]+$/.test(id)) { console.error('\n  The id must be lowercase letters, numbers and dashes, e.g. leo or down-the-wicket\n'); process.exit(1); }
const prefix = (prefixArg || id || room).toLowerCase().replace(/[^a-z0-9-]+/g, '-');

const root = path.resolve(__dirname, '..', 'foundry', 'img', room, id);
const thumbDir = path.join(root, 'thumb');
fs.mkdirSync(thumbDir, { recursive: true });

const files = fs.readdirSync(src)
  .filter((f) => /\.(jpe?g|png|webp|tiff?|avif)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (!files.length) { console.error('\n  No images found in ' + src + ' (jpg, png, webp, tif, avif)\n'); process.exit(1); }

const taken = fs.readdirSync(root).map((f) => f.match(new RegExp(`^${prefix}-(\\d+)\\.webp$`))).filter(Boolean).map((m) => +m[1]);
let n = taken.length ? Math.max(...taken) + 1 : 1;

(async () => {
  const lines = [];
  let bytes = 0;
  for (const f of files) {
    const name = `${prefix}-${String(n++).padStart(2, '0')}`;
    const input = sharp(path.join(src, f), { limitInputPixels: false }).rotate();
    const full = await input.clone().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 }).toFile(path.join(root, `${name}.webp`));
    const thumb = await input.clone().resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 }).toFile(path.join(thumbDir, `${name}.webp`));
    bytes += full.size + thumb.size;
    // The average colour: shown while the image loads, so the wall never flashes empty.
    const { data: px } = await input.clone().resize(1, 1, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const tone = '#' + [...px].map((v) => v.toString(16).padStart(2, '0')).join('');
    console.log(`  ${f}  ->  ${name}.webp  (${full.width}x${full.height}, ${Math.round(full.size / 1024)} KB · thumb ${Math.round(thumb.size / 1024)} KB)`);
    lines.push(`{ file: '${name}', w: ${full.width}, h: ${full.height}, tone: '${tone}', alt: '' },`);
  }
  console.log(`\n  Done: ${files.length} image(s), ${(bytes / 1048576).toFixed(1)} MB added to foundry/img/${room}${id ? '/' + id : ''}`);
  console.log('  Paste these into foundry/data.js and fill in the alt text:\n');
  lines.forEach((l) => console.log('    ' + l));
  console.log('');
})().catch((e) => { console.error(e); process.exit(1); });
