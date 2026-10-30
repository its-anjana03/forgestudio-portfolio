/* =====================================================================
   THE FOUNDRY · the full collection of FORGE Studio.
   Every piece lives in this one file. The endless wall, the filters, the index
   and every premiere build themselves from it.

   THE PARTS (fixed order)                         filter     images
     Film       movies     one collection per film    #/film      foundry/img/movies/<film id>/
     Events     campaigns  one collection per event   #/events    foundry/img/campaigns/<campaign id>/
     Concepts   concepts   "Concept art"              #/concepts  foundry/img/concepts/
     Social     social     one collection per client  #/social    foundry/img/social/<collection id>/
     Print      print      one collection per kind    #/print     foundry/img/print/<collection id>/
   Film posters, concept posters and each collection's cover are hung in the middle
   of the wall, where visitors look first.

   WHAT BELONGS HERE
   Finished designs only. No process images, sketches, Figma screenshots, logo grids or logos.
   Every file name and every title is unique: a piece is never added twice.

   ADDING WORK
   1. node tools/foundry-images.js "<folder of exports>" movies/leo leo-character
      (makes a 1600px viewer size and a 400px wall size, and prints lines to paste)
   2. Paste the lines into the right film / campaign / group below, then write a title and the alt text.

   ITEM FIELDS
     file      image name without .webp (required, unique)
     w, h      pixel size printed by the tool (keeps the wall steady while images load)
     tone      average colour printed by the tool (shown while the image loads)
     year      when the piece was made, if different from its collection's year
     title     the piece's own name (unique inside its collection); falls back to the group name
     alt       what the image shows (required)
     medium    concepts: the kind of piece ("Tribute poster", "Concept art")
     note      optional line under the name in the premiere
     type      campaigns: logo, poster, banner, invitation, social, ticket, certificate, sticker
     motion    true plays it as a motion poster in the premiere (needs foundry/img/motion/<file>.webp,
               a depth map made offline, and an entry in foundry/motion.js)
   ===================================================================== */
