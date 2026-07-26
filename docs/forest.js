/* "Juguemos en el bosque" — the traditional call-and-response chase game.

   The three friends dance in a clearing. She taps the big button to ask the
   wolf whether he is ready; each time, he pulls on one more garment. When
   the last one is on he comes bounding out, everybody scatters laughing, and
   nobody is ever caught.

   The whole point of the game at four is the waiting: seven taps of rising
   suspense, then the release. So the wolf dresses slowly and the button
   never changes shape — she should not be able to tell how close he is
   except by looking at him.

   Art is reused from story.js (storyWolf, storyPath, storyEllipse), which is
   loaded before this file. */

'use strict';

const FOREST_OUTLINE = '#5A3A28';
const FOREST_GROUND = 252;

/* One garment per tap. Drawn on top of the wolf, in wolf-local coordinates
   (his feet sit at 0,0 and he is about 100 units tall). */
const FOREST_GARMENTS = [
  { id: 'trousers', name: 'el pantalón', draw: () =>
    forestPath('M-26 -4 L26 -4 L22 -46 L-22 -46 Z', '#4B77B8') +
    forestPath('M-4 -4 L4 -4 L4 -30 L-4 -30 Z', '#3A5F97', 4) },

  { id: 'shirt', name: 'la camisa', draw: () =>
    forestPath('M-30 -44 C-16 -54 16 -54 30 -44 L26 -86 C14 -94 -14 -94 -26 -86 Z', '#E4574F') },

  { id: 'shoes', name: 'los zapatos', draw: () =>
    forestEllipse(-18, -2, 14, 8, '#4A3226') + forestEllipse(18, -2, 14, 8, '#4A3226') },

  { id: 'tie', name: 'la corbata', draw: () =>
    forestPath('M-7 -84 L7 -84 L4 -74 L-4 -74 Z', '#F6C64A', 4) +
    forestPath('M-4 -74 L4 -74 L8 -50 L0 -44 L-8 -50 Z', '#F6C64A', 4) },

  { id: 'hat', name: 'el sombrero', draw: () =>
    forestPath('M-34 -104 C-34 -110 34 -110 34 -104 C34 -98 -34 -98 -34 -104 Z', '#6B4A8A') +
    forestPath('M-19 -106 L-17 -130 C-17 -136 17 -136 17 -130 L19 -106 Z', '#8A63AC') },

  { id: 'scarf', name: 'la bufanda', draw: () =>
    forestPath('M-26 -88 C-12 -80 12 -80 26 -88 L28 -78 C12 -68 -12 -68 -28 -78 Z', '#37B58C') },

  { id: 'glasses', name: 'las gafas', draw: () =>
    '<g fill="none" stroke="' + FOREST_OUTLINE + '" stroke-width="4">' +
    '<circle cx="-11" cy="-118" r="9"/><circle cx="11" cy="-118" r="9"/>' +
    '<path d="M-2 -118 L2 -118"/></g>' }
];

function forestPath(d, fill, width) {
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + FOREST_OUTLINE +
         '" stroke-width="' + (width || 5) + '" stroke-linejoin="round"/>';
}

function forestEllipse(x, y, rx, ry, fill, width) {
  return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry +
         '" fill="' + fill + '" stroke="' + FOREST_OUTLINE +
         '" stroke-width="' + (width || 5) + '"/>';
}

/* The ask button shows the wolf's face rather than the words «¿Lobo, estás?».
   Drawn small and plain: at 34 px the full character turns to mush. */
function forestWolfIcon() {
  return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M14 26 L10 6 L26 18 Z" fill="#9C9C97" stroke="' + FOREST_OUTLINE + '" stroke-width="4"/>' +
    '<path d="M50 26 L54 6 L38 18 Z" fill="#9C9C97" stroke="' + FOREST_OUTLINE + '" stroke-width="4"/>' +
    '<circle cx="32" cy="34" r="20" fill="#9C9C97" stroke="' + FOREST_OUTLINE + '" stroke-width="4"/>' +
    '<ellipse cx="32" cy="42" rx="12" ry="9" fill="#D8D6D0"/>' +
    '<circle cx="25" cy="30" r="3.4" fill="' + FOREST_OUTLINE + '"/>' +
    '<circle cx="39" cy="30" r="3.4" fill="' + FOREST_OUTLINE + '"/>' +
    '<ellipse cx="32" cy="39" rx="4.5" ry="3.4" fill="' + FOREST_OUTLINE + '"/></svg>';
}

