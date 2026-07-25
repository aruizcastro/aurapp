/* The dress-up camera: costumes she can drag onto her own face, plus the
   photo album that keeps the results.

   The hard part is that every costume has to be drawn twice — once as SVG
   over the live video, once as pixels into the captured photo. Serialising
   the SVG and drawImage-ing it fails often in Safari (tainted/never-loaded
   images), so instead there is one tiny renderer interface with two
   backends. A costume's draw() knows nothing about SVG or canvas.

   Style follows the pets: thick outline, flat fills, no gradients. */

'use strict';

const CAM_OUTLINE = '#5A3A28';
const CAM_WIDTH = 8;

// -------------------------------------------------------------- renderer

/* Shared shape helpers. Both backends agree on the same rounded-rect path
   so a rect looks identical in the preview and in the photo. */
function camRoundRectPath(x, y, w, h, rx) {
  const r = Math.min(rx || 0, w / 2, h / 2);
  return 'M' + (x + r) + ' ' + y + ' H' + (x + w - r) +
         ' A' + r + ' ' + r + ' 0 0 1 ' + (x + w) + ' ' + (y + r) +
         ' V' + (y + h - r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + w - r) + ' ' + (y + h) +
         ' H' + (x + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (y + h - r) +
         ' V' + (y + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + ' Z';
}

function camOpts(o) {
  o = o || {};
  return {
    fill: o.fill || 'none',
    stroke: o.stroke === undefined ? CAM_OUTLINE : o.stroke,
    width: o.width === undefined ? CAM_WIDTH : o.width,
    cap: o.cap || 'round',
    opacity: o.opacity === undefined ? 1 : o.opacity
  };
}

function camSvgAttrs(o) {
  const p = camOpts(o);
  return ' fill="' + p.fill + '" stroke="' + p.stroke + '" stroke-width="' + p.width +
         '" stroke-linejoin="round" stroke-linecap="' + p.cap + '" opacity="' + p.opacity + '"';
}

/* Collects SVG markup. toString() gives the fragment, ready to drop inside
   a <g transform="..."> in the live preview. */
function makeSvgRenderer() {
  const out = [];
  return {
    path: (d, o) => out.push('<path d="' + d + '"' + camSvgAttrs(o) + '/>'),
    circle: (cx, cy, r, o) => out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"' + camSvgAttrs(o) + '/>'),
    ellipse: (cx, cy, rx, ry, o) => out.push('<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"' + camSvgAttrs(o) + '/>'),
    rect: (x, y, w, h, rx, o) => out.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '"' + camSvgAttrs(o) + '/>'),
    line: (x1, y1, x2, y2, o) => out.push('<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + camSvgAttrs(o) + '/>'),
    toString: () => out.join('')
  };
}

function camPaint(ctx, shape, o) {
  const p = camOpts(o);
  ctx.save();
  ctx.globalAlpha = p.opacity;
  if (p.fill !== 'none') { ctx.fillStyle = p.fill; ctx.fill(shape); }
  if (p.stroke !== 'none' && p.width > 0) {
    ctx.strokeStyle = p.stroke;
    ctx.lineWidth = p.width;
    ctx.lineJoin = 'round';
    ctx.lineCap = p.cap;
    ctx.stroke(shape);
  }
  ctx.restore();
}

/* Same interface, painting straight into a 2D context. Path2D parses the
   very same "d" string the SVG backend emits, so there is only one source
   of truth for every curve. */
function makeCanvasRenderer(ctx) {
  return {
    path: (d, o) => camPaint(ctx, new Path2D(d), o),
    circle: (cx, cy, r, o) => {
      const p = new Path2D();
      p.arc(cx, cy, r, 0, Math.PI * 2);
      camPaint(ctx, p, o);
    },
    ellipse: (cx, cy, rx, ry, o) => {
      const p = new Path2D();
      p.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      camPaint(ctx, p, o);
    },
    rect: (x, y, w, h, rx, o) => camPaint(ctx, new Path2D(camRoundRectPath(x, y, w, h, rx)), o),
    line: (x1, y1, x2, y2, o) => camPaint(ctx, new Path2D('M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2), o)
  };
}

// -------------------------------------------------------------- costumes

/* Costumes are drawn in their own unit space around (0,0). One unit is one
   preview pixel at scale 1, so a face about 220 units wide looks right.
   `defaultY` is where the costume lands relative to the face centre and
   `radius` is how close a finger has to be to grab it. */
const CAMERA_COSTUMES = [
  {
    id: 'hat', name: 'Sombrero', defaultY: -150, radius: 110,
    draw(r) {
      r.path('M-62 4 L-56 -96 Q0 -112 56 -96 L62 4 Z', { fill: '#4C5BB0' });
      r.rect(-62, -34, 124, 28, 6, { fill: '#F2C14A' });
      r.rect(-104, -6, 208, 24, 12, { fill: '#3E4A8A' });
    }
  },

  {
    id: 'glasses', name: 'Gafas', defaultY: -20, radius: 100,
    draw(r) {
      r.line(-90, -8, -128, -22, { width: 9 });
      r.line(90, -8, 128, -22, { width: 9 });
      r.circle(-52, 0, 40, { fill: '#BFE6F5', opacity: 0.6, width: 9 });
      r.circle(52, 0, 40, { fill: '#BFE6F5', opacity: 0.6, width: 9 });
      r.path('M-12 -6 Q0 -18 12 -6', { width: 9 });
    }
  },

  {
    id: 'tie', name: 'Corbata', defaultY: 210, radius: 90,
    draw(r) {
      r.path('M-24 -50 L24 -50 L15 -8 L-15 -8 Z', { fill: '#E24B4A' });
      r.path('M-15 -6 L15 -6 L34 92 L0 126 L-34 92 Z', { fill: '#E24B4A' });
      r.path('M-20 -40 L20 -40', { stroke: '#A83433', width: 6 });
    }
  },

  /* Cat, dog and unicorn cover the whole face at once (ears up top, nose or
     whiskers down low), so they are anchored on the face centre: defaultY 0. */
  {
    id: 'cat', name: 'Gato', defaultY: 0, radius: 150,
    draw(r) {
      r.path('M-106 -98 L-94 -184 L-22 -126 Z', { fill: '#F2DCC6' });
      r.path('M106 -98 L94 -184 L22 -126 Z', { fill: '#F2DCC6' });
      r.path('M-92 -104 L-84 -154 L-44 -122 Z', { fill: '#F2A9BC', stroke: 'none' });
      r.path('M92 -104 L84 -154 L44 -122 Z', { fill: '#F2A9BC', stroke: 'none' });
      r.path('M-18 28 L18 28 L0 50 Z', { fill: '#C4737F', width: 6 });
      r.line(-42, 52, -150, 32, { width: 7 });
      r.line(-42, 68, -152, 78, { width: 7 });
      r.line(42, 52, 150, 32, { width: 7 });
      r.line(42, 68, 152, 78, { width: 7 });
    }
  },

  {
    id: 'dog', name: 'Perro', defaultY: 0, radius: 150,
    draw(r) {
      r.path('M-92 -112 C-158 -102 -172 22 -120 70 C-76 100 -60 22 -72 -62 Z', { fill: '#A9754A' });
      r.path('M92 -112 C158 -102 172 22 120 70 C76 100 60 22 72 -62 Z', { fill: '#A9754A' });
      r.ellipse(0, 34, 32, 23, { fill: '#5A3A28' });
      r.path('M0 58 L0 72', { width: 7 });
      r.path('M0 72 C0 88 -24 90 -30 76', { width: 7 });
      r.path('M0 72 C0 88 24 90 30 76', { width: 7 });
    }
  },

  {
    id: 'unicorn', name: 'Unicornio', defaultY: 0, radius: 150,
    draw(r) {
      r.path('M-98 -110 C-110 -170 -84 -186 -58 -152 C-46 -136 -44 -116 -48 -102 Z', { fill: '#FFF3E4' });
      r.path('M98 -110 C110 -170 84 -186 58 -152 C46 -136 44 -116 48 -102 Z', { fill: '#FFF3E4' });
      r.path('M-84 -114 C-92 -156 -78 -166 -62 -144 C-54 -132 -54 -120 -56 -110 Z', { fill: '#F2A9BC', stroke: 'none' });
      r.path('M84 -114 C92 -156 78 -166 62 -144 C54 -132 54 -120 56 -110 Z', { fill: '#F2A9BC', stroke: 'none' });
      r.path('M-24 -122 L0 -234 L24 -122 Z', { fill: '#F6C64A' });
      r.line(-19, -132, 19, -132, { width: 6 });
      r.line(-16, -156, 16, -156, { width: 6 });
      r.line(-10, -184, 10, -184, { width: 6 });
    }
  }
];

function cameraCostume(id) {
  return CAMERA_COSTUMES.find(c => c.id === id) || null;
}

/* SVG fragment in costume units. Wrap it yourself:
   '<g transform="translate(x y) scale(s)">' + costumeToSVG(c) + '</g>' */
function costumeToSVG(costume) {
  const r = makeSvgRenderer();
  costume.draw(r);
  return r.toString();
}

function drawCostumeToCanvas(ctx, costume, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale || 1, scale || 1);
  costume.draw(makeCanvasRenderer(ctx));
  ctx.restore();
}

// ------------------------------------------------------------ photo store

const PHOTO_DB = 'aurapp-photos';
const PHOTO_STORE = 'photos';
const PHOTO_MAX = 30;

let photoDBPromise = null;

function photoDB() {
  if (photoDBPromise) return photoDBPromise;
  photoDBPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(PHOTO_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return photoDBPromise;
}

function photoTx(mode, run) {
  return photoDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, mode);
    let result;
    run(tx.objectStore(PHOTO_STORE), v => { result = v; });
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

/* Saves a photo and, once the album is full, drops the oldest one. Ids grow
   forever, so the lowest id in the store is always the oldest photo. */
function photoSave(blob) {
  return photoTx('readwrite', (store, set) => {
    const add = store.add({ blob: blob, at: Date.now() });
    add.onsuccess = () => {
      set(add.result);
      const count = store.count();
      count.onsuccess = () => {
        let extra = count.result - PHOTO_MAX;
        if (extra <= 0) return;
        const cur = store.openCursor();
        cur.onsuccess = () => {
          const c = cur.result;
          if (!c || extra <= 0) return;
          c.delete();
          extra--;
          c.continue();
        };
      };
    };
  });
}

function photoAll() {
  return photoTx('readonly', (store, set) => {
    const req = store.getAll();
    req.onsuccess = () => set(req.result || []);
  });
}

function photoLast() {
  return photoTx('readonly', (store, set) => {
    const req = store.openCursor(null, 'prev');
    req.onsuccess = () => set(req.result ? req.result.value : null);
  });
}

function photoClear() {
  return photoTx('readwrite', store => { store.clear(); });
}

function photoCount() {
  return photoTx('readonly', (store, set) => {
    const req = store.count();
    req.onsuccess = () => set(req.result);
  });
}

// ---------------------------------------------------------------- camera

const CAMERA_DENIED_TEXT = 'No pude encender la cámara. Pídele ayuda a un adulto.';

/* Returns the stream, or null if the camera is missing or refused — the
   caller shows CAMERA_DENIED_TEXT instead of crashing. */
function cameraStart(videoEl, facing) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return Promise.resolve(null);
  }
  const wanted = { video: { facingMode: facing || 'user', width: { ideal: 1280 } }, audio: false };
  return navigator.mediaDevices.getUserMedia(wanted).then(stream => {
    // iOS Safari refuses to play a stream inline without these two.
    videoEl.setAttribute('playsinline', '');
    videoEl.muted = true;
    videoEl.srcObject = stream;
    const played = videoEl.play();
    if (played && played.catch) played.catch(() => {});
    return stream;
  }).catch(() => null);
}

function cameraStop(stream) {
  if (!stream) return;
  stream.getTracks().forEach(t => t.stop());
}

/* Burns the placed costumes into a still frame.

   `placedCostumes` is [{id, x, y, scale}] in preview pixels, measured from
   the top-left of the preview box (scale defaults to 1). The preview shows
   the video with object-fit: cover, so we capture exactly the crop she can
   see: that makes preview -> photo a single uniform factor with no offset,
   and the photo matches the screen. */
function capturePhoto(videoEl, placedCostumes, mirrored, previewWidth, previewHeight) {
  return new Promise((resolve, reject) => {
    const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
    if (!vw || !vh) { reject(new Error('camera not ready')); return; }

    const pw = previewWidth || videoEl.clientWidth || vw;
    const ph = previewHeight || videoEl.clientHeight || vh;
    const cover = Math.max(pw / vw, ph / vh);       // preview px per video px
    const sw = Math.max(1, Math.round(pw / cover)); // visible source rect
    const sh = Math.max(1, Math.round(ph / cover));
    const sx = Math.round((vw - sw) / 2);
    const sy = Math.round((vh - sh) / 2);
    const k = sw / pw;                              // photo px per preview px

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');

    // The front camera preview is mirrored by CSS, so mirror the frame too —
    // then restore before the costumes, or her hat would come out backwards.
    ctx.save();
    if (mirrored) { ctx.translate(sw, 0); ctx.scale(-1, 1); }
    ctx.drawImage(videoEl, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.restore();

    (placedCostumes || []).forEach(p => {
      const costume = cameraCostume(p.id);
      if (costume) drawCostumeToCanvas(ctx, costume, p.x * k, p.y * k, (p.scale || 1) * k);
    });

    canvas.toBlob(b => {
      if (b) resolve(b); else reject(new Error('no blob'));
    }, 'image/jpeg', 0.85);
  });
}
