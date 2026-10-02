/* =====================================================================
   THE FOUNDRY · motion posters
   Turns a still poster into a studio-style motion poster: a slow camera push and drift with real depth
   (from a depth map made offline with Depth Anything V2), breathing light, and an atmosphere written for
   each poster. Plain WebGL, no libraries. Loaded only when a motion poster is opened.

   Each poster needs foundry/img/motion/<file>.webp (R = depth, near is bright; G = effect mask) and an
   entry in POSTERS below. Text was flattened into rigid planes when the map was made, so it never warps.
   ===================================================================== */
(() => {
  'use strict';

  const POSTERS = {
    // Kalki 2898 AD: desert light. The halo's bulbs breathe, sand blows low across the dunes,
    // dust rolls through the lower third, heat shimmers on the far sand, a few embers rise around the hero.
    'kalki-main-01': {
      focus: 0.42, strength: 0.015, push: 0.05,
      light: [1.0, 0.76, 0.46],
      bulbs: 0.6,
      haze: { from: 0.56, to: 1.0, amount: 0.2, speed: 0.03, color: [0.95, 0.72, 0.46] },
      shimmer: { from: 0.58, amount: 0.0018 },
      particles: [
        { kind: 'sand', count: 240, speed: 0.085, y0: 0.6, y1: 0.99, color: [1.0, 0.86, 0.64], blend: 'add' },
        { kind: 'ember', count: 42, speed: 0.05, y0: 0.16, y1: 0.8, x0: 0.16, x1: 0.84, color: [1.0, 0.58, 0.22], blend: 'add' },
      ],
    },
    // Leo: a snowstorm. Snow falls in three depths with gusts of wind, mist drifts through the forest,
    // and a slow glint of light crosses the wax seal.
    'leo-main-01': {
      focus: 0.45, strength: 0.015, push: 0.05,
      light: [0.86, 0.94, 1.0],
      glint: { cx: 0.5005, cy: 0.4075, every: 7.5, amount: 0.55 },
      mist: { from: 0.4, to: 0.84, amount: 0.24, speed: 0.018, color: [0.92, 0.96, 1.0] },
      particles: [
        { kind: 'snow', count: 460, speed: 0.05, wind: 0.01, gust: 0.03, color: [0.98, 0.99, 1.0], blend: 'alpha' },
      ],
    },
  };

  const LOOP = 12;      // seconds: one push in and out
  const RAMP = 2.6;     // seconds from still to full motion

  const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg, uMap;
uniform vec2 uRes;
uniform float uTime, uAmt, uFocus, uZoom, uSteps;
uniform vec3 uCam;
uniform vec3 uLight;
uniform float uBulbs;
uniform vec4 uHaze; uniform vec3 uHazeCol;
uniform vec2 uShimmer;
uniform vec4 uGlint;
uniform vec4 uMist; uniform vec3 uMistCol;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.1, 9.3); a *= 0.5; } return v; }

