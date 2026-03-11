import { useState, useEffect, useCallback, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Brain, Lock, Unlock, Trophy, ChevronRight, Zap, 
  Shield, HelpCircle, Database, Award, RefreshCw,
  Terminal, Grid, Key, AlertTriangle, Cpu, CheckCircle, PaintBucket,
  Image as ImageIcon, Globe, Activity, Music
} from 'lucide-react';
import { PUZZLES, ACHIEVEMENTS } from './data/puzzles';
import { ExtraPuzzlesRenderer } from './ExtraPuzzles';
import { FunGamesRenderer } from './FunGames';
import { MapGamesRenderer } from './MapGames';
import WelcomeScreen from './WelcomeScreen';

/**
 * AUDIO ENGINE (Web Audio API)
 */
const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  if (type === 'success') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } else if (type === 'click') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }
};

let audioCtx = null;
let ambianceInterval = null;

const playAmbianceTrack = (trackId) => {
  if (ambianceInterval) {
    clearInterval(ambianceInterval);
    ambianceInterval = null;
  }

  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
  
  if (trackId === 0) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  if (trackId === 1) { // DEEP DRONE
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfoG = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 55;
    g.gain.value = 0.02;
    lfo.frequency.value = 0.5;
    lfoG.gain.value = 5;
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();
    lfo.start();
  } else if (trackId === 2) { // TECHNO PULSE
    const master = audioCtx.createGain();
    master.gain.value = 0.05;
    master.connect(audioCtx.destination);
    ambianceInterval = setInterval(() => {
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(85, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.4);
      g.gain.setValueAtTime(1, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(audioCtx.currentTime + 0.4);
    }, 500);
  } else if (trackId === 3) { // CYBER PADS
    [110, 164.81, 220, 329.63].forEach(freq => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.value = 0.01;
      const lfo = audioCtx.createOscillator();
      const lfoG = audioCtx.createGain();
      lfo.frequency.value = 0.2 + Math.random() * 0.5;
      lfoG.gain.value = 0.005;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      lfo.start();
    });
  } else if (trackId === 4) { // HIGH VOLTAGE
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.value = 40;
    g.gain.value = 0.01;
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 15;
    const lfoG = audioCtx.createGain();
    lfoG.gain.value = 20;
    lfo.connect(lfoG);
    lfoG.connect(o.frequency);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    lfo.start();
  } else if (trackId === 5) { // CATCHY_DANCE (Rhythmic / Macarena Vibe)
    const master = audioCtx.createGain();
    master.gain.value = 0.05;
    master.connect(audioCtx.destination);
    
    ambianceInterval = setInterval(() => {
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      
      // Kick 
      const kick = audioCtx.createOscillator();
      const kickG = audioCtx.createGain();
      kick.frequency.setValueAtTime(150, t);
      kick.frequency.exponentialRampToValueAtTime(0.01, t + 0.2);
      kickG.gain.setValueAtTime(1, t);
      kickG.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      kick.connect(kickG).connect(master);
      kick.start(t); kick.stop(t + 0.2);

      // Snare-ish
      if (Math.random() > 0.5) {
        const snare = audioCtx.createOscillator();
        const snareG = audioCtx.createGain();
        snare.type = 'sawtooth';
        snare.frequency.setValueAtTime(200, t + 0.25);
        snareG.gain.setValueAtTime(0.2, t + 0.25);
        snareG.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        snare.connect(snareG).connect(master);
        snare.start(t + 0.25); snare.stop(t + 0.4);
      }

      // Melodic Pluck
      const synth = audioCtx.createOscillator();
      const synthG = audioCtx.createGain();
      const notes = [261.63, 329.63, 392, 523.25]; // C Major
      synth.frequency.setValueAtTime(notes[Math.floor(Math.random() * notes.length)], t);
      synthG.gain.setValueAtTime(0.3, t);
      synthG.gain.linearRampToValueAtTime(0, t + 0.1);
      synth.connect(synthG).connect(master);
      synth.start(t); synth.stop(t + 0.1);
      
    }, 500);
  }
};

const WORLD_NODES = [
  { id: 'london', name: 'LONDON_PROXY', x: 45, y: 28, difficulty: 'EASY', puzzleIds: [101, 1, 10], unlocks: ['berlin', 'cairo'] },
  { id: 'cairo', name: 'CAIRO_GATEWAY', x: 55, y: 55, difficulty: 'EASY', puzzleIds: [102, 2, 12], unlocks: ['moscow'] },
  { id: 'berlin', name: 'BERLIN_CORE', x: 52, y: 25, difficulty: 'MEDIUM', puzzleIds: [103, 3, 14], unlocks: ['tokyo'] },
  { id: 'moscow', name: 'MOSCOW_INFRA', x: 65, y: 20, difficulty: 'HARD', puzzleIds: [104, 4, 15], unlocks: ['ny'] },
  { id: 'tokyo', name: 'TOKYO_HUB', x: 85, y: 40, difficulty: 'HARD', puzzleIds: [105, 5, 16], unlocks: ['london'] },
  { id: 'ny', name: 'NY_CENTRAL', x: 25, y: 35, difficulty: 'EXTREME', puzzleIds: [106, 6, 82], unlocks: ['london'] },
];

/**
 * ANIMATIONS
 */
const shake = {
  error: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};

/**
 * MINI-GAME: MEMORY SEQUENCE (LEVEL 1)
 */
const MemoryGame = ({ config, onSolve, onError }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);

  const startSequence = () => {
    if (isPlaying) return;
    const newSeq = Array.from({ length: config.steps }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setUserSequence([]);
    setIsPlaying(true);
    playSequence(newSeq);
  };

  const playSequence = async (seq) => {
    for (const val of seq) {
      await new Promise(r => setTimeout(r, 600));
      setActiveBtn(val);
      await new Promise(r => setTimeout(r, 400));
      setActiveBtn(null);
    }
    setIsPlaying(false);
  };

  const handleBtnClick = (idx) => {
    if (isPlaying) return;
    const nextUserSeq = [...userSequence, idx];
    setUserSequence(nextUserSeq);
    
    if (idx !== sequence[nextUserSeq.length - 1]) {
      setUserSequence([]);
      onError();
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      onSolve();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-2 gap-4">
        {config.colors.map((color, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleBtnClick(i)}
            className="w-20 h-20 rounded-2xl border border-white/10 transition-all shadow-lg"
            style={{ 
              backgroundColor: activeBtn === i ? color : `${color}11`,
              borderColor: activeBtn === i ? '#fff' : `${color}33`,
              boxShadow: activeBtn === i ? `0 0 25px ${color}` : 'none'
            }}
          />
        ))}
      </div>
      <button onClick={startSequence} className="text-[10px] font-black tracking-widest text-indigo-400 hover:text-white uppercase px-8 py-3 bg-white/5 border border-white/10 rounded-full transition-all">
        Sincronizar Señal
      </button>
    </div>
  );
};

/**
 * MINI-GAME: CIPHER (LEVEL 2)
 */
const CipherGame = ({ config, onSolve }) => {
  const [input, setInput] = useState('');
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-black/40 p-8 rounded-3xl border border-indigo-500/20 font-mono text-3xl tracking-[0.5em] text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]">
        {config.cipher}
      </div>
      <input 
        type="text" 
        value={input}
        onChange={(e) => {
          const val = e.target.value.toUpperCase();
          setInput(val);
          if (val === config.answer) onSolve();
        }}
        placeholder="DECRYPT KEY..."
        className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full max-w-xs text-center font-black tracking-widest focus:outline-none focus:border-indigo-500/50 transition-colors"
      />
    </div>
  );
};

/**
 * MINI-GAME: LOGIC NODES (LEVEL 3)
 */
