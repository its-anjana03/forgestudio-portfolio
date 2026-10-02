/* =====================================================================
   THE FOUNDRY · v3
   Everything comes from data.js. Routes live in the address hash, so it runs on any static host:
     #/                                   the endless wall, everything
     #/film  #/events  #/concepts  #/social     the wall, one part of the collection
     #/<part>/<collection>[?p=<file>]     the premiere: one collection, one piece at a time
   Old links (#/cinema/leo, #/movies, #/campaigns, #/studio, #/harbour, #/vault) still land in the right place.
   ===================================================================== */
(() => {
  'use strict';
  const D = window.FOUNDRY;
  if (!D) return;
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const motion = root.classList.contains('has-motion');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) root.classList.add('fine');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = n => String(n).padStart(2, '0');
  const mod = (a, n) => ((a % n) + n) % n;
  const now = () => performance.now();

  /* Analytics (GoatCounter, cookie-free, same site code as the portfolio). Counts the visit, plus each collection
     opened, e.g. /foundry/film/leo. Off on localhost. */
  const GOATCOUNTER = 'forgestudio';
  const live = !!GOATCOUNTER && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const pending = [];
  const count = (path, title) => {
    if (!live) return;
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path, title });
    else pending.push([path, title]);
  };
  if (live) {
    const gc = document.createElement('script');
    gc.async = true; gc.dataset.goatcounter = `https://${GOATCOUNTER}.goatcounter.com/count`; gc.src = 'https://gc.zgo.at/count.js';
    gc.onload = () => { while (pending.length) count(...pending.shift()); };
    document.head.appendChild(gc);
  }

  /* ---------------------------------------------------------------
     The collection
     --------------------------------------------------------------- */
  const ROOMS = [
    { id: 'film', name: 'Film', title: 'Film posters' },
    { id: 'events', name: 'Events', title: 'Event campaigns' },
    { id: 'concepts', name: 'Concepts', title: 'Concepts and process' },
    { id: 'social', name: 'Social', title: 'Social media' },
  ];
  const TYPE = { logo: 'Logo', poster: 'Poster', banner: 'Banner', invitation: 'Invitation', social: 'Social post', ticket: 'Ticket', certificate: 'Certificate', sticker: 'Sticker' };
  const COLLS = [], ITEMS = [], BYKEY = {};

  function addColl(room, c, raw, dir) {
    if (!raw.length) return;
    c.room = room;
    c.items = raw.map((it, i) => {
      const item = {
        key: it.file, src: `img/${dir}/${it.file}.webp`, thumb: `img/${dir}/thumb/${it.file}.webp`,
        w: it.w || 1200, h: it.h || 1600, tone: it.tone || '#1b1917', alt: it.alt || '',
        label: it.label, title: it.title || it.label, year: it.year || c.year,
        note: it.note || '', link: it.link || null, motion: !!it.motion, coll: c, i,
      };
      ITEMS.push(item); BYKEY[item.key] = item;
      return item;
    });
    c.coverItem = c.items.find(x => x.key === c.cover) || c.items[0];
    const years = c.items.map(x => x.year).filter(Boolean);
    const lo = Math.min(...years), hi = Math.max(...years);
    c.years = years.length ? (lo === hi ? String(lo) : `${lo}–${hi}`) : '';
    COLLS.push(c);
  }
  const groupLabel = n => n.replace(/^(\w+) (poster|version)s$/i, '$1 $2');

  (D.movies || []).forEach(m => addColl('film',
    { id: m.id, title: m.title, year: m.year, note: m.note || '', more: !!m.more, cover: m.cover },
    m.groups.flatMap(g => g.items.map(it => ({ ...it, label: groupLabel(g.name) }))), 'movies/' + m.id));
  (D.campaigns || []).forEach(c => addColl('events',
    { id: c.id, title: c.title, year: c.year, note: c.note || '', client: c.client, cover: c.cover },
    c.items.map(it => ({ ...it, label: TYPE[it.type] || 'Design' })), 'campaigns/' + c.id));
  addColl('concepts', { id: 'posters', title: 'Concept posters', byItem: true, more: !!D.conceptsMore, note: '' },
    (D.concepts || []).map(it => ({ ...it, label: it.medium || 'Concept poster' })), 'concepts');
  addColl('concepts', { id: 'sketchbook', title: 'From the sketchbook', byItem: true, note: 'Sketches, drafts and builds from behind the finished work.' },
    (D.vault || []).map(it => ({ ...it, label: 'Process' })), 'vault');
  if (D.harbour) addColl('social',
    { id: 'saagara', title: D.harbour.title, year: D.harbour.year, note: D.harbour.note || '', client: D.harbour.client },
    D.harbour.groups.flatMap(g => g.items.map(it => ({ ...it, label: g.name }))), 'social/saagara');

  const roomOf = id => ROOMS.find(r => r.id === id);
  const roomCount = id => COLLS.filter(c => c.room === id).reduce((s, c) => s + c.items.length, 0);
  const hashFor = (c, i = 0) => `#/${c.room}/${c.id}` + (i ? `?p=${encodeURIComponent(c.items[i].key)}` : '');

  // Spread several lists evenly through one another, so the wall mixes rooms and collections.
  function spread(lists) {
    const out = [];
    lists.forEach((l, g) => l.forEach((x, k) => out.push([(k + .5) / l.length + g * .0007, x])));
    return out.sort((a, b) => a[0] - b[0]).map(p => p[1]);
  }
  const roomList = id => spread(COLLS.filter(c => c.room === id).map(c => c.items));
  const listFor = f => f ? roomList(f) : spread(ROOMS.map(r => roomList(r.id)).filter(l => l.length));

  // How a piece is named: films by film, everything else by the piece itself.
  function names(item) {
    const c = item.coll;
    if (c.room === 'film') return { main: c.title, sub: item.label };
    if (c.byItem) return { main: item.title, sub: item.label };
    return { main: item.title, sub: c.title };
  }

  /* ---------------------------------------------------------------
     The endless wall
     --------------------------------------------------------------- */
  const cv = $('.cv'), plane = $('.cv-plane'), dock = $('.dock'), hint = $('.hint');
  const C = {
    tiles: [], list: [], filter: null, px: 0, py: 0, vx: 0, vy: 0, s: 1,
    W: 1, cw: 200, gx: 40, vw: innerWidth, vh: innerHeight,
    drag: null, dragged: false, idleAt: 0, hover: null, frame: 0, swapT: 0,
  };
  const DRIFT = { x: -.34, y: -.18 };

  function dims() {
    const vw = innerWidth;
    if (vw < 600) return { cw: 124, gx: 20, gy: 44 };
    if (vw < 1100) return { cw: 172, gx: 36, gy: 62 };
    return { cw: 206, gx: 52, gy: 76 };
  }

  function hang(list, cw, gx, gy, K, minH) {
    const cols = Array.from({ length: K }, (_, c) => ({
      x: c * (cw + gx), h: 0, ph: (c % 2) * 150 + (c * 53) % 90, f: [.93, 1, 1.07][c % 3], tiles: [],
    }));
    let i = 0;
    const L = list.length;
    while (i < L || cols.some(c => c.h < minH)) {
      // Repeats (small parts of the collection) start each pass elsewhere and never hang next to themselves.
      const item = list[(i + Math.floor(i / L) * 5) % L];
      const near = c => c.tiles.slice(-2).some(t => t.item === item);
      const byHeight = cols.slice().sort((a, b) => a.h - b.h);
      const col = byHeight.find(c => !near(c)) || byHeight[0];
      const h = Math.round(cw * item.h / item.w);
      col.tiles.push({ item, y: col.h, h, dup: i >= list.length, n: i });
      col.h += h + gy;
      if (++i > 3000) break;
    }
    return cols;
  }
  // The strongest work (film posters, campaign key art, concept posters) is hung where the visitor first looks.
  const isLead = it => it.coll.room === 'film' || it.coll.id === 'posters' || it.key === it.coll.cover;
  function leadToCentre(list, cw, gx, gy, K, minH) {
    const cols = hang(list, cw, gx, gy, K, minH), span = cw + gx, mx = C.vw / 2, my = C.vh / 2;
    const spots = [];
    for (const col of cols) for (const p of col.tiles) {
      if (p.dup) continue;
      const x = mod(col.x, K * span) - span, y = mod(p.y + col.ph, col.h) - 420;
      spots.push([Math.hypot(x + cw / 2 - mx, (y + p.h / 2 - my) * 1.4), p.n]);
    }
    spots.sort((a, b) => a[0] - b[0]);
    const out = list.slice(), leads = out.filter(isLead), rest = out.filter(x => !isLead(x));
    const centre = new Set(spots.slice(0, leads.length).map(s => s[1]));
    let li = 0, ri = 0;
    return out.map((_, n) => (centre.has(n) ? leads[li++] : rest[ri++]) || leads[li++] || rest[ri++]);
  }

  function build(list, arrive) {
    clearTimeout(C.swapT);
    setHover(null);
    plane.textContent = '';
    C.tiles = [];
    if (!list.length) return;
    const { cw, gx, gy } = dims();
    const vw = C.vw = innerWidth, vh = C.vh = innerHeight;
    const K = Math.max(7, Math.ceil(vw / (cw + gx)) + 3);
    const minH = vh + 900;
    C.cw = cw; C.gx = gx; C.W = K * (cw + gx);
    if (C.px === 0 && C.py === 0) list = leadToCentre(list, cw, gx, gy, K, minH);
    C.list = list;
    const cols = hang(list, cw, gx, gy, K, minH);
    const frag = document.createDocumentFragment();
    for (const col of cols) for (const p of col.tiles) {
      const n = names(p.item);
      const a = document.createElement('a');
      a.className = 'tile' + (arrive ? '' : ' is-in');
      a.href = hashFor(p.item.coll, p.item.i);
      a.draggable = false;
      a.style.width = cw + 'px'; a.style.height = p.h + 'px';
      a.style.setProperty('--tone', p.item.tone);
      if (p.dup) { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); }
      a.innerHTML = `<span class="tile-img"><img alt="${esc(p.item.alt)}" draggable="false" decoding="async"></span>`
        + `<span class="tile-cap"><b>${esc(n.main)}</b><span>${esc(n.sub)}</span></span>`;
      frag.appendChild(a);
      C.tiles.push({ el: a, img: a.querySelector('img'), item: p.item, x: col.x, y: p.y, w: cw, h: p.h, H: col.h, f: col.f, ph: col.ph, vis: null, loaded: false, cx: 0, cy: 0 });
    }
    plane.appendChild(frag);
    place();
    if (arrive) {
      const mx = vw / 2, my = vh / 2;
      for (const t of C.tiles) if (t.vis) t.el.style.transitionDelay = Math.min(900, Math.hypot(t.cx + t.w / 2 - mx, t.cy + t.h / 2 - my) * .75) + 'ms';
      void plane.offsetWidth;
      for (const t of C.tiles) t.el.classList.add('is-in');
      C.swapT = setTimeout(() => C.tiles.forEach(t => { t.el.style.transitionDelay = ''; }), 2000);
    }
  }

  function load(t) {
    t.loaded = true;
    const img = t.img;
    img.onload = () => img.classList.add('is-loaded');
    img.src = t.item.thumb;
    if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
  }

  function place() {
    const vw = C.vw, vh = C.vh, W = C.W, span = C.cw + C.gx, m = 140;
    for (const t of C.tiles) {
      const x = mod(t.x + C.px, W) - span;
      const y = mod(t.y + t.ph + C.py * t.f, t.H) - 420;
      const vis = x < vw + m && x + t.w > -m && y < vh + m && y + t.h > -m;
      if (vis !== t.vis) {
        t.vis = vis;
        t.el.style.visibility = vis ? '' : 'hidden';
        if (vis && !t.loaded) load(t);
      }
      if (vis) {
        t.cx = x; t.cy = y;
        t.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      }
    }
  }

  function canvasStep() {
    const t = now();
    if (!C.drag) {
      const idle = motion && t - C.idleAt > 2400 && !plane.contains(document.activeElement);
      const k = .94;
      if (idle) { C.vx = DRIFT.x + (C.vx - DRIFT.x) * .985; C.vy = DRIFT.y + (C.vy - DRIFT.y) * .985; }
      else { C.vx *= k; C.vy *= k; }
      C.px += C.vx; C.py += C.vy;
    }
    const target = motion ? 1 - Math.min(.07, Math.hypot(C.vx, C.vy) * .0032) : 1;
    C.s += (target - C.s) * .08;
    plane.style.transform = `scale(${C.s.toFixed(4)})`;
    place();
    // Tiles drift under a still mouse: keep the hover honest.
    if (fine && !C.drag && ++C.frame % 8 === 0 && M.inside) {
      const el = document.elementFromPoint(M.x, M.y);
      setHover(el && el.closest ? el.closest('.tile') : null);
    }
  }

  function setHover(a) {
    if (a && !plane.contains(a)) a = null;
    if (C.hover === a) return;
    if (C.hover) C.hover.classList.remove('is-hover');
    C.hover = a;
    if (a) a.classList.add('is-hover');
    plane.classList.toggle('has-hover', !!a);
    cursorState();
  }

  function hideHint() { hint.classList.add('is-gone'); }

  function showFilter(f, arrive) {
    const key = f || 'all';
    if (C.filter === key && C.tiles.length) return;
    C.filter = key;
    dock.querySelectorAll('a').forEach(a => a.setAttribute('aria-current', a.dataset.f === key ? 'true' : 'false'));
    const list = listFor(f);
    if (!C.tiles.length || !motion) { C.px = C.py = 0; build(list, arrive && motion); return; }
    C.tiles.forEach(t => t.el.classList.add('is-out'));
    clearTimeout(C.swapT);
    C.swapT = setTimeout(() => { C.px = C.py = 0; C.vx = C.vy = 0; build(list, true); }, 340);
  }

  // Dragging
  cv.addEventListener('pointerdown', e => {
    if (e.button !== 0 || P.open) return;
    C.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: now(), moved: 0 };
    C.dragged = false;
    C.vx = C.vy = 0;
  });
  window.addEventListener('pointermove', e => {
    const d = C.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y, t = now(), dt = Math.max(1, t - d.t);
    d.x = e.clientX; d.y = e.clientY; d.t = t;
    d.moved += Math.abs(dx) + Math.abs(dy);
    if (!C.dragged && d.moved > 6) {
      C.dragged = true;
      cv.classList.add('is-dragging');
      try { cv.setPointerCapture(e.pointerId); } catch (_) {}
      setHover(null); hideHint();
    }
    if (!C.dragged) return;
    C.px += dx / C.s; C.py += dy / C.s;
    C.vx = C.vx * .4 + (dx / dt * 16.7) * .6;
    C.vy = C.vy * .4 + (dy / dt * 16.7) * .6;
    C.idleAt = t;
    cursorState();
  });
  function endDrag(e) {
    const d = C.drag;
    if (!d || e.pointerId !== d.id) return;
    C.drag = null;
    cv.classList.remove('is-dragging');
    if (now() - d.t > 90) C.vx = C.vy = 0; // held still before letting go
    C.idleAt = now();
    cursorState();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  cv.addEventListener('wheel', e => {
    if (P.open) return;
    e.preventDefault();
    let dx = e.deltaX, dy = e.deltaY;
    if (e.deltaMode === 1) { dx *= 32; dy *= 32; }
    if (e.shiftKey && !dx) { dx = dy; dy = 0; }
    C.px -= dx * .5; C.py -= dy * .5;
    C.vx = -dx * .05; C.vy = -dy * .05;
    C.idleAt = now();
    hideHint();
  }, { passive: false });

  // Opening a piece
  plane.addEventListener('click', e => {
    const a = e.target.closest('.tile');
    if (!a) return;
    e.preventDefault();
    if (C.dragged) return;
    nav.source = a;
    nav.push = true;
    location.hash = a.getAttribute('href');
  });
  plane.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse' || C.dragged && C.drag) return;
    setHover(e.target.closest('.tile'));
  });
  plane.addEventListener('pointerleave', () => setHover(null));
  // Keyboard: a focused tile glides to the middle of the screen.
  plane.addEventListener('focusin', e => {
    const t = C.tiles.find(x => x.el === e.target);
    cv.scrollLeft = cv.scrollTop = 0;
    if (!t) return;
    C.idleAt = now();
    C.vx = (C.vw / 2 - (t.cx + t.w / 2)) * .06;
    C.vy = (C.vh / 2 - (t.cy + t.h / 2)) * .06 / t.f;
  });
  cv.addEventListener('scroll', () => { cv.scrollLeft = cv.scrollTop = 0; });

  /* ---------------------------------------------------------------
     Premiere
     --------------------------------------------------------------- */
  const pm = $('.pm'), stage = $('.pm-stage'), titles = $('.pm-titles'), strip = $('.pm-strip');
  const info = $('.pm-info'), ambs = [...pm.querySelectorAll('.pm-amb')];
  const P = { open: false, coll: null, i: 0, item: null, piece: null, flip: 0, title: null, zoom: false, pushed: false, source: null, lastFocus: null, wheelAt: 0, acc: 0, lock: false, lockAt: 0, rx: 0, ry: 0 };
  const nav = { push: false, source: null };

  function rectFor(item, zoom) {
    const vw = innerWidth, vh = innerHeight, mob = vw < 760;
    let top, bottom, side;
    if (zoom) { top = bottom = side = mob ? 10 : 20; }
    else if (mob) { top = 70; side = 18; bottom = info.offsetHeight + 116; }
    else { top = Math.max(92, vh * .11); side = Math.max(32, vw * .06); bottom = 120; }
    const fit = () => {
      const s = Math.min((vw - side * 2) / item.w, (vh - top - bottom) / item.h);
      return { w: item.w * s, h: item.h * s };
    };
    let r = fit();
    if (!zoom && !mob) {
      // Wide work would run into the label: lift it clear.
      const clear = vw - 2 * (Math.min(vw * .3, 420) + 56);
      if (r.w > clear) { bottom = Math.max(120, info.offsetHeight + 60); r = fit(); }
    }
    return { l: (vw - r.w) / 2, t: top + (vh - top - bottom - r.h) / 2, w: r.w, h: r.h };
  }

  function makePiece(item, r) {
    const el = document.createElement('div');
    el.className = 'pm-piece';
    setRect(el, r);
    el.innerHTML = `<div class="pm-tilt" style="--tone:${item.tone};background-image:url('${item.thumb}')"><img alt="${esc(item.alt)}" decoding="async"><i class="pm-gloss"></i></div>`;
    const img = el.querySelector('img');
    img.onload = () => img.classList.add('is-loaded');
    img.src = item.src;
    if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
    el.item = item;
    if (motion && item.motion) attachMotion(el, item);
    return el;
  }
  // Remove a piece, stopping its motion poster first.
  function dropPiece(el) {
    if (el.motion) { el.motion.destroy(); el.motion = null; }
    el.remove();
  }

  /* Motion posters (motion.js, loaded the first time one is opened). Off with reduced motion;
     visitors can pause them, and the choice is remembered. */
  let motionOff = false;
  try { motionOff = localStorage.getItem('foundry-motion') === 'off'; } catch (_) {}
  let motionLib = null;
  const loadMotion = () => motionLib || (motionLib = new Promise((res, rej) => {
    const s = document.createElement('script');
    const v = (document.querySelector('script[src*="foundry.js"]') || {}).src || '';
    s.src = 'motion.js' + (v.includes('?') ? v.slice(v.indexOf('?')) : '');
    s.onload = () => (window.FoundryMotion ? res(window.FoundryMotion) : rej(new Error('motion')));
    s.onerror = rej;
    document.head.appendChild(s);
  }));
  function attachMotion(el, item) {
    loadMotion()
      .then(lib => lib.has(item.key) ? lib.mount(el.firstElementChild, item) : null)
      .then(ctrl => {
        if (!ctrl) return;
        if (!el.isConnected) { ctrl.destroy(); return; }
        el.motion = ctrl;
        if (motionOff) ctrl.pause(true);
      })
      .catch(() => { motionLib = null; });
  }
  function setMotionOff(off) {
    motionOff = off;
    try { localStorage.setItem('foundry-motion', off ? 'off' : 'on'); } catch (_) {}
    stage.querySelectorAll('.pm-piece').forEach(x => { if (x.motion) x.motion.pause(off); });
    const b = $('.pm-motion-btn');
    if (b) { b.setAttribute('aria-pressed', off ? 'false' : 'true'); b.textContent = off ? 'Play motion' : 'Pause motion'; }
  }
  function setRect(el, r) {
    el.style.left = r.l + 'px'; el.style.top = r.t + 'px';
    el.style.width = r.w + 'px'; el.style.height = r.h + 'px';
  }
  const baseRect = el => ({ l: parseFloat(el.style.left), t: parseFloat(el.style.top), w: parseFloat(el.style.width), h: parseFloat(el.style.height) });
  const toRect = (b, a) => `translate(${a.left - b.l}px,${a.top - b.t}px) scale(${a.width / b.w},${a.height / b.h})`;

  function setTitle(text) {
    P.title = text;
    titles.querySelectorAll('.pm-title').forEach(o => { o.classList.add('is-off'); setTimeout(() => o.remove(), 700); });
    const el = document.createElement('p');
    el.className = 'pm-title';
    el.innerHTML = [...text].map((ch, k) => `<span style="--i:${k}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
    sizeTitle(el);
    titles.appendChild(el);
    void el.offsetWidth;
    el.classList.add('is-on');
  }
  function sizeTitle(el) {
    const len = (P.title || '').length, vw = innerWidth;
    el.style.fontSize = Math.max(60, Math.min(vw * .2, vw * 1.75 / Math.max(4, len), 300)) + 'px';
  }

  function setAmbient(item) {
    const next = ambs[P.flip ^ 1];
    next.style.backgroundImage = `url('${item.thumb}')`;
    next.classList.add('is-on');
    ambs[P.flip].classList.remove('is-on');
    P.flip ^= 1;
  }

  function fillInfo(item) {
    const c = item.coll;
    const n = names(item);
    const kick = [n.sub, item.label !== n.sub && item.label !== n.main ? item.label : '', item.year || ''].filter(Boolean);
    $('.pm-kicker').textContent = kick.join(' · ');
    $('.pm-name').textContent = n.main;
    $('.pm-note').textContent = item.note || c.note || '';
    const extra = [];
    if (c.client) extra.push(`<span class="pm-tag">For ${esc(c.client)}</span>`);
    if (c.more) extra.push(`<span class="pm-tag">More ${c.room === 'film' ? 'posters' : 'work'} on the way</span>`);
    if (item.link) extra.push(`<a class="pm-tag" href="${esc(item.link.href)}">${esc(item.link.label)} →</a>`);
    if (item.motion && motion) extra.push(`<button type="button" class="pm-tag pm-motion-btn" aria-pressed="${!motionOff}">${motionOff ? 'Play motion' : 'Pause motion'}</button>`);
    $('.pm-extra').innerHTML = extra.join('');
    if (motion) [...info.children].forEach(x => { x.classList.remove('pm-swap'); void x.offsetWidth; x.classList.add('pm-swap'); });
    const room = roomOf(c.room);
    $('.pm-room').textContent = `${room.name} · ${c.title}`;
    $('.pm-count b').textContent = pad2(item.i + 1);
    $('.pm-count span').textContent = '/ ' + pad2(c.items.length);
    $('.pm-live').textContent = `${item.i + 1} of ${c.items.length}: ${item.title}, ${c.title}`;
    document.title = `${c.byItem || item.title === c.title ? item.title : c.title + ', ' + item.title} · The Foundry`;
  }

  function buildStrip(c) {
    strip.textContent = '';
    if (c.items.length < 2) return;
    c.items.forEach((it, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.style.setProperty('--tone', it.tone);
      b.style.aspectRatio = `${it.w} / ${it.h}`;
      b.setAttribute('aria-label', `${k + 1}: ${it.title}`);
      b.innerHTML = `<img alt="" loading="lazy" src="${it.thumb}">`;
      b.addEventListener('click', () => goTo(c, k));
      strip.appendChild(b);
    });
  }
  function markStrip(i) {
    [...strip.children].forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    const b = strip.children[i];
    if (b) strip.scrollTo({ left: b.offsetLeft - strip.clientWidth / 2 + b.offsetWidth / 2, behavior: motion ? 'smooth' : 'auto' });
  }

  function show(c, i, dir, fromTile) {
    const item = c.items[i];
    const newColl = P.coll !== c;
    P.coll = c; P.i = i; P.item = item;
    fillInfo(item);
    const t = c.byItem ? item.title : c.title;
    if (t !== P.title) setTitle(t);
    setAmbient(item);
    if (newColl) { buildStrip(c); count(`/foundry/${c.room}/${c.id}`, `${c.title} · The Foundry`); }
    markStrip(i);
    if (P.zoom) { P.zoom = false; pm.classList.remove('is-zoom'); }

    const el = makePiece(item, rectFor(item, false));
    const old = P.piece;
    stage.appendChild(el);
    P.piece = el;
    if (fromTile) flipIn(el, fromTile);
    else if (old && motion && dir) {
      el.classList.add('is-entering');
      if (dir < 0) el.classList.add('from-left');
      void el.offsetWidth;
      el.classList.add('is-go');
      setTimeout(() => el.classList.remove('is-entering', 'is-go', 'from-left'), 1050);
      old.classList.add('is-leaving');
      old.style.transform = `translateX(${-dir * 7}%) scale(.94)`;
      setTimeout(() => dropPiece(old), 1000);
    } else {
      if (old) dropPiece(old);
      if (motion) el.animate([{ opacity: 0, transform: 'translateY(26px) scale(.965)' }, { opacity: 1, transform: 'none' }], { duration: 950, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    // Have the neighbours ready.
    [i - 1, i + 1].forEach(k => { const n = c.items[k]; if (n) new Image().src = n.src; });
  }

  function flipIn(el, tile) {
    const a = tile.querySelector('.tile-img').getBoundingClientRect();
    if (!a.width) return;
    tile.classList.add('is-source');
    P.source = tile;
    el.animate([{ transform: toRect(baseRect(el), a) }, { transform: 'none' }], { duration: 1000, easing: 'cubic-bezier(.65,0,.15,1)' });
  }

  function openPremiere(c, i, fromTile) {
    if (P.open) {
      if (c === P.coll && i === P.i) return;
      show(c, i, c === P.coll ? Math.sign(i - P.i) : 1);
      return;
    }
    P.open = true;
    P.lastFocus = document.activeElement;
    C.vx = C.vy = 0;
    P.coll = null; P.title = null; P.piece = null; P.zoom = false;
    stage.querySelectorAll('.pm-piece').forEach(dropPiece); titles.textContent = '';
    pm.classList.remove('is-leaving', 'is-fading', 'is-zoom');
    if (P.source) { P.source.classList.remove('is-source'); P.source = null; }
    pm.hidden = false;
    root.classList.add('pm-open');
    setHover(null);
    if (motion) { pm.classList.add('is-arriving'); void pm.offsetWidth; }
    show(c, i, 0, motion ? fromTile : null);
    pm.classList.remove('is-arriving');
    cursorState();
    setTimeout(() => $('.pm-close').focus({ preventScroll: true }), 60);
  }

  function findTile(item) {
    let best = null, bd = Infinity;
    for (const t of C.tiles) {
      if (t.item !== item || !t.vis) continue;
      if (t.cx < 0 || t.cy < 0 || t.cx + t.w > C.vw || t.cy + t.h > C.vh) continue;
      const d = Math.hypot(t.cx + t.w / 2 - C.vw / 2, t.cy + t.h / 2 - C.vh / 2);
      if (d < bd) { bd = d; best = t.el; }
    }
    return best;
  }

  function closePremiere() {
    if (!P.open) return;
    P.open = false;
    root.classList.remove('pm-open');
    C.vx = C.vy = 0; C.idleAt = now();
    const el = P.piece, tile = motion && el ? findTile(P.item) : null;
    let closed = false;
    const done = () => {
      if (closed || P.open) return;
      closed = true;
      pm.hidden = true;
      pm.classList.remove('is-leaving', 'is-fading', 'is-zoom');
      stage.querySelectorAll('.pm-piece').forEach(dropPiece); titles.textContent = ''; strip.textContent = '';
      ambs.forEach(a => a.classList.remove('is-on'));
      if (P.source) P.source.classList.remove('is-source');
      P.source = null; P.coll = null; P.piece = null; P.title = null; P.zoom = false;
      C.idleAt = now();
      const back = P.lastFocus;
      if (back && back.isConnected && back !== document.body) back.focus({ preventScroll: true });
      cursorState();
    };
    if (!motion || !el) return done();
    if (tile) {
      if (P.source && P.source !== tile) P.source.classList.remove('is-source');
      tile.classList.add('is-source');
      P.source = tile;
      stage.querySelectorAll('.pm-piece').forEach(x => { if (x !== el) dropPiece(x); });
      pm.classList.add('is-leaving');
      const from = getComputedStyle(el).transform;
      el.style.transition = 'none';
      const anim = el.animate([{ transform: from === 'none' ? 'none' : from }, { transform: toRect(baseRect(el), tile.querySelector('.tile-img').getBoundingClientRect()) }],
        { duration: 820, easing: 'cubic-bezier(.65,0,.15,1)', fill: 'forwards' });
      anim.onfinish = done;
      setTimeout(done, 900); // in case the tab is in the background and the animation never reports back
    } else {
      pm.classList.add('is-fading');
      setTimeout(done, 460);
    }
  }

  function goTo(c, i) {
    if (c === P.coll && i === P.i) return;
    const dir = c === P.coll ? Math.sign(i - P.i) : (COLLS.indexOf(c) > COLLS.indexOf(P.coll) ? 1 : -1);
    show(c, i, dir);
    history.replaceState(null, '', hashFor(c, i));
  }
  function step(dir) {
    let c = P.coll, i = P.i + dir;
    if (i >= c.items.length) { c = COLLS[(COLLS.indexOf(c) + 1) % COLLS.length]; i = 0; }
    else if (i < 0) { c = COLLS[(COLLS.indexOf(c) - 1 + COLLS.length) % COLLS.length]; i = c.items.length - 1; }
    show(c, i, dir);
    history.replaceState(null, '', hashFor(c, i));
  }

  function setZoom(on) {
    const el = P.piece;
    if (!el || P.zoom === on) return;
    P.zoom = on;
    pm.classList.toggle('is-zoom', on);
    if (on) {
      const b = baseRect(el), z = rectFor(P.item, true);
      el.style.transform = `translate(${z.l - b.l}px,${z.t - b.t}px) scale(${z.w / b.w})`;
    } else el.style.transform = '';
    cursorState();
  }

  function leave() {
    if (P.pushed) history.back();
    else location.hash = '#/' + (C.filter && C.filter !== 'all' ? C.filter : '');
  }

  $('.pm-close').addEventListener('click', leave);
  $('.pm-extra').addEventListener('click', e => { if (e.target.closest('.pm-motion-btn')) setMotionOff(!motionOff); });
  $('.pm-prev').addEventListener('click', () => step(-1));
  $('.pm-next').addEventListener('click', () => step(1));

  // Wheel: one step per gesture, however long the trackpad keeps gliding.
  pm.addEventListener('wheel', e => {
    if (e.target.closest('.pm-strip')) return;
    e.preventDefault();
    if (P.zoom || !P.coll) return;
    const t = now(), gap = t - P.wheelAt;
    P.wheelAt = t;
    if (P.lock && gap < 200 && t - P.lockAt < 1600) return;
    P.lock = false;
    if (gap > 260) P.acc = 0;
    P.acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(P.acc) > 50) { step(Math.sign(P.acc)); P.acc = 0; P.lock = true; P.lockAt = t; }
  }, { passive: false });

  // Tap the work to look closer; swipe sideways for the next one, down to go back.
  let sw = null;
  stage.addEventListener('pointerdown', e => { sw = { x: e.clientX, y: e.clientY, id: e.pointerId, type: e.pointerType }; });
  stage.addEventListener('pointerup', e => {
    if (!sw || sw.id !== e.pointerId) return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y, touch = sw.type !== 'mouse';
    sw = null;
    if (touch && !P.zoom && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) return step(dx < 0 ? 1 : -1);
    if (touch && !P.zoom && dy > 90 && dy > Math.abs(dx)) return leave();
    if (Math.abs(dx) + Math.abs(dy) < 8) {
      if (e.target.closest('.pm-piece')) setZoom(!P.zoom);
      else if (P.zoom) setZoom(false);
    }
  });

  /* ---------------------------------------------------------------
     Index
     --------------------------------------------------------------- */
  const ix = $('.ix'), ixBtn = $('.top-index'), peek = $('.ix-peek'), peekImg = peek.querySelector('img');
  let ixOpen = false;
  function buildIndex() {
    let k = 0;
    $('.ix-cols').innerHTML = ROOMS.map(r => {
      const cs = COLLS.filter(c => c.room === r.id);
      if (!cs.length) return '';
      return `<section class="ix-room"><h3><a href="#/${r.id}">${r.title}</a><sup>${roomCount(r.id)}</sup></h3><ul>`
        + cs.map(c => `<li style="--i:${k++}"><a href="${hashFor(c)}" data-peek="${c.coverItem.thumb}"><span class="ix-name">${esc(c.title)}</span><span class="ix-meta">${pad2(c.items.length)}${c.years ? ' · ' + c.years : ''}</span></a></li>`).join('')
        + '</ul></section>';
    }).join('');
  }
  function openIndex() {
    if (ixOpen) return;
    ixOpen = true;
    ix.hidden = false;
    void ix.offsetWidth;
    ix.classList.add('is-open');
    root.classList.add('ix-open');
    ixBtn.setAttribute('aria-expanded', 'true');
    setHover(null);
    cursorState();
    setTimeout(() => { const a = ix.querySelector('.ix-room li a'); if (a && ixOpen) a.focus({ preventScroll: true }); }, motion ? 420 : 0);
  }
  function closeIndex(instant) {
    if (!ixOpen) return;
    ixOpen = false;
    root.classList.remove('ix-open');
    ix.classList.remove('is-open');
    ixBtn.setAttribute('aria-expanded', 'false');
    peek.classList.remove('is-on');
    C.idleAt = now();
    const fin = () => { if (!ixOpen) ix.hidden = true; };
    if (instant || !motion) fin(); else setTimeout(fin, 820);
    cursorState();
  }
  ixBtn.addEventListener('click', () => (ixOpen ? closeIndex() : openIndex()));
  ix.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#/"]');
    if (!a) return;
    if (a.getAttribute('href') === location.hash) { e.preventDefault(); closeIndex(); return; }
    if (a.dataset.peek) nav.push = true;
  });
  ix.addEventListener('pointerover', e => {
    const a = e.target.closest('a[data-peek]');
    if (a) { peekImg.src = a.dataset.peek; peek.classList.add('is-on'); }
    else peek.classList.remove('is-on');
  });
  ix.addEventListener('pointerleave', () => peek.classList.remove('is-on'));

  /* ---------------------------------------------------------------
     Cursor, tilt and the one animation loop
     --------------------------------------------------------------- */
  const cur = $('.cur'), curLabel = $('.cur-label');
  const M = { x: -200, y: -200, cx: -200, cy: -200, px: -200, py: -200, inside: false, target: null };
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    M.x = e.clientX; M.y = e.clientY; M.inside = true; M.target = e.target;
    cursorState();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { M.inside = false; cursorState(); });

  function cursorState() {
    if (!fine) return;
    let s = 'off', label = '';
    const t = M.target && M.target.closest ? M.target : null;
    if (!M.inside || !t) s = 'off';
    else if (P.open) {
      if (t.closest('.pm-piece')) { s = 'zoom'; label = P.zoom ? 'Close' : 'Look closer'; }
      else if (t.closest('.pm-stage')) s = 'dot';
    } else if (ixOpen) s = 'off';
    else if (cv.contains(t)) {
      if (C.dragged && C.drag) s = 'grab';
      else if (C.hover) { s = 'view'; label = 'View'; }
      else { s = 'drag'; label = 'Drag'; }
    }
    const cls = 'cur is-' + s;
    if (cur.className !== cls) cur.className = cls;
    if (curLabel.textContent !== label && label) curLabel.textContent = label;
  }

  function tiltStep() {
    if (!P.piece || !fine || !motion) return;
    const mo = P.piece.motion;
    // A motion poster already moves in depth with the pointer, so the card itself tilts half as much.
    if (mo) mo.pointer(P.zoom ? 0 : (M.x / innerWidth - .5) * 2, P.zoom ? 0 : (M.y / innerHeight - .5) * 2);
    const k = mo ? .5 : 1;
    const tx = P.zoom ? 0 : (M.x / innerWidth - .5) * 7 * k, ty = P.zoom ? 0 : -(M.y / innerHeight - .5) * 5 * k;
    P.ry += (tx - P.ry) * .06; P.rx += (ty - P.rx) * .06;
    const tilt = P.piece.firstElementChild;
    tilt.style.setProperty('--ry', P.ry.toFixed(2) + 'deg');
    tilt.style.setProperty('--rx', P.rx.toFixed(2) + 'deg');
    const r = P.piece.getBoundingClientRect();
    tilt.style.setProperty('--gx', ((M.x - r.left) / r.width * 100).toFixed(1) + '%');
    tilt.style.setProperty('--gy', ((M.y - r.top) / r.height * 100).toFixed(1) + '%');
  }

  function tick() {
    requestAnimationFrame(tick);
    if (fine) {
      M.cx += (M.x - M.cx) * .35; M.cy += (M.y - M.cy) * .35;
      cur.style.transform = `translate3d(${M.cx.toFixed(1)}px,${M.cy.toFixed(1)}px,0)`;
      if (ixOpen) {
        M.px += (M.x + 28 - M.px) * .14; M.py += (M.y - 150 - M.py) * .14;
        peek.style.transform = `translate3d(${M.px.toFixed(1)}px,${M.py.toFixed(1)}px,0) rotate(${((M.x - M.px) * .04).toFixed(2)}deg)`;
      }
    }
    if (P.open) tiltStep();
    else if (!ixOpen && C.tiles.length) canvasStep();
  }

  /* ---------------------------------------------------------------
     Keyboard
     --------------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (P.open) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'Escape') { e.preventDefault(); if (P.zoom) setZoom(false); else leave(); }
      else if (e.key === 'Tab') trap(e, pm);
      return;
    }
    if (ixOpen) {
      if (e.key === 'Escape') { e.preventDefault(); closeIndex(); ixBtn.focus(); }
      return;
    }
    const k = { ArrowLeft: [16, 0], ArrowRight: [-16, 0], ArrowUp: [0, 16], ArrowDown: [0, -16] }[e.key];
    if (k && !e.target.closest('.dock')) { e.preventDefault(); C.vx += k[0]; C.vy += k[1]; C.idleAt = now(); hideHint(); }
  });
  function trap(e, box) {
    const f = [...box.querySelectorAll('button, a[href]')].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------------------------------------------------------
     Routes
     --------------------------------------------------------------- */
  const ALIAS = { cinema: 'film', movies: 'film', campaigns: 'events', studio: 'concepts', harbour: 'social', room: 'social' };
  function parse() {
    let raw = location.hash.replace(/^#\/?/, '');
    try { raw = decodeURIComponent(raw); } catch (_) {}
    const [path, qs = ''] = raw.split('?');
    const p = new URLSearchParams(qs).get('p');
    let [a = '', b = ''] = path.split('/').filter(Boolean);
    let legacy = false;
    if (a === 'vault') { a = 'concepts'; b = 'sketchbook'; legacy = true; }
    if (ALIAS[a]) { a = ALIAS[a]; legacy = true; }
    let coll = b ? COLLS.find(c => c.room === a && c.id === b) || null : null;
    let i = 0;
    if (p && BYKEY[p] && (!coll || BYKEY[p].coll === coll)) { coll = BYKEY[p].coll; i = BYKEY[p].i; }
    const filter = roomOf(a) ? a : null;
    const canonical = coll ? hashFor(coll, i) : '#/' + (filter || '');
    const wrong = (a && !filter) || (b && !coll) || legacy;
    return { coll, i, filter: coll ? null : filter, redirect: wrong ? canonical : null };
  }

  function route() {
    const r = parse();
    if (r.redirect && r.redirect !== location.hash) history.replaceState(null, '', r.redirect);
    if (r.coll) {
      closeIndex(true);
      if (!C.tiles.length) showFilter(null, false);
      if (!P.open) P.pushed = nav.push;
      openPremiere(r.coll, r.i, nav.source);
    } else {
      closeIndex();
      if (P.open) closePremiere();
      showFilter(r.filter, true);
      const room = roomOf(r.filter);
      document.title = room ? `${room.title} · The Foundry · FORGE Studio` : 'The Foundry · FORGE Studio';
    }
    nav.push = false; nav.source = null;
  }

  /* ---------------------------------------------------------------
     Start
     --------------------------------------------------------------- */
  function intro() {
    let seen = false;
    try { seen = !!sessionStorage.getItem('foundry-intro'); sessionStorage.setItem('foundry-intro', '1'); } catch (_) {}
    if (seen || !motion || parse().coll) return Promise.resolve();
    $('.intro-word').innerHTML = [...'The Foundry'].map((ch, k) => `<span style="--i:${k}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
    $('.intro-count').textContent = ITEMS.length + ' works';
    root.classList.add('is-intro');
    void $('.intro').offsetWidth;
    root.classList.add('intro-go');
    return new Promise(res => {
      let done = false;
      const lift = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        root.classList.add('intro-lift');
        res();
        setTimeout(() => root.classList.remove('is-intro', 'intro-go', 'intro-lift'), 1050);
      };
      const timer = setTimeout(lift, 1600);
      addEventListener('pointerdown', lift, { once: true });
      addEventListener('keydown', lift, { once: true });
    });
  }

  dock.innerHTML = [{ id: 'all', href: '#/', name: 'Everything', n: ITEMS.length }]
    .concat(ROOMS.map(r => ({ id: r.id, href: '#/' + r.id, name: r.name, n: roomCount(r.id) })))
    .filter(d => d.n)
    .map(d => `<a href="${d.href}" data-f="${d.id}" aria-current="false">${d.name}<sup>${d.n}</sup></a>`).join('');
  $('.ti-n').textContent = COLLS.length;
  buildIndex();

  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (C.list.length) build(C.list, false);
      if (P.open && P.piece) {
        stage.querySelectorAll('.pm-piece').forEach(x => { if (x !== P.piece) dropPiece(x); });
        setRect(P.piece, rectFor(P.item, false));
        const z = P.zoom; P.zoom = false; P.piece.style.transform = '';
        if (z) setZoom(true);
        titles.querySelectorAll('.pm-title').forEach(sizeTitle);
      }
    }, 180);
  });
  // Have the portfolio ready before the visitor clicks back to it.
  const exit = $('.top-exit');
  const warmExit = () => {
    if (exit.dataset.warm) return;
    exit.dataset.warm = '1';
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = new URL('../', location.href).href;
    document.head.appendChild(l);
  };
  ['pointerover', 'touchstart', 'focus'].forEach(ev => exit.addEventListener(ev, warmExit, { passive: true }));

  addEventListener('hashchange', route);
  intro().then(() => { route(); requestAnimationFrame(tick); });
})();
