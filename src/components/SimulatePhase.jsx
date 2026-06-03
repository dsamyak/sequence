import { useState, useEffect, useRef } from 'react';
import { narrate, sounds, celebrate, cheer } from '../utils/audio';
import { simulateStation1Intro, simulateStation2Intro, simulateStation3Intro } from '../utils/narration';

const STATIONS = [
  { id: 0, title: 'Number Line', subtitle: 'Find the Rule', icon: '📏' },
  { id: 1, title: 'Spot Pattern', subtitle: 'Which is correct?', icon: '👁️' },
  { id: 2, title: 'Missing Number', subtitle: 'Type it in', icon: '📝' },
];

function Station1({ audioEnabled, onNext }) {
  const [missingIdx, setMissingIdx] = useState(3);
  const [done, setDone] = useState(false);
  const [options, setOptions] = useState([]);
  const narRef = useRef(null);

  const seq = [10, 20, 30, 40, 50]; // Rule: +10

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    setOptions([35, 40, 45, 50].sort(() => Math.random() - 0.5));
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  const handleSelect = (opt) => {
    if (done) return;
    if (opt === 40) {
      sounds.correct();
      setDone(true);
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate([
          celebrate("Correct! The rule is plus 10."),
          cheer("You completed the number line!")
        ], true);
      }
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📏 Number Line</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        What is the rule? Find the missing number!
      </p>

      <div className="number-line-wrap">
        <div className="number-line">
          <div className="number-line-track"></div>
          {seq.map((num, i) => (
            <div key={i} className="number-node">
              {i > 0 && <div className="jump-arrow">+10</div>}
              <div className={`number-node-circle ${i === missingIdx ? (done ? 'correct' : 'missing') : 'known'}`}>
                {i === missingIdx && !done ? '?' : num}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="options-grid" style={{ marginTop: 32 }}>
        {options.map(opt => (
          <button 
            key={opt} 
            className={`option-btn ${done && opt === 40 ? 'correct' : ''}`}
            onClick={() => handleSelect(opt)}
            disabled={done}
          >
            {opt}
          </button>
        ))}
      </div>

      {done && (
        <button className="btn btn-primary" onClick={onNext} style={{ marginTop: 32, animation: 'fadeSlideUp 0.5s ease' }}>
          Next Station ➔
        </button>
      )}
    </div>
  );
}

function Station2({ audioEnabled, onNext }) {
  const [done, setDone] = useState(false);
  const narRef = useRef(null);

  const patterns = [
    { seq: [100, 200, 300, 400], isCorrect: true, rule: "+100" },
    { seq: [100, 150, 300, 400], isCorrect: false, rule: "" }
  ];

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  const handleSelect = (isCorrect) => {
    if (done) return;
    if (isCorrect) {
      sounds.correct();
      setDone(true);
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate([
          celebrate("Yes! That is a correct pattern."),
        ], true);
      }
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>👁️ Spot the Pattern</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Which of these sequences is a correct number pattern?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto' }}>
        {patterns.map((p, i) => (
          <div 
            key={i} 
            className={`glass-card ${done && p.isCorrect ? 'correct' : ''}`} 
            style={{ padding: 24, cursor: 'pointer', border: done && p.isCorrect ? '2px solid var(--green)' : '1px solid rgba(255,255,255,0.2)' }}
            onClick={() => handleSelect(p.isCorrect)}
          >
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
              {p.seq.join(', ')}
            </h3>
          </div>
        ))}
      </div>

      {done && (
        <button className="btn btn-primary" onClick={onNext} style={{ marginTop: 32, animation: 'fadeSlideUp 0.5s ease' }}>
          Final Station ➔
        </button>
      )}
    </div>
  );
}

function Station3({ audioEnabled, onNext }) {
  const [val, setVal] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const narRef = useRef(null);

  const seq = [2000, 3000, 4000, 5000];
  const missing = 5000;

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  const check = () => {
    if (parseInt(val) === missing) {
      sounds.correct();
      setDone(true);
      setError(false);
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate([
          celebrate("Amazing! You got it right!"),
          cheer("You are ready to play!")
        ], true);
      }
    } else {
      sounds.wrong();
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📝 Type the Missing Number</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        What comes next? 2000, 3000, 4000... ?
      </p>

      <div className="number-grid">
        <div className="grid-cell known">2000</div>
        <div className="grid-cell known">3000</div>
        <div className="grid-cell known">4000</div>
        <div className={`grid-cell ${done ? 'correct' : 'missing'}`}>
          {done ? 5000 : '?'}
        </div>
      </div>

      {!done && (
        <div className="answer-input-row">
          <input 
            type="number" 
            className={`answer-input ${error ? 'wrong' : ''}`}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="..."
            autoFocus
          />
          <button className="btn btn-primary" onClick={check} style={{ padding: '16px 24px' }}>
            Check
          </button>
        </div>
      )}

      {done && (
        <button className="btn btn-green" onClick={onNext} style={{ marginTop: 32, animation: 'fadeSlideUp 0.5s ease' }}>
          Finish Simulation ✨
        </button>
      )}
    </div>
  );
}

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);

  const nextStation = () => {
    if (station < 2) setStation(s => s + 1);
    else onComplete();
  };

  return (
    <div className="simulate-screen">
      <div className="station-tabs">
        {STATIONS.map((st, i) => (
          <div key={i} className={`station-tab ${i === station ? 'active' : i < station ? 'completed' : ''}`}>
            {st.icon} {st.title}
          </div>
        ))}
      </div>

      <div className="sim-card glass-card">
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onNext={nextStation} />}
      </div>
    </div>
  );
}
