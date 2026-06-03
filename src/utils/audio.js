// ──────────────────────────────────────────────────
// Audio Narration Engine — Number Patterns & Sequences
// Uses Web Speech API (browser-native, no API key needed)
// ──────────────────────────────────────────────────

let currentUtterance = null;

const SPEECH_STYLE = {
  statement:    { rate: 0.88, pitch: 1.15, volume: 0.95 },
  question:     { rate: 0.80, pitch: 1.28, volume: 0.98 },
  encouragement:{ rate: 0.92, pitch: 1.32, volume: 1.0  },
  celebration:  { rate: 0.95, pitch: 1.40, volume: 1.0  },
  instruction:  { rate: 0.85, pitch: 1.18, volume: 0.95 },
  emphasis:     { rate: 0.75, pitch: 1.22, volume: 0.98 },
};

// Helper to build a narration segment object
export const say     = (text) => ({ text, style: 'statement' });
export const ask     = (text) => ({ text, style: 'question' });
export const cheer   = (text) => ({ text, style: 'encouragement' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const emphasize = (text) => ({ text, style: 'emphasis' });

/**
 * Narrate an array of {text, style} segments sequentially.
 * Returns a cancel handle.
 */
export function narrate(segments, autoStop = true) {
  if (!window.speechSynthesis) return { cancel: () => {} };
  if (autoStop) stopNarration();

  let cancelled = false;
  let idx = 0;

  function speakNext() {
    if (cancelled || idx >= segments.length) return;
    const { text, style } = segments[idx++];
    const utter = new SpeechSynthesisUtterance(text);
    const s = SPEECH_STYLE[style] || SPEECH_STYLE.statement;
    utter.rate   = s.rate;
    utter.pitch  = s.pitch;
    utter.volume = s.volume;
    utter.onend  = () => { if (!cancelled) speakNext(); };
    utter.onerror = () => { if (!cancelled) speakNext(); };
    currentUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  speakNext();
  return { cancel: () => { cancelled = true; stopNarration(); } };
}

export function stopNarration() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

// ──────────────────────────────────────────────────
// Sound Effects — using AudioContext
// ──────────────────────────────────────────────────
let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function beep(freq, duration, type = 'sine', vol = 0.2) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

export const sounds = {
  click:   () => beep(440, 0.08, 'sine', 0.15),
  correct: () => { beep(523, 0.12); setTimeout(() => beep(659, 0.12), 100); setTimeout(() => beep(784, 0.2), 200); },
  wrong:   () => beep(220, 0.3, 'sawtooth', 0.15),
  levelUp: () => { [523,659,784,1047].forEach((f,i) => setTimeout(() => beep(f, 0.18), i*100)); },
};
