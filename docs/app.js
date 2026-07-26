/* AurApp — all the behaviour.
   Data lives in localStorage, which persists for a home-screen web app
   (Safari's 7-day eviction only applies to plain browser tabs). */

'use strict';

// ---------------------------------------------------------------- state

/* Each world carries a few suggested searches rather than a list of video
   ids. Ids cannot be checked without calling YouTube, and a wrong one does
   not fail — it quietly plays a different video. Searches, by contrast, run
   against today's catalogue with safe search on, and the parent approves
   whatever comes back. */
const WORLDS = [
  { id: 'songs', name: 'Canciones', icon: '🎵', color: '#CECBF6', searches: [
    'canciones infantiles en español',
    'rondas infantiles tradicionales',
    'canciones para bailar niños'
  ] },
  { id: 'animals', name: 'Animales', icon: '🐾', color: '#9FE1CB', searches: [
    'animales de la granja para niños',
    'sonidos de los animales para niños',
    'animales del mar para niños'
  ] },
  { id: 'learning', name: 'Aprender', icon: '🔤', color: '#FAC775', searches: [
    'aprender los colores en español para niños',
    'aprender los números del 1 al 10 para niños',
    'el abecedario para niños en español'
  ] },
  { id: 'unicorns', name: 'Unicornios', icon: '✨', color: '#F4C0D1', searches: [
    'unicornios para niños',
    'cuentos de unicornios en español',
    'canciones de unicornios para niños'
  ] },
  { id: 'bedtime', name: 'Dormir', icon: '🌙', color: '#B5D4F4', searches: [
    'canciones de cuna para bebés',
    'cuentos para dormir niños en español',
    'música relajante para dormir niños'
  ] },
  { id: 'favorites', name: 'Favoritos', icon: '⭐️', color: '#F5C4B3' }
];

const PALETTE = ['#E24B4A', '#EF9F27', '#FAC775', '#97C459', '#1D9E75',
                 '#378ADD', '#7F77DD', '#D4537E', '#D85A30', '#2C2C2A'];

const PER_PAGE = 6;

/* Palettes. The app started out pink and purple; this lets it be re-tinted
   without touching a single component. Artwork stays as it is — only the
   chrome changes. */
const THEMES = [
  { id: 'unicorn', name: 'Unicornio',
    vars: { '--bg-main':'#FBEAF0', '--bg-alt':'#EEEDFE', '--bg-paint':'#E7F4EF',
            '--bg-plain':'#F5F5F4', '--ink':'#26215C', '--accent':'#D4537E',
            '--accent-soft':'#F4C0D1', '--accent-strong':'#E86A9A',
            '--accent-2':'#CECBF6', '--ok':'#1D9E75',
            '--door-1':'#9FE1CB', '--door-2':'#FAC775', '--stage-deep':'#3C3489' },
    tiles: ['#CECBF6','#9FE1CB','#FAC775','#F4C0D1','#B5D4F4','#F5C4B3',
            '#F4C0D1','#E8C9A0','#B5D4F4','#C0DD97','#9FE1CB'] },

  { id: 'ocean', name: 'Mar',
    vars: { '--bg-main':'#E3F0FA', '--bg-alt':'#E6F2EC', '--bg-paint':'#E8F3F6',
            '--bg-plain':'#F4F6F7', '--ink':'#12324C', '--accent':'#2E7EB8',
            '--accent-soft':'#A9D6EF', '--accent-strong':'#3B93D2',
            '--accent-2':'#BFE2D5', '--ok':'#1D9E75',
            '--door-1':'#9AD8C4', '--door-2':'#F3C77A', '--stage-deep':'#1B4B6E' },
    tiles: ['#A9D6EF','#9AD8C4','#F3C77A','#BFD8F0','#7FC4E8','#F0B79A',
            '#8FD0E8','#D9C7A6','#A9D6EF','#B6D98F','#9AD8C4'] },

  { id: 'forest', name: 'Bosque',
    vars: { '--bg-main':'#EFF4E6', '--bg-alt':'#E9F1E4', '--bg-paint':'#EAF2E8',
            '--bg-plain':'#F5F6F2', '--ink':'#263A22', '--accent':'#5E9440',
            '--accent-soft':'#C4E0A8', '--accent-strong':'#6EA84C',
            '--accent-2':'#DCCFA8', '--ok':'#1D9E75',
            '--door-1':'#AFD9A0', '--door-2':'#EFC97E', '--stage-deep':'#2E4A28' },
    tiles: ['#C4E0A8','#AFD9A0','#EFC97E','#E0CBA0','#BBD9C6','#E8B98E',
            '#D6E3B0','#D9C4A0','#BBD9C6','#AFD9A0','#C9E2B4'] }
];


/* The worlds that are not video. Any of them can be switched off from the
   parent panel — hidden, not deleted, so turning one back on is one tap. */
/* ------------------------------------------------------------------ build

   One switch decides whether this build has the video worlds at all.

   The Android build ships with VIDEOS off: no YouTube player, no parent panel
   for links, only the games and the drawings. That keeps the app out of the
   third-party-content rules of Google Play's family programme, and it means
   there is nothing in it that can break when someone else's video is taken
   down. Flip it back to true for the iPad PWA.

   Everything downstream reads BUILD.videos — do not add a second flag. */

const BUILD = {
  videos: true,

  /* The paid half. When `locked` is true the premium worlds simply are not on
     her screen — no padlocks, no greyed-out tiles, no "ask your parents".

     That is a deliberate rule, not a shortcut: a four-year-old who taps a
     locked tile learns that the app ignores her, and the parent gets an app
     that nags a child for money. Google's family policy asks for the same
     thing from the other side — any purchase has to sit behind a parental
     gate. Ours is the PIN panel that already exists.

     Flipping `locked` to true is all the child-facing side of the paywall
     needs. The buying itself belongs in the parent panel, and only makes
     sense once there is a Play build to buy it in. */
  premiumLocked: false
};

/* `premium: true` marks a world as part of the paid upgrade. The free half is
   whole on its own — drawing, the three pets and two games — so nobody feels
   handed a demo. Nothing inside a world is ever crippled; worlds are sold
   entire, because a pet she can dress but not feed reads as broken, not as an
   invitation to buy. */
const EXTRA_WORLDS = [
  { id: 'paint',  name: 'Pintar',    sub: '22 dibujos',            icon: '🎨' },
  { id: 'pets',   name: 'Amigos',    sub: 'Capi, Michi y Coneja',  icon: '🐹' },
  { id: 'worm',   name: 'El gusanito', sub: 'Come las naranjas',   icon: '🐛' },
  { id: 'bugs',   name: 'Los mosquitos', sub: 'Atrápalos con el dedo', icon: '🦟' },
  { id: 'fish',   name: 'A pescar',   sub: 'Llena el balde',        icon: '🎣' },

  { id: 'camera', name: 'Fotos',     sub: 'Con disfraces',         icon: '📷', premium: true },
  { id: 'story',  name: 'El lobo',   sub: 'y los tres cerditos',   icon: '🐺', premium: true },
  { id: 'forest', name: 'El bosque', sub: 'Juguemos con el lobo',  icon: '🌲', premium: true },
  { id: 'count',  name: 'Los números',  sub: 'Contar del 1 al 9',   icon: '🔢', premium: true },
  { id: 'match',  name: 'Une la flecha', sub: 'Del grupo a su número', icon: '➡️', premium: true }
];

function applyTheme(id) {
  const theme = THEMES.find(t => t.id === id) || THEMES[0];
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => root.style.setProperty(key, value));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.vars['--bg-main']);
  return theme;
}

function currentTheme() {
  return THEMES.find(t => t.id === state.theme) || THEMES[0];
}



const PET_DEFAULT = () => {
  const fresh = {};
  PET_SPECIES.forEach(id => {
    fresh[id] = { fur: PET_FURS[id][0], outfit: 'none', acc: {}, full: 40 };
  });
  return fresh;
};

const DEFAULTS = { videos: [], limit: 30, pin: '1234', seconds: 0, day: '',
                   theme: 'unicorn', ytKey: '', hidden: { camera: true }, pets: PET_DEFAULT(),
                   // '' means «whatever the device speaks»; a code pins it.
                   lang: '', sound: true };

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('aurapp') || '{}');
    const merged = Object.assign({}, DEFAULTS, saved);
    // Lists saved before the friends existed have no pets key.
    // Saved lists predate the rabbit, so fill in any species that is missing
    // rather than replacing what she has already dressed.
    merged.hidden = Object.assign({}, saved.hidden || DEFAULTS.hidden);
    merged.pets = Object.assign(PET_DEFAULT(), saved.pets || {});
    PET_SPECIES.forEach(id => {
      if (!merged.pets[id]) merged.pets[id] = { fur: PET_FURS[id][0], outfit: 'none', acc: {}, full: 40 };
      if (!merged.pets[id].acc) merged.pets[id].acc = {};
    });
    return merged;
  } catch (e) {
    return Object.assign({}, DEFAULTS);
  }
}

