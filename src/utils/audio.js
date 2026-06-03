import { audioMap } from './audioMap';

// ──────────────────────────────────────────────────
// Audio Engine — Static Audio Pipeline
// ──────────────────────────────────────────────────

let currentAudio = null;
let currentSegments = [];
let currentIdx = 0;
let isCancelled = false;

// Helper to build a narration segment object
export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'encouragement' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'instruction' });
export const emphasize = (text) => ({ text, style: 'emphasis' });

function getAudioUrl(text) {
  const url = audioMap[text];
  if (!url) {
    console.warn(`[Audio Pipeline] Missing static audio for text: "${text}"`);
    return null;
  }
  return url;
}

function preloadNext() {
  if (currentIdx + 1 < currentSegments.length) {
    const nextUrl = getAudioUrl(currentSegments[currentIdx + 1].text);
    if (nextUrl) {
      const audio = new Audio(nextUrl);
      audio.preload = 'auto';
    }
  }
}

function playNextSegment() {
  if (isCancelled || currentIdx >= currentSegments.length) {
    currentAudio = null;
    return;
  }

  const { text } = currentSegments[currentIdx];
  const url = getAudioUrl(text);

  if (!url) {
    // If audio is missing, immediately skip to the next segment
    currentIdx++;
    playNextSegment();
    return;
  }

  currentAudio = new Audio(url);
  currentAudio.play().catch(e => console.error("Error playing audio:", e));
  
  preloadNext();

  currentAudio.onended = () => {
    if (!isCancelled) {
      currentIdx++;
      playNextSegment();
    }
  };
}

/**
 * Narrate an array of {text, style} segments sequentially using HTML5 Audio
 */
export function narrate(segments, autoStop = true) {
  if (autoStop) stopNarration();

  isCancelled = false;
  currentSegments = segments;
  currentIdx = 0;

  playNextSegment();

  return { cancel: () => stopNarration() };
}

export function stopNarration() {
  isCancelled = true;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
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
  click: () => beep(440, 0.08, 'sine', 0.15),
  correct: () => { beep(523, 0.12); setTimeout(() => beep(659, 0.12), 100); setTimeout(() => beep(784, 0.2), 200); },
  wrong: () => beep(220, 0.3, 'sawtooth', 0.15),
  levelUp: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.18), i * 100)); },
};
