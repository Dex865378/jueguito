import { useState, useEffect, useCallback, useRef } from 'react';

const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  if (type === 'success') { osc.type='sine'; osc.frequency.setValueAtTime(587,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.1); gain.gain.setValueAtTime(0.1,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.3); osc.start(); osc.stop(ctx.currentTime+0.3); }
  else if (type === 'click') { osc.type='square'; osc.frequency.setValueAtTime(1200,ctx.currentTime); gain.gain.setValueAtTime(0.02,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.05); osc.start(); osc.stop(ctx.currentTime+0.05); }
};

/* 1. EMOJI MEMORY PAIRS */
const EmojiPairsGame = ({ config, onSolve }) => {
  const emojis = config.emojis || ['🧠','💀','🔮','⚡','🎯','🛸'];
  // eslint-disable-next-line no-unused-vars
  const [cards, setCards] = useState(() => {
    const d = [...emojis, ...emojis];
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
    return d;
  });
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        const next = [...matched, a, b];
        setMatched(next);
        if (next.length === cards.length) setTimeout(onSolve, 400);
      }
      setTimeout(() => setFlipped([]), 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  const flip = (i) => {
    if (flipped.length >= 2 || flipped.includes(i) || matched.includes(i)) return;
    playSound('click');
    setFlipped([...flipped, i]);
  };

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {cards.map((e, i) => (
        <button key={i} onClick={() => flip(i)}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl text-xl sm:text-2xl flex items-center justify-center transition-all duration-300 border ${
            matched.includes(i) ? 'bg-emerald-500/20 border-emerald-500/50 scale-95' :
            flipped.includes(i) ? 'bg-purple-500/20 border-purple-500/50 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}>
          {flipped.includes(i) || matched.includes(i) ? e : '?'}
        </button>
      ))}
    </div>
  );
};

/* 2. WHACK-A-MOLE */
const WhackMoleGame = ({ config, onSolve }) => {
  const target = config.target || 5;
  const [active, setActive] = useState(-1);
  const [hits, setHits] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(Math.floor(Math.random() * 9)), 800);
    return () => clearInterval(t);
  }, []);

  const whack = (i) => {
    if (i === active) {
      playSound('click');
      const n = hits + 1;
      setHits(n);
      setActive(-1);
      if (n >= target) onSolve();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm font-black text-zinc-500 uppercase tracking-widest">{hits}/{target} IMPACTOS</div>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {Array.from({length: 9}).map((_, i) => (
          <button key={i} onClick={() => whack(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-2xl sm:text-3xl flex items-center justify-center transition-all duration-150 border ${
              i === active ? 'bg-red-500/30 border-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-white/5 border-white/10'
            }`}>
            {i === active ? '👾' : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

/* 3. TYPING RACE */
const TypingRaceGame = ({ config, onSolve }) => {
  const word = config.word || 'ENIGMA';
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-1 md:gap-2 flex-wrap justify-center">
        {word.split('').map((ch, i) => (
          <div key={i} className={`w-10 h-10 sm:w-12 sm:h-14 rounded-lg border flex items-center justify-center font-mono text-lg sm:text-2xl font-black transition-all ${
            input[i] === ch ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
            input[i] && input[i] !== ch ? 'bg-red-500/20 border-red-500 text-red-400' :
            'bg-white/5 border-white/10 text-zinc-600'
          }`}>{input[i] || ch}</div>
        ))}
      </div>
      <input autoFocus type="text" maxLength={word.length}
        value={input} onChange={(e) => { const v = e.target.value.toUpperCase(); setInput(v); if (v === word) onSolve(); }}
        className="bg-black/40 border border-white/20 p-4 rounded-xl text-center font-mono text-xl tracking-widest w-64 outline-none focus:border-purple-500"
        placeholder="Escribe aquí..." />
    </div>
  );
};

/* 4. COIN FLIP */
const CoinFlipGame = ({ config, onSolve, onError }) => {
  const streak = config.streak || 3;
  const [wins, setWins] = useState(0);
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);

  const flip = (guess) => {
    if (flipping) return;
    setFlipping(true);
    playSound('click');
    setTimeout(() => {
      const coin = Math.random() > 0.5 ? 'cara' : 'cruz';
      setResult(coin);
      if (guess === coin) {
        const n = wins + 1;
        setWins(n);
        if (n >= streak) setTimeout(onSolve, 300);
      } else { setWins(0); onError(); }
      setFlipping(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-5xl transition-all duration-500 ${
        flipping ? 'animate-spin border-purple-500' : result === 'cara' ? 'border-amber-500 bg-amber-500/10' : result === 'cruz' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/20 bg-white/5'
      }`}>{result === 'cara' ? '👑' : result === 'cruz' ? '✦' : '🪙'}</div>
      <div className="text-sm font-black text-zinc-500 tracking-widest">RACHA: {wins}/{streak}</div>
      <div className="flex gap-4">
        <button onClick={() => flip('cara')} className="px-8 py-4 bg-amber-500/10 border border-amber-500/50 rounded-2xl font-black hover:bg-amber-500/20 transition-all">👑 CARA</button>
        <button onClick={() => flip('cruz')} className="px-8 py-4 bg-indigo-500/10 border border-indigo-500/50 rounded-2xl font-black hover:bg-indigo-500/20 transition-all">✦ CRUZ</button>
      </div>
    </div>
  );
};

/* 5. ROCK PAPER SCISSORS */
const RPSGame = ({ config, onSolve, onError }) => {
  const streak = config.streak || 2;
  const [wins, setWins] = useState(0);
  const [aiChoice, setAiChoice] = useState(null);
  const choices = ['🪨', '📄', '✂️'];
  const names = ['piedra', 'papel', 'tijera'];

  const play = (pIdx) => {
    playSound('click');
    // eslint-disable-next-line react-hooks/purity
    const ai = Math.floor(Math.random() * 3);
    setAiChoice(ai);
    if (pIdx === ai) return; // draw
    if ((pIdx + 1) % 3 === ai) { setWins(0); onError(); }
    else { const n = wins + 1; setWins(n); if (n >= streak) setTimeout(onSolve, 300); }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {aiChoice !== null && (
        <div className="text-center">
          <div className="text-5xl mb-2">{choices[aiChoice]}</div>
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">IA eligió {names[aiChoice]}</div>
        </div>
      )}
      <div className="text-sm font-black text-zinc-500 tracking-widest">VICTORIAS: {wins}/{streak}</div>
      <div className="flex gap-4">
        {choices.map((c, i) => (
          <button key={i} onClick={() => play(i)} className="text-4xl p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-500/10 hover:border-purple-500/30 hover:scale-110 transition-all">{c}</button>
        ))}
      </div>
    </div>
  );
};

/* 6. SPOT THE DIFFERENCE */
const SpotDiffGame = ({ config, onSolve, onError }) => {
  const emoji = config.emoji || '🔮';
  const odd = config.odd || '🔵';
  const pos = config.oddPos || 5;
  const grid = Array(9).fill(emoji);
  grid[pos] = odd;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">ENCUENTRA AL INTRUSO</div>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {grid.map((e, i) => (
          <button key={i} onClick={() => i === pos ? onSolve() : onError()}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-2xl sm:text-3xl flex items-center justify-center bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all hover:scale-105">{e}</button>
        ))}
      </div>
    </div>
  );
};

