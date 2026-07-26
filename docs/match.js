/* Une con la flecha — groups of things on the left, numerals on the right,
   and a line she paints with her finger from one to the other.

   The whole game is one SVG. That is what makes the line easy: the finger,
   the cards and the stroke all live in the same coordinate system, so there
   is no arithmetic between screen pixels and layout boxes, and nothing drifts
   when the board is resized or the iPad is turned.

   A wrong line simply is not left behind. There is no buzzer and no score —
   she tries the next number. */

'use strict';

const MATCH_W = 640;
const MATCH_H = 440;
const MATCH_ROWS = 4;

const MATCH_OUTLINE = '#4A3A2C';
const MATCH_INK = '#26215C';

// One colour per row, so two lines crossing the middle stay tellable apart.
const MATCH_HUES = ['#D4537E', '#2F9E6E', '#3E7BD6', '#E08A1E'];

const MATCH_LEFT = { x: 16, w: 288 };
const MATCH_RIGHT = { x: 512, w: 112 };
const MATCH_ROW_H = 100;
const MATCH_CARD_H = 88;

function matchRowY(i) { return i * MATCH_ROW_H + MATCH_ROW_H / 2 + 10; }

// Where a line starts and ends: just outside each card, not at its centre, so
// the stroke never runs underneath the drawing.
function matchStart(i) { return { x: MATCH_LEFT.x + MATCH_LEFT.w + 10, y: matchRowY(i) }; }
function matchEnd(i) { return { x: MATCH_RIGHT.x - 10, y: matchRowY(i) }; }

// ---------------------------------------------------------------- state

let matchSvg = null;
let matchRows = [];        // [{ item, count, numeral, linked, hue }]
let matchOrder = [];       // which numeral sits in each right-hand slot
let matchDrag = null;      // { row, x, y } while a line is being painted
let matchDoneCb = null;

function matchState() {
  return { linked: matchRows.filter(r => r.linked).length, total: MATCH_ROWS };
}

function matchOnDone(fn) { matchDoneCb = fn; }

function matchInit(svgEl) {
  matchSvg = svgEl;
  matchSvg.setAttribute('viewBox', '0 0 ' + MATCH_W + ' ' + MATCH_H);
  matchSvg.onpointerdown = matchDown;
  matchReset();
}

/* A round is four different things to count, four different amounts, and the
   numerals shuffled down the right-hand side. */
function matchReset() {
  matchDrag = null;

  const items = COUNT_ITEMS.slice();
  const counts = [];
  for (let n = 1; n <= 9; n++) counts.push(n);

  // Shuffle both, then take four of each.
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  shuffle(items); shuffle(counts);

  matchRows = [];
  for (let i = 0; i < MATCH_ROWS; i++) {
    matchRows.push({
      item: items[i],
      count: counts[i],
      linked: false,
      hue: MATCH_HUES[i % MATCH_HUES.length]
    });
  }

  // The numerals go down the right in their own order — otherwise every line
  // is horizontal and she can win without counting anything.
  matchOrder = shuffle(matchRows.map((r, i) => i));

  // A round where every line happens to be straight teaches nothing, so it is
  // reshuffled until at least two rows cross.
  let straight = matchOrder.every((rowIndex, slot) => rowIndex === slot);
  if (straight) matchOrder.reverse();

  matchDraw();
}

// ------------------------------------------------------------------ art

function matchGroupArt(item, n, box) {
  // countGroupSVG returns a standalone <svg>; nesting it lets the browser do
  // the fitting for us instead of us guessing a scale.
  return countGroupSVG(item, n).replace('<svg ',
    '<svg x="' + box.x + '" y="' + box.y + '" width="' + box.w + '" height="' + box.h +
    '" preserveAspectRatio="xMidYMid meet" ');
}