function forestAgainIcon() {
  return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M50 32 A18 18 0 1 1 44 18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M46 6 L48 20 L34 19 Z" fill="#fff"/></svg>';
}

// ------------------------------------------------------------- state

let forestSvg = null;
let forestWorn = 0;        // garments the wolf has on
let forestPhase = 'ask';   // ask · dressing · chase · caught-nobody
let forestT = 0;
let forestRaf = 0;
let forestDone = null;

/* The three friends, using the same species as the pets world so she reads
   them as the same characters. */
const FOREST_FRIENDS = [
  { species: 'capy',   x: 250, hue: '#C08B5C' },
  { species: 'cat',    x: 300, hue: '#E8C9B0' },
  { species: 'rabbit', x: 350, hue: '#EFE3D6' }
];

function forestState() {
  return { worn: forestWorn, total: FOREST_GARMENTS.length, phase: forestPhase };
}

// -------------------------------------------------------------- art

function forestTree(x, scale, tone) {
  return '<g transform="translate(' + x + ' ' + FOREST_GROUND + ') scale(' + scale + ')">' +
    forestPath('M-9 0 L9 0 L6 -46 L-6 -46 Z', '#8A6242', 5) +
    forestPath('M0 -110 C34 -74 30 -46 0 -44 C-30 -46 -34 -74 0 -110 Z', tone, 5) +
    forestPath('M0 -142 C28 -110 26 -86 0 -84 C-26 -86 -28 -110 0 -142 Z', tone, 5) +
    '</g>';
}

/* A friend, small and simple: this is a chase scene, not a portrait. */
function forestFriend(f, run, t) {
  const bob = run ? Math.abs(Math.sin(t * 14)) * -7 : Math.sin(t * 3) * -2;
  const lean = run ? 10 : 0;
  let s = '<g transform="translate(' + f.x + ' ' + (FOREST_GROUND + bob) +
          ') rotate(' + lean + ') scale(0.78)">';

  s += forestEllipse(-8, -6, 6, 7, forestDark(f.hue), 4);
  s += forestEllipse(8, -6, 6, 7, forestDark(f.hue), 4);
  s += forestEllipse(0, -22, 20, 18, f.hue, 5);

  if (f.species === 'rabbit') {
    s += forestPath('M-9 -46 C-12 -70 -6 -80 -2 -78 C2 -76 2 -60 -1 -46 Z', f.hue, 4);
    s += forestPath('M9 -46 C12 -70 6 -80 2 -78 C-2 -76 -2 -60 1 -46 Z', f.hue, 4);
  } else if (f.species === 'cat') {
    s += forestPath('M-16 -50 L-20 -66 L-6 -56 Z', f.hue, 4);
    s += forestPath('M16 -50 L20 -66 L6 -56 Z', f.hue, 4);
  } else {
    s += forestEllipse(-14, -54, 7, 6, f.hue, 4);
    s += forestEllipse(14, -54, 7, 6, f.hue, 4);
  }

  s += forestEllipse(0, -46, 19, 17, f.hue, 5);
  // Eyes shut and mouth open: they are laughing, not frightened.
  s += '<path d="M-10 -50 C-7 -54 -3 -54 0 -50" fill="none" stroke="' + FOREST_OUTLINE +
       '" stroke-width="4" stroke-linecap="round"/>' +
       '<path d="M2 -50 C5 -54 9 -54 12 -50" fill="none" stroke="' + FOREST_OUTLINE +
       '" stroke-width="4" stroke-linecap="round"/>' +
       '<ellipse cx="1" cy="-38" rx="5" ry="4" fill="#8C4A44"/>';
  s += '</g>';
  return s;
}

