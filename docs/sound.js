/* El sonido.

   Three rules, all of them about a four-year-old holding the tablet:

   · Nothing plays until she has touched the screen once. Browsers refuse to
     start audio before a gesture anyway, but the rule is also the polite one:
     an app that starts buzzing the moment it opens gets muted by the parent
     and never unmuted.

   · The parent can turn it all off, and that setting is remembered. Sound in a
     children's app is the single most common reason a grown-up deletes it.

   · A missing file is not an error. If `audio/buzz.wav` is not there, the game
     plays a synthesised stand-in instead of throwing — so the games work today
     and get better the day the real recordings are dropped in.

   To use real recordings, drop the files into `docs/audio/` with these exact
   names. Anything short and mono is fine; MP3 or M4A both work.

       audio/buzz.wav    the mosquitoes flying — loops, so it must join up
       audio/water.wav   the lake — loops too
       audio/pop.mp3     one mosquito caught — very short, under half a second
       audio/splash.mp3  one fish caught
       audio/cheer.mp3   the round finished
       audio/blow.mp3    the wolf huffing at a house
       audio/crash.mp3   the house coming apart
       audio/thud.mp3    the brick house holding
       audio/swish.mp3   the wolf putting on a garment */

'use strict';

const SOUND_FILES = {
  // The buzz is a WAV, not an MP3, and that is deliberate: an MP3 decoder adds
  // a few milliseconds of silence at each end, which in a loop is an audible
  // gap every three seconds. A WAV decodes to exactly the samples it was given.
  // It costs 66 KB instead of 20, which is a fair price for a clean loop.
  buzz:  'audio/buzz.wav',
  water: 'audio/water.wav',      // the lake, also a loop, also a WAV
  pop:   'audio/pop.mp3',
  splash: 'audio/splash.mp3',
  cheer: 'audio/cheer.mp3',

  // The two folk tales.
  blow:  'audio/blow.mp3',       // the wolf huffing
  crash: 'audio/crash.mp3',      // straw and sticks flying
  thud:  'audio/thud.mp3',       // the brick house holding
  swish: 'audio/swish.mp3'       // one more garment going on
};

/* How loud each looping bed sits under the game. The water is quieter than the
   buzzing on purpose: the mosquitoes are the thing she is chasing, the lake is
   only the room she is in. */
const SOUND_BED = { buzz: 0.08, water: 0.05 };

let soundOn = true;          // the parent's switch
let soundCtx = null;         // the WebAudio context, made on first touch
let soundReady = false;
const soundBuffers = {};     // name → AudioBuffer, when a real file loaded

function soundEnabled(on) {
  soundOn = !!on;
  if (!soundOn) Object.keys(soundLoops).forEach(soundStopLoop);
}

/* Browsers will not let audio start before a gesture, so the context is built
   the first time she touches anything and then kept. */
function soundWake() {
  if (soundReady) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  try {
    soundCtx = new Ctx();
    soundReady = true;
    Object.keys(SOUND_FILES).forEach(soundLoad);
  } catch (e) { /* no audio on this device; the games are silent, not broken */ }
}

function soundLoad(name) {
  if (!soundCtx || soundBuffers[name] !== undefined) return;
  soundBuffers[name] = null;                       // «tried, nothing yet»
  fetch(SOUND_FILES[name])
    .then(r => (r.ok ? r.arrayBuffer() : Promise.reject()))
    .then(b => soundCtx.decodeAudioData(b))
    .then(buf => { soundBuffers[name] = buf; })
    .catch(() => { /* no file: the synthesised stand-in is used instead */ });
}

// --------------------------------------------------------------- one shot

function soundPlay(name) {
  if (!soundOn || !soundReady) return;
  if (soundCtx.state === 'suspended') soundCtx.resume();

  const buf = soundBuffers[name];
  if (buf) {
    const src = soundCtx.createBufferSource();
    src.buffer = buf;
    src.connect(soundCtx.destination);
    src.start();
    return;
  }
  soundSynth(name);
}

/* The stand-ins. Deliberately plain: a short blip that falls in pitch for a
   catch, a brighter rising pair for a finished round. They exist so the game
   is never silent while the real recordings are still being made. */
