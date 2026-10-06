/* FORGE Studio · STRIKE chapter transition (home page only)
   Sends the gold band across the word once, the first time it comes into view,
   and leaves a little heat rising off the letters behind it.
   Independent of the GSAP timelines on the page. */
(() => {
  'use strict';
  const chapter = document.querySelector('.strike-chapter');
  if (!chapter) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  const word = chapter.querySelector('.strike-word') || chapter;
  const haze = chapter.querySelector('.strike-haze');

  /* blur + rising displacement for the haze, sized to the word as it is drawn right now */
  const heat = () => {
    if (!haze) return;
    const fs = parseFloat(getComputedStyle(word).fontSize) || 200;
    const n = (v) => v.toFixed(4);
    chapter.insertAdjacentHTML('beforeend',
      '<svg class="strike-filter" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
      '<filter id="strike-heat" x="-3%" y="-40%" width="106%" height="150%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="' + n(9 / fs) + ' ' + n(5 / fs) + '" numOctaves="2" seed="7" result="n"/>' +
      '<feOffset in="n" dy="0" result="rise"><animate attributeName="dy" begin="indefinite" from="0" to="' + n(-fs * 0.35) + '" dur="5.5s" fill="freeze"/></feOffset>' +
      '<feGaussianBlur in="SourceGraphic" stdDeviation="' + n(fs * 0.014) + '" result="soft"/>' +
      '<feDisplacementMap in="soft" in2="rise" scale="' + n(fs * 0.07) + '" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter></svg>');
    const rise = chapter.querySelector('.strike-filter animate');
    if (rise && rise.beginElement) rise.beginElement();
    haze.addEventListener('animationend', (e) => {
      if (e.animationName !== 'strike-haze-life') return;
      chapter.classList.add('is-cooled');
      const svg = chapter.querySelector('.strike-filter');
      if (svg) svg.remove();
    });
  };

  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    heat();
    chapter.classList.add('is-struck');   // once per page load
    io.disconnect();
  }, { threshold: 0.45 });
  io.observe(word);
})();