function matchDraw() {
  if (!matchSvg) return;
  let s = '<rect width="' + MATCH_W + '" height="' + MATCH_H + '" fill="none"/>';

  // --- the finished lines, then the one being painted, all under the cards
  // so a stroke never covers a drawing.
  matchRows.forEach((row, i) => {
    if (!row.linked) return;
    const a = matchStart(i);
    const b = matchEnd(row.slot);
    s += matchLine(a, b, row.hue, true);
  });

  if (matchDrag) {
    const a = matchStart(matchDrag.row);
    s += matchLine(a, { x: matchDrag.x, y: matchDrag.y },
                   matchRows[matchDrag.row].hue, false);
  }

  // --- left: the groups
  matchRows.forEach((row, i) => {
    const y = matchRowY(i) - MATCH_CARD_H / 2;
    s += '<rect x="' + MATCH_LEFT.x + '" y="' + y + '" width="' + MATCH_LEFT.w +
         '" height="' + MATCH_CARD_H + '" rx="22" fill="#fff" stroke="' +
         (row.linked ? row.hue : '#E4E0F0') + '" stroke-width="4"/>';
    s += matchGroupArt(row.item, row.count,
      { x: MATCH_LEFT.x + 14, y: y + 10, w: MATCH_LEFT.w - 28, h: MATCH_CARD_H - 20 });
    // The grab handle: a dot on the edge, so it is obvious where a line starts.
    const a = matchStart(i);
    s += '<circle cx="' + a.x + '" cy="' + a.y + '" r="9" fill="' + row.hue + '"/>';
  });

  // --- right: the numerals, in their shuffled slots
  matchOrder.forEach((rowIndex, slot) => {
    const row = matchRows[rowIndex];
    const y = matchRowY(slot) - MATCH_CARD_H / 2;
    s += '<rect x="' + MATCH_RIGHT.x + '" y="' + y + '" width="' + MATCH_RIGHT.w +
         '" height="' + MATCH_CARD_H + '" rx="22" fill="' +
         (row.linked ? row.hue : '#fff') + '" stroke="' +
         (row.linked ? row.hue : '#E4E0F0') + '" stroke-width="4"/>';
    s += '<text x="' + (MATCH_RIGHT.x + MATCH_RIGHT.w / 2) + '" y="' + (y + MATCH_CARD_H / 2) +
         '" text-anchor="middle" dominant-baseline="central" ' +
         'font-family="ui-rounded, system-ui, sans-serif" font-size="58" font-weight="700" fill="' +
         (row.linked ? '#fff' : MATCH_INK) + '">' + row.count + '</text>';
    const b = matchEnd(slot);
    s += '<circle cx="' + b.x + '" cy="' + b.y + '" r="9" fill="' +
         (row.linked ? row.hue : '#CFC9E4') + '"/>';
  });

  matchSvg.innerHTML = s;
}

/* The line itself. It bows a little instead of running dead straight, which
   makes two lines crossing the middle much easier to follow, and it grows an
   arrowhead once it has landed. */
function matchLine(a, b, hue, done) {
  const midX = (a.x + b.x) / 2;
  const d = 'M' + a.x + ' ' + a.y + ' Q' + midX + ' ' + ((a.y + b.y) / 2) +
            ' ' + b.x + ' ' + b.y;
  let s = '<path d="' + d + '" fill="none" stroke="' + hue + '" stroke-width="' +
          (done ? 9 : 8) + '" stroke-linecap="round" opacity="' + (done ? 1 : 0.75) + '"/>';
  if (done) {
    const ang = Math.atan2(b.y - ((a.y + b.y) / 2), b.x - midX) * 180 / Math.PI;
    s += '<path d="M0 0 L-17 -9 L-17 9 Z" fill="' + hue + '" transform="translate(' +
         b.x + ' ' + b.y + ') rotate(' + ang.toFixed(1) + ')"/>';
  }
  return s;
}

// ----------------------------------------------------------------- drag

function matchPoint(ev) {
  const r = matchSvg.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return {
    x: ((ev.clientX - r.left) / r.width) * MATCH_W,
    y: ((ev.clientY - r.top) / r.height) * MATCH_H
  };
}

/* Which row did she start on? Anywhere in the left card counts, plus a wide
   band around the handle — the line has to be easy to start. */
function matchRowAt(p) {
  for (let i = 0; i < MATCH_ROWS; i++) {
    if (matchRows[i].linked) continue;
    const y = matchRowY(i);
    const inRow = Math.abs(p.y - y) <= MATCH_ROW_H / 2;
    if (inRow && p.x <= MATCH_LEFT.x + MATCH_LEFT.w + 40) return i;
  }
  return -1;
}

function matchSlotAt(p) {
  for (let slot = 0; slot < MATCH_ROWS; slot++) {
    const y = matchRowY(slot);
    if (Math.abs(p.y - y) <= MATCH_ROW_H / 2 && p.x >= MATCH_RIGHT.x - 46) return slot;
  }
  return -1;
}

function matchDown(ev) {
  if (!matchSvg) return;
  const p = matchPoint(ev);
  if (!p) return;
  const row = matchRowAt(p);
  if (row < 0) return;
  ev.preventDefault();
  matchDrag = { row: row, x: p.x, y: p.y };
  matchDraw();
}

function matchMove(ev) {
  if (!matchDrag) return;
  const p = matchPoint(ev);
  if (!p) return;
  ev.preventDefault();
  matchDrag.x = p.x;
  matchDrag.y = p.y;
  matchDraw();
}

/* Listening for the release on the window, not on the board: a finger that
   lifts off the edge of the screen still has to end the line. */
function matchUp(ev) {
  if (!matchDrag) return;
  const p = matchPoint(ev) || { x: -1, y: -1 };
  const row = matchDrag.row;
  matchDrag = null;

  const slot = matchSlotAt(p);
  if (slot >= 0 && matchOrder[slot] === row) {
    matchRows[row].linked = true;
    matchRows[row].slot = slot;
  }
  matchDraw();

  if (matchRows.every(r => r.linked) && matchDoneCb) matchDoneCb();
}