function soundSynth(name) {
  const t = soundCtx.currentTime;
  const gain = soundCtx.createGain();
  gain.connect(soundCtx.destination);

  if (name === 'splash') {
    // Stand-in for the water: a short noise burst through a falling filter.
    const len = Math.floor(soundCtx.sampleRate * 0.35);
    const buf = soundCtx.createBuffer(1, len, soundCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    const src = soundCtx.createBufferSource();
    const lp = soundCtx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(4000, t);
    lp.frequency.exponentialRampToValueAtTime(400, t + 0.3);
    src.buffer = buf;
    gain.gain.setValueAtTime(0.3, t);
    src.connect(lp); lp.connect(gain); src.start(t);
    return;
  }

  if (name === 'pop') {
    const osc = soundCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.16);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain); osc.start(t); osc.stop(t + 0.2);
    return;
  }

  if (name === 'cheer') {
    [523, 659, 784].forEach((hz, i) => {
      const osc = soundCtx.createOscillator();
      const g = soundCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = hz;
      g.gain.setValueAtTime(0.0001, t + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.12 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.3);
      osc.connect(g); g.connect(soundCtx.destination);
      osc.start(t + i * 0.12); osc.stop(t + i * 0.12 + 0.32);
    });
  }
}

// ------------------------------------------------------------------ loop

const soundLoops = {};

/* The flying buzz. A real recording loops seamlessly; the stand-in is two
   detuned oscillators, which is roughly what a mosquito sounds like and,
   importantly, is quiet. */
function soundStartLoop(name) {
  if (!soundOn || !soundReady || soundLoops[name]) return;
  if (soundCtx.state === 'suspended') soundCtx.resume();

  const gain = soundCtx.createGain();
  gain.gain.value = 0;
  gain.connect(soundCtx.destination);
  gain.gain.linearRampToValueAtTime(SOUND_BED[name] || 0.07, soundCtx.currentTime + 0.4);

  const buf = soundBuffers[name];
  if (buf) {
    const src = soundCtx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(gain);
    src.start();
    soundLoops[name] = { src: src, gain: gain };
    return;
  }

  const a = soundCtx.createOscillator();
  const b = soundCtx.createOscillator();
  a.type = b.type = 'sawtooth';
  a.frequency.value = 172;
  b.frequency.value = 179;          // the beat between the two is the «zzz»
  const soft = soundCtx.createBiquadFilter();
  soft.type = 'lowpass';
  soft.frequency.value = 900;       // without this it is a wasp, not a mosquito
  a.connect(soft); b.connect(soft); soft.connect(gain);
  a.start(); b.start();
  soundLoops[name] = { src: a, src2: b, gain: gain };
}

/* Silence every looping bed at once.

   The rule this enforces: a loop belongs to the screen she is on and to the
   round she is playing, and nothing else. Asking each game to remember to
   switch off its own sound works until one of them forgets — and the way it
   fails is the worst kind, a buzzing that follows her into the drawing world
   and that a parent can only stop by closing the app.

   So instead of trusting each game, everything stops on every screen change
   and on the app losing focus, and whichever game is opening starts its own
   again. Stopping something that is already stopped costs nothing. */
function soundStopAll() {
  Object.keys(soundLoops).forEach(soundStopLoop);
}

function soundStopLoop(name) {
  const loop = soundLoops[name];
  if (!loop) return;
  const t = soundCtx.currentTime;
  // Faded rather than cut: a loop that stops dead makes a click.
  loop.gain.gain.cancelScheduledValues(t);
  loop.gain.gain.setValueAtTime(loop.gain.gain.value, t);
  loop.gain.gain.linearRampToValueAtTime(0.0001, t + 0.25);
  setTimeout(() => {
    try { loop.src.stop(); if (loop.src2) loop.src2.stop(); } catch (e) {}
  }, 300);
  delete soundLoops[name];
}


/* Android keeps the WebView alive when she presses Home, so without this the
   mosquitoes go on buzzing behind whatever she opens next. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    soundStopAll();
    if (soundCtx && soundCtx.state === 'running') soundCtx.suspend();
  }
});
window.addEventListener('pagehide', soundStopAll);
