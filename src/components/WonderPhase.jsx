import { useState, useEffect, useRef } from 'react';
import { narrate } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "John is waiting for a train. The display says: 5 min, 10 min, 15 min, 20 min... What comes next?",
    subtext: "When we skip count by the same amount, we call it a number pattern!",
    emoji: "🚂",
    bgEmojis: ["🚂", "⏱️", "✨", "🔢"],
  },
  {
    question: "If a house number is 1000, the next is 2000, then 3000... what is the rule?",
    subtext: "Number patterns can grow by hundreds or even thousands!",
    emoji: "🏠",
    bgEmojis: ["🏠", "🔢", "📈", "💡"],
  }
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(wonderNarration(wonder.question), true);
      }, 500);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
      };
    }
  }, [audioEnabled, wonder.question]);

  const handleNext = () => {
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrate(wonderDiscoverNarration(), true);
    }
    onComplete();
  };

  return (
    <div className="wonder-screen">
      <div className="wonder-card glass-card">
        <div className="wonder-bg-emojis">
          {wonder.bgEmojis.map((em, i) => (
            <div key={i} className="wonder-bg-emoji" style={{
              left: `${10 + i * 25}%`,
              top: `${20 + (i % 2) * 40}%`,
              animation: `floatAround ${10 + i * 5}s infinite ease-in-out alternate`
            }}>
              {em}
            </div>
          ))}
        </div>
        
        <span className="wonder-emoji-big">{wonder.emoji}</span>
        <h2 className="wonder-question">{wonder.question}</h2>
        <p className="wonder-subtext">{wonder.subtext}</p>
        
        <button className="btn btn-primary" onClick={handleNext} style={{ marginTop: 40 }}>
          Let's Find Out! 🔍
        </button>
      </div>
    </div>
  );
}
