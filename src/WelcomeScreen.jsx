import { useState, useRef, useCallback } from 'react';

const WelcomeScreen = ({ onEnter }) => {
  const [dragX, setDragX] = useState(0);
  const [joined, setJoined] = useState(false);
  const [showBienvenido, setShowBienvenido] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const containerRef = useRef(null);

  // Returns how far we need to drag (in px) to trigger join
  const SNAP_THRESHOLD = 90;

  const onPointerDown = useCallback((e) => {
    if (joined) return;
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, [joined]); // eslint-disable-line

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const delta = Math.max(0, clientX - startX.current); // only allow right drag
    setDragX(Math.min(delta, SNAP_THRESHOLD + 20));
  }, []); // eslint-disable-line

  const onPointerUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);

    const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const delta = clientX - startX.current;

    if (delta >= SNAP_THRESHOLD) {
      setDragX(SNAP_THRESHOLD);
      setJoined(true);
      setTimeout(() => setShowBienvenido(true), 500);
      setTimeout(() => onEnter(), 3200);
    } else {
      setDragX(0); // snap back
    }
  }, [onEnter, onPointerMove]); // eslint-disable-line

  const progress = Math.min(dragX / SNAP_THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        background: '#09090b',
        zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: '"Inter", "Segoe UI", sans-serif',
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Purple glow blobs */}
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: 400, height: 400, background: 'rgba(168,85,247,0.06)', borderRadius: '50%', filter: 'blur(80px)', animation: 'blobPulse 4s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 400, height: 400, background: 'rgba(99,102,241,0.06)', borderRadius: '50%', filter: 'blur(80px)', animation: 'blobPulse 4s ease-in-out infinite', animationDelay: '2s' }} />

      {!showBienvenido ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60, position: 'relative', zIndex: 10 }}>
          
          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(40px, 8vw, 80px)',
              fontWeight: 900, fontStyle: 'italic',
              letterSpacing: '-0.04em',
              color: '#a855f7',
              textShadow: '0 0 40px rgba(168,85,247,0.4)',
              margin: 0,
            }}>ENIGMA_NEXUS</h1>
            <p style={{
              color: '#52525b', fontSize: 10, fontWeight: 800,
              letterSpacing: '0.4em', textTransform: 'uppercase',
              margin: '10px 0 0 0',
            }}>
              {joined ? 'NÚCLEO_SINCRONIZADO' : 'UNE_LAS_PIEZAS_PARA_ACCEDER'}
            </p>
          </div>

          {/* Puzzle Pieces */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative', height: 160 }}>

            {/* LEFT PIECE (draggable) */}
            <div
              onPointerDown={onPointerDown}
              style={{
                position: 'relative',
                transform: `translateX(${dragX}px)`,
                transition: dragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: joined ? 'default' : 'grab',
                zIndex: 2,
              }}
            >
              <PuzzlePieceLeft color={joined ? '#a855f7' : '#27272a'} glowing={joined} progress={progress} />
              {!joined && (
                <div style={{
                  position: 'absolute', bottom: -36, left: '50%',
                  transform: 'translateX(-50%)', whiteSpace: 'nowrap',
                  fontSize: 9, color: '#52525b', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  animation: 'arrowBounce 1.5s ease-in-out infinite',
                }}>
                  ← ARRASTRA →
                </div>
              )}
            </div>

            {/* RIGHT PIECE (static target) */}
            <div style={{
              position: 'relative',
              transform: `translateX(${joined ? -dragX + dragX : 0}px)`, // stays locked
              zIndex: 1,
            }}>
              <PuzzlePieceRight color={joined ? '#6366f1' : '#27272a'} glowing={joined} progress={progress} />
            </div>

            {/* Connection flash */}
            {joined && (
              <div style={{
                position: 'absolute', inset: -20,
                background: 'radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, transparent 70%)',
                borderRadius: 40,
                animation: 'joinFlash 0.8s ease-out forwards',
                pointerEvents: 'none',
              }} />
            )}
          </div>

          {/* Progress bar */}
          {!joined && (
            <div style={{ width: 200, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #a855f7, #6366f1)',
                transition: dragging.current ? 'none' : 'width 0.3s ease',
                boxShadow: progress > 0 ? '0 0 10px rgba(168,85,247,0.5)' : 'none',
              }} />
            </div>
          )}

          {/* Status line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: joined ? '#10b981' : '#27272a', boxShadow: joined ? '0 0 10px #10b981' : 'none', transition: 'all 0.5s' }} />
            <span style={{ fontSize: 9, color: '#3f3f46', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              SECURE_CONN: {joined ? 'ESTABLISHED' : 'PENDING'}
            </span>
          </div>
        </div>
      ) : (
        /* Bienvenido screen */
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 24, position: 'relative', zIndex: 10,
          animation: 'fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {/* Rings */}
          <div style={{ position: 'absolute', width: 500, height: 500, border: '1px solid rgba(168,85,247,0.1)', borderRadius: '50%', animation: 'spin 20s linear infinite' }} />
          <div style={{ position: 'absolute', width: 380, height: 380, border: '1px solid rgba(99,102,241,0.15)', borderRadius: '50%', animation: 'spin 14s linear infinite reverse' }} />

          <h1 style={{
            fontSize: 'clamp(60px, 12vw, 120px)',
            fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #a855f7, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: 0, position: 'relative',
          }}>BIENVENIDO</h1>

          <p style={{ color: '#52525b', fontSize: 11, fontWeight: 700, letterSpacing: '0.5em', textTransform: 'uppercase', animation: 'pulse 2s ease-in-out infinite' }}>
            Cargando Nexus...
          </p>

          <div style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span style={{ fontSize: 9, color: '#10b981', fontWeight: 700, letterSpacing: '0.3em' }}>AUTH_OK</span>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 9, color: '#52525b', fontWeight: 700, letterSpacing: '0.3em' }}>GUEST_USER</span>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        @keyframes blobPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes arrowBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-4px)} }
        @keyframes joinFlash { 0%{opacity:1} 100%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </div>
  );
};

