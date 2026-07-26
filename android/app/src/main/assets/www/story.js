/* The three little pigs: three rounds, one big button.

   The house is data, not a picture: every round builds a list of pieces
   (walls, roof, door), and the same list is what flies apart when the wolf
   blows. Drawing and destruction never disagree because they read the same
   array.

   The wolf always loses, never shows a tooth and never gets near a pig.
   He is a balloon that runs out of air, not a threat.

   Style follows pets.js: thick outline, flat fills, no gradients. Each
   frame re-serialises the whole scene into the svg's innerHTML — about
   forty pieces, and only while an animation is running. */

'use strict';

const STORY_OUTLINE = '#5A3A28';
const STORY_GROUND = 252;      // the ground line inside the 400x300 viewBox
const STORY_WOLF_X = 84;       // far enough from the edge to fall over backwards

const STORY_ROUNDS = [
  { id: 'straw', name: 'La casa de paja', material: 'Paja', falls: true,
    wall: '#F5CE55', wall2: '#E3B23C', roof: '#F0D179',
    cheer: '¡Voló la paja!', nextLabel: 'La casa de palitos' },

  { id: 'stick', name: 'La casa de palitos', material: 'Palitos', falls: true,
    wall: '#A9773F', wall2: '#8C5F30', roof: '#9A6B38',
    cheer: '¡Volaron los palitos!', nextLabel: 'La casa de ladrillos' },

  { id: 'brick', name: 'La casa de ladrillos', material: 'Ladrillos', falls: false,
    wall: '#D2503F', wall2: '#B94134', roof: '#9A6B38',
    cheer: '¡La casa aguantó!', nextLabel: '¡Otra vez!' }
];

// -------------------------------------------------------------- helpers

function storyN(v) { return Math.round(v * 10) / 10; }

function storyPath(d, fill, width) {
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + STORY_OUTLINE +
         '" stroke-width="' + (width || 9) + '" stroke-linejoin="round"/>';
}

function storyEllipse(x, y, rx, ry, fill, width) {
  return '<ellipse cx="' + storyN(x) + '" cy="' + storyN(y) + '" rx="' + storyN(rx) +
         '" ry="' + storyN(ry) + '" fill="' + fill + '" stroke="' + STORY_OUTLINE +
         '" stroke-width="' + (width || 9) + '"/>';
}

/* Drawn twice — a fat white copy underneath, the dark letters on top — so the
   word stays readable over sky or grass without relying on paint-order. */
function storyText(x, y, size, label) {
  const head = '<text x="' + storyN(x) + '" y="' + storyN(y) + '" text-anchor="middle"' +
               ' font-family="system-ui,-apple-system,sans-serif" font-size="' + size +
               '" font-weight="700"';
  return head + ' fill="#FFFFFF" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round">' +
         label + '</text>' +
         head + ' fill="' + STORY_OUTLINE + '">' + label + '</text>';
}

function storyRect(w, h) {
  return 'M' + (-w / 2) + ' ' + (-h / 2) + ' h' + w + ' v' + h + ' h' + (-w) + ' Z';
}

