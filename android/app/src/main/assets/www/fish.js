/* A pescar — fish swim across the lake, and every one she catches drops into
   the bucket, which shows how many she has as a numeral.

   The bucket is the point of the game. She is not really fishing, she is
   watching a number grow one at a time and hearing it named — which is how
   counting is learned before it is taught.

   Nothing is lost. Fish that swim off one side come back from the other, and
   the round only ends when the bucket is full. */

'use strict';

/* The board's size in game units. Not constants: the page measures the space
   it has and hands the numbers over, so the lake is the shape of the screen
   instead of a fixed rectangle floating in the middle of it. */
let FISH_W = 440;
let FISH_H = 300;
const FISH_TOTAL = 20;          // the bucket counts all the way to twenty
const FISH_HIT = 32;            // generous, but not «anywhere wins» — see bugs.js
const FISH_OUTLINE = '#2B3A6B';
const FISH_SCALE = 0.40;   // authored large, drawn small

const FISH_COLORS = [
  { id: 'o', body: '#F5941F', fin: '#E07B0C' },
  { id: 'p', body: '#F58BB8', fin: '#EE6BA3' },
  { id: 'y', body: '#F7DB1B', fin: '#E5C40A' },
  { id: 'b', body: '#7FCFF0', fin: '#57B8E4' },
  { id: 'g', body: '#7CC576', fin: '#5FAE59' },
  { id: 'v', body: '#B57BE0', fin: '#9B5FCC', stripes: true }
];

// The waterline and the bucket follow the board rather than sitting at fixed
// coordinates: on a tall screen the sky must not eat a third of the lake.
let FISH_WATER_TOP = 74;
let FISH_BUCKET = { x: 352, y: 202, w: 76, h: 78 };

function fishLayout() {
  FISH_WATER_TOP = Math.round(Math.min(90, Math.max(46, FISH_H * 0.22)));
  const w = 76, h = 78;
  FISH_BUCKET = { x: FISH_W - w - 12, y: FISH_H - h - 20, w: w, h: h };
}

// ------------------------------------------------------------------ art

function fishArt(c, flip) {
  const O = FISH_OUTLINE;
  const W = 3.6;
  let s = '<g transform="scale(' + (flip ? -1 : 1) + ' 1)">';

  // Tail: a wide fan with a notch bitten out of the side that meets the body,
  // which is the shape that reads as «fish» before any other detail does.
  s += '<path d="M-34 0 C-46 -8 -62 -26 -78 -36 C-74 -20 -72 -8 -72 0 ' +
       'C-72 8 -74 20 -78 36 C-62 26 -46 8 -34 0 Z" fill="' + c.fin +
       '" stroke="' + O + '" stroke-width="' + W + '" stroke-linejoin="round"/>';

  // Dorsal and pelvic fins, both rounded rather than spiky.
  s += '<path d="M-24 -24 C-20 -48 -6 -60 6 -56 C12 -44 14 -34 16 -26 Z" fill="' + c.fin +
       '" stroke="' + O + '" stroke-width="' + W + '" stroke-linejoin="round"/>';
  s += '<path d="M-12 22 C-8 40 2 48 10 44 C13 36 14 29 15 23 Z" fill="' + c.fin +
       '" stroke="' + O + '" stroke-width="' + W + '" stroke-linejoin="round"/>';

  // Body.
  s += '<ellipse cx="0" cy="0" rx="44" ry="31" fill="' + c.body +
       '" stroke="' + O + '" stroke-width="' + W + '"/>';

  if (c.stripes) {
    // The striped one. A clip keeps the bands inside the body outline instead
    // of running off its edge.
    const id = 'fishclip' + (c.id || 'x');
    s += '<clipPath id="' + id + '"><ellipse cx="0" cy="0" rx="44" ry="31"/></clipPath>';
    s += '<g clip-path="url(#' + id + ')" fill="none" stroke="' + c.fin +
         '" stroke-width="6" stroke-linecap="round">';
    [-26, -14, -2].forEach(x => {
      s += '<path d="M' + x + ' -32 C' + (x - 6) + ' -10 ' + (x - 6) + ' 10 ' + x + ' 32"/>';
    });
    s += '</g>';
    s += '<ellipse cx="0" cy="0" rx="44" ry="31" fill="none" stroke="' + O +
         '" stroke-width="' + W + '"/>';
  }

  // Pectoral fin — the little «c» on the flank.
  s += '<path d="M-6 -4 C-16 -4 -18 10 -6 12 C-12 6 -12 0 -6 -4 Z" fill="' + c.fin +
       '" stroke="' + O + '" stroke-width="3" stroke-linejoin="round"/>';

  // Gill line.
  s += '<path d="M14 -26 C6 -12 6 12 14 26" fill="none" stroke="' + O +
       '" stroke-width="2.8" stroke-linecap="round"/>';

  // Eye and mouth.
  s += '<circle cx="27" cy="-9" r="9.5" fill="#fff" stroke="' + O + '" stroke-width="3"/>';
  s += '<circle cx="28" cy="-8" r="5.4" fill="' + O + '"/>';
  s += '<circle cx="25.6" cy="-11" r="2.3" fill="#fff"/>';
  s += '<path d="M36 6 C40 11 45 11 47 7" fill="none" stroke="' + O +
       '" stroke-width="2.8" stroke-linecap="round"/>';

  s += '</g>';
  return s;
}

