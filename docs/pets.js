/* The friends: a capybara and a cat she can dress and look after.

   Both characters share one body. Only the head differs, so every garment
   drawn once fits both — adding a third animal later costs a head, not a
   character.

   Style: thick outline, flat fills, no gradients. It reads at any size and
   is far cheaper to draw than shaded artwork. */

'use strict';

const PET_OUTLINE = '#5A3A28';

const PET_FURS = {
  capy:   ['#A9784E', '#8C6242', '#C79A6C', '#D8B48C'],
  cat:    ['#EFA057', '#E8C9B0', '#C9A98E', '#F2C27A'],
  rabbit: ['#BCBFC4', '#9A9DA3', '#E8E4DC', '#D6BBC4']
};

const PET_NAMES = { capy: 'Capi', cat: 'Michi', rabbit: 'Coneja' };

const PET_SPECIES = ['capy', 'cat', 'rabbit'];

function petShade(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v * factor)));
  return 'rgb(' + clamp(n >> 16) + ',' + clamp((n >> 8) & 255) + ',' + clamp(n & 255) + ')';
}

function petPath(d, fill, width) {
  return '<path d="' + d + '" fill="' + fill + '" stroke="' + PET_OUTLINE +
         '" stroke-width="' + (width || 9) + '" stroke-linejoin="round"/>';
}

function petEllipse(x, y, rx, ry, fill, width) {
  return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry +
         '" fill="' + fill + '" stroke="' + PET_OUTLINE +
         '" stroke-width="' + (width || 9) + '"/>';
}

// ------------------------------------------------------------- wardrobe

const PET_CLOTHES = [
  { id: 'none', name: 'Nada', draw: () => '' },

  // Every garment is cut to the shared body: it spans x 50–250 and
  // y 200–366, so a top sits at y 230 and a hem lands around y 320.
  { id: 'stripes', name: 'Rayas', color: '#7FB4DC', draw: (c) =>
    petEllipse(52, 272, 25, 31, c) + petEllipse(248, 272, 25, 31, c) +
    petPath('M70 232 C110 219 190 219 230 232 L238 316 C190 333 110 333 62 316 Z', '#F3ECE0') +
    '<g clip-path="url(#petShirtClip)">' +
      '<rect x="78" y="220" width="26" height="120" fill="' + c + '"/>' +
      '<rect x="130" y="220" width="26" height="120" fill="' + c + '"/>' +
      '<rect x="182" y="220" width="26" height="120" fill="' + c + '"/>' +
    '</g>' },

  { id: 'dress', name: 'Vestido', color: '#E86A9A', draw: (c) =>
    petPath('M72 230 C110 217 190 217 228 230 L250 342 C190 360 110 360 50 342 Z', c) +
    '<path d="M76 262 C112 250 188 250 224 262" fill="none" stroke="' +
      petShade(c, 0.78) + '" stroke-width="9"/>' },

  { id: 'overall', name: 'Overol', color: '#5AA0E8', draw: (c) =>
    petPath('M106 282 L106 224 L124 224 L124 282 Z', c) +
    petPath('M176 282 L176 224 L194 224 L194 282 Z', c) +
    petPath('M74 258 C110 247 190 247 226 258 L234 326 C190 341 110 341 66 326 Z', c) +
    '<circle cx="115" cy="272" r="7" fill="' + petShade(c, 0.68) + '"/>' +
    '<circle cx="185" cy="272" r="7" fill="' + petShade(c, 0.68) + '"/>' },

  { id: 'sweater', name: 'Suéter', color: '#C99BE0', draw: (c) =>
    petEllipse(52, 272, 25, 32, c) + petEllipse(248, 272, 25, 32, c) +
    petPath('M68 228 C110 215 190 215 232 228 L238 324 C190 341 110 341 62 324 Z', c) +
    '<path d="M74 250 C112 238 188 238 226 250" fill="none" stroke="' +
      petShade(c, 0.8) + '" stroke-width="8"/>' }
];

