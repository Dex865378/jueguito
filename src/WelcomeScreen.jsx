import { useState, useRef, useEffect } from 'react';

const WelcomeScreen = ({ onEnter }) => {
  const [leftX, setLeftX] = useState(-120);
  const [dragging, setDragging] = useState(false);
  const [joined, setJoined] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const containerRef = useRef(null);
  const startRef = useRef(0);
  const initialXRef = useRef(-120);
  const [particles] = useState(() => Array.from({ length: 30 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    dur: `${3 + Math.random() * 4}s`,
    delay: `${Math.random() * 3}s`
  })));

  // Auto float animation for the right piece
  const [rightFloat, setRightFloat] = useState(0);
  useEffect(() => {
    if (joined) return;
    let frame;
    let t = 0;
    const animate = () => {
      setRightFloat(Math.sin(t) * 8);
      t += 0.03;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [joined]);

  const handlePointerDown = (e) => {
    if (joined) return;
    setDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    startRef.current = e.clientX - rect.left;
    initialXRef.current = leftX;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging || joined) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const delta = currentX - startRef.current;
    const newX = Math.max(-180, Math.min(20, initialXRef.current + delta));
    setLeftX(newX);

    // Snap and join when close enough
    if (newX >= -10) {
      setLeftX(0);
      setJoined(true);
      setDragging(false);

      // Celebration sequence
      setTimeout(() => setShowWelcome(true), 400);
      setTimeout(() => onEnter(), 2800);
    }
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none touch-none">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full opacity-30"
            style={{
              left: p.left,
              top: p.top,
              animation: `float ${p.dur} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className={`text-center mb-16 transition-all duration-1000 ${showWelcome ? 'opacity-0 -translate-y-10' : 'opacity-100'}`}>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4" style={{ textShadow: '0 0 40px rgba(168,85,247,0.6), 0 0 80px rgba(168,85,247,0.2)' }}>
          ENIGMA_NEXUS
        </h1>
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.5em]">
          Arrastra la pieza izquierda → para conectar
        </p>
      </div>

      {/* Puzzle pieces container */}
      <div
        ref={containerRef}
        className="relative max-w-[400px] w-full h-[200px] flex items-center justify-center"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* LEFT PIECE - Draggable */}
        <div
          onPointerDown={handlePointerDown}
          className={`absolute cursor-grab active:cursor-grabbing transition-transform ${joined ? 'duration-500' : dragging ? 'duration-0' : 'duration-300'}`}
          style={{
            left: `calc(50% + ${leftX}px - 100px)`,
            top: '50%',
            transform: `translateY(-50%) ${joined ? 'scale(1.1)' : ''} scale(var(--puzzle-scale, 1))`,
          }}
        >
          <svg className="w-[100px] h-[120px] md:w-[130px] md:h-[150px]" viewBox="0 0 130 150" fill="none">
            <path
              d="M 5 5 L 85 5 C 85 5 75 25 75 40 C 75 55 95 55 95 40 C 95 25 85 5 85 5 L 130 5 L 130 145 L 5 145 Z"
              fill={joined ? 'url(#joinedGradLeft)' : 'url(#gradLeft)'}
              stroke={joined ? '#a855f7' : '#6366f1'}
              strokeWidth="2"
              className="transition-all duration-500"
              style={{ filter: joined ? 'drop-shadow(0 0 20px rgba(168,85,247,0.8))' : dragging ? 'drop-shadow(0 0 15px rgba(99,102,241,0.5))' : 'none' }}
            />
            <defs>
              <linearGradient id="gradLeft" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
                <stop offset="100%" stopColor="rgba(99,102,241,0.1)" />
              </linearGradient>
              <linearGradient id="joinedGradLeft" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(168,85,247,0.5)" />
                <stop offset="100%" stopColor="rgba(124,58,237,0.3)" />
              </linearGradient>
            </defs>
            <text x="45" y="90" textAnchor="middle" fill="#a5b4fc" fontSize="16" fontWeight="900" fontFamily="monospace">E·N</text>
          </svg>
        </div>

        {/* RIGHT PIECE - Static with float */}
        <div
          className="absolute transition-transform duration-500"
          style={{
            left: 'calc(50% + 5px)',
            top: '50%',
            transform: `translateY(calc(-50% + ${joined ? 0 : rightFloat}px)) ${joined ? 'scale(1.1)' : ''} scale(var(--puzzle-scale, 1))`,
          }}
        >
          <svg className="w-[100px] h-[120px] md:w-[130px] md:h-[150px]" viewBox="0 0 130 150" fill="none">
            <path
              d="M 0 5 L 40 5 C 40 5 30 25 30 40 C 30 55 50 55 50 40 C 50 25 40 5 40 5 L 125 5 L 125 145 L 0 145 Z"
              fill={joined ? 'url(#joinedGradRight)' : 'url(#gradRight)'}
              stroke={joined ? '#a855f7' : '#7c3aed'}
              strokeWidth="2"
              className="transition-all duration-500"
              style={{ filter: joined ? 'drop-shadow(0 0 20px rgba(168,85,247,0.8))' : 'none' }}
            />
            <defs>
              <linearGradient id="gradRight" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(124,58,237,0.3)" />
                <stop offset="100%" stopColor="rgba(124,58,237,0.1)" />
              </linearGradient>
              <linearGradient id="joinedGradRight" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(168,85,247,0.5)" />
                <stop offset="100%" stopColor="rgba(99,102,241,0.3)" />
              </linearGradient>
            </defs>
            <text x="75" y="90" textAnchor="middle" fill="#c4b5fd" fontSize="16" fontWeight="900" fontFamily="monospace">I·X</text>
          </svg>
        </div>
      </div>

      {/* Welcome text after joining */}
      {showWelcome && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-fadeIn">
          <div className="relative">
            <h1
              className="text-6xl md:text-8xl font-black italic tracking-tighter"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #6366f1, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              BIENVENIDO
            </h1>
            <div className="absolute -inset-4 bg-purple-500/10 rounded-3xl blur-3xl -z-10" />
          </div>
          <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.5em] mt-6 animate-pulse">
            Ingresando al sistema...
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
