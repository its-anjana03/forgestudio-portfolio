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
├── foundry/                           The Foundry: the full collection on one endless wall (see below)
│   ├── index.html, foundry.css, foundry.js
│   ├── data.js                        Every work in the Foundry, in one list
│   ├── img/<part>/<id>/               1600px WebP for the premiere, 400px wall versions in thumb/
│   └── <source folders>/              Your original exports (kept out of git and the zip)
├── tools/foundry-images.js            Prepares new artwork for the Foundry (local only)
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
- Live furnace backdrop behind the mark: real-time WebGL fire and lit smoke, rising embers, and the mark's own
  30° construction grid with gold energy pulses. It flares on every strike and dies down as the mark breaks open
  (falls back to a still glow without WebGL, and to a static gradient with reduced motion)
- Optional anvil sound (synthesised in the browser, off by default, remembered per visitor)
- Shareable poster links, e.g. `https://forgestudio.web.lk/#poster-leo`
- Commission brief builder that composes a ready-to-send email (nothing is stored)
- Copy-email buttons, page transitions, hidden-details hunt, before/after slider
- Social share cards for every page

## The Foundry (`/foundry/`)

The portfolio shows the best work; the Foundry keeps everything, in two views (Instrument Serif and Instrument Sans):

- **The wall** (`#/`): every piece on one endless wall that drifts slowly and can be dragged in any direction
  (or moved with the scroll wheel, a trackpad or the arrow keys). Film posters, concept posters and each campaign's
  key art are hung in the middle, where visitors look first. Hovering lifts a piece and dims the rest; the filter
  dock narrows the wall to Film (`#/film`), Events (`#/events`), Concepts (`#/concepts`) or Social (`#/social`).
- **The premiere** (`#/<part>/<collection>`): choosing a piece flies it from the wall to the centre of the screen.
  The whole screen takes on the colours of the work, the collection's name stands behind it in giant outlined
  letters, and a filmstrip, the arrows, a swipe or the scroll wheel step through the collection and on into the
  next one. Tap the work to look closer. Closing flies it back to its place on the wall.
- **The index** (top right): every film, campaign and collection by name, with a preview on hover, plus the note
  on tribute work.

A short title opens the first visit of each session. With reduced motion there is no drift, flight or tilt;
everything simply fades.

- **Hidden on purpose:** it is not in the navigation. The only doors are inside the archive on the home page:
  the line under "The archive." once the archive opens, and "More in the Foundry" in the poster viewer, which
  goes straight to that film.
- **Shareable:** every collection and piece has its own link, e.g. `/foundry/#/film/leo` or
  `/foundry/#/film/avengers?p=avengers-alt-02`. Older links (`#/cinema/...`, `#/movies/...`, `#/campaigns/...`,
  `#/studio`, `#/harbour`, `#/vault`) still land in the right place.

### Waiting to be hung

More posters for Leo, Jana Nayagan, LIK, Kalki 2898 AD, Indian 2 and PS-1, and more concept posters, are on
another computer. Their premieres already say "More posters on the way". When the files are back, drop them
into the matching source folder (`foundry/Leo`, `foundry/Jananayagan`, `foundry/LIK`, `foundry/Kalki 2898 AD`,
`foundry/Indian 2`, `foundry/PS 1`, `foundry/30 Years of Vijayism` or a new concepts folder), ideally in
subfolders named after the groups (Main, Character, Alternate, Process), and process them as below.
Once a series is complete, remove its `more: true` in `foundry/data.js`.

### Adding work (one command, one paste)

One-time setup: install [Node.js](https://nodejs.org), then run `npm install` inside the `tools` folder.

1. Export the artwork to a folder (JPG, PNG, WebP or TIFF, any size). Folders inside `foundry/` are ignored by git.
2. From the repo root, run the tool with the image folder, the film or campaign id, and a name prefix:

   ```bash
   node tools/foundry-images.js "D:/Exports/Leo/Characters" movies/leo leo-character
   ```

   It writes `leo-character-01.webp`, `-02`... in two sizes (1600px for the premiere, 400px for the wall),
   continues the numbering if you add more later, and prints lines to paste (size and colour tone included).
3. Paste those lines into `foundry/data.js` under the right film and group, and write the `alt` text.

Naming: `<film>-main-NN`, `<film>-character-NN`, `<film>-alt-NN`, `<film>-process-NN`,
`<campaign>-poster-NN`, `<campaign>-social-NN` and so on. The group name becomes each poster's label
("Character poster"), and the wall, filters, index and counts update by themselves.

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

- **New work in the Foundry:** see "Adding work" above.
- **New poster in the home archive:** add a 1200px WebP to `assets/img/` and a 640px one to `assets/img/thumb/`, add a `<button class="poster" data-lb="N">` to the archive wall in `index.html`, and add `['Title', year, 'file-name']` to the `POSTERS` list at the top of `assets/js/forge.js`.
- **Text:** edit the HTML directly. Every page uses the same shared stylesheet and script.
- **Resume PDF:** replace `files/Thinura-Anjana-Resume-2026.pdf` (keep the same file name).

© 2026 FORGE Studio · Thinura Anjana
