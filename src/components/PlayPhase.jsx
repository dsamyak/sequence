import { useState, useCallback, useEffect, useRef } from 'react';
import { generateSessionQuestions } from '../utils/questionBank';
import { narrate, sounds } from '../utils/audio';
import { playWorldIntro, playReadQuestion, playCorrectNarration, playWrongNarration, playWorldComplete } from '../utils/narration';
import QuestionRenderer from './QuestionRenderer';

const WORLDS = [
  { id: 0, name: 'Number Town', icon: '🏠', color: '#ff4081', desc: 'Questions 1–10' },
  { id: 1, name: 'Pattern Park', icon: '🌳', color: '#4caf50', desc: 'Questions 11–20' },
  { id: 2, name: 'Sequence Sea', icon: '🌊', color: '#03a9f4', desc: 'Questions 21–30' },
  { id: 3, name: 'Cloud City', icon: '☁️', color: '#00bcd4', desc: 'Questions 31–40' },
  { id: 4, name: 'Math Mountain', icon: '⛰️', color: '#ff5722', desc: 'Questions 41–50' },
  { id: 5, name: 'Digit Desert', icon: '🏜️', color: '#673ab7', desc: 'Questions 51–60' },
  { id: 6, name: 'Logic Lair', icon: '🐉', color: '#e91e63', desc: 'Questions 61–70' },
  { id: 7, name: 'Crystal Cave', icon: '💎', color: '#9c27b0', desc: 'Questions 71–80' },
  { id: 8, name: 'Rainbow Road', icon: '🌈', color: '#ffeb3b', desc: 'Questions 81–90' },
  { id: 9, name: 'Master Palace', icon: '🏰', color: '#ff9800', desc: 'Questions 91–100' },
];

