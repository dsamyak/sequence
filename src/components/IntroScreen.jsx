import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A number mystery!' },
  { icon: '📖', label: 'Story', desc: 'See patterns in action' },
  { icon: '🧪', label: 'Simulate', desc: 'Build the sequence' },
  { icon: '🎮', label: 'Play', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 200);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      <div className="intro-badge">
        ✨  · Grade 3 Maths
      </div>

      <h1 className="intro-title">
        Number Patterns<br/>& Sequences
      </h1>

      <p className="intro-subtitle">
        Join our Intellia friends as we discover amazing number patterns! Learn to skip count by tens, hundreds, and thousands to crack the code.
      </p>

      <div className="journey-preview">
        {JOURNEY_PHASES.map((phase, i) => (
          <div key={i} className="journey-preview-item">
            <div className="journey-preview-icon">{phase.icon}</div>
            <div className="journey-preview-text">
              <div className="journey-preview-label">{phase.label}</div>
              <div className="journey-preview-desc">{phase.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleStart} style={{ marginTop: 16 }}>
        Start Journey ✨
      </button>
    </div>
  );
}