// SVG Puzzle Piece - Left (tab on right side)
const PuzzlePieceLeft = ({ color, glowing, progress }) => (
  <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 10 L75 10 Q75 30 95 30 Q115 30 115 50 Q115 70 95 70 Q75 70 75 90 L75 120 L10 120 Z"
      fill={color}
      stroke={glowing ? '#a855f7' : 'rgba(255,255,255,0.08)'}
      strokeWidth={glowing ? 2 : 1.5}
      style={{
        filter: glowing ? 'drop-shadow(0 0 12px rgba(168,85,247,0.6))' : progress > 0 ? `drop-shadow(0 0 ${progress * 8}px rgba(168,85,247,${progress * 0.4}))` : 'none',
        transition: 'filter 0.3s',
      }}
    />
    {/* Icon inside */}
    <text x="38" y="72" fontSize="32" fill={glowing ? 'white' : '#52525b'} fontWeight="900" style={{ transition: 'fill 0.3s' }}>🧩</text>
  </svg>
);

// SVG Puzzle Piece - Right (notch on left side, matching tab)
const PuzzlePieceRight = ({ color, glowing, progress }) => (
  <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M55 10 L120 10 L120 120 L55 120 L55 90 Q55 70 35 70 Q15 70 15 50 Q15 30 35 30 Q55 30 55 10 Z"
      fill={color}
      stroke={glowing ? '#6366f1' : 'rgba(255,255,255,0.08)'}
      strokeWidth={glowing ? 2 : 1.5}
      style={{
        filter: glowing ? 'drop-shadow(0 0 12px rgba(99,102,241,0.6))' : progress > 0 ? `drop-shadow(0 0 ${progress * 8}px rgba(99,102,241,${progress * 0.4}))` : 'none',
        transition: 'filter 0.3s',
      }}
    />
    <text x="68" y="72" fontSize="32" fill={glowing ? 'white' : '#52525b'} fontWeight="900" style={{ transition: 'fill 0.3s' }}>⚡</text>
  </svg>
);

export default WelcomeScreen;