function save() {
  localStorage.setItem('aurapp', JSON.stringify(state));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rollover() {
  if (state.day !== today()) {
    state.day = today();
    state.seconds = 0;
    save();
  }
}

function minutesLeft() {
  if (!state.limit) return null;
  return Math.max(0, state.limit - Math.floor(state.seconds / 60));
}

function outOfTime() {
  return state.limit > 0 && state.seconds >= state.limit * 60;
}

// ------------------------------------------------------------- helpers

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/** Pulls the video ID out of any shape of YouTube link. */
function videoID(text) {
  const t = (text || '').trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  let url;
  try { url = new URL(t); } catch (e) { return null; }
  const v = url.searchParams.get('v');
  if (v && v.length === 11) return v;
  const last = url.pathname.split('/').filter(Boolean).pop();
  return last && last.length === 11 ? last : null;
}

function thumbURL(id) {
  return 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
}

function videosIn(worldID) {
  if (worldID === 'favorites') {
    return state.videos.filter(v => (v.plays || 0) >= 3)
                       .sort((a, b) => (b.plays || 0) - (a.plays || 0))
                       .slice(0, 12);
  }
  return state.videos.filter(v => v.world === worldID);
}

// ------------------------------------------------------------- screens

let current = 'worlds';
let helpCameFrom = 'worlds';

/* How big is this board, in game units?

   The SVG games used to be authored at a fixed size — 440 by 300, say — and
   then letterboxed into whatever space was going. On a phone held upright that
   left a strip of game floating in the middle of an empty screen, which is
   exactly the complaint she would make first.

   So instead the game asks the page how much room it has, and lays itself out
   to fill it. The short side is always `unit` units long and the long side
   grows from there, which keeps everything — a fish, a mosquito, a numeral —
   the same *apparent* size on every screen, while the board itself changes
   shape. The ratio is clamped so a very long screen does not produce a board
   so wide that the game is lost in it. */
function boardBox(el, unit) {
  const r = el ? el.getBoundingClientRect() : { width: 0, height: 0 };
  const w = r.width || 440, h = r.height || 300;
  const ratio = Math.min(2.4, Math.max(1 / 2.4, w / h));
  return ratio >= 1
    ? { w: Math.round(unit * ratio), h: unit }
    : { w: unit, h: Math.round(unit / ratio) };
}

function go(name) {
  if (name === 'help') helpCameFrom = current === 'help' ? helpCameFrom : current;
  if (name === 'worlds' && outOfTime()) name = 'timeup';
  $$('.screen').forEach(s => s.classList.remove('on'));
  $('#s-' + name).classList.add('on');
  current = name;

  if (name === 'worlds') renderWorlds();
  if (name === 'parents') renderParents();
  if (name === 'color') openColoring();
  if (name === 'draw') setupDraw();
  if (name === 'pets') openPets();
  if (name === 'camera') openCamera();
  if (name === 'story') openStory();
  if (name === 'forest') openForest();
  if (name === 'worm') openWorm();
  if (name === 'count') openCounting();
  if (name === 'bugs') openBugs(); else bugStop();
  if (name === 'fish') openFish(); else fishStop();
  if (name === 'match') openMatch();
  if (name !== 'camera') closeCamera();
  if (name !== 'player') stopPlayer();
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-go]');
  if (btn) go(btn.dataset.go);
});

// -------------------------------------------------------------- worlds

function renderWorlds() {
  rollover();
  const left = minutesLeft();
  $('#clockWorlds').style.display = left === null ? 'none' : '';
  if (left !== null) $('#clockWorlds').querySelector('span').textContent = left + ' min';

  const host = $('#worldTiles');
  host.innerHTML = '';
  const tint = currentTheme().tiles;

  /* An empty world is not shown at all. Greyed-out tiles teach a
     four-year-old to keep poking at something that never responds, and on a
     fresh install they filled the screen with dead squares. */
  if (BUILD.videos) WORLDS.forEach((world, i) => {
    const count = videosIn(world.id).length;
    if (count === 0) return;

    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.style.background = tint[i % tint.length];
    tile.innerHTML = '<span class="ico">' + world.icon + '</span>' +
                     '<span class="name">' + t('w.' + world.id) + '</span>' +
                     '<span class="sub">' + count + ' ' + t('bar.videos') + '</span>';
    tile.onclick = () => openWorld(world);
    host.appendChild(tile);
  });

  EXTRA_WORLDS.forEach((extra, i) => {
    if (state.hidden[extra.id]) return;
    if (extra.premium && BUILD.premiumLocked) return;
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.style.background = tint[(6 + i) % tint.length];
    tile.innerHTML = '<span class="ico">' + extra.icon + '</span>' +
                     '<span class="name">' + t('x.' + extra.id) + '</span>' +
                     '<span class="sub">' + t('x.' + extra.id + '.sub') + '</span>';
    tile.onclick = () => go(extra.id);
    host.appendChild(tile);
  });
}

// ---------------------------------------------------------- video grid

let activeWorld = null;
let page = 0;

function openWorld(world) {
  activeWorld = world;
  page = 0;
  go('grid');
  renderGrid();
}

function renderGrid() {
  const list = videosIn(activeWorld.id);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  page = Math.min(page, pages - 1);

  $('#gridTitle').textContent = activeWorld.name;
  const left = minutesLeft();
  $('#clockGrid').style.display = left === null ? 'none' : '';
  if (left !== null) $('#clockGrid').querySelector('span').textContent = left + ' min';

  const grid = $('#videoGrid');
  grid.innerHTML = '';

  list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE).forEach(video => {
    const card = document.createElement('button');
    card.className = 'card';
    card.innerHTML =
      '<div class="thumb"><img loading="lazy" alt="" src="' + thumbURL(video.id) + '">' +
      '<span class="play">▶</span></div>' +
      '<div class="ttl"></div>';
    card.querySelector('.ttl').textContent = video.title;
    card.onclick = () => playVideo(video);
    grid.appendChild(card);
  });

  $('#prevPage').disabled = page === 0;
  $('#nextPage').disabled = page >= pages - 1;

  const dots = $('#pageDots');
  dots.innerHTML = '';
  dots.style.visibility = pages > 1 ? 'visible' : 'hidden';
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('i');
    if (i === page) dot.className = 'on';
    dots.appendChild(dot);
  }
}

$('#prevPage').onclick = () => { if (page > 0) { page--; renderGrid(); } };
$('#nextPage').onclick = () => { page++; renderGrid(); };

// Swiping turns the page too, but there is no free scrolling anywhere.
(() => {
  let startX = null;
  const grid = $('#s-grid');
  grid.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) $('#nextPage').click();
    else if (dx > 50) $('#prevPage').click();
    startX = null;
  }, { passive: true });
})();

// -------------------------------------------------------------- player

let yt = null;          // the YT.Player instance
let ytReady = false;
let ticker = null;
let playing = false;

window.onYouTubeIframeAPIReady = () => { ytReady = true; };

(function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
})();

function playVideo(video) {
  go('player');

  video.plays = (video.plays || 0) + 1;
  save();

  const host = $('#ytHost');
  host.innerHTML = '<div id="ytFrame"></div>';

  const start = () => {
    yt = new YT.Player('ytFrame', {
      videoId: video.id,
      playerVars: {
        playsinline: 1, controls: 0, rel: 0, modestbranding: 1,
        fs: 0, disablekb: 1, iv_load_policy: 3, autoplay: 1
      },
      events: {
        onReady: (e) => { e.target.playVideo(); },
        onStateChange: (e) => {
          playing = e.data === 1;
          $('#playPause').textContent = playing ? '⏸' : '▶';
          // Cover the frame whenever it is not actively playing, so YouTube's
          // pause overlay and end screen never reach her.
          $('#veil').classList.toggle('on', e.data !== 1 && e.data !== 3);
          if (e.data === 0) go('grid');          // ended
        }
      }
    });
  };

  if (ytReady) start();
  else {
    const wait = setInterval(() => {
      if (ytReady) { clearInterval(wait); start(); }
    }, 100);
  }

  clearInterval(ticker);
  ticker = setInterval(() => {
    if (yt && yt.getDuration) {
      const total = yt.getDuration() || 0;
      const now = yt.getCurrentTime() || 0;
      $('#progress').style.width = total ? (now / total * 100) + '%' : '0';
    }
    // Time only burns while the video is actually running.
    if (playing) {
      rollover();
      state.seconds++;
      if (state.seconds % 15 === 0) save();
      if (outOfTime()) { save(); go('timeup'); }
    }
  }, 1000);
}

function stopPlayer() {
  clearInterval(ticker);
  ticker = null;
  playing = false;
  if (yt && yt.destroy) { try { yt.destroy(); } catch (e) {} }
  yt = null;
  $('#ytHost').innerHTML = '';
  $('#progress').style.width = '0';
  $('#veil').classList.remove('on');
  save();
}

