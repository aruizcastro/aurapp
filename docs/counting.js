/* Los números — drag a numeral onto the group that has that many things.

   One numeral, three groups. Choosing between three is the sweet spot at
   four: one option is no choice at all, and five is a wall of pictures.

   A wrong drop costs nothing. The card floats back and she tries again,
   because at this age the counting itself is the exercise — being told off
   for it just makes her stop counting. */

'use strict';

const COUNT_OUTLINE = '#4A3A2C';
const COUNT_MAX = 9;

function countPath(d, fill, width) {
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + COUNT_OUTLINE +
         '" stroke-width="' + (width || 5) + '" stroke-linejoin="round"/>';
}

/* Nine things to count. Each is drawn around 0,0 in a box about 60 wide, so
   the same layout code can lay out any of them. */
const COUNT_ITEMS = [
  { id: 'ball', name: 'balones', draw: () =>
    '<circle cx="0" cy="0" r="24" fill="#F5D14E" stroke="' + COUNT_OUTLINE + '" stroke-width="5"/>' +
    '<path d="M-8 -22 C-14 -11 -14 11 -8 22 L-1 24 L-1 -24 Z" fill="#E24B4A"/>' +
    '<path d="M8 -22 C14 -11 14 11 8 22 L1 24 L1 -24 Z" fill="#5AA0E8"/>' +
    '<circle cx="0" cy="0" r="24" fill="none" stroke="' + COUNT_OUTLINE + '" stroke-width="5"/>' },

  { id: 'star', name: 'estrellas', draw: () =>
    countPath('M0 -26 L7 -8 L26 -8 L11 4 L17 24 L0 12 L-17 24 L-11 4 L-26 -8 L-7 -8 Z', '#F6C64A') },

  { id: 'flower', name: 'flores', draw: () =>
    '<g fill="#EF7FA8" stroke="' + COUNT_OUTLINE + '" stroke-width="5">' +
      '<circle cx="0" cy="-16" r="11"/><circle cx="15" cy="-5" r="11"/>' +
      '<circle cx="9" cy="13" r="11"/><circle cx="-9" cy="13" r="11"/>' +
      '<circle cx="-15" cy="-5" r="11"/></g>' +
    '<circle cx="0" cy="0" r="9" fill="#F6C64A" stroke="' + COUNT_OUTLINE + '" stroke-width="5"/>' },

  { id: 'apple', name: 'manzanas', draw: () =>
    '<circle cx="0" cy="4" r="21" fill="#E24B4A" stroke="' + COUNT_OUTLINE + '" stroke-width="5"/>' +
    '<path d="M0 -16 C4 -28 14 -30 19 -28" fill="none" stroke="#639922" stroke-width="6" stroke-linecap="round"/>' },

  { id: 'fish', name: 'pececitos', draw: () =>
    '<ellipse cx="-2" cy="0" rx="21" ry="15" fill="#5AA0E8" stroke="' + COUNT_OUTLINE + '" stroke-width="5"/>' +
    countPath('M19 0 L32 -12 L32 12 Z', '#5AA0E8') +
    '<circle cx="-9" cy="-4" r="3.4" fill="' + COUNT_OUTLINE + '"/>' },

  { id: 'butterfly', name: 'mariposas', draw: () =>
    countPath('M-2 -2 C-18 -22 -34 -14 -30 2 C-27 14 -12 12 -2 4 Z', '#C99BE0') +
    countPath('M2 -2 C18 -22 34 -14 30 2 C27 14 12 12 2 4 Z', '#C99BE0') +
    '<ellipse cx="0" cy="2" rx="4" ry="16" fill="' + COUNT_OUTLINE + '"/>' },

  { id: 'heart', name: 'corazones', draw: () =>
    countPath('M0 20 C-24 2 -20 -20 -8 -18 C-3 -17 0 -12 0 -12 C0 -12 3 -17 8 -18 ' +
              'C20 -20 24 2 0 20 Z', '#EF5B6B') },

  { id: 'leaf', name: 'hojitas', draw: () =>
    countPath('M0 -22 C20 -14 22 12 0 22 C-22 12 -20 -14 0 -22 Z', '#8CC46A') +
    '<path d="M0 -18 L0 18" stroke="' + COUNT_OUTLINE + '" stroke-width="4"/>' },

  { id: 'duck', name: 'patitos', draw: () =>
    countPath('M-18 10 C-22 -4 -12 -16 0 -16 L0 -8 C11 -11 19 -6 19 3 ' +
              'C19 12 6 18 -6 18 C-14 18 -18 15 -18 10 Z', '#F7CE3A') +
    countPath('M12 -12 L30 -7 L12 -2 Z', '#EF8B2C', 4) +
    '<circle cx="5" cy="-7" r="2.8" fill="' + COUNT_OUTLINE + '"/>' }
];

/* Lays out `n` items inside a card, in rows of at most three so nine still
   reads as a countable group rather than a crowd. */
function countGroupSVG(item, n) {
  const perRow = n <= 3 ? n : (n <= 6 ? 3 : 3);
  const rows = Math.ceil(n / perRow);
  const stepX = 74, stepY = 72;
  const width = perRow * stepX;
  const height = rows * stepY;

  let s = '';
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / perRow);
    const inRow = Math.min(perRow, n - row * perRow);
    const col = i % perRow;
    const x = (width - inRow * stepX) / 2 + col * stepX + stepX / 2;
    const y = row * stepY + stepY / 2;
    s += '<g transform="translate(' + x + ' ' + y + ')">' + item.draw() + '</g>';
  }

  return '<svg viewBox="0 0 ' + width + ' ' + height + '" aria-hidden="true">' + s + '</svg>';
}

/** The numeral she drags, drawn as plain text so it matches how it is written. */
function countNumeralSVG(n) {
  return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<text x="50" y="50" text-anchor="middle" dominant-baseline="central" ' +
    'font-family="ui-rounded, system-ui, sans-serif" font-size="76" font-weight="700" ' +
    'fill="currentColor">' + n + '</text></svg>';
}

/* A round is the numeral plus three groups, exactly one of which is right.
   The decoys sit close to the answer — 4 against 3 and 5 — so she has to
   count rather than eyeball which pile looks biggest. */
function countRound(n) {
  const item = COUNT_ITEMS[(n - 1) % COUNT_ITEMS.length];

  const wrong = [];
  const candidates = [n - 1, n + 1, n - 2, n + 2, n + 3, n - 3]
    .filter(v => v >= 1 && v <= COUNT_MAX && v !== n);
  while (wrong.length < 2 && candidates.length) {
    wrong.push(candidates.shift());
  }

  const options = [{ count: n, correct: true }]
    .concat(wrong.map(v => ({ count: v, correct: false })));

  // Shuffle so the answer is not always in the same place.
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { number: n, item: item, options: options };
}
