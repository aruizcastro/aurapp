/* El gusanito — a snake game with everything stressful taken out.

   The worm moves one cell per tap instead of sliding on a timer. That single
   change is what makes it playable at four: no reaction speed, no rush, and
   she can stop and think for as long as she likes.

   It also cannot lose. Walls stop it, its own body is passed straight
   through, and there is no timer. The only ending is a happy one: eat the
   last berry and it grins. */

'use strict';

const WORM_COLS = 8;
const WORM_ROWS = 6;
const WORM_CELL = 60;
const WORM_BERRIES = 8;

const WORM_OUTLINE = '#3F5C2A';
const WORM_BODY = '#7FBF4D';
const WORM_BODY_DARK = '#68A63C';
const WORM_BERRY = '#F08A2C';

// ---------------------------------------------------------------- state

let wormSvg = null;
let wormBody = [];      // [{c, r}], head first
let wormDir = { c: 1, r: 0 };
let wormDots = [];
let wormDone = false;
let wormBump = null;    // cell the worm just failed to leave, for the nudge

function wormState() {
  return { eaten: WORM_BERRIES - wormDots.length, total: WORM_BERRIES, done: wormDone };
}

function wormInit(svgEl) {
  wormSvg = svgEl;
  wormSvg.setAttribute('viewBox', '0 0 ' + (WORM_COLS * WORM_CELL) + ' ' + (WORM_ROWS * WORM_CELL));
  wormReset();
}

function wormReset() {
  wormBody = [{ c: 2, r: 3 }, { c: 1, r: 3 }];
  wormDir = { c: 1, r: 0 };
  wormDone = false;
  wormBump = null;
  wormDots = [];

  // Berries never land on the worm, and never on top of each other.
  const taken = new Set(wormBody.map(s => s.c + ',' + s.r));
  while (wormDots.length < WORM_BERRIES) {
    const c = Math.floor(Math.random() * WORM_COLS);
    const r = Math.floor(Math.random() * WORM_ROWS);
    const key = c + ',' + r;
    if (taken.has(key)) continue;
    taken.add(key);
    wormDots.push({ c: c, r: r });
  }
  wormDraw();
}

/* One tap, one cell. Returns 'ate', 'moved', 'blocked' or 'done'. */
function wormStep(dc, dr) {
  if (wormDone) return 'done';

  const head = wormBody[0];
  const next = { c: head.c + dc, r: head.r + dr };
  wormBump = null;

  // A wall simply stops it. No bounce, no penalty, no losing a turn that
  // matters — at four, being punished for a wrong tap ends the game for good.
  if (next.c < 0 || next.c >= WORM_COLS || next.r < 0 || next.r >= WORM_ROWS) {
    wormBump = { c: head.c, r: head.r, dc: dc, dr: dr };
    wormDraw();
    return 'blocked';
  }

  wormDir = { c: dc, r: dr };

  const hit = wormDots.findIndex(d => d.c === next.c && d.r === next.r);
  wormBody.unshift(next);

  if (hit >= 0) {
    wormDots.splice(hit, 1);           // growing = not dropping the tail
    if (wormDots.length === 0) wormDone = true;
  } else {
    wormBody.pop();
  }

  wormDraw();
  return hit >= 0 ? (wormDone ? 'done' : 'ate') : 'moved';
}

// ------------------------------------------------------------------ art

function wormCentre(cell) {
  return { x: cell.c * WORM_CELL + WORM_CELL / 2, y: cell.r * WORM_CELL + WORM_CELL / 2 };
}

function wormBerry(cell) {
  const p = wormCentre(cell);
  return '<circle cx="' + p.x + '" cy="' + p.y + '" r="17" fill="' + WORM_BERRY +
         '" stroke="' + WORM_OUTLINE + '" stroke-width="6"/>' +
         '<circle cx="' + (p.x - 5) + '" cy="' + (p.y - 6) + '" r="4.5" fill="#FFFFFF" opacity=".75"/>' +
         '<path d="M' + p.x + ' ' + (p.y - 16) + ' C' + (p.x + 4) + ' ' + (p.y - 26) + ' ' +
         (p.x + 13) + ' ' + (p.y - 27) + ' ' + (p.x + 16) + ' ' + (p.y - 24) +
         '" fill="none" stroke="#4E8C2E" stroke-width="5" stroke-linecap="round"/>';
}