/* The bucket, with however many fish she has written on the front, and one or
   two of them peeking over the rim.

   Empty, it shows no number at all rather than a zero: a nought means «none»
   only once you can already count, and she cannot yet. The peeking fish are
   decoration — the numeral is the count. */
function fishBucketArt(n) {
  const B = FISH_BUCKET, O = FISH_OUTLINE;
  const cx = B.x + B.w / 2;
  const clip = 'fishbucketclip';
  let s = '';

  // Handle first, so the rim covers where it joins.
  s += '<path d="M' + (B.x + 5) + ' ' + (B.y + 2) + ' A ' + (B.w / 2 - 5) + ' ' +
       (B.w / 2 - 5) + ' 0 0 1 ' + (B.x + B.w - 5) + ' ' + (B.y + 2) +
       '" fill="none" stroke="' + O + '" stroke-width="9" stroke-linecap="round"/>';
  s += '<path d="M' + (B.x + 5) + ' ' + (B.y + 2) + ' A ' + (B.w / 2 - 5) + ' ' +
       (B.w / 2 - 5) + ' 0 0 1 ' + (B.x + B.w - 5) + ' ' + (B.y + 2) +
       '" fill="none" stroke="#A9B0BD" stroke-width="4.5" stroke-linecap="round"/>';

  // The fish looking out, tucked behind the rim.
  if (n > 0) {
    // Nose up, so what clears the rim is a face and not a tail.
    const peeking = n === 1 ? [0.6] : [-1, 1];
    peeking.forEach((side, i) => {
      const c = FISH_COLORS[i % 3];
      s += '<g transform="translate(' + (cx + side * 14) + ' ' + (B.y - 9) +
           ') rotate(' + (side < 0 ? 58 : -58) + ') scale(0.34)">' +
           fishArt(c, side < 0) + '</g>';
    });
  }

  // Body, tapered, with a rim across the top.
  const body = 'M' + B.x + ' ' + B.y + ' L' + (B.x + B.w) + ' ' + B.y +
               ' L' + (B.x + B.w - 11) + ' ' + (B.y + B.h - 4) +
               ' Q' + (B.x + B.w - 12) + ' ' + (B.y + B.h) + ' ' + (B.x + B.w - 15) + ' ' + (B.y + B.h) +
               ' L' + (B.x + 15) + ' ' + (B.y + B.h) +
               ' Q' + (B.x + 12) + ' ' + (B.y + B.h) + ' ' + (B.x + 11) + ' ' + (B.y + B.h - 4) + ' Z';

  s += '<clipPath id="' + clip + '"><path d="' + body + '"/></clipPath>';
  s += '<path d="' + body + '" fill="#7FCFF0" stroke="' + O +
       '" stroke-width="4" stroke-linejoin="round"/>';
  // A darker slice down the right for a little volume, and the white band.
  s += '<g clip-path="url(#' + clip + ')">';
  s += '<rect x="' + (B.x + B.w - 14) + '" y="' + B.y + '" width="20" height="' + B.h +
       '" fill="#5FBEE6"/>';
  s += '<rect x="' + (B.x - 4) + '" y="' + (B.y + B.h - 22) + '" width="' + (B.w + 8) +
       '" height="9" fill="#fff"/>';
  s += '</g>';
  s += '<path d="' + body + '" fill="none" stroke="' + O +
       '" stroke-width="4" stroke-linejoin="round"/>';

  // Rim.
  s += '<rect x="' + (B.x - 3) + '" y="' + (B.y - 6) + '" width="' + (B.w + 6) +
       '" height="12" rx="6" fill="#7FCFF0" stroke="' + O + '" stroke-width="4"/>';

  if (n > 0) {
    // Two digits need a smaller face, or «10» runs off the sides of the bucket.
    const size = n > 9 ? 32 : 40;
    s += '<text x="' + cx + '" y="' + (B.y + B.h / 2 + 6) +
         '" text-anchor="middle" dominant-baseline="central" ' +
         'font-family="ui-rounded, system-ui, sans-serif" font-size="' + size +
         '" font-weight="700" fill="#fff" stroke="' + O +
         '" stroke-width="3.5" paint-order="stroke">' + n + '</text>';
  }
  return s;
}

