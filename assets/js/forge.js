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

  /* ---------------- Dates that keep themselves right ---------------- */
  const YEAR = new Date().getFullYear();
  $$('[data-year]').forEach((el) => { el.textContent = YEAR; });
  // "Seven years on": counted from the year in data-since, so the sentence is still true next year
  const COUNT = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
  $$('[data-since]').forEach((el) => { const n = YEAR - Number(el.dataset.since); if (n > 0) el.textContent = COUNT[n] || String(n); });
  // Theme: dark is the forge at night, light is the morning after (ash and smoke). Canvases read this every frame.
  let light = html.dataset.theme === 'light';

  const POSTERS = [
    ['Leo', 2023, 'leo-poster'], ['Avengers: Doomsday', 2025, 'avengers-poster'],
    ['Jana Nayagan', 2026, 'jana-nayagan-poster'], ['John Wick: Chapter 4', 2024, 'john-wick-poster'],
    ['Oppenheimer', 2023, 'oppenheimer-poster'], ['Indian 2', 2024, 'indian2-poster'],
    ['F1', 2025, 'f1-poster'], ['PS-1', 2022, 'ps1-poster'], ['LIK', 2026, 'lik-poster'],
    ['Kalki 2898 AD', 2024, 'kalki-poster'],
  ];

  /* ---------------- Analytics (GoatCounter: free, cookie-free, privacy-friendly) ----------------
     Dashboard: https://forgestudio.goatcounter.com · empty string = off. The Foundry uses the same code (foundry/foundry.js). */
  const GOATCOUNTER = 'forgestudio';
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
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: motion ? 'smooth' : 'auto' }));

  /* ---------------- Theme switch: the fire burns out, in front of you ----------------
     Nothing covers the page. mode.k runs from 0 (dark) to 1 (light) over a few seconds and everything reads it
     live: the flames gutter and die, smoke thickens, daylight comes through it, embers give way to ash, the
     mark cools from gold through dull red to steel, and the page's own colours follow (text glows ember as it
     crosses, so it never disappears against the changing background). Going back, the coals catch again. */
  const themeBtn = $('.theme-btn');
  const themeMeta = $('meta[name="theme-color"]');
  const mode = { k: light ? 1 : 0 };
  // Parts of the page that play their own small part in a mode change register here.
  const modeSubs = [], modeStarts = [];
  const onMode = (fn) => modeSubs.push(fn), onModeStart = (fn) => modeStarts.push(fn);
  const ss = (x) => { const v = Math.min(1, Math.max(0, x)); return v * v * (3 - 2 * v); };
  const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  // dark, light, and (optionally) what it passes through on the way
  const TOK = {
    '--ink': ['#0A0908', '#E8E3D9'], '--ink-2': ['#121110', '#DED8CC'], '--steel': ['#2B2B2B', '#D2CCC0'], '--steel-2': ['#3A3936', '#BDB6A9'],
    '--bone': ['#F4EFE6', '#181614', '#FF9A2E'], '--dim': ['#A8A196', '#4F4A44', '#D9781F'], '--mute': ['#8A8378', '#6B655C', '#B8651A'],
    '--gold': ['#FFC247', '#9A4A00', '#FF8A00'], '--ember': ['#FF8A00', '#C25A00'],
  };
  Object.keys(TOK).forEach((n) => { TOK[n] = TOK[n].map(rgb); });
  const SURFACE = { '--ink': 1, '--ink-2': 1, '--steel': 1, '--steel-2': 1 };
  // The hero mark has its own gradient: heated gold, dull red as it loses its heat, cooled steel.
  const MARK = [['#FFE7A6', '#B5651D', '#625E58'], ['#FFC247', '#8A3D12', '#454340'], ['#FF8A00', '#5A2410', '#302F2D'], ['#7A3510', '#32180F', '#1E1D1B'], ['#2B2B2B', '#1E1614', '#161514']].map((s) => s.map(rgb));
  const markStops = $$('#markG stop');
  const mix3 = (a, b, t) => `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
  const via = (d, m, l, t) => (t < 0.5 ? mix3(d, m, t * 2) : mix3(m, l, t * 2 - 1));
  const paintMode = (resting) => {
    const k = mode.k;
    markStops.forEach((s, i) => { s.style.stopColor = via(MARK[i][0], MARK[i][1], MARK[i][2], ss((k - 0.1) / 0.8)); });
    // The change travels: the nav (next to the switch) goes first, then the page, then the readouts at the foot.
    // Sections on screen follow in order from the top of the window down, so the change is seen to pass through.
    if (!areas) {
      areas = [[html, 0.14], [$('#nav'), 0], [$('.heat-meter'), 0.28], [$('.scroll-cue'), 0.28]].filter(([el]) => el);
      if (!resting) $$('.sec, footer.quench, .cs-hero, main > section').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight && !areas.some(([a]) => a === el)) areas.push([el, 0.04 + 0.24 * Math.min(1, Math.max(0, r.top / innerHeight))]);
      });
    }
    areas.forEach(([el, lag]) => {
      const st = el.style;
      if (resting) { Object.keys(TOK).forEach((n) => st.removeProperty(n)); st.removeProperty('--line'); st.removeProperty('--line-2'); return; }
      const kl = Math.min(1, Math.max(0, (k - lag) / 0.72));
      const bgK = ss((kl - 0.3) / 0.55); // surfaces lighten a little after the fire starts to fail
      Object.keys(TOK).forEach((n) => {
        const [d, l, m] = TOK[n];
        st.setProperty(n, SURFACE[n] ? mix3(d, l, bgK) : (m ? via(d, m, l, kl) : mix3(d, l, kl)));
      });
      const lc = kl < 0.5 ? '244, 239, 230' : '24, 22, 20', la = Math.abs(kl - 0.5) * 2;
      st.setProperty('--line', `rgba(${lc}, ${(0.13 * la).toFixed(3)})`); st.setProperty('--line-2', `rgba(${lc}, ${(0.24 * la).toFixed(3)})`);
    });
  };
  let areas = null;
  const applyTheme = (to) => {
    light = to === 'light';
    if (light) html.dataset.theme = 'light'; else delete html.dataset.theme;
    if (themeMeta) themeMeta.content = light ? '#E8E3D9' : '#0A0908';
  };
  applyTheme(light ? 'light' : 'dark');
  if (themeBtn) themeBtn.setAttribute('aria-checked', String(light));
  paintMode(true);
  let modeTween = null;
  const setMode = (to) => {
    const target = to === 'light' ? 1 : 0;
    if (themeBtn) themeBtn.setAttribute('aria-checked', String(target === 1)); // the knob slides at once; the scene follows
    if (!motion || document.hidden) { mode.k = target; applyTheme(to); paintMode(true); return; }
    if (modeTween) modeTween.kill();
    paintMode(true); areas = null; // measure afresh which sections are on screen
    html.classList.add('mode-shift');
    modeStarts.forEach((fn) => fn(to));
    modeTween = gsap.to(mode, {
      k: target, duration: 3.6 * Math.max(0.35, Math.abs(target - mode.k)), ease: 'sine.inOut',
      onUpdate: () => {
        // the stylesheet's own mode rules change hands at the midpoint, when the 2D layers are at their faintest
        if ((mode.k >= 0.5) !== light) applyTheme(mode.k >= 0.5 ? 'light' : 'dark');
        paintMode(false);
        modeSubs.forEach((fn) => fn(mode.k));
      },
      onComplete: () => {
        applyTheme(to); paintMode(true); areas = null; modeSubs.forEach((fn) => fn(mode.k));
        html.classList.remove('mode-shift'); modeTween = null;
        $$('.mode-glow, .mode-warm').forEach((el) => el.classList.remove('mode-glow', 'mode-warm'));
      },
    });
  };
  // Away from the hero the page still takes part: headings on screen glow in turn as the heat passes.
  onModeStart(() => {
    const seen = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0 ? r : null; };
    $$('.h2, .h3, .display, .manifesto, .cs-title').forEach((el) => {
      const r = seen(el); if (!r) return;
      el.style.setProperty('--mi', Math.min(1, Math.max(0, r.top / innerHeight)).toFixed(2)); el.classList.add('mode-glow');
    });
  });
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const to = themeBtn.getAttribute('aria-checked') === 'true' ? 'dark' : 'light'; // also reverses a change that is still running
    try { localStorage.setItem('forge-theme', to); } catch (e) { /* private mode: the choice lasts for this page */ }
    track('theme', to);
    if (window.ForgeSound && window.ForgeSound.hiss) window.ForgeSound.hiss(to === 'light');
    setMode(to);
  });
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
    const foundryLink = $('.lb-foundry', lb); // archive posters: a quiet door to that film's full wall in the Foundry
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
      if (foundryLink) {
        foundryLink.hidden = !it.slug;
        if (it.slug) {
          foundryLink.href = `foundry/#/cinema/${it.slug}`;
          foundryLink.setAttribute('aria-label', `See every ${it.title.split(' · ')[0]} poster in the Foundry`);
        }
      }
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
    // Close first so the page transition is visible (a modal dialog sits above everything).
    if (foundryLink) foundryLink.addEventListener('click', () => { track('foundry', items[idx].title); lb.close(); });
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

  /* ---------------- Cursor ---------------- */
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
  // A link to another page of this site (not a download, new tab, file or same-page anchor).
  const pageUrl = (a) => {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return null;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/(\.html|\/)$/.test(url.pathname) || url.pathname === location.pathname) return null;
    return url;
  };
  // Fetch the next page as soon as the visitor shows intent (hover, touch, keyboard focus), so it is ready behind the wipe.
  const warmed = new Set();
  const conn = navigator.connection;
  const canPrefetch = (() => { const l = document.createElement('link'); return !!(l.relList && l.relList.supports && l.relList.supports('prefetch')); })();
  const warm = (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    const url = pageUrl(a);
    if (!url) return;
    const href = url.origin + url.pathname;
    if (warmed.has(href) || (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')))) return;
    warmed.add(href);
    if (canPrefetch) {
      const l = document.createElement('link');
      l.rel = 'prefetch'; l.href = href;
      document.head.appendChild(l);
    } else fetch(href, { credentials: 'same-origin' }).catch(() => {});
  };
  // Browsers with speculation rules do this themselves, and better: one rule covers every page link on the site.
  // (Fetch only, never pre-run: a page that ran early would play its entrance before anyone saw it.)
  const canSpeculate = !!(window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules'));
  if (canSpeculate && !(conn && conn.saveData)) {
    const rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({ prefetch: [{ where: { and: [{ href_matches: '/*' }, { not: { href_matches: '/files/*' } }, { not: { selector_matches: '[download], [target=_blank]' } }] }, eagerness: 'moderate' }] });
    document.head.appendChild(rules);
  } else {
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('touchstart', warm, { passive: true });
    document.addEventListener('focusin', warm);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = pageUrl(a);
    if (!url) return;
    warm(e);
    e.preventDefault();
    try { sessionStorage.setItem('forge-pt', '1'); } catch (err) { /* private mode: no enter animation */ }
    pt.classList.add('is-in');
    setTimeout(() => { window.location.href = url.href; }, 620);
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) pt.classList.remove('is-in', 'is-cover', 'is-out'); });

  /* ---------------- Sound: music and the hammer's impacts live in assets/js/forge-sound.js ---------------- */
  const clang = (power = 1) => { if (window.ForgeSound) window.ForgeSound.impact(power); };
  window.addEventListener('forge:sound', (e) => track('sound', e.detail.on ? 'on' : 'off'));

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
    const skipWork = $('.skip-work', hero);
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
    let bgSync = null; // set by the furnace backdrop: keeps its hole identical to the veil's

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
      if (bgSync) bgSync();
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
      if (!W || !H) return; // not laid out yet (hidden tab or zero-size frame): wait for the next resize
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
    markSvg.setAttribute('preserveAspectRatio', 'none'); // like the veil, so the mark and its hole can never drift apart
    layout();
    ScrollTrigger.addEventListener('refreshInit', layout);
    // A resized window re-measures the pinned hero even if ScrollTrigger's own refresh is skipped or late.
    let rzT = 0, rzW = innerWidth, rzH = innerHeight;
    window.addEventListener('resize', () => {
      clearTimeout(rzT);
      rzT = setTimeout(() => { if (innerWidth === rzW && innerHeight === rzH) return; rzW = innerWidth; rzH = innerHeight; ScrollTrigger.refresh(); }, 260);
    });

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
    // Dark: embers rise from the fire. Light: ash sinks from the smoke.
    const ember = () => ({
      x: Math.random() * L.W, y: light ? -Math.random() * L.H * 0.4 : L.H + Math.random() * L.H * 0.4, vx: (Math.random() - 0.5) * 0.25,
      vy: light ? 0.18 + Math.random() * 0.4 : -(0.25 + Math.random() * 0.6), life: 1, decay: 0, r: 0.6 + Math.random() * 1.6, ember: true, f: Math.random() * 6,
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
      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter'; // light adds nothing to pale paper
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
          if (p.y < (light ? -L.H * 0.5 : -10) || p.y > L.H + (light ? 10 : L.H * 0.5)) Object.assign(p, ember());
          const a = 0.35 + Math.sin(p.f * 1.7) * 0.2 + h * 0.35;
          // Ash is grey until the mark heats again, then it catches.
          if (light) ctx.fillStyle = `rgba(${70 + Math.round(h * 150)}, ${64 + Math.round(h * 30)}, ${58 - Math.round(h * 50)}, ${a * (0.6 + h * 0.4)})`;
          else ctx.fillStyle = `rgba(255, ${150 + Math.round(Math.sin(p.f) * 40 + h * 60)}, ${40 + Math.round(h * 80)}, ${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.1, p.r * (1 + h * 0.6)), 0, 6.283); ctx.fill();
          continue;
        }
        p.vx *= 0.96; p.vy = p.vy * 0.96 + 0.18; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const g = Math.round(140 + 115 * p.life), b = Math.round(60 + 180 * Math.max(0, p.life - 0.6));
        ctx.strokeStyle = light ? `rgba(${150 + Math.round(80 * p.life)}, ${Math.round(40 + 70 * p.life)}, 0, ${Math.min(1, p.life * 1.4)})`
          : `rgba(255, ${g}, ${b}, ${Math.min(1, p.life * 1.4)})`;
        ctx.lineWidth = p.r;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.4, p.y - p.vy * 2.4); ctx.stroke();
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += (r.max - r.r) * 0.09; r.life -= 0.028;
        if (r.life <= 0) { rings.splice(i, 1); continue; }
        ctx.strokeStyle = light ? `rgba(70, 62, 54, ${r.life * 0.45})` : `rgba(255, ${200 - Math.round((1 - r.life) * 80)}, 90, ${r.life * 0.8})`;
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
    // Mode change, at the mark: it shimmers in its own heat haze while it cools or reheats, and throws a last
    // scatter of sparks as the fire goes out (or welds again as it returns).
    onMode((k) => { if (zoom.p < 0.02 && heat.v < 0.02) { haze.v = Math.sin(k * Math.PI) * 0.4; applyHaze(); } });
    onModeStart((to) => {
      if (zoom.p > 0.02) return;
      if (to === 'dark') { setTimeout(weldBurst, 1500); return; }
      for (let i = 0; i < 12; i++) { const [x, y] = edgePoint(); setTimeout(() => burst(x, y, small ? 3 : 7, 0.55), i * 70); }
    });
    /* --- Furnace backdrop: real-time fire and smoke (WebGL), plus the mark's construction grid,
           energy pulses and rising embers (2D). Sits above the veil and below the mark. --- */
    const bg = $('.ignite-bg', hero);
    const F = { amp: 0, flare: 0, t: 0, live: true }; // amp: intro fade-in, flare: strike flash that decays
    let bgStrike = () => {}, bgRun = () => {}, bgCanClip = false;
    if (bg) {
      const fireCv = $('.bg-fire', bg), fx = $('.bg-fx', bg), fctx = fx.getContext('2d');
      const PATH_TEST = 'path(evenodd, "M0 0H1V1Z")';
      bgCanClip = !!(window.CSS && CSS.supports && (CSS.supports('clip-path', PATH_TEST) || CSS.supports('-webkit-clip-path', PATH_TEST)));

      // At the breach the backdrop gets the exact mark-shaped hole the veil has, so the archive shows through it.
      let clipped = false;
      bgSync = () => {
        if (holeG.style.visibility !== 'visible' || !bgCanClip) {
          if (clipped) { bg.style.clipPath = ''; bg.style.webkitClipPath = ''; clipped = false; }
          return;
        }
        const { W, H, ox, oy, s } = L;
        const pts = OUTLINE.map(([x, y]) => `${(ox + x * s).toFixed(2)} ${(oy + y * s).toFixed(2)}`).join('L');
        const v = `path(evenodd, "M-4 -4H${W + 4}V${H + 4}H-4ZM${pts}Z")`;
        bg.style.clipPath = v; bg.style.webkitClipPath = v; clipped = true;
      };

      /* WebGL fire: two layers of rising, domain-warped flames, lit smoke and a breathing furnace glow */
      const FS = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        uniform vec2 uRes; uniform float uTime, uHeat, uFlare, uAmp, uLight; uniform vec2 uPtr;
        float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        const mat2 ROT = mat2(1.6, 1.2, -1.2, 1.6);
        float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = ROT * p; a *= 0.5; } return v; }
        float fbm3(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++) { v += a * noise(p); p = ROT * p; a *= 0.5; } return v * 1.1428; }
        void main() {
          vec2 uv = gl_FragCoord.xy / uRes;
          float t = uTime, asp = uRes.x / uRes.y;
          vec2 p = vec2((uv.x - 0.5) * asp, uv.y) + uPtr * vec2(0.025, 0.012);
          vec3 ink = vec3(0.039, 0.035, 0.031);
          float cx = uv.x - 0.5;
          float breathe = 0.93 + 0.07 * sin(t * 1.05);
          float fireK = 1.0 - smoothstep(0.0, 0.55, uLight); // the fire fails first, before the daylight comes
          float energy = (0.86 + 0.24 * uHeat) * (1.0 + 0.35 * uFlare) * breathe * fireK;
          float H = mix(0.24, 0.34, smoothstep(0.6, 1.6, asp)); // flame height: lower on portrait screens
          // heat shimmer in the air above the fire
          p.x += (noise(p * vec2(9.0, 5.0) + vec2(0.0, -t * 2.6)) - 0.5) * (0.005 + 0.008 * uHeat) * smoothstep(0.7, 0.0, uv.y);

          // Light mode, the morning after: the fire is out. Smoke climbs off a bed of dying coals into daylight.
          vec3 lc = vec3(0.0);
          if (uLight > 0.001) {
            vec3 paper = vec3(0.910, 0.890, 0.851);
            lc = paper * (1.0 - 0.09 * exp(-uv.y * 2.6)); // daylight thins toward the floor, where the ash lies
            // tall, slow plumes that lean and fold as they climb; thicker over the hearth
            vec2 sq = vec2(p.x * 1.15, uv.y * 1.25) + vec2(t * 0.018, -t * 0.055);
            vec2 sw = vec2(fbm3(sq * 1.05 + vec2(0.0, t * 0.03)), fbm3(sq * 1.05 + vec2(3.3, 8.1 - t * 0.018)));
            float sm = fbm(sq * 1.25 + (sw - 0.5) * 2.6);
            float hearth = 0.5 + 0.5 * exp(-cx * cx * 5.0);
            float dens = smoothstep(0.34, 0.8, sm) * smoothstep(1.02, 0.1, uv.y) * hearth * (0.8 + 0.35 * uHeat + 0.5 * uFlare);
            vec3 smoke = mix(vec3(0.63, 0.61, 0.585), vec3(0.34, 0.325, 0.31), smoothstep(0.45, 0.85, sm));
            // the copy stays readable: thinner smoke behind the headline (left) and paragraph (right) on wide screens
            float copyZone = smoothstep(0.14, 0.34, abs(cx)) * smoothstep(0.42, 0.16, uv.y) * smoothstep(1.0, 1.4, asp);
            lc = mix(lc, smoke, clamp(dens, 0.0, 1.0) * 0.6 * (1.0 - 0.7 * copyZone * (1.0 - uHeat)));
            // the hearth, burnt out: a low heap of grey-white ash and charcoal along the floor. Only thin cracks
            // still hold a dull red, pulsing slowly; heat and strikes wake them for a moment.
            float heapH = (0.014 + 0.02 * fbm3(vec2(p.x * 2.6, 3.0)) + 0.028 * exp(-cx * cx * 7.0) + 0.004 * noise(vec2(p.x * 26.0, 1.0))) * min(1.0, asp * 0.8 + 0.2);
            float heap = smoothstep(heapH + 0.006, heapH - 0.004, uv.y);
            lc = mix(lc, lc * 0.9, smoothstep(heapH + 0.07, heapH, uv.y) * (1.0 - heap) * 0.6); // the heap's soft shadow in the smoke
            vec2 hp = vec2(p.x, uv.y * 2.0);
            // soft, powdery grey: gentle mottling, a scatter of small charcoal specks, nothing bright
            vec3 ash = mix(vec3(0.775, 0.76, 0.735), vec3(0.64, 0.625, 0.6), smoothstep(0.3, 0.75, fbm(hp * 7.0)));
            ash = mix(ash, vec3(0.42, 0.4, 0.38), smoothstep(0.74, 0.86, noise(hp * vec2(150.0, 190.0) + 4.0)) * 0.6);
            ash *= 0.86 + 0.14 * smoothstep(0.0, heapH, uv.y);                                                 // darker toward the floor
            // the last of the heat: a few small points of dull red deep in the ash, breathing slowly
            float warm = smoothstep(0.5, 0.78, fbm3(vec2(p.x * 2.4, t * 0.04)) + 0.3 * uHeat + 0.45 * uFlare);
            float glint = smoothstep(0.84, 0.94, noise(hp * vec2(70.0, 95.0) + 9.0)) * warm * smoothstep(heapH, heapH * 0.35, uv.y);
            glint *= 0.5 + 0.3 * sin(t * 0.8 + p.x * 11.0) + 0.6 * uHeat + 0.9 * uFlare;
            ash = mix(ash, vec3(0.6, 0.13, 0.03), clamp(glint, 0.0, 0.85));
            ash = mix(ash, vec3(1.0, 0.5, 0.1), clamp(glint - 0.85, 0.0, 0.5));
            lc = mix(lc, ash, heap);
            lc = mix(paper, lc, uAmp);
            lc += (hash(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) / 255.0;
          }
          if (uLight > 0.999) { gl_FragColor = vec4(lc, 1.0); return; }

          vec3 col = ink;
          // furnace light hanging in the air
          float g = exp(-uv.y * 3.2) * (0.45 + 0.55 * exp(-cx * cx * 4.0));
          col += vec3(0.62, 0.15, 0.02) * g * (0.3 + 0.2 * uHeat + 0.5 * uFlare) * breathe * fireK;

          // smoke, lit from below
          float dens = 0.0;
          if (uv.y < 0.9) {
            vec2 sq = vec2(p.x * 1.3, uv.y * 1.6) + vec2(t * 0.025, -t * 0.07);
            vec2 sw = vec2(fbm3(sq * 1.1 + vec2(0.0, t * 0.035)), fbm3(sq * 1.1 + vec2(3.3, 8.1 - t * 0.02)));
            float sm = fbm(sq * 1.3 + (sw - 0.5) * 2.4);
            float side = 0.45 + 0.55 * smoothstep(0.04, 0.4, abs(cx));
            dens = smoothstep(0.36, 0.74, sm) * smoothstep(0.9, 0.08, uv.y) * side;
            dens = min(1.0, dens * (1.0 + 1.6 * sin(uLight * 3.14159))); // a dying fire throws its thickest smoke
            float lit = clamp(exp(-uv.y * 1.8) * (0.95 + 0.35 * uHeat + 0.8 * uFlare) * breathe * (0.55 + 0.6 * sm) * (0.15 + 0.85 * fireK), 0.0, 1.0);
            col = mix(col, mix(vec3(0.055, 0.04, 0.035), vec3(0.74, 0.26, 0.07), lit), dens * 0.85);
          }

          // flames: turbulence rising off a bed of shifting hot spots, licking sideways as it climbs
          if (uv.y < H * 3.0) {
            float yh = uv.y / H;
            // hottest in the middle, between the headline and the paragraph; cooler under the copy
            float fuel = min(1.6, (0.3 + 0.78 * exp(-cx * cx * 9.0)) * (0.6 + 0.8 * fbm3(vec2(p.x * 2.2 + t * 0.04, t * 0.06))) * energy);
            vec2 q = vec2(p.x * 3.0, uv.y * 2.0 - t * 1.25);
            q.x += (fbm3(vec2(p.x * 1.4, uv.y * 1.1 - t * 0.55)) - 0.5) * 1.4 * min(yh, 1.0);
            float n = fbm(q);
            float d = fbm(q * 2.3 + vec2(3.1, -t * 0.8));
            float c = fuel - yh * 0.95 + (n - 0.5) * 1.5 * (0.35 + min(yh, 1.0)) + (d - 0.5) * 0.45;
            c = 1.0 - exp(-max(c, 0.0) * 1.9); // soft shoulder: the hottest cores keep their detail instead of clipping flat
            col += vec3(1.5 * c, 1.5 * c * c * c, c * c * c * c * c * c) * (1.0 - 0.3 * dens) * 0.95;
            // bloom: the hot spots light the air and smoke above them
            col += vec3(0.55, 0.14, 0.015) * exp(-yh * 1.4) * fuel * 0.32;
          }
          col = mix(col, ink, smoothstep(0.6, 1.0, uv.y) * 0.6);
          // keep the hero copy legible: calmer light behind the headline (left) and paragraph (right) on wide screens
          float copyZone = smoothstep(0.14, 0.34, abs(cx)) * smoothstep(0.4, 0.16, uv.y) * smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 1.4, asp);
          col *= 1.0 - 0.38 * copyZone * (1.0 - uHeat);
          col = mix(ink, col, uAmp);
          // daylight arrives unevenly, through the smoke, rather than as a flat fade
          if (uLight > 0.001) {
            float day = (uLight - 0.3) / 0.62 + (fbm3(p * 1.7 + vec2(0.0, -t * 0.06)) - 0.5) * 0.55 * sin(uLight * 3.14159);
            col = mix(col, lc, smoothstep(0.0, 1.0, day));
          }
          col += (hash(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) / 255.0;
          gl_FragColor = vec4(col, 1.0);
        }`;
      let gl = null, U = {};
      try {
        gl = fireCv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
        if (gl) {
          const sh = (type, src) => {
            const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
            return s;
          };
          const prog = gl.createProgram();
          gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }'));
          gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
          gl.linkProgram(prog);
          if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
          gl.useProgram(prog);
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
          const loc = gl.getAttribLocation(prog, 'a');
          gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
          ['uRes', 'uTime', 'uHeat', 'uFlare', 'uAmp', 'uLight', 'uPtr'].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
        }
      } catch (err) { gl = null; }
      // Screens that can show more colour than standard web colour (most recent phones and laptops) get a richer
      // fire: the same numbers, drawn in the wider Display P3 range. Light mode stays in standard colour so the
      // paper matches the rest of the page exactly.
      const wideGamut = !!gl && 'drawingBufferColorSpace' in gl && matchMedia('(color-gamut: p3)').matches;
      let wideOn = false;
      const noGL = () => { gl = null; bg.classList.add('no-gl'); };
      if (!gl) noGL();
      fireCv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); noGL(); });

      let fxD = 1; // device scale of the 2D layer, for restoring its transform after a rotated draw
      const bgResize = () => {
        const W = hero.clientWidth, H = hero.clientHeight, dpr = window.devicePixelRatio || 1;
        // Fire is soft, so it renders at reduced resolution; the grid and embers stay crisp.
        const glS = Math.min(small ? 0.55 : 0.5, 1000 / Math.max(W, 1)) * Math.min(dpr, small ? 1.5 : 1.25);
        fireCv.width = Math.max(2, Math.round(W * glS)); fireCv.height = Math.max(2, Math.round(H * glS));
        if (gl) gl.viewport(0, 0, fireCv.width, fireCv.height);
        const fd = Math.min(dpr, small ? 1.5 : 2);
        fx.width = Math.round(W * fd); fx.height = Math.round(H * fd);
        fctx.setTransform(fd, 0, 0, fd, 0, 0); fxD = fd;
      };
      bgResize();
      ScrollTrigger.addEventListener('refreshInit', bgResize);

      /* The mark is drawn on a 534-unit square lattice turned 30°; its long edges are the lattice diagonals. */
      const STEP = 534;
      const FAM = [{ d: [0.8660, 0.5], n: [-0.5, 0.8660], phase: 354 }, { d: [-0.5, 0.8660], n: [0.8660, 0.5], phase: 27 }];
      const DIAG = { d: [0.9659, -0.2588], n: [0.2588, 0.9659], offs: [647, 1402, 2159, 2537] };
      const screenLine = (path, d, n, c, D) => {
        const off = c * L.s + L.ox * n[0] + L.oy * n[1], px = n[0] * off, py = n[1] * off;
        path.moveTo(px - d[0] * D, py - d[1] * D); path.lineTo(px + d[0] * D, py + d[1] * D);
      };
      const gridPaths = () => {
        const { W, H, ox, oy, s } = L, D = W + H, lat = new Path2D(), dia = new Path2D();
        FAM.forEach(({ d, n, phase }) => {
          const base = phase * s + ox * n[0] + oy * n[1], step = STEP * s;
          const c = [0, W * n[0], H * n[1], W * n[0] + H * n[1]];
          const k0 = Math.ceil((Math.min(...c) - base) / step), k1 = Math.floor((Math.max(...c) - base) / step);
          for (let k = k0; k <= k1; k++) screenLine(lat, d, n, phase + k * STEP, D);
        });
        DIAG.offs.forEach((c) => screenLine(dia, DIAG.d, DIAG.n, c, D));
        return [lat, dia];
      };

      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 64;
      {
        const g = sprite.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        r.addColorStop(0, 'rgba(255, 240, 200, 1)'); r.addColorStop(0.18, 'rgba(255, 196, 90, .75)');
        r.addColorStop(0.45, 'rgba(255, 128, 10, .22)'); r.addColorStop(1, 'rgba(255, 100, 0, 0)');
        g.fillStyle = r; g.fillRect(0, 0, 64, 64);
      }
      // Light mode sprites: a live coal (drawn normally, not added) and a soft out-of-focus ash flake.
      const dot = (stops) => {
        const c = document.createElement('canvas'); c.width = c.height = 64;
        const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        stops.forEach(([o, col]) => r.addColorStop(o, col));
        g.fillStyle = r; g.fillRect(0, 0, 64, 64);
        return c;
      };
      const coalSprite = dot([[0, 'rgba(255, 150, 30, 1)'], [0.22, 'rgba(232, 96, 0, .8)'], [0.55, 'rgba(214, 80, 0, .2)'], [1, 'rgba(214, 80, 0, 0)']]);
      const ashSprite = dot([[0, 'rgba(120, 114, 106, .5)'], [0.5, 'rgba(120, 114, 106, .24)'], [1, 'rgba(120, 114, 106, 0)']]);
      // Real ash is torn, not round: each flake is an irregular scrap, pale where it burnt through and darker at
      // the edges, with a few holes eaten into it.
      const flakes = [['#C9C4BB', '#8F8A82'], ['#B4AEA5', '#6F6A63'], ['#DAD5CC', '#A39D94'], ['#7C766F', '#3E3A36'], ['#5A5550', '#2A2725'], ['#A8A299', '#57524D']].map(([pale, edge], k) => {
        const c = document.createElement('canvas'); c.width = c.height = 48;
        const g = c.getContext('2d');
        let seed = 7 + k * 13;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        const n = 7 + Math.floor(rnd() * 4);
        g.beginPath();
        for (let i = 0; i < n; i++) {
          const a = (i / n) * 6.283 + rnd() * 0.5, r = 9 + rnd() * 13;
          g[i ? 'lineTo' : 'moveTo'](24 + Math.cos(a) * r, 24 + Math.sin(a) * r * (0.55 + rnd() * 0.3));
        }
        g.closePath();
        const gr = g.createRadialGradient(22, 22, 2, 24, 24, 22);
        gr.addColorStop(0, pale); gr.addColorStop(1, edge);
        g.fillStyle = gr; g.fill();
        g.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(14 + rnd() * 20, 16 + rnd() * 16, 1 + rnd() * 2.2, 0, 6.283); g.fill(); }
        return c;
      });

      // Energy pulses run along the lattice into the mark, as if feeding it.
      const pulses = [], ripples = [];
      let pulseWait = 0.6;
      const newPulse = () => {
        let d, n, c;
        if (Math.random() < 0.3) { ({ d, n } = DIAG); c = DIAG.offs[(Math.random() * DIAG.offs.length) | 0]; }
        else {
          const f = FAM[(Math.random() * 2) | 0]; ({ d, n } = f);
          const k = Math.round((PIVOT[0] * n[0] + PIVOT[1] * n[1] - f.phase) / STEP) + ((Math.random() * 5) | 0) - 2;
          c = f.phase + k * STEP;
        }
        const mid = PIVOT[0] * d[0] + PIVOT[1] * d[1], dir = Math.random() < 0.5 ? 1 : -1;
        return { d, n, c, pos: mid + dir * (3600 + Math.random() * 1800), end: mid + dir * 1000, dir: -dir,
          speed: 240 + Math.random() * 260, tail: 420 + Math.random() * 380, age: 0 };
      };

      // Rising embers: a few out-of-focus ones close to camera, most small and streaking.
      const EMB = small ? 60 : 150, embers = [];
      const spawn = (fresh) => {
        const z = Math.random(), bokeh = z > 0.93, W = L.W || innerWidth, H = L.H || innerHeight;
        const u = Math.random() < 0.6 ? 0.5 + ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * 1.7 : Math.random();
        const max = 2.5 + Math.random() * 4;
        return { x: u * W, y: fresh ? Math.random() * H : (light ? -10 - Math.random() * 60 : H + 10 + Math.random() * 60), z, bokeh,
          vy: (50 + Math.random() * 120) * (0.45 + z * 0.9), drift: (Math.random() - 0.5) * 30, seed: Math.random() * 100,
          size: bokeh ? 7 + Math.random() * 12 : 0.7 + z * 1.9, max, age: fresh ? Math.random() * max : 0 };
      };
      for (let i = 0; i < EMB; i++) embers.push(spawn(true));

      const drawFx = (dt) => {
        // during a mode change the embers thin out to nothing, then the ash gathers
        const { W, H } = L, a = F.amp * (light ? ss(mode.k * 2 - 1) : ss(1 - mode.k * 2)), h = heat.v, fl = Math.min(1, F.flare);
        fctx.clearRect(0, 0, W, H);
        if (a < 0.01) return;
        fctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
        const [pcx, pcy] = toScreen(PIVOT[0], PIVOT[1]);
        const [lat, dia] = gridPaths();
        const R = Math.hypot(W, H) * 0.5, gi = a * (0.7 + 0.6 * h + 0.5 * fl);
        const gr = fctx.createRadialGradient(pcx, pcy, 0, pcx, pcy, R);
        // On paper the construction grid is drawn in graphite; in the dark it glows.
        gr.addColorStop(0, light ? `rgba(40, 36, 32, ${0.13 * gi})` : `rgba(255, 214, 150, ${0.07 * gi})`);
        gr.addColorStop(0.45, light ? `rgba(40, 36, 32, ${0.05 * gi})` : `rgba(255, 194, 71, ${0.025 * gi})`);
        gr.addColorStop(1, light ? 'rgba(40, 36, 32, 0)' : 'rgba(255, 194, 71, 0)');
        fctx.lineWidth = 1; fctx.strokeStyle = gr; fctx.stroke(lat);
        fctx.stroke(dia); fctx.stroke(dia); // the construction diagonals read twice as bright
        // Strike ripples flash outward through the grid.
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.r += dt * R * 1.5; r.life -= dt * 0.9;
          if (r.life <= 0) { ripples.splice(i, 1); continue; }
          const rg = fctx.createRadialGradient(pcx, pcy, Math.max(0, r.r - 80), pcx, pcy, r.r + 80);
          rg.addColorStop(0, light ? 'rgba(200, 84, 0, 0)' : 'rgba(255, 200, 110, 0)');
          rg.addColorStop(0.5, light ? `rgba(200, 84, 0, ${0.6 * r.life * a})` : `rgba(255, 220, 150, ${0.75 * r.life * a})`);
          rg.addColorStop(1, light ? 'rgba(200, 84, 0, 0)' : 'rgba(255, 200, 110, 0)');
          fctx.lineWidth = 1.5; fctx.strokeStyle = rg; fctx.stroke(lat); fctx.stroke(dia);
        }
        // Pulses
        pulseWait -= dt * (1 + h * 1.6);
        if (pulseWait <= 0 && pulses.length < 6) { pulses.push(newPulse()); pulseWait = 0.55 + Math.random() * 0.7; }
        fctx.lineCap = 'round';
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.age += dt; p.pos += p.dir * p.speed * dt / L.s;
          const left = (p.end - p.pos) * p.dir;
          if (left <= 0) { pulses.splice(i, 1); continue; }
          const pa = Math.min(1, p.age * 2.5) * Math.min(1, left / 900) * a * (0.75 + 0.5 * h);
          const at = (tau) => toScreen(p.n[0] * p.c + p.d[0] * tau, p.n[1] * p.c + p.d[1] * tau);
          const [hx, hy] = at(p.pos), [tx, ty] = at(p.pos - p.dir * p.tail);
          const lg = fctx.createLinearGradient(tx, ty, hx, hy);
          lg.addColorStop(0, light ? 'rgba(200, 84, 0, 0)' : 'rgba(255, 138, 0, 0)');
          lg.addColorStop(1, light ? `rgba(214, 90, 0, ${0.8 * pa})` : `rgba(255, 214, 120, ${0.85 * pa})`);
          fctx.strokeStyle = lg; fctx.lineWidth = 1.6;
          fctx.beginPath(); fctx.moveTo(tx, ty); fctx.lineTo(hx, hy); fctx.stroke();
          fctx.globalAlpha = pa * 0.8; fctx.drawImage(light ? coalSprite : sprite, hx - 10, hy - 10, 20, 20); fctx.globalAlpha = 1;
        }
        // Embers
        const lift = 1 + fl * 1.3 + h * 0.5;
        for (let i = 0; i < embers.length; i++) {
          const e = embers[i];
          if (light) {
            // Ash: sparse scraps sinking out of the smoke. Each one tumbles, and as it turns edge-on it slips
            // sideways, the way paper ash falls. Strikes blow them outward.
            if (i % 3 === 2) continue; // ash hangs thinner in the air than sparks do
            e.age += dt * 0.3;
            const tum = F.t * (0.5 + e.z * 0.8) + e.seed, flat = Math.cos(tum);       // flat: 1 face-on, 0 edge-on
            let ax = e.drift * 0.5 + Math.sin(tum * 0.5) * 22 * (0.4 + e.z) + (1 - Math.abs(flat)) * Math.sin(e.seed) * 30;
            let ay = e.vy * (0.16 + 0.2 * (1 - Math.abs(flat)));                        // falls faster edge-on
            if (fl > 0.05) { const dx = e.x - pcx, dy = e.y - pcy, dd = Math.hypot(dx, dy) || 1; ax += (dx / dd) * fl * 150; ay += (dy / dd) * fl * 90; }
            e.x += ax * dt; e.y += ay * dt;
            if (e.age > e.max || e.y > H + 30) { embers[i] = spawn(false); continue; }
            const al = Math.min(1, e.age / 0.3) * Math.min(1, (e.max - e.age) / 1.2) * a;
            if (al <= 0.01) continue;
            if (e.bokeh) { fctx.globalAlpha = al * 0.45; fctx.drawImage(ashSprite, e.x - e.size * 1.4, e.y - e.size * 1.4, e.size * 2.8, e.size * 2.8); continue; }
            const fs = 3 + e.z * 9 + (e.seed % 5), sp = flakes[Math.floor(e.seed) % flakes.length];
            fctx.globalAlpha = al * (0.5 + 0.45 * e.z);
            fctx.translate(e.x, e.y); fctx.rotate(tum * 0.7 + e.seed); fctx.scale(1, 0.18 + 0.82 * Math.abs(flat));
            fctx.drawImage(sp, -fs / 2, -fs / 2, fs, fs);
            fctx.setTransform(fxD, 0, 0, fxD, 0, 0);
            // a rare flake still carries a dull red edge
            if (e.seed % 17 < 1) { fctx.globalAlpha = al * 0.5 * (0.6 + 0.4 * Math.sin(F.t * 2 + e.seed)); fctx.drawImage(coalSprite, e.x - 3, e.y - 3, 6, 6); }
            continue;
          }
          e.age += dt;
          // Rise with a lazy, turbulent sway; strikes blow them outward from the mark.
          let vx = e.drift + Math.sin(F.t * (0.8 + e.z * 0.9) + e.seed + e.y * 0.006) * 34 * (0.4 + e.z);
          let vy = -e.vy * lift;
          if (fl > 0.05) { const dx = e.x - pcx, dy = e.y - pcy, dd = Math.hypot(dx, dy) || 1; vx += (dx / dd) * fl * 160; vy += (dy / dd) * fl * 60; }
          e.x += vx * dt; e.y += vy * dt;
          if (e.age > e.max || e.y < -30) { embers[i] = spawn(false); continue; }
          const life = Math.min(1, e.age / 0.35) * Math.min(1, (e.max - e.age) / 1.4);
          const ea = life * a * (0.6 + 0.4 * Math.sin(F.t * (6 + e.z * 7) + e.seed)) * (0.45 + 0.55 * e.z);
          if (ea <= 0.01) continue;
          if (e.bokeh) { fctx.globalAlpha = ea * 0.18; fctx.drawImage(sprite, e.x - e.size, e.y - e.size, e.size * 2, e.size * 2); continue; }
          const gs = 4 + e.size * 6;
          fctx.globalAlpha = ea * 0.55; fctx.drawImage(sprite, e.x - gs / 2, e.y - gs / 2, gs, gs);
          fctx.globalAlpha = ea;
          fctx.strokeStyle = e.z > 0.55 ? '#FFE9B8' : '#FFB25A';
          fctx.lineWidth = e.size;
          fctx.beginPath(); fctx.moveTo(e.x, e.y); fctx.lineTo(e.x - vx * 0.022, e.y - vy * 0.022); fctx.stroke();
        }
        fctx.globalAlpha = 1;
        fctx.globalCompositeOperation = 'source-over';
      };

      let rafBg = 0, bgOn = false, lastT = 0, ptrX = 0, ptrY = 0, ptx = 0, pty = 0;
      const frame = (now) => {
        const dt = Math.min(0.05, Math.max(0, (now - lastT) / 1000)); lastT = now;
        F.t += dt; F.flare *= Math.exp(-dt * 2.4);
        ptx += (ptrX - ptx) * Math.min(1, dt * 3); pty += (ptrY - pty) * Math.min(1, dt * 3);
        if (gl) {
          if (wideGamut && (mode.k < 0.5) !== wideOn) { wideOn = !wideOn; try { gl.drawingBufferColorSpace = wideOn ? 'display-p3' : 'srgb'; } catch (err) { /* stays as it was */ } }
          gl.uniform2f(U.uRes, fireCv.width, fireCv.height);
          gl.uniform1f(U.uTime, F.t % 3600); gl.uniform1f(U.uHeat, heat.v);
          gl.uniform1f(U.uFlare, Math.min(1, F.flare)); gl.uniform1f(U.uAmp, F.amp); gl.uniform1f(U.uLight, mode.k);
          gl.uniform2f(U.uPtr, ptx, pty);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        drawFx(dt);
        rafBg = bgOn ? requestAnimationFrame(frame) : 0;
      };
      bgRun = () => {
        const on = F.live && !document.hidden;
        if (on === bgOn) return;
        bgOn = on;
        if (on && !rafBg) { lastT = performance.now(); rafBg = requestAnimationFrame(frame); }
      };
      bgRun();
      document.addEventListener('visibilitychange', bgRun);
      if (fine) hero.addEventListener('pointermove', (e) => { ptrX = (e.clientX / innerWidth - 0.5) * 2; ptrY = (0.5 - e.clientY / innerHeight) * 2; });
      bgStrike = (big) => { F.flare = big ? 1.4 : 1; ripples.push({ r: 0, life: 1 }); };
    }

    /* --- Hammer strikes: discrete events fired as the scroll crosses each threshold --- */
    const strike = (n, big = false) => {
      const [cx, cy] = toScreen(PIVOT[0], PIVOT[1]);
      clang(big ? 1.6 : 1);
      bgStrike(big);
      gsap.fromTo(flash, { opacity: big ? 1 : 0.9 }, { opacity: 0, duration: big ? 0.9 : 0.55, ease: 'power2.out', overwrite: true });
      gsap.fromTo(kickG, { scale: big ? 1.06 : 0.94, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'power4.out', overwrite: true });
      gsap.fromTo(markSvg, { x: 0, y: 0 }, { keyframes: { x: [-7, 6, -4, 2, 0], y: [4, -5, 3, -1, 0] }, duration: 0.38, ease: 'none', overwrite: true });
      ring(cx, cy, Math.max(L.W, L.H) * (big ? 0.9 : 0.42), big ? 4 : 2.5);
      burst(cx, cy, small ? 20 : 40, big ? 1.6 : 1.1);
      for (let i = 0; i < (big ? 6 : 3); i++) { const [x, y] = edgePoint(); burst(x, y, small ? 8 : 16, 1); }
      if (!big && hudN) {
        hudN.textContent = String(n);
        gsap.fromTo(hudN, { scale: 1.6, color: light ? '#FF8A00' : '#FFFFFF' }, { scale: 1, color: light ? '#9A4A00' : '#FFC247', duration: 0.6, ease: 'power3.out', overwrite: true, clearProps: 'color' });
      }
    };

    /* --- Intro: draw, fly in, weld, heat --- */
    const heroBits = $$('[data-hero]', hero);
    const h1Words = splitWordsInto($('h1', hero), 'word-mask');
    h1Words.forEach((w, i) => w.style.setProperty('--wi', i)); // order for the glow that crosses the headline on a mode change
    gsap.set(heroBits, { autoAlpha: 0, y: 24 });
    gsap.set(h1Words, { yPercent: 110 });
    gsap.set(hots, { opacity: 0 });
    holeG.style.visibility = 'hidden'; // the archive hole stays closed until the breach
    colds.forEach((c) => { const len = c.getTotalLength(); gsap.set(c, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 }); });
    shards.forEach((s) => {
      const [dx, dy, rot] = s.dataset.from.split(',').map(Number);
      gsap.set(s, { x: dx, y: dy, rotation: rot, transformOrigin: '50% 50%', opacity: 0 });
    });

    // The mark is measured and set to its starting pose: it may be shown now (see "forge-ready" in forge-mode.css).
    html.classList.add('forge-ready');
    lenis && lenis.stop();
    const unlock = () => { lenis && lenis.start(); };
    const intro = gsap.timeline({ delay: 0.25, onComplete: unlock });
    intro
      .add(unlock, 1.55)
      .to(F, { amp: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
      .add(() => { F.flare = Math.max(F.flare, 0.8); }, 1.32) // the weld kicks the furnace
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
    const deep = window.scrollY > 10 || location.hash.length > 1;
    if (deep) intro.progress(1);

    // The door: on a first visit the mark waits while the visitor chooses to enter with sound or without.
    // Their click is also what lets the browser start the music.
    const door = $('.door');
    let asked = true;
    try { asked = !!localStorage.getItem('forge-sound'); } catch (e) { /* no storage: do not ask */ }
    if (door && !asked && !deep) {
      intro.pause(0);
      door.hidden = false;
      requestAnimationFrame(() => door.classList.add('is-open'));
      const first = $('[data-door="on"]', door);
      if (first) first.focus({ preventScroll: true });
      const enter = (withSound) => {
        if (window.ForgeSound && window.ForgeSound.set) window.ForgeSound.set(withSound);
        else { try { localStorage.setItem('forge-sound', withSound ? 'on' : 'off'); } catch (e) { /* asked again next time */ } }
        track('door', withSound ? 'sound' : 'silent');
        door.classList.remove('is-open'); door.classList.add('is-leaving');
        setTimeout(() => { door.hidden = true; }, 900);
        intro.play();
      };
      door.addEventListener('click', (e) => { const b = e.target.closest('[data-door]'); if (b) enter(b.dataset.door === 'on'); });
      door.addEventListener('keydown', (e) => { if (e.key === 'Escape') enter(false); });
    }

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
        if (bgSync) bgSync();
        F.live = p < P.breach + 0.16; bgRun();
        wall.classList.toggle('is-live', p > P.zoomEnd);
        if (skipWork) skipWork.classList.toggle('is-on', p > 0.035 && p < 0.6); // from the first strike until the archive opens
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
      // The furnace dies down as the mark breaks open (or just before, where the hole cannot be cut from it).
      .to(bg, { autoAlpha: 0, duration: bgCanClip ? 0.12 : 0.03, ease: 'power1.in' }, bgCanClip ? P.breach + 0.02 : P.breach - 0.03)
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
    // The preview sits fixed on screen, so the browser would fetch it on page load: wait until the list is near.
    const feed = () => imgs.forEach((im) => { if (im.dataset.src && !im.src) im.src = im.dataset.src; });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { feed(); io.disconnect(); } }, { rootMargin: '600px 0px' });
      io.observe(prev.closest('section') || prev);
    } else feed();
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
    // Each word carries --lit (0 cold, 1 heated); the stylesheet turns that into the theme's colours.
    gsap.fromTo(words, { '--lit': 0 }, {
      '--lit': 1,
      ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: 0.6 },
    });
  });

  /* ---------------- Heat meter: the page cools as you scroll ---------------- */
  const meter = $('.heat-meter');
  if (meter) {
    const temp = $('.temp', meter), chap = $('.chap', meter);
    // In the light the fire is out: the same scale tops out near 200°C, and the reading falls as the mode changes.
    let meterP = 0;
    const paintTemp = () => {
      const top = 1276 * (1 - 0.86 * mode.k);
      temp.textContent = `${Math.round(24 + top * Math.pow(1 - meterP, 1.5)).toLocaleString('en-US')}°C`;
      meter.style.setProperty('--heat', ((1 - meterP * 0.92) * (1 - 0.6 * mode.k)).toFixed(3));
    };
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { meterP = s.progress; paintTemp(); } });
    onMode(paintTemp); paintTemp();
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