function calcXP(attempt, streak) {
  const base = attempt === 1 ? 10 : 5;
  return base + (streak >= 5 ? 5 : 0);
}

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export default function PlayPhase({ onComplete, audioEnabled, playStats, setPlayStats }) {
  const [currentWorld, setCurrentWorld] = useState(-1);
  const [worldResults, setWorldResults] = useState(playStats || {});
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [worldComplete, setWorldComplete] = useState(false);
  const narrationRef = useRef(null);
  const [worldQuestions, setWorldQuestions] = useState([]);

  useEffect(() => {
    setPlayStats(worldResults);
  }, [worldResults, setPlayStats]);

  const q = worldQuestions[qIndex];

  useEffect(() => {
    if (audioEnabled && q && !worldComplete && !feedback && currentWorld >= 0) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(playReadQuestion(q.questionText), true);
      }, 300);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
      };
    }
  }, [qIndex, audioEnabled, q, worldComplete, feedback, currentWorld]);

  const startWorld = useCallback((worldId) => {
    const bank = generateSessionQuestions();
    const filtered = bank.filter(q => q.world === worldId);
    setWorldQuestions(filtered);
    setCurrentWorld(worldId);
    setQIndex(0); setScore(0); setLives(3); setStreak(0);
    setWorldComplete(false); setFeedback(null); setAnswered(false);
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldIntro(WORLDS[worldId].name), true);
    }
  }, [audioEnabled]);

  const handleAnswer = (opt) => {
    if (answered) return;
    setAnswered(true);
    narrationRef.current?.cancel();

    if (opt === q.correctAnswer) {
      sounds.correct();
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
      const xp = calcXP(1, newStreak);
      setTotalXP(x => x + xp);
      setXpPopup(`+${xp} XP`);
      setFeedback('correct');
      if (audioEnabled) {
        narrationRef.current = narrate(playCorrectNarration(), true);
      }
      setTimeout(() => setXpPopup(null), 1000);
      setTimeout(nextQuestion, 1500);
    } else {
      sounds.wrong();
      setStreak(0);
      setLives(l => l - 1);
      setFeedback('wrong');
      if (audioEnabled) {
        narrationRef.current = narrate(playWrongNarration(q.correctAnswer), true);
      }
      setTimeout(nextQuestion, 2000);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setAnswered(false);
    if (lives <= 1 && feedback === 'wrong') {
      endWorld();
    } else if (qIndex < worldQuestions.length - 1) {
      setQIndex(i => i + 1);
    } else {
      endWorld();
    }
  };

  const endWorld = () => {
    setWorldComplete(true);
    sounds.levelUp();
    const stars = calcStars(score + (feedback === 'correct' ? 1 : 0), worldQuestions.length);
    setWorldResults(prev => ({
      ...prev,
      [currentWorld]: { stars, xp: totalXP, maxStreak: Math.max(maxStreak, streak) }
    }));
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldComplete(WORLDS[currentWorld].name, stars), true);
    }
  };

  // World Selection View
  if (currentWorld === -1) {
    const totalStars = Object.values(worldResults).reduce((sum, r) => sum + r.stars, 0);
    return (
      <div className="play-screen">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 8 }}>World Map</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Select a world to start playing!</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
            <span style={{ fontSize: '1.2rem' }}>⭐</span>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{totalStars} / 30</strong>
          </div>
        </div>

        <div className="worlds-grid">
          {WORLDS.map((w, i) => {
            const isLocked = i > 0 && !worldResults[i - 1];
            const res = worldResults[i];
            return (
              <div key={i} className={`world-card ${isLocked ? 'locked' : ''} ${res ? 'completed' : ''}`} onClick={() => !isLocked && startWorld(i)}>
                <div className="world-icon">{isLocked ? '🔒' : w.icon}</div>
                <div className="world-name">{w.name}</div>
                <div className="world-desc">{w.desc}</div>
                {res && (
                  <div className="world-stars">
                    {'⭐'.repeat(res.stars)}{'☆'.repeat(3 - res.stars)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalStars > 0 && (
          <button className="btn btn-outline" onClick={onComplete} style={{ marginTop: 32 }}>
            Review Progress
          </button>
        )}
      </div>
    );
  }

  // World Complete View
  if (worldComplete) {
    const stars = calcStars(score, worldQuestions.length);
    return (
      <div className="play-screen" style={{ justifyContent: 'center' }}>
        <div className="world-complete glass-card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>World Complete!</h2>
          <div className="stars-display">
            {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
            You scored {score} out of {worldQuestions.length}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>XP Earned</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>+{totalXP}</div>
            </div>
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Best Streak</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--coral)' }}>{maxStreak} 🔥</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setCurrentWorld(-1)} style={{ marginTop: 32 }}>
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  // Active Play View
  return (
    <div className="play-screen">
      <div className="play-hud">
        <div className="hud-lives">
          {Array(3).fill(0).map((_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.3, transition: 'opacity 0.3s' }}>❤️</span>
          ))}
        </div>
        <div className="hud-world">{WORLDS[currentWorld].name}</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="hud-streak">{streak > 1 ? `${streak}🔥` : ''}</div>
          <div className="hud-xp">{totalXP} XP</div>
        </div>
      </div>

      <div className="progress-bar-container" style={{ maxWidth: 720 }}>
        <div className="progress-bar-label">
          <span>Question {qIndex + 1} of {worldQuestions.length}</span>
          <span>{Math.round((qIndex / worldQuestions.length) * 100)}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${(qIndex / worldQuestions.length) * 100}%` }} />
        </div>
      </div>

      <div className="question-card glass-card" style={{ position: 'relative' }}>
        {xpPopup && <div className="xp-popup">{xpPopup}</div>}
        
        <QuestionRenderer q={q} />

        <div className="options-grid">
          {q.options.map(opt => {
            let className = '';
            if (answered) {
              if (opt === q.correctAnswer) className = 'correct';
              else if (feedback === 'wrong') className = 'wrong'; // Simplified to just show wrong if any clicked
            }
            return (
              <button
                key={opt}
                className={`option-btn ${className}`}
                onClick={() => handleAnswer(opt)}
                disabled={answered}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`feedback-banner ${feedback}`}>
          {feedback === 'correct' ? '🎉 Brilliant! Keep it up!' : `Oops! The correct answer was ${q.correctAnswer}`}
        </div>
      )}
    </div>
  );
}