// Deterministic wobble, so a piece tumbles the same way every time.
function storyNoise(i) {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

// ---------------------------------------------------------------- house

/* Pieces are centred shapes: {x, y, r, d, fill, w}. Flying only ever
   changes x, y and r, so the art never has to be rebuilt. */
function storyHousePieces(index) {
  const cfg = STORY_ROUNDS[index];
  const list = [];
  const add = (x, y, r, d, fill, w) => list.push({
    x: x, y: y, r: r, d: d, fill: fill, w: w || 8, vx: 0, vy: 0, vr: 0
  });

  // The wall spans x 142–250: left of centre, so the pigs get their own room.
  if (cfg.id === 'straw') {
    for (let i = 0; i < 6; i++) {
      add(151 + i * 18, 215, i % 2 ? 3 : -3, storyRect(20, 74),
          i % 2 ? cfg.wall2 : cfg.wall);
    }
  } else if (cfg.id === 'stick') {
    for (let i = 0; i < 5; i++) {
      add(150 + i * 24, 215, i % 2 ? 2 : -2, storyRect(14, 74), cfg.wall);
    }
    add(198, 196, 0, storyRect(112, 12), cfg.wall2);
    add(198, 238, 0, storyRect(112, 12), cfg.wall2);
  } else {
    // Four courses of brick, every other one offset so the joints stagger.
    for (let row = 0; row < 4; row++) {
      const y = 244 - row * 18;
      const tone = row % 2 ? cfg.wall2 : cfg.wall;
      if (row % 2 === 0) {
        [160, 196, 232].forEach(x => add(x, y, 0, storyRect(34, 16), tone, 7));
      } else {
        add(151, y, 0, storyRect(16, 16), tone, 7);
        [178, 214].forEach(x => add(x, y, 0, storyRect(34, 16), tone, 7));
        add(241, y, 0, storyRect(16, 16), tone, 7);
      }
    }
    add(232, 148, 0, storyRect(20, 34), cfg.wall2, 7);  // chimney
  }

  add(174, 164, 0, 'M22 -32 L-42 16 L22 16 Z', cfg.roof);
  add(218, 164, 0, 'M-22 -32 L42 16 L-22 16 Z', cfg.roof);
  add(196, 136, 0, storyRect(30, 12), cfg.roof);
  const door = list[list.push({
    x: 196, y: 230, r: 0, w: 8, fill: '#8C5A3C',
    d: 'M-15 22 L-15 -8 C-15 -24 15 -24 15 -8 L15 22 Z',
    vx: 0, vy: 0, vr: 0
  }) - 1];
  door.extra = '<circle cx="8" cy="4" r="3.5" fill="' + STORY_OUTLINE + '"/>';
  return list;
}

function storyDrawPiece(p, shake) {
  if (p.x > 520 || p.x < -120 || p.y > 400) return '';
  return '<g transform="translate(' + storyN(p.x + shake) + ' ' + storyN(p.y) +
         ') rotate(' + storyN(p.r) + ')">' + storyPath(p.d, p.fill, p.w) +
         (p.extra || '') + '</g>';
}

// ----------------------------------------------------------------- wolf

/* puff  0..1  how inflated he is
   blow  0..1  how wide the mouth is blowing
   fall  0..1  how far he has toppled over backwards */
function storyWolf(puff, blow, fall) {
  const fur = '#9C9C97', belly = '#D8D6D0', dark = '#76766F';
  const tip = fall * fall;                       // falls slowly, then all at once
  const scale = 0.74 * (1 + 0.16 * puff);
  const open = 6 + blow * 12;

  let s = '';
  // Bushy tail with a pale tip, like the reference sheet.
  s += storyPath('M-22 -46 C-66 -54 -74 -96 -38 -90 C-54 -74 -46 -54 -20 -54 Z', dark);
  s += "<path d='M-38 -90 C-56 -88 -60 -74 -50 -68 C-44 -78 -40 -85 -38 -90 Z' fill='" + belly + "'/>";
  // Sitting down hard shoots both legs out in front of him.
  s += storyEllipse(-14 + fall * 12, -8 - fall * 10, 14, 9, dark);
  s += storyEllipse(14 + fall * 26, -8 - fall * 6, 14, 9, dark);
  s += storyEllipse(0, -44, 27, 31, fur);
  s += '<ellipse cx="2" cy="-36" rx="18" ry="23" fill="' + belly + '"/>';
  s += storyEllipse(-28, -50, 9, 12, fur);
  s += storyEllipse(28, -52, 9, 12, fur);

  s += storyPath('M-22 -116 L-40 -152 L-2 -128 Z', fur);
  s += storyPath('M22 -116 L40 -152 L2 -128 Z', fur);
  s += storyEllipse(0, -98, 34, 33, fur);
  s += '<path d="M-22 -122 L-33 -144 L-8 -128 Z" fill="' + dark + '"/>' +
       '<path d="M22 -122 L33 -144 L8 -128 Z" fill="' + dark + '"/>';

  // Cheeks balloon out while he winds up. This is the whole joke.
  if (puff > 0.03) {
    const cheek = 5 + puff * 14;
    s += storyEllipse(-29, -84, cheek, cheek * 0.9, belly, 7);
    s += storyEllipse(31, -84, cheek, cheek * 0.9, belly, 7);
  }

  s += "<path d='M-30 -96 C-30 -74 -14 -62 2 -62 C18 -62 32 -74 32 -94 "
       + "C22 -84 -18 -84 -30 -96 Z' fill='" + belly + "'/>";
  s += "<ellipse cx='-27' cy='-88' rx='9' ry='6' fill='#E8927A' opacity='.65'/>";
  s += "<ellipse cx='31' cy='-88' rx='9' ry='6' fill='#E8927A' opacity='.65'/>";
  s += storyEllipse(6, -80, 21, 15, belly, 7);
  s += '<ellipse cx="16" cy="-86" rx="8" ry="6" fill="' + STORY_OUTLINE + '"/>';

  if (fall > 0.5) {
    // Beaten and dizzy, never hurt: eyes shut, a small surprised mouth.
    s += '<g fill="none" stroke="' + STORY_OUTLINE + '" stroke-width="7" stroke-linecap="round">' +
         '<path d="M-24 -110 C-18 -118 -8 -118 -2 -110"/>' +
         '<path d="M4 -110 C10 -118 20 -118 26 -110"/></g>';
    s += '<ellipse cx="8" cy="-68" rx="7" ry="6" fill="#8C4A44" stroke="' +
         STORY_OUTLINE + '" stroke-width="5"/>';
  } else {
    s += '<ellipse cx="-14" cy="-108" rx="11" ry="12" fill="#FFFFFF" stroke="' +
         STORY_OUTLINE + '" stroke-width="5"/>';
    s += '<ellipse cx="14" cy="-108" rx="11" ry="12" fill="#FFFFFF" stroke="' +
         STORY_OUTLINE + '" stroke-width="5"/>';
    const pupil = 6 - puff * 2;
    s += '<circle cx="-13" cy="-107" r="' + storyN(pupil) + '" fill="' + STORY_OUTLINE + '"/>';
    s += '<circle cx="15" cy="-107" r="' + storyN(pupil) + '" fill="' + STORY_OUTLINE + '"/>';
    s += '<circle cx="-15" cy="-110" r="2.4" fill="#FFFFFF"/>';
    s += '<circle cx="13" cy="-110" r="2.4" fill="#FFFFFF"/>';
    s += '<g fill="none" stroke="' + STORY_OUTLINE + '" stroke-width="6" stroke-linecap="round">' +
         '<path d="M-26 -126 L-6 -' + storyN(130 + puff * 6) + '"/>' +
         '<path d="M26 -126 L6 -' + storyN(130 + puff * 6) + '"/></g>';
    s += '<ellipse cx="8" cy="-' + storyN(70 - blow * 2) + '" rx="' + storyN(open) +
         '" ry="' + storyN(open * 0.9) + '" fill="#8C4A44" stroke="' +
         STORY_OUTLINE + '" stroke-width="5"/>';
  }

  // He tips back and lands on his tail, legs out in front. A deeper roll
  // turned his ears into an unreadable spike, and this keeps his face —
  // which is the whole joke — pointed at the child.
  return '<g transform="translate(' + storyN(STORY_WOLF_X + 12 * tip) + ' ' +
         storyN(STORY_GROUND + 14 * tip) + ') rotate(' + storyN(-36 * tip) +
         ') scale(' + storyN(scale) + ')">' + s + '</g>';
}

// ------------------------------------------------------------------ pig

function storyPig(mood, t) {
  const skin = '#F4A8C0', dark = '#E2879F';
  const step = mood === 'run' ? Math.sin(t * 16) * 8 : 0;
  let s = '';

  s += storyEllipse(-9 + step, -6, 9, 7, dark, 7);
  s += storyEllipse(9 - step, -6, 9, 7, dark, 7);
  s += '<path d="M18 -30 C31 -34 29 -47 20 -45" fill="none" stroke="' + STORY_OUTLINE +
       '" stroke-width="6" stroke-linecap="round"/>';
  s += storyEllipse(0, -26, 20, 19, skin);

  if (mood === 'cheer') {
    s += storyEllipse(-23, -50, 8, 10, skin, 7);
    s += storyEllipse(23, -50, 8, 10, skin, 7);
  } else {
    s += storyEllipse(-21, -28 + step, 8, 8, skin, 7);
    s += storyEllipse(21, -28 - step, 8, 8, skin, 7);
  }

  s += storyPath('M-15 -66 L-23 -84 L-3 -71 Z', dark, 7);
  s += storyPath('M15 -66 L23 -84 L3 -71 Z', dark, 7);
  s += storyEllipse(0, -57, 22, 21, skin);
  s += "<ellipse cx='-17' cy='-54' rx='7' ry='5' fill='#E8828E' opacity='.6'/>";
  s += "<ellipse cx='17' cy='-54' rx='7' ry='5' fill='#E8828E' opacity='.6'/>";
  s += storyEllipse(0, -50, 12, 9, dark, 7);
  s += '<circle cx="-4" cy="-50" r="2.6" fill="' + STORY_OUTLINE + '"/>' +
       '<circle cx="4" cy="-50" r="2.6" fill="' + STORY_OUTLINE + '"/>';

  if (mood === 'cheer') {
    s += '<g fill="none" stroke="' + STORY_OUTLINE + '" stroke-width="6" stroke-linecap="round">' +
         '<path d="M-15 -68 C-11 -74 -5 -74 -1 -68"/>' +
         '<path d="M1 -68 C5 -74 11 -74 15 -68"/></g>';
  } else if (mood === 'run') {
    s += '<circle cx="-9" cy="-67" r="4.5" fill="' + STORY_OUTLINE + '"/>' +
         '<circle cx="9" cy="-67" r="4.5" fill="' + STORY_OUTLINE + '"/>';
    s += '<circle cx="-10.5" cy="-69" r="1.8" fill="#FFFFFF"/>' +
         '<circle cx="7.5" cy="-69" r="1.8" fill="#FFFFFF"/>';
    s += '<ellipse cx="0" cy="-38" rx="6" ry="5" fill="#B9566E"/>';
  } else {
    s += '<circle cx="-9" cy="-66" r="4" fill="' + STORY_OUTLINE + '"/>' +
         '<circle cx="9" cy="-66" r="4" fill="' + STORY_OUTLINE + '"/>';
    s += '<circle cx="-10.4" cy="-67.8" r="1.6" fill="#FFFFFF"/>' +
         '<circle cx="7.6" cy="-67.8" r="1.6" fill="#FFFFFF"/>';
    s += '<path d="M-8 -38 C-4 -33 4 -33 8 -38" fill="none" stroke="' + STORY_OUTLINE +
         '" stroke-width="5" stroke-linecap="round"/>';
  }
  return s;
}

/* Icons for the buttons. She cannot read «¡Sopla!», so the blow button shows
   a gust and the advance button shows the very house she is about to face —
   the same trick as the reset button in the painting screen. */
function storyBlowIcon() {
  return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round">' +
    '<path d="M8 22 C22 12 36 14 42 22"/>' +
    '<path d="M8 34 C26 24 44 26 52 34"/>' +
    '<path d="M8 46 C22 38 34 40 40 46"/></g>' +
    '<circle cx="50" cy="20" r="9" fill="none" stroke="#fff" stroke-width="7"/></svg>';
}

function storyHouseIcon(index) {
  const cfg = STORY_ROUNDS[index] || STORY_ROUNDS[0];
  const W = STORY_OUTLINE;
  let tex = '';

  // The three houses must be told apart at 90 px by a four-year-old, so the
  // difference cannot be the door colour: each one wears its own material.
  if (cfg.id === 'straw') {
    for (let i = 0; i < 5; i++) {
      const x = 17 + i * 7.5;
      tex += '<path d="M' + x + ' 32 L' + (x - 3) + ' 53" stroke="' + cfg.wall2 +
             '" stroke-width="2.6" stroke-linecap="round" fill="none"/>';
    }
  } else if (cfg.id === 'stick') {
    for (let i = 0; i < 4; i++) {
      const x = 19 + i * 8.6;
      tex += '<rect x="' + (x - 3) + '" y="31" width="6" height="23" rx="3" fill="' +
             cfg.wall2 + '" stroke="' + W + '" stroke-width="1.8"/>';
    }
  } else {
    for (let r = 0; r < 3; r++) {
      const y = 34 + r * 7;
      tex += '<path d="M15 ' + y + ' H49" stroke="' + W +
             '" stroke-width="2" opacity=".55" fill="none"/>';
      for (let c = 0; c < 3; c++) {
        const x = 15 + (r % 2 ? 5 : 11) + c * 12;
        if (x < 49) tex += '<path d="M' + x + ' ' + y + ' V' + (y + 7) +
                           '" stroke="' + W + '" stroke-width="2" opacity=".55" fill="none"/>';
      }
    }
  }

  // A straw roof is a shaggy dome; the other two are pitched planks.
  const roof = cfg.id === 'straw'
    ? '<path d="M9 31 C12 12 52 12 55 31 L48 29 L44 33 L38 29 L32 33 L26 29 L20 33 L15 29 Z" fill="' +
      cfg.roof + '" stroke="' + W + '" stroke-width="4" stroke-linejoin="round"/>'
    : '<path d="M7 31 L32 11 L57 31 Z" fill="' + cfg.roof + '" stroke="' + W +
      '" stroke-width="4.5" stroke-linejoin="round"/>';

  return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    roof +
    '<rect x="13" y="30" width="38" height="25" fill="' + cfg.wall + '" stroke="' + W +
      '" stroke-width="4.5" stroke-linejoin="round"/>' +
    tex +
    '<rect x="27" y="40" width="11" height="15" rx="5.5" fill="#33200F" stroke="' + W +
      '" stroke-width="2"/>' +
    '<rect x="13" y="30" width="38" height="25" fill="none" stroke="' + W +
      '" stroke-width="4.5" stroke-linejoin="round"/></svg>';
}

function storyAgainIcon() {
  return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M50 32 A18 18 0 1 1 44 18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M46 6 L48 20 L34 19 Z" fill="#fff"/></svg>';
}

// ---------------------------------------------------------------- state

const STORY_PIGS = [{ x: 272, s: 0.68 }, { x: 310, s: 0.76 }, { x: 348, s: 0.64 }];

let storySvg = null;
let storyRound = 0;
let storyPhase = 'ready';   // 'ready' | 'inhale' | 'blow' | 'done'
let storyPieces = [];
let storyT = 0;             // seconds inside the current phase
let storyLast = 0;
let storyRaf = 0;
let storyLaunched = false;
let storyPigRun = 0;
let storyDoneCb = null;
let storyThudded = false;   // the wolf only lands once per round

function storyBlowLength() { return STORY_ROUNDS[storyRound].falls ? 2.4 : 3.4; }

function storyGust(strength) {
  if (strength <= 0.02) return '';
  let s = '';
  for (let i = 0; i < 4; i++) {
    const p = (i + 1) / 5;
    const x = 108 + p * 70 + strength * 24;
    const y = 190 + Math.sin(storyT * 7 + i * 1.4) * 9;
    s += '<ellipse cx="' + storyN(x) + '" cy="' + storyN(y) + '" rx="' + storyN(11 + i * 6) +
         '" ry="' + storyN(8 + i * 4) + '" fill="#FFFFFF" stroke="#8FC3E4" stroke-width="4" opacity="' +
         storyN(0.85 * strength) + '"/>';
  }
  return s;
}

function storyScene() {
  const cfg = STORY_ROUNDS[storyRound];
  const blowing = storyPhase === 'blow';
  // 'done' keeps reading the clock frozen at the end of the blow, so the
  // last frame holds the pose instead of snapping back to standing.
  const after = blowing || storyPhase === 'done';
  const puff = storyPhase === 'inhale' ? Math.min(1, storyT / 0.85)
             : after ? Math.max(0, 1 - storyT / 0.5) : 0;
  const gust = after ? Math.max(0, Math.min(1, storyT / 0.3)) *
                       Math.max(0, 1 - Math.max(0, storyT - 1.5) / 0.6) : 0;
  const shake = (!cfg.falls && gust > 0.1) ? Math.sin(storyT * 40) * 4 * gust : 0;
  const fall = (!cfg.falls && after) ? Math.max(0, Math.min(1, (storyT - 1.9) / 0.65)) : 0;
  // The thump of the wolf hitting the ground, once, at the moment he lands.
  if (fall > 0.9 && !storyThudded) {
    storyThudded = true;
    if (typeof soundPlay === 'function') soundPlay('thud');
  }

  let s = '<rect x="0" y="0" width="400" height="300" fill="#BFE4F5"/>';
  s += '<circle cx="44" cy="40" r="24" fill="#FBE08A"/>';
  s += '<g fill="#FFFFFF"><ellipse cx="300" cy="42" rx="30" ry="18"/>' +
       '<ellipse cx="326" cy="46" rx="22" ry="14"/>' +
       '<ellipse cx="164" cy="60" rx="24" ry="14"/></g>';
  s += '<rect x="0" y="' + STORY_GROUND + '" width="400" height="48" fill="#8FCB6B"/>';
  s += '<path d="M0 ' + STORY_GROUND + ' H400" stroke="#6BA84E" stroke-width="7"/>';
  s += '<g fill="none" stroke="#6BA84E" stroke-width="5" stroke-linecap="round">' +
       '<path d="M30 284 L30 272"/><path d="M148 290 L148 278"/>' +
       '<path d="M330 286 L330 274"/></g>';

  s += storyGust(gust);
  storyPieces.forEach(p => { s += storyDrawPiece(p, shake); });

  // The pigs. They only ever move away from the wolf, never towards him.
  const cheer = !cfg.falls && after && storyT > 2.0;
  STORY_PIGS.forEach((pig, i) => {
    let mood = 'idle', hop = 0;
    if (cfg.falls && blowing && storyPigRun > 0) mood = 'run';
    if (cheer) {
      mood = 'cheer';
      hop = Math.abs(Math.sin((storyT - 2.0) * 6 + i)) * 20;
    }
    s += '<g transform="translate(' + storyN(pig.x + storyPigRun) + ' ' +
         storyN(STORY_GROUND - hop) + ') scale(' + pig.s + ')">' +
         storyPig(mood, storyT + i * 0.4) + '</g>';
  });

  s += storyWolf(puff, blowing ? Math.max(0, 1 - storyT / 1.6) : 0, fall);

  if (fall > 0.85) {
    const star = 'M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z';
    s += '<g fill="#FBE08A" stroke="' + STORY_OUTLINE + '" stroke-width="4">' +
         '<path d="' + star + '" transform="translate(34 170)"/>' +
         '<path d="' + star + '" transform="translate(58 156) scale(0.8)"/>' +
         '<path d="' + star + '" transform="translate(82 170) scale(0.9)"/></g>';
    s += storyText(58, 128, 24, '¡Uf!');
  }

  if (cfg.falls && storyPigRun > 4) s += storyText(330, 152, 22, '¡Iiii!');
  if (cheer) s += storyText(318, 150, 24, '¡Bravo!');
  if (storyPhase === 'done') s += storyText(200, 42, 26, cfg.cheer);
  return s;
}

function storyDraw() {
  if (storySvg) storySvg.innerHTML = storyScene();
}

// ------------------------------------------------------------ animation

function storyLaunchPieces() {
  storyPieces.forEach((p, i) => {
    // Fast and high: the debris has to clear the pigs and leave the frame
    // sideways, never rain down on them.
    p.vx = 240 + storyNoise(i) * 200 + (p.x - 142) * 0.7;
    p.vy = -140 - storyNoise(i + 7) * 130;
    p.vr = (storyNoise(i + 3) - 0.5) * 900;
  });
  storyLaunched = true;
}

function storyStep(now) {
  if (!storyLast) storyLast = now;
  const dt = Math.min(0.05, (now - storyLast) / 1000);
  storyLast = now;
  storyT += dt;

  const cfg = STORY_ROUNDS[storyRound];

  if (storyPhase === 'inhale') {
    // The huff starts with the blowing, not with the tap: the second she
    // spends watching him fill his lungs has to be quiet or the sound and the
    // picture come apart.
    if (storyT >= 1.0) {
      storyPhase = 'blow'; storyT = 0;
      if (typeof soundPlay === 'function') soundPlay('blow');
    }
  } else if (storyPhase === 'blow') {
    if (cfg.falls) {
      if (!storyLaunched && storyT > 0.34) {
        storyLaunchPieces();
        if (typeof soundPlay === 'function') soundPlay('crash');
      }
      if (storyLaunched) {
        storyPieces.forEach(p => {
          p.vy += 260 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.r += p.vr * dt;
        });
        // They stop short of the edge: three pigs still on screen at the end
        // reads better than an empty frame.
        storyPigRun = Math.min(30, storyPigRun + 120 * dt);
      }
    }
    if (storyT >= storyBlowLength()) {
      storyPhase = 'done';
      storyDraw();
      // The brick house gets the solid thud and then the cheer; the other two
      // already had their crash.
      if (typeof soundPlay === 'function' && !cfg.falls) soundPlay('cheer');
      if (storyDoneCb) { const cb = storyDoneCb; storyDoneCb = null; cb(); }
      storyRaf = 0;
      return;
    }
  }

  storyDraw();
  storyRaf = requestAnimationFrame(storyStep);
}

function storyStop() {
  if (storyRaf) cancelAnimationFrame(storyRaf);
  storyRaf = 0;
  storyLast = 0;
}

function storySetRound(index) {
  storyStop();
  storyRound = Math.max(0, Math.min(STORY_ROUNDS.length - 1, index));
  storyPhase = 'ready';
  storyThudded = false;
  storyPieces = storyHousePieces(storyRound);
  storyT = 0;
  storyPigRun = 0;
  storyLaunched = false;
  storyDoneCb = null;
  storyDraw();
}

// ------------------------------------------------------------------ api

/* Hands the toy an <svg> element and paints round one. Everything the
   story draws lives inside this element and nowhere else. */
function storyInit(svgEl) {
  storySvg = svgEl || null;
  if (storySvg) {
    storySvg.setAttribute('viewBox', '0 0 400 300');
    storySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  storySetRound(0);
}

/* The "¡Sopla!" button. Ignores taps while an animation is running, so a
   four-year-old drumming on the button cannot break the sequence.
   Calls onDone once the round has settled. */
function storyBlow(onDone) {
  if (!storySvg || storyPhase !== 'ready') return false;
  storyDoneCb = typeof onDone === 'function' ? onDone : null;
  storyPhase = 'inhale';
  storyT = 0;
  storyLast = 0;
  storyLaunched = false;
  storyPigRun = 0;
  storyRaf = requestAnimationFrame(storyStep);
  return true;
}

/* Advances to the next house. Returns false after the brick house, which
   is the caller's cue to offer "¡Otra vez!" instead. */
function storyNextRound() {
  if (storyRound >= STORY_ROUNDS.length - 1) return false;
  storySetRound(storyRound + 1);
  return true;
}

function storyReset() {
  storySetRound(0);
}

function storyState() {
  return { round: storyRound, phase: storyPhase };
}
