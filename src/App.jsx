import { useState, useCallback, useEffect } from 'react';
import { stopNarration } from './utils/audio';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Play' },
  { icon: '📓', label: 'Reflect' },
];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats] = useState(null);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => {
      if (prev) stopNarration();
      return !prev;
    });
  }, []);

  const goHome = useCallback(() => {
    stopNarration();
    setPhase('intro');
    setPlayStats(null);
  }, []);

  const renderPhase = () => {
    switch (phase) {
      case 'intro':
        return <IntroScreen onStart={() => setPhase('wonder')} audioEnabled={audioEnabled} />;
      case 'wonder':
        return <WonderPhase onComplete={() => setPhase('story')} audioEnabled={audioEnabled} />;
      case 'story':
        return <StoryPhase onComplete={() => setPhase('simulate')} audioEnabled={audioEnabled} />;
      case 'simulate':
        return <SimulatePhase onComplete={() => setPhase('play')} audioEnabled={audioEnabled} />;
      case 'play':
        return (
          <PlayPhase 
            onComplete={() => setPhase('reflect')} 
            audioEnabled={audioEnabled}
            playStats={playStats}
            setPlayStats={setPlayStats}
          />
        );
      case 'reflect':
        return <ReflectPhase playStats={playStats} onRestart={goHome} audioEnabled={audioEnabled} />;
      default:
        return null;
    }
  };

  const currentIndex = PHASES.indexOf(phase) - 1; // -1 because intro isn't in JOURNEY_ITEMS

  return (
    <div className="app-container">
      <FloatingNumbers />
      
      {/* Home Button */}
      {phase !== 'intro' && (
        <button className="home-btn" onClick={goHome}>
          🏠 Home
        </button>
      )}

      {/* Audio Toggle */}
      <button className="audio-toggle-btn" onClick={toggleAudio}>
        {audioEnabled ? '🔊' : '🔇'}
      </button>

      {/* Journey Bar */}
      {phase !== 'intro' && (
        <div className="journey-bar">
          {JOURNEY_ITEMS.map((item, idx) => {
            const isActive = idx === currentIndex;
            const isCompleted = idx < currentIndex;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="journey-step-dot">{isCompleted ? '✓' : idx + 1}</div>
                  <div className="journey-step-label" style={{ display: isActive ? 'block' : 'none' }}>
                    {item.label}
                  </div>
                </div>
                {idx < JOURNEY_ITEMS.length - 1 && (
                  <div className={`journey-connector ${isCompleted ? 'filled' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      {renderPhase()}
    </div>
  );
}
