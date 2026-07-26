/* Los mosquitos — tap the flying bugs to shoo them away.

   Three things keep this playable at four:

   · The hit area is far bigger than the drawing (BUG_HIT), because a small
     finger lands near the target, not on it.
   · They drift; they do not dart. Speed is low enough that she can chase one
     across the board with her finger and still catch it.
   · Nothing is lost. A missed tap does nothing at all, there is no timer, and
     the only ending is the happy one — every mosquito shooed.

   "Aplastar" is drawn as a puff of stars and a dizzy little swirl, not as a
   squashed insect. Same game, nothing unpleasant to look at. */

'use strict';

const BUG_W = 400;
const BUG_H = 300;
const BUG_COUNT = 20;      // the jar counts all the way to twenty
/* Tap radius. Still bigger than the drawing, but smaller than it was with
   eight mosquitoes: with twenty on the board a huge radius meant every tap
   anywhere hit something, and the game stopped being about aiming at all. */
const BUG_HIT = 34;
const BUG_SPEED = 26;         // units per second
const BUG_SCALE = 0.52;       // the drawing is authored large, then shrunk
const BUG_MARGIN = 40;        // keeps a whole mosquito inside the board

const BUG_OUTLINE = '#4A2E28';
const BUG_WING = '#CFE6F5';
const BUG_WING_DARK = '#B4D6EC';

/* Six colourways. Five to catch, plus the dizzy cream one she sees for a
   moment after a hit. */
const BUG_COLORS = [
  { body: '#8B7BC8', band: '#6F5FAF', tip: '#7A69BE' },   // morado
  { body: '#7CBF4D', band: '#62A337', tip: '#6BAE3E' },   // verde
  { body: '#3E9DD6', band: '#2A82BA', tip: '#3690C8' },   // azul
  { body: '#E8628F', band: '#CE4877', tip: '#DC5583' },   // rosado
  { body: '#F5942E', band: '#DC7A18', tip: '#E98722' }    // naranja
];
const BUG_DIZZY = { body: '#C4AC90', band: '#AD9377', tip: '#AD9377' };

// ---------------------------------------------------------------- art

/* The mosquito is drawn once, at the origin, and then only its <g> transform
   changes each frame. Rebuilding the whole SVG sixty times a second is what
   makes these games stutter on an old iPad.

   Four wings a side, big glossy eyes, banded abdomen — the shape follows the
   reference sheet rather than my earlier, plainer bug. */