$('#playPause').onclick = () => {
  if (!yt) return;
  playing ? yt.pauseVideo() : yt.playVideo();
};
$('#playerHome').onclick = () => go('grid');

// --------------------------------------------------------------- paint

let silhouette = SILHOUETTES[0];
let colorPick = PALETTE[7];
let drawPick = PALETTE[6];

function buildPalette(host, initial, onPick) {
  host.innerHTML = '';
  PALETTE.forEach(color => {
    const swatch = document.createElement('button');
    swatch.className = 'sw' + (color === initial ? ' on' : '');
    swatch.style.background = color;
    swatch.setAttribute('aria-label', 'color');
    swatch.onclick = () => {
      host.querySelectorAll('.sw').forEach(s => s.classList.remove('on'));
      swatch.classList.add('on');
      onPick(color);
    };
    host.appendChild(swatch);
  });
}

// Coloring -------------------------------------------------------------

/* The two categories are shown as pictures, like every other tab in the app.
   The animals borrow the cat drawing, but the places cannot borrow one of
   theirs: every landscape starts with a full-bleed sky rectangle, which as a
   flat silhouette is just a filled square. So they get a purpose-built mark. */
const CATEGORIES = [
  { id: 'animals', name: 'Animales', sample: 'cat' },
  { id: 'places',  name: 'Paisajes', icon:
    '<path d="M20 230 L110 90 L200 230 Z" class="rg"/>' +
    '<path d="M150 230 L226 120 L300 230 Z" class="rg"/>' +
    '<circle cx="248" cy="72" r="34" class="rg"/>' +
    '<path d="M10 236 L310 236" class="rg ln" fill="none" stroke-width="16"/>' }
];

let category = 'animals';

function openColoring() {
  const cats = $('#silCats');
  if (!cats.childElementCount) {
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      const sample = cat.sample ? SILHOUETTES.find(s => s.id === cat.sample) : null;
      btn.className = 'icontab cat' + (cat.id === category ? ' on' : '');
      btn.setAttribute('aria-label', cat.name);
      btn.title = cat.name;
      btn.innerHTML = '<svg viewBox="0 0 320 300" aria-hidden="true">' +
                      (sample ? sample.svg : cat.icon) + '</svg>';
      btn.onclick = () => {
        cats.querySelectorAll('button').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        category = cat.id;
        // Jump to the first drawing of the new category so the canvas
        // never sits on something that is no longer in the strip.
        silhouette = SILHOUETTES.find(s => s.category === category);
        buildPicker();
        drawSilhouette();
      };
      cats.appendChild(btn);
    });
    buildPalette($('#palColor'), colorPick, c => { colorPick = c; });
    buildPicker();
  }
  drawSilhouette();
}

function buildPicker() {
  const picker = $('#silPicker');
  picker.innerHTML = '';
  picker.scrollLeft = 0;

  SILHOUETTES.filter(s => s.category === category).forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'pk' + (item.id === silhouette.id ? ' on' : '');
    btn.innerHTML = '<svg viewBox="0 0 320 300" aria-hidden="true">' + item.svg + '</svg>' +
                    '<span></span>';
    btn.querySelector('span').textContent = item.name;
    btn.onclick = () => {
      picker.querySelectorAll('.pk').forEach(p => p.classList.remove('on'));
      btn.classList.add('on');
      silhouette = item;
      drawSilhouette();
    };
    picker.appendChild(btn);
  });
}

function drawSilhouette() {
  $('#colorTitle').textContent = silhouette.name;
  updateColorResetArt();
  const svg = $('#colorSvg');
  svg.innerHTML = silhouette.svg;

  svg.querySelectorAll('.rg').forEach(region => {
    const isLine = region.classList.contains('ln');
    region.addEventListener('click', () => {
      // Tapping again with another color simply replaces it — that is the
      // undo. A separate undo button is too abstract at four.
      if (isLine) region.style.stroke = colorPick;
      else region.style.fill = colorPick;
    });
  });
}

$('#colorReset').onclick = () => drawSilhouette();

/** Keeps the reset button showing whichever drawing she is on. */
function updateColorResetArt() {
  $('#colorResetArt').innerHTML = silhouette.svg;
}

// Door artwork reuses the unicorn.
$('#doorArt').innerHTML = SILHOUETTES[0].svg;
$('#doorArt').querySelectorAll('.rg').forEach(r => {
  r.style.fill = r.classList.contains('ln') ? 'none' : 'rgba(38,33,92,.16)';
  r.style.stroke = 'rgba(38,33,92,.75)';
  r.style.strokeWidth = '5';
});

// Free drawing ---------------------------------------------------------

const TOOLS = {
  pencil: { width: 4,  alpha: 1    },
  brush:  { width: 22, alpha: 0.75 },
  eraser: { width: 30, alpha: 1    }
};

let tool = 'pencil';
let strokes = [];
let stroke = null;
let ctx = null;

function setupDraw() {
  const canvas = $('#drawCanvas');
  const box = $('#canvasWrap2').getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = box.width * dpr;
  canvas.height = box.height * dpr;
  canvas.style.width = box.width + 'px';
  canvas.style.height = box.height + 'px';

  ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (!$('#palDraw').childElementCount) {
    buildPalette($('#palDraw'), drawPick, c => { drawPick = c; });
  }
  repaint();
}

function repaint() {
  if (!ctx) return;
  const canvas = $('#drawCanvas');
  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  strokes.forEach(paintStroke);
}

function paintStroke(s) {
  ctx.globalAlpha = s.alpha;
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.width;
  ctx.beginPath();
  s.points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  if (s.points.length === 1) ctx.lineTo(s.points[0].x, s.points[0].y);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

(function bindDrawing() {
  const canvas = $('#drawCanvas');

  const at = (e) => {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };

  const begin = (e) => {
    e.preventDefault();
    const spec = TOOLS[tool];
    stroke = {
      points: [at(e)],
      color: tool === 'eraser' ? '#ffffff' : drawPick,
      width: spec.width,
      alpha: spec.alpha
    };
  };

  const move = (e) => {
    if (!stroke) return;
    e.preventDefault();
    stroke.points.push(at(e));
    repaint();
    paintStroke(stroke);
  };

  const end = () => {
    if (stroke) strokes.push(stroke);
    stroke = null;
  };

  canvas.addEventListener('pointerdown', begin);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', end);
})();

$$('.tool[data-tool]').forEach(btn => {
  btn.onclick = () => {
    $$('.tool[data-tool]').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    tool = btn.dataset.tool;
  };
});

$('#undoBtn').onclick = () => { strokes.pop(); repaint(); };
$('#clearDraw').onclick = () => {
  if (confirm(t('draw.confirm'))) { strokes = []; repaint(); }
};

// ------------------------------------------------------------- friends

/* She cannot read, so both rows of tabs are pictures. The friend tabs show
   each animal's own face; the activity tabs show the thing itself — a dress,
   an apple, a moon. Words are kept only as accessible labels. */
const PET_MODES = [
  { id: 'dress', name: 'Vestir', icon: () => PET_CLOTHES[2].draw(PET_CLOTHES[2].color), box: '56 200 190 160' },
  { id: 'feed',  name: 'Comer',  icon: () => '<g transform="translate(30 30) scale(1.15)">' +
                                             PET_FOOD[0].draw() + '</g>', box: '0 0 60 60' },
  { id: 'bath',  name: 'Bañar',  icon: () => '<g transform="translate(0 -18) scale(0.62)">' +
                                             PET_BATH.tub() + '</g>', box: '20 200 260 200' },
  { id: 'play',  name: 'Jugar',  icon: () => '<g transform="translate(40 40)">' +
                                             PET_TOYS[0].draw() + '</g>', box: '0 0 80 80' },
  { id: 'sleep', name: 'Dormir', icon: () =>
      '<path d="M44 12 A26 26 0 1 0 44 56 A21 21 0 0 1 44 12 Z" fill="#F6C64A" stroke="#8A6A12" stroke-width="4"/>' +
      '<circle cx="14" cy="16" r="3" fill="#8A6A12"/><circle cx="20" cy="50" r="2.5" fill="#8A6A12"/>',
      box: '0 0 64 68' }
];

let petWho = 'capy';
let petMode = 'dress';
let petMood = 'idle';
let petBusy = false;

function petState() { return state.pets[petWho]; }

function openPets() {
  petMood = petMode === 'sleep' ? 'asleep' : 'idle';
  petScene = { bath: petMode === 'bath', foam: [], sponge: null, toy: null };
  renderPetTabs();
  renderPetPanel();
  drawPet();
}

/* Extra props layered into the scene: the tub and foam while bathing, and a
   toy in flight while playing. Kept here rather than in pets.js so that file
   stays pure drawing. */
let petScene = { bath: false, foam: [], sponge: null, toy: null };

/* One reset per activity: undress, empty the tub, take the toy away. Same
   button, same place, so she only has to learn it once. */
$('#petReset').onclick = () => {
  const p = petState();
  if (petMode === 'bath') {
    petScene.foam = [];
    petScene.sponge = null;
  } else if (petMode === 'play') {
    petScene.toy = null;
  } else {
    p.outfit = 'none';
    p.acc = {};
    save();
  }
  petMood = petMode === 'sleep' ? 'asleep' : 'idle';
  renderPetPanel();
  drawPet();
};

/* Replays a short animation on the friend. The class has to come off before
   it can go back on, or a second tap in a row does nothing. */
function petReact(kind) {
  const svg = $('#petSvg');
  if (!svg) return;
  svg.classList.remove('pop', 'wiggle');
  void svg.offsetWidth;            // forces the browser to notice the removal
  svg.classList.add(kind);
  setTimeout(() => svg.classList.remove(kind), 600);
}

function updatePetResetArt() {
  const p = petState();
  // Shows the friend plain: no clothes, no accessories, no foam.
  $('#petResetArt').innerHTML = PET_HEADS[petWho](p.fur, 'idle');
}

function drawPet() {
  const p = petState();
  $('#petName').textContent = PET_NAMES[petWho];
  $('#petSvg').innerHTML = petArt(petWho, p.fur, petMood, p.outfit, p.acc,
                                  petMode === 'sleep', petScene);
  updatePetResetArt();
}

function renderPetTabs() {
  const who = $('#petWho');
  who.innerHTML = '';
  PET_SPECIES.forEach(id => {
    const btn = document.createElement('button');
    btn.className = 'facetab' + (id === petWho ? ' on' : '');
    btn.setAttribute('aria-label', PET_NAMES[id]);
    btn.title = PET_NAMES[id];
    // The tab is the animal's own head, so she picks by face, not by name.
    btn.innerHTML = '<svg viewBox="30 0 240 240" aria-hidden="true">' +
                    PET_HEADS[id](state.pets[id].fur, 'idle') + '</svg>';
    btn.onclick = () => { petWho = id; openPets(); };
    who.appendChild(btn);
  });

  const modes = $('#petModes');
  modes.innerHTML = '';
  PET_MODES.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'icontab' + (m.id === petMode ? ' on' : '');
    btn.setAttribute('aria-label', m.name);
    btn.title = m.name;
    btn.innerHTML = '<svg viewBox="' + m.box + '" aria-hidden="true">' + m.icon() + '</svg>';
    btn.onclick = () => {
      petMode = m.id;
      petMood = m.id === 'sleep' ? 'asleep' : 'idle';
      petScene = { bath: m.id === 'bath', foam: [], sponge: null, toy: null };
      renderPetTabs();
      renderPetPanel();
      drawPet();
    };
    modes.appendChild(btn);
  });
}