/* The lake. Everything here is flat colour with no outline, on purpose: the
   fish carry the heavy navy stroke, so the background has to stay quiet or
   she cannot pick them out of it.

   The middle of the water is deliberately empty. That is where the fish
   swim. */
function fishSceneArt() {
  const W = FISH_W, H = FISH_H, top = FISH_WATER_TOP;
  let s = '';

  // Sky and sun.
  s += '<rect width="' + W + '" height="' + H + '" fill="#BFE4F0"/>';
  s += '<circle cx="' + (W - 108) + '" cy="30" r="21" fill="#F7DD72"/>';

  // Three hills, the far one darker, meeting the waterline.
  s += '<path d="M0 ' + top + ' L0 44 C60 20 130 24 190 ' + top + ' Z" fill="#7DB33F"/>';
  s += '<path d="M' + (W - 190) + ' ' + top + ' C' + (W - 130) + ' 26 ' + (W - 50) + ' 22 ' +
       W + ' 40 L' + W + ' ' + top + ' Z" fill="#6DA336"/>';
  s += '<path d="M120 ' + top + ' C190 34 260 34 330 ' + top + ' Z" fill="#8CC24C"/>';

  // Water.
  s += '<rect y="' + top + '" width="' + W + '" height="' + (H - top) + '" fill="#83B0DC"/>';

  // The scalloped ripple line, a chain of half circles.
  let scallop = 'M0 ' + (top + 26);
  for (let x = 0; x < W; x += 40) scallop += ' a 20 20 0 0 1 40 0';
  s += '<path d="' + scallop + '" fill="none" stroke="#CFE8F7" stroke-width="7" ' +
       'stroke-linecap="round"/>';

  // The bed: a darker wave across the bottom.
  let bed = 'M0 ' + (H - 46);
  for (let x = 0; x < W; x += 110) bed += ' q 55 -16 110 0';
  bed += ' L' + W + ' ' + H + ' L0 ' + H + ' Z';
  s += '<path d="' + bed + '" fill="#6B9FCB"/>';

  // Weeds: a curved stem with two leaves, at the sides and one in the middle.
  const weed = (x, h, flip) => {
    const f = flip ? -1 : 1;
    let g = '<g transform="translate(' + x + ' ' + H + ') scale(' + f + ' 1)">';
    g += '<path d="M0 0 C' + (-14) + ' ' + (-h * 0.4) + ' 14 ' + (-h * 0.7) + ' 2 ' + (-h) +
         '" fill="none" stroke="#7FA84A" stroke-width="6" stroke-linecap="round"/>';
    g += '<path d="M4 ' + (-h * 0.72) + ' C20 ' + (-h * 0.86) + ' 30 ' + (-h * 0.78) + ' 30 ' +
         (-h * 0.66) + ' C18 ' + (-h * 0.62) + ' 8 ' + (-h * 0.66) + ' 4 ' + (-h * 0.72) + ' Z" fill="#7FA84A"/>';
    g += '<path d="M-2 ' + (-h * 0.42) + ' C-18 ' + (-h * 0.54) + ' -28 ' + (-h * 0.46) + ' -28 ' +
         (-h * 0.34) + ' C-16 ' + (-h * 0.3) + ' -6 ' + (-h * 0.36) + ' -2 ' + (-h * 0.42) + ' Z" fill="#7FA84A"/>';
    g += '</g>';
    return g;
  };
  s += weed(40, 150, false) + weed(84, 108, true) +
       weed(212, 112, false) +
       weed(W - 78, 158, true) + weed(W - 42, 116, false);

  // Two stones sitting on the bed, with a lighter top.
  const stone = (x, y, rx, ry) =>
    '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#7E858B"/>' +
    '<ellipse cx="' + (x - rx * 0.2) + '" cy="' + (y - ry * 0.42) + '" rx="' + (rx * 0.46) +
    '" ry="' + (ry * 0.3) + '" fill="#9CA3A9"/>';
  // They sit on the very bottom, so only the dome shows — like stones half
  // buried in the bed rather than pebbles floating on it.
  s += stone(76, H + 4, 38, 32) + stone(W - 118, H + 6, 32, 26);

  return s;
}

// ---------------------------------------------------------------- state

let fishSvg = null;
let fishes = [];
let fishCaught = 0;
let fishRaf = 0;
let fishLast = 0;
let fishDoneCb = null;

function fishState() {
  return { caught: fishCaught, total: FISH_TOTAL, done: fishCaught >= FISH_TOTAL };
}

function fishOnDone(fn) { fishDoneCb = fn; }

function fishInit(svgEl, w, h) {
  fishSvg = svgEl;
  if (w && h) { FISH_W = w; FISH_H = h; }
  fishLayout();
  fishSvg.setAttribute('viewBox', '0 0 ' + FISH_W + ' ' + FISH_H);
  fishSvg.onpointerdown = fishTap;
  fishReset();
}