void main() {
  vec2 base = 0.5 + (vUv - 0.5) / uZoom;

  // Heat shimmer over the far sand only.
  if (uShimmer.y > 0.0) {
    float far = 1.0 - texture2D(uMap, base).r;
    float m = smoothstep(uShimmer.x, uShimmer.x + 0.08, base.y) * far * far;
    base.x += (noise(vec2(base.x * 38.0, base.y * 85.0 - uTime * 2.6)) - 0.5) * uShimmer.y * m * uAmt;
  }

  // Parallax by ray marching the depth from near to far, so near objects cover what is behind them.
  vec2 dir = uCam.xy + (base - 0.5) * uCam.z;
  float stepH = 1.0 / uSteps;
  float h = 1.0;
  vec2 p = base - dir * (h - uFocus);
  float d = texture2D(uMap, p).r;
  float ph = h, pd = d;
  for (int i = 0; i < 24; i++) {
    if (float(i) >= uSteps || d >= h) break;
    ph = h; pd = d;
    h -= stepH;
    p = base - dir * (h - uFocus);
    d = texture2D(uMap, p).r;
  }
  float a = pd - ph, b = d - h;
  float hh = mix(ph, h, clamp(a / (a - b - 1e-5), 0.0, 1.0));
  p = clamp(base - dir * (hh - uFocus), vec2(0.0008), vec2(0.9992));

  vec4 map = texture2D(uMap, p);
  vec3 col = texture2D(uImg, p).rgb;
  float depth = map.r;

  // Halo bulbs: each one breathes on its own rhythm, with a soft bloom around it.
  if (uBulbs > 0.0) {
    vec2 cell = floor(p * vec2(26.0, 37.0));
    float tw = 0.5 + 0.5 * sin(uTime * (0.9 + hash(cell) * 1.4) + hash(cell + 3.1) * 6.2831);
    float glow = 0.0;
    for (int k = 0; k < 8; k++) {
      float ang = float(k) * 0.7854;
      glow += texture2D(uMap, p + vec2(cos(ang), sin(ang) * uRes.x / uRes.y) * 0.014).g;
    }
    glow /= 8.0;
    col += uLight * (map.g * (0.12 + 0.3 * tw) + glow * (0.16 + 0.3 * tw)) * uBulbs * uAmt;
  }

  // A glint of light crossing the seal now and then.
  if (uGlint.w > 0.0) {
    float t = fract(uTime / uGlint.z);
    float sweep = t * 3.2 - 1.0;
    vec2 q = (p - uGlint.xy) * vec2(uRes.x / uRes.y, 1.0) * 9.0;
    float x = dot(q, normalize(vec2(1.0, -0.75))) * 0.5 + 0.5;
    float band = exp(-pow((x - sweep) * 6.0, 2.0));
    col += vec3(1.0, 0.88, 0.82) * band * map.g * uGlint.w * uAmt;
  }

  // Mist through the forest: only in its band, and mostly in the distance.
  if (uMist.z > 0.0) {
    float m = smoothstep(uMist.x, uMist.x + 0.1, p.y) * (1.0 - smoothstep(uMist.y - 0.12, uMist.y, p.y));
    float f = smoothstep(0.38, 0.86, fbm(vec2(p.x * 2.6 + uTime * uMist.w, p.y * 6.5 - uTime * uMist.w * 0.4)));
    float far = 1.0 - smoothstep(0.3, 0.72, depth);
    col = mix(col, uMistCol, f * m * far * uMist.z * uAmt);
  }

  // Dust rolling low across the dunes (screen blend, so it lightens like real haze).
  if (uHaze.z > 0.0) {
    float m = smoothstep(uHaze.x, uHaze.x + 0.12, p.y);
    float f = smoothstep(0.32, 0.9, fbm(vec2(p.x * 2.2 - uTime * uHaze.w, p.y * 5.0 + uTime * uHaze.w * 0.3)));
    vec3 dust = uHazeCol * f * m * uHaze.z * (1.0 - depth * 0.45) * uAmt;
    col = 1.0 - (1.0 - col) * (1.0 - dust);
  }

  // Breathing light and a slow sweep of light across the poster.
  col *= 1.0 + 0.022 * sin(uTime * 0.698) * uAmt;
  float sw = fract(uTime / 14.0) * 2.6 - 0.8;
  float lx = dot(vUv, normalize(vec2(1.0, 0.6)));
  col += uLight * exp(-pow((lx - sw) * 3.0, 2.0)) * 0.04 * uAmt;

  gl_FragColor = vec4(col, 1.0);
}`;

  const PVERT = `
attribute vec4 aSeed;
uniform float uTime, uAmt, uKind, uScale, uFocus, uZoom;
uniform vec3 uCam;
uniform vec4 uP1, uP2;
varying float vA, vSoft, vKind;
void main() {
  vKind = uKind;
  float z = aSeed.z;
  vec2 pos; float size; float a;
  if (uKind < 0.5) {
    float gust = 0.5 + 0.5 * sin(uTime * 0.21 + 1.7) * sin(uTime * 0.53);
    float wind = uP1.y + uP1.z * gust;
    pos.y = fract(aSeed.y + uTime * uP1.x * (0.35 + 0.95 * z));
    pos.x = fract(aSeed.x + uTime * wind * (0.4 + z) + sin(uTime * (0.6 + aSeed.w) + aSeed.w * 30.0) * 0.012 * (1.0 + z));
    size = mix(1.4, 13.0, z * z * z);
    a = mix(0.35, 0.9, smoothstep(0.0, 0.5, z)) * (1.0 - 0.55 * smoothstep(0.82, 1.0, z));
    vSoft = smoothstep(0.7, 1.0, z);
  } else if (uKind < 1.5) {
    pos.x = fract(aSeed.x - uTime * uP1.x * (0.5 + z));
    pos.y = uP1.y + aSeed.y * (uP1.z - uP1.y) + sin(uTime * 1.3 + aSeed.w * 40.0) * 0.006;
    size = mix(3.0, 9.0, z);
    a = mix(0.12, 0.42, z) * smoothstep(0.0, 0.08, pos.x) * (1.0 - smoothstep(0.92, 1.0, pos.x));
    vSoft = 0.0;
  } else {
    float life = fract(aSeed.y + uTime * uP1.x * (0.6 + aSeed.w));
    pos.y = uP1.z - life * (uP1.z - uP1.y);
    pos.x = uP2.x + aSeed.x * (uP2.y - uP2.x) + sin(uTime * 1.7 + aSeed.w * 20.0) * 0.02 + life * 0.04 * (aSeed.w - 0.5);
    size = mix(2.0, 5.5, z);
    a = sin(life * 3.14159) * (0.55 + 0.45 * sin(uTime * 11.0 + aSeed.w * 50.0));
    vSoft = 0.3;
  }
  vec2 dir = uCam.xy + (pos - 0.5) * uCam.z;
  pos = 0.5 + (pos + dir * (z - uFocus) * 1.25 - 0.5) * uZoom;
  gl_Position = vec4(pos.x * 2.0 - 1.0, 1.0 - pos.y * 2.0, 0.0, 1.0);
  gl_PointSize = size * uScale;
  vA = a * uAmt;
}`;

  const PFRAG = `
