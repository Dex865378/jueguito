import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const LondonClock = ({ config, onSolve, onError }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let frame;
    const animate = () => {
      setRotation(prev => (prev + config.speed) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [config.speed]);

  const handleStop = () => {
    if (rotation < 15 || rotation > 345) {
      onSolve();
    } else {
      onError();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-48 h-48 rounded-full border-4 border-white/20 flex items-center justify-center bg-black/40">
        <div className="absolute top-2 text-white/50 text-xs font-black">12</div>
        <div className="absolute right-2 text-white/50 text-xs font-black">3</div>
        <div className="absolute bottom-2 text-white/50 text-xs font-black">6</div>
        <div className="absolute left-2 text-white/50 text-xs font-black">9</div>
        <motion.div 
          className="absolute w-1 h-20 bg-indigo-500 origin-bottom bottom-1/2 rounded-full"
          style={{ rotate: rotation }}
        />
        <div className="w-4 h-4 bg-white rounded-full z-10" />
      </div>
      <button onClick={handleStop} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-white tracking-widest text-[10px] uppercase">
        DETENER_TIEMPO
      </button>
    </div>
  );
};

const CairoPyramid = ({ onSolve }) => {
  const [levels, setLevels] = useState([false, false, false]);

  const handleLevel = (idx) => {
    const next = [...levels];
    next[idx] = true;
    setLevels(next);
    if (next.every(Boolean)) onSolve();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center mb-2">
        <button onClick={() => handleLevel(0)} className={`w-16 h-16 clip-triangle transition-all ${levels[0] ? 'bg-amber-500 shadow-[0_0_20px_#f59e0b] scale-105' : 'bg-amber-900/40 hover:bg-amber-700/60'}`} />
      </div>
      <div className="flex justify-center gap-2 mb-2">
        <button onClick={() => handleLevel(1)} className={`w-16 h-16 clip-triangle transition-all ${levels[1] ? 'bg-amber-500 shadow-[0_0_20px_#f59e0b] scale-105' : 'bg-amber-900/40 hover:bg-amber-700/60'}`} />
        <button onClick={() => handleLevel(2)} className={`w-16 h-16 clip-triangle transition-all ${levels[2] ? 'bg-amber-500 shadow-[0_0_20px_#f59e0b] scale-105' : 'bg-amber-900/40 hover:bg-amber-700/60'}`} />
      </div>
      <style>{`.clip-triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }`}</style>
    </div>
  );
};

const BerlinEnigma = ({ config, onSolve }) => {
  const [r, setR] = useState(config.rotors || ['A','B','C']);
  
  const rotate = (idx) => {
    const next = [...r];
    next[idx] = String.fromCharCode(((next[idx].charCodeAt(0) - 65 + 1) % 26) + 65);
    setR(next);
    if (next.every(c => c === config.target)) setTimeout(onSolve, 400);
  };

  return (
    <div className="flex gap-4 p-8 bg-zinc-900 rounded-3xl border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      {r.map((char, i) => (
        <button key={i} onClick={() => rotate(i)} className="w-16 h-28 bg-white/5 border-2 border-zinc-700 rounded-xl font-mono text-5xl font-black text-indigo-400 hover:bg-white/10 flex items-center justify-center hover:border-indigo-500/50 transition-all active:scale-95 shadow-inner">
          {char}
        </button>
      ))}
    </div>
  );
};

const MoscowReactor = ({ onSolve, onError }) => {
  const [temp, setTemp] = useState(50);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTemp(p => {
        const next = p + 4;
        if (next >= 100) { onError(); setTime(0); return 50; }
        return next;
      });
      setTime(p => {
        const n = p + 0.1;
        if (n >= 5) {
          onSolve();
          return 5;
        }
        return n;
      });
    }, 100);
    return () => clearInterval(t);
  }, [onSolve, onError]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="text-4xl font-black font-mono tracking-widest text-glow" style={{ color: temp > 80 ? '#ef4444' : temp > 60 ? '#f59e0b' : '#10b981' }}>
        {Math.floor(temp)}°C
      </div>
      <div className="w-full h-8 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] relative">
        <div className="absolute h-full glass-card opacity-50 transition-all" style={{ width: `${temp}%`, backgroundColor: temp > 80 ? '#ef4444' : temp > 60 ? '#f59e0b' : '#10b981' }} />
      </div>
      <p className="text-zinc-500 font-bold tracking-[0.3em] uppercase text-[10px]">SOBREVIVE {Math.max(0, 5 - time).toFixed(1)}s</p>
      <button onClick={() => setTemp(p => Math.max(0, p - 12))} className="w-24 h-24 rounded-full bg-cyan-600/20 hover:bg-cyan-600 border-2 border-cyan-400 text-cyan-400 hover:text-white font-black hover:shadow-[0_0_20px_#0891b2] active:scale-95 transition-all text-xs tracking-widest uppercase">
        ENFRIAR
      </button>
    </div>
  );
};

const TokyoNeon = ({ config, onSolve, onError }) => {
  const [fixed, setFixed] = useState(0);

  const handleClick = (item, e) => {
    if (item === '⚡') {
      e.target.style.opacity = '0.2';
      e.target.style.pointerEvents = 'none';
      const n = fixed + 1;
      setFixed(n);
      if (n >= 2) onSolve(); // Fix 2 electric defects
    } else {
      onError();
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {config.items.map((item, i) => (
        <button key={i} onClick={(e) => handleClick(item, e)} className="text-4xl p-6 bg-black/40 rounded-2xl border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          {item}
        </button>
      ))}
    </div>
  );
};

const NyStocks = ({ config, onSolve, onError }) => {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {config.values.map((v, i) => {
        const isBad = v < 100;
        return (
          <button key={i} onClick={() => isBad ? onSolve() : onError()} className="flex flex-col items-center gap-4 p-6 bg-black/40 rounded-2xl hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all shadow-xl">
            {isBad ? <TrendingDown className="w-8 h-8 text-red-500 opacity-60" /> : <TrendingUp className="w-8 h-8 text-emerald-500 opacity-60" />}
            <span className={`font-mono text-xl font-black tracking-wider ${isBad ? 'text-red-400' : 'text-emerald-400'}`}>${v}</span>
          </button>
        );
      })}
    </div>
  );
};

export const MapGamesRenderer = ({ activePuzzle, onSolve, onError }) => {
  if (!activePuzzle) return null;
  const p = activePuzzle;
  
  switch(p.type) {
    case 'london_clock': return <LondonClock config={p.config} onSolve={onSolve} onError={onError} />;
    case 'cairo_pyramid': return <CairoPyramid onSolve={onSolve} />;
    case 'berlin_enigma': return <BerlinEnigma config={p.config} onSolve={onSolve} />;
    case 'moscow_reactor': return <MoscowReactor onSolve={onSolve} onError={onError} />;
    case 'tokyo_neon': return <TokyoNeon config={p.config} onSolve={onSolve} onError={onError} />;
    case 'ny_stocks': return <NyStocks config={p.config} onSolve={onSolve} onError={onError} />;
    default: return null;
  }
};