function bugArt(colors, dizzy) {
  const c = colors || BUG_COLORS[0];
  const O = BUG_OUTLINE;
  let s = '';

  // --- Wings. Two pairs, the upper one sweeping up and out, the lower one
  // shorter and tucked beneath. Both flap from the shoulder via CSS.
  const wing = (side) => {
    const f = side;   // -1 left, +1 right
    let w = '<g class="wing w' + (f < 0 ? 'l' : 'r') + '">';
    w += '<ellipse cx="' + (f * 36) + '" cy="-20" rx="32" ry="12" ' +
         'transform="rotate(' + (f * -14) + ' ' + (f * 36) + ' -20)" fill="' + BUG_WING +
         '" stroke="' + O + '" stroke-width="3"/>';
    w += '<ellipse cx="' + (f * 30) + '" cy="-1" rx="25" ry="9.5" ' +
         'transform="rotate(' + (f * 12) + ' ' + (f * 30) + ' -1)" fill="' + BUG_WING_DARK +
         '" stroke="' + O + '" stroke-width="3"/>';
    w += '</g>';
    return w;
  };
  s += wing(-1) + wing(1);

  // --- Legs: three thin curls a side, drawn before the body so they tuck in.
  s += '<g fill="none" stroke="' + O + '" stroke-width="2.6" stroke-linecap="round">';
  [-1, 1].forEach(f => {
    s += '<path d="M' + (f * 11) + ' 4 C' + (f * 26) + ' 6 ' + (f * 34) + ' 12 ' + (f * 36) + ' 21"/>';
    s += '<path d="M' + (f * 13) + ' 14 C' + (f * 26) + ' 19 ' + (f * 31) + ' 26 ' + (f * 30) + ' 35"/>';
    s += '<path d="M' + (f * 12) + ' 24 C' + (f * 21) + ' 31 ' + (f * 24) + ' 38 ' + (f * 21) + ' 45"/>';
  });
  s += '</g>';

  // --- Antennae, ending in a little coloured bead.
  s += '<g fill="none" stroke="' + O + '" stroke-width="3" stroke-linecap="round">' +
       '<path d="M-6 -26 C-12 -36 -16 -42 -19 -48"/>' +
       '<path d="M6 -26 C12 -36 16 -42 19 -48"/></g>';
  s += '<circle cx="-20" cy="-50" r="4.2" fill="' + c.tip + '" stroke="' + O + '" stroke-width="2.6"/>';
  s += '<circle cx="20" cy="-50" r="4.2" fill="' + c.tip + '" stroke="' + O + '" stroke-width="2.6"/>';

  // --- Abdomen: a teardrop with three bands.
  s += '<path d="M0 -6 C13 -6 15 8 14 20 C13 32 7 40 0 40 C-7 40 -13 32 -14 20 C-15 8 -13 -6 0 -6 Z" ' +
       'fill="' + c.body + '" stroke="' + O + '" stroke-width="3.4" stroke-linejoin="round"/>';
  s += '<g fill="none" stroke="' + c.band + '" stroke-width="5" stroke-linecap="round">' +
       '<path d="M-13 6 H13"/><path d="M-13.5 17 H13.5"/><path d="M-11 28 H11"/></g>';
  // Re-stroke the outline so the bands stop cleanly at the edge.
  s += '<path d="M0 -6 C13 -6 15 8 14 20 C13 32 7 40 0 40 C-7 40 -13 32 -14 20 C-15 8 -13 -6 0 -6 Z" ' +
       'fill="none" stroke="' + O + '" stroke-width="3.4" stroke-linejoin="round"/>';

  // --- Head.
  s += '<ellipse cx="0" cy="-18" rx="20.5" ry="16.5" fill="' + c.body +
       '" stroke="' + O + '" stroke-width="3.4"/>';

  // --- Eyes. Huge, round, with a highlight — this is what makes her read the
  // bug as a friend rather than as something to be afraid of.
  [-1, 1].forEach(f => {
    s += '<circle cx="' + (f * 8.5) + '" cy="-20" r="9.8" fill="#fff" stroke="' + O +
         '" stroke-width="3"/>';
    if (dizzy) {
      // A spiral: two turns, drawn as a single stroked path.
      s += '<path d="M' + (f * 8.5) + ' -20 m0 -5.5 a5.5 5.5 0 1 1 -5.5 5.5 a4 4 0 1 1 4 -4 a2.4 2.4 0 1 1 -2.4 2.4" ' +
           'fill="none" stroke="' + O + '" stroke-width="2.2" stroke-linecap="round"/>';
    } else {
      s += '<circle cx="' + (f * 8.5) + '" cy="-19" r="5.6" fill="#3A2118"/>';
      s += '<circle cx="' + (f * 8.5 - 1.9) + '" cy="-21.6" r="2.2" fill="#fff"/>';
    }
  });

  // --- Proboscis: a long narrow V running down over the abdomen. Without
  // this the drawing reads as a bee; with it, she names it straight away.
  s += '<g fill="none" stroke="' + O + '" stroke-width="3" stroke-linecap="round">' +
       '<path d="M-7 -8 L0 32"/><path d="M7 -8 L0 32"/></g>';

  // --- Mouth: a small smile, or a wobble when dizzy.
  s += dizzy
    ? '<path d="M-5 -6 q2.5 -2.6 5 0 q2.5 2.6 5 0" fill="none" stroke="' + O +
      '" stroke-width="2.4" stroke-linecap="round"/>'
    : '';

  return s;
}

/* The jar in the corner: how many she has caught, as a numeral. Same idea as
   the bucket in the fishing game — the number is the reward, and it is the
   part she is actually learning. Empty, it shows nothing rather than a zero. */
const BUG_JAR = { x: 312, y: 210, w: 70, h: 70 };

