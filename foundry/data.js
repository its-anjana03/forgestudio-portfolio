/* =====================================================================
   THE FOUNDRY · the full collection of FORGE Studio.
   Every piece lives in this one file. The endless wall, the filters, the index
   and every premiere build themselves from it.

   THE PARTS (fixed order)                         filter     images
     Film       movies     one collection per film    #/film      foundry/img/movies/<film id>/
     Events     campaigns  one collection per event   #/events    foundry/img/campaigns/<campaign id>/
     Concepts   concepts   "Concept posters"          #/concepts  foundry/img/concepts/
                vault      "From the sketchbook"                  foundry/img/vault/
     Social     harbour    Saagara Seafoods           #/social    foundry/img/social/saagara/
   Film posters, concept posters and each campaign's cover are hung in the middle
   of the wall, where visitors look first.

   ADDING WORK
   1. node tools/foundry-images.js "<folder of exports>" movies/leo leo-character
      (makes a 1600px viewer size and a 400px wall size, and prints lines to paste)
   2. Paste the lines into the right film / campaign / group below and write the alt text.

   ITEM FIELDS
     file      image name without .webp (required)
     w, h      pixel size printed by the tool (keeps the wall steady while images load)
     tone      average colour printed by the tool (shown while the image loads)
     alt       what the image shows (required)
     title     the piece's name; films fall back to the group name ("Main poster")
     note      optional line under the name in the premiere
     type      campaigns: logo, poster, banner, invitation, social, ticket, certificate, sticker

   more: true on a film (or conceptsMore) shows "More posters on the way" in its
   premiere until the rest of the series is added. Remove it once the series is complete.
   ===================================================================== */
