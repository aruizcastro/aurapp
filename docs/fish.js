/* A pescar — fish swim across the lake, and every one she catches drops into
   the bucket, which shows how many she has as a numeral.

   The bucket is the point of the game. She is not really fishing, she is
   watching a number grow one at a time and hearing it named — which is how
   counting is learned before it is taught.

   Nothing is lost. Fish that swim off one side come back from the other, and
   the round only ends when the bucket is full. */

'use strict';

const FISH_W = 440;
const FISH_H = 300;
const FISH_TOTAL = 10;
const FISH_HIT = 44;            // generous, like the mosquitoes
const FISH_OUTLINE = '#2B4055';

const FISH_COLORS = [
  { body: '#F0872E', fin: '#D96F16' },
  { body: '#E8628F', fin: '#CE4877' },
  { body: '#F5C543', fin: '#DCA71C' },
  { body: '#5AB9E0', fin: '#3D9CC4' },
  { body: '#7ECB74', fin: '#5FAE55' }
];

// The water sits under a strip of sky, and the bucket stands on the bank.
const FISH_WATER_TOP = 74;
const FISH_BUCKET = { x: 366, y: 214, w: 66, h: 62 };

// ------------------------------------------------------------------ art

function fishArt(c, flip) {
  const O = FISH_OUTLINE;
  let s = '<g transform="scale(' + (flip ? -1 : 1) + ' 1)">';
  // Tail first, so the body outline sits on top of it.
  s += '<path d="M-20 0 L-40 -15 L-35 0 L-40 15 Z" fill="' + c.fin +
       '" stroke="' + O + '" stroke-width="3.5" stroke-linejoin="round"/>';
  s += '<path d="M-2 -13 L6 -24 L14 -12 Z" fill="' + c.fin +
       '" stroke="' + O + '" stroke-width="3.5" stroke-linejoin="round"/>';
  s += '<ellipse cx="0" cy="0" rx="26" ry="16" fill="' + c.body +
       '" stroke="' + O + '" stroke-width="3.5"/>';
  // Gill line and a scale hint.
  s += '<path d="M10 -12 Q4 0 10 12" fill="none" stroke="' + O +
       '" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>';
  s += '<circle cx="17" cy="-4" r="4.6" fill="#fff" stroke="' + O + '" stroke-width="2.4"/>';
  s += '<circle cx="18" cy="-4" r="2.1" fill="' + O + '"/>';
  s += '<path d="M-6 10 Q2 15 10 11" fill="none" stroke="' + O +
       '" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>';
  s += '</g>';
  return s;
}

/* The bucket, with however many fish she has written on the front. Empty, it
   shows nothing rather than a zero: a nought means «none» only once you can
   already count, and she cannot yet. */
function fishBucketArt(n) {
  const B = FISH_BUCKET;
  const O = FISH_OUTLINE;
  let s = '';
  s += '<path d="M' + B.x + ' ' + B.y + ' L' + (B.x + B.w) + ' ' + B.y +
       ' L' + (B.x + B.w - 9) + ' ' + (B.y + B.h) + ' L' + (B.x + 9) + ' ' + (B.y + B.h) + ' Z" ' +
       'fill="#7FC7E8" stroke="' + O + '" stroke-width="4" stroke-linejoin="round"/>';
  s += '<rect x="' + (B.x - 4) + '" y="' + (B.y - 10) + '" width="' + (B.w + 8) +
       '" height="14" rx="7" fill="#5AB0D8" stroke="' + O + '" stroke-width="4"/>';
  if (n > 0) {
    s += '<text x="' + (B.x + B.w / 2) + '" y="' + (B.y + B.h / 2 + 6) +
         '" text-anchor="middle" dominant-baseline="central" ' +
         'font-family="ui-rounded, system-ui, sans-serif" font-size="38" font-weight="700" ' +
         'fill="#fff" stroke="' + O + '" stroke-width="1.5" paint-order="stroke">' + n + '</text>';
  }
  return s;
}

function fishSceneArt() {
  let s = '';
  s += '<rect width="' + FISH_W + '" height="' + FISH_H + '" fill="#CDEBF7"/>';
  // Sun and a couple of hills above the waterline.
  s += '<circle cx="56" cy="34" r="22" fill="#F8DE72"/>';
  s += '<path d="M0 ' + FISH_WATER_TOP + ' Q90 20 180 ' + FISH_WATER_TOP + ' Z" fill="#9FD6A4"/>';
  s += '<path d="M150 ' + FISH_WATER_TOP + ' Q250 26 350 ' + FISH_WATER_TOP + ' Z" fill="#8ACB93"/>';
  // Water.
  s += '<rect y="' + FISH_WATER_TOP + '" width="' + FISH_W + '" height="' +
       (FISH_H - FISH_WATER_TOP) + '" fill="#4FA8D8"/>';
  s += '<path d="M0 ' + FISH_WATER_TOP + ' q22 9 44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0" ' +
       'fill="none" stroke="#BFE6F6" stroke-width="6" stroke-linecap="round"/>';
  // Weeds on the bed.
  [40, 120, 250, 330].forEach((x, i) => {
    s += '<path d="M' + x + ' ' + FISH_H + ' q' + (i % 2 ? 14 : -14) + ' -30 ' +
         (i % 2 ? 4 : -4) + ' -54" fill="none" stroke="#2E7D52" stroke-width="8" ' +
         'stroke-linecap="round" opacity=".65"/>';
  });
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

function fishInit(svgEl) {
  fishSvg = svgEl;
  fishSvg.setAttribute('viewBox', '0 0 ' + FISH_W + ' ' + FISH_H);
  fishSvg.onpointerdown = fishTap;
  fishReset();
}

function fishReset() {
  fishStop();
  fishCaught = 0;
  fishes = [];
  for (let i = 0; i < FISH_TOTAL; i++) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    fishes.push({
      x: 40 + Math.random() * (FISH_W - 120),
      y: FISH_WATER_TOP + 34 + Math.random() * (FISH_H - FISH_WATER_TOP - 70),
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
    const scale = f.caught ? (1 - f.t * 0.45) : 1;
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