function fishReset() {
  fishStop();
  fishCaught = 0;
  fishes = [];
  // Laid out on a loose grid with a random nudge: twenty at pure random pile
  // up in one corner and leave the rest of the lake empty.
  const cols = FISH_W >= FISH_H ? 5 : 3;
  const rows = Math.ceil(FISH_TOTAL / cols);
  const cellW = (FISH_W - 60) / cols, cellH = (FISH_H - FISH_WATER_TOP - 60) / rows;
  for (let i = 0; i < FISH_TOTAL; i++) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    const col = i % cols, row = Math.floor(i / cols);
    fishes.push({
      x: 30 + col * cellW + cellW * (0.2 + Math.random() * 0.6),
      y: FISH_WATER_TOP + 30 + row * cellH + cellH * (0.15 + Math.random() * 0.7),
      dir: dir,
      speed: 20 + Math.random() * 18,
      bob: Math.random() * 6,
      colors: FISH_COLORS[i % FISH_COLORS.length],
      caught: false,
      t: 0,                       // progress of the flight to the bucket
      from: null
    });
  }
  fishBuild();
  fishStart();
}

function fishBuild() {
  if (!fishSvg) return;
  fishSvg.innerHTML = fishSceneArt() +
    '<g id="fishHost"></g><g id="fishBucket"></g>';
  const host = fishSvg.querySelector('#fishHost');
  fishes.forEach(f => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = fishArt(f.colors, f.dir < 0);
    host.appendChild(g);
    f.node = g;
  });
  fishDrawBucket();
  fishPlace();
}

function fishDrawBucket() {
  const host = fishSvg && fishSvg.querySelector('#fishBucket');
  if (host) host.innerHTML = fishBucketArt(fishCaught);
}

function fishPlace() {
  fishes.forEach(f => {
    if (!f.node) return;
    const wig = Math.sin(f.bob) * 4;
    const scale = FISH_SCALE * (f.caught ? (1 - f.t * 0.45) : 1);
    f.node.setAttribute('transform',
      'translate(' + f.x.toFixed(1) + ' ' + (f.y + wig).toFixed(1) + ') scale(' + scale.toFixed(2) + ')');
  });
}

// ------------------------------------------------------------- movement

function fishStep(dt) {
  const bx = FISH_BUCKET.x + FISH_BUCKET.w / 2;
  const by = FISH_BUCKET.y + 4;

  fishes.forEach(f => {
    f.bob += dt * 4;

    if (f.caught) {
      // Arc into the bucket: straight interpolation with a lift, so it looks
      // thrown rather than dragged.
      f.t = Math.min(1, f.t + dt * 1.8);
      const e = f.t;
      f.x = f.from.x + (bx - f.from.x) * e;
      f.y = f.from.y + (by - f.from.y) * e - Math.sin(e * Math.PI) * 54;
      if (f.t >= 1 && !f.landed) {
        f.landed = true;
        f.node.style.display = 'none';
        fishCaught++;
        fishDrawBucket();
        if (fishCaught >= FISH_TOTAL) {
          fishStop();
          if (fishDoneCb) fishDoneCb();
        }
      }
      return;
    }

    f.x += f.dir * f.speed * dt;

    // Off one edge, back in from the other — a fish is never lost.
    if (f.x < -50) { f.x = FISH_W + 50; }
    if (f.x > FISH_W + 50) { f.x = -50; }
  });
  fishPlace();
}

function fishFrame(now) {
  if (!fishLast) fishLast = now;
  const dt = Math.min(0.05, (now - fishLast) / 1000);
  fishLast = now;
  fishStep(dt);
  fishRaf = requestAnimationFrame(fishFrame);
}

function fishStart() {
  if (fishRaf) return;
  fishLast = 0;
  fishRaf = requestAnimationFrame(fishFrame);
}

function fishStop() {
  if (fishRaf) cancelAnimationFrame(fishRaf);
  fishRaf = 0;
}

// ------------------------------------------------------------------ tap

function fishTap(ev) {
  if (!fishSvg) return;
  const r = fishSvg.getBoundingClientRect();
  if (!r.width || !r.height) return;
  ev.preventDefault();
  const x = ((ev.clientX - r.left) / r.width) * FISH_W;
  const y = ((ev.clientY - r.top) / r.height) * FISH_H;

  let best = null, bestD = FISH_HIT * FISH_HIT;
  fishes.forEach(f => {
    if (f.caught) return;
    const d = (f.x - x) * (f.x - x) + (f.y - y) * (f.y - y);
    if (d <= bestD) { bestD = d; best = f; }
  });
  if (!best) return;

  best.caught = true;
  best.t = 0;
  best.from = { x: best.x, y: best.y };
}