window.FOUNDRY = {

  /* ---------------- Film ----------------
     One collection per film. Leo comes first (the largest series), then newest to oldest.
     Group names become each poster's label: Announcement, First look, Main posters, Song posters,
     Character posters, Countdown, Release posters, Box office, Anniversary. */
  movies: [
    {
      id: 'leo', title: 'Leo', year: 2023, cover: 'leo-main-01',
      note: 'The largest series in the collection: eighteen posters, from the cast reveal in January 2023 to the first anniversary.',
      groups: [
        { name: 'Announcement', items: [
          { file: 'leo-thalapathy-67-cast', w: 1600, h: 794, tone: '#362e2c', title: 'Thalapathy 67 cast reveal', alt: 'Thalapathy 67 cast reveal banner: twelve cast and crew portraits in a row, lit in teal and red' },
        ] },
        { name: 'First look', items: [
          { file: 'leo-first-look', w: 1096, h: 1600, tone: '#502d14', title: 'First look: Bloody Sweet', alt: 'Leo first look: Vijay\'s face over a glowing golden lion, Bloody Sweet' },
        ] },
        { name: 'Song posters', items: [
          { file: 'leo-naa-ready', w: 1067, h: 1600, tone: '#804d26', title: 'Naa Ready, first single', alt: 'Leo first single poster: Vijay raising a revolver above a burning crowd, Naa Ready' },
        ] },
        { name: 'Main posters', items: [
          { file: 'leo-imax', w: 1067, h: 1600, tone: '#6e574c', title: 'IMAX poster', alt: 'Leo IMAX poster: Sanjay Dutt and Arjun above Vijay swinging a hammer through the IMAX logo' },
          { file: 'leo-face-the-devil', w: 1067, h: 1600, tone: '#6d432c', title: 'Face the devil', alt: 'Leo poster: Vijay smoking above a fight scene, keep calm and face the devil' },
          { file: 'leo-keep-calm', w: 1017, h: 1600, tone: '#707478', title: 'Keep calm and face the devil', alt: 'Leo poster: Vijay gripping Sanjay Dutt\'s face in falling snow, keep calm and face the devil' },
          { file: 'leo-mr-leo-das', w: 1067, h: 1600, tone: '#685322', title: 'Mr. Leo Das', alt: 'Leo poster in yellow and black: Vijay and Sanjay Dutt head to head, Mr. Leo Das in red script' },
          { file: 'leo-main-01', w: 1053, h: 1600, tone: '#a3b7c0', motion: true, title: 'Trailer from today', alt: 'Leo trailer poster: Vijay\'s face above a snowy valley where a lone figure faces a hyena, trailer from today', featured: true },
          { file: 'leo-47-million-views', w: 1019, h: 1600, tone: '#9a6b4e', title: '47 million views', alt: 'Leo trailer milestone poster: a hand raising a revolver over a crowd, 47 million views' },
        ] },
        { name: 'Countdown', items: [
          { file: 'leo-7-days-to-go', w: 1054, h: 1600, tone: '#ada591', title: '7 days to go', alt: 'Leo countdown: Trisha and Vijay before a giant 7, seven days to go' },
          { file: 'leo-6-days-to-go', w: 1054, h: 1600, tone: '#7c6a59', title: '6 days to go', alt: 'Leo countdown: a police officer beside a giant 6 in a snowy valley, six days to go' },
          { file: 'leo-4-days-to-go', w: 1054, h: 1600, tone: '#70707c', title: '4 days to go', alt: 'Leo countdown: a grinning, bloodied young man, he\'s notorious, four days to go' },
          { file: 'leo-3-days-to-go', w: 1263, h: 1600, tone: '#b2826b', title: '3 days to go', alt: 'Leo countdown: a family on a sofa beneath the word three, three days to go' },
          { file: 'leo-release-day', w: 1067, h: 1600, tone: '#413b34', title: 'Release day', alt: 'Leo release-day poster: the full cast beneath Today Worldwide Release' },
          { file: 'leo-day', w: 1080, h: 1080, tone: '#2c1c16', title: 'Leo Day', alt: 'Square Leo Day post: the Leo seal inside a ring of fire' },
        ] },
        { name: 'Box office', items: [
          { file: 'leo-400-crores', w: 1091, h: 1600, tone: '#819fb4', title: 'Industry hit: 400 crores', alt: 'Leo box-office poster on frozen ice: industry hit, 400 crores worldwide on the fourth day' },
          { file: 'leo-500-crores', w: 1054, h: 1600, tone: '#d2cecc', title: '500 crores worldwide', alt: 'Leo box-office poster: a revolver rising from the zero of 500, five hundred crores worldwide' },
        ] },
        { name: 'Anniversary', items: [
          { file: 'leo-one-year', w: 1112, h: 1600, tone: '#883015', year: 2024, title: 'One year of Leo', alt: 'One year of Leo anniversary poster in burning orange: Vijay and Sanjay Dutt face to face' },
        ] },
      ],
    },
    {
      id: 'jana-nayagan', title: 'Jana Nayagan', year: 2026, cover: 'jana-nayagan-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'jana-nayagan-main-01', w: 908, h: 1600, tone: '#a54e2c', title: 'Face-off', alt: 'Jana Nayagan tribute poster' },
          { file: 'jana-nayagan-release-today', w: 1067, h: 1600, tone: '#b17a5a', title: 'Worldwide release today', alt: 'Jana Nayagan release poster: the full cast beneath Worldwide Release Today' },
          { file: 'jana-nayagan-roaring', w: 1067, h: 1600, tone: '#bdb3b3', title: 'Roaring', alt: 'Jana Nayagan poster on white: two bloodied, roaring faces either side of the dates 26, 28, 01' },
          { file: 'jana-nayagan-imax', w: 1067, h: 1600, tone: '#6b6c76', title: 'Experience it in IMAX', alt: 'Jana Nayagan IMAX poster: Vijay with a red laser sight beneath giant IMAX letters' },
          { file: 'jana-nayagan-i-am-coming', w: 1067, h: 1600, tone: '#835955', title: 'I am coming', alt: 'Jana Nayagan poster: Vijay waving a huge red U/A flag, I am coming' },
          { file: 'jana-nayagan-the-arrival', w: 987, h: 1600, tone: '#b9b8b8', title: 'The arrival, tomorrow', alt: 'Jana Nayagan poster in black and white: Vijay from behind with a sword on his shoulder, the arrival tomorrow' },
          { file: 'jana-nayagan-truth-watches', w: 1067, h: 1600, tone: '#4b1e17', title: 'When the truth watches', alt: 'Jana Nayagan poster: Vijay in sunglasses behind a red curtain, there is no appeal when the truth watches' },
          { file: 'jana-nayagan-vetri-kondan', w: 1067, h: 1600, tone: '#471c1d', title: 'Thalapathy Vetri Kondan', alt: 'Jana Nayagan poster: Vijay in sunglasses before giant red title letters' },
          { file: 'jana-nayagan-will-speak-soon', w: 1126, h: 1600, tone: '#6d4934', title: 'Jana Nayagan will speak soon', alt: 'Jana Nayagan poster: Vijay seated in thought, when the voice is strong, silence is demanded' },
        ] },
      ],
    },
    {
      id: 'lik', title: 'LIK', year: 2026, cover: 'lik-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'lik-main-01', w: 1067, h: 1600, tone: '#8aacaa', alt: 'LIK tribute poster' },
        ] },
      ],
    },
    {
      id: '96', title: '96', year: 2025, cover: '96-remembered-us',
      groups: [
        { name: 'Main posters', items: [
          { file: '96-remembered-us', w: 1066, h: 1600, tone: '#988e79', title: 'Remembered us', alt: '96 tribute poster in faded green: the older couple in profile above their school-days selves' },
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
      id: 'retro', title: 'Retro', year: 2025, cover: 'retro-may-one',
      groups: [
        { name: 'Main posters', items: [
          { file: 'retro-may-one', w: 1137, h: 1600, tone: '#7e7472', title: 'The one from May one', alt: 'Retro poster: Suriya in sunglasses above his younger self, the one from May one' },
          { file: 'retro-pure-love', w: 1067, h: 1600, tone: '#6e7569', title: 'Only pure love', alt: 'Retro poster in soft blue: a couple resting on stone steps, in my heart there is only pure love' },
        ] },
      ],
    },
    {
      id: 'once-more', title: 'Once More', year: 2025, cover: 'once-more-almost-lovers',
      groups: [
        { name: 'Main posters', items: [
          { file: 'once-more-friendship', w: 1094, h: 1600, tone: '#9a5b39', title: 'Love and friendship', alt: 'Once More poster: torn paper halves of two friends with tulips, I thought love would ruin our friendship' },
          { file: 'once-more-almost-lovers', w: 1091, h: 1600, tone: '#978d8e', title: 'Almost friends, almost lovers', alt: 'Once More poster: a couple inside a polaroid frame, almost friends, almost lovers' },
          { file: 'once-more-love-stands-quietly', w: 900, h: 1600, tone: '#876f64', title: 'When love stands quietly', alt: 'Once More story poster in blush pink: a couple by a window with carnations' },
        ] },
      ],
    },
    {
      id: 'vidaamuyarchi', title: 'Vidaamuyarchi', year: 2025, cover: 'vidaamuyarchi-efforts-never-fail',
      groups: [
        { name: 'Main posters', items: [
          { file: 'vidaamuyarchi-on-his-path', w: 1113, h: 1600, tone: '#8d8c7d', year: 2024, title: 'On his path', alt: 'Vidaamuyarchi poster: Ajith Kumar walking with a bag of cash, on his path' },
          { file: 'vidaamuyarchi-efforts-never-fail', w: 1109, h: 1600, tone: '#9a9080', year: 2025, title: 'Efforts never fail', alt: 'Vidaamuyarchi release poster: the cast above a car on a maze, releasing worldwide Feb 06' },
        ] },
      ],
    },
    {
      id: 'kalki', title: 'Kalki 2898 AD', year: 2024, cover: 'kalki-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'kalki-main-01', w: 1120, h: 1600, tone: '#9a7250', motion: true, alt: 'Kalki 2898 AD tribute poster' },
        ] },
      ],
    },
    {
      id: 'indian2', title: 'Indian 2', year: 2024, cover: 'indian2-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'indian2-main-01', w: 1023, h: 1600, tone: '#9a8979', title: 'Worldwide release, stamp edition', alt: 'Indian 2 tribute poster' },
          { file: 'indian2-release-day', w: 1023, h: 1600, tone: '#d2cfd1', title: 'Worldwide releasing today', alt: 'Indian 2 release poster on white: Kamal Haasan in a white coat above a red reflection, worldwide releasing today' },
        ] },
        { name: 'Character posters', items: [
          { file: 'indian2-veerasekaran', w: 1600, h: 901, tone: '#c3ab77', title: 'Veerasekaran', alt: 'Indian 2 character banner: Veerasekaran with an axe in a golden desert, here comes a one man army' },
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
      id: 'raayan', title: 'Raayan', year: 2024, cover: 'raayan-now-in-cinemas',
      groups: [
        { name: 'Main posters', items: [
          { file: 'raayan-now-in-cinemas', w: 1024, h: 1600, tone: '#5d1d1d', title: 'Now in cinemas', alt: 'Raayan poster in red: Dhanush framed by giant serif title letters, now in cinemas' },
        ] },
      ],
    },
    {
      id: 'captain-miller', title: 'Captain Miller', year: 2024, cover: 'captain-miller-now-in-cinemas',
      groups: [
        { name: 'Main posters', items: [
          { file: 'captain-miller-now-in-cinemas', w: 1054, h: 1600, tone: '#9f8365', title: 'Now in cinemas', alt: 'Captain Miller poster: Dhanush firing a rocket launcher above a burning battlefield' },
        ] },
      ],
    },
    {
      id: 'thug-life', title: 'Thug Life', year: 2023, cover: 'thug-life-first-look',
      groups: [
        { name: 'Main posters', items: [
          { file: 'thug-life-first-look', w: 1054, h: 1600, tone: '#948d88', title: 'First look', alt: 'Thug Life poster: Kamal Haasan with a bandaged hand raised towards the camera' },
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
    {
      id: 'jawan', title: 'Jawan', year: 2023, cover: 'jawan-release-today',
      groups: [
        { name: 'Main posters', items: [
          { file: 'jawan-release-today', w: 1167, h: 1600, tone: '#9c8f75', title: 'Worldwide release today', alt: 'Jawan poster: every look of Shah Rukh Khan in coloured panels above a V of action scenes' },
        ] },
      ],
    },
    {
      id: 'varisu', title: 'Varisu', year: 2023, cover: 'varisu-new-year-blue',
      note: 'Eleven posters across the whole release, from the first look to the blockbuster run, with the Telugu version, Vaarasudu.',
      groups: [
        { name: 'Main posters', items: [
          { file: 'varisu-the-boss-returns', w: 1099, h: 1600, tone: '#878877', year: 2022, title: 'The boss returns', alt: 'Varisu poster: Vijay with a backpack in the door of a train, the boss returns' },
          { file: 'varisu-audio-launch', w: 1096, h: 1600, tone: '#8a7370', year: 2022, title: 'Grand audio launch', alt: 'Varisu poster in violet: Vijay on stage before a crowd, grand audio launch today at 4 PM' },
          { file: 'varisu-new-year-blue', w: 1096, h: 1600, tone: '#79786c', year: 2022, title: 'Happy New Year, blue', alt: 'Varisu New Year poster in blue: Vijay seated on a car, worldwide Pongal release' },
          { file: 'varisu-new-year-gold', w: 1096, h: 1600, tone: '#99734d', year: 2022, title: 'Happy New Year, gold', alt: 'Varisu New Year poster in gold: Vijay with a finger to his lips, worldwide Pongal release' },
          { file: 'varisu-trailer-day', w: 1067, h: 1600, tone: '#c5b48e', year: 2023, title: 'Trailer from today', alt: 'Varisu poster: a smiling Vijay over a forest road, trailer from today at 5 PM' },
        ] },
        { name: 'Song posters', items: [
          { file: 'varisu-ranjithame', w: 1056, h: 1600, tone: '#e1a6a2', year: 2022, title: 'Ranjithame', alt: 'Varisu song poster in pink: Vijay and Rashmika Mandanna among roses, Ranjithame out now' },
          { file: 'varisu-thee-thalapathy', w: 1067, h: 1600, tone: '#5a3e1a', year: 2022, title: 'Thee Thalapathy', alt: 'Varisu song poster: a silhouette in flames, Thee Thalapathy, second single tomorrow at 4 PM' },
          { file: 'varisu-soul-of-varisu', w: 1067, h: 1600, tone: '#a1b5b6', year: 2022, title: 'Soul of Varisu', alt: 'Varisu song poster: Vijay walking with a backpack under a blue sky, it\'s for you Amma' },
        ] },
        { name: 'Release posters', items: [
          { file: 'varisu-pongal-release', w: 1067, h: 1600, tone: '#ad9071', year: 2022, title: 'Worldwide Pongal release', alt: 'Varisu release poster: Vijay on a car above a mirrored city, worldwide Pongal release' },
          { file: 'varisu-sankranthi-release', w: 1067, h: 1600, tone: '#b09375', year: 2022, title: 'Vaarasudu, Sankranthi release', alt: 'Vaarasudu release poster for the Telugu version: Vijay in a suit, worldwide Sankranthi release' },
          { file: 'varisu-blockbuster', w: 1067, h: 1600, tone: '#527f9b', year: 2023, title: 'Blockbuster hit', alt: 'Varisu poster in blue: Vijay seated with a finger to his lips, blockbuster hit, book your tickets now' },
        ] },
      ],
    },
    {
      id: 'thunivu', title: 'Thunivu', year: 2022, cover: 'thunivu-chilla-chilla',
      groups: [
        { name: 'Main posters', items: [
          { file: 'thunivu-chilla-chilla', w: 1067, h: 1600, tone: '#786254', title: 'Chilla Chilla, first single', alt: 'Thunivu poster: Ajith Kumar in close-up, no guts no glory, first single Chilla Chilla' },
        ] },
      ],
    },
    {
      id: 'ps1', title: 'PS-1', year: 2022, cover: 'ps1-main-01',
      groups: [
        { name: 'Main posters', items: [
          { file: 'ps1-main-01', w: 1062, h: 1600, tone: '#88694f', title: 'The Cholas are coming, one', alt: 'Ponniyin Selvan: Part 1 tribute poster' },
          { file: 'ps1-cholas-two', w: 1062, h: 1600, tone: '#6e4c37', title: 'The Cholas are coming, two', alt: 'Ponniyin Selvan: Part 1 poster in sepia: the cast before a palace, arms spread in the centre' },
          { file: 'ps1-cholas-three', w: 1056, h: 1600, tone: '#8e6644', title: 'The Cholas are coming, three', alt: 'Ponniyin Selvan: Part 1 poster in sepia: Vikram with a sword above the cast and a palace' },
        ] },
      ],
    },
    {
      id: 'liger', title: 'Liger', year: 2022, cover: 'liger-saala-crossbreed',
      groups: [
        { name: 'Main posters', items: [
          { file: 'liger-saala-crossbreed', w: 1056, h: 1600, tone: '#856242', title: 'Saala crossbreed', alt: 'Liger poster: Vijay Deverakonda mid-swing in a dusty ring, worldwide release on Aug 25' },
        ] },
      ],
    },
    {
      id: 'vikram', title: 'Vikram', year: 2022, cover: 'vikram-all-time-record',
      groups: [
        { name: 'Main posters', items: [
          { file: 'vikram-evil-is-coming', w: 1080, h: 1600, tone: '#9e8a85', title: 'Evil is coming', alt: 'Vikram poster on white: Vijay Sethupathi in a striped shirt over a red brush stroke, evil is coming' },
          { file: 'vikram-all-time-record', w: 1056, h: 1600, tone: '#d9ab68', title: 'All-time record', alt: 'Vikram poster: the four leads in fire above crossed rifles, all-time record' },
          { file: 'vikram-streaming', w: 1080, h: 1600, tone: '#793d1f', title: 'Streaming from July 8', alt: 'Vikram streaming poster: the cast in a ring of rifles, streaming from July 8' },
        ] },
      ],
    },
    {
      id: 'maaveeran', title: 'Maaveeran', year: 2022, cover: 'maaveeran-shoot-begins',
      groups: [
        { name: 'Main posters', items: [
          { file: 'maaveeran-shoot-begins', w: 1056, h: 1600, tone: '#7b5c48', title: 'Shoot begins soon', alt: 'Maaveeran poster: Sivakarthikeyan as three hanging portraits, shoot begins soon' },
        ] },
      ],
    },
    {
      id: 'ntr-30', title: 'NTR 30 (Devara)', year: 2022, cover: 'ntr-30-birthday',
      groups: [
        { name: 'Main posters', items: [
          { file: 'ntr-30-birthday', w: 1080, h: 1600, tone: '#464444', title: 'Happy birthday NTR', alt: 'NTR 30 poster: a lone figure with a blade before giant 30 numerals and a red sea' },
        ] },
      ],
    },
    {
      id: 'beast', title: 'Beast', year: 2022, cover: 'beast-hunting-began',
      groups: [
        { name: 'Main posters', items: [
          { file: 'beast-hunting-began', w: 1120, h: 1600, tone: '#6b473e', title: 'Beast hunting began', alt: 'Beast poster: Vijay with a rifle in a burning frame, beast hunting began' },
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
        { file: 'enchante-social-01', type: 'social', w: 1280, h: 1600, tone: '#33170c', title: 'Coming soon', alt: 'Enchanté social media post: coming soon' },
        { file: 'enchante-social-02', type: 'social', w: 1280, h: 1600, tone: '#64554c', title: 'Date reveal', alt: 'Enchanté date reveal: 02 September, painted on an old fresco wall' },
        { file: 'enchante-social-03', type: 'social', w: 1280, h: 1600, tone: '#563d2a', title: 'Registration open', alt: 'Enchanté social media post: the canvas is yours, registration open' },
        { file: 'enchante-social-04', type: 'social', w: 1280, h: 1600, tone: '#c0ab92', title: 'Registration countdown, three', alt: 'Enchanté countdown post: registration closes in 3 days' },
        { file: 'enchante-social-05', type: 'social', w: 1280, h: 1600, tone: '#bfaa91', title: 'Registration countdown, two', alt: 'Enchanté countdown post: registration closes in 2 days' },
        { file: 'enchante-social-06', type: 'social', w: 1280, h: 1600, tone: '#c0ab94', title: 'Registration countdown, one', alt: 'Enchanté countdown post: registration closes in 1 day' },
        { file: 'enchante-social-07', type: 'social', w: 1280, h: 1600, tone: '#4a3d2b', title: 'Registration reminder', alt: 'Enchanté social media post: what if your greatest story has never been spoken? Register today' },
        { file: 'enchante-social-08', type: 'social', w: 1280, h: 1600, tone: '#b39e8a', title: 'Registration closed', alt: 'Enchanté social media post: registrations are now closed' },
        { file: 'enchante-social-09', type: 'social', w: 1280, h: 1600, tone: '#3c3026', title: 'Judge: Dharshan Thavaraja', alt: 'Enchanté guest feature: actor and distinguished judge Dharshan Thavaraja in a painter\'s studio' },
        { file: 'enchante-social-10', type: 'social', w: 1280, h: 1600, tone: '#514135', title: 'Judge: Duleeka Marapana', alt: 'Enchanté guest feature: actress and distinguished judge Duleeka Marapana holding a palette' },
        { file: 'enchante-social-11', type: 'social', w: 1280, h: 1600, tone: '#564d49', title: 'Performers: Shehan Meshak and Umesh Umayanga', alt: 'Enchanté guest feature: Shehan Meshak on guitar and Umesh Umayanga singing before a crowd' },
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
        { file: 'admeliora-26-social-01', type: 'social', w: 1280, h: 1600, tone: '#28251d', title: 'Coming soon', alt: 'ADMELIORA\'26 social media post: who will take the stage? Coming soon' },
        { file: 'admeliora-26-social-02', type: 'social', w: 1280, h: 1600, tone: '#473822', title: 'Teaser', alt: 'ADMELIORA\'26 teaser post: the voices that move us' },
        { file: 'admeliora-26-social-03', type: 'social', w: 1280, h: 1600, tone: '#4b3f33', title: 'Title reveal', alt: 'ADMELIORA\'26 title reveal: the conversation has a name, a panel on a lit stage' },
        { file: 'admeliora-26-social-04', type: 'social', w: 1280, h: 1600, tone: '#363020', title: 'Date reveal', alt: 'ADMELIORA\'26 date reveal: 20th September' },
        { file: 'admeliora-26-social-05', type: 'social', w: 1280, h: 1600, tone: '#443928', title: 'Guess the guests', alt: 'ADMELIORA\'26 social media post: guess the guests' },
        { file: 'admeliora-26-social-06', type: 'social', w: 1200, h: 1600, tone: '#5d4629', title: 'Guest: Chethana Ketagoda', alt: 'ADMELIORA\'26 guest feature: voice artiste and singer Chethana Ketagoda' },
        { file: 'admeliora-26-social-07', type: 'social', w: 1200, h: 1600, tone: '#55422a', title: 'Guest: Dhanika Perera', alt: 'ADMELIORA\'26 guest feature: entrepreneur Dhanika Perera' },
        { file: 'admeliora-26-social-08', type: 'social', w: 1200, h: 1600, tone: '#5a482e', title: 'Guest: Dilantha Malagamuwa', alt: 'ADMELIORA\'26 guest feature: racing driver Dilantha Malagamuwa' },
        { file: 'admeliora-26-social-09', type: 'social', w: 1200, h: 1600, tone: '#6a5636', title: 'Guest: Janith Perera', alt: 'ADMELIORA\'26 guest feature: entertainment entrepreneur Janith Perera' },
        { file: 'admeliora-26-social-10', type: 'social', w: 1200, h: 1600, tone: '#664e2f', title: 'Guest: Kristaleena Wijesinghe', alt: 'ADMELIORA\'26 guest feature: educator Kristaleena Wijesinghe' },
        { file: 'admeliora-26-social-11', type: 'social', w: 1200, h: 1600, tone: '#523f28', title: 'Guest: Vinuja Rathnayake', alt: 'ADMELIORA\'26 guest feature: singer and musician Vinuja Rathnayake' },
        { file: 'admeliora-26-social-12', type: 'social', w: 1200, h: 1600, tone: '#654e33', title: 'Guest: Samaakhya Gajanayake', alt: 'ADMELIORA\'26 guest feature: fitness coach and former national athlete Samaakhya Gajanayake' },
      ],
    },
  ],

  /* ---------------- Concepts ----------------
     Concept posters and concept art, newest first. Finished pieces only: no sketches, process boards or screenshots. */
  concepts: [
    { file: 'concept-nanda-malini', w: 1067, h: 1600, tone: '#908b8a', year: 2026, title: 'Nanda Malini tribute', medium: 'Tribute poster', alt: 'Tribute poster for Nanda Malini, 1943 to 2026: her portrait beside her younger self, a young musician with a sitar below' },
    { file: 'concept-1948', w: 1067, h: 1600, tone: '#9a7d5e', year: 2026, title: '1948', medium: 'Independence Day poster', alt: 'Independence Day poster: an elder in a suit, fist on his heart, above the old parliament and a village, 1948' },
    { file: 'concept-year-after-the-fall', w: 1073, h: 1600, tone: '#716952', year: 2025, title: 'The Year After the Fall', medium: 'New Year concept poster', alt: 'New Year concept poster: a man in a ruined, overgrown Colombo beneath the Lotus Tower and the numbers 2026' },
    { file: 'concept-darkensoul', w: 1067, h: 1600, tone: '#5a4f45', year: 2025, title: 'Darkensoul', medium: 'Concept art', alt: 'Darkensoul concept art: a golden dragon coiled around a portrait under a yellow moon, above a strip of film posters' },
    { file: 'concept-whale-dance', w: 1030, h: 1600, tone: '#5e8b95', year: 2024, title: 'Whale Dance', medium: 'Concept poster', alt: 'Whale Dance concept poster: a humpback whale beneath a split ocean surface, gulls and islands above' },
    { file: 'concept-tools-bar', w: 1200, h: 1200, tone: '#657c62', year: 2023, title: 'The tools bar', medium: 'Studio artwork', alt: 'Studio artwork: a chameleon in a rainforest grown around a Photoshop tools bar and a laptop' },
    { file: 'concept-rockstar', w: 1056, h: 1600, tone: '#934e26', year: 2023, title: 'Rockstar Anirudh', medium: 'Concert poster', alt: 'Concert poster: Anirudh with a raised fist and a guitar before a blazing crowd, streaming live on Oct 21' },
    { file: 'vijayism-01', w: 1068, h: 1600, tone: '#6c5b36', year: 2022, title: '30 Years of Vijayism', medium: 'Tribute poster', alt: 'The 30 Years of Vijayism tribute poster: the actor seated in a vintage green room beneath a gilded portrait of himself, surrounded by small details from his career', note: 'Featured on Thanthi TV, Indian television. Every object in the room is a hidden detail.', link: { href: '../vijayism-piece.html', label: 'Read the full story' } },
    { file: 'vijayism-02', w: 1067, h: 1600, tone: '#c6895b', year: 2022, title: '30 Years of Vijayism, the walk', medium: 'Tribute poster', alt: 'Second 30 Years of Vijayism poster in warm gold: Vijay walking out of a tunnel with characters from his films' },
    { file: 'concept-rolex-day-date', w: 1130, h: 1600, tone: '#ebd7bb', year: 2022, title: 'Rolex Day-Date 40', medium: 'Product poster', alt: 'Rolex Day-Date 40 poster: a hand-drawn gold watch on warm bokeh, Hand Made', note: 'First place out of 200 entries.', link: { href: '../rolex-design.html', label: 'The watch study' } },
  ],

  /* ---------------- Social ----------------
     One collection per client or set of clients. Group names become the label of each post. No logos here. */
  social: [
    {
      id: 'saagara', title: 'Saagara Seafoods', client: 'Saagara Seafoods (Pvt) Ltd', year: 2026, cover: 'saagara-social-01',
      note: 'Social media for a seafood market: the page cover, a grand opening, everyday market posts and a year of festive greetings.',
      groups: [
        { name: 'The page', items: [
          { file: 'saagara-banner-01', w: 851, h: 360, tone: '#493834', title: 'Page cover', alt: 'Saagara Seafoods page cover: fresh fish, prawns and squid beside the brand name' },
        ] },
        { name: 'Grand opening', items: [
          { file: 'saagara-social-01', w: 1200, h: 1500, tone: '#c69f8f', title: 'Grand opening invitation', alt: 'Grand opening invitation framed by hand-drawn fish, lobsters and squid' },
          { file: 'saagara-social-02', w: 1200, h: 1500, tone: '#a4a195', title: 'One day to go', alt: 'A hand lifts a fresh fish from the sea: one day to go' },
          { file: 'saagara-social-03', w: 1200, h: 1500, tone: '#81919e', title: 'Opening day', alt: 'A smiling fisherman greets the morning by the sea on opening day' },
        ] },
        { name: 'At the market', items: [
          { file: 'saagara-social-04', w: 1200, h: 1500, tone: '#706a65', title: 'Today\'s price list', alt: 'Today\'s fish price list on a chalkboard at a seaside market stall' },
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
    {
      id: 'tuition-classes', title: 'Tuition classes', year: 2023, cover: 'lahiru-silva-cash-book-dark',
      note: 'Class launches, new units and free seminars for two commerce teachers, mostly in Sinhala.',
      groups: [
        { name: 'Lahiru Silva', items: [
          { file: 'lahiru-silva-business-accounting', w: 720, h: 864, tone: '#a8bd6a', title: 'Business and Accounting Studies', alt: 'Sinhala class post: Lahiru Silva reading a book on a green field, O/L Business and Accounting Studies' },
          { file: 'lahiru-silva-accounting-intro', w: 864, h: 806, tone: '#4694b2', title: 'New unit: introduction to accounting', alt: 'Sinhala class post in blue: Lahiru Silva at a laptop, a new unit on the introduction to accounting' },
          { file: 'lahiru-silva-double-entry', w: 1080, h: 1080, tone: '#cecaba', title: 'New unit: double entry', alt: 'Sinhala class post on cream: Lahiru Silva with a book, a new unit on double entry' },
          { file: 'lahiru-silva-cash-book-light', w: 720, h: 984, tone: '#d3bc92', title: 'Free seminar: the cash book, light', alt: 'Sinhala seminar post in cream: the cash book covered in five hours, free, 29 October' },
          { file: 'lahiru-silva-cash-book-dark', w: 720, h: 984, tone: '#443828', title: 'Free seminar: the cash book, dark', alt: 'Sinhala seminar post in dark brown: the cash book covered in five hours, free, 29 October' },
          { file: 'lahiru-silva-third-term', w: 1080, h: 1080, tone: '#b09167', title: 'Third term: bank reconciliation', alt: 'Sinhala class post in purple and gold: the third term begins with bank reconciliation, 26 November' },
          { file: 'lahiru-silva-grade-10-red', w: 918, h: 1080, tone: '#c99796', title: 'Grade 10 class, 2024, red', alt: 'Sinhala class post in red: new grade 10 class for 2024, starting 06 January' },
          { file: 'lahiru-silva-grade-10-chess', w: 1352, h: 1144, tone: '#a09694', title: 'Grade 10 class, 2024, chess', alt: 'Sinhala class post with chess pieces: new grade 10 commerce class for 2024' },
        ] },
        { name: 'Chathura Silva', items: [
          { file: 'chathura-silva-2024-theory', w: 1200, h: 1080, tone: '#7894c9', title: 'A/L Business Studies, 2024 theory', alt: 'Class post in blue: Chathura Silva with arms crossed, 2024 A/L Business Studies theory' },
          { file: 'chathura-silva-2025-theory', w: 1500, h: 1080, tone: '#5979c8', title: 'A/L Business Studies, 2025 theory', alt: 'Class post in blue: Chathura Silva beside the details of a new 2025 A/L Business Studies theory class' },
        ] },
      ],
    },
    {
      id: 'local-businesses', title: 'Local businesses', year: 2023, cover: 'rs-travel-airport-service',
      note: 'Service and product posts for small local businesses.',
      groups: [
        { name: 'RS Travel & Tour', items: [
          { file: 'rs-travel-airport-service', w: 1600, h: 1600, tone: '#a9847b', title: 'Airport drop or pick-up', alt: 'RS Travel & Tour post in red and yellow: two vans and a plane, airport drop or pick-up service' },
        ] },
        { name: 'Black Teak', items: [
          { file: 'black-teak-pantry-cupboard', w: 720, h: 720, tone: '#9d8b79', title: 'Board and teak pantry cupboard', alt: 'Black Teak post: pantry cupboard doors and a five-year warranty seal, now in Batticaloa' },
        ] },
      ],
    },
  ],

  /* ---------------- Print ----------------
     Printed work: book covers and the like. Group names become each piece's label. */
  print: [
    {
      id: 'tuition-covers', title: 'Tuition book covers', year: 2023, cover: 'cover-biology-a-level',
      note: 'Wraparound covers, back and front, for tutors\' O/L and A/L class books.',
      groups: [
        { name: 'Science', items: [
          { file: 'cover-biology-a-level', w: 1600, h: 1138, tone: '#3d5a6e', title: 'A/L Biology', alt: 'Wraparound A/L Biology book cover for Dhanushka Thilakarathna: DNA, a microscope and a cell in deep blue' },
          { file: 'cover-biology-grade-12', w: 1600, h: 1138, tone: '#d9cfb4', title: 'Biology, grade 12', alt: 'Wraparound grade 12 Biology cover: the evolution of early humans on cream with a hexagon pattern' },
          { file: 'cover-science-grade-11', w: 1600, h: 1138, tone: '#db4a47', title: 'Science, grade 11', alt: 'Wraparound grade 11 Science cover in red: a magnifying glass over a brain, a microscope and the human body' },
          { file: 'cover-agriculture-grade-13', w: 1600, h: 1138, tone: '#7bb285', title: 'Agriculture Science, grade 13', alt: 'Wraparound grade 13 Agriculture Science cover in green: fields, a farmer and a giant numeral 2' },
        ] },
        { name: 'Business Studies', items: [
          { file: 'cover-business-studies-coffee', w: 1600, h: 1138, tone: '#65482d', title: 'A/L Business Studies, coffee', alt: 'Wraparound A/L Business Studies cover for Maleesha Silva, built from coffee beans and cups' },
          { file: 'cover-business-studies-journey', w: 1600, h: 1138, tone: '#8e7531', title: 'A/L Business Studies, the journey', alt: 'Wraparound A/L Business Studies cover for Kasun Fernando in yellow and black: success is a journey, not a destination' },
        ] },
        { name: 'Maths', items: [
          { file: 'cover-maths-grades-6-11', w: 1600, h: 1138, tone: '#667065', title: 'Super maths class, grades 6 to 11', alt: 'Wraparound Sinhala maths cover for Avishka J. Abeysekara in teal and purple: two children with flowers' },
        ] },
      ],
    },
  ],
};