const PET_ACCESSORIES = [
  { id: 'bow', name: 'Lazo', color: '#EF5B6B', draw: (c) =>
    petPath('M212 60 L246 38 L246 86 Z', c) +
    petPath('M212 60 L178 38 L178 86 Z', petShade(c, 0.86)) +
    '<circle cx="212" cy="62" r="12" fill="' + petShade(c, 0.76) +
      '" stroke="' + PET_OUTLINE + '" stroke-width="7"/>' },

  { id: 'crown', name: 'Corona', color: '#F6C64A', draw: (c) =>
    petPath('M98 54 L114 16 L132 46 L150 8 L168 46 L186 16 L202 54 Z', c) },

  { id: 'glasses', name: 'Gafas', color: '#453C4F', draw: (c) =>
    '<g fill="none" stroke="' + c + '" stroke-width="8">' +
      '<circle cx="92" cy="98" r="26"/><circle cx="208" cy="98" r="26"/>' +
      '<path d="M118 98 L182 98"/></g>' },

  { id: 'scarf', name: 'Bufanda', color: '#37B58C', draw: (c) =>
    petPath('M96 214 C120 236 180 236 204 214 L208 238 C180 256 120 256 92 238 Z', c) }
];

// ------------------------------------------------------------------ food

const PET_FOOD = [
  { id: 'apple', name: 'Manzana', draw: () =>
    '<circle cx="0" cy="4" r="17" fill="#E24B4A" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' +
    '<path d="M0 -12 C4 -22 12 -24 16 -22" fill="none" stroke="#639922" stroke-width="6" stroke-linecap="round"/>' },

  { id: 'melon', name: 'Sandía', draw: () =>
    '<path d="M-19 4 A19 19 0 0 0 19 4 Z" fill="#E24B4A" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' +
    '<path d="M-19 4 L19 4" stroke="#639922" stroke-width="7"/>' },

  { id: 'carrot', name: 'Zanahoria', draw: () =>
    '<path d="M0 22 L-11 -8 L11 -8 Z" fill="#EF9F27" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' +
    '<path d="M-6 -10 L-10 -22 M4 -10 L8 -22" stroke="#639922" stroke-width="6" stroke-linecap="round"/>' },

  { id: 'cake', name: 'Pastel', draw: () =>
    '<rect x="-17" y="-4" width="34" height="22" rx="4" fill="#FAC775" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' +
    '<path d="M-17 0 C-8 -12 8 -12 17 0" fill="#F4A0C0" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' },

  { id: 'icecream', name: 'Helado', draw: () =>
    '<path d="M-13 -2 L13 -2 L0 22 Z" fill="#EFC08A" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' +
    '<circle cx="0" cy="-11" r="14" fill="#9FE1CB" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' },

  { id: 'water', name: 'Agua', draw: () =>
    '<path d="M-13 -14 L13 -14 L9 20 L-9 20 Z" fill="#9CD3F0" stroke="' + PET_OUTLINE + '" stroke-width="6"/>' +
    '<path d="M-11 -6 L11 -6" stroke="' + PET_OUTLINE + '" stroke-width="5"/>' }
];

// ------------------------------------------------------------------ art

function petEyes(mood) {
  if (mood === 'happy') {
    return '<path d="M78 92 C86 80 104 80 112 92" fill="none" stroke="' + PET_OUTLINE +
             '" stroke-width="9" stroke-linecap="round"/>' +
           '<path d="M188 92 C196 80 214 80 222 92" fill="none" stroke="' + PET_OUTLINE +
             '" stroke-width="9" stroke-linecap="round"/>';
  }
  if (mood === 'asleep') {
    return '<path d="M78 100 C86 112 104 112 112 100" fill="none" stroke="' + PET_OUTLINE +
             '" stroke-width="9" stroke-linecap="round"/>' +
           '<path d="M188 100 C196 112 214 112 222 100" fill="none" stroke="' + PET_OUTLINE +
             '" stroke-width="9" stroke-linecap="round"/>';
  }
  // A single off-centre highlight is what makes a flat dark oval read as an
  // eye rather than a hole.
  return '<ellipse cx="95" cy="96" rx="13" ry="15" fill="' + PET_OUTLINE + '"/>' +
         '<ellipse cx="205" cy="96" rx="13" ry="15" fill="' + PET_OUTLINE + '"/>' +
         '<circle cx="99" cy="90" r="4.5" fill="#fff"/>' +
         '<circle cx="209" cy="90" r="4.5" fill="#fff"/>';
}