function petThumb(inner, box) {
  return '<svg viewBox="' + box + '" aria-hidden="true">' + inner + '</svg>';
}

function renderPetPanel() {
  const items = $('#petItems');
  const pal = $('#petPal');
  const hint = $('#petHint');
  const meter = $('#petMeter');
  const p = petState();

  items.innerHTML = '';
  pal.innerHTML = '';
  meter.style.display = 'none';

  $('#petReset').style.display = petMode === 'sleep' ? 'none' : '';

  if (petMode === 'sleep') {
    hint.textContent = t('pets.sleeping');
    return;
  }

  if (petMode === 'bath') {
    hint.textContent = 'Pasa el dedo por encima para llenarlo de espuma.';
    meter.style.display = '';
    meter.firstElementChild.style.width = Math.min(100, petScene.foam.length * 6) + '%';
    return;
  }

  if (petMode === 'play') {
    hint.textContent = 'Toca un juguete y se lo lanzas.';
    PET_TOYS.forEach(toy => {
      const btn = document.createElement('button');
      btn.className = 'petitem';
      btn.innerHTML = petThumb('<g transform="translate(50 50)">' + toy.draw() + '</g>', '0 0 100 100') +
                      '<span></span>';
      btn.querySelector('span').textContent = toy.name;
      btn.onclick = () => throwToy(toy);
      items.appendChild(btn);
    });
    return;
  }

  if (petMode === 'feed') {
    hint.textContent = 'Toca una comida y se la lleva a la boca.';
    meter.style.display = '';
    meter.firstElementChild.style.width = p.full + '%';

    PET_FOOD.forEach(food => {
      const btn = document.createElement('button');
      btn.className = 'petitem';
      btn.innerHTML = petThumb('<g transform="translate(30 30)">' + food.draw() + '</g>', '0 0 60 60') +
                      '<span></span>';
      btn.querySelector('span').textContent = food.name;
      btn.onclick = () => feedPet(food);
      items.appendChild(btn);
    });
    return;
  }

  hint.textContent = 'La misma ropa les queda a los dos.';

  PET_CLOTHES.forEach(outfit => {
    const btn = document.createElement('button');
    btn.className = 'petitem' + (outfit.id === p.outfit ? ' on' : '');
    btn.innerHTML = petThumb(outfit.draw ? outfit.draw(outfit.color) : '', '56 200 188 150') +
                    '<span></span>';
    btn.querySelector('span').textContent = outfit.name;
    btn.onclick = () => {
      p.outfit = outfit.id;
      save();
      renderPetPanel();
      drawPet();
      petReact('pop');            // clothes drop on: a bounce
    };
    items.appendChild(btn);
  });

  PET_ACCESSORIES.forEach(acc => {
    const btn = document.createElement('button');
    btn.className = 'petitem' + (p.acc[acc.id] ? ' on' : '');
    btn.innerHTML = petThumb(acc.draw(acc.color), '40 0 220 250') + '<span></span>';
    btn.querySelector('span').textContent = acc.name;
    btn.onclick = () => {
      p.acc[acc.id] = !p.acc[acc.id];
      save();
      renderPetPanel();
      drawPet();
      petReact('wiggle');         // accessories perch on: a shimmy
    };
    items.appendChild(btn);
  });

  PET_FURS[petWho].forEach(color => {
    const swatch = document.createElement('button');
    swatch.className = 'sw' + (p.fur === color ? ' on' : '');
    swatch.style.background = color;
    swatch.setAttribute('aria-label', 'color');
    swatch.onclick = () => {
      p.fur = color;
      save();
      renderPetPanel();
      drawPet();
      petReact('pop');
    };
    pal.appendChild(swatch);
  });
}

/* The food flies to the mouth, the friend chews, then beams. That last beat
   is the whole game at four: the reward is the face, not the meter. */
