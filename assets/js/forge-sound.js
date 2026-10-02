/* =====================================================================
   FORGE · sound
   Cinematic music with a different mood on each part of the site, and soft cinematic impacts
   for the hero's hammer strikes. Off by default; the visitor's choice is remembered across pages.

   Three tracks (assets/audio/<name>.mp3, from Pixabay Music, free for websites):
     home     · Dark Cinematic Thriller (leberch)             index, 404
     foundry  · Dramatic Cinematic Documentary (musicdream)   foundry/
   Moving between pages: a soft whoosh as the music leaves, a soft bloom as the next page's music arrives.
     work     · Dark (leberch)                                every case study, resume

   Browsers only allow sound after a click or tap on the page, so when sound is on and a new page
   opens, its music starts on the first click or tap (the switch glows until then).
   ===================================================================== */
(() => {
  'use strict';
  if (window.ForgeSound) return;

  // Kept deliberately subtle. Each gain also evens out the tracks' own loudness (measured: the documentary
  // track is about 2.7 dB louder than the others), and a soft compressor keeps the peaks down.
  const LEVEL = 0.24;
  const MOODS = {
    home: { gain: LEVEL * 0.92 },     // Dark Cinematic Thriller (leberch)
    foundry: { gain: LEVEL * 0.73 },  // Dramatic Cinematic Documentary (musicdream)
    work: { gain: LEVEL },            // Dark (leberch)
  };
  const path = location.pathname.toLowerCase();
  const pick = [
    [/\/foundry\//, 'foundry'],
    [/vijayism|avengers|rolex|forge-identity|joey|seylune|resume/, 'work'],
    [/.*/, 'home'],
  ].find(([re]) => re.test(path));
  const mood = pick[1];
  const level = MOODS[mood].gain * (pick[2] || 1);
  const me = document.currentScript;
  const src = new URL(`../audio/${mood}.mp3`, me ? me.src : location.href).href;
  const isHome = !!document.querySelector('.ignite');

  const XFADE = 4;            // seconds of crossfade at the loop point
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} },
  };
  let on = store.get('forge-sound') === 'on';
  let ctx = null, master = null, musicBus = null, impactBus = null, verb = null;
  let players = [], active = 0, crossing = false, hasTrack = null, waiting = false, playing = false;
  // Did the visitor just come from another page of the site? Then the music arrives with a soft bloom.
  let arriving = false;
  try {
    const t = +sessionStorage.getItem('forge-sound-arrive');
    arriving = !!t && Date.now() - t < 15000;
    sessionStorage.removeItem('forge-sound-arrive');
  } catch (_) {}

  /* ---------- audio graph ---------- */
  function ensureCtx() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0;
    // Soft compression: the quiet passages stay audible, the big ones never swell into the foreground.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -26; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.08; comp.release.value = 0.8;
    musicBus.connect(comp); comp.connect(master);
    impactBus = ctx.createGain(); impactBus.gain.value = 0.9; impactBus.connect(master);
    // A long, dark room for the impacts: decaying noise as an impulse response.
    verb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 3.2), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    verb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    verb.connect(wet); wet.connect(impactBus);
    return ctx;
  }
  function ramp(param, to, sec) {
    const t = ctx.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(to, t + Math.max(0.01, sec));
  }
  function makePlayer() {
    const el = new Audio();
    el.preload = 'auto';
    el.src = src;
    el.crossOrigin = 'anonymous';
    const g = ctx.createGain(); g.gain.value = 0;
    ctx.createMediaElementSource(el).connect(g);
    g.connect(musicBus);
    el.addEventListener('timeupdate', () => loopCheck(el));
    // Safety net when the length is unknown (no crossfade possible): start again, softly, when it ends.
    el.addEventListener('ended', () => {
      const cur = players[active];
      if (!cur || cur.el !== el || crossing || !playing) return;
      el.currentTime = 0;
      ramp(cur.g.gain, 0, 0.01);
      el.play().then(() => ramp(cur.g.gain, 1, 3)).catch(() => {});
    });
    return { el, g };
  }

  /* ---------- music ---------- */
  function resumePoint() {
    try {
      const s = JSON.parse(sessionStorage.getItem('forge-music') || 'null');
      if (s && s.mood === mood && Date.now() - s.at < 30 * 60 * 1000) return s.t || 0;
    } catch (_) {}
    return 0;
  }
  function savePoint() {
    const p = players[active];
    if (!p || !playing) return;
    try { sessionStorage.setItem('forge-music', JSON.stringify({ mood, t: p.el.currentTime || 0, at: Date.now() })); } catch (_) {}
  }
  function startMusic() {
    if (!on || playing || hasTrack === false || !ensureCtx()) return;
    if (!players.length) { players = [makePlayer(), makePlayer()]; active = 0; }
    const p = players[active];
    const t0 = resumePoint();
    const go = () => {
      ctx.resume().then(() => p.el.play()).then(() => {
        playing = true; waiting = false; paint();
        ramp(p.g.gain, 1, 0.01);
        ramp(musicBus.gain, level, 2.8);
        if (arriving) { arriving = false; bloom(); }
      }).catch(() => { waiting = true; paint(); armGesture(); });
    };
    if (t0 && p.el.readyState < 1) p.el.addEventListener('loadedmetadata', () => { try { p.el.currentTime = Math.min(t0, Math.max(0, p.el.duration - XFADE - 1)); } catch (_) {} go(); }, { once: true });
    else { if (t0) try { p.el.currentTime = t0; } catch (_) {} go(); }
  }
  function stopMusic(sec = 0.8) {
    if (!ctx || !players.length) return;
    savePoint();
    ramp(musicBus.gain, 0, sec);
    playing = false;
    setTimeout(() => { if (!playing) players.forEach((p) => p.el.pause()); }, sec * 1000 + 60);
  }
  // Seamless loop: the other player starts from the top while this one fades out.
  function loopCheck(el) {
    const cur = players[active];
    if (!cur || el !== cur.el || crossing || !el.duration || !isFinite(el.duration)) return;
    if (el.currentTime < el.duration - XFADE) return;
    crossing = true;
    const next = players[1 - active];
    next.el.currentTime = 0;
    next.el.play().then(() => {
      ramp(next.g.gain, 1, XFADE);
      ramp(cur.g.gain, 0, XFADE);
      setTimeout(() => { cur.el.pause(); active = 1 - active; crossing = false; }, XFADE * 1000 + 100);
    }).catch(() => { crossing = false; });
  }
  let armed = false;
  function armGesture() {
    if (armed) return;
    armed = true;
    const fire = () => {
      ['pointerdown', 'keydown', 'touchstart'].forEach((e) => removeEventListener(e, fire, true));
      armed = false;
      if (on) startMusic();
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach((e) => addEventListener(e, fire, { capture: true, passive: true }));
  }

  /* ---------- impacts: deep, soft, cinematic (no metal) ---------- */
  let duckT = 0;
  function impact(power = 1) {
    if (!on || !ensureCtx() || ctx.state !== 'running') return;
    const t = ctx.currentTime, big = power > 1;
    const out = ctx.createGain(); out.gain.value = Math.min(1.2, 0.55 * power); out.connect(impactBus); out.connect(verb);
    // Sub drop: a falling sine, the felt part of a trailer hit.
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(big ? 72 : 88, t);
    o.frequency.exponentialRampToValueAtTime(big ? 27 : 34, t + (big ? 1.6 : 1.1));
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(1, t + 0.015);
    og.gain.exponentialRampToValueAtTime(0.0001, t + (big ? 2.8 : 2));
    o.connect(og); og.connect(out); o.start(t); o.stop(t + 3);
    // Body: dark filtered noise with a slow tail.
    const len = Math.floor(ctx.sampleRate * 2.2), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), ng = ctx.createGain();
    n.buffer = buf; lp.type = 'lowpass'; lp.frequency.setValueAtTime(big ? 520 : 380, t); lp.frequency.exponentialRampToValueAtTime(90, t + 1.4);
    ng.gain.setValueAtTime(0.0001, t); ng.gain.exponentialRampToValueAtTime(0.5, t + 0.01); ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    n.connect(lp); lp.connect(ng); ng.connect(out); n.start(t);
    // A soft high shimmer on the big strike, like air moving.
    if (big) {
      const s = ctx.createOscillator(), sg = ctx.createGain();
      s.type = 'triangle'; s.frequency.value = 196;
      sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.12, t + 0.4); sg.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
      s.connect(sg); sg.connect(verb); s.start(t); s.stop(t + 3.3);
    }
    // Duck the score under the hit, then let it breathe back.
    if (playing && musicBus) {
      clearTimeout(duckT);
      ramp(musicBus.gain, level * 0.55, 0.06);
      duckT = setTimeout(() => ramp(musicBus.gain, level, 1.4), 500);
    }
  }

  /* ---------- transitions between pages: a soft whoosh out, a soft bloom in ---------- */
  function noiseBuffer(sec) {
    const len = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
  // Leaving: air rushing past, rising and opening up, as the music fades.
  function whoosh() {
    if (!on || !ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noiseBuffer(0.9);
    bp.type = 'bandpass'; bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(260, t); bp.frequency.exponentialRampToValueAtTime(2400, t + 0.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.32); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    n.connect(bp); bp.connect(g); g.connect(impactBus); g.connect(verb);
    n.start(t); n.stop(t + 0.9);
  }
  // Arriving: a breath of air opening, with a faint warm fifth underneath, as the new music fades in.
  function bloom() {
    if (!on || !ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const n = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noiseBuffer(1.8);
    lp.type = 'lowpass'; lp.Q.value = 0.5;
    lp.frequency.setValueAtTime(180, t); lp.frequency.exponentialRampToValueAtTime(1400, t + 1.1);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    n.connect(lp); lp.connect(g); g.connect(verb);
    n.start(t); n.stop(t + 1.8);
    [[146.83, 0.05], [220, 0.035]].forEach(([f, a]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(a, t + 0.8); og.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      o.connect(og); og.connect(verb); og.connect(impactBus);
      o.start(t); o.stop(t + 2.7);
    });
  }

  /* ---------- the switch ---------- */
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'snd';
  btn.innerHTML = '<span class="snd-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="snd-label"></span><span class="snd-hint" aria-hidden="true"></span>';
  const label = btn.querySelector('.snd-label'), hint = btn.querySelector('.snd-hint');
  function paint() {
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Sound on. Turn sound off' : 'Sound off. Turn sound on');
    label.textContent = on ? 'Sound on' : 'Sound off';
    btn.classList.toggle('is-waiting', on && waiting);
    document.documentElement.classList.toggle('sound-on', on);
  }
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    on = !on;
    store.set('forge-sound', on ? 'on' : 'off');
    hideHint();
    if (on) { ensureCtx(); startMusic(); if (isHome) setTimeout(() => impact(0.7), 120); }
    else stopMusic(0.8);
    paint();
    window.dispatchEvent(new CustomEvent('forge:sound', { detail: { on } }));
  });
  function mount() {
    // A page can give the switch a home ([data-sound-slot], the Foundry's header); otherwise it sits in the
    // bottom-left corner, mirroring the heat meter on the right.
    const slot = document.querySelector('[data-sound-slot]');
    if (slot) slot.appendChild(btn);
    else { btn.classList.add('is-floating'); document.body.appendChild(btn); }
    paint();
  }
  function showHint() {
    if (store.get('forge-sound') || store.get('forge-sound-hint')) return;
    store.set('forge-sound-hint', '1');
    hint.textContent = 'Turn on sound for the full experience';
    btn.classList.add('has-hint');
    setTimeout(hideHint, 6500);
  }
  function hideHint() { btn.classList.remove('has-hint'); }

  /* ---------- leaving, hiding, coming back ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || !playing || a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname || !/(\.html|\/)$/.test(url.pathname)) return;
    whoosh();
    stopMusic(0.55);
    try { sessionStorage.setItem('forge-sound-arrive', String(Date.now())); } catch (_) {}
    // Pages with the heat-and-ink wipe (forge.js) already wait for it; elsewhere (the Foundry, 404) wait a moment
    // so the whoosh and the fade finish instead of being cut off.
    if (!document.querySelector('.pt')) {
      e.preventDefault();
      setTimeout(() => { location.href = url.href; }, 520);
    }
  });
  addEventListener('pagehide', () => savePoint());
  document.addEventListener('visibilitychange', () => {
    if (!on || !ctx) return;
    if (document.hidden) { if (playing) { stopMusic(0.4); playing = false; } }
    else startMusic();
  });
  setInterval(savePoint, 2000);

  /* ---------- start ---------- */
  function init() {
    // Is there a track for this mood? (Pages without one show no switch, except home, which has the impacts.)
    fetch(src, { method: 'HEAD' }).then((r) => { hasTrack = r.ok; }).catch(() => { hasTrack = false; }).then(() => {
      if (!hasTrack && !isHome) return;
      mount();
      if (on) { ensureCtx(); startMusic(); if (ctx && ctx.state !== 'running') { waiting = true; paint(); armGesture(); } }
      setTimeout(showHint, 2600);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.ForgeSound = {
    impact, mood, isOn: () => on,
    // For checking what is playing (console, tests).
    state: () => ({
      on, playing, waiting, hasTrack, crossing, ctx: ctx && ctx.state, active,
      t: players[active] ? +players[active].el.currentTime.toFixed(2) : 0,
      players: players.map((p) => [+p.el.currentTime.toFixed(2), +(p.el.duration || 0).toFixed(2), p.el.paused, +p.g.gain.value.toFixed(2)]),
      bus: musicBus ? +musicBus.gain.value.toFixed(3) : 0,
    }),
  };
})();
