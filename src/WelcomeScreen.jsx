import { useState, useRef, useEffect } from 'react';
import { Fingerprint, ShieldCheck, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeScreen = ({ onEnter }) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [nodesActive, setNodesActive] = useState(false);
  const [nodeSequence, setNodeSequence] = useState([0, 1, 2, 3]);
  const [userSequence, setUserSequence] = useState([]);
  const [failed, setFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    // Fixed node sequence instead of randomized to prevent blind guessing
    setNodeSequence([0, 1, 2, 3]);
  }, []);

  const handleNodeClick = (id) => {
    if (nodesActive || accessGranted) return;
    const nextVal = nodeSequence[userSequence.length];
    if (id === nextVal) {
      const newSeq = [...userSequence, id];
      setUserSequence(newSeq);
      if (newSeq.length === 4) {
        setNodesActive(true);
        setFailed(false);
      }
    } else {
      setFailed(true);
      setUserSequence([]);
      setTimeout(() => setFailed(false), 500);
    }
  };

  const startScan = () => {
    if (accessGranted) return;
    setScanning(true);
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          handleSuccess();
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  const stopScan = () => {
    if (accessGranted) return;
    setScanning(false);
    clearInterval(timerRef.current);
    setProgress(0);
  };

  const handleSuccess = () => {
    setAccessGranted(true);
    setTimeout(() => setShowWelcome(true), 500);
    setTimeout(() => onEnter(), 3000);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none touch-none">
      {/* Biometric Scanner */}
      <div className={`relative z-10 flex flex-col items-center gap-12 transition-all duration-1000 ${showWelcome ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}`}>
        <div className="text-center">
          <h1 className="text-4xl sm:text-7xl font-black italic tracking-tighter mb-4 text-glow" style={{ color: '#a855f7' }}>
            ENIGMA_NEXUS
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">
            Identity_Verification_Required
          </p>
        </div>

        <div className="relative group">
          {/* Security Nodes Ring */}
          {!nodesActive && !accessGranted && (
            <div className="absolute -inset-16 grid grid-cols-2 gap-32 pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <button
                  key={i}
                  onClick={() => handleNodeClick(i)}
                  className={`w-12 h-12 rounded-lg border-2 pointer-events-auto transition-all duration-300 flex items-center justify-center font-black text-xs ${
                    userSequence.includes(i) ? 'bg-emerald-500 border-emerald-400 text-black' : failed ? 'bg-red-500 border-red-400 animate-shake' : 'bg-white/5 border-white/20 text-zinc-600 hover:border-purple-500 hover:text-purple-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Scanner Circle */}
          <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-2 transition-all duration-500 flex items-center justify-center relative overflow-hidden ${
            !nodesActive && !accessGranted ? 'border-red-500/20 grayscale opacity-40' : accessGranted ? 'border-emerald-500 bg-emerald-500/10' : scanning ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-white/5'
          }`}>
            
            {/* Progress Ring (SVG) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%" cy="50%" r="48%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (progress * 10)}
                className={`transition-all duration-100 ${accessGranted ? 'text-emerald-500' : 'text-purple-500'}`}
              />
            </svg>

            {/* Laser Line */}
            {scanning && !accessGranted && (
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-purple-500 shadow-[0_0_20px_#a855f7] z-20"
              />
            )}

            {/* Fingerprint Icon / Success Icon */}
            <button
              onPointerDown={() => nodesActive && startScan()}
              onPointerUp={stopScan}
              onPointerLeave={stopScan}
              onMouseDown={() => nodesActive && startScan()}
              onMouseUp={stopScan}
              onMouseLeave={stopScan}
              onTouchStart={() => nodesActive && startScan()}
              onTouchEnd={stopScan}
              disabled={!nodesActive && !accessGranted}
              className={`relative z-10 p-12 rounded-full transition-all duration-500 outline-none ${
                !nodesActive && !accessGranted ? 'cursor-not-allowed text-zinc-800' : accessGranted ? 'text-emerald-500 scale-110' : scanning ? 'text-purple-500 scale-95' : 'text-zinc-700 hover:text-zinc-500'
              }`}
            >
              {accessGranted ? <ShieldCheck className="w-20 h-20 md:w-32 md:h-32" /> : isMobile ? <Fingerprint className="w-20 h-20 md:w-32 md:h-32" /> : <MousePointerClick className="w-20 h-20 md:w-32 md:h-32" />}
            </button>

            {/* Scanning Grid Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none cyber-grid" />
          </div>

          {/* Prompt Label */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full text-center">
             <p className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${scanning ? 'text-purple-400 animate-pulse' : 'text-zinc-600'}`}>
                {accessGranted ? 'ACCESO_CONCEDIDO' : !nodesActive ? 'SECUENCIA_SEGURIDAD_REQUERIDA_CLIC_NÚMEROS (1-4)' : scanning ? `VERIFICANDO_${progress}%` : isMobile ? 'MANTÉN_PULSADO_EL_ÍCONO_PARA_ENTRAR' : 'MANTÉN_EL_CLICK_PARA_ENTRAR'}
             </p>
          </div>
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