function petMouth(mood, muzzleY) {
  if (mood === 'chew') {
    return '<ellipse cx="150" cy="' + (muzzleY + 18) + '" rx="18" ry="15" fill="#8C4A44" stroke="' +
           PET_OUTLINE + '" stroke-width="7"/>';
  }
  const y = muzzleY;
  return '<path d="M150 ' + y + ' L150 ' + (y + 12) + '" stroke="' + PET_OUTLINE +
           '" stroke-width="7" stroke-linecap="round"/>' +
         '<path d="M150 ' + (y + 12) + ' C150 ' + (y + 26) + ' 130 ' + (y + 28) + ' 124 ' + (y + 16) +
           '" fill="none" stroke="' + PET_OUTLINE + '" stroke-width="7" stroke-linecap="round"/>' +
         '<path d="M150 ' + (y + 12) + ' C150 ' + (y + 26) + ' 170 ' + (y + 28) + ' 176 ' + (y + 16) +
           '" fill="none" stroke="' + PET_OUTLINE + '" stroke-width="7" stroke-linecap="round"/>';
}

/* Capybara. Three things keep it from reading as a bear: a flat-topped
   rectangular skull, a muzzle that fills the whole lower face, and small
   eyes pushed high and wide, almost touching the ears. */
function capyHead(fur, mood) {
  const muzzle = petShade(fur, 0.86);
  const nose = petShade(fur, 0.56);

  let s = petEllipse(62, 50, 23, 20, fur) + petEllipse(238, 50, 23, 20, fur);
  s += petPath('M150 26 C214 26 256 56 256 104 L256 150 C256 198 212 222 150 222 ' +
               'C88 222 44 198 44 150 L44 104 C44 56 86 26 150 26 Z', fur);
  s += petPath('M150 112 C202 112 218 140 218 168 C218 200 190 216 150 216 ' +
               'C110 216 82 200 82 168 C82 140 98 112 150 112 Z', muzzle);
  s += '<path d="M150 118 C182 118 194 134 190 152 C186 168 114 168 110 152 ' +
       'C106 134 118 118 150 118 Z" fill="' + nose + '"/>';
  s += '<ellipse cx="58" cy="132" rx="20" ry="13" fill="#E8A08A" opacity=".7"/>';
  s += '<ellipse cx="242" cy="132" rx="20" ry="13" fill="#E8A08A" opacity=".7"/>';
  s += '<g stroke="' + muzzle + '" stroke-width="5" stroke-linecap="round" opacity=".8">' +
       '<path d="M126 54 L124 64"/><path d="M150 48 L150 58"/><path d="M174 54 L176 64"/></g>';
  // Nostrils sit high on the muzzle, which is what makes it read as a snout
  // seen head-on rather than as a big chin.
  s += '<g fill="' + nose + '">' +
       '<path d="M132 132 C138 128 142 132 140 138 C136 142 130 138 132 132 Z"/>' +
       '<path d="M168 132 C162 128 158 132 160 138 C164 142 170 138 168 132 Z"/></g>';
  s += petEyes(mood) + petMouth(mood, 158);
  return s;
}

/* Cat. Tabby stripes on the forehead and a plain w-mouth — no whiskers, they
   only add clutter at thumbnail size. */
