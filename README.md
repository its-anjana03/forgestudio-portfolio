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
│   ├── css/forge-fx.css, js/forge-fx.js  Heat details layered over every page (see "Heat details")
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
- Cinematic sound (off by default, remembered across pages): a different mood of music on each part of the site,
  and soft cinematic impacts on the hero's hammer strikes (see "Sound" below)
- Shareable poster links, e.g. `https://forgestudio.web.lk/#poster-leo`
- Commission brief builder that composes a ready-to-send email (nothing is stored)
- Copy-email buttons, page transitions, hidden-details hunt, before/after slider
- Social share cards for every page
- Heat details on every page: main headings are revealed by a pass of gold heat (and again on hover),
  major buttons carry a travelling gold edge, plus small touches on section numbers, links, dividers and images

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

## Heat details

`assets/css/forge-fx.css` and `assets/js/forge-fx.js` load after the main stylesheet and script on every page
(not the Foundry). They only decorate what is already there, with one idea throughout: gold heat arrives, then settles.

- **Headings:** every main heading comes out of the dark under a pass of gold heat; the same pass crosses it on hover.
- **Major buttons:** a gold highlight travels round the edge on hover, with a quick flash on click.
- **Small touches:** section numbers and resume dates catch light as they arrive, menu links take the heat pass,
  text-link underlines draw in gold, counters flare when they land, divider lines draw themselves behind a gold tip,
  case-study images get one glint round the edge, and tags warm at the edge on hover.
- **Signature:** under the About statement on the home page, the signature (`assets/img/signature.webp`) writes itself
  stroke by stroke in hot gold, then cools to cream. The stroke order is the five `sig-stroke` paths in `index.html`.
- **Award seals:** the two recognitions (Thanthi TV, first of 200) are stamped onto their cards on the home page and
  onto the main image of their case studies as round maker's seals. The wording is in `SEALS` in `forge-fx.js`.
- **End credits:** the home page closes with a slow film-style credit roll above the footer word. The lines are the
  `credits` block in `index.html`.
- **Scrollbar:** the scrollbar handle is a small ingot that cools from gold to steel as the page goes down.
- **One detail per project page** (all built in `forge-fx.js`, section "One detail for each project page"):
  Joey has its four audit findings numbered with stamped seals; Vijayism has an ON AIR lamp that switches on at
  Recognition; Seylune opens its home page screenshot inside a browser window; Avengers counts up to the 27-character
  cast and demonstrates its before/after slider once; Rolex shows the visitor's own day and date in a Day-Date window;
  the FORGE identity page draws the mark on its construction grid.
- **Chapter words:** on the home page, each section's chapter name (Heat, Proof, Practice, Mark, Temper, Quench) stands
  behind it as a large, faint outline that drifts with the scroll and takes one pass of gold heat as the section arrives.
  It is switched on by `data-fx-chapters` on the `<html>` tag of `index.html`; remove the attribute to switch it off.
- **Hidden strike:** typing F-O-R-G-E anywhere fires one hammer strike from the logo.

Timings are the `T` values at the top of `forge-fx.js`. Everything is off with reduced motion, and hover
effects are off on touch screens. To remove the whole layer, delete the two tags that load these files from each page.

## Sound

`assets/js/forge-sound.js` runs on every page. The switch sits in the bottom-left corner (in the Foundry's header).
Sound starts off; once a visitor turns it on, every page fades in its own music and the choice is remembered.
Browsers only allow sound after a click or tap, so on a newly opened page the music starts on the first click
(the switch glows softly until then). A track shared by two pages carries on where it stopped.

| File | Track | Pages |
|---|---|---|
| `assets/audio/home.mp3` | Dark Cinematic Thriller (leberch) | Home, 404 |
| `assets/audio/foundry.mp3` | Dramatic Cinematic Documentary (musicdream) | The Foundry |
| `assets/audio/work.mp3` | Dark (leberch) | Every case study, resume |

Tracks are from [Pixabay Music](https://pixabay.com/music/) (free for websites, no attribution needed).
The level is deliberately subtle (`LEVEL` at the top of the script), each track is evened out to the same
loudness, and a soft compressor keeps the big passages in the background. To change a track, replace the file
with the same name (and re-check its gain in `MOODS`). Tracks loop with a 4-second crossfade, so the loop
point is not heard. Moving between pages, a soft whoosh carries the music out and a soft bloom brings the next page's music in (both synthesised in the browser). A page whose track is missing simply shows no switch. The hammer impacts are synthesised in
the browser (no file). Original downloads go in `audio-originals/`, which is kept out of git and the zip.

## Analytics (optional)

Visitor stats are on, with [GoatCounter](https://www.goatcounter.com): free, no cookies, no consent banner.
Dashboard: **https://forgestudio.goatcounter.com**

- Page views on every page, plus events from the portfolio (poster views, shares, brief sends, email copies,
  detail hunt completions) and every collection opened in the Foundry (e.g. `/foundry/film/leo`).
- The site code `forgestudio` is set in `assets/js/forge.js` and `foundry/foundry.js`. Set it to `''` in both to switch stats off.
- It stays off on `localhost`, so local testing never counts. Ad blockers may hide some visits.

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

- **After changing CSS or JavaScript:** every page links its stylesheet and scripts with a version stamp
  (`forge.css?v=20261005a`). Change the stamp in all pages (a find-and-replace across the `.html` files and
  `foundry/index.html`) so visitors' browsers fetch the new files instead of an old cached copy.

- **New work in the Foundry:** see "Adding work" above.
- **New poster in the home archive:** add a 1200px WebP to `assets/img/` and a 640px one to `assets/img/thumb/`, add a `<button class="poster" data-lb="N">` to the archive wall in `index.html`, and add `['Title', year, 'file-name']` to the `POSTERS` list at the top of `assets/js/forge.js`.
- **Text:** edit the HTML directly. Every page uses the same shared stylesheet and script.
- **Resume PDF:** replace `files/Thinura-Anjana-Resume-2026.pdf` (keep the same file name).

© 2026 FORGE Studio · Thinura Anjana