const LogicGame = ({ config, onSolve }) => {
  const [selectedIdx, setSelectedIdx] = useState([]);
  const currentTotal = selectedIdx.reduce((acc, idx) => acc + config.nodes[idx], 0);

  const toggle = (idx) => {
    const next = selectedIdx.includes(idx) ? selectedIdx.filter(v => v !== idx) : [...selectedIdx, idx];
    setSelectedIdx(next);
    const newTotal = next.reduce((acc, i) => acc + config.nodes[i], 0);
    if (newTotal === config.target) onSolve();
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-wrap justify-center gap-5">
        {config.nodes.map((val, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`w-16 h-16 rounded-2xl border-2 font-black text-xl transition-all ${
              selectedIdx.includes(i) 
              ? 'bg-indigo-600 border-white text-white shadow-[0_0_20px_#6366f1]' 
              : 'bg-zinc-900 border-white/5 text-zinc-700 hover:border-white/20'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-xs font-black tracking-widest">
        ENERGÍA: <span className={currentTotal > config.target ? 'text-red-500' : 'text-indigo-400'}>{currentTotal}</span> / {config.target}
      </div>
    </div>
  );
};

/**
 * MINI-GAME: HACKING TERMINAL (LEVEL 4)
 */
const TerminalGame = ({ config, onSolve, onError }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const all = [...config.junk, config.target].sort(() => Math.random() - 0.5);
    setLines(all);
  }, [config]);

  const handleLineClick = (line) => {
    if (line === config.target) onSolve();
    else onError();
  };

  return (
    <div className="w-full max-w-md bg-black/60 p-6 rounded-2xl border border-emerald-500/20 font-mono text-sm">
      <div className="mb-4 text-emerald-500/40 p-2 border-b border-emerald-500/10">ROOT@ENIGMA_OS:~$ ./scan_buffer</div>
      <div className="space-y-2">
        {lines.map((line, i) => (
          <button 
            key={i}
            onClick={() => handleLineClick(line)}
            className="w-full text-left px-3 py-2 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors rounded group flex justify-between items-center"
          >
            <span className="text-zinc-600 group-hover:text-emerald-500">[{i.toString(16).padStart(2, '0')}]</span>
            <span className="font-bold tracking-wider">{line}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * MINI-GAME: NEURAL MAZE (LEVEL 5)
 */
const MazeGame = ({ config, onSolve, onError }) => {
  const [pos, setPos] = useState(config.start);

  const move = (dir) => {
    const [y, x] = pos;
    let next = [y, x];
    if (dir === 'UP') next = [y - 1, x];
    if (dir === 'DOWN') next = [y + 1, x];
    if (dir === 'LEFT') next = [y, x - 1];
    if (dir === 'RIGHT') next = [y, x + 1];

    const [ny, nx] = next;
    if (ny < 0 || ny >= config.size || nx < 0 || nx >= config.size) return;
    
    if (config.walls.some(([wy, wx]) => wy === ny && wx === nx)) {
      setPos(config.start);
      onError();
      return;
    }

    setPos(next);
    if (ny === config.end[0] && nx === config.end[1]) onSolve();
  };

  // resetProgress not used here

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') move('UP');
      if (e.key === 'ArrowDown') move('DOWN');
      if (e.key === 'ArrowLeft') move('LEFT');
      if (e.key === 'ArrowRight') move('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${config.size}, 1fr)` }}>
        {Array.from({ length: config.size * config.size }).map((_, i) => {
          const r = Math.floor(i / config.size);
          const c = i % config.size;
          const isWall = config.walls.some(([wy, wx]) => wy === r && wx === c);
          const isPath = r === pos[0] && c === pos[1];
          const isEnd = r === config.end[0] && c === config.end[1];

          return (
            <div key={i} className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${
              isWall ? 'bg-red-950/20 border-red-900/40 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' : 
              isPath ? 'bg-indigo-600 border-white shadow-[0_0_15px_#6366f1] z-10 scale-110' :
              isEnd ? 'bg-emerald-500/20 border-emerald-500/50 blur-[1px] animate-pulse' :
              'bg-white/[0.02] border-white/5'
            }`}>
              {isPath && <Zap className="w-5 h-5" />}
              {isEnd && !isPath && <Trophy className="w-4 h-4 text-emerald-400" />}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div />
        <NavBtn dir="UP" onClick={() => move('UP')} />
        <div />
        <NavBtn dir="LEFT" onClick={() => move('LEFT')} />
        <NavBtn dir="DOWN" onClick={() => move('DOWN')} />
        <NavBtn dir="RIGHT" onClick={() => move('RIGHT')} />
      </div>
    </div>
  );
};

const NavBtn = ({ dir, onClick }) => (
  <button onClick={onClick} className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-all">
    <div className="text-[10px] font-black">{dir}</div>
  </button>
);

/**
 * MINI-GAME: PULSE SYNC (LEVEL 6)
 */
const SyncGame = ({ config, onSolve, onError }) => {
  const [rotation, setRotation] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const targetZone = { start: 160, end: 200 }; // The "sweet spot" in degrees

  useEffect(() => {
    let frame;
    const animate = () => {
      setRotation(prev => (prev + config.speed) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [config.speed]);

  const handleIntercept = () => {
    if (rotation >= targetZone.start && rotation <= targetZone.end) {
      const next = successCount + 1;
      setSuccessCount(next);
      if (next >= config.count) onSolve();
      // Visual feedback for hit
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#10b981']
      });
    } else {
      setSuccessCount(0);
      onError();
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
        
        {/* Target Zone */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeDasharray={`${(targetZone.end - targetZone.start) * 2.1} 1000`}
            strokeDashoffset={-targetZone.start * 2.1}
            className="opacity-40"
          />
        </svg>

        {/* Pointer */}
        <motion.div 
          className="absolute w-1 h-32 bg-indigo-500 origin-bottom bottom-1/2 shadow-[0_0_15px_#6366f1]"
          style={{ rotate: rotation }}
        />

        {/* Center Node */}
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center z-10">
          <Zap className={`w-6 h-6 ${successCount > 0 ? 'text-emerald-400 animate-pulse' : 'text-zinc-600'}`} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {Array.from({ length: config.count }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full border ${i < successCount ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-white/5 border-white/10'}`} 
            />
          ))}
        </div>
        <button 
          onMouseDown={handleIntercept}
          className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all text-xs"
        >
          INTERCEPTAR_SEÑAL
        </button>
      </div>
    </div>
  );
};

/**
 * MINI-GAME: FIREWALL BREACH (LEVEL 7)
 */
const FirewallGame = ({ config, onSolve }) => {
  const [activeSectors, setActiveSectors] = useState(new Array(config.sectors).fill(0));

  const toggleSector = (idx) => {
    playSound('click');
    const next = [...activeSectors];
    next[idx] = 100;
    setActiveSectors(next);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSectors(prev => {
        const next = prev.map(v => Math.max(0, v - (100 / (config.decayTime / 50))));
        if (next.every(v => v > 80)) {
          clearInterval(timer);
          onSolve();
        }
        return next;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [config, onSolve]); // Added onSolve to dependencies

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="grid grid-cols-4 gap-4">
        {activeSectors.map((val, i) => (
          <button
            key={i}
            onMouseEnter={() => toggleSector(i)}
            className="w-16 h-24 rounded-lg border relative overflow-hidden transition-all"
            style={{ 
              backgroundColor: `rgba(239, 68, 68, ${val / 200})`,
              borderColor: val > 80 ? '#ef4444' : 'rgba(255,255,255,0.1)'
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-red-500 transition-all" style={{ height: `${val}%` }} />
          </button>
        ))}
      </div>
      <p className="text-[10px] font-black tracking-widest text-red-500 animate-pulse uppercase">Sobrecarga Todos los Sectores Simultáneamente</p>
    </div>
  );
};

/**
 * MINI-GAME: EMERGENCY COMMAND (LEVEL 8)
 */
const CommandGame = ({ config, onSolve, onError }) => {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onError();
          setCurrentIndex(0);
          return config.timeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onError, config.timeLimit]);

  const handleInput = (e) => {
    const val = e.target.value.toUpperCase();
    setInput(val);
    if (val === config.commands[currentIndex]) {
      playSound('success');
      setInput('');
      if (currentIndex + 1 === config.commands.length) onSolve();
      else setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="flex justify-between w-full mb-4">
        <span className="text-red-500 font-black">SISTEMA_CRÍTICO</span>
        <span className={`font-black ${timeLeft < 4 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
      </div>
      <div className="w-full bg-black/60 p-8 rounded-3xl border-2 border-red-500/30 text-center relative overflow-hidden">
        <div className="text-[10px] text-zinc-600 mb-2">INTRODUCE COMANDO:</div>
        <div className="text-4xl font-black tracking-tighter italic text-white animate-glitch">{config.commands[currentIndex]}</div>
      </div>
      <input 
        autoFocus
        value={input}
        onChange={handleInput}
        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center font-mono text-xl focus:border-red-500/50 outline-none"
        placeholder="TYPE_HERE..."
      />
      <div className="flex gap-2">
        {config.commands.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i < currentIndex ? 'bg-emerald-500' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
};

/**
 * RECREATIONAL GAMES (EASY)
 */
const ParityGame = ({ config, onSolve, onError }) => {
  const [selected, setSelected] = useState([]);
  const evenCount = config.numbers.filter(n => n % 2 === 0).length;

  const handleSelect = (n, i) => {
    if (n % 2 !== 0) {
      onError();
      setSelected([]);
    } else {
      playSound('click');
      const next = [...selected, i];
      setSelected(next);
      if (next.length === evenCount) onSolve();
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {config.numbers.map((n, i) => (
        <button 
          key={i} 
          onClick={() => !selected.includes(i) && handleSelect(n, i)} 
          className={`w-16 h-16 rounded-xl border font-black text-xl transition-all shadow-lg ${
            selected.includes(i) ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 scale-95' : 'bg-white/5 border-white/10 hover:bg-indigo-500/20 text-zinc-300 hover:scale-105'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
};

const WordFindGame = ({ config, onSolve, onError }) => {
  const [selectedIdxs, setSelectedIdxs] = useState([]);
  const targetChars = config.target.split('');

  const handleClick = (char, i) => {
    if (selectedIdxs.includes(i)) return; // already clicked

    const expectedChar = targetChars[selectedIdxs.length];
    
    // Check if the character is correct
    if (char === expectedChar) {
      playSound('click');
      const next = [...selectedIdxs, i];
      setSelectedIdxs(next);
      if (next.length === targetChars.length) {
        onSolve();
      }
    } else {
      onError();
      setSelectedIdxs([]); // reset on fail
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
        OBJETIVO: <span className="text-white">{config.target}</span>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${config.grid[0].length}, 1fr)` }}>
        {config.grid.flat().map((char, i) => (
          <button 
            key={i} 
            onClick={() => handleClick(char, i)} 
            className={`w-10 h-10 rounded-lg font-mono font-bold transition-all ${
              selectedIdxs.includes(i) ? 'bg-indigo-500 text-white shadow-[0_0_15px_#6366f1] scale-110' : 'bg-black/40 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white'
            }`}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};

const QuickMathGame = ({ config, onSolve }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-3xl font-black">{config.operation} = ?</div>
      <input type="number" onChange={(e) => parseInt(e.target.value) === config.answer ? onSolve() : null} className="bg-white/5 border border-white/10 p-4 rounded-xl text-center w-32 outline-none" placeholder="..." />
    </div>
  );
};

const ColorMatchGame = ({ config, onSolve, onError }) => (
  <div className="flex flex-col items-center gap-8">
    <div className="text-4xl font-black" style={{ color: config.color }}>{config.text}</div>
    <div className="flex gap-4">
      <button onClick={() => config.matches ? onSolve() : onError()} className="px-8 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl font-black">SÍ</button>
      <button onClick={() => !config.matches ? onSolve() : onError()} className="px-8 py-3 bg-red-500/20 border border-red-500/50 rounded-xl font-black">NO</button>
    </div>
  </div>
);

const IntruderGame = ({ config, onSolve, onError }) => (
  <div className="flex gap-4">
    {config.items.map((item, i) => (
      <button key={i} onClick={() => i === config.targetIndex ? onSolve() : onError()} className="text-4xl p-4 bg-white/5 rounded-2xl hover:bg-white/10">{item}</button>
    ))}
  </div>
);

const TapperGame = ({ config, onSolve }) => {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => { const n = count + 1; setCount(n); if (n >= config.target) onSolve(); }} className="w-32 h-32 rounded-full border-4 border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center animate-pulse">
      <span className="text-4xl font-black">{count}</span>
    </button>
  );
};

const FlashGame = ({ config, onSolve, onError }) => {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), 1000); return () => clearTimeout(t); }, []);
  return (
    <div className="flex flex-col items-center gap-8">
      {show ? <Cpu className="w-16 h-16 text-indigo-400" /> : 
        <div className="flex gap-4">
          {config.options.map((opt, i) => (
            <button key={i} onClick={() => opt === config.icon ? onSolve() : onError()} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-indigo-500/20">{opt}</button>
          ))}
        </div>
      }
    </div>
  );
};

const OrderGame = ({ config, onSolve }) => (
  <div className="flex gap-4">
    {[...config.numbers].sort((a,b) => a-b).map((n, i) => (
      <button key={i} onClick={() => n === config.answer[0] ? onSolve() : null} className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl font-black">{n}</button>
    ))}
  </div>
);

const EchoGame = ({ onSolve }) => {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => { const n = count + 1; setCount(n); if (n >= 3) onSolve(); }} className="px-10 py-5 border border-indigo-500/50 rounded-2xl animate-bounce">REPETIR_SEÑAL</button>
  );
};

const CaptchaGame = ({ config, onSolve }) => (
  <input maxLength={4} onChange={(e) => e.target.value.toUpperCase() === config.code ? onSolve() : null} className="bg-black/40 border border-white/20 p-6 rounded-2xl text-4xl font-mono tracking-widest text-center w-48" placeholder={config.code} />
);

/**
 * CRITICAL EXPANSION: ADVANCED PROTOCOLS
 */
const LightsOutGame = ({ config, onSolve }) => {
  const [grid, setGrid] = useState(config.initial);
  
  const toggle = (idx) => {
    playSound('click');
    const next = [...grid];
    const s = config.size;
    
    // Si solo queda un nodo encendido y es el que tocamos, apágalo sin afectar vecinos
    const onCount = grid.filter(Boolean).length;
    if (onCount === 1 && grid[idx] === true) {
      next[idx] = false;
    } else {
      next[idx] = !next[idx];
      if (idx >= s) next[idx - s] = !next[idx - s];
      if (idx < s * (s - 1)) next[idx + s] = !next[idx + s];
      if (idx % s !== 0) next[idx - 1] = !next[idx - 1];
      if (idx % s !== s - 1) next[idx + 1] = !next[idx + 1];
    }
    
    setGrid(next);
    if (next.every(v => v === false)) onSolve();
  };

  return (
    <div className="grid gap-2 p-6 bg-black/40 rounded-3xl border border-white/10" style={{ gridTemplateColumns: `repeat(${config.size}, 1fr)` }}>
      {grid.map((isOn, i) => (
        <button 
          key={i} 
          onClick={() => toggle(i)}
          className={`w-16 h-16 rounded-xl transition-all duration-300 ${isOn ? 'bg-indigo-500 shadow-[0_0_20px_#6366f1]' : 'bg-white/5 border border-white/10'}`}
        />
      ))}
    </div>
  );
};

const SlidersGame = ({ config, onSolve }) => {
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  const [v3, setV3] = useState(0);

  useEffect(() => {
    if (v1 === config.targets[0] && v2 === config.targets[1] && v3 === config.targets[2]) {
      setTimeout(onSolve, 500);
    }
  }, [v1, v2, v3, config.targets, onSolve]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm bg-black/40 p-8 rounded-3xl border border-white/10">
      <div className="text-center font-mono text-xs tracking-widest text-indigo-400 mb-2 uppercase">Freq_Sync: {100 - v1 - v2} === {v3} ?</div>
      
      {[
        { val: v1, setVal: setV1, color: 'accent-rose-500', name: 'X-AXIS' },
        { val: v2, setVal: setV2, color: 'accent-amber-500', name: 'Y-AXIS' },
        { val: v3, setVal: setV3, color: 'accent-indigo-500', name: 'Z-AXIS' }
      ].map((slider, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-black tracking-widest text-zinc-500">
            <span>{slider.name}</span>
            <span className="text-white">{slider.val}</span>
          </div>
          <input 
            type="range" min="0" max="100" step="5"
            value={slider.val}
            onChange={(e) => { playSound('click'); slider.setVal(parseInt(e.target.value)); }}
            className={`w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer ${slider.color}`}
          />
        </div>
      ))}
    </div>
  );
};

const ReactionGame = ({ onSolve, onError }) => {
  const [state, setState] = useState('idle');
  
  useEffect(() => {
    let t1;
    if (state === 'waiting') {
      t1 = setTimeout(() => {
        setState('action');
        playSound('success');
      }, Math.random() * 3000 + 1500);
    }
    return () => clearTimeout(t1);
  }, [state]);

  const toggle = () => {
    if (state === 'idle') {
      setState('waiting');
      playSound('click');
    } else if (state === 'action') {
      onSolve();
    } else if (state === 'waiting') {
      onError();
      setState('idle');
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className={`w-32 h-32 rounded-full border-[6px] flex items-center justify-center transition-all ${
        state === 'idle' ? 'border-white/10 bg-white/5' :
        state === 'waiting' ? 'border-amber-500/50 bg-amber-500/10 animate-pulse' :
        'border-red-500 bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.8)]'
      }`}>
        <Zap className={`w-12 h-12 transition-all ${state === 'action' ? 'text-white scale-125' : 'text-zinc-700'}`} />
      </div>
      
      <button 
        onMouseDown={toggle}
        className={`px-16 py-6 rounded-3xl font-black text-xl tracking-widest active:scale-95 transition-all shadow-xl border ${
          state === 'idle' ? 'bg-indigo-600/20 border-indigo-500/50 hover:bg-indigo-600/40 text-indigo-400' :
          state === 'waiting' ? 'bg-amber-600/20 border-amber-500/50 text-amber-500' :
          'bg-red-600 border-red-500 hover:bg-red-500 text-white shadow-[0_10px_40px_rgba(239,68,68,0.4)]'
        }`}
      >
        {state === 'idle' ? 'INICIAR' : state === 'waiting' ? 'PREPARANDO...' : '¡SALTO!'}
      </button>
    </div>
  );
};

/**
 * MINI-GAME: BOSS CONVERGENCE (LEVEL 9)
 */
const BossGame = ({ config, onSolve, onError }) => {
  const [solvedStates, setSolvedStates] = useState([false, false, false]);

  const handleSubSolve = (idx) => {
    const next = [...solvedStates];
    next[idx] = true;
    setSolvedStates(next);
    if (next.every(v => v === true)) onSolve();
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 overflow-y-auto">
      <div className={`p-4 rounded-3xl border ${solvedStates[0] ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
        <p className="text-[8px] font-black mb-4 tracking-widest text-zinc-500 uppercase">Núcleo_Sincrónico</p>
        <div className="scale-75 origin-top">
          {solvedStates[0] ? <div className="h-32 flex items-center justify-center text-emerald-400 font-black">ESTABLE</div> : <SyncGame config={config.subPuzzles[0]} onSolve={() => handleSubSolve(0)} onError={onError} />}
        </div>
      </div>
      <div className={`p-4 rounded-3xl border ${solvedStates[1] ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
        <p className="text-[8px] font-black mb-4 tracking-widest text-zinc-500 uppercase">Matriz_Firewall</p>
        <div className="scale-75 origin-top">
          {solvedStates[1] ? <div className="h-32 flex items-center justify-center text-emerald-400 font-black">BRECHADO</div> : <FirewallGame config={config.subPuzzles[1]} onSolve={() => handleSubSolve(1)} />}
        </div>
      </div>
      <div className={`lg:col-span-2 p-4 rounded-3xl border ${solvedStates[2] ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
        <p className="text-[8px] font-black mb-4 tracking-widest text-zinc-500 uppercase">Código_de_Acceso</p>
        <div className="scale-75 origin-top">
          {solvedStates[2] ? <div className="h-20 flex items-center justify-center text-emerald-400 font-black">VALIDADO</div> : <CipherGame config={config.subPuzzles[2]} onSolve={() => handleSubSolve(2)} />}
        </div>
      </div>
    </div>
  );
};

const OrbitalGame = ({ config, onSolve, onError }) => {
  const [rots, setRots] = useState([0, 0, 0]);
  
  useEffect(() => {
    let f;
    const update = () => {
      setRots(prev => prev.map((r, i) => (r + config.speeds[i]) % 360));
      f = requestAnimationFrame(update);
    };
    f = requestAnimationFrame(update);
    return () => cancelAnimationFrame(f);
  }, [config.speeds]);

  const handleIntercept = () => {
    playSound('click');
    const inZone = rots.every(r => (r < config.tolerance || r > 360 - config.tolerance));
    if (inZone) onSolve();
    else onError();
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Target Zone Indicator at the top */}
        <div className="absolute top-0 w-8 h-8 -mt-4 bg-emerald-500/20 border-2 border-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20 flex items-center justify-center">
           <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        
        {rots.map((rot, i) => {
          const baseSize = 220;
          const size = baseSize - (i * 50);
          const colors = ['#6366f1', '#a855f7', '#ec4899'];
          return (
            <div key={i} className="absolute rounded-full border border-white/10" style={{ width: size, height: size }}>
              <motion.div 
                className="absolute left-1/2 top-0 w-4 h-4 -ml-2 -mt-2 rounded-full bg-current"
                style={{ rotate: rot, transformOrigin: `50% ${size / 2}px`, color: colors[i], boxShadow: `0 0 15px ${colors[i]}` }}
              />
            </div>
          );
        })}
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center z-10 flex-col gap-1 shadow-2xl">
           <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]"/>
           <div className="text-[6px] font-black tracking-widest text-zinc-500">SYNC</div>
        </div>
      </div>
      <button onMouseDown={handleIntercept} className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all text-xs">
        ALINEAR_SATÉLITES
      </button>
    </div>
  );
};
const WaveGame = ({ config, onSolve }) => {
  const [freq, setFreq] = useState(1);
  const [amp, setAmp] = useState(10);
  
  useEffect(() => {
    if (freq === config.targetFreq && Math.abs(amp - config.targetAmp) < 5) {
      setTimeout(onSolve, 500);
    }
  }, [freq, amp, config, onSolve]);

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-lg">
      <div className="relative w-full h-48 bg-black/40 border border-white/10 rounded-3xl overflow-hidden flex items-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 w-full flex justify-between px-4 items-center opacity-20 pointer-events-none">
           {Array.from({length: 40}).map((_, i) => (
             <div key={i} className="w-1.5 bg-emerald-500 rounded-full" style={{ height: `${10 + config.targetAmp * 0.8 * Math.abs(Math.sin((i/40) * config.targetFreq * Math.PI))}%` }} />
           ))}
        </div>
        <div className="relative w-full flex justify-between px-4 items-center">
           {Array.from({length: 40}).map((_, i) => (
             <div key={i} className="w-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1] transition-all" style={{ height: `${10 + amp * 0.8 * Math.abs(Math.sin((i/40) * freq * Math.PI))}%` }} />
           ))}
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-8 bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-[10px] font-black tracking-widest text-zinc-500">
            <span>FRECUENCIA</span> <span className="text-white">{freq} Hz</span>
          </div>
          <input type="range" min="1" max="10" value={freq} onChange={(e) => setFreq(parseInt(e.target.value))} className="w-full h-1 bg-white/10 accent-indigo-500"/>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-[10px] font-black tracking-widest text-zinc-500">
            <span>AMPLITUD</span> <span className="text-white">{amp}</span>
          </div>
          <input type="range" min="10" max="100" value={amp} onChange={(e) => setAmp(parseInt(e.target.value))} className="w-full h-1 bg-white/10 accent-purple-500"/>
        </div>
      </div>
    </div>
  );
};

const MatrixRotationGame = ({ config, onSolve }) => {
  const [rotations, setRotations] = useState([0, 0, 0, 0]);
  
  const rotate = (idx) => {
    playSound('click');
    const next = [...rotations];
    next[idx] = (next[idx] + 90) % 360;
    setRotations(next);
    if (next.every((r, i) => r === config.targets[i])) {
      setTimeout(onSolve, 500);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {rotations.map((rot, i) => (
        <button 
          key={i} 
          onClick={() => rotate(i)}
          className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all hover:bg-white/10"
        >
          <motion.div animate={{ rotate: rot }} className="w-12 h-12 border-t-4 border-indigo-500 rounded-full" />
        </button>
      ))}
    </div>
  );
};

const LogicGatesGame = ({ config, onSolve, onError }) => {
  const [current, setCurrent] = useState(0);
  const task = config.scenarios[current];

  const handleSelect = (gate) => {
    if (gate === task.answer) {
      playSound('success');
      if (current + 1 === config.scenarios.length) onSolve();
      else setCurrent(prev => prev + 1);
    } else {
      onError();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex items-center gap-6 bg-black/40 p-8 rounded-3xl border border-white/5">
        <div className="flex flex-col items-center gap-2">
           <div className="text-[10px] text-zinc-500">IN A</div>
           <div className={`text-xl font-black ${task.a ? 'text-indigo-400' : 'text-zinc-700'}`}>{task.a ? '1' : '0'}</div>
        </div>
        <div className="w-12 h-px bg-white/10" />
        <div className="w-20 h-20 rounded-2xl border-2 border-indigo-500/50 flex items-center justify-center text-2xl font-black text-indigo-400">?</div>
        <div className="w-12 h-px bg-white/10" />
        <div className="flex flex-col items-center gap-2">
           <div className="text-[10px] text-zinc-500">OUT</div>
           <div className={`text-xl font-black ${task.out ? 'text-emerald-400' : 'text-zinc-700'}`}>{task.out ? '1' : '0'}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['AND', 'OR', 'XOR'].map(gate => (
          <button key={gate} onClick={() => handleSelect(gate)} className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-black text-xs hover:bg-indigo-600 transition-all uppercase tracking-widest">{gate}</button>
        ))}
      </div>
      {task.b !== undefined && (
        <div className="flex flex-col items-center gap-2">
           <div className="text-[10px] text-zinc-500">IN B</div>
           <div className={`text-xl font-black ${task.b ? 'text-purple-400' : 'text-zinc-700'}`}>{task.b ? '1' : '0'}</div>
        </div>
      )}
    </div>
  );
};

const FrequencyMesh = ({ freq, amp }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let t = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      const step = 20;
      for (let x = 0; x <= canvas.width; x += step) {
        for (let y = 0; y <= canvas.height; y += step) {
          const dx = x - canvas.width / 2;
          const dy = y - canvas.height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offset = Math.sin(dist / 30 - t * freq) * amp;
          
          if (y === 0) ctx.moveTo(x, y + offset);
          else ctx.lineTo(x, y + offset);
        }
      }
      ctx.stroke();
      t += 0.05;
      frame = requestAnimationFrame(draw);
    };
    
    draw();
    return () => cancelAnimationFrame(frame);
  }, [freq, amp]);
  
  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full opacity-30 pointer-events-none" />;
};

function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('enigma_welcomed');
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);

  // --- NEW FEATURES STATES ---
  const [gameMode, setGameMode] = useState('history'); // 'history' | 'survival'
  const [isHardcore, setIsHardcore] = useState(false);
  const [ambianceActive, setAmbianceActive] = useState(false);
  const [survivalState, setSurvivalState] = useState({ lives: 3, score: 0, level: 1, puzzleIdx: 0, timeLeft: 15 });
  const [speedrunTimer, setSpeedrunTimer] = useState(0);


  // Helper to find the next level in the same logical category sequence
  const getNextLevelIdx = useCallback((currentIdx) => {
    const p = PUZZLES[currentIdx];
    if (!p) return -1;
    const currentCategory = p.category || 'critical';
    let nextIdx = currentIdx + 1;
    while (nextIdx < PUZZLES.length) {
      const nextCat = PUZZLES[nextIdx].category || 'critical';
      if (nextCat === currentCategory) return nextIdx;
      nextIdx++;
    }
    return -1;
  }, []);

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('enigma_unlocked');
    const recreationalIndices = PUZZLES.map((p, i) => p.category === 'recreational' ? i : null).filter(i => i !== null);
    if (saved) {
      const parsed = JSON.parse(saved);
      return [...new Set([...parsed, ...recreationalIndices])];
    }
    return [0, ...recreationalIndices];
  });
  const [solvedLevels, setSolvedLevels] = useState(() => {
    const saved = localStorage.getItem('enigma_solved');
    return saved ? JSON.parse(saved) : [];
  });
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('enigma_score');
    return saved ? parseInt(saved) : 0;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('enigma_theme') || 'default');
  const [bgColorIdx, setBgColorIdx] = useState(() => parseInt(localStorage.getItem('enigma_bg_color')) || 1);
  const [track, setTrack] = useState(0);
  const [fxMode, setFxMode] = useState(0);
  const [activeTab, setActiveTab] = useState('puzzles'); // 'puzzles' | 'map' | 'categories'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeCityId, setActiveCityId] = useState(() => localStorage.getItem('enigma_active_city') || 'london');
  const [unlockedCities, setUnlockedCities] = useState(() => {
    const saved = localStorage.getItem('enigma_unlocked_cities');
    return saved ? JSON.parse(saved) : ['london'];
  });
  const [hackedCities, setHackedCities] = useState(() => {
    const saved = localStorage.getItem('enigma_hacked_cities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('enigma_theme', theme);
    localStorage.setItem('enigma_bg_color', bgColorIdx.toString());
    localStorage.setItem('enigma_hacked_cities', JSON.stringify(hackedCities));
    localStorage.setItem('enigma_unlocked_cities', JSON.stringify(unlockedCities));
    localStorage.setItem('enigma_active_city', activeCityId);
  }, [theme, bgColorIdx, hackedCities, unlockedCities, activeCityId]);

  useEffect(() => {
    playAmbianceTrack(track);
  }, [track]);

  // Combined theme class for the root container
  const themeClass = theme === 'neon' ? 'theme-neon' : theme === 'ghost' ? 'theme-ghost' : '';

  const [playerAchievements, setPlayerAchievements] = useState(() => {
    const saved = localStorage.getItem('enigma_achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [errorTrigger, setErrorTrigger] = useState(0);
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);

  const activeCity = WORLD_NODES.find(c => c.id === activeCityId) || WORLD_NODES[0];
  const cityPuzzles = PUZZLES.filter(p => activeCity.puzzleIds.includes(p.id));
    
  const activePuzzle = gameMode === 'survival' 
    ? (PUZZLES[survivalState.puzzleIdx] || PUZZLES[0]) 
    : (PUZZLES[currentLevel] || PUZZLES[0]);
    
  const isSolved = gameMode === 'survival' ? false : solvedLevels.includes(currentLevel);
  const showSuccess = gameMode === 'history' ? (isSolved && !isReplaying) : false;
  const nextIdxToPlay = getNextLevelIdx(currentLevel);

  // Auto-hack city if all puzzles solved
  useEffect(() => {
    if (activeCity && !hackedCities.includes(activeCity.id)) {
      const allDone = activeCity.puzzleIds.every(id => {
        const idx = PUZZLES.findIndex(p => p.id === id);
        return solvedLevels.includes(idx);
      });
      if (allDone) {
        setHackedCities(prev => [...new Set([...prev, activeCity.id])]);
        setUnlockedCities(prev => [...new Set([...prev, ...activeCity.unlocks])]);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, [solvedLevels, activeCity, hackedCities]);

  // Speedrun Timer Logic
  useEffect(() => {
    let t;
    if (gameMode === 'history' && !showSuccess) {
      t = setInterval(() => setSpeedrunTimer(ms => ms + 100), 100);
    }
    return () => clearInterval(t);
  }, [gameMode, showSuccess]);

  const formatTime = (ms) => {
    const m = Math.floor(ms / 60000).toString().padStart(2, '0');
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const dec = Math.floor((ms % 1000) / 100).toString();
    return `${m}:${s}.${dec}`;
  };

  // Survival Mode Logic
  useEffect(() => {
    if (gameMode !== 'survival' || showSuccess) return;
    const t = setInterval(() => {
      setSurvivalState(s => {
        if (s.timeLeft <= 1) {
          playSound('error');
          setErrorTrigger(prev => prev + 1);
          setTimeout(() => setErrorTrigger(0), 400);
          return { ...s, lives: s.lives - 1, timeLeft: Math.max(5, 15 - Math.floor(s.level / 2)) };
        }
        return { ...s, timeLeft: s.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameMode, showSuccess]);

  useEffect(() => {
    if (survivalState.lives <= 0 && gameMode === 'survival') {
       playSound('error');
       alert(`!SISTEMA COMPROMETIDO!\n\nPuntaje Final de Supervivencia: ${survivalState.score}\nNiveles Superados: ${survivalState.level - 1}\n\nProtocolo Histórico Restaurado.`);
       setGameMode('history');
       setSurvivalState({ lives: 3, score: 0, level: 1, puzzleIdx: 0, timeLeft: 15 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survivalState.lives, gameMode]);

  // Random System Anomalies
  useEffect(() => {
    const triggerAnomaly = () => {
      if (Math.random() > 0.8 && !showSuccess) {
        setIsAnomaly(true);
        if(!ambianceActive) playSound('error');
        setTimeout(() => setIsAnomaly(false), 1500);
      }
    };
    const interval = setInterval(triggerAnomaly, 5000);
    return () => clearInterval(interval);
  }, [showSuccess, ambianceActive]);

  useEffect(() => {
    localStorage.setItem('enigma_unlocked', JSON.stringify(unlockedLevels));
    localStorage.setItem('enigma_solved', JSON.stringify(solvedLevels));
    localStorage.setItem('enigma_score', score.toString());
    localStorage.setItem('enigma_achievements', JSON.stringify(playerAchievements));
  }, [unlockedLevels, solvedLevels, score, playerAchievements]);

  const handleSolve = useCallback(() => {
    if (gameMode === 'survival') {
      playSound('success');
      setScore(s => s + activePuzzle.points); // Also give global points
      setSurvivalState(s => ({
         ...s,
         score: s.score + activePuzzle.points,
         level: s.level + 1,
         puzzleIdx: Math.floor(Math.random() * PUZZLES.length),
         timeLeft: Math.max(5, 15 - Math.floor(s.level / 2))
      }));
      return;
    }

    playSound('success');
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#10b981']
    });

    setIsReplaying(false);

    setSolvedLevels(prev => {
      if (prev.includes(currentLevel)) return prev;
      
      const newSolved = [...prev, currentLevel];
      
      // Update score and achievements only if not already solved
      setScore(s => {
        const newScore = s + activePuzzle.points;
        
        // Final achievements check
        setPlayerAchievements(ach => {
          const newAchievements = [...ach];
          if (newAchievements.length === 0) newAchievements.push('first_solve');
          if (activePuzzle.id === 4 && !newAchievements.includes('hacker_rank')) newAchievements.push('hacker_rank');
          if (newScore >= 1500 && !newAchievements.includes('data_miner')) newAchievements.push('data_miner');
          return [...new Set(newAchievements)];
        });
        
        return newScore;
      });

      return newSolved;
    });

    // Ensure the next level in the same category is unlocked immediately
    const nextLvl = getNextLevelIdx(currentLevel);
    if (nextLvl !== -1) {
      setUnlockedLevels(prev => prev.includes(nextLvl) ? prev : [...prev, nextLvl]);
    }
  }, [gameMode, activePuzzle, currentLevel]);

  const handleError = useCallback(() => {
    playSound('error');
    setErrorTrigger(prev => prev + 1);
    // Reset trigger after animation to allow repeated shakes
    setTimeout(() => setErrorTrigger(0), 400);
  }, []);

  const handleNextLevel = () => {
    const nextIdx = getNextLevelIdx(currentLevel);
    if (nextIdx !== -1) {
      setCurrentLevel(nextIdx);
      setIsReplaying(false);
      if (!unlockedLevels.includes(nextIdx)) setUnlockedLevels([...unlockedLevels, nextIdx]);
    }
  };

  return (
    <>
      {showWelcome && (
        <WelcomeScreen onEnter={() => {
          sessionStorage.setItem('enigma_welcomed', 'true');
          setShowWelcome(false);
        }} />
      )}
      
      <div className={`min-h-screen main-container ${fxMode >= 1 ? 'crt-screen' : ''} ${fxMode >= 5 ? 'color-distort' : ''} bg-base-${bgColorIdx} text-zinc-100 p-4 md:p-10 selection:bg-indigo-500/30 overflow-y-auto relative no-select transition-all duration-700 ${themeClass}`}>
        {/* Background Effect */}
        <div className="fixed inset-0 cyber-grid opacity-[0.15] pointer-events-none" />
        
        {/* FX LAYERS */}
        {fxMode >= 2 && <div className="vignette-layer" />}
        {fxMode >= 3 && <div className="noise-layer" />}
        {fxMode >= 4 && <div className="scanline-active-layer" />}
        
        {/* Premium Visual Overlays */}
        <div className="fixed inset-0 crt-overlay opacity-[0.03] z-50 pointer-events-none" />
        <div className="fixed inset-0 scanline z-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-0">
          
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveTab('puzzles')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeTab === 'puzzles' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
            >
              <Terminal className="w-4 h-4" /> NODES_INTERFACE
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeTab === 'map' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
            >
              <Globe className="w-4 h-4" /> GLOBAL_MAP
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeTab === 'categories' ? 'bg-cyan-600 text-white shadow-[0_0_20px_#06b6d4]' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
            >
              <LayoutGrid className="w-4 h-4" /> CATEGORIES
            </button>
          </div>

          <header className="flex flex-col lg:flex-row justify-between items-center mb-8 lg:mb-16 gap-6 glass-card p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem]">
            <div className="flex items-center justify-between w-full lg:w-auto gap-8">
              <div className="flex items-center gap-4 lg:gap-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(99,102,241,0.4)]">
                  <Cpu className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-4xl font-black tracking-tighter leading-none italic text-glow">ENIGMA_OS</h1>
                  <p className="text-[8px] lg:text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] mt-1 lg:mt-2">Neural_Interface_v4.0.2</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-4 lg:gap-8 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
              <div className="flex gap-2">
                 <button onClick={() => setTrack(prev => (prev + 1) % 6)} className={`px-4 py-2 text-[8px] font-black rounded-xl border transition-all ${track > 0 ? 'bg-indigo-600 border-indigo-500 shadow-xl text-white' : 'bg-white/5 border-white/10 text-zinc-600'}`}>
                   MÚSICA: {track === 0 ? 'OFF' : track === 5 ? 'CATCHY_DANCE' : `TRACK_0${track}`}
                 </button>
                 
                 <button onClick={() => setFxMode(prev => (prev + 1) % 6)} className={`px-4 py-2 text-[8px] font-black rounded-xl border transition-all ${fxMode > 0 ? 'bg-red-600 border-red-500 shadow-xl text-white animate-pulse' : 'bg-white/5 border-white/10 text-zinc-600'}`}>
                   SISTEMA_FX: {fxMode === 0 ? 'CLEAN' : `LEVEL_0${fxMode}`}
                 </button>
                 
                 <button onClick={() => {
                   if (gameMode === 'survival') setGameMode('history');
                   else {
                     setGameMode('survival');
                     setSurvivalState({ lives: 3, score: 0, level: 1, puzzleIdx: Math.floor(Math.random() * PUZZLES.length), timeLeft: 15 });
                   }
                 }} className={`px-4 py-2 text-[8px] font-black rounded-xl border transition-all ${gameMode === 'survival' ? 'bg-emerald-600 border-emerald-500 shadow-[0_0_15px_#10b981] text-white' : 'bg-white/5 border-white/10 text-zinc-600'}`}>SUPERVIVENCIA</button>
              </div>
              <button 
                title="Cambiar Tema" 
                onClick={() => {
                  const themes = ['default', 'neon', 'ghost'];
                  const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
                  setTheme(themes[nextIdx]);
                }} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/10"
              >
                <PaintBucket className="w-5 h-5" />
              </button>

              <button 
                title="Cambiar Color de Fondo" 
                onClick={() => setBgColorIdx(prev => (prev % 20) + 1)} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/10"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <StatBox label={gameMode === 'survival' ? 'SURVIVAL_SCORE' : 'SCORE'} value={gameMode === 'survival' ? survivalState.score : score} color={theme === 'neon' ? 'text-fuchsia-400' : theme === 'ghost' ? 'text-green-400' : 'text-indigo-400'} />
              <StatBox label="NODES" value={`${playerAchievements.length}/${ACHIEVEMENTS.length}`} color={theme === 'neon' ? 'text-pink-400' : theme === 'ghost' ? 'text-sky-400' : 'text-emerald-400'} />
              
              <button title="Reset All" onClick={() => { if(window.confirm('¿Resetear sistema?')) localStorage.clear(); window.location.reload(); }} className="p-3 hover:bg-red-500/10 rounded-xl text-zinc-700 hover:text-red-500 transition-all border border-white/5">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {activeTab === 'puzzles' ? (
              <>
                <aside className={`lg:col-span-3 space-y-8 lg:space-y-12 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
                  <section>
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3">
                      <Grid className="w-3 h-3" /> {activeCity.name}_PROTOCOLS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                      {cityPuzzles.map((p) => {
                        const globalIdx = PUZZLES.indexOf(p);
                        return (
                          <LevelTab
                            key={p.id}
                            title={p.title}
                            id={p.id}
                            active={activePuzzle.id === p.id}
                            locked={!unlockedLevels.includes(globalIdx)}
                            solved={solvedLevels.includes(globalIdx)}
                            onClick={() => {
                              setCurrentLevel(globalIdx);
                              setIsReplaying(false);
                              setSidebarOpen(false);
                            }}
                          />
                        );
                      })}
                    </div>
                  </section>

                  <section className="pt-8 border-t border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-8">NÚCLEOS_DESBLOQUEADOS</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {ACHIEVEMENTS.map(acc => {
                        const Icon = acc.id === 'first_solve' ? Zap :
                                     acc.id === 'perfect_memory' ? Brain :
                                     acc.id === 'hacker_rank' ? Terminal : Database;
                        return (
                          <div
                            key={acc.id}
                            title={`${acc.title}: ${acc.description}`}
                            className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${
                              playerAchievements.includes(acc.id)
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                              : 'bg-white/5 border-transparent text-zinc-800'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </aside>

                <main className="lg:col-span-9">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentLevel}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="relative flex-1"
                    >
                      <motion.div
                        key={`shake-layer-${errorTrigger}`}
                        variants={shake}
                        animate={errorTrigger > 0 ? "error" : ""}
                        className="glass-card rounded-[2.5rem] md:rounded-[4rem] p-6 sm:p-10 md:p-16 relative overflow-hidden min-h-[500px] md:min-h-[650px] flex flex-col"
                      >
                        <div className="relative z-10 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 mb-10 w-full flex-wrap">
                            <Badge text={activePuzzle.difficulty} color={activePuzzle.difficulty === 'DIOS' ? 'text-red-500 animate-pulse' : activePuzzle.difficulty === 'Difícil' ? 'text-amber-500' : 'text-zinc-500'} />
                            <Badge text={`${activePuzzle.points} MB`} color="text-indigo-400" />

                            {gameMode === 'survival' ? (
                              <div className="flex gap-4 ml-auto">
                                <Badge text={`NIVEL ${survivalState.level}`} color="text-fuchsia-400" />
                                <Badge text={`VIDAS ${survivalState.lives}`} color="text-red-500" />
                                <div className="text-3xl font-black text-red-500 animate-pulse bg-black/60 border border-red-500/30 px-6 py-2 rounded-xl shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]">
                                  00:{survivalState.timeLeft.toString().padStart(2, '0')}
                                </div>
                              </div>
                            ) : (
                              <div className="ml-auto font-mono text-xl lg:text-3xl text-indigo-400 tracking-widest bg-black/40 px-6 py-2 rounded-xl border border-white/5">
                                {formatTime(speedrunTimer)}
                              </div>
                            )}
                          </div>

                          <h2 className={`text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter leading-none italic ${isAnomaly || isHardcore ? 'hardcore-glitch text-white' : 'text-glow'} ${isHardcore && !isAnomaly && 'text-red-200'} `}>
                            {isAnomaly ? 'ERR_BUFFER_OVERFLOW' : activePuzzle.title}
                          </h2>
                          <p className={`text-base sm:text-xl max-w-2xl leading-relaxed mb-8 md:mb-16 ${isHardcore && 'uppercase tracking-widest font-mono text-[10px] text-zinc-500'}`}>
                            {isAnomaly ? 'Fallo en la matriz de aislamiento. Restableciendo conexión remota...' : activePuzzle.description}
                          </p>

                          <div className={`flex-1 bg-white/[0.02] border rounded-[1.5rem] md:rounded-[3rem] flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden transition-all duration-300 ${isAnomaly ? 'border-red-500/50 bg-red-500/5 shake-heavy' : 'border-white/5'}`}>
                            <AnimatePresence mode="wait">
                              {!showSuccess ? (
                                <motion.div
                                  key="game"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="w-full h-full flex items-center justify-center overflow-y-auto"
                                >
                                  {activePuzzle.type === 'sequence' && <MemoryGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'cipher' && <CipherGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'logic' && <LogicGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'terminal' && <TerminalGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'maze' && <MazeGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'sync' && <SyncGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'firewall' && <FirewallGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'command' && <CommandGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'boss' && <BossGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'lightsout' && <LightsOutGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'sliders' && <SlidersGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'reaction' && <ReactionGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'orbital' && <OrbitalGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'wave' && <WaveGame config={activePuzzle.config} onSolve={handleSolve} />}

                                  {/* RECREATIONAL */}
                                  {activePuzzle.type === 'parity' && <ParityGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'wordfind' && <WordFindGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'quickmath' && <QuickMathGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'colormatch' && <ColorMatchGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'intruder' && <IntruderGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'tapper' && <TapperGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'flash' && <FlashGame config={activePuzzle.config} onSolve={handleSolve} onError={handleError} />}
                                  {activePuzzle.type === 'order' && <OrderGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'echo' && <EchoGame config={activePuzzle.config} onSolve={handleSolve} />}
                                  {activePuzzle.type === 'captcha' && <CaptchaGame config={activePuzzle.config} onSolve={handleSolve} />}

                                  <ExtraPuzzlesRenderer activePuzzle={activePuzzle} onSolve={handleSolve} onError={handleError} />
                                  <FunGamesRenderer activePuzzle={activePuzzle} onSolve={handleSolve} onError={handleError} />
                                  <MapGamesRenderer activePuzzle={activePuzzle} onSolve={handleSolve} onError={handleError} />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="success"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="text-center"
                                >
                                  <div className="w-20 h-20 md:w-32 md:h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10 ring-1 ring-emerald-500/40">
                                    <Trophy className="w-10 h-10 md:w-16 md:h-16 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]" />
                                  </div>
                                  <h3 className="text-3xl md:text-5xl font-black text-emerald-400 mb-4 md:mb-6 tracking-tighter">ACCESO_PERMITIDO</h3>
                                  <p className="text-zinc-600 text-sm md:text-lg mb-8 md:mb-12 font-bold uppercase tracking-widest italic">Signal integrity: 100%</p>

                                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                      onClick={() => setIsReplaying(true)}
                                      className="px-6 md:px-10 py-4 md:py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl md:rounded-3xl font-black text-[8px] md:text-[10px] tracking-[0.3em] transition-all uppercase"
                                    >
                                      Volver a jugar
                                    </button>
                                    {nextIdxToPlay !== -1 && (
                                      <button
                                        onClick={handleNextLevel}
                                        className="group cyber-btn-hover inline-flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/50 rounded-2xl md:rounded-3xl font-black text-[8px] md:text-[10px] tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)] uppercase text-white"
                                      >
                                        Siguiente <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </main>
              </>
            ) : activeTab === 'map' ? (
              <div className="lg:col-span-12 glass-card rounded-[2.5rem] p-4 md:p-8 min-h-[500px] md:min-h-[600px] relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                       <path d="M10,30 Q20,20 30,30 T50,30 T70,20 T90,30" fill="none" stroke="currentColor" strokeWidth="0.1" />
                       <path d="M5,50 Q25,40 45,50 T85,45" fill="none" stroke="currentColor" strokeWidth="0.1" />
                    </svg>
                 </div>

                 <div className="relative h-full flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                      <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-glow">GLOBAL_NETWORK_MAP</h2>
                      <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                         <p className="text-[10px] font-black tracking-widest text-zinc-500">NODOS_ASEGURADOS:</p>
                         <p className="text-xl font-bold text-indigo-400">{unlockedCities.length}/{WORLD_NODES.length}</p>
                      </div>
                    </div>

                    <div className="flex-1 relative bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden touch-none" style={{ minHeight: '400px' }}>
                      {WORLD_NODES.map(node => {
                        const isUnlocked = unlockedCities.includes(node.id);
                        const isActive = activeCityId === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => isUnlocked && handleCitySelect(node.id)}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                              isActive ? 'w-12 h-12 md:w-16 md:h-16 bg-indigo-500 border-white shadow-[0_0_30px_#6366f1] z-20 scale-110' :
                              isUnlocked ? 'w-10 h-10 md:w-12 md:h-12 bg-zinc-900 border-indigo-500/50 hover:scale-110 z-10' : 
                              'w-8 h-8 md:w-10 md:h-10 bg-black/60 border-white/5 opacity-50 cursor-not-allowed'
                            }`}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                          >
                            {isActive ? <Zap className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" /> : 
                             isUnlocked ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" /> : 
                             <Lock className="w-3 h-3 md:w-4 md:h-4 text-zinc-700" />}
                            
                            <div className={`absolute top-full mt-4 bg-black/80 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 pointer-events-none whitespace-nowrap transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                              <p className="text-[8px] font-black text-indigo-400 tracking-widest">{node.name}</p>
                              <p className="text-[10px] font-bold text-white uppercase">{node.difficulty}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                 </div>
              </div>
            ) : (
              <div className="lg:col-span-12 glass-card rounded-[2.5rem] p-8 md:p-12 min-h-[600px]">
                 <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                      <h2 className="text-4xl font-black italic text-glow mb-4">CATEGORÍAS_DATA_STREAM</h2>
                      <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase">FILTRA TUS DESAFÍOS POR NÚCLEO OPERATIVO</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                      {CATEGORIES.map(cat => (
                        <CategoryCard key={cat.id} cat={cat} onClick={(c) => {
                          setSelectedCategory(c);
                          setActiveTab('puzzles');
                        }} />
                      ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const StatBox = ({ label, value, color }) => (
  <div className="text-right">
    <p className="text-[8px] md:text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1 md:mb-2">{label}</p>
    <p className={`text-xl md:text-3xl font-black ${color} tracking-tighter`}>{value}</p>
  </div>
);

const Badge = ({ text, color = "text-zinc-500" }) => (
  <span className={`px-3 md:px-5 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-tighter ${color} flex items-center gap-2`}>
    <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-current`} /> {text}
  </span>
);

const LevelTab = ({ title, id, active, locked, solved, onClick }) => (
  <button
    onClick={onClick}
    disabled={locked}
    className={`group relative w-full p-5 md:p-7 rounded-[1.8rem] md:rounded-[2.5rem] flex items-center gap-5 border transition-all duration-700 ${
      active 
      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
    } ${locked ? 'opacity-30 grayscale' : 'cursor-pointer'}`}
  >
    {/* Animated background on active */}
    {active && (
      <motion.div 
        layoutId="activeTabBg"
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent rounded-[inherit] -z-10"
      />
    )}

    <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black/40 text-zinc-600'
    }`}>
      {locked ? <Lock className="w-5 h-5" /> : active ? <Zap className="w-6 h-6 animate-pulse" /> : <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />}
      
      {/* Small corner detail */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 rounded-tr-lg ${active ? 'border-white/40' : 'border-zinc-800'}`} />
    </div>

    <div className="flex-1 text-left">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[7px] font-black tracking-[0.3em] uppercase ${active ? 'text-indigo-400' : 'text-zinc-700'}`}>STREAM_DATA_0{id}</span>
        {solved && <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />}
      </div>
      <h4 className={`font-black text-xs md:text-sm tracking-tight transition-colors ${active ? 'text-white text-glow' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
        {title.toUpperCase()}
      </h4>
    </div>

    {active && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
    )}
  </button>
);

export default App;