function feedPet(food) {
  if (petBusy) return;
  petBusy = true;

  const host = $('#petFlying');
  host.innerHTML = '<g id="petBite" transform="translate(150 400)">' + food.draw() + '</g>';
  const bite = $('#petBite');
  let t = 0;

  const step = () => {
    t += 0.06;
    if (t >= 1) {
      petMood = 'chew';
      drawPet();
      setTimeout(() => {
        petMood = 'happy';
        petState().full = Math.min(100, petState().full + 15);
        save();
        drawPet();
        renderPetPanel();
        petHearts();
        setTimeout(() => { petMood = 'idle'; petBusy = false; drawPet(); }, 950);
      }, 420);
      return;
    }
    const y = 400 + (180 - 400) * t;
    const lift = Math.sin(t * Math.PI) * -26;
    bite.setAttribute('transform', 'translate(150 ' + (y + lift) + ') scale(' + (1 - t * 0.25) + ')');
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function petHearts() {
  const host = $('#petFlying');
  host.innerHTML = '';
  [[104, 140], [150, 118], [196, 140]].forEach((pos, i) => {
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    heart.setAttribute('d', 'M0 6 C-10 -4 -6 -14 0 -8 C6 -14 10 -4 0 6 Z');
    heart.setAttribute('fill', '#EF5B6B');
    heart.setAttribute('transform', 'translate(' + pos[0] + ' ' + pos[1] + ') scale(1.6)');
    heart.style.opacity = '0';
    host.appendChild(heart);
    setTimeout(() => {
      heart.style.transition = 'all .8s';
      heart.style.opacity = '1';
      heart.setAttribute('transform', 'translate(' + pos[0] + ' ' + (pos[1] - 46) + ') scale(2)');
      setTimeout(() => { heart.style.opacity = '0'; }, 620);
    }, i * 130);
  });
}

/* Rubbing the friend leaves foam behind. Foam never fades on its own: at
   four, watching your own mess accumulate is the entire point. */
(function bindBath() {
  const svg = $('#petSvg');
  let rubbing = false;

  const at = (e) => {
    const box = svg.getBoundingClientRect();
    return {
      x: (e.clientX - box.left) * 300 / box.width,
      y: (e.clientY - box.top) * 400 / box.height
    };
  };

  const rub = (e) => {
    if (petMode !== 'bath' || !rubbing) return;
    e.preventDefault();
    const p = at(e);
    petScene.sponge = p;

    const last = petScene.foam[petScene.foam.length - 1];
    const far = !last || Math.hypot(p.x - last.x, p.y - last.y) > 26;
    if (far && petScene.foam.length < 40) {
      petScene.foam.push({ x: p.x, y: p.y, size: 16 + Math.random() * 10 });
      if (petScene.foam.length === 17) {
        petMood = 'happy';
        petSparkle();
      }
      renderPetPanel();
    }
    drawPet();
  };

  svg.addEventListener('pointerdown', (e) => {
    if (petMode !== 'bath') return;
    rubbing = true;
    svg.setPointerCapture(e.pointerId);
    rub(e);
  });
  svg.addEventListener('pointermove', rub);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
    svg.addEventListener(ev, () => {
      rubbing = false;
      petScene.sponge = null;
      drawPet();
    }));
})();

function petSparkle() {
  const host = $('#petFlying');
  if (!host) return;
  [[92, 150], [150, 116], [208, 150]].forEach((pos, i) => {
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    star.setAttribute('d', 'M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z');
    star.setAttribute('fill', '#FFF3C4');
    star.setAttribute('transform', 'translate(' + pos[0] + ' ' + pos[1] + ')');
    star.style.opacity = '0';
    host.appendChild(star);
    setTimeout(() => {
      star.style.transition = 'all .7s';
      star.style.opacity = '1';
      star.setAttribute('transform', 'translate(' + pos[0] + ' ' + (pos[1] - 34) + ') scale(1.6)');
      setTimeout(() => { star.style.opacity = '0'; }, 520);
    }, i * 120);
  });
}

/* The toy arcs in from off-screen, the friend beams, then it settles beside
   her. Nothing to aim, nothing to miss. */
function throwToy(toy) {
  if (petBusy) return;
  petBusy = true;

  let t = 0;
  const from = { x: -50, y: 350 }, to = { x: 256, y: 348 };

  const step = () => {
    t += 0.045;
    if (t >= 1) {
      petScene.toy = { x: to.x, y: to.y, spin: 0, draw: toy.draw };
      petMood = 'happy';
      drawPet();
      petHearts();
      setTimeout(() => { petMood = 'idle'; petBusy = false; drawPet(); }, 1000);
      return;
    }
    petScene.toy = {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t + Math.sin(t * Math.PI) * -150,
      spin: t * 420,
      draw: toy.draw
    };
    drawPet();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// -------------------------------------------------------------- camera

let camStream = null;
let camFacing = 'user';
let camPlaced = [];      // [{id, x, y, scale}] in preview pixels
let camDrag = null;

const CAM_SCALE = 0.9;

async function openCamera() {
  renderCamCostumes();
  drawCamOverlay();

  const video = $('#camVideo');
  video.classList.toggle('mirror', camFacing === 'user');

  camStream = await cameraStart(video, camFacing);
  $('#camDenied').classList.toggle('on', !camStream);
  if (!camStream) $('#camDenied').textContent = CAMERA_DENIED_TEXT;
}

function closeCamera() {
  if (camStream) { cameraStop(camStream); camStream = null; }
}

function camBox() {
  const r = $('#camWrap').getBoundingClientRect();
  return { w: r.width, h: r.height, left: r.left, top: r.top };
}

function drawCamOverlay() {
  const box = camBox();
  const svg = $('#camOverlay');
  svg.setAttribute('viewBox', '0 0 ' + Math.round(box.w) + ' ' + Math.round(box.h));
  svg.innerHTML = camPlaced.map(p =>
    '<g data-id="' + p.id + '" transform="translate(' + p.x + ' ' + p.y +
    ') scale(' + p.scale + ')">' + costumeToSVG(cameraCostume(p.id)) + '</g>'
  ).join('');
}

function renderCamCostumes() {
  const host = $('#camCostumes');
  host.innerHTML = '';
  CAMERA_COSTUMES.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'camcostume' + (camPlaced.some(p => p.id === c.id) ? ' on' : '');
    btn.setAttribute('aria-label', c.name);
    btn.title = c.name;
    btn.innerHTML = '<svg viewBox="-95 -95 190 190" aria-hidden="true">' + costumeToSVG(c) + '</svg>';
    btn.onclick = () => {
      const at = camPlaced.findIndex(p => p.id === c.id);
      if (at >= 0) {
        camPlaced.splice(at, 1);              // tapping again takes it off
      } else {
        const box = camBox();
        camPlaced.push({
          id: c.id,
          x: box.w / 2,
          y: box.h / 2 + c.defaultY * CAM_SCALE,
          scale: CAM_SCALE
        });
      }
      renderCamCostumes();
      drawCamOverlay();
    };
    host.appendChild(btn);
  });
}

(function bindCameraDrag() {
  const svg = $('#camOverlay');

  const at = (e) => {
    const box = camBox();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  svg.addEventListener('pointerdown', (e) => {
    const p = at(e);
    // Topmost first: the last one she added is the one she means to move.
    for (let i = camPlaced.length - 1; i >= 0; i--) {
      const placed = camPlaced[i];
      const costume = cameraCostume(placed.id);
      if (Math.hypot(p.x - placed.x, p.y - placed.y) < costume.radius * placed.scale) {
        camDrag = { i, dx: p.x - placed.x, dy: p.y - placed.y };
        svg.setPointerCapture(e.pointerId);
        return;
      }
    }
  });

  svg.addEventListener('pointermove', (e) => {
    if (!camDrag) return;
    e.preventDefault();
    const p = at(e);
    const box = camBox();
    const placed = camPlaced[camDrag.i];
    placed.x = Math.max(20, Math.min(box.w - 20, p.x - camDrag.dx));
    placed.y = Math.max(20, Math.min(box.h - 20, p.y - camDrag.dy));
    drawCamOverlay();
  });

  ['pointerup', 'pointercancel'].forEach(ev =>
    svg.addEventListener(ev, () => { camDrag = null; }));
})();

$('#camFlip').onclick = async () => {
  camFacing = camFacing === 'user' ? 'environment' : 'user';
  closeCamera();
  await openCamera();
};

$('#camShutter').onclick = async () => {
  if (!camStream) return;

  const flash = $('#camFlash');
  flash.classList.add('on');
  setTimeout(() => flash.classList.remove('on'), 90);

  const box = camBox();
  const blob = await capturePhoto($('#camVideo'), camPlaced, camFacing === 'user', box.w, box.h);
  if (!blob) return;

  await photoSave(blob);
  showLastPhoto();
};

async function showLastPhoto() {
  const record = await photoLast();
  if (!record) return;
  const shot = $('#camShot');
  const url = URL.createObjectURL(record.blob);
  shot.innerHTML = '<img alt="">';
  shot.firstElementChild.src = url;
  shot.classList.add('on');
}

// -------------------------------------------------- wolf and three pigs

function openStory() {
  storyInit($('#storySvg'));
  storyReset();
  renderStoryDots();
  $('#storyBlow').innerHTML = storyBlowIcon();
  $('#storyBlow').hidden = false;
  $('#storyNext').hidden = true;
}

function renderStoryDots() {
  const dots = $('#storyDots');
  dots.innerHTML = '';
  const current = storyState().round;
  STORY_ROUNDS.forEach((_, i) => {
    const dot = document.createElement('i');
    if (i === current) dot.className = 'on';
    dots.appendChild(dot);
  });
}

$('#storyBlow').onclick = () => {
  const started = storyBlow(() => {
    const next = $('#storyNext');
    const round = storyState().round;
    // The button shows the house she is about to face, or the restart arrow
    // once the brick one has held.
    const last = round >= STORY_ROUNDS.length - 1;
    next.innerHTML = last ? storyAgainIcon() : storyHouseIcon(round + 1);
    next.setAttribute('aria-label', last ? 'Otra vez' : STORY_ROUNDS[round + 1].name);
    next.style.background = last ? 'var(--ok)' : '#fff';
    next.hidden = false;
    $('#storyBlow').hidden = true;
  });
  if (!started) return;
};

$('#storyNext').onclick = () => {
  if (!storyNextRound()) storyReset();
  renderStoryDots();
  $('#storyNext').hidden = true;
  $('#storyBlow').hidden = false;
};

// ------------------------------------------------------ forest chase

function openForest() {
  forestInit($('#forestSvg'));
  renderForestDots();
  $('#forestAsk').innerHTML = forestWolfIcon();
  $('#forestAgain').innerHTML = forestAgainIcon();
  $('#forestAsk').style.background = '#fff';
  $('#forestAsk').hidden = false;
  $('#forestAgain').hidden = true;
  $('#forestHint').textContent = t('forest.ask');
}

function renderForestDots() {
  const dots = $('#forestDots');
  const s = forestState();
  dots.innerHTML = '';
  for (let i = 0; i < s.total; i++) {
    const dot = document.createElement('i');
    if (i < s.worn) dot.className = 'on';
    dots.appendChild(dot);
  }
}

$('#forestAsk').onclick = () => {
  const phase = forestAsk((ended) => {
    renderForestDots();
    if (ended === 'chase') {
      $('#forestAsk').hidden = true;
      $('#forestAgain').hidden = false;
      $('#forestHint').textContent = t('forest.escaped');
    } else {
      $('#forestHint').textContent = t('forest.putting') + forestLastGarment() + '.';
    }
  });
  if (!phase) return;
  renderForestDots();
  $('#forestHint').textContent = phase === 'chase' ? t('forest.ready') : '…';
};

$('#forestAgain').onclick = () => {
  forestReset();
  renderForestDots();
  $('#forestAgain').hidden = true;
  $('#forestAsk').hidden = false;
  $('#forestHint').textContent = t('forest.ask');
};

$('#helpBack').onclick = () => go(helpCameFrom === 'parents' ? 'parents' : 'worlds');

// ---------------------------------------------------------------- worm

function openWorm() {
  wormInit($('#wormSvg'));
  renderWormDots();
}

function renderWormDots() {
  const host = $('#wormDots');
  const s = wormState();
  host.innerHTML = '';
  for (let i = 0; i < s.total; i++) {
    const dot = document.createElement('i');
    if (i < s.eaten) dot.className = 'on';
    host.appendChild(dot);
  }
}

function wormGo(dc, dr) {
  const result = wormStep(dc, dr);
  if (result === 'ate' || result === 'done') renderWormDots();
  return result;
}

/* A tap takes one step; holding the button keeps it walking. The first
   repeat waits longer than the rest, so a normal tap never turns into two
   steps by accident. */
(function bindWormPad() {
  $$('.dirbtn[data-dir]').forEach(btn => {
    const [dc, dr] = btn.dataset.dir.split(',').map(Number);
    let firstTimer = null;
    let repeatTimer = null;

    const stop = () => {
      clearTimeout(firstTimer);
      clearInterval(repeatTimer);
      firstTimer = repeatTimer = null;
    };

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      btn.setPointerCapture(e.pointerId);
      if (wormGo(dc, dr) === 'done') return;

      firstTimer = setTimeout(() => {
        repeatTimer = setInterval(() => {
          if (wormGo(dc, dr) === 'done') stop();
        }, 240);
      }, 420);
    });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
      btn.addEventListener(ev, stop));
  });

  $('#wormReset').onclick = () => {
    wormReset();
    renderWormDots();
  };
})();

