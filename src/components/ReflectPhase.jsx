import { useState, useEffect, useRef } from 'react';
import { narrate } from '../utils/audio';
import { reflectNarration } from '../utils/narration';

const CONFIDENCE_LEVELS = [
  { id: 1, emoji: '🤔', label: 'Still learning' },
  { id: 2, emoji: '😊', label: 'Getting there' },
  { id: 3, emoji: '🚀', label: 'I am a pro!' },
];

const BADGES = [
  { id: 'pattern_spotter', icon: '🔍', name: 'Pattern Spotter' },
  { id: 'skip_counter', icon: '🦘', name: 'Skip Counter' },
  { id: 'sequence_master', icon: '👑', name: 'Sequence Master' }
];

export default function ReflectPhase({ playStats, onRestart, audioEnabled }) {
  const [confidence, setConfidence] = useState(null);
  const narrationRef = useRef(null);

  const totalXP = Object.values(playStats || {}).reduce((sum, r) => sum + r.xp, 0);
  const totalStars = Object.values(playStats || {}).reduce((sum, r) => sum + r.stars, 0);
  const maxStreak = Object.values(playStats || {}).reduce((max, r) => Math.max(max, r.maxStreak), 0);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(reflectNarration(), true);
      }, 500);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
      };
    }
  }, [audioEnabled]);

  const handleFinish = () => {
    narrationRef.current?.cancel();
    onRestart();
  };

  const earnedBadges = [];
  if (totalStars >= 1) earnedBadges.push(BADGES[0]);
  if (maxStreak >= 5) earnedBadges.push(BADGES[1]);
  if (totalStars >= 15) earnedBadges.push(BADGES[2]);

  return (
    <div className="reflect-screen">
      <div className="reflect-card glass-card">
        <h2 className="reflect-title">Journey Complete! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          You did an amazing job learning about number patterns.
        </p>

        <div className="reflect-summary">
          <div className="reflect-stat">
            <div className="reflect-stat-value">{totalXP}</div>
            <div className="reflect-stat-label">Total XP</div>
          </div>
          <div className="reflect-stat">
            <div className="reflect-stat-value">{totalStars}</div>
            <div className="reflect-stat-label">Stars Earned</div>
          </div>
          <div className="reflect-stat">
            <div className="reflect-stat-value">{maxStreak}🔥</div>
            <div className="reflect-stat-label">Best Streak</div>
          </div>
        </div>

        {earnedBadges.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Badges Earned</h3>
            <div className="badge-row">
              {earnedBadges.map(b => (
                <div key={b.id} className="badge">
                  <div className="badge-icon">{b.icon}</div>
                  <div className="badge-name">{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="key-concepts">
          <h3 style={{ fontSize: '1.2rem', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Remember:</h3>
          <div className="concept-item">
            <div className="concept-icon">📈</div>
            <div className="concept-text">When numbers go up by the same amount, it's an <strong>ascending pattern</strong>.</div>
          </div>
          <div className="concept-item">
            <div className="concept-icon">📉</div>
            <div className="concept-text">When numbers go down by the same amount, it's a <strong>descending pattern</strong>.</div>
          </div>
          <div className="concept-item">
            <div className="concept-icon">🔍</div>
            <div className="concept-text">Find the rule by checking the difference between two numbers next to each other!</div>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 16, fontFamily: 'var(--font-display)' }}>
            How confident do you feel?
          </h3>
          <div className="confidence-btns">
            {CONFIDENCE_LEVELS.map(level => (
              <button
                key={level.id}
                className={`confidence-btn ${confidence === level.id ? 'selected' : ''}`}
                onClick={() => setConfidence(level.id)}
              >
                <span className="conf-emoji">{level.emoji}</span>
                <span>{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {confidence && (
          <button className="btn btn-primary" onClick={handleFinish} style={{ marginTop: 24, width: '100%' }}>
            Finish Journey
          </button>
        )}
      </div>
    </div>
  );
}