function forestDark(hex) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.round(v * 0.82);
  return 'rgb(' + f(n >> 16) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')';
}

function forestScene() {
  const chasing = forestPhase === 'chase';
  const t = forestT;

  let s = '<defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#BFE3F5"/><stop offset="1" stop-color="#E7F4E4"/>' +
          '</linearGradient></defs>';

  s += '<rect width="400" height="300" fill="url(#fsky)"/>';
  s += '<circle cx="342" cy="46" r="26" fill="#FBE38C"/>';
  s += forestTree(36, 1, '#5C9E4A') + forestTree(96, 0.72, '#4E8C3E') +
       forestTree(376, 0.86, '#5C9E4A');
  s += '<rect y="' + FOREST_GROUND + '" width="400" height="' + (300 - FOREST_GROUND) +
       '" fill="#7CB85E"/>';
  s += '<rect y="' + FOREST_GROUND + '" width="400" height="5" fill="#639644"/>';

  // The wolf: dressing on the left, lunging right once he is ready.
  const walk = chasing ? Math.min(1, t / 1.5) : 0;
  const wolfX = 70 + walk * 170;
  const hop = chasing ? Math.abs(Math.sin(t * 11)) * -12 : 0;
  const puff = forestPhase === 'dressing' ? Math.sin(t * 9) * 0.25 : 0;

  /* storyWolf places itself at STORY_WOLF_X / STORY_GROUND, so moving him
     means cancelling that out — adding to it pushes him off the canvas and
     leaves his clothes hanging in mid-air. */
  const wolfScale = 0.74 * (1 + 0.16 * puff);   // must match storyWolf
  s += '<g transform="translate(' + (wolfX - STORY_WOLF_X) + ' ' + hop + ')">';
  s += storyWolf(puff, 0, 0);
  s += '<g transform="translate(' + STORY_WOLF_X + ' ' + STORY_GROUND +
       ') scale(' + wolfScale + ')">';
  for (let i = 0; i < forestWorn; i++) s += FOREST_GARMENTS[i].draw();
  s += '</g></g>';

  FOREST_FRIENDS.forEach((f, i) => {
    const flee = chasing ? Math.min(1, Math.max(0, t - i * 0.12)) * 120 : 0;
    s += forestFriend({ ...f, x: f.x + flee }, chasing, t);
  });

  return s;
}

function forestDraw() {
  if (forestSvg) forestSvg.innerHTML = forestScene();
}

// ---------------------------------------------------------- controls

function forestInit(svgEl) {
  forestSvg = svgEl;
  forestSvg.setAttribute('viewBox', '0 0 400 300');
  forestReset();
}

function forestReset() {
  cancelAnimationFrame(forestRaf);
  forestRaf = 0;
  forestWorn = 0;
  forestPhase = 'ask';
  forestT = 0;
  forestDraw();
}

/* One tap = one garment. Returns 'dressing' while he is still getting ready
   and 'chase' on the tap that sets him loose. */
function forestAsk(onDone) {
  if (forestPhase === 'chase' || forestRaf) return null;

  forestWorn = Math.min(FOREST_GARMENTS.length, forestWorn + 1);
  const ready = forestWorn >= FOREST_GARMENTS.length;
  forestPhase = ready ? 'chase' : 'dressing';
  forestDone = onDone || null;
  forestT = 0;

  const started = performance.now();
  const step = (now) => {
    forestT = (now - started) / 1000;
    forestDraw();

    const limit = ready ? 2.6 : 0.75;
    if (forestT >= limit) {
      forestRaf = 0;
      if (!ready) forestPhase = 'ask';
      forestDraw();
      if (forestDone) { const cb = forestDone; forestDone = null; cb(forestPhase); }
      return;
    }
    forestRaf = requestAnimationFrame(step);
  };
  forestRaf = requestAnimationFrame(step);

  return forestPhase;
}

/** What the wolf just put on, for the caption above the button. */
function forestLastGarment() {
  return forestWorn > 0 ? FOREST_GARMENTS[forestWorn - 1].name : '';
}