/* 7. SPEED CLICK */
const SpeedClickGame = ({ config, onSolve }) => {
  const target = config.target || 20;
  const timeLimit = config.time || 5;
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) { setStarted(false); setCount(0); setTimeLeft(timeLimit); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, timeLeft]);

  const click = () => {
    if (!started) { setStarted(true); setCount(1); return; }
    const n = count + 1;
    setCount(n);
    if (n >= target) onSolve();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {started && <div className="text-4xl font-black text-red-500 animate-pulse">{timeLeft}s</div>}
      <button onClick={click}
        className="w-40 h-40 rounded-full border-4 border-purple-500/50 bg-purple-500/10 flex items-center justify-center flex-col gap-2 hover:bg-purple-500/20 active:scale-90 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <span className="text-5xl font-black text-purple-400">{count}</span>
        <span className="text-[8px] font-black text-zinc-500 tracking-widest">{!started ? 'INICIAR' : `META: ${target}`}</span>
      </button>
    </div>
  );
};

/* 8. WORD SCRAMBLE */
const WordScrambleGame = ({ config, onSolve }) => {
  const word = config.word || 'NEXUS';
  const [shuffled] = useState(() => word.split('').sort(() => Math.random() - 0.5).join(''));
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-2">
        {shuffled.split('').map((ch, i) => (
          <div key={i} className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl font-black text-purple-400">{ch}</div>
        ))}
      </div>
      <input autoFocus type="text" maxLength={word.length}
        value={input} onChange={(e) => { const v = e.target.value.toUpperCase(); setInput(v); if (v === word) onSolve(); }}
        className="bg-black/40 border border-white/20 p-4 rounded-xl text-center font-mono text-xl tracking-widest w-64 outline-none focus:border-purple-500"
        placeholder="Descifra..." />
    </div>
  );
};

