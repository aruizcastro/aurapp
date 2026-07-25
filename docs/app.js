/* AurApp — all the behaviour.
   Data lives in localStorage, which persists for a home-screen web app
   (Safari's 7-day eviction only applies to plain browser tabs). */

'use strict';

// ---------------------------------------------------------------- state

const WORLDS = [
  { id: 'songs',     name: 'Canciones',  icon: '🎵', color: '#CECBF6' },
  { id: 'animals',   name: 'Animales',   icon: '🐾', color: '#9FE1CB' },
  { id: 'learning',  name: 'Aprender',   icon: '🔤', color: '#FAC775' },
  { id: 'unicorns',  name: 'Unicornios', icon: '✨', color: '#F4C0D1' },
  { id: 'bedtime',   name: 'Dormir',     icon: '🌙', color: '#B5D4F4' },
  { id: 'favorites', name: 'Favoritos',  icon: '⭐️', color: '#F5C4B3' }
];

const PALETTE = ['#E24B4A', '#EF9F27', '#FAC775', '#97C459', '#1D9E75',
                 '#378ADD', '#7F77DD', '#D4537E', '#D85A30', '#2C2C2A'];

const PER_PAGE = 6;

const PET_DEFAULT = () => ({
  capy: { fur: PET_FURS.capy[0], outfit: 'none', acc: {}, full: 40 },
  cat:  { fur: PET_FURS.cat[0],  outfit: 'none', acc: {}, full: 40 }
});

const DEFAULTS = { videos: [], limit: 30, pin: '1234', seconds: 0, day: '', pets: PET_DEFAULT() };

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('aurapp') || '{}');
    const merged = Object.assign({}, DEFAULTS, saved);
    // Lists saved before the friends existed have no pets key.
    merged.pets = Object.assign(PET_DEFAULT(), saved.pets || {});
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

