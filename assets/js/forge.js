/* FORGE Studio 2026 · motion engine
   GSAP + ScrollTrigger + Lenis. Every effect degrades to a readable static page:
   no JS, a failed CDN, or prefers-reduced-motion all leave content visible. */
(() => {
  window.__forgeReady = true;
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motion = html.classList.contains('has-motion') && !!window.gsap && !!window.ScrollTrigger;
  if (!motion) html.classList.remove('has-motion');

  const POSTERS = [
    ['Leo', 2023, 'leo-poster'], ['Avengers: Doomsday', 2025, 'avengers-poster'],
    ['Jana Nayagan', 2026, 'jana-nayagan-poster'], ['John Wick: Chapter 4', 2024, 'john-wick-poster'],
    ['Oppenheimer', 2023, 'oppenheimer-poster'], ['Indian 2', 2024, 'indian2-poster'],
    ['F1', 2025, 'f1-poster'], ['PS-1', 2022, 'ps1-poster'], ['LIK', 2026, 'lik-poster'],
    ['Kalki 2898 AD', 2024, 'kalki-poster'],
  ];

  /* ---------------- Analytics (GoatCounter: free, cookie-free, privacy-friendly) ----------------
     Sign up at goatcounter.com, then put your site code here, e.g. 'forgestudio'. Empty = off. */
  const GOATCOUNTER = '';
  const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function track(name, label) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: `event/${name}${label ? `/${slug(label)}` : ''}`, title: label || name, event: true });
    }
  }
  if (GOATCOUNTER && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    const gc = document.createElement('script');
    gc.async = true; gc.dataset.goatcounter = `https://${GOATCOUNTER}.goatcounter.com/count`; gc.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(gc);
  }

  let lenis = null;
  /* ---------------- Smooth scroll ---------------- */
  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: motion ? 'smooth' : 'auto' }));

  /* ---------------- Nav + menu ---------------- */
  const nav = $('#nav');
  const menuBtn = $('.menu-btn');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    if (open && nav) nav.classList.remove('is-hidden');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  menuBtn && menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false); });

  let lastY = 0;
  const onScrollNav = (y) => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', y > 40);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (goingDown && y > 160 && !document.body.classList.contains('menu-open')) nav.classList.add('is-hidden');
    if (goingUp) nav.classList.remove('is-hidden');
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScrollNav(scroll));
  else window.addEventListener('scroll', () => onScrollNav(window.scrollY), { passive: true });

  // In-page anchors route through Lenis; #archive lands on the opened poster wall.
  let archiveY = null;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2 && id !== '#') return;
    const target = id === '#top' || id === '#' ? null : $(id);
    if (id !== '#top' && id !== '#' && !target) return;
    e.preventDefault();
    setMenu(false);
    if (id === '#top' || id === '#') return scrollToY(0);
    if (id === '#archive' && archiveY !== null) return scrollToY(archiveY());
    const y = target.getBoundingClientRect().top + window.scrollY - (id === '#work' ? 0 : 20);
    scrollToY(y);
  });

  /* ---------------- Toast ---------------- */
  let toastEl = null, toastT = 0;
  const toast = (msg) => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  };
  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove(); return ok;
    }
  };
  /* Share a URL: the native share sheet where it exists (phones), otherwise copy the link. */
  const shareLink = async (url, title) => {
    if (navigator.share && !fine) { try { await navigator.share({ title, url }); track('share', title); return; } catch (e) { return; } }
    if (await copyText(url)) { toast('Link copied. Paste it anywhere.'); track('copy-link', title); }
  };

  /* Copy-email buttons */
  $$('[data-copy-email]').forEach((b) => b.addEventListener('click', async () => {
    if (await copyText(b.dataset.copyEmail)) { toast('Email copied to your clipboard.'); track('copy-email'); }
  }));

  /* ---------------- Lightbox ---------------- */
  const lb = $('.lightbox');
  let openPosterBySlug = null;
  if (lb) {
    const img = $('.lb-stage img', lb), title = $('.lb-title', lb), count = $('.lb-count', lb), shareBtn = $('.lb-share', lb);
    const isArchive = !!$('.poster[data-lb]');
    // Home page: the poster archive. Case pages: every [data-zoom] image, in page order.
    const zooms = $$('[data-zoom]');
    const items = isArchive
      ? POSTERS.map(([t, y, f]) => ({ src: `assets/img/${f}.webp`, alt: `${t} poster design, ${y}`, title: `${t} · ${y}`, slug: f.replace(/-poster$/, '') }))
      : zooms.map((z) => {
        const im = z.tagName === 'IMG' ? z : $('img', z);
        return { src: z.dataset.full || im.currentSrc || im.src, alt: im.alt, title: z.dataset.title || im.alt };
      });
    let idx = 0, opener = null;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      img.src = it.src; img.alt = it.alt;
      title.textContent = it.title;
      count.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      // Every archive poster has its own address, so it can be shared directly.
      if (it.slug) history.replaceState(null, '', `#poster-${it.slug}`);
    };
    const open = (i, from) => {
      opener = from; show(i);
      if (!lb.open) lb.showModal();
      lenis && lenis.stop();
      motion && gsap.fromTo(img, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.5 });
      track('view', items[idx].title);
    };
    openPosterBySlug = (slug) => {
      const i = items.findIndex((it) => it.slug === slug);
      if (i > -1) open(i, null);
    };
    $$('.poster[data-lb]').forEach((p) => {
      p.dataset.cursorLabel = 'View';
      if (!p.getAttribute('aria-label') && !p.hasAttribute('aria-hidden')) {
        const [t, y] = POSTERS[+p.dataset.lb];
        p.setAttribute('aria-label', `Open ${t} poster, ${y}`);
      }
      p.addEventListener('click', () => open(+p.dataset.lb, p));
    });
    if (!isArchive) zooms.forEach((z, i) => {
      z.dataset.cursorLabel = z.dataset.cursorLabel || 'Zoom';
      z.setAttribute('tabindex', '0');
      z.setAttribute('role', 'button');
      if (!z.getAttribute('aria-label')) z.setAttribute('aria-label', `View larger: ${items[i].alt}`);
      z.addEventListener('click', () => open(i, z));
      z.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, z); } });
    });
    if (shareBtn) {
      if (!isArchive) shareBtn.hidden = true;
      shareBtn.addEventListener('click', () => {
        const it = items[idx];
        shareLink(`${location.origin}${location.pathname}#poster-${it.slug}`, `${it.title} poster by FORGE Studio`);
      });
    }
    const step = (d) => {
      show(idx + d);
      motion && gsap.fromTo(img, { autoAlpha: 0, x: d * 30 }, { autoAlpha: 1, x: 0, duration: 0.45 });
    };
    $('.lb-prev', lb).addEventListener('click', () => step(-1));
    $('.lb-next', lb).addEventListener('click', () => step(1));
    $('.lb-close', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb-stage')) lb.close(); });
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
    // Swipe left / right on touch screens
    let tx = null;
    lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
    lb.addEventListener('close', () => {
      lenis && lenis.start();
      if (location.hash.startsWith('#poster-')) history.replaceState(null, '', location.pathname + location.search);
      opener && opener.focus({ preventScroll: true });
    });
  }

  /* ---------------- Commission brief: builds a ready-to-send email ---------------- */
  const brief = $('.brief');
  if (brief) {
    const out = $('.brief-preview', brief);
    const build = () => {
      const kinds = $$('input[name="kind"]:checked', brief).map((i) => i.value);
      const when = ($('input[name="when"]:checked', brief) || {}).value || '';
      const name = $('#brief-name', brief).value.trim();
      const msg = $('#brief-msg', brief).value.trim();
      const subject = `Project enquiry${kinds.length ? `: ${kinds.join(', ')}` : ''}${name ? ` from ${name}` : ''}`;
      const body = [
        'Hi Thinura,', '',
        kinds.length ? `I'd like to talk about: ${kinds.join(', ')}.` : 'I would like to talk about a project.',
        when ? `Timeline: ${when}.` : '',
        '', msg || '(A few words about the project)', '',
        name ? `Thanks,\n${name}` : 'Thanks,',
      ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');
      if (out) out.textContent = `${subject}\n\n${body}`;
      return { subject, body, kinds };
    };
    brief.addEventListener('input', build);
    brief.addEventListener('change', build);
    build();
    brief.addEventListener('submit', (e) => {
      e.preventDefault();
      const { subject, body, kinds } = build();
      track('brief-send', kinds.join('+') || 'none');
      window.location.href = `mailto:${brief.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setTimeout(() => toast('Opening your email app. Nothing opened? Use “Copy email”.'), 400);
    });
  }

  /* ---------------- Find the hidden details (Vijayism) ---------------- */
  const hunt = $('.hunt');
  if (hunt) {
    const spots = $$('.hunt-spot', hunt);
    const card = $('.hunt-card', hunt), cImg = $('img', card), cTitle = $('h3', card), cText = $('p', card), cK = $('.k', card);
    const found = $('.hunt-found', hunt), total = spots.length, done = $('.hunt-done', hunt);
    const seen = new Set();
    const pick = (s) => {
      spots.forEach((o) => o.setAttribute('aria-pressed', String(o === s)));
      s.classList.add('is-found');
      seen.add(s);
      cImg.src = s.dataset.img; cImg.alt = s.dataset.title;
      cK.textContent = `Detail ${String(spots.indexOf(s) + 1).padStart(2, '0')}`;
      cTitle.textContent = s.dataset.title; cText.textContent = s.dataset.text;
      card.hidden = false;
      found.textContent = String(seen.size);
      motion && gsap.fromTo(card, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 });
      if (seen.size === total && done.hidden) {
        done.hidden = false; track('hunt-complete');
        motion && gsap.fromTo(done, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
      }
    };
    spots.forEach((s) => s.addEventListener('click', () => pick(s)));
  }

  /* ---------------- TV clip ---------------- */
  $$('.proof-media .play').forEach((btn) => {
    const v = btn.parentElement.querySelector('video');
    btn.addEventListener('click', () => { v.controls = true; v.play(); btn.classList.add('is-hidden'); });
  });

  /* ---------------- Before / after compare (range input drives a CSS variable) ---------------- */
  $$('.compare').forEach((c) => {
    const r = $('input', c);
    const set = () => c.style.setProperty('--pos', `${r.value}%`);
    r.addEventListener('input', set); set();
  });

  /* ---------------- Screen rails: drag to scroll on desktop ---------------- */
  $$('.rail').forEach((rail) => {
    if (!fine) return;
    let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', (e) => { down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('is-dragging'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; moved = Math.abs(e.clientX - sx); rail.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener('pointerup', () => { down = false; rail.classList.remove('is-dragging'); });
    rail.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* ---------------- Resume rail (works with or without motion) ---------------- */
  const railLinks = $$('.cv-rail a[href^="#"]');
  if (railLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        railLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.cv-sec[id]').forEach((s) => io.observe(s));
  }

  if (!motion) {
    $$('.timeline .tl').forEach((t) => t.classList.add('is-lit'));
    return;
  }

  /* =====================================================
     Everything below runs only with motion enabled
     ===================================================== */

  /* ---------------- Text splitting ---------------- */
  const splitWordsInto = (el, cls) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const outer = document.createElement('span');
            outer.className = cls;
            const inner = document.createElement('span');
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return $$(`.${cls} > span`, el);
  };
  const splitLines = (el) => {
    if (!/<br\s*\/?>/i.test(el.innerHTML)) return splitWordsInto(el, 'word-mask');
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="line-mask"><span>${l.trim()}</span></span>`).join('');
    return $$('.line-mask > span', el);
  };

  /* ---------------- Cursor + magnetic ---------------- */
  if (fine) {
    const cur = $('.cursor');
    if (cur) {
      const label = $('.cursor-label', cur);
      const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3.out' });
      const yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3.out' });
      window.addEventListener('pointermove', (e) => { cur.classList.add('is-on'); xTo(e.clientX); yTo(e.clientY); }, { passive: true });
      document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
      document.addEventListener('pointerover', (e) => {
        const t = e.target.closest('[data-cursor-label]');
        cur.classList.toggle('is-label', !!t);
        label.textContent = t ? t.dataset.cursorLabel : '';
      });
    }
    $$('[data-magnetic]').forEach((el) => {
      const s = parseFloat(el.dataset.magnetic) || 0.25;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * s);
        yTo((e.clientY - r.top - r.height / 2) * s);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------------- Page transitions: heat and ink wipe across on the mark's slant ---------------- */
  const pt = document.createElement('div');
  pt.className = 'pt'; pt.setAttribute('aria-hidden', 'true');
  pt.innerHTML = '<i class="pt-heat"></i><i class="pt-ink"></i><svg class="pt-mark" viewBox="0 0 2962 2488"><use href="#mark-solid"/></svg>';
  document.body.appendChild(pt);
  if (html.classList.contains('pt-in')) {
    // We arrived through a transition: start covered, then wipe the cover away.
    pt.classList.add('is-cover');
    html.classList.remove('pt-in');
    requestAnimationFrame(() => requestAnimationFrame(() => pt.classList.add('is-out')));
    setTimeout(() => pt.classList.remove('is-cover', 'is-out'), 1300);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/(\.html|\/)$/.test(url.pathname) || url.pathname === location.pathname) return;
    e.preventDefault();
    try { sessionStorage.setItem('forge-pt', '1'); } catch (err) { /* private mode: no enter animation */ }
    pt.classList.add('is-in');
    setTimeout(() => { window.location.href = url.href; }, 620);
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) pt.classList.remove('is-in', 'is-cover', 'is-out'); });

  /* ---------------- Optional forge sound (synthesised, off by default, remembered) ---------------- */
  let audio = null, soundOn = false;
  try { soundOn = localStorage.getItem('forge-sound') === 'on'; } catch (e) { soundOn = false; }
  const clang = (power = 1) => {
    if (!soundOn) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audio = audio || new AC();
    const t = audio.currentTime;
    const master = audio.createGain();
    master.gain.value = 0.18 * power;
    master.connect(audio.destination);
    // Inharmonic partials with fast decay read as struck metal.
    [[523, 1], [1187, 0.6], [1873, 0.42], [2650, 0.28], [3520, 0.18]].forEach(([f, a]) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'sine';
      o.frequency.value = f * (0.98 + Math.random() * 0.04) * (power > 1 ? 0.78 : 1);
      g.gain.setValueAtTime(a, t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 1.5 / (1 + f / 2200));
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.7);
    });
    const len = Math.floor(audio.sampleRate * 0.07), buf = audio.createBuffer(1, len, audio.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const n = audio.createBufferSource(), hp = audio.createBiquadFilter(), ng = audio.createGain();
    n.buffer = buf; hp.type = 'highpass'; hp.frequency.value = 1800; ng.gain.value = 0.55;
    n.connect(hp); hp.connect(ng); ng.connect(master); n.start(t);
  };
  const soundBtn = $('.sound-btn');
  if (soundBtn) {
    const paint = () => {
      soundBtn.setAttribute('aria-pressed', String(soundOn));
      $('.sound-label', soundBtn).textContent = soundOn ? 'Sound on' : 'Sound off';
    };
    paint();
    soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      try { localStorage.setItem('forge-sound', soundOn ? 'on' : 'off'); } catch (e) { /* not persisted */ }
      paint(); clang(0.6); track('sound', soundOn ? 'on' : 'off');
    });
  }

  /* =====================================================
     01 IGNITE · weld the mark, heat it, strike it three times,
     then zoom it open onto the archive
     ===================================================== */
  const hero = $('.ignite');
  if (hero) {
    const markSvg = $('.ignite-mark', hero);
    const veilSvg = $('.ignite-veil', hero);
    const markG = $('.mark-g', markSvg), kickG = $('.kick-g', markSvg), markVis = $('.mark-vis', markSvg);
    const holeG = $('.hole-g', veilSvg);
    const shards = $$('.shard', markSvg);
    const colds = $$('.cold', markSvg), hots = $$('.hot', markSvg);
    const seams = $$('.seam', markSvg), glow = $('.glow', markSvg), whole = $('.whole', markSvg);
    const whiteHot = $('.white-hot', markSvg), sheen = $('.sheen', markSvg), flash = $('.strike-flash', markSvg);
    const hazeMap = $('#haze .haze-map');
    const wall = $('.ignite-wall', hero), cols = $$('.wall-col', wall);
    const shade = $('.ignite-shade', hero), cap = $('.archive-cap', hero);
    const copy = $('.ignite-copy', hero), cue = $('.scroll-cue', hero);
    const hud = $('.strike-hud', hero), hudN = $('.strike-n', hero);
    const canvas = $('.ignite-sparks', hero), ctx = canvas.getContext('2d');
    const small = innerWidth < 760;

    const MW = 2962, MH = 2488, PIVOT = [1300, 1500];
    // Outline of the mark (mark units), used to shed sparks from its edges.
    const OUTLINE = [[2962, 267], [2499, 0], [1038, 392], [771, 854], [1234, 1121], [504, 1317], [0, 2190], [516, 2488], [1162, 2314], [1430, 1851], [2160, 1656], [2427, 1193], [1964, 925], [2695, 729]];
    const EDGES = OUTLINE.map((p, i) => [p, OUTLINE[(i + 1) % OUTLINE.length]]);
    const EDGE_LEN = EDGES.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
    const PERIM = EDGE_LEN.reduce((s, l) => s + l, 0);

    // Scroll phases (fractions of the pinned scroll)
    const P = { heatIn: 0.03, heatFull: 0.25, strikes: [0.09, 0.16, 0.23], breach: 0.27, zoomEnd: 0.62, capIn: 0.66 };

    const L = { W: 0, H: 0, k: 1, tx: 0, ty: 0, zMax: 12, ox: 0, oy: 0, s: 1 };
    const zoom = { p: 0 }, heat = { v: 0 }, haze = { v: 0 };

    const applyZoom = () => {
      const { W, H, k, tx, ty, zMax } = L;
      const e = zoom.p;
      const z = (1 + 0.07 * heat.v) * (1 + (zMax - 1) * e * e * e);
      const px = tx + PIVOT[0] * k, py = ty + PIVOT[1] * k;
      const cx = px + (W / 2 - px) * e, cy = py + (H / 2 - py) * e;
      const s = k * z;
      L.ox = cx - s * PIVOT[0]; L.oy = cy - s * PIVOT[1]; L.s = s;
      const t = `translate(${L.ox} ${L.oy}) scale(${s})`;
      markG.setAttribute('transform', t);
      holeG.setAttribute('transform', t);
    };
    const applyHaze = () => {
      if (!hazeMap || small) return;
      const sc = haze.v * 42;
      hazeMap.setAttribute('scale', sc.toFixed(1));
      // The filter only exists while it has work to do, so the zoom stays crisp and cheap.
      if (sc > 0.5) markVis.setAttribute('filter', 'url(#haze)');
      else markVis.removeAttribute('filter');
    };
    const layout = () => {
      const W = hero.clientWidth, H = hero.clientHeight;
      // Fit the mark into the free band between the nav and the hero copy.
      const navH = nav ? nav.offsetHeight : 72;
      const copyTop = copy.offsetTop || H * 0.7;
      const band = Math.max(copyTop - navH, H * 0.28);
      const mw = Math.min(W * 0.8, band * 0.82 * (MW / MH), 760);
      const k = mw / MW;
      const cy = navH + band / 2;
      Object.assign(L, {
        W, H, k, tx: (W - mw) / 2, ty: cy - (MH * k) / 2,
        zMax: (Math.hypot(W, H) / 2 / (340 * k)) * 1.2,
      });
      markSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      veilSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applyZoom();
    };
    layout();
    ScrollTrigger.addEventListener('refreshInit', layout);

    const toScreen = (x, y) => [L.ox + x * L.s, L.oy + y * L.s];
    const edgePoint = () => {
      let r = Math.random() * PERIM, i = 0;
      while (r > EDGE_LEN[i]) { r -= EDGE_LEN[i]; i++; }
      const [a, b] = EDGES[i], t = r / EDGE_LEN[i];
      return toScreen(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
    };

    /* --- Particles: ambient embers, sparks, shockwave rings --- */
    const parts = [], rings = [];
    let sparksOn = true, rafId = 0, shed = 0;
    const emberCount = small ? 18 : 38;
    const ember = () => ({
      x: Math.random() * L.W, y: L.H + Math.random() * L.H * 0.4, vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.25 + Math.random() * 0.6), life: 1, decay: 0, r: 0.6 + Math.random() * 1.6, ember: true, f: Math.random() * 6,
    });
    for (let i = 0; i < emberCount; i++) { const p = ember(); p.y = Math.random() * L.H; parts.push(p); }
    const burst = (x, y, n, power = 1) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = (2 + Math.random() * 7) * power;
        parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2 * power, life: 1, decay: 0.012 + Math.random() * 0.025, r: 0.8 + Math.random() * 1.4 });
      }
    };
    const ring = (x, y, max, w = 2) => rings.push({ x, y, r: 6, max, w, life: 1 });
    const tick = () => {
      ctx.clearRect(0, 0, L.W, L.H);
      ctx.globalCompositeOperation = 'lighter';
      const h = heat.v * Math.max(0, 1 - zoom.p * 4);
      // While the mark heats, it sheds sparks from its edges and pulls the embers in.
      if (h > 0.02) {
        shed += h * (small ? 1.2 : 2.6);
        while (shed >= 1) {
          shed -= 1;
          const [x, y] = edgePoint();
          parts.push({ x, y, vx: (Math.random() - 0.5) * 3, vy: -(1.5 + Math.random() * 5 * h), life: 1, decay: 0.015 + Math.random() * 0.03, r: 0.7 + Math.random() * 1.2 });
        }
      }
      const [pcx, pcy] = toScreen(PIVOT[0], PIVOT[1]);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (p.ember) {
          p.f += 0.05;
          if (h > 0.02) { p.vx += (pcx - p.x) * 0.00003 * h; p.vy += (pcy - p.y) * 0.00003 * h; p.vx *= 0.985; }
          p.x += p.vx + Math.sin(p.f) * 0.2; p.y += p.vy;
          if (p.y < -10 || p.y > L.H + L.H * 0.5) Object.assign(p, ember());
          const a = 0.35 + Math.sin(p.f * 1.7) * 0.2 + h * 0.35;
          ctx.fillStyle = `rgba(255, ${150 + Math.round(Math.sin(p.f) * 40 + h * 60)}, ${40 + Math.round(h * 80)}, ${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.1, p.r * (1 + h * 0.6)), 0, 6.283); ctx.fill();
          continue;
        }
        p.vx *= 0.96; p.vy = p.vy * 0.96 + 0.18; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const g = Math.round(140 + 115 * p.life), b = Math.round(60 + 180 * Math.max(0, p.life - 0.6));
        ctx.strokeStyle = `rgba(255, ${g}, ${b}, ${Math.min(1, p.life * 1.4)})`;
        ctx.lineWidth = p.r;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.4, p.y - p.vy * 2.4); ctx.stroke();
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += (r.max - r.r) * 0.09; r.life -= 0.028;
        if (r.life <= 0) { rings.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(255, ${200 - Math.round((1 - r.life) * 80)}, 90, ${r.life * 0.8})`;
        ctx.lineWidth = r.w * r.life;
        ctx.beginPath(); ctx.arc(r.x, r.y, Math.max(0.1, r.r), 0, 6.283); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      rafId = sparksOn ? requestAnimationFrame(tick) : 0;
    };
    const setSparks = (on) => { if (on === sparksOn) return; sparksOn = on; if (on && !rafId) rafId = requestAnimationFrame(tick); };
    rafId = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', () => setSparks(!document.hidden && zoom.p < 0.45));

    const weldBurst = () => {
      [[1234, 1121], [1600, 1023], [1964, 925], [53, 2220], [740, 2035], [1430, 1851]].forEach(([x, y], i) => {
        const [sx, sy] = toScreen(x, y);
        setTimeout(() => burst(sx, sy, small ? 14 : 26, 1), i * 40);
      });
    };
    if (fine) {
      let last = 0;
      hero.addEventListener('pointermove', (e) => {
        const now = performance.now();
        if (zoom.p > 0.02 || now - last < 45) return;
        last = now;
        const r = hero.getBoundingClientRect();
        burst(e.clientX - r.left, e.clientY - r.top, 2 + Math.round(heat.v * 4), 0.45 + heat.v * 0.4);
      });
    }

    /* --- Hammer strikes: discrete events fired as the scroll crosses each threshold --- */
    const strike = (n, big = false) => {
      const [cx, cy] = toScreen(PIVOT[0], PIVOT[1]);
      clang(big ? 1.6 : 1);
      gsap.fromTo(flash, { opacity: big ? 1 : 0.9 }, { opacity: 0, duration: big ? 0.9 : 0.55, ease: 'power2.out', overwrite: true });
      gsap.fromTo(kickG, { scale: big ? 1.06 : 0.94, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'power4.out', overwrite: true });
      gsap.fromTo(markSvg, { x: 0, y: 0 }, { keyframes: { x: [-7, 6, -4, 2, 0], y: [4, -5, 3, -1, 0] }, duration: 0.38, ease: 'none', overwrite: true });
      ring(cx, cy, Math.max(L.W, L.H) * (big ? 0.9 : 0.42), big ? 4 : 2.5);
      burst(cx, cy, small ? 20 : 40, big ? 1.6 : 1.1);
      for (let i = 0; i < (big ? 6 : 3); i++) { const [x, y] = edgePoint(); burst(x, y, small ? 8 : 16, 1); }
      if (!big && hudN) {
        hudN.textContent = String(n);
        gsap.fromTo(hudN, { scale: 1.6, color: '#FFFFFF' }, { scale: 1, color: '#FFC247', duration: 0.6, ease: 'power3.out', overwrite: true });
      }
    };

    /* --- Intro: draw, fly in, weld, heat --- */
    const heroBits = $$('[data-hero]', hero);
    const h1Words = splitWordsInto($('h1', hero), 'word-mask');
    gsap.set(heroBits, { autoAlpha: 0, y: 24 });
    gsap.set(h1Words, { yPercent: 110 });
    gsap.set(hots, { opacity: 0 });
    holeG.style.visibility = 'hidden'; // the archive hole stays closed until the breach
    colds.forEach((c) => { const len = c.getTotalLength(); gsap.set(c, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 }); });
    shards.forEach((s) => {
      const [dx, dy, rot] = s.dataset.from.split(',').map(Number);
      gsap.set(s, { x: dx, y: dy, rotation: rot, transformOrigin: '50% 50%', opacity: 0 });
    });

    lenis && lenis.stop();
    const unlock = () => { lenis && lenis.start(); };
    const intro = gsap.timeline({ delay: 0.25, onComplete: unlock });
    intro
      .add(unlock, 1.55)
      .to(shards, { opacity: 1, duration: 0.3, stagger: 0.08 }, 0)
      .to(colds, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.1 }, 0)
      .to(colds, { fillOpacity: 1, duration: 0.5 }, 0.5)
      .to(shards, { x: 0, y: 0, rotation: 0, duration: 1.05, ease: 'expo.inOut', stagger: 0.06 }, 0.35)
      .add(weldBurst, 1.32)
      .fromTo(seams, { opacity: 0 }, { opacity: 1, duration: 0.06, ease: 'none' }, 1.32)
      .to(seams, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.4)
      .to(hots, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.36)
      .to(colds, { strokeOpacity: 0, duration: 0.4 }, 1.4)
      .to(whole, { opacity: 1, duration: 0.3, ease: 'none' }, 1.75)
      .fromTo(glow, { opacity: 0 }, { opacity: 0.9, duration: 0.25, ease: 'power2.out' }, 1.34)
      .to(glow, { opacity: 0.32, duration: 1.2, ease: 'power2.out' }, 1.6)
      .to(heroBits, { autoAlpha: 1, y: 0, duration: 1, ease: 'power4.out', stagger: 0.1 }, 1.5)
      .to(h1Words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.05 }, 1.6);

    // Impatient visitors: any scroll attempt fast-forwards the intro.
    const hurry = () => { if (intro.isActive()) intro.timeScale(4); };
    ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, hurry, { once: true, passive: true }));
    if (window.scrollY > 10 || location.hash.length > 1) intro.progress(1);

    /* --- Scroll: heat, three strikes, breach, zoom open onto the archive --- */
    const pinLen = () => window.innerHeight * 3.4;
    let lastP = 0;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      // Runs on every scrub-smoothed frame, so strikes line up with what is on screen.
      onUpdate: () => {
        const p = tl.progress();
        if (p > lastP) {
          P.strikes.forEach((t, i) => { if (lastP < t && p >= t) strike(i + 1); });
          if (lastP < P.breach && p >= P.breach) strike(4, true);
        } else if (hudN && p < lastP) {
          hudN.textContent = String(P.strikes.filter((t) => p >= t).length);
        }
        lastP = p;
        holeG.style.visibility = p >= P.breach ? 'visible' : 'hidden';
        wall.classList.toggle('is-live', p > P.zoomEnd);
        setSparks(p < 0.48 && !document.hidden);
        canvas.style.opacity = String(p < 0.3 ? 1 : Math.max(0, 1 - (p - 0.3) * 6));
      },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: () => `+=${pinLen()}`,
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    tl.to([copy, cue], { autoAlpha: 0, y: -50, duration: 0.05 }, 0)
      .fromTo(hud, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.03 }, 0.05)
      .to(hud, { autoAlpha: 0, y: -24, duration: 0.03 }, P.breach - 0.01)
      // heat up
      .to(heat, { v: 1, duration: P.heatFull - P.heatIn, onUpdate: applyZoom }, P.heatIn)
      .to(haze, { v: 1, duration: 0.14, onUpdate: applyHaze }, P.heatIn)
      .to(haze, { v: 0, duration: 0.05, onUpdate: applyHaze }, P.breach - 0.06)
      .fromTo(glow, { opacity: 0.32 }, { opacity: 1, duration: 0.18, immediateRender: false }, P.heatIn)
      .fromTo(whiteHot, { opacity: 0 }, { opacity: 0.8, duration: P.heatFull - P.heatIn, ease: 'power2.in' }, P.heatIn)
      .fromTo(sheen, { attr: { x: -1400 }, opacity: 1 }, { attr: { x: 3600 }, duration: 0.07, ease: 'power1.inOut' }, 0.06)
      .fromTo(sheen, { attr: { x: -1400 } }, { attr: { x: 3600 }, duration: 0.07, ease: 'power1.inOut', immediateRender: false }, 0.155)
      // breach and zoom
      .to(zoom, { p: 1, duration: P.zoomEnd - P.breach, ease: 'power1.in', onUpdate: applyZoom }, P.breach)
      .to(markVis, { opacity: 0, duration: 0.12 }, P.breach + 0.01)
      .fromTo(wall, { scale: 1.32 }, { scale: 1, duration: P.zoomEnd - P.breach + 0.05 }, P.breach - 0.02)
      .to(shade, { opacity: 1, duration: 0.25 }, 0.45)
      .set(veilSvg, { autoAlpha: 0 }, P.zoomEnd)
      .to(cols.filter((_, i) => i % 2 === 0), { yPercent: -14, duration: 1 - P.zoomEnd }, P.zoomEnd)
      .to(cols.filter((_, i) => i % 2 === 1), { yPercent: 9, duration: 1 - P.zoomEnd }, P.zoomEnd)
      .fromTo(cap, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power3.out' }, P.capIn);

    archiveY = () => (tl.scrollTrigger ? tl.scrollTrigger.start + (tl.scrollTrigger.end - tl.scrollTrigger.start) * 0.8 : 0);
  }

  /* =====================================================
     04 STRIKE · horizontal work track on wide screens
     ===================================================== */
  const mm = gsap.matchMedia();
  const workTrack = $('.work-track');
  if (workTrack) {
    mm.add('(min-width: 901px)', () => {
      document.body.classList.add('work-horizontal');
      const bar = $('.work-progress i');
      const dist = () => workTrack.scrollWidth - window.innerWidth;
      const move = gsap.to(workTrack, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.work-pin', start: 'top top', end: () => `+=${dist()}`,
          pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }),
        },
      });
      $$('.case', workTrack).forEach((c) => {
        const img = $('.case-media img', c);
        gsap.fromTo(img, { xPercent: -5 }, {
          xPercent: 5, ease: 'none',
          scrollTrigger: { trigger: c, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
        });
        gsap.fromTo($('.case-row', c), { autoAlpha: 0, y: 30 }, {
          autoAlpha: 1, y: 0, duration: 0.9,
          scrollTrigger: { trigger: c, containerAnimation: move, start: 'left 78%', once: true },
        });
      });
      return () => document.body.classList.remove('work-horizontal');
    });
    mm.add('(max-width: 900px)', () => {
      $$('.case', workTrack).forEach((c) => {
        gsap.fromTo(c, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1, scrollTrigger: { trigger: c, start: 'top 86%', once: true } });
      });
    });
  }

  /* =====================================================
     05 PRACTICE · cursor-follow preview
     ===================================================== */
  const prev = $('.disc-preview');
  if (prev && fine) {
    const imgs = $$('img', prev);
    const xTo = gsap.quickTo(prev, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(prev, 'y', { duration: 0.6, ease: 'power3.out' });
    const rTo = gsap.quickTo(prev, 'rotation', { duration: 0.8, ease: 'power3.out' });
    let lx = 0;
    $$('.disc a').forEach((a) => {
      a.addEventListener('pointerenter', () => {
        prev.classList.add('is-on');
        imgs.forEach((im, i) => im.classList.toggle('is-on', i === +a.dataset.preview));
      });
      a.addEventListener('pointerleave', () => prev.classList.remove('is-on'));
      a.addEventListener('pointermove', (e) => {
        xTo(e.clientX + 28); yTo(e.clientY - prev.offsetHeight / 2);
        rTo(Math.max(-8, Math.min(8, (e.clientX - lx) * 0.6))); lx = e.clientX;
      });
    });
  }

  /* =====================================================
     06 THE MARK · shards assemble on the grid
     ===================================================== */
  const art = $('.mark-art');
  if (art) {
    const s = $$('.mk-s', art);
    const from = [[260, -340, 6], [0, 0, 0], [-300, 380, -8]];
    s.forEach((el, i) => gsap.set(el, { transformOrigin: '50% 50%' }));
    const tl = gsap.timeline({ scrollTrigger: { trigger: art, start: 'top 85%', end: 'center 50%', scrub: 1 } });
    s.forEach((el, i) => tl.fromTo(el, { x: from[i][0], y: from[i][1], rotation: from[i][2], opacity: 0.35 }, { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'power2.out' }, 0));
    tl.fromTo($$('.grid line', art), { opacity: 0 }, { opacity: 1, stagger: 0.05 }, 0);
    if (fine) {
      const rx = gsap.quickTo(art, 'rotationY', { duration: 1, ease: 'power3.out' });
      const ry = gsap.quickTo(art, 'rotationX', { duration: 1, ease: 'power3.out' });
      gsap.set(art, { transformPerspective: 1200 });
      art.parentElement.addEventListener('pointermove', (e) => {
        const r = art.getBoundingClientRect();
        rx(((e.clientX - r.left) / r.width - 0.5) * 12);
        ry(-((e.clientY - r.top) / r.height - 0.5) * 12);
      });
    }
  }

  /* =====================================================
     07 TEMPER · molten timeline
     ===================================================== */
  const timeline = $('.timeline');
  if (timeline) {
    gsap.to($('.tl-fill', timeline), {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 65%', end: 'bottom 60%', scrub: 0.6 },
    });
    $$('.tl', timeline).forEach((t) => {
      ScrollTrigger.create({ trigger: t, start: 'top 64%', onEnter: () => t.classList.add('is-lit'), onLeaveBack: () => t.classList.remove('is-lit') });
      gsap.fromTo(t, { autoAlpha: 0.25, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: t, start: 'top 80%', once: true } });
    });
  }

  /* =====================================================
     08 QUENCH · the wordmark rises out of the floor
     ===================================================== */
  const word = $('.foot-word');
  if (word) {
    word.innerHTML = word.textContent.split('').map((c) => `<span style="display:inline-block">${c}</span>`).join('');
    gsap.from(word.children, {
      yPercent: 100, duration: 1.2, ease: 'power4.out', stagger: 0.06,
      scrollTrigger: { trigger: word, start: 'top 96%', once: true },
    });
  }

  /* =====================================================
     Resume hero mark + skill meters
     ===================================================== */
  const cvMark = $('.cv-hero-mark');
  if (cvMark) {
    const sh = $$('.cv-shard', cvMark);
    sh.forEach((s) => {
      const [dx, dy, rot] = (s.dataset.from || '0,0,0').split(',').map(Number);
      gsap.from(s, { x: dx, y: dy, rotation: rot, opacity: 0, transformOrigin: '50% 50%', duration: 1.4, ease: 'expo.out', delay: 0.2 });
    });
    gsap.to(cvMark, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.cv-hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  }
  $$('.meter').forEach((m) => {
    const on = $$('i.on', m);
    gsap.fromTo(on, { '--fill': 0 }, { '--fill': 1, duration: 0.7, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: m, start: 'top 90%', once: true } });
  });

  /* Flow reveals are created after every pin so their start positions include pin spacing. */
  /* ---------------- Generic reveals ---------------- */
  $$('[data-lines]').forEach((el) => {
    const parts = splitLines(el);
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(parts, {
      yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: parts.length > 6 ? 0.03 : 0.1,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
  $$('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1, y: 0, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  $$('[data-reveal-group]').forEach((g) => {
    const items = $$('[data-reveal-item]', g);
    gsap.fromTo(items, { autoAlpha: 0, y: 36 }, {
      autoAlpha: 1, y: 0, duration: 0.95, ease: 'power4.out', stagger: 0.08,
      scrollTrigger: { trigger: g, start: 'top 86%', once: true },
    });
  });

  /* Images uncover top-down as they enter, like metal pulled from the furnace */
  $$('[data-img-reveal]').forEach((fig) => {
    const im = $('img', fig);
    gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 86%', once: true } })
      .fromTo(fig, { clipPath: 'inset(0 0 100% 0 round 14px)' }, { clipPath: 'inset(0 0 0% 0 round 14px)', duration: 1.2, ease: 'power4.inOut' })
      .fromTo(im, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
  });

  /* Process lines fill with heat as you pass them */
  $$('.cs-steps').forEach((s) => {
    const f = $('.tl-fill-x', s);
    if (f) gsap.to(f, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 } });
  });

  /* Image parallax inside its frame */
  $$('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
      yPercent: 7, scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  /* Counters */
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, pad = +(el.dataset.pad || 0), o = { v: 0 };
    el.textContent = String(0).padStart(pad, '0');
    gsap.to(o, {
      v: end, duration: end > 50 ? 1.8 : 1.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = String(Math.round(o.v)).padStart(pad, '0'); },
    });
  });

  /* Manifesto: words heat up as you scroll through */
  $$('[data-scrub-words]').forEach((el) => {
    const gold = $('[data-gold]', el);
    const words = splitWordsInto(el, 'w-wrap').map((w) => {
      w.classList.add('w');
      if (gold && gold.contains(w)) w.classList.add('gold');
      return w;
    });
    gsap.to(words, {
      color: (i, w) => (w.classList.contains('gold') ? '#FFC247' : '#F4EFE6'),
      ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: 0.6 },
    });
  });

  /* ---------------- Heat meter: the page cools as you scroll ---------------- */
  const meter = $('.heat-meter');
  if (meter) {
    const temp = $('.temp', meter), chap = $('.chap', meter);
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => {
        const p = s.progress;
        temp.textContent = `${Math.round(24 + 1276 * Math.pow(1 - p, 1.5)).toLocaleString('en-US')}°C`;
        meter.style.setProperty('--heat', (1 - p * 0.92).toFixed(3));
      },
    });
    $$('[data-chapter]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: (s) => { if (s.isActive) chap.textContent = sec.dataset.chapter; },
      });
    });
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    // Arriving from another page with a hash (e.g. index.html#work): the browser jumped before the
    // pinned sections added their scroll length, so re-aim once everything is measured.
    const h = location.hash;
    if (h.startsWith('#poster-') && openPosterBySlug) {
      // A shared poster link: land on the open archive and show that poster.
      const y = archiveY ? archiveY() : 0;
      if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: true, force: true }); } else window.scrollTo(0, y);
      setTimeout(() => openPosterBySlug(h.slice(8)), 500);
      return;
    }
    if (h.length > 1) {
      const t = h === '#archive' && archiveY ? archiveY() : ($(h) ? $(h).getBoundingClientRect().top + window.scrollY - (h === '#work' ? 0 : 20) : null);
      if (t !== null) {
        if (lenis) { lenis.resize(); lenis.scrollTo(t, { immediate: true, force: true }); } else window.scrollTo(0, t);
      }
    }
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