// ------------------------------------------------------------ counting

let countN = 1;
let countBusy = false;

function openCounting() {
  const chip = $('#numChip');
  chip.classList.remove('dragging', 'hidden');
  chip.style.width = chip.style.height = chip.style.left = chip.style.top = '';
  $$('.countcard').forEach(c => c.classList.remove('over', 'right'));
  countN = 1;
  countBusy = false;
  renderCountRound();
}

function renderCountDots() {
  const host = $('#countDots');
  host.innerHTML = '';
  for (let i = 1; i <= COUNT_MAX; i++) {
    const dot = document.createElement('i');
    if (i < countN) dot.className = 'on';
    host.appendChild(dot);
  }
}

/* The object's name and its article, per language. Spanish and Portuguese
   need the gender; English needs neither, which is why the template for
   English simply has no {art} in it. */
function countName(item) {
  return (COUNT_NAMES[i18nLang] && COUNT_NAMES[i18nLang][item.id]) || item.name;
}
function countArticle(item) {
  return (COUNT_ARTS[i18nLang] && COUNT_ARTS[i18nLang][item.id]) || '';
}

function renderCountRound() {
  const round = countRound(countN);
  const board = $('#countBoard');
  board.innerHTML = '';

  round.options.forEach(opt => {
    const card = document.createElement('div');
    card.className = 'countcard';
    card.dataset.count = opt.count;
    card.innerHTML = countGroupSVG(round.item, opt.count);
    board.appendChild(card);
  });

  const chip = $('#numChip');
  chip.innerHTML = countNumeralSVG(countN);
  chip.classList.remove('hidden');
  chip.style.left = chip.style.top = '';

  $('#countHint').textContent = t('count.hint', {
    n: countN,
    art: countArticle(round.item),
    name: countName(round.item)
  });
  renderCountDots();
}

/* Drag the numeral onto a group. A wrong drop just floats the card home:
   no buzzer, no score, nothing lost. The counting is the exercise. */
(function bindCounting() {
  const chip = $('#numChip');
  let dragging = false;
  let home = null;
  let grab = { x: 0, y: 0 };

  const cardUnder = (x, y) =>
    $$('.countcard').find(card => {
      const r = card.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });

  chip.addEventListener('pointerdown', (e) => {
    if (countBusy) return;
    e.preventDefault();
    const r = chip.getBoundingClientRect();
    home = r;
    grab = { x: e.clientX - r.left, y: e.clientY - r.top };
    dragging = true;
    // No setPointerCapture here. The dragging chip is pointer-events: none so
    // that it does not shadow the cards underneath it, and Safari then loses
    // the capture — the pointerup never arrives and the numeral stays stuck
    // mid-board. Listening on the window instead is what actually holds.
    chip.classList.add('dragging');
    chip.style.width = r.width + 'px';
    chip.style.height = r.height + 'px';
    chip.style.left = r.left + 'px';
    chip.style.top = r.top + 'px';
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    chip.style.left = (e.clientX - grab.x) + 'px';
    chip.style.top = (e.clientY - grab.y) + 'px';

    const over = cardUnder(e.clientX, e.clientY);
    $$('.countcard').forEach(c => c.classList.toggle('over', c === over));
  });

  const drop = (e) => {
    if (!dragging) return;
    dragging = false;
    const over = cardUnder(e.clientX, e.clientY);
    $$('.countcard').forEach(c => c.classList.remove('over'));

    // The card always goes home; only a correct drop changes anything else.
    chip.classList.remove('dragging');
    chip.style.width = chip.style.height = '';
    chip.style.left = chip.style.top = '';

    if (!over || Number(over.dataset.count) !== countN) return;

    countBusy = true;
    over.classList.add('right');
    chip.classList.add('hidden');
    countCheer(over);

    setTimeout(() => {
      countBusy = false;
      if (countN >= COUNT_MAX) {
        countN = 1;
        $('#countHint').textContent = t('count.done', { n: COUNT_MAX });
      } else {
        countN++;
      }
      renderCountRound();
    }, 1100);
  };

  // On the window, so a finger that lifts anywhere — off the board, off the
  // screen, over a card — always ends the drag.
  ['pointerup', 'pointercancel'].forEach(ev => window.addEventListener(ev, drop));

  // Belt and braces: if the drag somehow survives leaving the screen, the next
  // visit resets it rather than showing a numeral floating over the cards.
  window.addEventListener('blur', () => { if (dragging) drop({ clientX: -1, clientY: -1 }); });
})();

function countCheer(card) {
  const r = card.getBoundingClientRect();
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.textContent = '⭐️';
    star.style.cssText = 'position:fixed;z-index:60;pointer-events:none;font-size:30px;' +
      'left:' + (r.left + r.width * (0.15 + i * 0.18)) + 'px;top:' + (r.top + r.height * 0.5) + 'px;' +
      'transition:all .8s;opacity:0';
    document.body.appendChild(star);
    setTimeout(() => {
      star.style.opacity = '1';
      star.style.transform = 'translateY(-60px) scale(1.4)';
      setTimeout(() => { star.style.opacity = '0'; setTimeout(() => star.remove(), 500); }, 500);
    }, i * 90);
  }
}

// ----------------------------------------------------------------- PIN

let pinEntry = '';
let afterPin = null;

// The lock needs a two-second hold, so she cannot open it by accident.
(function bindLock() {
  const lock = $('#lockBtn');
  let timer = null;
  const start = () => { timer = setTimeout(() => askPin(() => go('parents')), 2000); };
  const stop = () => clearTimeout(timer);
  lock.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => lock.addEventListener(ev, stop));
})();

$('#timeupParents').onclick = () => askPin(() => go('parents'));

function askPin(then) {
  afterPin = then;
  pinEntry = '';
  drawPips();
  buildPad();
  go('pin');
}

