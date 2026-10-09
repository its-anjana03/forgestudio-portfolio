/* FORGE Studio · heat details
   Loaded after forge.js on every page. One idea throughout: gold heat arrives, then settles.
   - main headings are revealed by a pass of heat
   - small details: menu links, link underlines, tags, award seals, one detail per project page
   Kept deliberately few: small things do not glow, and nothing carries two effects at once. */
(() => {
  'use strict';
  // timings, in seconds: slow enough to be seen, never long enough to wait for
  const T = {
    reveal: 2.2, revealGap: 0.24,           // a heading of a few lines
    revealWords: 1.35, revealWordGap: 0.05, // a long heading, word by word
    hover: 1.25, hoverGap: 0.1,
    hoverWords: 0.9, hoverWordGap: 0.03,
    rule: 1.5,                              // a divider line drawing itself
  };

  const root = document.documentElement;
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const { gsap, ScrollTrigger } = window;
  const motion = root.classList.contains('has-motion') && gsap && ScrollTrigger;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- The scrollbar cools with the page ---------- */
  {
    let queued = false;
    const cool = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      root.style.setProperty('--fx-heat', (1 - Math.min(1, Math.max(0, scrollY / Math.max(1, max)))).toFixed(3));
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(cool); } }, { passive: true });
    cool();
  }

  /* ---------- Award seals: the two recognitions, stamped like a maker's seal ---------- */
  const SEALS = {
    tv: { ring: 'Aired on Indian television · Thanthi TV ·', big: 'TV', small: '', year: '2022' },
    first: { ring: 'Best Watch Design · First of 200 entries ·', big: '1', small: 'st', year: '2022' },
  };
  const seals = [];
  const addSeal = (host, kind, id) => {
    if (!host || host.querySelector(':scope > .fx-seal')) return;
    const s = SEALS[kind], el = document.createElement('div');
    el.className = 'fx-seal'; el.setAttribute('aria-hidden', 'true');   // the same facts are already in the text beside it
    el.innerHTML = `<svg viewBox="0 0 200 200">
      <defs><path id="seal-arc-${id}" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs>
      <circle class="seal-disc" cx="100" cy="100" r="96"/><circle class="seal-lip" cx="100" cy="100" r="93"/>
      <circle class="seal-ring" cx="100" cy="100" r="62"/>
      <text class="seal-text"><textPath href="#seal-arc-${id}" textLength="470">${s.ring}</textPath></text>
      <text class="seal-big" x="100" y="116">${s.big}<tspan dy="-20">${s.small}</tspan></text>
      <text class="seal-year" x="100" y="143">${s.year}</text></svg>`;
    host.appendChild(el);
    seals.push(el);
  };
  {
    const here = location.pathname;
    $$('.proof-card').forEach((card, i) => {
      const kind = card.querySelector('a[href*="vijayism"]') ? 'tv' : card.querySelector('a[href*="rolex"]') ? 'first' : null;
      if (kind) addSeal(card.querySelector('.proof-media'), kind, `p${i}`);
    });
    const visual = document.querySelector('.cs-hero-visual');
    if (visual && /vijayism/.test(here)) addSeal(visual, 'tv', 'h');
    if (visual && /rolex/.test(here)) addSeal(visual, 'first', 'h');
  }

  /* ---------- One detail for each project page (built here, brought to life further down) ---------- */
  const page = {};
  const el = (tag, cls, html) => { const n = document.createElement(tag); n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const path = location.pathname;

  // Joey: each audit finding carries its number, stamped on like a seal
  if (/joey/.test(path)) {
    page.findings = $$('.cs-figure .frame[data-title^="Issue"]').map((frame, i) => {
      const n = el('span', 'fx-finding', String(i + 1).padStart(2, '0'));
      n.setAttribute('aria-hidden', 'true');
      frame.appendChild(n);
      return n;
    });
  }

  // Vijayism: an ON AIR lamp by the section where the poster reaches television
  if (/vijayism/.test(path)) {
    const label = $$('.cs-prose .label').find((l) => /Recognition/.test(l.textContent));
    if (label) {
      page.onair = el('div', 'fx-onair', '<i></i><span>On air</span>');
      page.onair.setAttribute('aria-hidden', 'true');
      label.before(page.onair);
    }
  }

  // Seylune: the home page screenshot opens inside a browser window
  if (/seylune/.test(path)) {
    const frame = document.querySelector('.cs-figure.wide .frame');
    if (frame && frame.querySelector('img')) {
      const bar = el('div', 'fx-browser', '<span class="fx-dots"><i></i><i></i><i></i></span><span class="fx-url"><b>seylune / home</b></span><span class="fx-load"></span>');
      bar.setAttribute('aria-hidden', 'true');
      frame.prepend(bar);
      frame.classList.add('fx-has-browser');
      page.browser = { frame, bar, img: frame.querySelector('img'), url: bar.querySelector('.fx-url b'), load: bar.querySelector('.fx-load') };
    }
  }

  // Avengers: the cast count that sank the first layout
  if (/avengers/.test(path)) {
    const strong = $$('.cs-prose strong').find((s) => /^27-character/.test(s.textContent));
    if (strong) { strong.innerHTML = strong.innerHTML.replace('27', '<span class="fx-count">27</span>'); page.count = strong.querySelector('.fx-count'); }
    page.compare = document.querySelector('.compare');
    // the rebuild: 27 characters cut down to the 12 that made the final poster
    const label = $$('.cs-head .label').find((l) => /Process, part two/.test(l.textContent));
    const intro = label && label.closest('.cs-head').querySelector('p');
    if (intro) {
      page.cut = el('div', 'fx-cut', '<span class="fx-cut-n">12</span><span class="fx-cut-cap"><b>characters in the final poster</b>cut down from 27 in the first layout</span>');
      intro.after(page.cut);
    }
  }

  // Rolex: a Day-Date shows the day and the date, so this one shows the visitor's own
  if (/rolex/.test(path)) {
    const badges = document.querySelector('.cs-hero .cs-badges');
    if (badges) {
      const now = new Date();
      const day = now.toLocaleDateString('en-GB', { weekday: 'long' }), date = now.getDate();
      page.daydate = el('div', 'fx-daydate', `<span class="fx-dd-cap">Today on a Day-Date</span><span class="fx-dd-day">${day}</span><span class="fx-dd-date"><b>${date}</b></span>`);
      page.daydate.setAttribute('aria-label', `Today a Day-Date would show ${day} ${date}`);
      page.daydate.dataset.prev = String(new Date(now.getTime() - 864e5).getDate());
      badges.after(page.daydate);
    }
  }

  // FORGE identity: the mark is constructed on its grid
  if (/forge-identity/.test(path) && document.getElementById('mark-path')) {
    const label = $$('.cs-prose .label').find((l) => /Logo concept/.test(l.textContent));
    const prose = label && label.closest('.cs-prose');
    if (prose) {
      page.construct = el('div', 'fx-construct', `<svg viewBox="-500 -500 3962 3488" role="img" aria-label="The FORGE mark drawn on its construction grid">
        <g class="fx-grid">
          <line x1="-500" y1="2700" x2="3460" y2="414"/><line x1="-500" y1="1900" x2="3460" y2="-386"/><line x1="-500" y1="1100" x2="3000" y2="-920"/>
          <line x1="300" y1="-500" x2="2300" y2="2964"/><line x1="-600" y1="900" x2="900" y2="3498"/><line x1="1500" y1="-500" x2="3450" y2="2878"/>
        </g>
        <use class="fx-fill" href="#mark-path" fill="url(#heatG)"/>
        <path class="fx-trace" d="M2962,267L2499,0L1038,392L771,854L1234,1121L504,1317L0,2190L516,2488L1162,2314L1430,1851L2160,1656L2427,1193L1964,925L2695,729Z"/>
      </svg><span class="fx-construct-cap">Six guides, three angles, one mark</span>`);
      prose.appendChild(page.construct);
    }
  }

  /* ---------- Hidden strike: typing F-O-R-G-E brings the hammer down on the mark ---------- */
  if (root.classList.contains('has-motion')) {
    let typed = '', canvas = null, ctx = null, sparks = [], raf = 0, last = 0;
    const draw = (now) => {
      const dt = Math.min((now - last) / 1000 || 0.016, 0.033); last = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      sparks = sparks.filter((s) => (s.age += dt) < s.life);
      sparks.forEach((s) => {
        s.vy += 1100 * dt; s.vx *= Math.exp(-dt * 1.2);
        const px = s.x, py = s.y; s.x += s.vx * dt; s.y += s.vy * dt;
        const a = 1 - s.age / s.life;
        ctx.strokeStyle = `rgba(255, ${Math.round(185 + 55 * a)}, ${Math.round(80 + 100 * a)}, ${a})`;
        ctx.beginPath(); ctx.moveTo(px - s.vx * 0.014, py - s.vy * 0.014); ctx.lineTo(s.x, s.y); ctx.stroke();
      });
      if (sparks.length) raf = requestAnimationFrame(draw); else { canvas.remove(); canvas = null; raf = 0; }
    };
    const strike = () => {
      const mark = document.querySelector('.nav .brand svg') || document.querySelector('.brand');
      const r = mark ? mark.getBoundingClientRect() : { left: 40, top: 30, width: 0, height: 0 };
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:400;pointer-events:none';
        const dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
        ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
        document.body.appendChild(canvas);
      }
      for (let i = 0; i < 46; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.3) * 2.9, v = 220 + Math.random() * 760;
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.9, age: 0 });
      }
      if (mark) { mark.classList.remove('fx-struck'); void mark.getBoundingClientRect(); mark.classList.add('fx-struck'); }
      if (window.ForgeSound && window.ForgeSound.impact) window.ForgeSound.impact(1);
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(draw); }
    };
    addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1 || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === 'forge') { typed = ''; strike(); }
    });
  }

  if (!motion) return;

  // run a one-shot CSS animation class, then take it off again
  const once = (el, cls) => {
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
  };
  const onArrive = (el, fn, start = 'top 86%') => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn });

  /* ---------- Seals are struck as they come into view ---------- */
  seals.forEach((el) => {
    gsap.set(el, { autoAlpha: 0 });
    onArrive(el, () => {
      gsap.timeline({ delay: 0.7 })
        .fromTo(el, { autoAlpha: 0, scale: 1.9, rotation: -16 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.34, ease: 'power4.in' })
        .add(() => {
          once(el, 'is-struck');
          if (window.ForgeSound && window.ForgeSound.impact) window.ForgeSound.impact(0.35);
        })
        .fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
    }, 'top 78%');
  });

  /* ---------- Project pages: each detail comes to life as it is reached ---------- */
  // Joey: the finding numbers are struck on one after another
  (page.findings || []).forEach((n, i) => {
    gsap.set(n, { autoAlpha: 0 });
    onArrive(n, () => {
      gsap.timeline({ delay: 0.5 + (i % 2) * 0.22 })
        .fromTo(n, { autoAlpha: 0, scale: 2.1, rotation: -18 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.3, ease: 'power4.in' })
        .add(() => once(n, 'is-struck'))
        .fromTo(n, { scale: 0.9 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)' });
    }, 'top 80%');
  });

  // Vijayism: the lamp is dark until the section arrives, then it flickers on
  if (page.onair) onArrive(page.onair, () => gsap.delayedCall(0.6, () => page.onair.classList.add('is-on')), 'top 80%');

  // Seylune: type the address, load, then show the page from the top down
  if (page.browser) {
    const { frame, img, url, load } = page.browser, text = url.textContent;
    // take over from the standard image reveal so the three steps happen in order
    ScrollTrigger.getAll().filter((st) => st.trigger === frame && st.animation).forEach((st) => { st.animation.kill(); st.kill(); });
    gsap.set(frame, { clearProps: 'clipPath' }); gsap.set(img, { clearProps: 'transform' });
    url.textContent = '';
    gsap.set(img, { clipPath: 'inset(0 0 100% 0)' });
    onArrive(frame, () => {
      const o = { n: 0 };
      gsap.timeline({ delay: 0.3 })
        .to(o, { n: text.length, duration: 1.1, ease: 'none', onUpdate: () => { url.textContent = text.slice(0, Math.round(o.n)); } })
        .fromTo(load, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '+=0.15')
        .to(load, { opacity: 0, duration: 0.3 })
        .to(img, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power3.inOut' }, '-=0.35');
    }, 'top 82%');
  }

  // Avengers: the count climbs to 27, and the comparison shows once that it can be dragged
  if (page.count) {
    page.count.textContent = '00';
    onArrive(page.count, () => {
      const o = { v: 0 };
      gsap.to(o, { v: 27, duration: 1.6, delay: 0.5, ease: 'power2.out', onUpdate: () => { page.count.textContent = String(Math.round(o.v)).padStart(2, '0'); }, onComplete: () => once(page.count, 'fx-ignite') });
    }, 'top 85%');
  }
  if (page.cut) {
    const n = page.cut.querySelector('.fx-cut-n');
    n.textContent = '27';
    onArrive(page.cut, () => {
      const o = { v: 27 };
      // each character leaves one at a time, slowing as the cast settles
      gsap.to(o, { v: 12, duration: 2.4, delay: 0.5, ease: 'power2.out', onUpdate: () => { n.textContent = String(Math.round(o.v)); }, onComplete: () => once(n, 'fx-flare') });
    }, 'top 84%');
  }
  if (page.compare) {
    const range = page.compare.querySelector('input');
    let touched = false;
    ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => page.compare.addEventListener(ev, () => { touched = true; }, { passive: true }));
    if (range) onArrive(page.compare, () => {
      const o = { v: +range.value };
      const set = () => { if (touched) { demo.kill(); return; } range.value = o.v; range.dispatchEvent(new Event('input')); };
      const demo = gsap.timeline({ delay: 1, onUpdate: set })
        .to(o, { v: 22, duration: 1.1, ease: 'power2.inOut' })
        .to(o, { v: 78, duration: 1.5, ease: 'power2.inOut' })
        .to(o, { v: 50, duration: 1.1, ease: 'power2.inOut' });
    }, 'top 60%');
  }

  // Rolex: the date wheel clicks over from yesterday to today
  if (page.daydate) {
    const num = page.daydate.querySelector('.fx-dd-date b'), today = num.textContent;
    num.textContent = page.daydate.dataset.prev;
    onArrive(page.daydate, () => {
      gsap.timeline({ delay: 0.9 })
        .to(num, { yPercent: -110, duration: 0.28, ease: 'power2.in' })
        .add(() => { num.textContent = today; })
        .fromTo(num, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'back.out(2.2)' })
        .add(() => once(page.daydate, 'is-set'), '-=0.2');
    }, 'top 92%');
  }

  // FORGE identity: guides first, then the outline is traced along them, then the metal fills in
  if (page.construct) {
    const lines = $$('.fx-grid line', page.construct), trace = page.construct.querySelector('.fx-trace'), fill = page.construct.querySelector('.fx-fill');
    const cap = page.construct.querySelector('.fx-construct-cap');
    lines.forEach((l) => { const len = l.getTotalLength(); l.style.strokeDasharray = len; l.style.strokeDashoffset = len; });
    const tl = trace.getTotalLength();
    trace.style.strokeDasharray = tl; trace.style.strokeDashoffset = tl;
    gsap.set(fill, { opacity: 0 }); gsap.set(cap, { autoAlpha: 0 });
    onArrive(page.construct, () => {
      gsap.timeline({ delay: 0.3 })
        .to(lines, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.14 })
        .to(trace, { strokeDashoffset: 0, duration: 2.4, ease: 'power1.inOut' }, '-=0.3')
        .to(fill, { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.4')
        .to(trace, { opacity: 0.35, duration: 1 }, '<')
        .to(cap, { autoAlpha: 1, duration: 0.8 }, '-=0.6');
    }, 'top 78%');
  }

  /* ---------- Chapter words: each section's name stands behind it as a faint outline ----------
     Only where the page asks for it (data-fx-chapters on <html>). The words live in one layer behind the
     page, so nothing is inserted into the sections themselves. */
  if (root.hasAttribute('data-fx-chapters')) {
    const layer = el('div', 'fx-chapters');
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    const words = $$('main .sec[data-chapter], main .quench[data-chapter]')
      .filter((sec) => !sec.querySelector('.work-pin'))        // the pinned work track has its own movement
      .map((sec, i) => {
        const name = sec.dataset.chapter;
        const w = el('div', 'fx-chapter', `<span class="fx-ch-base">${name}</span><span class="fx-ch-hot">${name}</span>`);
        layer.appendChild(w);
        const inner = w, hot = w.querySelector('.fx-ch-hot');
        // the word drifts slowly against the scroll while its section passes
        gsap.fromTo(inner, { xPercent: 7 }, { xPercent: -7, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
        // and one pass of heat runs along its outline each time the section arrives
        const heat = () => gsap.fromTo(hot, { '--p': '-25%' }, { '--p': '125%', duration: 3, ease: 'power1.inOut', overwrite: true });
        ScrollTrigger.create({ trigger: sec, start: 'top 70%', end: 'bottom 30%', onEnter: heat, onEnterBack: heat });
        return { sec, w, i };
      });
    const place = () => words.forEach(({ sec, w }) => {
      const r = sec.getBoundingClientRect();
      w.style.top = `${r.top + scrollY + Math.min(r.height * 0.08, innerHeight * 0.12)}px`;
    });
    place();
    ScrollTrigger.addEventListener('refresh', place);
    addEventListener('load', place);
  }

  /* ---------- End credits roll while they are on screen ---------- */
  const credits = document.querySelector('[data-credits]');
  if (credits) {
    const roll = credits.querySelector('.credits-roll');
    let tween = null;
    const start = () => {
      if (tween) tween.kill();
      const from = credits.clientHeight * 0.82, to = -roll.offsetHeight;
      tween = gsap.fromTo(roll, { y: from }, { y: to, duration: (from - to) / 26, ease: 'none', repeat: -1, repeatDelay: 0.8, paused: true });
    };
    start();
    ScrollTrigger.create({ trigger: credits, start: 'top bottom', end: 'bottom top', onToggle: (s) => { if (s.isActive) tween.play(); else tween.pause(); } });
    ScrollTrigger.addEventListener('refreshInit', () => { const playing = tween && !tween.paused(); start(); if (playing) tween.play(); });
  }

  /* ---------- The signature writes itself in hot gold, then cools ---------- */
  const sig = document.querySelector('[data-sig]');
  if (sig) {
    const strokes = $$('.sig-stroke', sig), tip = sig.querySelector('.sig-tip'), cap = sig.querySelector('.sig-cap');
    const lens = strokes.map((p) => p.getTotalLength());
    strokes.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]} ${lens[i] + 10}`; p.style.strokeDashoffset = lens[i]; });
    sig.classList.add('is-hot');
    if (cap) gsap.set(cap, { autoAlpha: 0, x: -12 });
    onArrive(sig, () => {
      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(tip, { opacity: 1, duration: 0.2 }, 0);
      strokes.forEach((p, i) => {
        // the pen moves at one speed, so long strokes take longer; a breath between strokes as it lifts
        const dur = Math.max(0.12, lens[i] / 1500), o = { v: 0 };
        tl.to(o, {
          v: 1, duration: dur, ease: i === 0 ? 'power1.inOut' : 'power1.out',
          onUpdate: () => {
            p.style.strokeDashoffset = lens[i] * (1 - o.v);
            const pt = p.getPointAtLength(lens[i] * o.v);
            tip.setAttribute('cx', pt.x); tip.setAttribute('cy', pt.y);
          },
        }, i === 0 ? 0.1 : '+=0.14');
      });
      tl.to(tip, { opacity: 0, duration: 0.5 })
        .add(() => sig.classList.remove('is-hot'), '-=0.3')        // the gold cools to its resting colour
        .to(cap, { autoAlpha: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.5');
    }, 'top 82%');
  }

  // one pass of heat across lit text; gold text stays gold
  const tone = (p) => { if (p.closest('.gold') || (p.children.length === 1 && p.firstElementChild.classList.contains('gold'))) p.classList.add('fx-gold'); };
  const pass = (owner, ps, long) => {
    if (owner._fxBusy) return;
    owner._fxBusy = true;
    ps.forEach((p) => p.classList.add('fx-heatpass'));
    gsap.fromTo(ps, { '--p': '-20%' }, {
      '--p': '125%', duration: long ? T.hoverWords : T.hover, ease: 'power2.inOut', stagger: long ? T.hoverWordGap : T.hoverGap,
      onComplete: () => { ps.forEach((p) => { p.classList.remove('fx-heatpass'); p.style.removeProperty('--p'); }); owner._fxBusy = false; },
    });
  };

  /* ---------- Menu links ---------- */
  if (fine) {
    $$('.menu ul a').forEach((a) => {
      const word = a.querySelector('b');
      if (!word) return;
      word.classList.add('fx-gold');   // a hovered menu link is gold, so the heat settles to gold
      a.addEventListener('pointerenter', () => pass(a, [word], false));
    });
  }

  /* ---------- Headings (after forge.js has split them into lines) ---------- */
  const headings = () => {
    const parts = (el) => $$('.line-mask > span, .word-mask > span', el);

    // every main heading comes out of the dark under a pass of heat (instead of sliding up)
    $$('[data-lines]').forEach((el) => {
      if (el._fx) return;
      const ps = parts(el);
      if (!ps.length) return;
      el._fx = true; el._fxBusy = true;
      gsap.killTweensOf(ps);
      gsap.set(ps, { yPercent: 0, clearProps: 'transform' });
      ps.forEach((p) => { tone(p); p.classList.add('fx-heatline'); });
      const words = ps.length > 6;
      onArrive(el, () => {
        gsap.fromTo(ps, { '--p': '-25%' }, {
          '--p': '130%', duration: words ? T.revealWords : T.reveal, ease: 'power2.inOut', stagger: words ? T.revealWordGap : T.revealGap,
          onComplete: () => { ps.forEach((p) => p.classList.remove('fx-heatline')); el._fxBusy = false; },
        });
      });
    });

  };
  // forge.js splits headings during its own start-up; wait until that has happened
  let tries = 0;
  const wait = () => {
    if (document.querySelector('.line-mask, .word-mask') || tries++ > 40) { headings(); ScrollTrigger.refresh(); return; }
    setTimeout(wait, 80);
  };
  if (document.readyState === 'complete') wait(); else addEventListener('load', wait);
})();
