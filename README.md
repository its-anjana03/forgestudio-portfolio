# FORGE Studio · Thinura Anjana

Portfolio of **Thinura Anjana**: cinematic posters, brand identity, campaigns and UI/UX.
Live at **https://forgestudio.web.lk**

A static site (plain HTML, CSS and JavaScript, no build step) hosted on GitHub Pages.

## Structure

```
/
├── index.html                         Home: forge hero, archive, work, practice, mark, about, contact
├── resume.html                        Web resume
├── joey-mobile-case-study.html        Case 01 · Joey Clothing (UX)
├── vijayism-piece.html                Case 02 · 30 Years of Vijayism (with the hidden-details hunt)
├── seylune-frontend-case-study.html   Case 03 · Seylune (frontend)
├── avengers-process.html              Case 04 · Avengers: Doomsday (with before/after slider)
├── rolex-design.html                  Case 05 · Rolex Day-Date 40
├── forge-identity.html                Case 06 · FORGE Studio identity
├── 404.html                           Branded "page not found"
├── assets/
│   ├── css/forge.css                  The whole design system (one stylesheet)
│   ├── js/forge.js                    All motion and interaction (one script)
│   ├── img/                           Optimised WebP images, grouped by project
│   │   ├── thumb/                     640px poster thumbnails for the archive wall
│   │   ├── og/                        1200x630 social share cards
│   │   └── forge-mark.svg             The FORGE mark (also the favicon)
│   └── video/thanthi-tv-vijayism.mp4  Thanthi TV broadcast clip
├── files/Thinura-Anjana-Resume-2026.pdf
├── CNAME                              Custom domain: forgestudio.web.lk
├── .nojekyll                          Serve files as-is on GitHub Pages
├── robots.txt, sitemap.xml            Search engines
```

## Brand system

| Token | Value |
|---|---|
| Heated Gold | `#FFC247` |
| Ember Orange | `#FF8A00` |
| Forged Steel | `#2B2B2B` |
| Typeface | General Sans (Fontshare) |

Gradients appear only inside the mark, never on text.

## Libraries (loaded from CDNs, nothing to install)

- [GSAP 3.12 + ScrollTrigger](https://gsap.com) for animation
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- [General Sans](https://www.fontshare.com/fonts/general-sans) from Fontshare

Everything degrades gracefully: with JavaScript off, a blocked CDN, or "reduce motion" turned on,
every page shows its full content as a static layout.

## Features

- Forge hero: the mark welds itself, heats, takes three hammer strikes and opens onto the poster archive
- Optional anvil sound (synthesised in the browser, off by default, remembered per visitor)
- Shareable poster links, e.g. `https://forgestudio.web.lk/#poster-leo`
- Commission brief builder that composes a ready-to-send email (nothing is stored)
- Copy-email buttons, page transitions, hidden-details hunt, before/after slider
- Social share cards for every page

## Analytics (optional)

The site is ready for [GoatCounter](https://www.goatcounter.com): free, no cookies, no consent banner.

1. Create a free account at goatcounter.com and choose a site code (for example `forgestudio`).
2. Open `assets/js/forge.js` and set `const GOATCOUNTER = 'forgestudio';` near the top.
3. Push. Page views, plus events (poster views, shares, brief sends, email copies, detail hunt completions), appear in your dashboard.

It stays off on `localhost`, so local testing never counts.

## Run locally

Any static server works, for example the VS Code **Live Server** extension, or:

```bash
npx serve .
```

## Deploy (GitHub Pages)

1. Push this folder to the root of a GitHub repository.
2. Repository **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Keep the `CNAME` file so the site stays on `forgestudio.web.lk`. Tick **Enforce HTTPS** once the certificate is issued.

## Updating content

- **New poster:** add a 1200px WebP to `assets/img/` and a 640px one to `assets/img/thumb/`, add a `<button class="poster" data-lb="N">` to the archive wall in `index.html`, and add `['Title', year, 'file-name']` to the `POSTERS` list at the top of `assets/js/forge.js`.
- **Text:** edit the HTML directly. Every page uses the same shared stylesheet and script.
- **Resume PDF:** replace `files/Thinura-Anjana-Resume-2026.pdf` (keep the same file name).

© 2026 FORGE Studio · Thinura Anjana