function bugJarArt(n) {
  const J = BUG_JAR, O = BUG_OUTLINE;
  let s = '';
  s += '<rect x="' + (J.x + 18) + '" y="' + (J.y - 14) + '" width="' + (J.w - 36) +
       '" height="14" fill="#CFE6F5" stroke="' + O + '" stroke-width="3.5"/>';
  s += '<rect x="' + (J.x + 8) + '" y="' + (J.y - 24) + '" width="' + (J.w - 16) +
       '" height="12" rx="5" fill="#F0B23C" stroke="' + O + '" stroke-width="3.5"/>';
  s += '<rect x="' + J.x + '" y="' + J.y + '" width="' + J.w + '" height="' + J.h +
       '" rx="14" fill="#DCEEF9" fill-opacity=".92" stroke="' + O + '" stroke-width="4"/>';
  if (n > 0) {
    // Two digits need a smaller face, or «20» runs off the sides of the jar.
    s += '<text x="' + (J.x + J.w / 2) + '" y="' + (J.y + J.h / 2 + 2) +
         '" text-anchor="middle" dominant-baseline="central" ' +
         'font-family="ui-rounded, system-ui, sans-serif" font-size="' + (n > 9 ? 32 : 42) +
         '" font-weight="700" fill="' + O + '">' + n + '</text>';
  }
  return s;
}

/* What she sees where the mosquito was: a burst of stars and a dizzy swirl.
   It fades out on its own and is then removed from the board. */
function bugPoofArt() {
  let s = '<circle r="16" fill="#FFF3B0" fill-opacity=".85"/>';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a) * 22, y = Math.sin(a) * 22;
    s += '<path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z" ' +
         'fill="#F6C445" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
  }
  return s;
}

// ---------------------------------------------------------------- state

let bugSvg = null;
let bugs = [];
let bugCaught = 0;
let bugRaf = 0;
let bugLast = 0;

function bugState() {
  return { caught: bugCaught, total: BUG_COUNT, done: bugCaught >= BUG_COUNT };
}

function bugInit(svgEl) {
  bugSvg = svgEl;
  bugSvg.setAttribute('viewBox', '0 0 ' + BUG_W + ' ' + BUG_H);

  // One listener on the board, not one per mosquito: the bugs move, and a
  // near-miss on empty space still has to count as a hit on the closest one.
  bugSvg.onpointerdown = bugTap;
  bugReset();
}

function bugReset() {
  bugStop();
  bugCaught = 0;
  bugs = [];
  // Same as the lake: a loose grid keeps twenty of them from starting in a
  // heap. They drift apart from there on their own.
  const cols = 5, rows = Math.ceil(BUG_COUNT / cols);
  const cellW = (BUG_W - BUG_MARGIN * 2) / cols, cellH = (BUG_H - BUG_MARGIN * 2) / rows;
  for (let i = 0; i < BUG_COUNT; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    bugs.push({
      x: BUG_MARGIN + col * cellW + cellW * (0.15 + Math.random() * 0.7),
      y: BUG_MARGIN + row * cellH + cellH * (0.15 + Math.random() * 0.7),
      dir: Math.random() * Math.PI * 2,
      turn: (Math.random() - 0.5) * 1.2,   // radians per second of drift
      wob: Math.random() * 6,
      colors: BUG_COLORS[i % BUG_COLORS.length],
      gone: false
    });
  }
  bugBuild();
  bugStart();
}

/* Build the nodes once and keep a handle on each <g>. */
function bugBuild() {
  if (!bugSvg) return;
  bugSvg.innerHTML =
    '<rect width="' + BUG_W + '" height="' + BUG_H + '" fill="#E9F3FA"/>' +
    '<g id="bugPoofs"></g><g id="bugHost"></g><g id="bugJar"></g>';
  bugDrawJar();
  const host = bugSvg.querySelector('#bugHost');
  bugs.forEach((b, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'bug');
    // Staggered so the eight of them do not flap in lockstep.
    g.style.setProperty('--flap-delay', (i * 0.043).toFixed(3) + 's');
    // The inner group carries the drawing and, later, the fly-away animation,
    // so the outer transform stays free for the position set each frame.
    const inner = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    inner.setAttribute('class', 'bugin');
    inner.setAttribute('transform', 'scale(' + BUG_SCALE + ')');
    inner.innerHTML = bugArt(b.colors, false);
    g.appendChild(inner);
    host.appendChild(g);
    b.node = g;
    b.inner = inner;
  });
  bugPlace();
}

