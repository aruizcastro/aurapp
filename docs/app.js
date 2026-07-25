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
const DEFAULTS = { videos: [], limit: 30, pin: '1234', seconds: 0, day: '' };

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('aurapp') || '{}');
    return Object.assign({}, DEFAULTS, saved);
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
                    '<span class="sub">16 dibujos</span>';
  paint.onclick = () => go('paint');
  host.appendChild(paint);
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

function openColoring() {
  const picker = $('#silPicker');
  if (!picker.childElementCount) {
    SILHOUETTES.forEach(item => {
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
    buildPalette($('#palColor'), colorPick, c => { colorPick = c; });
  }
  drawSilhouette();
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
