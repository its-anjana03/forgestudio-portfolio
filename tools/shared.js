// Shared parts of the pages (nav, menu, footer, head and script tags) live once, in tools/shared/.
// This script copies them into every page, between marker comments:
//
//   <!-- shared:nav work -->
//   ...written by this script, do not edit here...
//   <!-- /shared:nav -->
//
// The word after "shared:" is the file (tools/shared/nav.html). Any words after it are flags that
// switch the small differences between pages, written in the shared file as:
//
//   {{#home}}only on pages with the "home" flag{{/home}}
//   {{^home}}only on pages without it{{/home}}
//
// A flag tag alone on its line takes its line with it, so whole lines can be switched cleanly.
//
// Usage (from anywhere):
//   node tools/shared.js           write the shared parts into every page
//   node tools/shared.js --check   change nothing; report pages that are out of step (exit code 1)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dir = path.join(__dirname, 'shared');
const MARK = /<!-- shared:([\w-]+)((?: [\w-]+)*) -->\n[\s\S]*?<!-- \/shared:\1 -->/g;

const cache = {};
function part(name) {
  if (!(name in cache)) {
    const file = path.join(dir, name + '.html');
    if (!fs.existsSync(file)) throw new Error(`no shared file for "${name}" (expected tools/shared/${name}.html)`);
    cache[name] = fs.readFileSync(file, 'utf8').replace(/\r/g, '').replace(/\n+$/, '');
  }
  return cache[name];
}

function render(name, flags) {
  let out = part(name).replace(/^[ \t]*(\{\{[#^/][\w-]+\}\})[ \t]*\n/gm, '$1');
  const section = /\{\{([#^])([\w-]+)\}\}([\s\S]*?)\{\{\/\2\}\}/;
  for (let m; (m = section.exec(out));) {
    const on = flags.includes(m[2]) === (m[1] === '#');
    out = out.slice(0, m.index) + (on ? m[3] : '') + out.slice(m.index + m[0].length);
  }
  if (/\{\{/.test(out)) throw new Error(`tools/shared/${name}.html has a flag tag that is not closed`);
  return out.replace(/\n+$/, '');
}

function sync(html) {
  return html.replace(MARK, (all, name, flagText) => {
    const flags = flagText.trim().split(' ').filter(Boolean);
    return `<!-- shared:${name}${flagText} -->\n${render(name, flags)}\n<!-- /shared:${name} -->`;
  });
}

function pages() {
  return fs.readdirSync(root).filter(f => f.endsWith('.html') && !f.startsWith('test-')).sort();
}

// Returns the pages whose shared parts differ from tools/shared/. With write, brings them into step.
function run(write) {
  const stale = [];
  for (const file of pages()) {
    const full = path.join(root, file);
    const raw = fs.readFileSync(full, 'utf8');
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    const before = raw.replace(/\r/g, '');
    const after = sync(before);
    if (after === before) continue;
    stale.push(file);
    if (write) fs.writeFileSync(full, after.replace(/\n/g, eol));
  }
  return stale;
}

module.exports = { run, pages, MARK };

if (require.main === module) {
  const check = process.argv.includes('--check');
  const stale = run(!check);
  if (!stale.length) console.log('Shared parts: every page is in step.');
  else if (check) { console.log('Shared parts out of step in: ' + stale.join(', ') + '\nRun: node tools/shared.js'); process.exit(1); }
  else console.log('Shared parts written into: ' + stale.join(', '));
}