/* 9. TRIVIA */
const TriviaGame = ({ config, onSolve, onError }) => {
  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 max-w-full md:max-w-md">
      <div className="text-lg md:text-xl font-black text-center leading-tight md:leading-relaxed px-2">{config.question}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 w-full px-4 sm:px-0">
        {config.options.map((opt, i) => (
          <button key={i} onClick={() => opt === config.answer ? onSolve() : onError()}
            className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-purple-500/10 hover:border-purple-500/30 transition-all">{opt}</button>
        ))}
      </div>
    </div>
  );
};

/* 10. DICE ROLL */
const DiceRollGame = ({ config, onSolve, onError }) => {
  const target = config.target || 7;
  const [dice, setDice] = useState([0, 0]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    playSound('click');
    let count = 0;
    const t = setInterval(() => {
      setDice([Math.floor(Math.random()*6)+1, Math.floor(Math.random()*6)+1]);
      count++;
      if (count >= 10) {
        clearInterval(t);
        const d1 = Math.floor(Math.random()*6)+1;
        const d2 = Math.floor(Math.random()*6)+1;
        setDice([d1, d2]);
        setRolling(false);
        if (d1 + d2 === target) setTimeout(onSolve, 300);
        else onError();
      }
    }, 80);
  };

  const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-sm font-black text-zinc-500 tracking-widest">OBJETIVO: SUMA = {target}</div>
      <div className="flex gap-4 md:gap-6">
        {dice.map((d, i) => (
          <div key={i} className={`text-4xl sm:text-6xl p-3 sm:p-4 rounded-2xl border transition-all ${rolling ? 'animate-bounce border-purple-500' : 'border-white/20'}`}>{d > 0 ? faces[d-1] : '🎲'}</div>
        ))}
      </div>
      <div className="text-xl sm:text-2xl font-black text-purple-400">{dice[0]+dice[1] > 0 ? `= ${dice[0]+dice[1]}` : ''}</div>
      <button onClick={roll} className="px-8 sm:px-10 py-3 sm:py-4 bg-purple-600/20 border border-purple-500/50 rounded-2xl font-black tracking-widest hover:bg-purple-600/40 transition-all active:scale-95">🎲 LANZAR</button>
    </div>
  );
};

/* 11. COLOR GUESSER */
const ColorGuessGame = ({ config, onSolve, onError }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-32 h-32 rounded-3xl border border-white/10 shadow-xl" style={{ backgroundColor: config.hex }} />
      <div className="text-sm font-black text-zinc-500">¿Qué color es este?</div>
      <div className="flex flex-wrap gap-3 justify-center">
        {config.options.map((opt, i) => (
          <button key={i} onClick={() => opt === config.answer ? onSolve() : onError()}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-sm hover:bg-purple-500/10 hover:border-purple-500/30 transition-all">{opt}</button>
        ))}
      </div>
    </div>
  );
};

/* 12. BOMB TIMER - Click before it explodes */
const BombTimerGame = ({ config, onSolve, onError }) => {
  const min = config.min || 3;
  const max = config.max || 7;
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTimer(prev => {
      const next = +(prev + 0.1).toFixed(1);
      if (next >= max) { setExploded(true); setRunning(false); onError(); clearInterval(t); }
      return next;
    }), 100);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleClick = () => {
    if (exploded) return;
    if (!running) { setRunning(true); setTimer(0); setExploded(false); return; }
    setRunning(false);
    if (timer >= min && timer <= max) onSolve();
    else { onError(); setTimer(0); }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm font-black text-zinc-500 tracking-widest">DESACTIVA ENTRE {min}s Y {max}s</div>
      <button onClick={handleClick}
        className={`w-40 h-40 rounded-full flex items-center justify-center flex-col gap-2 border-4 transition-all ${
          exploded ? 'bg-red-500/30 border-red-500 shake-heavy' :
          running ? 'bg-amber-500/10 border-amber-500 animate-pulse' : 'bg-white/5 border-white/20 hover:bg-purple-500/10'
        }`}>
        <span className="text-4xl">{exploded ? '💥' : running ? '💣' : '🔘'}</span>
        <span className="text-2xl font-mono font-black">{timer.toFixed(1)}s</span>
      </button>
    </div>
  );
};