function catHead(fur, mood) {
  const stripe = petShade(fur, 0.8);

  let s = petPath('M78 78 L62 12 L132 50 Z', fur) + petPath('M222 78 L238 12 L168 50 Z', fur);
  s += '<path d="M88 70 L78 34 L116 54 Z" fill="#F3B39C"/>' +
       '<path d="M212 70 L222 34 L184 54 Z" fill="#F3B39C"/>';
  s += petPath('M150 30 C214 30 254 68 254 124 C254 182 212 220 150 220 ' +
               'C88 220 46 182 46 124 C46 68 86 30 150 30 Z', fur);
  s += '<g stroke="' + stripe + '" stroke-width="7" stroke-linecap="round" fill="none">' +
       '<path d="M124 54 C126 62 126 68 124 74"/>' +
       '<path d="M150 48 C152 58 152 64 150 70"/>' +
       '<path d="M176 54 C174 62 174 68 176 74"/></g>';
  s += '<ellipse cx="62" cy="146" rx="21" ry="14" fill="#E8927A" opacity=".72"/>';
  s += '<ellipse cx="238" cy="146" rx="21" ry="14" fill="#E8927A" opacity=".72"/>';
  s += petEyes(mood) + petSnout(mood, 152, '#4A3226');
  return s;
}

/* Rabbit with lop ears: they hang down the sides of the head instead of
   standing up. Longer to draw than upright ears, but unmistakable, and it
   stops the silhouette colliding with the cat's. */
function rabbitHead(fur, mood) {
  const inner = '#F0B4B8';

  // The ears have to hang well outside the skull or they vanish behind it —
  // the head is drawn on top of them.
  let s = petPath('M104 62 C60 50 18 92 16 150 C14 200 46 220 76 206 ' +
                  'C98 194 102 142 104 102 Z', fur) +
          petPath('M196 62 C240 50 282 92 284 150 C286 200 254 220 224 206 ' +
                  'C202 194 198 142 196 102 Z', fur);
  s += '<path d="M100 86 C66 78 36 110 34 152 C32 188 56 202 78 192 ' +
       'C94 182 98 142 100 110 Z" fill="' + inner + '"/>' +
       '<path d="M200 86 C234 78 264 110 266 152 C268 188 244 202 222 192 ' +
       'C206 182 202 142 200 110 Z" fill="' + inner + '"/>';
  s += petPath('M150 40 C200 40 234 76 234 126 C234 178 200 212 150 212 ' +
               'C100 212 66 178 66 126 C66 76 100 40 150 40 Z', fur);
  s += '<ellipse cx="88" cy="150" rx="17" ry="12" fill="#E8927A" opacity=".7"/>';
  s += '<ellipse cx="212" cy="150" rx="17" ry="12" fill="#E8927A" opacity=".7"/>';
  s += petEyes(mood) + petSnout(mood, 150, '#B0757E');
  return s;
}

/* Small nose plus a w-shaped mouth, for the two round-faced friends. The
   capybara does not use this: its whole muzzle is the feature. */
function petSnout(mood, y, noseColor) {
  const nose = '<path d="M150 ' + y + ' C160 ' + y + ' 164 ' + (y + 8) + ' 158 ' + (y + 14) +
               ' C154 ' + (y + 18) + ' 146 ' + (y + 18) + ' 142 ' + (y + 14) +
               ' C136 ' + (y + 8) + ' 140 ' + y + ' 150 ' + y + ' Z" fill="' + noseColor + '"/>';

  if (mood === 'chew') {
    // Keep the nose: without it the open mouth floats on a blank face.
    return nose + '<ellipse cx="150" cy="' + (y + 30) + '" rx="17" ry="14" fill="#8C4A44" stroke="' +
           PET_OUTLINE + '" stroke-width="7"/>';
  }
  return '<path d="M150 ' + y + ' C160 ' + y + ' 164 ' + (y + 8) + ' 158 ' + (y + 14) +
         ' C154 ' + (y + 18) + ' 146 ' + (y + 18) + ' 142 ' + (y + 14) +
         ' C136 ' + (y + 8) + ' 140 ' + y + ' 150 ' + y + ' Z" fill="' + noseColor + '"/>' +
         '<path d="M150 ' + (y + 16) + ' L150 ' + (y + 22) + '" stroke="' + PET_OUTLINE +
         '" stroke-width="6" stroke-linecap="round"/>' +
         '<path d="M150 ' + (y + 22) + ' C150 ' + (y + 34) + ' 132 ' + (y + 36) + ' 126 ' + (y + 26) +
         '" fill="none" stroke="' + PET_OUTLINE + '" stroke-width="6" stroke-linecap="round"/>' +
         '<path d="M150 ' + (y + 22) + ' C150 ' + (y + 34) + ' 168 ' + (y + 36) + ' 174 ' + (y + 26) +
         '" fill="none" stroke="' + PET_OUTLINE + '" stroke-width="6" stroke-linecap="round"/>';
}