function go(name) {
  if (name === 'worlds' && outOfTime()) name = 'timeup';
  $$('.screen').forEach(s => s.classList.remove('on'));
  $('#s-' + name).classList.add('on');
  current = name;

  if (name === 'worlds') renderWorlds();
  if (name === 'parents') renderParents();
  if (name === 'color') openColoring();
  if (name === 'draw') setupDraw();
  if (name === 'pets') openPets();
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

  WORLDS.forEach(world => {
    const count = videosIn(world.id).length;
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.style.background = world.color;
    tile.disabled = count === 0;
    tile.innerHTML = '<span class="ico">' + world.icon + '</span>' +
                     '<span class="name">' + world.name + '</span>' +
                     '<span class="sub">' + count + ' videos</span>';
    tile.onclick = () => openWorld(world);
    host.appendChild(tile);
  });

  const paint = document.createElement('button');
  paint.className = 'tile';
  paint.style.background = '#F4C0D1';
  paint.innerHTML = '<span class="ico">🎨</span><span class="name">Pintar</span>' +
                    '<span class="sub">22 dibujos</span>';
  paint.onclick = () => go('paint');
  host.appendChild(paint);

  const friends = document.createElement('button');
  friends.className = 'tile';
  friends.style.background = '#E8C9A0';
  friends.innerHTML = '<span class="ico">🐹</span><span class="name">Amigos</span>' +
                      '<span class="sub">Capi y Michi</span>';
  friends.onclick = () => go('pets');
  host.appendChild(friends);
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

const CATEGORIES = [
  { id: 'animals', name: 'Animales' },
  { id: 'places',  name: 'Paisajes' }
];

let category = 'animals';

function openColoring() {
  const cats = $('#silCats');
  if (!cats.childElementCount) {
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat.name;
      btn.className = cat.id === category ? 'on' : '';
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
  if (confirm('¿Empezamos un dibujo nuevo?')) { strokes = []; repaint(); }
};

// ------------------------------------------------------------- friends

const PET_MODES = [
  { id: 'dress', name: 'Vestir' },
  { id: 'feed',  name: 'Comer' },
  { id: 'sleep', name: 'Dormir' }
];

let petWho = 'capy';
let petMode = 'dress';
let petMood = 'idle';
let petBusy = false;

function petState() { return state.pets[petWho]; }

function openPets() {
  petMood = petMode === 'sleep' ? 'asleep' : 'idle';
  renderPetTabs();
  renderPetPanel();
  drawPet();
}

function drawPet() {
  const p = petState();
  $('#petName').textContent = PET_NAMES[petWho];
  $('#petSvg').innerHTML = petArt(petWho, p.fur, petMood, p.outfit, p.acc, petMode === 'sleep');
}

function renderPetTabs() {
  const who = $('#petWho');
  who.innerHTML = '';
  ['capy', 'cat'].forEach(id => {
    const btn = document.createElement('button');
    btn.textContent = PET_NAMES[id];
    btn.className = id === petWho ? 'on' : '';
    btn.onclick = () => {
      petWho = id;
      openPets();
    };
    who.appendChild(btn);
  });

  const modes = $('#petModes');
  modes.innerHTML = '';
  PET_MODES.forEach(m => {
    const btn = document.createElement('button');
    btn.textContent = m.name;
    btn.className = m.id === petMode ? 'on' : '';
    btn.onclick = () => {
      petMode = m.id;
      petMood = m.id === 'sleep' ? 'asleep' : 'idle';
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

  if (petMode === 'sleep') {
    hint.textContent = 'Está durmiendo. Vuelve mañana o cámbiale de actividad.';
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
    btn.onclick = () => { p.outfit = outfit.id; save(); renderPetPanel(); drawPet(); };
    items.appendChild(btn);
  });

  PET_ACCESSORIES.forEach(acc => {
    const btn = document.createElement('button');
    btn.className = 'petitem' + (p.acc[acc.id] ? ' on' : '');
    btn.innerHTML = petThumb(acc.draw(acc.color), '40 0 220 250') + '<span></span>';
    btn.querySelector('span').textContent = acc.name;
    btn.onclick = () => { p.acc[acc.id] = !p.acc[acc.id]; save(); renderPetPanel(); drawPet(); };
    items.appendChild(btn);
  });

  PET_FURS[petWho].forEach(color => {
    const swatch = document.createElement('button');
    swatch.className = 'sw' + (p.fur === color ? ' on' : '');
    swatch.style.background = color;
    swatch.setAttribute('aria-label', 'color');
    swatch.onclick = () => { p.fur = color; save(); renderPetPanel(); drawPet(); };
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
  rollover();
  $('#limitSel').value = String(state.limit);
  $('#usedToday').textContent = Math.floor(state.seconds / 60) + ' min';
  $('#pinInput').value = state.pin;
  $('#videoCount').textContent = state.videos.length;
  $('#emptyHint').style.display = state.videos.length ? 'none' : '';

  const worldSel = $('#addWorld');
  if (!worldSel.childElementCount) {
    WORLDS.filter(w => w.id !== 'favorites').forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = w.name;
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
      '<select></select><button class="btn danger">Borrar</button>';

    row.querySelector('b').textContent = video.title;
    row.querySelector('.m span').textContent =
      (WORLDS.find(w => w.id === video.world) || {}).name + ' · vista ' + (video.plays || 0) + ' veces';

    const sel = row.querySelector('select');
    WORLDS.filter(w => w.id !== 'favorites').forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = w.name;
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

$('#limitSel').onchange = (e) => { state.limit = Number(e.target.value); save(); };
$('#resetTime').onclick = () => { state.seconds = 0; save(); renderParents(); };
$('#savePin').onclick = () => {
  const value = $('#pinInput').value.replace(/\D/g, '').slice(0, 4);
  if (value.length === 4) { state.pin = value; save(); alert('PIN guardado'); }
  else alert('El PIN debe tener 4 dígitos');
};

// Ask YouTube for the real title. oEmbed needs no API key.
$('#addLink').addEventListener('input', async () => {
  const id = videoID($('#addLink').value);
  if (!id || $('#addTitle').value) return;
  $('#addHint').textContent = 'Buscando el título…';
  try {
    const url = 'https://www.youtube.com/oembed?url=' +
                encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json';
    const data = await (await fetch(url)).json();
    if (!$('#addTitle').value) $('#addTitle').value = data.title || '';
    $('#addHint').textContent = 'Título encontrado.';
  } catch (e) {
    $('#addHint').textContent = 'No se pudo leer el título. Escríbelo a mano.';
  }
});

$('#addBtn').onclick = () => {
  const id = videoID($('#addLink').value);
  const title = $('#addTitle').value.trim();

  if (!id) { $('#addHint').textContent = 'Ese enlace no sirve.'; return; }
  if (!title) { $('#addHint').textContent = 'Ponle un título.'; return; }
  if (state.videos.some(v => v.id === id)) {
    $('#addHint').textContent = 'Ese video ya está en la lista.';
    return;
  }

  state.videos.push({ id: id, title: title, world: $('#addWorld').value, plays: 0 });
  save();
  $('#addLink').value = '';
  $('#addTitle').value = '';
  $('#addHint').textContent = 'Agregado.';
  renderParents();
};

// Backup ---------------------------------------------------------------

$('#exportBtn').onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
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
    state = Object.assign({}, DEFAULTS, data);
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
go('worlds');
