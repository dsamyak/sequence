import { useState, useEffect, useRef } from 'react';
import { narrate } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';

const STORY_SLIDES = [
  {
    image: '/src/assets/portraits/john.png',
    title: "At the Train Station",
    text: "John is waiting at the train station. The display shows trains arriving at minutes 5, 10, 15, 20. Can you see the pattern? The trains come every 5 minutes!",
    highlight: '"Plus 5 each time"',
    mascotText: "That's an ascending pattern! 🚂",
  },
  {
    image: '/src/assets/portraits/sarah.png',
    title: "At the Market",
    text: "Sarah visits the market. Apples cost 100, 200, 300, 400 cents. The price goes up by 100 each time. That is a number pattern!",
    highlight: '"100, 200, 300, 400..."',
    mascotText: "Counting by hundreds! 🍎",
  },
  {
    image: '/src/assets/portraits/mike.png',
    title: "Climbing Stairs",
    text: "Mike counts the steps on a staircase: 2, 4, 6, 8, 10. Each step adds 2 more. When we add the same number each time, that is an ascending pattern.",
    highlight: '"2, 4, 6, 8, 10"',
    mascotText: "Skip counting by twos! 👟",
  },
  {
    image: '/src/assets/portraits/aisha.png',
    title: "Sharing Stickers",
    text: "Aisha has 50 stickers. She gives away 10 each day: 50, 40, 30, 20, 10. When we subtract the same number each time, that is a descending pattern.",
    highlight: '"Minus 10 each time"',
    mascotText: "Going backwards! ⭐",
  },
  {
    image: '/src/assets/portraits/luca.png',
    title: "House Numbers",
    text: "Luca looks at house numbers: 1000, 2000, 3000, 4000. Wow! Counting by thousands! The rule is plus 1000.",
    highlight: '"1000, 2000, 3000..."',
    mascotText: "Big numbers are fun! 🏠",
  },
  {
    image: '/src/assets/hero.png',
    title: "Your Turn!",
    text: "Now you know what number patterns are! Patterns are everywhere, and you can find them! Let us practice making patterns ourselves.",
    highlight: '"Time to build sequences!"',
    mascotText: "You are a pattern master! 🚀",
  }
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const narrationRef = useRef(null);

  const slide = STORY_SLIDES[slideIdx];

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(getStoryNarration(slideIdx), true);
      }, 300);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
      };
    }
  }, [slideIdx, audioEnabled]);

  const handleNext = () => {
    narrationRef.current?.cancel();
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(s => s + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    narrationRef.current?.cancel();
    if (slideIdx > 0) {
      setSlideIdx(s => s - 1);
    }
  };

  return (
    <div className="story-screen">
      <div className="progress-dots">
        {STORY_SLIDES.map((_, i) => (
          <div key={i} className={`progress-dot ${i === slideIdx ? 'active' : i < slideIdx ? 'completed' : ''}`} />
        ))}
      </div>

      <div className="story-card glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <img src={slide.image} alt={slide.title} className="story-image" style={{ objectFit: 'contain', backgroundColor: '#1a1a5e' }} />
        
        <div className="story-content">
          <h2 className="story-title">{slide.title}</h2>
          <p className="story-text">{slide.text}</p>
          
          <div className="story-highlight">{slide.highlight}</div>
          
          <div className="mascot-bubble">
            <div className="mascot-avatar">✨</div>
            <div className="mascot-text">{slide.mascotText}</div>
          </div>
          
          <div className="slide-nav" style={{ justifyContent: 'space-between', marginTop: 32 }}>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={handlePrev} 
              disabled={slideIdx === 0}
              style={{ opacity: slideIdx === 0 ? 0.3 : 1 }}
            >
              ◀ Back
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleNext}>
              {slideIdx === STORY_SLIDES.length - 1 ? "Let's Practice! 🚀" : "Next ▶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