window.FOUNDRY = {

  /* ---------------- Film ----------------
     Posters waiting on the owner's other PC: more for Leo, Jana Nayagan, LIK,
     Kalki 2898 AD, Indian 2 and PS-1. Source folders sit next to this file:
     foundry/Leo, Jananayagan, LIK, Kalki 2898 AD, Indian 2, PS 1.
     Suggested groups: Main posters, Character posters, Alternate versions, Process. */
  movies: [
    {
      id: 'leo', title: 'Leo', year: 2023, cover: 'leo-main-01', more: true, // source folder: foundry/Leo
      note: 'The largest series in the collection: around twenty posters, made over more than a month.',
      groups: [
        { name: 'Main posters', items: [
          { file: 'leo-main-01', w: 1053, h: 1600, tone: '#a3b7c0', alt: 'Leo tribute poster, main version', featured: true },
        ] },
      ],
    },
    {
      id: 'jana-nayagan', title: 'Jana Nayagan', year: 2026, cover: 'jana-nayagan-main-01', more: true, // source folder: foundry/Jananayagan
      groups: [
        { name: 'Main posters', items: [
          { file: 'jana-nayagan-main-01', w: 908, h: 1600, tone: '#a54e2c', alt: 'Jana Nayagan tribute poster' },
        ] },
      ],
    },
    {
      id: 'lik', title: 'LIK', year: 2026, cover: 'lik-main-01', more: true, // source folder: foundry/LIK
      groups: [
        { name: 'Main posters', items: [
          { file: 'lik-main-01', w: 1067, h: 1600, tone: '#8aacaa', alt: 'LIK tribute poster' },
        ] },
      ],
    },
    {
      id: 'kalki', title: 'Kalki 2898 AD', year: 2024, cover: 'kalki-main-01', more: true, // source folder: foundry/Kalki 2898 AD
      groups: [
        { name: 'Main posters', items: [
          { file: 'kalki-main-01', w: 1120, h: 1600, tone: '#9a7250', alt: 'Kalki 2898 AD tribute poster' },
        ] },
      ],
    },
    {
      id: 'indian2', title: 'Indian 2', year: 2024, cover: 'indian2-main-01', more: true, // source folder: foundry/Indian 2
      groups: [
        { name: 'Main posters', items: [
          { file: 'indian2-main-01', w: 1023, h: 1600, tone: '#9a8979', alt: 'Indian 2 tribute poster' },
        ] },
      ],
    },
    {
      id: 'ps1', title: 'PS-1', year: 2022, cover: 'ps1-main-01', more: true, // source folder: foundry/PS 1
      groups: [
        { name: 'Main posters', items: [
          { file: 'ps1-main-01', w: 1062, h: 1600, tone: '#88694f', alt: 'Ponniyin Selvan: Part 1 tribute poster' },
        ] },
      ],
    },
    {
      id: 'avengers', title: 'Avengers: Doomsday', year: 2025, cover: 'avengers-main-01',
      note: 'From pencil layout to final key art. The full process lives in the portfolio case study.',
      groups: [
        { name: 'Main posters', items: [
          { file: 'avengers-main-01', w: 1067, h: 1600, tone: '#54604f', alt: 'Avengers: Doomsday tribute poster, final version', featured: true },
        ] },
        { name: 'Alternate versions', items: [
          { file: 'avengers-alt-01', w: 1067, h: 1600, tone: '#4c7046', title: 'Version one', alt: 'Avengers: Doomsday poster, first version' },
          { file: 'avengers-alt-02', w: 1067, h: 1600, tone: '#54604f', title: 'Version two', alt: 'Avengers: Doomsday poster, second version' },
        ] },
        { name: 'Process', items: [
          { file: 'avengers-process-01', w: 1164, h: 1600, tone: '#e9edf0', title: 'Layout sketch', alt: 'Pencil layout sketch for the Avengers: Doomsday poster' },
        ] },
      ],
    },
    {
      id: 'f1', title: 'F1', year: 2025, cover: 'f1-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'f1-main-01', w: 1067, h: 1600, tone: '#958073', alt: 'F1 tribute poster' },
        ] },
      ],
    },
    {
      id: 'john-wick', title: 'John Wick: Chapter 4', year: 2024, cover: 'john-wick-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'john-wick-main-01', w: 1023, h: 1600, tone: '#3f3531', alt: 'John Wick: Chapter 4 tribute poster' },
        ] },
      ],
    },
    {
      id: 'oppenheimer', title: 'Oppenheimer', year: 2023, cover: 'oppenheimer-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'oppenheimer-main-01', w: 1080, h: 1350, tone: '#6f6f6f', alt: 'Oppenheimer tribute poster' },
        ] },
      ],
    },
  ],

  /* ---------------- Events ----------------
     One collection per campaign, shown in the order listed (story order).
     cover: the campaign's key art (hung in the middle of the wall, and shown in the index). */
  campaigns: [
    {
      id: 'lantharuma-2027', title: 'Lantharuma 2027', year: 2027, client: 'SLIIT Business School Student Community',
      cover: 'lantharuma-2027-poster-01', role: 'Event campaign design',
      note: 'The lantern rises, the rhythm begins: a fusion of Sri Lankan music, dance and living tradition, with a ten-day countdown.',
      items: [
        { file: 'lantharuma-2027-logo-01', type: 'logo', w: 1600, h: 1143, tone: '#0a273b', title: 'Event logo', alt: 'Lantharuma event logo in glowing blue Sinhala neon lettering' },
        { file: 'lantharuma-2027-poster-01', type: 'poster', w: 1200, h: 1600, tone: '#8e5d59', title: 'Official poster', alt: 'Lantharuma official poster: a masked figure holding a lantern before a full moon, rising over a festival stage with a microphone, guitar and horns' },
        { file: 'lantharuma-2027-banner-01', type: 'banner', w: 1600, h: 900, tone: '#53473c', title: 'Fighting with the dark', alt: 'Lantharuma wide banner, Fighting with the dark' },
        { file: 'lantharuma-2027-social-01', type: 'social', w: 1200, h: 1600, tone: '#473335', title: 'Coming soon', alt: 'Lantharuma social media post: coming soon, two blindfolded figures' },
        { file: 'lantharuma-2027-social-02', type: 'social', w: 1200, h: 1600, tone: '#473529', title: 'The symbol', alt: 'Lantharuma social media post: the lantern symbol' },
        { file: 'lantharuma-2027-social-03', type: 'social', w: 1200, h: 1600, tone: '#3f3731', title: 'Note feeling', alt: 'Lantharuma social media post: note feeling' },
        { file: 'lantharuma-2027-social-05', type: 'social', w: 1200, h: 1600, tone: '#1f303a', title: 'Yaka portrayal', alt: 'Lantharuma social media post: yaka mask portrayal, registration closes soon' },
        { file: 'lantharuma-2027-social-06', type: 'social', w: 1200, h: 1600, tone: '#273341', title: 'Lantharuma × Karnan', alt: 'Lantharuma social media post: Lantharuma × Karnan' },
        { file: 'lantharuma-2027-social-07', type: 'social', w: 1200, h: 1600, tone: '#41394e', title: 'Sponsors', alt: 'Lantharuma social media post: sponsors' },
        { file: 'lantharuma-2027-social-08', type: 'social', w: 1200, h: 1600, tone: '#372b2d', title: 'Registration, 3 days left', alt: 'Lantharuma social media post: registration, 3 days left' },
        { file: 'lantharuma-2027-social-09', type: 'social', w: 1200, h: 1600, tone: '#3d2a2a', title: 'Registration, 2 days left', alt: 'Lantharuma social media post: registration, 2 days left' },
        { file: 'lantharuma-2027-social-10', type: 'social', w: 1200, h: 1600, tone: '#3b2624', title: 'Registration, 1 day left', alt: 'Lantharuma social media post: registration, 1 day left' },
        { file: 'lantharuma-2027-social-11', type: 'social', w: 1200, h: 1600, tone: '#403a41', title: 'Registration closing', alt: 'Lantharuma social media post: registration closes soon' },
        { file: 'lantharuma-2027-social-12', type: 'social', w: 1200, h: 1600, tone: '#504325', title: 'Registration closed', alt: 'Lantharuma social media post: registrations closed' },
        { file: 'lantharuma-2027-social-13', type: 'social', w: 1200, h: 1600, tone: '#1a2325', title: '10 days to go', alt: 'Lantharuma countdown post: 10 days to go' },
        { file: 'lantharuma-2027-social-14', type: 'social', w: 1200, h: 1600, tone: '#53505f', title: '9 days to go', alt: 'Lantharuma countdown post: 9 days to go' },
        { file: 'lantharuma-2027-social-15', type: 'social', w: 1200, h: 1600, tone: '#5c5c5a', title: '8 days to go', alt: 'Lantharuma countdown post: 8 days to go' },
        { file: 'lantharuma-2027-social-16', type: 'social', w: 1200, h: 1600, tone: '#594850', title: '7 days to go', alt: 'Lantharuma countdown post: 7 days to go' },
        { file: 'lantharuma-2027-social-17', type: 'social', w: 1200, h: 1600, tone: '#482c2c', title: '6 days to go', alt: 'Lantharuma countdown post: 6 days to go' },
        { file: 'lantharuma-2027-social-18', type: 'social', w: 1200, h: 1600, tone: '#282f3b', title: '5 days to go', alt: 'Lantharuma countdown post: 5 days to go' },
        { file: 'lantharuma-2027-social-19', type: 'social', w: 1200, h: 1600, tone: '#67514f', title: '4 days to go', alt: 'Lantharuma countdown post: 4 days to go' },
        { file: 'lantharuma-2027-social-20', type: 'social', w: 1200, h: 1600, tone: '#726456', title: '3 days to go', alt: 'Lantharuma countdown post: 3 days to go' },
        { file: 'lantharuma-2027-social-21', type: 'social', w: 1200, h: 1600, tone: '#2d2b29', title: '2 days to go', alt: 'Lantharuma countdown post: 2 days to go' },
        { file: 'lantharuma-2027-social-22', type: 'social', w: 1200, h: 1600, tone: '#454a53', title: '1 day to go', alt: 'Lantharuma countdown post: 1 day to go' },
        { file: 'lantharuma-2027-social-23', type: 'social', w: 1200, h: 1600, tone: '#4d301c', title: 'Today', alt: 'Lantharuma social media post: the wait is over, today' },
      ],
    },
    {
      id: 'enchante', title: 'Enchanté', year: 2026, client: 'SLIIT Business School Student Community',
      cover: 'enchante-social-02', role: 'Full campaign design, independently',
      note: 'An evening of art and creativity under one line: "Envision the unspoken. Paint it."',
      items: [
        { file: 'enchante-logo-01', type: 'logo', w: 1600, h: 1368, tone: '#261d0e', title: 'Event logo', alt: 'Enchanté gold logo: a quill-pen E with the line Envision the unspoken. Paint it.' },
        { file: 'enchante-social-01', type: 'social', w: 1280, h: 1600, tone: '#33170c', title: 'Coming soon', alt: 'Enchanté social media post: coming soon' },
        { file: 'enchante-social-02', type: 'social', w: 1280, h: 1600, tone: '#64554c', title: 'Date reveal', alt: 'Enchanté date reveal: 02 September, painted on an old fresco wall' },
        { file: 'enchante-social-03', type: 'social', w: 1280, h: 1600, tone: '#563d2a', title: 'Registration open', alt: 'Enchanté social media post: the canvas is yours, registration open' },
        { file: 'enchante-social-04', type: 'social', w: 1280, h: 1600, tone: '#c0ab92', title: 'Registration countdown, three', alt: 'Enchanté countdown post: registration closes in 3 days' },
        { file: 'enchante-social-05', type: 'social', w: 1280, h: 1600, tone: '#bfaa91', title: 'Registration countdown, two', alt: 'Enchanté countdown post: registration closes in 2 days' },
        { file: 'enchante-social-06', type: 'social', w: 1280, h: 1600, tone: '#c0ab94', title: 'Registration countdown, one', alt: 'Enchanté countdown post: registration closes in 1 day' },
        { file: 'enchante-social-07', type: 'social', w: 1280, h: 1600, tone: '#4a3d2b', title: 'Registration reminder', alt: 'Enchanté social media post: what if your greatest story has never been spoken? Register today' },
        { file: 'enchante-social-08', type: 'social', w: 1280, h: 1600, tone: '#b39e8a', title: 'Registration closed', alt: 'Enchanté social media post: registrations are now closed' },
        { file: 'enchante-social-09', type: 'social', w: 1280, h: 1600, tone: '#3c3026', title: 'Guest feature', alt: 'Enchanté guest feature post' },
        { file: 'enchante-social-10', type: 'social', w: 1280, h: 1600, tone: '#514135', title: 'Guest feature', alt: 'Enchanté guest feature post' },
        { file: 'enchante-social-11', type: 'social', w: 1280, h: 1600, tone: '#564d49', title: 'Guest feature', alt: 'Enchanté guest feature post' },
        { file: 'enchante-social-12', type: 'social', w: 1280, h: 1600, tone: '#483221', title: 'Platinum sponsor', alt: 'Enchanté social media post: welcoming the platinum sponsor' },
        { file: 'enchante-social-13', type: 'social', w: 1280, h: 1600, tone: '#483221', title: 'Platinum sponsor, second version', alt: 'Enchanté social media post: platinum sponsor, second version' },
        { file: 'enchante-social-14', type: 'social', w: 1280, h: 1600, tone: '#201c19', title: 'Silver sponsors', alt: 'Enchanté social media post: silver sponsors' },
        { file: 'enchante-social-15', type: 'social', w: 1280, h: 1600, tone: '#2d2420', title: 'Gift partners', alt: 'Enchanté social media post: gift partners' },
        { file: 'enchante-social-16', type: 'social', w: 1280, h: 1600, tone: '#251d14', title: '3 days to go', alt: 'Enchanté countdown post: 3 days to go' },
        { file: 'enchante-social-17', type: 'social', w: 1280, h: 1600, tone: '#352f28', title: '2 days to go', alt: 'Enchanté countdown post: 2 days to go, an hourglass' },
        { file: 'enchante-social-18', type: 'social', w: 1280, h: 1600, tone: '#292219', title: '1 day to go', alt: 'Enchanté countdown post: 1 day to go' },
        { file: 'enchante-social-19', type: 'social', w: 1280, h: 1600, tone: '#1e1310', title: 'Today', alt: 'Enchanté social media post: today, the unseen is finally revealed' },
      ],
    },
    {
      id: 'down-the-wicket', title: 'Down the Wicket', year: 2026, client: 'SLIIT Business School Student Community',
      cover: 'down-the-wicket-social-01', role: 'Full campaign design, independently',
      note: 'The SLIIT SBS cricket tournament, 24 and 25 August 2026 at the SLIIT main ground. The full run, from date reveal to thank you.',
      items: [
        { file: 'down-the-wicket-logo-01', type: 'logo', w: 709, h: 915, tone: '#6d5e4c', title: 'Event logo', alt: 'Down the Wicket 2026 tournament crest with crossed bats, stumps and a cricket ball' },
        { file: 'down-the-wicket-poster-01', type: 'poster', w: 1131, h: 1600, tone: '#7a6558', title: 'Print flyer', alt: 'Down the Wicket print flyer with dates, venue and a registration QR code' },
        { file: 'down-the-wicket-poster-02', type: 'poster', w: 1131, h: 1600, tone: '#60493a', title: 'Print flyer with QR code', alt: 'Down the Wicket print flyer: register your team, with QR code' },
        { file: 'down-the-wicket-invitation-01', type: 'invitation', w: 1128, h: 1600, tone: '#958777', title: 'Invitation', alt: 'Down the Wicket invitation card for 25 August 2026' },
        { file: 'down-the-wicket-social-01', type: 'social', w: 1280, h: 1600, tone: '#627276', title: 'Date reveal', alt: 'Down the Wicket date reveal: a stadium scoreboard reading Aug 24 and 25' },
        { file: 'down-the-wicket-social-02', type: 'social', w: 1280, h: 1600, tone: '#826f63', title: 'Registration open', alt: 'Down the Wicket social media post: registration open now' },
        { file: 'down-the-wicket-social-03', type: 'social', w: 1280, h: 1600, tone: '#808c95', title: 'Registration, all faculties', alt: 'Down the Wicket social media post: all faculties, one ground' },
        { file: 'down-the-wicket-social-04', type: 'social', w: 1280, h: 1600, tone: '#838a95', title: 'Registration, all faculties, second version', alt: 'Down the Wicket social media post: your faculty, your team, your moment' },
        { file: 'down-the-wicket-social-05', type: 'social', w: 1280, h: 1600, tone: '#604835', title: 'Register your team', alt: 'Down the Wicket social media post: register your team, with QR code' },
        { file: 'down-the-wicket-social-06', type: 'social', w: 1280, h: 1600, tone: '#746b5c', title: 'Registration closes on the 14th', alt: 'Down the Wicket social media post: the last spin, registration closes 14 August' },
        { file: 'down-the-wicket-social-07', type: 'social', w: 1280, h: 1600, tone: '#6f6250', title: 'Registration closes on the 20th', alt: 'Down the Wicket social media post: the final face, registration closes 20 August' },
        { file: 'down-the-wicket-social-08', type: 'social', w: 1280, h: 1600, tone: '#526772', title: 'Registration open again', alt: 'Down the Wicket social media post: due to high demand, open again' },
        { file: 'down-the-wicket-social-09', type: 'social', w: 1280, h: 1600, tone: '#93817c', title: 'Final call', alt: 'Down the Wicket social media post: final call, registrations close today' },
        { file: 'down-the-wicket-social-10', type: 'social', w: 1280, h: 1600, tone: '#4d3a31', title: 'Last call', alt: 'Down the Wicket social media post: last call' },
        { file: 'down-the-wicket-social-11', type: 'social', w: 1280, h: 1600, tone: '#47413c', title: 'Prizes', alt: 'Down the Wicket social media post: champion and runner-up prizes' },
        { file: 'down-the-wicket-social-12', type: 'social', w: 1280, h: 1600, tone: '#6f6866', title: 'Sponsors', alt: 'Down the Wicket social media post: the power behind the pitch, sponsors' },
        { file: 'down-the-wicket-social-13', type: 'social', w: 1280, h: 1600, tone: '#554940', title: 'First line-up', alt: 'Down the Wicket social media post: the first line-up is in' },
        { file: 'down-the-wicket-social-14', type: 'social', w: 1280, h: 1600, tone: '#9d9f95', title: 'Final line-up locked', alt: 'Down the Wicket social media post: final line-up locked' },
        { file: 'down-the-wicket-social-15', type: 'social', w: 1280, h: 1600, tone: '#726e69', title: 'Final window, 3 days left', alt: 'Down the Wicket social media post: final window, 3 days left' },
        { file: 'down-the-wicket-social-16', type: 'social', w: 1280, h: 1600, tone: '#595650', title: 'Final window, 2 days left', alt: 'Down the Wicket social media post: final window, 2 days left' },
        { file: 'down-the-wicket-social-17', type: 'social', w: 1280, h: 1600, tone: '#423e39', title: 'Final window, 1 day left', alt: 'Down the Wicket social media post: final window, 1 day left' },
        { file: 'down-the-wicket-social-18', type: 'social', w: 1280, h: 1600, tone: '#78786d', title: '2 days to go', alt: 'Down the Wicket social media post: 2 days to take the field' },
        { file: 'down-the-wicket-social-19', type: 'social', w: 1280, h: 1600, tone: '#737066', title: 'First round', alt: 'Down the Wicket social media post: first round, match day' },
        { file: 'down-the-wicket-social-20', type: 'social', w: 1280, h: 1600, tone: '#726e6b', title: 'Match day', alt: 'Down the Wicket social media post: match day' },
        { file: 'down-the-wicket-social-21', type: 'social', w: 1280, h: 1600, tone: '#585049', title: 'Thank you', alt: 'Down the Wicket social media post: thank you' },
      ],
    },
    {
      id: 'admeliora-26', title: 'ADMELIORA\'26', year: 2026, client: 'SLIIT Business School Student Community',
      cover: 'admeliora-26-social-03', role: 'Event campaign design',
      note: 'Remarkable journeys, influential minds, one stage. A guest-led campaign built around the reveal of each speaker.',
      items: [
        { file: 'admeliora-26-logo-01', type: 'logo', w: 1600, h: 345, tone: '#3a331d', title: 'Wordmark', alt: 'ADMELIORA\'26 gold wordmark: inspire, connect, elevate' },
        { file: 'admeliora-26-social-01', type: 'social', w: 1280, h: 1600, tone: '#28251d', title: 'Coming soon', alt: 'ADMELIORA\'26 social media post: who will take the stage? Coming soon' },
        { file: 'admeliora-26-social-02', type: 'social', w: 1280, h: 1600, tone: '#473822', title: 'Teaser', alt: 'ADMELIORA\'26 teaser post: the voices that move us' },
        { file: 'admeliora-26-social-03', type: 'social', w: 1280, h: 1600, tone: '#4b3f33', title: 'Title reveal', alt: 'ADMELIORA\'26 title reveal: the conversation has a name, a panel on a lit stage' },
        { file: 'admeliora-26-social-04', type: 'social', w: 1280, h: 1600, tone: '#363020', title: 'Date reveal', alt: 'ADMELIORA\'26 date reveal: 20th September' },
        { file: 'admeliora-26-social-05', type: 'social', w: 1280, h: 1600, tone: '#443928', title: 'Guess the guests', alt: 'ADMELIORA\'26 social media post: guess the guests' },
        { file: 'admeliora-26-social-06', type: 'social', w: 1200, h: 1600, tone: '#5d4629', title: 'Guest feature', alt: 'ADMELIORA\'26 guest feature post' },
        { file: 'admeliora-26-social-07', type: 'social', w: 1200, h: 1600, tone: '#55422a', title: 'Guest feature', alt: 'ADMELIORA\'26 guest feature post' },
        { file: 'admeliora-26-social-08', type: 'social', w: 1200, h: 1600, tone: '#5a482e', title: 'Guest feature', alt: 'ADMELIORA\'26 guest feature post' },
        { file: 'admeliora-26-social-09', type: 'social', w: 1200, h: 1600, tone: '#6a5636', title: 'Guest feature', alt: 'ADMELIORA\'26 guest feature post' },
        { file: 'admeliora-26-social-10', type: 'social', w: 1200, h: 1600, tone: '#664e2f', title: 'Guest feature', alt: 'ADMELIORA\'26 guest feature post' },
        { file: 'admeliora-26-social-11', type: 'social', w: 1200, h: 1600, tone: '#523f28', title: 'Guest feature', alt: 'ADMELIORA\'26 guest feature post' },
        { file: 'admeliora-26-social-12', type: 'social', w: 1200, h: 1600, tone: '#654e33', title: 'Guest feature', alt: 'ADMELIORA\'26 guest feature post' },
      ],
    },
  ],

  /* ---------------- Concepts · Concept posters ----------------
     Concept poster design. More concept posters are waiting on the owner's other PC. */
  conceptsMore: true,
  concepts: [
    { file: 'vijayism-01', w: 1068, h: 1600, tone: '#6c5b36', title: '30 Years of Vijayism', year: 2022, medium: 'Tribute poster',
      alt: 'The 30 Years of Vijayism tribute poster: the actor seated in a vintage green room beneath a gilded portrait of himself, surrounded by small details from his career',
      note: 'Featured on Thanthi TV, Indian television. Every object in the room is a hidden detail.',
      link: { href: '../vijayism-piece.html', label: 'Read the full story' } },
  ],

  /* ---------------- Social ----------------
     Saagara Seafoods social media, in story order. Group names become the label of each post. */
  harbour: {
    title: 'Saagara Seafoods', client: 'Saagara Seafoods (Pvt) Ltd', year: 2026,
    note: 'Social media for a seafood market: the brand, a grand opening, everyday market posts and a year of festive greetings.',
    groups: [
      { name: 'The brand', items: [
        { file: 'saagara-logo-01', w: 1600, h: 873, tone: '#4e4458', title: 'Brand logo', alt: 'Saagara Seafoods logo: a leaping tuna in navy and magenta with a splash of blue water' },
        { file: 'saagara-banner-01', w: 851, h: 360, tone: '#493834', title: 'Page cover', alt: 'Saagara Seafoods page cover: fresh fish, prawns and squid beside the brand name' },
      ] },
      { name: 'Grand opening', items: [
        { file: 'saagara-social-01', w: 1200, h: 1500, tone: '#c69f8f', title: 'Grand opening invitation', alt: 'Grand opening invitation framed by hand-drawn fish, lobsters and squid' },
        { file: 'saagara-social-02', w: 1200, h: 1500, tone: '#a4a195', title: 'One day to go', alt: 'A hand lifts a fresh fish from the sea: one day to go' },
        { file: 'saagara-social-03', w: 1200, h: 1500, tone: '#81919e', title: 'Opening day', alt: 'A smiling fisherman greets the morning by the sea on opening day' },
      ] },
      { name: 'At the market', items: [
        { file: 'saagara-social-04', w: 1200, h: 1500, tone: '#706a65', title: "Today's price list", alt: "Today's fish price list on a chalkboard at a seaside market stall" },
        { file: 'saagara-social-05', w: 1200, h: 1500, tone: '#7d7765', title: 'Know your fish: sardines', alt: 'A bowl of fresh sardines on ice at the beach: things you did not know about sardines' },
      ] },
      { name: 'Through the seasons', items: [
        { file: 'saagara-social-06', w: 1200, h: 1500, tone: '#546d7c', title: 'Christmas', alt: 'Fishing boats on a calm winter sea: wishing you a joyful and delicious Christmas' },
        { file: 'saagara-social-07', w: 1200, h: 1500, tone: '#5b8eaf', title: 'A fresh start, 2026', alt: 'A fish made of the numbers 2026 leaps over the sea: a fresh start for the new year' },
        { file: 'saagara-social-08', w: 1200, h: 1500, tone: '#555140', title: 'Poya day, January', alt: 'Poya day greeting with the Buddha beneath the Bodhi tree' },
        { file: 'saagara-social-09', w: 1200, h: 1500, tone: '#8e7452', title: 'Thai Pongal', alt: 'A family celebrating Thai Pongal with a pot of milk rice' },
        { file: 'saagara-social-10', w: 1200, h: 1500, tone: '#856f52', title: 'Poya day, February', alt: 'Poya day greeting with the Buddha and a gathering of monks' },
        { file: 'saagara-social-11', w: 1200, h: 1500, tone: '#8a8f8b', title: 'Independence Day', alt: 'Fishing families on the shore beneath the lion of the national flag: 78th Independence Day' },
        { file: 'saagara-social-12', w: 1200, h: 1500, tone: '#8f5f42', title: 'Maha Shivratri', alt: 'Maha Shivratri greeting with Lord Shiva and devotees' },
        { file: 'saagara-social-13', w: 1200, h: 1500, tone: '#7b5d39', title: 'Sinhala and Tamil New Year', alt: 'A festive table of seafood and sweets for the Sinhala and Tamil New Year' },
      ] },
    ],
  },

  /* ---------------- Concepts · From the sketchbook ----------------
     Sketches, drafts and builds from behind the finished work. */
  vault: [
    { file: 'vault-01', w: 1164, h: 1600, tone: '#e9edf0', title: 'Pencil layout', year: 2025, note: 'Avengers: Doomsday, before a single pixel.', alt: 'Pencil layout sketch for the Avengers: Doomsday poster, with handwritten notes', link: { href: '../avengers-process.html', label: 'The full process' } },
    { file: 'vault-02', w: 864, h: 1600, tone: '#2c2829', title: 'Outline wireframe', year: 2022, note: 'Rolex Day-Date 40, drawn line by line.', alt: 'Wireframe outline of the Rolex Day-Date watch', link: { href: '../rolex-design.html', label: 'The watch study' } },
    { file: 'vault-03', w: 1120, h: 1355, tone: '#827565', title: 'Base geometry', year: 2022, note: 'The first gold before the details.', alt: 'Rolex watch base geometry in flat gold', link: { href: '../rolex-design.html', label: 'The watch study' } },
    { file: 'vault-04', w: 1180, h: 1040, tone: '#7b7774', title: 'Dial build', year: 2022, note: 'Hands, indices and the day window.', alt: 'Rolex dial build with Roman numerals and the day window', link: { href: '../rolex-design.html', label: 'The watch study' } },
    { file: 'vault-05', w: 1400, h: 723, tone: '#857866', title: 'Metal gradients', year: 2022, note: 'Every gold and steel tone, tested first.', alt: 'Swatches of gold and steel gradients for the Rolex study', link: { href: '../rolex-design.html', label: 'The watch study' } },
    { file: 'vault-06', w: 1600, h: 1000, tone: '#060606', title: 'Construction grid', year: 2025, note: 'How the FORGE mark was drawn.', alt: 'The FORGE logo construction grid on black', link: { href: '../forge-identity.html', label: 'The identity' } },
    { file: 'vault-07', w: 1600, h: 1196, tone: '#62615d', title: 'Every screen at once', year: 2025, note: 'The whole Joey app, laid out flat.', alt: 'Board showing every screen of the Joey mobile app design', link: { href: '../joey-mobile-case-study.html', label: 'The case study' } },
  ],
};