function buildPad() {
  // Digits are shuffled every time: at four she memorises positions long
  // before she can read numbers.
  const digits = [0,1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
  const pad = $('#pinPad');
  pad.innerHTML = '';

  digits.slice(0, 9).forEach(d => pad.appendChild(padKey(d)));
  const blank = document.createElement('button');
  blank.className = 'blank';
  blank.disabled = true;
  pad.appendChild(blank);
  pad.appendChild(padKey(digits[9]));

  const del = document.createElement('button');
  del.textContent = '⌫';
  del.onclick = () => { pinEntry = pinEntry.slice(0, -1); drawPips(); };
  pad.appendChild(del);
}

function padKey(digit) {
  const key = document.createElement('button');
  key.textContent = digit;
  key.onclick = () => {
    if (pinEntry.length >= 4) return;
    pinEntry += digit;
    drawPips();
    if (pinEntry.length === 4) checkPin();
  };
  return key;
}

function drawPips() {
  $$('#pips i').forEach((pip, i) => pip.classList.toggle('on', i < pinEntry.length));
}

function checkPin() {
  if (pinEntry === state.pin) {
    const then = afterPin;
    afterPin = null;
    then && then();
  } else {
    const pips = $('#pips');
    pips.classList.add('bad');
    setTimeout(() => pips.classList.remove('bad'), 400);
    pinEntry = '';
    drawPips();
    buildPad();
  }
}

$('#pinCancel').onclick = () => go('worlds');

// -------------------------------------------------------- parent panel

function renderParents() {
  $$('.vidonly').forEach(el => { el.hidden = !BUILD.videos; });
  // The instructions link describes different things in each build.
  const helpSub = document.querySelector('[data-t="p.help.sub"]');
  if (helpSub) helpSub.textContent = BUILD.videos ? t('p.help.sub') : t('p.help.sub2');
  rollover();
  $('#usedToday').textContent = Math.floor(state.seconds / 60) + ' min';
  $('#pinInput').value = state.pin;
  ytWorldPicker();
  renderYtSuggestions();
  ytSyncKeyUI();
  renderWorldToggles();
  renderThemePicker();
  renderLangPicker();
  renderLimitOptions();
  $('#soundOn').checked = state.sound !== false;
  $('#videoCount').textContent = state.videos.length;
  $('#emptyHint').style.display = state.videos.length ? 'none' : '';

  const worldSel = $('#addWorld');
  if (!worldSel.childElementCount) {
    WORLDS.filter(w => w.id !== 'favorites').forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = t('w.' + w.id);
      worldSel.appendChild(opt);
    });
  }

  const list = $('#videoList');
  list.innerHTML = '';
  state.videos.forEach((video, index) => {
    const row = document.createElement('div');
    row.className = 'vrow';
    row.innerHTML =
      '<img alt="" src="' + thumbURL(video.id) + '">' +
      '<div class="m"><b></b><span></span></div>' +
      '<select></select><button class="btn danger">✕</button>';

    row.querySelector('b').textContent = video.title;
    row.querySelector('.m span').textContent =
      t('w.' + video.world) + ' · ' + (video.plays || 0);

    const sel = row.querySelector('select');
    WORLDS.filter(w => w.id !== 'favorites').forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = t('w.' + w.id);
      if (w.id === video.world) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = () => { video.world = sel.value; save(); renderParents(); };

    row.querySelector('.danger').onclick = () => {
      state.videos.splice(index, 1);
      save();
      renderParents();
    };

    list.appendChild(row);
  });
}

function renderWorldToggles() {
  const host = $('#worldToggles');
  host.innerHTML = '';
  EXTRA_WORLDS.forEach(extra => {
    const row = document.createElement('label');
    row.className = 'worldrow';
    row.innerHTML = '<span class="ico">' + extra.icon + '</span><b></b>' +
                    '<input type="checkbox"' + (state.hidden[extra.id] ? '' : ' checked') + '>';
    row.querySelector('b').textContent = t('x.' + extra.id);
    row.querySelector('input').onchange = (e) => {
      if (e.target.checked) delete state.hidden[extra.id];
      else state.hidden[extra.id] = true;
      save();
    };
    host.appendChild(row);
  });
}

/* The three languages, as flags-free buttons: the names are written in each
   language, which is the one label a parent can always read. */
function renderLangPicker() {
  const host = $('#langPick');
  if (!host) return;
  host.innerHTML = '';
  I18N_LANGS.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = (lang.id === i18nLang ? 'on' : '');
    btn.textContent = lang.name;
    btn.onclick = () => {
      state.lang = lang.id;
      save();
      applyLang(lang.id);
    };
    host.appendChild(btn);
  });
}

/* Everything that has to be re-rendered when the language changes. The screen
   she is on is redrawn too, so a change made in the parent panel is already
   in place by the time she gets the iPad back. */
function applyLang(lang) {
  i18nSet(lang);
  i18nApply();
  renderLimitOptions();
  renderLangPicker();
  if (current === 'worlds') renderWorlds();
  if (current === 'parents') renderParents();
  if (current === 'count') renderCountRound();
}

/* The minute options are built rather than written, so «minutes» can be
   translated without four copies of the same <select> in the HTML. */
function renderLimitOptions() {
  const sel = $('#limitSel');
  if (!sel) return;
  const chosen = String(state.limit);
  sel.innerHTML = '';
  [[0, t('p.time.none')]].concat([15, 20, 30, 45, 60, 90].map(n => [n, t('p.time.min', { n: n })]))
    .forEach(([value, label]) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      sel.appendChild(opt);
    });
  sel.value = chosen;
}

function renderThemePicker() {
  const host = $('#themePicker');
  host.innerHTML = '';
  THEMES.forEach(theme => {
    const btn = document.createElement('button');
    btn.className = 'themeswatch' + (theme.id === state.theme ? ' on' : '');
    btn.innerHTML = '<div class="chips">' +
      ['--accent', '--accent-soft', '--door-1', '--door-2']
        .map(k => '<i style="background:' + theme.vars[k] + '"></i>').join('') +
      '</div><span></span>';
    btn.querySelector('span').textContent = theme.name;
    btn.onclick = () => {
      state.theme = theme.id;
      save();
      applyTheme(theme.id);
      ytWorldPicker();
  renderYtSuggestions();
  ytSyncKeyUI();
  renderWorldToggles();
  renderThemePicker();
    };
    host.appendChild(btn);
  });
}

$('#limitSel').onchange = (e) => { state.limit = Number(e.target.value); save(); };
$('#resetTime').onclick = () => { state.seconds = 0; save(); renderParents(); };
$('#savePin').onclick = () => {
  const value = $('#pinInput').value.replace(/\D/g, '').slice(0, 4);
  if (value.length === 4) { state.pin = value; save(); alert('PIN guardado'); }
  else alert(t('msg.pin4'));
};

// Ask YouTube for the real title. oEmbed needs no API key.
$('#addLink').addEventListener('input', async () => {
  const id = videoID($('#addLink').value);
  if (!id || $('#addTitle').value) return;
  $('#addHint').textContent = t('msg.looking');
  try {
    const url = 'https://www.youtube.com/oembed?url=' +
                encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json';
    const data = await (await fetch(url)).json();
    if (!$('#addTitle').value) $('#addTitle').value = data.title || '';
    $('#addHint').textContent = t('msg.found');
  } catch (e) {
    $('#addHint').textContent = t('msg.notitle');
  }
});

$('#addBtn').onclick = () => {
  const id = videoID($('#addLink').value);
  const title = $('#addTitle').value.trim();

  if (!id) { $('#addHint').textContent = 'Ese enlace no sirve.'; return; }
  if (!title) { $('#addHint').textContent = t('msg.needtitle'); return; }
  if (state.videos.some(v => v.id === id)) {
    $('#addHint').textContent = t('msg.dup');
    return;
  }

  state.videos.push({ id: id, title: title, world: $('#addWorld').value, plays: 0 });
  save();
  $('#addLink').value = '';
  $('#addTitle').value = '';
  $('#addHint').textContent = 'Agregado.';
  renderParents();
};

// YouTube: search, playlists and bulk paste -----------------------------

function ytWorldPicker() {
  const sel = $('#ytWorld');
  if (!sel.childElementCount) {
    WORLDS.filter(w => w.id !== favoritesWorldID()).forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = w.name;
      sel.appendChild(opt);
    });
  }
  return sel.value || 'songs';
}

// The video list uses a plain string for the favourites world; keep the
// name in one place so a rename cannot silently break the picker.
function favoritesWorldID() { return 'favorites'; }

/* One tap per suggestion: fills the box, points at the right world, searches. */
function renderYtSuggestions() {
  const host = $('#ytSuggest');
  host.innerHTML = '';

  WORLDS.filter(w => w.searches).forEach(world => {
    world.searches.forEach(term => {
      const chip = document.createElement('button');
      chip.className = 'suggest';
      chip.innerHTML = '<span class="ico">' + world.icon + '</span><span></span>';
      chip.querySelector('span:last-child').textContent = term;
      chip.onclick = () => {
        $('#ytQuery').value = term;
        $('#ytWorld').value = world.id;
        $('#ytSearchBtn').click();
      };
      host.appendChild(chip);
    });
  });
}

function ytSyncKeyUI() {
  const has = ytHasKey(state.ytKey);
  $('#ytKey').value = state.ytKey || '';
  $('#ytSearchBtn').disabled = !has;
  $('#ytListBtn').disabled = !has;
  $('#ytHint').textContent = has
    ? t('msg.type')
    : t('msg.needkey');
}