function bugPlace() {
  bugs.forEach(b => {
    if (!b.node || b.gone) return;
    // The body tilts a little into the direction of travel; a mosquito that
    // slides sideways without leaning looks like a sticker being dragged.
    const lean = Math.sin(b.dir) * 12;
    b.node.setAttribute('transform',
      'translate(' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + ') rotate(' + lean.toFixed(1) + ')');
  });
}

// ------------------------------------------------------------- movement

function bugStep(dt) {
  bugs.forEach(b => {
    if (b.gone) return;

    // Wander: a slow random turn plus a sine wobble, so the path curves
    // instead of running in straight lines.
    b.wob += dt * 3.2;
    b.dir += (b.turn + Math.sin(b.wob) * 0.9) * dt;

    b.x += Math.cos(b.dir) * BUG_SPEED * dt;
    b.y += Math.sin(b.dir) * BUG_SPEED * dt;

    // Bounce off the edges by reflecting the heading, and nudge back inside
    // so a bug can never get pinned to the wall.
    if (b.x < BUG_MARGIN) { b.x = BUG_MARGIN; b.dir = Math.PI - b.dir; }
    if (b.x > BUG_W - BUG_MARGIN) { b.x = BUG_W - BUG_MARGIN; b.dir = Math.PI - b.dir; }
    if (b.y < BUG_MARGIN) { b.y = BUG_MARGIN; b.dir = -b.dir; }
    if (b.y > BUG_H - BUG_MARGIN) { b.y = BUG_H - BUG_MARGIN; b.dir = -b.dir; }
  });
  bugPlace();
}

function bugFrame(now) {
  if (!bugLast) bugLast = now;
  const dt = Math.min(0.05, (now - bugLast) / 1000);
  bugLast = now;
  bugStep(dt);
  bugRaf = requestAnimationFrame(bugFrame);
}

function bugStart() {
  if (bugRaf) return;
  bugLast = 0;
  bugRaf = requestAnimationFrame(bugFrame);
}

function bugStop() {
  if (bugRaf) cancelAnimationFrame(bugRaf);
  bugRaf = 0;
}

// ------------------------------------------------------------------ tap

let bugDoneCb = null;
function bugOnDone(fn) { bugDoneCb = fn; }

function bugTap(ev) {
  if (!bugSvg) return;
  ev.preventDefault();

  // Screen pixels to viewBox units. getBoundingClientRect is the reliable
  // route here: createSVGPoint/getScreenCTM misbehaves inside a hidden
  // parent, which is exactly what our screens are before they open.
  const r = bugSvg.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const x = ((ev.clientX - r.left) / r.width) * BUG_W;
  const y = ((ev.clientY - r.top) / r.height) * BUG_H;

  // Closest mosquito within the (generous) hit radius.
  let best = null, bestD = BUG_HIT * BUG_HIT;
  bugs.forEach(b => {
    if (b.gone) return;
    const d = (b.x - x) * (b.x - x) + (b.y - y) * (b.y - y);
    if (d <= bestD) { bestD = d; best = b; }
  });
  if (!best) return;

  // Caught: it goes cross-eyed and tumbles off the board rather than simply
  // disappearing. She gets to see that she hit it.
  best.gone = true;
  if (best.inner) {
    best.inner.innerHTML = bugArt(BUG_DIZZY, true);
    best.inner.setAttribute('class', 'bugin bugout');
    const node = best.node;
    setTimeout(() => { if (node) node.style.display = 'none'; }, 900);
  }
  bugCaught++;
  bugDrawJar();
  bugPoof(best.x, best.y);

  if (bugCaught >= BUG_COUNT) {
    bugStop();
    if (bugDoneCb) bugDoneCb();
  }
}

function bugDrawJar() {
  const host = bugSvg && bugSvg.querySelector('#bugJar');
  if (host) host.innerHTML = bugJarArt(bugCaught);
}

function bugPoof(x, y) {
  const host = bugSvg && bugSvg.querySelector('#bugPoofs');
  if (!host) return;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'bugpoof');
  g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
  g.innerHTML = bugPoofArt();
  host.appendChild(g);
  setTimeout(() => { if (g.parentNode) g.parentNode.removeChild(g); }, 600);
}