/* 13. PATTERN REPEAT - Watch and click the same pattern */
const PatternRepeatGame = ({ config, onSolve, onError }) => {
  const len = config.length || 4;
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [activeCell, setActiveCell] = useState(-1);
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-indigo-500'];

  const startGame = useCallback(async () => {
    const pat = Array.from({length: len}, () => Math.floor(Math.random() * 9));
    setPattern(pat);
    setUserPattern([]);
    setPhase('showing');
    for (const cell of pat) {
      await new Promise(r => setTimeout(r, 500));
      setActiveCell(cell);
      await new Promise(r => setTimeout(r, 400));
      setActiveCell(-1);
    }
    setPhase('input');
  }, [len]);

  const handleClick = (i) => {
    if (phase !== 'input') return;
    playSound('click');
    const next = [...userPattern, i];
    setUserPattern(next);
    const idx = next.length - 1;
    if (next[idx] !== pattern[idx]) { onError(); setPhase('idle'); setUserPattern([]); return; }
    if (next.length === pattern.length) onSolve();
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <div className="text-[10px] sm:text-sm font-black text-zinc-500 tracking-widest uppercase">{phase === 'showing' ? 'OBSERVA...' : phase === 'input' ? 'REPITE' : 'LISTO?'}</div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({length: 9}).map((_, i) => (
          <button key={i} onClick={() => handleClick(i)} disabled={phase !== 'input'}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl transition-all duration-200 border ${
              activeCell === i ? `${colors[i]} border-white scale-110 shadow-lg` : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`} />
        ))}
      </div>
      {phase === 'idle' && <button onClick={startGame} className="px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600/20 border border-purple-500/50 rounded-xl font-black text-[10px] sm:text-sm tracking-widest hover:bg-purple-600/40 transition-all uppercase">COMENZAR</button>}
    </div>
  );
};

/* 14. EMOJI MATH */
const EmojiMathGame = ({ config, onSolve, onError }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-2xl sm:text-3xl font-black">{config.equation}</div>
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {config.options.map((opt, i) => (
          <button key={i} onClick={() => opt === config.answer ? onSolve() : onError()}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white/5 border border-white/10 rounded-xl text-xl sm:text-2xl font-black hover:bg-purple-500/10 hover:border-purple-500/30 transition-all">{opt}</button>
        ))}
      </div>
    </div>
  );
};

/* 15. TOWER STACK - Stack blocks by clicking at the right time */
const TowerStackGame = ({ config, onSolve, onError }) => {
  const target = config.target || 5;
  const [blocks, setBlocks] = useState([]);
  const [pos, setPos] = useState(0);
  const dirRef = useRef(1);

  useEffect(() => {
    const t = setInterval(() => {
      setPos(p => { 
        const next = p + dirRef.current * 4;
        if (next >= 200 || next <= 0) dirRef.current *= -1;
        return Math.max(0, Math.min(200, next));
      });
    }, 30);
    return () => clearInterval(t);
  }, []);

  const stack = () => {
    playSound('click');
    const goodZone = pos >= 80 && pos <= 120;
    if (goodZone) {
      const next = [...blocks, pos];
      setBlocks(next);
      if (next.length >= target) setTimeout(onSolve, 300);
    } else {
      setBlocks([]);
      if (onError) onError();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm font-black text-zinc-500 tracking-widest">BLOQUES: {blocks.length}/{target}</div>
      <div className="relative w-52 h-8 bg-white/5 border border-white/10 rounded-full overflow-hidden">
        <div className="absolute top-0 h-full bg-emerald-500/20 border-x border-emerald-500/50" style={{ left: '38%', width: '24%' }} />
        <div className="absolute top-1 h-6 w-4 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7] transition-none" style={{ left: `${(pos/200)*100}%` }} />
      </div>
      <div className="flex gap-1 h-24 items-end">
        {blocks.map((_, i) => (
          <div key={i} className="w-8 bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-md" style={{ height: `${(i+1)*16}px` }} />
        ))}
      </div>
      <button onClick={stack} className="px-10 py-4 bg-purple-600/20 border border-purple-500/50 rounded-2xl font-black tracking-widest hover:bg-purple-600/40 active:scale-95 transition-all">APILAR</button>
    </div>
  );
};

/* RENDERER */
export const FunGamesRenderer = ({ activePuzzle, onSolve, onError }) => {
  const p = activePuzzle;
  return (
    <>
      {p.type === 'emoji_pairs' && <EmojiPairsGame config={p.config} onSolve={onSolve} />}
      {p.type === 'whack_mole' && <WhackMoleGame config={p.config} onSolve={onSolve} />}
      {p.type === 'typing_race' && <TypingRaceGame config={p.config} onSolve={onSolve} />}
      {p.type === 'coin_flip' && <CoinFlipGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'rps' && <RPSGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'spot_diff' && <SpotDiffGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'speed_click' && <SpeedClickGame config={p.config} onSolve={onSolve} />}
      {p.type === 'word_scramble' && <WordScrambleGame config={p.config} onSolve={onSolve} />}
      {p.type === 'trivia' && <TriviaGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'dice_roll' && <DiceRollGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'color_guess' && <ColorGuessGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'bomb_timer' && <BombTimerGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'pattern_repeat' && <PatternRepeatGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'emoji_math' && <EmojiMathGame config={p.config} onSolve={onSolve} onError={onError} />}
      {p.type === 'tower_stack' && <TowerStackGame config={p.config} onSolve={onSolve} onError={onError} />}
    </>
  );
};