function wormFace() {
  const head = wormCentre(wormBody[0]);
  const away = 9;
  const ex = wormDir.c * 3, ey = wormDir.r * 3;
  let s = '';

  // Eyes sit slightly ahead of centre, in the direction of travel, which is
  // what makes a circle read as "looking that way".
  s += '<circle cx="' + (head.x - away + ex) + '" cy="' + (head.y - 6 + ey) + '" r="6" fill="' + WORM_OUTLINE + '"/>';
  s += '<circle cx="' + (head.x + away + ex) + '" cy="' + (head.y - 6 + ey) + '" r="6" fill="' + WORM_OUTLINE + '"/>';
  s += '<circle cx="' + (head.x - away + ex - 2) + '" cy="' + (head.y - 8 + ey) + '" r="2.2" fill="#FFFFFF"/>';
  s += '<circle cx="' + (head.x + away + ex - 2) + '" cy="' + (head.y - 8 + ey) + '" r="2.2" fill="#FFFFFF"/>';

  if (wormDone) {
    // The reward for finishing: a big open grin and rosy cheeks.
    s += '<path d="M' + (head.x - 13) + ' ' + (head.y + 6) + ' C' + (head.x - 10) + ' ' + (head.y + 22) +
         ' ' + (head.x + 10) + ' ' + (head.y + 22) + ' ' + (head.x + 13) + ' ' + (head.y + 6) +
         ' Z" fill="#8C4A44" stroke="' + WORM_OUTLINE + '" stroke-width="4"/>';
    s += '<ellipse cx="' + (head.x - 20) + '" cy="' + (head.y + 6) + '" rx="7" ry="5" fill="#E8927A" opacity=".8"/>';
    s += '<ellipse cx="' + (head.x + 20) + '" cy="' + (head.y + 6) + '" rx="7" ry="5" fill="#E8927A" opacity=".8"/>';
  } else {
    s += '<path d="M' + (head.x - 8) + ' ' + (head.y + 8) + ' C' + (head.x - 4) + ' ' + (head.y + 14) +
         ' ' + (head.x + 4) + ' ' + (head.y + 14) + ' ' + (head.x + 8) + ' ' + (head.y + 8) +
         '" fill="none" stroke="' + WORM_OUTLINE + '" stroke-width="4.5" stroke-linecap="round"/>';
  }

  // Two little antennae, so the head is obvious even at a glance.
  s += '<g stroke="' + WORM_OUTLINE + '" stroke-width="4.5" stroke-linecap="round" fill="none">' +
       '<path d="M' + (head.x - 8) + ' ' + (head.y - 20) + ' L' + (head.x - 13) + ' ' + (head.y - 32) + '"/>' +
       '<path d="M' + (head.x + 8) + ' ' + (head.y - 20) + ' L' + (head.x + 13) + ' ' + (head.y - 32) + '"/></g>' +
       '<circle cx="' + (head.x - 13) + '" cy="' + (head.y - 34) + '" r="4" fill="' + WORM_OUTLINE + '"/>' +
       '<circle cx="' + (head.x + 13) + '" cy="' + (head.y - 34) + '" r="4" fill="' + WORM_OUTLINE + '"/>';

  return s;
}

function wormDraw() {
  if (!wormSvg) return;
  const W = WORM_COLS * WORM_CELL, H = WORM_ROWS * WORM_CELL;
  let s = '<rect width="' + W + '" height="' + H + '" fill="#E8F4DC"/>';

  for (let r = 0; r < WORM_ROWS; r++) {
    for (let c = 0; c < WORM_COLS; c++) {
      const p = wormCentre({ c: c, r: r });
      s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="2.5" fill="#B9D9A0"/>';
    }
  }

  wormDots.forEach(d => { s += wormBerry(d); });

  // Tail first so the head ends up on top of its own neck.
  for (let i = wormBody.length - 1; i >= 0; i--) {
    const p = wormCentre(wormBody[i]);
    const isHead = i === 0;
    const radius = isHead ? 25 : 21 - Math.min(6, i * 0.6);
    s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + radius.toFixed(1) +
         '" fill="' + (isHead ? WORM_BODY : (i % 2 ? WORM_BODY_DARK : WORM_BODY)) +
         '" stroke="' + WORM_OUTLINE + '" stroke-width="6"/>';
  }

  s += wormFace();

  if (wormBump) {
    const p = wormCentre(wormBump);
    s += '<circle cx="' + (p.x + wormBump.dc * 20) + '" cy="' + (p.y + wormBump.dr * 20) +
         '" r="9" fill="none" stroke="#F0B23C" stroke-width="5" opacity=".9"/>';
  }

  if (wormDone) {
    [[0.2, 0.25], [0.5, 0.15], [0.8, 0.28]].forEach(([fx, fy], i) => {
      s += '<path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z" fill="#F6D34A" ' +
           'transform="translate(' + (W * fx) + ' ' + (H * fy) + ') scale(' + (1 + i * 0.2) + ')"/>';
    });
  }

  wormSvg.innerHTML = s;
}
