import { memo, useMemo } from 'react';

const FloatingNumbers = () => {
  const numbers = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      num: Math.floor(Math.random() * 9000) + 1000,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * -20}s`,
      animationDuration: `${15 + Math.random() * 15}s`,
      fontSize: `${2 + Math.random() * 3}rem`,
      opacity: 0.02 + Math.random() * 0.05
    }));
  }, []);

  return (
    <div className="floating-numbers">
      {numbers.map(n => (
        <div 
          key={n.id} 
          className="floating-number"
          style={{
            left: n.left,
            top: n.top,
            animationDelay: n.animationDelay,
            animationDuration: n.animationDuration,
            fontSize: n.fontSize,
            opacity: n.opacity
          }}
        >
          {n.num}
        </div>
      ))}
    </div>
  );
};

export default memo(FloatingNumbers);
