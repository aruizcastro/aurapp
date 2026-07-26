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
const BUG_COUNT = 8;
const BUG_HIT = 46;           // tap radius in viewBox units — deliberately huge
const BUG_SPEED = 26;         // units per second
const BUG_MARGIN = 34;        // keeps a whole mosquito inside the board

const BUG_OUTLINE = '#3A2E4A';
const BUG_BODY = '#8E7CB0';
const BUG_BODY_DARK = '#6F5F91';
const BUG_WING = '#CFE6F5';

// ---------------------------------------------------------------- art

/* The mosquito is drawn once, at the origin, and then only its <g> transform
   changes each frame. Rebuilding the whole SVG sixty times a second is what
   makes these games stutter on an old iPad. */
function bugArt() {
  const O = BUG_OUTLINE;
  let s = '';

  // Wings behind the body. The flap is a CSS animation on scaleY so that the
  // main loop never has to touch them.
  s += '<ellipse class="wing wl" cx="-13" cy="-15" rx="15" ry="8" fill="' + BUG_WING +
       '" fill-opacity=".8" stroke="' + O + '" stroke-width="2.5"/>';
  s += '<ellipse class="wing wr" cx="13" cy="-15" rx="15" ry="8" fill="' + BUG_WING +
       '" fill-opacity=".8" stroke="' + O + '" stroke-width="2.5"/>';

  // Legs — four thin strokes, two a side.
  s += '<g fill="none" stroke="' + O + '" stroke-width="2.5" stroke-linecap="round">' +
       '<path d="M-6 10 C-14 16 -18 20 -20 26"/>' +
       '<path d="M-4 12 C-10 20 -12 24 -12 30"/>' +
       '<path d="M6 10 C14 16 18 20 20 26"/>' +
       '<path d="M4 12 C10 20 12 24 12 30"/></g>';

  // Body: a fat little abdomen with two stripes.
  s += '<ellipse cx="0" cy="6" rx="11" ry="14" fill="' + BUG_BODY +
       '" stroke="' + O + '" stroke-width="3"/>';
  s += '<path d="M-10 3 H10" stroke="' + BUG_BODY_DARK + '" stroke-width="4" ' +
       'stroke-linecap="round" fill="none"/>';
  s += '<path d="M-9 11 H9" stroke="' + BUG_BODY_DARK + '" stroke-width="4" ' +
       'stroke-linecap="round" fill="none"/>';

  // Head, antennae, and a friendly face. The proboscis points down so it
  // reads as a mosquito and not as a bee.
  s += '<g fill="none" stroke="' + O + '" stroke-width="2.5" stroke-linecap="round">' +
       '<path d="M-5 -14 C-9 -22 -12 -25 -16 -27"/>' +
       '<path d="M5 -14 C9 -22 12 -25 16 -27"/></g>';
  s += '<circle cx="-16" cy="-28" r="2.6" fill="' + O + '"/>';
  s += '<circle cx="16" cy="-28" r="2.6" fill="' + O + '"/>';
  s += '<circle cx="0" cy="-10" r="10" fill="' + BUG_BODY +
       '" stroke="' + O + '" stroke-width="3"/>';
  s += '<circle cx="-3.6" cy="-12" r="3.2" fill="#fff"/>';
  s += '<circle cx="3.6" cy="-12" r="3.2" fill="#fff"/>';
  s += '<circle cx="-3" cy="-11.4" r="1.7" fill="' + O + '"/>';
  s += '<circle cx="4.2" cy="-11.4" r="1.7" fill="' + O + '"/>';
  s += '<path d="M0 -2 V4" stroke="' + O + '" stroke-width="2.5" stroke-linecap="round"/>';

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
  for (let i = 0; i < BUG_COUNT; i++) {
    bugs.push({
      x: BUG_MARGIN + Math.random() * (BUG_W - BUG_MARGIN * 2),
      y: BUG_MARGIN + Math.random() * (BUG_H - BUG_MARGIN * 2),
      dir: Math.random() * Math.PI * 2,
      turn: (Math.random() - 0.5) * 1.2,   // radians per second of drift
      wob: Math.random() * 6,
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
    '<g id="bugPoofs"></g><g id="bugHost"></g>';
  const host = bugSvg.querySelector('#bugHost');
  const art = bugArt();
  bugs.forEach((b, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'bug');
    // Staggered so the eight of them do not flap in lockstep.
    g.style.setProperty('--flap-delay', (i * 0.043).toFixed(3) + 's');
    g.innerHTML = art;
    host.appendChild(g);
    b.node = g;
  });
  bugPlace();
}

function bugPlace() {
  bugs.forEach(b => {
    if (!b.node) return;
    if (b.gone) { b.node.style.display = 'none'; return; }
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

  best.gone = true;
  if (best.node) best.node.style.display = 'none';
  bugCaught++;
  bugPoof(best.x, best.y);

  if (bugCaught >= BUG_COUNT) {
    bugStop();
    if (bugDoneCb) bugDoneCb();
  }
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
