import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Shield, Zap, Sparkles } from 'lucide-react';

const WelcomeScreen = ({ onEnter }) => {
  const [joined, setJoined] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleDrag = (event, info) => {
    // If the left piece (dragged) is close enough to the right piece
    // The target is roughly at x: 0 (center)
    if (info.point.x > window.innerWidth / 2 - 20 && info.point.x < window.innerWidth / 2 + 20) {
      if (!joined) {
        setJoined(true);
        setTimeout(() => setShowWelcome(true), 600);
        setTimeout(() => onEnter(), 3500);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none touch-none font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <AnimatePresence>
        {!showWelcome ? (
          <motion.div 
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            className="relative flex flex-col items-center gap-24 z-10"
          >
            {/* Title Section */}
            <div className="text-center space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-8xl font-black italic tracking-tighter text-glow"
                style={{ color: '#a855f7' }}
              >
                ENIGMA_NEXUS
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.5em]"
              >
                {joined ? 'SINCRONIZACIÓN_COMPLETA' : 'COMPLETA_EL_NÚCLEO_PARA_ACCEDER'}
              </motion.p>
            </div>

            {/* Puzzle Interaction Area */}
            <div className="relative w-full max-w-2xl h-64 flex items-center justify-center">
              
              {/* Connector Glow */}
              <AnimatePresence>
                {joined && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    className="absolute z-0 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full"
                  />
                )}
              </AnimatePresence>

              {/* Left Piece (Draggable) */}
              <motion.div 
                className={`relative z-20 cursor-grab active:cursor-grabbing ${joined ? 'pointer-events-none' : ''}`}
                drag={!joined ? "x" : false}
                dragConstraints={{ left: -300, right: 100 }}
                dragElastic={0.1}
                onDrag={handleDrag}
                initial={{ x: -150 }}
                animate={{ x: joined ? -1 : undefined }}
                transition={joined ? { type: "spring", stiffness: 300, damping: 20 } : undefined}
              >
                <div className={`relative p-8 rounded-3xl transition-all duration-500 ${joined ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_40px_rgba(168,85,247,0.4)]' : 'bg-white/5 border border-white/10 backdrop-blur-md'}`}>
                   <Puzzle className={`w-16 h-16 md:w-24 md:h-24 ${joined ? 'text-white' : 'text-purple-500/50'}`} />
                   {!joined && (
                     <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-950 rounded-full border border-white/10" />
                   )}
                </div>
                {!joined && (
                  <motion.div 
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className="text-[10px] font-bold text-zinc-600 italic">ARRASTRA_PARA_UNIR &rarr;</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Right Piece (Static/Target) */}
              <motion.div 
                className="relative z-10"
                initial={{ x: 150 }}
                animate={{ x: joined ? 1 : 150 }}
                transition={joined ? { type: "spring", stiffness: 300, damping: 20 } : undefined}
              >
                <div className={`relative p-8 rounded-3xl transition-all duration-500 ${joined ? 'bg-gradient-to-l from-purple-600 to-indigo-600 shadow-[0_0_40px_rgba(168,85,247,0.4)]' : 'bg-white/5 border border-white/10 backdrop-blur-md'}`}>
                   <Puzzle className={`w-16 h-16 md:w-24 md:h-24 mirror-x ${joined ? 'text-white' : 'text-indigo-500/50'}`} />
                   {!joined && (
                     <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-950 rounded-full border border-white/10 border-r-transparent" />
                   )}
                </div>
              </motion.div>

              {/* Connection Sparks */}
              {joined && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        x: (Math.random() - 0.5) * 400,
                        y: (Math.random() - 0.5) * 400
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 w-1 h-1 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Hints */}
            <div className="mt-12">
               <Shield className={`w-6 h-6 mx-auto mb-2 transition-colors ${joined ? 'text-emerald-500' : 'text-zinc-800'}`} />
               <p className="text-[8px] text-zinc-700 font-mono tracking-widest text-center">
                 SECURE_CONNECTION_ESTABLISHED: {joined ? 'TRUE' : 'FALSE'}
               </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-96 h-96 border border-purple-500/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[450px] h-[450px] border border-indigo-500/10 rounded-full"
            />
            
            <div className="relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"
              />
              <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white mb-4 animate-pulse">
                BIENVENIDO
              </h1>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <Zap className="w-5 h-5 text-purple-400 animate-bounce" />
              <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.6em]">
                Accediendo al Nexo...
              </p>
              <Zap className="w-5 h-5 text-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>

            <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6">
               <div className="flex flex-col items-start">
                  <span className="text-[8px] text-zinc-600 font-black uppercase">Usuario</span>
                  <span className="text-[10px] text-zinc-300 font-bold tracking-widest">GUEST_AUTH_OK</span>
               </div>
               <div className="w-[1px] h-8 bg-white/10" />
               <div className="flex flex-col items-start text-emerald-500">
                  <span className="text-[8px] font-black uppercase opacity-60">Status</span>
                  <span className="text-[10px] font-bold tracking-widest">READY</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mirror-x {
          transform: scaleX(-1);
        }
        .text-glow {
          text-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
        }
        .cyber-grid {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
