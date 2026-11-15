/* FORGE Studio · motion switch
   Some computers ask every website for less motion (on Windows: Settings, Accessibility, Visual effects,
   "Animation effects" off). The site respects that and shows its still version. This file gives those visitors
   the choice back: a small prompt and a footer link that turn the animation on, and off again.

   The choice is kept in localStorage as "forge-motion": "on" = play the animation anyway, "asked" = the prompt
   was closed. The script in each page's <head> reads it before the first paint and sets one of two classes on
   <html>: "motion-ask" (still version, offer the switch) or "motion-forced" (animated because they asked).
   Computers that allow motion get neither class, and this file does nothing. Used by every page and the Foundry. */
(() => {
  const root = document.documentElement;
  const still = root.classList.contains('motion-ask'), forced = root.classList.contains('motion-forced');
  if (!still && !forced) return;

  const KEY = 'forge-motion';
  let stored = null;
  try { stored = localStorage.getItem(KEY); localStorage.setItem(KEY + '-test', '1'); localStorage.removeItem(KEY + '-test'); }
  catch (e) { return; }   // no storage, so a choice could not be kept: offer nothing

  const set = (on) => {
    try { localStorage.setItem(KEY, on ? 'on' : 'asked'); } catch (e) { return; }
    // Start again from the top, so turning it on opens with the forging of the mark.
    try { history.scrollRestoration = 'manual'; } catch (e) { /* older browsers reload in place */ }
    window.scrollTo(0, 0);
    location.reload();
  };

  const css = document.createElement('style');
  css.textContent = `
.motion-bar { position: fixed; z-index: 105; left: 20px; bottom: 20px; display: flex; align-items: center; gap: 14px;
  padding: 10px 10px 10px 18px; border-radius: 999px; border: 1px solid rgba(244, 239, 230, .2);
  background: rgba(10, 9, 8, .86); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  font-size: 14px; font-weight: 500; line-height: 1.3; color: #F4EFE6; box-shadow: 0 10px 40px rgba(0, 0, 0, .35); }
.motion-bar.is-top { left: 50%; bottom: auto; top: 84px; transform: translateX(-50%); white-space: nowrap; }
.motion-bar p { margin: 0; }
.motion-bar button { font: inherit; border: 0; cursor: pointer; flex: none; }
.motion-yes { height: 36px; padding: 0 16px; border-radius: 999px; background: #FFC247; color: #0A0908; font-weight: 600; }
.motion-no { width: 36px; height: 36px; border-radius: 50%; background: none; border: 1px solid rgba(244, 239, 230, .2) !important; color: #A8A196; font-size: 18px; line-height: 1; }
.motion-yes:focus-visible, .motion-no:focus-visible, .motion-link:focus-visible { outline: 2px solid #FFC247; outline-offset: 3px; }
.motion-link { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
html.pm-open .motion-bar, html.ix-open .motion-bar, .menu-open .motion-bar { display: none; }
@media (max-width: 760px) {
  .motion-bar, .motion-bar.is-top { left: 12px; right: 12px; bottom: 12px; top: auto; transform: none; white-space: normal; justify-content: space-between; }
  .motion-bar p { flex: 1; }
}
@media print { .motion-bar, .motion-link { display: none; } }`;
  document.head.appendChild(css);

  // The prompt: only on the still version, and only until it is answered once.
  if (still && stored !== 'asked') {
    const bar = document.createElement('div');
    bar.className = 'motion-bar' + (window.FOUNDRY ? ' is-top' : '');
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Animation');
    bar.innerHTML = '<p>Animation is off on this computer.</p>'
      + '<button class="motion-yes" type="button">Turn it on</button>'
      + '<button class="motion-no" type="button" aria-label="Keep the animation off">&times;</button>';
    bar.querySelector('.motion-yes').addEventListener('click', () => set(true));
    bar.querySelector('.motion-no').addEventListener('click', () => {
      try { localStorage.setItem(KEY, 'asked'); } catch (e) { /* asked again next visit */ }
      bar.remove();
    });
    document.body.appendChild(bar);
  }

  // The footer link stays, so the choice can always be changed.
  const foot = document.querySelector('.foot-bottom') || document.querySelector('.ix-foot p:last-child');
  if (foot) {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'motion-link';
    link.textContent = forced ? 'Turn animation off' : 'Turn animation on';
    link.addEventListener('click', () => set(!forced));
    foot.appendChild(link);
  }
})();