const PET_HEADS = { capy: capyHead, cat: catHead, rabbit: rabbitHead };

/* Draws a whole friend. `night` dims the scene for the sleeping activity. */
function petArt(species, fur, mood, outfitID, accessories, night) {
  const outfit = PET_CLOTHES.find(o => o.id === outfitID) || PET_CLOTHES[0];

  let s = '<defs><clipPath id="petShirtClip">' +
          '<path d="M70 232 C110 219 190 219 230 232 L238 316 C190 333 110 333 62 316 Z"/>' +
          '</clipPath></defs>';

  s += '<rect width="300" height="400" fill="' + (night ? '#2E2A44' : '#FDF3E7') + '"/>';
  s += '<ellipse cx="150" cy="376" rx="96" ry="14" fill="' + (night ? '#242038' : '#E6D3B8') + '"/>';

  if (night) {
    s += '<circle cx="248" cy="56" r="26" fill="#F6E6A8"/>' +
         '<circle cx="236" cy="48" r="22" fill="#2E2A44"/>';
    [[40, 40], [92, 26], [160, 52], [206, 30], [64, 92]].forEach(p => {
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#FFF3C4" opacity=".85"/>';
    });
  }

  // Capybaras have no tail worth drawing, and leaving it off is half of
  // what makes the silhouette read as one.
  if (species === 'cat') {
    s += petPath('M236 330 C286 322 292 250 248 226 C266 254 262 300 228 312 Z', petShade(fur, 0.86));
  }

  s += petEllipse(52, 286, 24, 40, fur) + petEllipse(248, 286, 24, 40, fur);
  s += petPath('M150 200 C214 200 250 240 250 296 C250 344 208 366 150 366 ' +
               'C92 366 50 344 50 296 C50 240 86 200 150 200 Z', fur);

  if (species === 'cat') {
    s += '<g stroke="' + petShade(fur, 0.8) + '" stroke-width="8" stroke-linecap="round" fill="none">' +
         '<path d="M228 250 C236 254 240 258 242 264"/>' +
         '<path d="M224 276 C234 278 240 282 244 288"/>' +
         '<path d="M226 302 C236 302 242 304 246 308"/></g>';
  }
  if (species === 'rabbit') {
    s += '<path d="M150 226 C176 226 190 254 190 292 C190 328 172 348 150 348 ' +
         'C128 348 110 328 110 292 C110 254 124 226 150 226 Z" fill="#F3F1EC"/>';
  }

  s += petEllipse(108, 368, 28, 18, fur) + petEllipse(192, 368, 28, 18, fur);

  if (outfit.draw) s += outfit.draw(outfit.color);

  s += '<g transform="translate(0 -6)">' +
       (PET_HEADS[species] || capyHead)(fur, mood) +
       '</g>';

  PET_ACCESSORIES.forEach(a => {
    if (accessories && accessories[a.id]) s += '<g transform="translate(0 -6)">' + a.draw(a.color) + '</g>';
  });

  s += '<g stroke="' + PET_OUTLINE + '" stroke-width="5" stroke-linecap="round">' +
       '<path d="M98 380 L98 388"/><path d="M108 382 L108 390"/><path d="M118 380 L118 388"/>' +
       '<path d="M182 380 L182 388"/><path d="M192 382 L192 390"/><path d="M202 380 L202 388"/></g>';

  if (mood === 'asleep') {
    s += '<g fill="#FFF3C4" font-size="30" font-weight="600" opacity=".9">' +
         '<text x="216" y="150">z</text><text x="238" y="122">z</text></g>';
  }

  s += '<g id="petFlying"></g>';
  return s;
}