precision mediump float;
varying float vA, vSoft, vKind;
uniform vec3 uCol;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = (vKind > 0.5 && vKind < 1.5) ? c.x * c.x * 3.6 + c.y * c.y * 60.0 : dot(c, c) * 4.0;
  float edge = mix(0.55, 0.0, vSoft);
  float a = (1.0 - smoothstep(edge, 1.0, r)) * vA;
  gl_FragColor = vec4(uCol * a, a);
}`;

  const KIND = { snow: 0, sand: 1, ember: 2 };

  function compile(gl, vs, fs) {
    const make = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
    return { p, u };
  }

  const loadImage = src => new Promise((res, rej) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => res(im);
    im.onerror = () => rej(new Error('image ' + src));
    im.src = src;
  });

  function texture(gl, unit, img) {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  // Deterministic seeds, so a poster's snow falls the same way every visit.
  function seeds(count, salt) {
    let s = 2166136261 ^ salt;
    const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
    const out = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) { out[i * 4] = rnd(); out[i * 4 + 1] = rnd(); out[i * 4 + 2] = Math.pow(rnd(), 1.6); out[i * 4 + 3] = rnd(); }
    return out;
  }

  /* mount(host, item) → Promise<controller | null>
     host: the element the poster image sits in. The canvas fades in over the still image once the first
     frame (identical to the still) is drawn, then eases into motion. Any failure leaves the still poster. */
  async function mount(host, item) {
    const cfg = POSTERS[item.key];
    if (!cfg) return null;
    const canvas = document.createElement('canvas');
    canvas.className = 'pm-motion';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) return null;

    let img, map;
    try { [img, map] = await Promise.all([loadImage(item.src), loadImage(`img/motion/${item.key}.webp`)]); }
    catch (_) { return null; }
    if (!host.isConnected) return null;

    let main, part;
    try { main = compile(gl, VERT, FRAG); part = compile(gl, PVERT, PFRAG); }
    catch (e) { console.warn('[motion]', e.message); return null; }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    texture(gl, 0, img);
    texture(gl, 1, map);

    const coarse = matchMedia('(pointer: coarse)').matches;
    const systems = (cfg.particles || []).map((p, i) => {
      const count = Math.round(p.count * (coarse ? 0.55 : 1));
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, seeds(count, i * 7919 + item.key.length), gl.STATIC_DRAW);
      const p1 = p.kind === 'snow' ? [p.speed, p.wind, p.gust, 0] : [p.speed, p.y0, p.y1, 0];
      const p2 = [p.x0 || 0, p.x1 || 1, 0, 0];
      return { ...p, count, buf, p1, p2 };
    });

    // Quality: fewer depth steps and pixels on phones; drops a notch if frames run slow.
    let steps = coarse ? 10 : 16;
    let scale = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const size = () => {
      const r = host.getBoundingClientRect();
      const w = host.offsetWidth || r.width, h = host.offsetHeight || r.height;
      let s = scale;
      if (w * h * s * s > 2.4e6) s = Math.sqrt(2.4e6 / (w * h));
      canvas.width = Math.max(2, Math.round(w * s));
      canvas.height = Math.max(2, Math.round(h * s));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const gloss = host.querySelector('.pm-gloss');
    host.insertBefore(canvas, gloss || null);
    size();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(size) : null;
    if (ro) ro.observe(host);

    // Pointer (and phone tilt where the browser allows it without asking).
    let tx = 0, ty = 0, px = 0, py = 0;
    const onTilt = e => {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    };
    const canTilt = coarse && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function';
    if (canTilt) addEventListener('deviceorientation', onTilt);

    let raf = 0, last = 0, time = 0, ramp = 0, alive = true, paused = false, frames = 0, slow = 0, shown = false;
    const draw = now => {
      raf = 0;
      if (!alive) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      time += dt; ramp += dt;
      if (frames < 120 && dt) { frames++; if (dt > 0.024) slow++; if (frames === 60 && slow > 30 && steps > 8) { steps -= 4; scale *= 0.8; size(); } }

      const amt = (() => { const x = Math.min(1, ramp / RAMP); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; })();
      px += (tx - px) * 0.05; py += (ty - py) * 0.05;
      const ph = time / LOOP * Math.PI * 2;
      const push = 0.5 - 0.5 * Math.cos(ph);
      const camX = (Math.sin(ph) * 0.6 + px * 0.55) * cfg.strength * amt;
      const camY = (Math.sin(ph * 0.5 + 1.3) * 0.35 + py * 0.45) * cfg.strength * amt;
      const camZ = cfg.push * push * amt;
      const zoom = 1 + amt * 0.006 * push; // the push is a dolly in depth, not a zoom: the poster's edges stay where they were designed

      gl.disable(gl.BLEND);
      gl.useProgram(main.p);
      const u = main.u;
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      const loc = gl.getAttribLocation(main.p, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1i(u.uImg, 0); gl.uniform1i(u.uMap, 1);
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, time); gl.uniform1f(u.uAmt, amt);
      gl.uniform1f(u.uFocus, cfg.focus); gl.uniform1f(u.uZoom, zoom); gl.uniform1f(u.uSteps, steps);
      gl.uniform3f(u.uCam, camX, camY, camZ);
      gl.uniform3fv(u.uLight, cfg.light);
      gl.uniform1f(u.uBulbs, cfg.bulbs || 0);
      const hz = cfg.haze; gl.uniform4f(u.uHaze, hz ? hz.from : 0, hz ? hz.to : 0, hz ? hz.amount : 0, hz ? hz.speed : 0);
      gl.uniform3fv(u.uHazeCol, hz ? hz.color : [0, 0, 0]);
      const sh = cfg.shimmer; gl.uniform2f(u.uShimmer, sh ? sh.from : 0, sh ? sh.amount : 0);
      const gt = cfg.glint; gl.uniform4f(u.uGlint, gt ? gt.cx : 0, gt ? gt.cy : 0, gt ? gt.every : 1, gt ? gt.amount : 0);
      const ms = cfg.mist; gl.uniform4f(u.uMist, ms ? ms.from : 0, ms ? ms.to : 0, ms ? ms.amount : 0, ms ? ms.speed : 0);
      gl.uniform3fv(u.uMistCol, ms ? ms.color : [0, 0, 0]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.disableVertexAttribArray(loc);

      if (systems.length && amt > 0.001) {
        gl.useProgram(part.p);
        const q = part.u;
        const sl = gl.getAttribLocation(part.p, 'aSeed');
        gl.enable(gl.BLEND);
        gl.uniform1f(q.uTime, time); gl.uniform1f(q.uAmt, amt);
        gl.uniform1f(q.uScale, canvas.height / 900);
        gl.uniform1f(q.uFocus, cfg.focus); gl.uniform1f(q.uZoom, zoom);
        gl.uniform3f(q.uCam, camX, camY, camZ);
        for (const s of systems) {
          gl.blendFunc(gl.ONE, s.blend === 'add' ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA);
          gl.bindBuffer(gl.ARRAY_BUFFER, s.buf);
          gl.enableVertexAttribArray(sl);
          gl.vertexAttribPointer(sl, 4, gl.FLOAT, false, 0, 0);
          gl.uniform1f(q.uKind, KIND[s.kind]);
          gl.uniform4fv(q.uP1, s.p1); gl.uniform4fv(q.uP2, s.p2);
          gl.uniform3fv(q.uCol, s.color);
          gl.drawArrays(gl.POINTS, 0, s.count);
        }
        gl.disableVertexAttribArray(sl);
      }

      if (!shown) { shown = true; requestAnimationFrame(() => canvas.classList.add('is-on')); }
      if (!paused && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const start = () => { if (!raf && alive && !paused && !document.hidden) { last = 0; raf = requestAnimationFrame(draw); } };
    const onVis = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else start(); };
    document.addEventListener('visibilitychange', onVis);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); destroy(); });

    function destroy() {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      if (canTilt) removeEventListener('deviceorientation', onTilt);
      if (ro) ro.disconnect();
      const lose = gl.getExtension('WEBGL_lose_context');
      canvas.remove();
      if (lose) lose.loseContext();
    }

    raf = requestAnimationFrame(draw);
    return {
      canvas,
      pointer(x, y) { if (!canTilt) { tx = x; ty = y; } },
      pause(on) {
        paused = !!on;
        canvas.classList.toggle('is-on', !paused);
        if (paused) { cancelAnimationFrame(raf); raf = 0; } else { ramp = 0; start(); } // ease back in from the still
      },
      destroy,
    };
  }

  window.FoundryMotion = { has: key => !!POSTERS[key], mount };
})();