$('#ytKeySave').onclick = () => {
  state.ytKey = $('#ytKey').value.trim();
  save();
  ytSyncKeyUI();
};

/** Adds a batch, skipping anything already in the list. Returns how many landed. */
function ytAddBatch(videos, world) {
  let added = 0;
  videos.forEach(v => {
    if (state.videos.some(existing => existing.id === v.id)) return;
    state.videos.push({ id: v.id, title: v.title || 'Video', world: world, plays: 0 });
    added++;
  });
  if (added) save();
  return added;
}

$('#ytSearchBtn').onclick = async () => {
  const query = $('#ytQuery').value.trim();
  if (!query) return;
  const world = ytWorldPicker();

  $('#ytHint').textContent = 'Buscando…';
  $('#ytResults').innerHTML = '';

  try {
    const found = await ytSearch(query, state.ytKey);
    $('#ytHint').textContent = found.length
      ? 'Toca «Agregar» en los que quieras.'
      : t('msg.nothing');

    found.forEach(video => {
      const already = state.videos.some(v => v.id === video.id);
      const row = document.createElement('div');
      row.className = 'ytresult';
      row.innerHTML = '<img alt="" src="' + thumbURL(video.id) + '">' +
                      '<div class="m"><b></b><span></span></div><button></button>';
      row.querySelector('b').textContent = video.title;
      row.querySelector('.m span').textContent = video.channel;

      const btn = row.querySelector('button');
      const mark = (done) => {
        btn.textContent = done ? 'Agregado' : 'Agregar';
        btn.classList.toggle('added', done);
        btn.disabled = done;
      };
      mark(already);
      btn.onclick = () => {
        ytAddBatch([video], ytWorldPicker());
        mark(true);
        renderParents();
      };
      $('#ytResults').appendChild(row);
    });
  } catch (err) {
    $('#ytHint').textContent = t('msg.ytsaid') + err.message;
  }
};

$('#ytListBtn').onclick = async () => {
  const listID = ytPlaylistID($('#ytList').value);
  const world = ytWorldPicker();
  if (!listID) { $('#ytHint').textContent = 'Ese enlace no tiene una lista.'; return; }

  $('#ytHint').textContent = 'Trayendo la lista…';
  try {
    const videos = await ytPlaylist(listID, state.ytKey);
    const added = ytAddBatch(videos, world);
    $('#ytHint').textContent = 'Traje ' + videos.length + ' videos, ' + added + ' nuevos.';
    $('#ytList').value = '';
    renderParents();
  } catch (err) {
    $('#ytHint').textContent = t('msg.ytsaid') + err.message;
  }
};

$('#ytBulkBtn').onclick = async () => {
  const ids = ytLinksFrom($('#ytBulk').value);
  const world = ytWorldPicker();
  if (!ids.length) { $('#ytHint').textContent = t('msg.nolinks'); return; }

  $('#ytHint').textContent = t('msg.looking');
  const videos = await ytTitles(ids);
  const added = ytAddBatch(videos, world);
  $('#ytHint').textContent = t('msg.added', { found: ids.length, added: added });
  $('#ytBulk').value = '';
  renderParents();
};

// Backup ---------------------------------------------------------------

$('#exportBtn').onclick = () => {
  // The API key stays behind. The backup is meant to be moved between
  // devices and handed around; a key riding along in it is a leak.
  const shareable = Object.assign({}, state);
  delete shareable.ytKey;

  const blob = new Blob([JSON.stringify(shareable, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'aurapp-lista.json';
  a.click();
};

$('#importBtn').onclick = () => $('#importFile').click();

$('#importFile').onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const keepKey = state.ytKey;
    state = Object.assign({}, DEFAULTS, data);
    state.ytKey = data.ytKey || keepKey || '';   // a backup has none; keep ours
    save();
    renderParents();
    alert('Lista importada');
  } catch (err) {
    alert('Ese archivo no se pudo leer');
  }
};

// --------------------------------------------------------------- start

window.addEventListener('resize', () => { if (current === 'draw') setupDraw(); });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

rollover();
$('#soundOn').onchange = () => {
  state.sound = $('#soundOn').checked;
  save();
  soundEnabled(state.sound);
};

/* The audio context can only be created inside a gesture, so the first touch
   anywhere in the app wakes it — and then never again. */
document.addEventListener('pointerdown', function wake() {
  soundEnabled(state.sound !== false);
  soundWake();
  document.removeEventListener('pointerdown', wake);
}, { once: true });

i18nSet(state.lang || i18nDetect());
i18nApply();
renderLimitOptions();
applyTheme(state.theme);
go('worlds');


// ----------------------------------------------------------- mosquitos

let bugCheerTimer = 0;

function openBugs() {
  const box = boardBox($('#bugSvg').parentNode, 300);
  bugInit($('#bugSvg'), box.w, box.h);
  clearTimeout(bugCheerTimer);
  $('#bugCheer').hidden = true;
  renderBugDots();
  bugOnDone(() => {
    renderBugDots();
    const cheer = $('#bugCheer');
    cheer.textContent = '🎉';
    cheer.hidden = false;
    // It congratulates her and then gets out of the way on its own. Nothing
    // she does can leave it stuck over the board.
    clearTimeout(bugCheerTimer);
    bugCheerTimer = setTimeout(() => { cheer.hidden = true; }, 2200);
  });
}

function renderBugDots() { renderDots($('#bugDots'), bugState().caught, bugState().total); }

/* One dot per thing to catch, filled in as she goes. Past a dozen they shrink
   rather than wrap. */
function renderDots(host, done, total) {
  if (!host) return;
  host.className = 'dots' + (total > 12 ? ' many' : '');
  host.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('i');
    if (i < done) dot.className = 'on';
    host.appendChild(dot);
  }
}

function wireBugs() {
  $('#bugSvg').addEventListener('pointerdown', () => setTimeout(renderBugDots, 0));
  $('#bugReset').onclick = () => {
    bugReset();
    clearTimeout(bugCheerTimer);
    $('#bugCheer').hidden = true;
    renderBugDots();
  };
}
wireBugs();


// ------------------------------------------------------- une con la flecha

function openMatch() {
  const box = boardBox($('#matchSvg').parentNode, 440);
  matchInit($('#matchSvg'), box.w, box.h);
  $('#matchCheer').hidden = true;
  renderMatchDots();
  matchOnDone(() => {
    renderMatchDots();
    const cheer = $('#matchCheer');
    cheer.textContent = '🎉';
    cheer.hidden = false;
    // A finished board is a finished board: it clears itself and deals a new
    // one, so she never has to find a button to keep playing.
    setTimeout(() => {
      cheer.hidden = true;
      matchReset();
      renderMatchDots();
    }, 1600);
  });
}

function renderMatchDots() {
  const host = $('#matchDots');
  const s = matchState();
  host.innerHTML = '';
  for (let i = 0; i < s.total; i++) {
    const dot = document.createElement('i');
    if (i < s.linked) dot.className = 'on';
    host.appendChild(dot);
  }
}

/* The line follows the finger anywhere and always ends when it lifts, even
   off the edge of the board — the same lesson as the counting game. */
window.addEventListener('pointermove', (e) => { if (current === 'match') matchMove(e); });
['pointerup', 'pointercancel'].forEach(ev =>
  window.addEventListener(ev, (e) => { if (current === 'match') { matchUp(e); renderMatchDots(); } }));

$('#matchReset').onclick = () => {
  matchReset();
  $('#matchCheer').hidden = true;
  renderMatchDots();
};

// ------------------------------------------------------------- a pescar

function openFish() {
  const box = boardBox($('#fishSvg').parentNode, 300);
  fishInit($('#fishSvg'), box.w, box.h);
  $('#fishCheer').hidden = true;
  renderFishDots();
  fishOnDone(() => {
    renderFishDots();
    const cheer = $('#fishCheer');
    cheer.textContent = '🎉';
    cheer.hidden = false;
    setTimeout(() => { cheer.hidden = true; }, 2200);
  });
}

function renderFishDots() { renderDots($('#fishDots'), fishState().caught, fishState().total); }

$('#fishSvg').addEventListener('pointerdown', () => setTimeout(renderFishDots, 700));
$('#fishReset').onclick = () => {
  fishReset();
  $('#fishCheer').hidden = true;
  renderFishDots();
};


/* Turning the phone changes the shape of the board, so the open game is dealt
   again at the new size. Debounced, because Android fires resize several times
   during a rotation and rebuilding three times in a row is visible. */
let boardResizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(boardResizeTimer);
  boardResizeTimer = setTimeout(() => {
    if (current === 'bugs') openBugs();
    if (current === 'fish') openFish();
    if (current === 'match') openMatch();
    if (current === 'worm') openWorm();
  }, 180);
});
