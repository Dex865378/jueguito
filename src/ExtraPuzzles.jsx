import { useState, useEffect } from 'react';
import { Zap, Shield, Cpu, Lock } from 'lucide-react';

const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  if (type === 'click') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.start(); osc.stop(ctx.currentTime + 0.05);
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  }
};

const BinaryFlipGame = ({ config, onSolve }) => {
  const [bits, setBits] = useState(new Array(config.bits).fill(0));
  const currentVal = bits.reduce((acc, bit, idx) => acc + (bit ? Math.pow(2, config.bits - 1 - idx) : 0), 0);
  
  const toggle = (idx) => {
    playSound('click');
    const b = [...bits]; b[idx] = b[idx] === 0 ? 1 : 0;
    setBits(b);
    if (b.reduce((acc, bit, i) => acc + (bit ? Math.pow(2, config.bits - 1 - i) : 0), 0) === config.target) onSolve();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-4xl font-mono text-glow text-white">{currentVal} <span className="text-sm text-zinc-500">/ {config.target}</span></div>
      <div className="flex gap-2">
        {bits.map((b, i) => (
          <button key={i} onClick={() => toggle(i)} className={`w-12 h-16 border rounded-xl font-bold font-mono text-xl transition-all ${b ? 'glass-card border-indigo-500 shadow-[0_0_15px_#6366f1] text-white' : 'bg-white/5 border-white/10 text-zinc-600'}`}>{b}</button>
        ))}
      </div>
    </div>
  );
};

const ColorMixerGame = ({ config, onSolve }) => {
  const [r, setR] = useState(0); const [g, setG] = useState(0); const [b, setB] = useState(0);
  useEffect(() => {
    if(Math.abs(r - config.r) <= config.tolerance && Math.abs(g - config.g) <= config.tolerance && Math.abs(b - config.b) <= config.tolerance) onSolve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r, g, b]);
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm glass-card p-8 rounded-[2rem]">
      <div className="w-full h-24 rounded-2xl mb-4 border border-white/10 shadow-lg" style={{ backgroundColor: `rgb(${r},${g},${b})` }} />
      {[ {val:r, set:setR, c:'accent-red-500', t:'R'}, {val:g, set:setG, c:'accent-emerald-500', t:'G'}, {val:b, set:setB, c:'accent-blue-500', t:'B'} ].map((x,i)=>(
        <div key={i} className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-black text-zinc-500"><span>{x.t}</span><span className="text-white">{x.val}</span></div>
          <input type="range" min="0" max="255" value={x.val} onChange={e=>{playSound('click'); x.set(parseInt(e.target.value));}} className={`w-full h-2 bg-white/10 rounded-lg appearance-none ${x.c}`} />
        </div>
      ))}
    </div>
  );
};

const SafeCrackGame = ({ config, onSolve }) => {
  const [val, setVal] = useState(0);
  const [step, setStep] = useState(0);
  const handleVal = (v) => {
    setVal(v);
    if (v === config.sequence[step]) {
      playSound('click');
      if (step + 1 === config.sequence.length) onSolve();
      else setStep(s => s + 1);
    }
  };
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-6xl font-mono glass-card p-8 rounded-full w-48 h-48 flex items-center justify-center border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] text-emerald-400">
        {val}
      </div>
      <input type="range" min="0" max="100" value={val} onChange={e=>handleVal(parseInt(e.target.value))} className="w-full max-w-sm h-3 bg-white/10 rounded-lg appearance-none accent-zinc-300" />
      <div className="flex gap-4">
        {config.sequence.map((x,i)=>( <div key={i} className={`w-3 h-3 rounded-full ${i < step ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-white/10'}`} /> ))}
      </div>
    </div>
  );
};

const MemoryGridGame = ({ config, onSolve, onError }) => {
  const [show, setShow] = useState(true);
  const [selected, setSelected] = useState([]);
  
  useEffect(() => { const t = setTimeout(()=>setShow(false), 2000); return ()=>clearTimeout(t); }, []);
  
  const clickNode = (idx) => {
    if (show) return;
    if (!config.active.includes(idx)) { onError(); setSelected([]); setShow(true); setTimeout(()=>setShow(false), 2000); return; }
    playSound('click');
    const next = [...selected, idx]; setSelected(next);
    if (next.length === config.active.length) onSolve();
  };

  return (
    <div className="grid grid-cols-4 gap-2 glass-card p-4 rounded-3xl">
      {Array.from({length: config.size * config.size}).map((_, i) => (
        <button key={i} onClick={()=>clickNode(i)} className={`w-14 h-14 rounded-xl transition-all duration-300 ${ (show && config.active.includes(i)) || selected.includes(i) ? 'bg-indigo-500 shadow-[0_0_15px_#6366f1]' : 'bg-white/5 border border-white/10 hover:bg-white/10' }`} />
      ))}
    </div>
  );
};

const TimingBarGame = ({ config, onSolve, onError }) => {
  const [val, setVal] = useState(0);
  const [dir, setDir] = useState(1);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(()=>setVal(v => {
      let next = v + dir * 2;
      if (next >= 100) { setDir(-1); return 100; }
      if (next <= 0) { setDir(1); return 0; }
      return next;
    }), 20);
    return ()=>clearInterval(t);
  }, [dir, active]);

  const stop = () => {
    setActive(false);
    if (val >= config.min && val <= config.max) onSolve();
    else { onError(); setTimeout(()=>{setActive(true); setVal(0); setDir(1);}, 1000); }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-sm">
      <div className="relative w-full h-12 bg-black/40 border border-white/10 rounded-full overflow-hidden">
        <div className="absolute top-0 bottom-0 bg-emerald-500/20 border-x-2 border-emerald-500" style={{ left: `${config.min}%`, right: `${100-config.max}%` }} />
        <div className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_15px_#fff]" style={{ left: `${val}%` }} />
      </div>
      <button onClick={stop} className="px-12 py-5 bg-indigo-600 text-white font-black tracking-[0.3em] rounded-3xl cyber-btn-hover shadow-xl uppercase text-xs">A T E R R I Z A R</button>
    </div>
  );
};

const WordGuessGame = ({ config, onSolve, onError }) => {
  const [guess, setGuess] = useState('');
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        {Array.from({length: config.answer.length}).map((_, i) => (
          <div key={i} className="w-14 h-16 border border-white/20 glass-card rounded-xl text-3xl font-black flex items-center justify-center font-mono">
            {guess[i] || ''}
          </div>
        ))}
      </div>
      <input type="text" maxLength={config.answer.length} value={guess} onChange={e => {
        const val = e.target.value.toUpperCase(); setGuess(val);
        if (val === config.answer) onSolve();
        else if (val.length === config.answer.length) { onError(); setTimeout(()=>setGuess(''), 500); }
      }} className="bg-transparent border-b-2 border-indigo-500/50 text-white text-center font-mono focus:outline-none p-2 w-48 uppercase" autoFocus placeholder="TYPE..." />
    </div>
  );
};

const ArrowSeqGame = ({ config, onSolve, onError }) => {
  const [step, setStep] = useState(0);
  useEffect(()=>{
    const handle = (e) => {
      const keys = {ArrowUp:'UP', ArrowDown:'DOWN', ArrowLeft:'LEFT', ArrowRight:'RIGHT'};
      if (!keys[e.key]) return;
      if (keys[e.key] === config.seq[step]) { playSound('click'); if(step+1 === config.seq.length) onSolve(); else setStep(s=>s+1); }
      else { onError(); setStep(0); }
    };
    window.addEventListener('keydown', handle); return ()=>window.removeEventListener('keydown', handle);
  }, [step, config, onSolve, onError]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4">
        {config.seq.map((s, i) => (
          <div key={i} className={`w-12 h-12 rounded-lg border flex items-center justify-center font-black ${i < step ? 'glass-card border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-700'}`}>
            {s==='UP'?'↑':s==='DOWN'?'↓':s==='LEFT'?'←':'→'}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">Usa las flechas del teclado</p>
    </div>
  );
};

const KeypadChaosGame = ({ config, onSolve, onError }) => {
  const [target, setTarget] = useState(1);
  const [grid, setGrid] = useState(() => Array.from({length: config.max}, (_, i) => i + 1).sort(()=>Math.random()-0.5));
  
  const clickNum = (n) => {
    if (n === target) {
      playSound('click');
      if (n === config.max) onSolve();
      else { setTarget(n+1); setGrid([...grid].sort(()=>Math.random()-0.5)); }
    } else { onError(); setTarget(1); setGrid([...grid].sort(()=>Math.random()-0.5)); }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-[10px] font-black text-zinc-500 tracking-[0.3em]">SIGUIENTE NÚMERO: <span className="text-2xl text-white ml-2">{target}</span></div>
      <div className="grid grid-cols-3 gap-2 p-4 glass-card rounded-[2rem]">
        {grid.map((n, i) => (
          <button key={i} onClick={()=>clickNum(n)} className="w-16 h-16 bg-black/40 hover:bg-white/10 border border-white/5 rounded-2xl text-2xl font-black font-mono shadow-inner transition-colors">
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

const MathSumGame = ({ config, onSolve, onError }) => {
  const [sel, setSel] = useState([]);
  
  const clickOpt = (n, i) => {
    if (sel.includes(i)) { setSel(sel.filter(x => x!==i)); return; }
    if (sel.length >= 3) return;
    playSound('click');
    const next = [...sel, i]; setSel(next);
    if (next.length === 3) {
      const sum = next.reduce((acc, idx) => acc + config.choices[idx], 0);
      if (sum === config.target) onSolve();
      else { onError(); setTimeout(()=>setSel([]), 500); }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="flex items-end gap-4 text-glow mb-4">
        <span className="text-6xl font-black font-mono">{sel.reduce((a,i)=>a+config.choices[i],0)}</span>
        <span className="text-xl text-zinc-500 mb-2 font-black font-mono">/ {config.target}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {config.choices.map((n, i) => (
          <button key={i} onClick={()=>clickOpt(n, i)} className={`w-20 h-16 rounded-xl font-bold font-mono text-xl transition-all ${sel.includes(i) ? 'glass-card border-indigo-500 shadow-[0_0_15px_#6366f1] text-white scale-95' : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10'}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

const CryptoSliderGame = ({ config, onSolve }) => {
  const [offset, setOffset] = useState(0);
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const result = config.target.split('').map(c => {
    const idx = alpha.indexOf(c); return idx===-1 ? c : alpha[(idx + offset + 26) % 26];
  }).join('');
  
  return (
    <div className="flex flex-col items-center gap-10 min-w-[300px]">
      <div className={`text-4xl font-mono tracking-[0.3em] ${offset === 0 ? 'text-emerald-400 text-glow-emerald' : 'text-zinc-600'} transition-colors`}>{result}</div>
      <input type="range" min="0" max="25" value={offset} onChange={e=>{playSound('click'); if(parseInt(e.target.value)===0) onSolve(); setOffset(parseInt(e.target.value));}} className="w-full h-2 bg-white/10 rounded-lg appearance-none accent-indigo-500" />
    </div>
  );
};

const WireConnectGame = ({ config, onSolve, onError }) => {
  const [lsel, setLsel] = useState(null);
  const [connected, setConnected] = useState([]);
  
  const clickR = (idx) => {
    if (lsel === null) return;
    if (lsel === idx) { playSound('success'); const next = [...connected, idx]; setConnected(next); if(next.length===config.pairs.length) onSolve(); }
    else { onError(); }
    setLsel(null);
  };

  return (
    <div className="flex justify-between w-full max-w-md gap-10">
      <div className="flex flex-col gap-4 flex-1">
        {config.pairs.map((p, i) => (
          <button key={i} onClick={()=>!connected.includes(i) && setLsel(i)} disabled={connected.includes(i)} className={`p-4 text-xs font-black tracking-widest rounded-xl transition-all border ${connected.includes(i) ? 'glass-card border-emerald-500 text-emerald-400' : lsel===i ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-black/40 border-white/5 text-zinc-500'}`}>{p.split('-')[0]}</button>
        ))}
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {[...config.pairs].map((p, i) => ({p, idx:i})).reverse().map((item) => (
          <button key={item.idx} onClick={()=>!connected.includes(item.idx) && clickR(item.idx)} disabled={connected.includes(item.idx)} className={`p-4 text-xs font-black tracking-[0.2em] rounded-xl transition-all border ${connected.includes(item.idx) ? 'glass-card border-emerald-500 text-emerald-400' : 'bg-black/40 border-white/5 hover:border-white/20 text-zinc-300'}`}>DEST_{item.p.split('-')[1]}</button>
        ))}
      </div>
    </div>
  );
};

const RadarFindGame = ({ config, onSolve, onError }) => {
  const [angle, setAngle] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setAngle(a=>(a+3)%360),30); return ()=>clearInterval(t);},[]);
  const ping = () => { if (Math.abs(angle - config.angle) < 15) onSolve(); else onError(); };
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="w-64 h-64 rounded-full border border-emerald-500/30 glass-card relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10" />
        <div className="absolute inset-0 rounded-full border border-emerald-500/5 m-8" />
        <div className="absolute inset-0 rounded-full border border-emerald-500/5 m-16" />
        <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-emerald-500/80 to-transparent origin-left opacity-60" style={{ transform:`translateY(-50%) rotate(${angle}deg)` }} />
        <div className="w-2 h-2 bg-emerald-400 rounded-full absolute shadow-[0_0_15px_#34d399]" style={{ top:`${50 + Math.sin(config.angle*Math.PI/180)*30}%`, left:`${50 + Math.cos(config.angle*Math.PI/180)*30}%`, opacity: Math.abs(angle-config.angle)<30 ? 1 : 0.1 }} />
      </div>
      <button onClick={ping} className="px-10 py-4 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 font-bold cyber-btn-hover tracking-[0.3em] rounded-full uppercase">ESCANEAR</button>
    </div>
  );
};

const MorseCodeGame = ({ config, onSolve, onError }) => {
  const [seq, setSeq] = useState([]);
  const [t, setT] = useState(0);
  const down = () => setT(Date.now());
  const up = () => {
    const diff = Date.now() - t;
    const type = diff > 300 ? 'L' : 'S';
    playSound('click');
    const next = [...seq, type]; setSeq(next);
    if (next.length === config.target.length) {
      if (next.every((v,i)=>v===config.target[i])) onSolve();
      else { onError(); setTimeout(()=>setSeq([]), 500); }
    }
  };
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex gap-2 mb-8">
        {Array.from({length: config.target.length}).map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded border flex items-center justify-center font-bold ${i < seq.length ? (seq[i]===config.target[i] ? 'bg-indigo-500 text-white' : 'bg-red-500') : 'bg-black/40 border-white/10 text-zinc-600'}`}>{seq[i] || '?'}</div>
        ))}
      </div>
      <button onMouseDown={down} onMouseUp={up} onTouchStart={down} onTouchEnd={up} className="w-32 h-32 rounded-full glass-card border flex items-center justify-center hover:bg-white/5 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.05)] border-white/20">
        <Cpu className="w-12 h-12 text-zinc-400" />
      </button>
      <div className="text-[10px] text-zinc-500 font-black tracking-[0.2em] max-w-[200px] text-center">CORTO: &lt; 300ms<br/>LARGO: &gt; 300ms</div>
    </div>
  );
};

const LaserReflectGame = ({ config, onSolve }) => {
  const [angles, setAngles] = useState([0,0,0]);
  const click = (i) => { playSound('click'); const next=[...angles]; next[i]=(next[i]+45)%360; setAngles(next); if(next.every((v,idx)=>v%180===config.angles[idx]%180)) onSolve(); }
  return (
    <div className="flex items-center justify-center gap-8 glass-card p-12 rounded-[3rem]">
      {angles.map((a,i)=>(
        <button key={i} onClick={()=>click(i)} className="w-16 h-16 rounded-lg border border-white/20 bg-black/40 relative shadow-inner flex items-center justify-center">
          <div className="w-1 h-12 bg-indigo-500 rounded-full transition-transform duration-200" style={{rotate:`${a}deg`}} />
        </button>
      ))}
    </div>
  );
};

const PatternLockGame = ({ config, onSolve, onError }) => {
  const [seq, setSeq] = useState([]);
  const click = (i) => {
    if(seq.includes(i)) return;
    playSound('click');
    const next=[...seq, i]; setSeq(next);
    if(next[next.length-1] !== config.seq[next.length-1]) { onError(); setTimeout(()=>setSeq([]), 400); return; }
    if(next.length === config.seq.length) onSolve();
  }
  return (
    <div className="grid grid-cols-3 gap-6 glass-card p-10 rounded-full relative">
      {Array.from({length: 9}).map((_,i)=>(
        <button key={i} onClick={()=>click(i)} className={`w-12 h-12 rounded-full flex justify-center items-center transition-all ${seq.includes(i) ? 'bg-indigo-500/20 border-2 border-indigo-500 shadow-[0_0_15px_#6366f1]' : 'bg-black/60 border border-white/5 hover:border-white/20'}`}>
          <div className={`w-3 h-3 rounded-full ${seq.includes(i) ? 'bg-indigo-400 w-4 h-4' : 'bg-white/20'}`} />
        </button>
      ))}
    </div>
  );
};

const RiddleGame = ({ config, onSolve, onError }) => {
  const [ans, setAns] = useState('');
  return (
    <div className="flex flex-col items-center gap-8 text-center pt-8">
      <input type="text" value={ans} onChange={(e)=>{
        const v = e.target.value.toUpperCase(); setAns(v);
        if(v === config.answer) onSolve();
        else if (v.length >= config.answer.length + 3) { onError(); setTimeout(()=>setAns(''), 500); }
      }} className="bg-transparent border-b-2 border-white/20 font-mono text-4xl p-4 text-center focus:outline-none focus:border-emerald-500 text-glow" placeholder="TYPE..." />
      <span className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.5em]">Ingreso Semántico Requerido</span>
    </div>
  );
};

const BossPhase2Game = ({ config, onSolve, onError }) => {
  const [states, setStates] = useState([false, false, false]);
  const solveSub = (i) => { const next=[...states]; next[i]=true; setStates(next); if(next.every(v=>v)) onSolve(); }
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className={`p-4 rounded-[2rem] border ${states[0]?'border-emerald-500/50 bg-emerald-500/5':'glass-card'}`}><p className="text-[8px] font-black uppercase text-zinc-500 mb-4 px-2 tracking-[0.3em]">Sobrecarga</p><div className="scale-[0.6] origin-top h-[180px]">{states[0]?<></>:<BinaryFlipGame config={config.subPuzzles[0]} onSolve={()=>solveSub(0)} />}</div></div>
      <div className={`p-4 rounded-[2rem] border ${states[1]?'border-emerald-500/50 bg-emerald-500/5':'glass-card'}`}><p className="text-[8px] font-black uppercase text-zinc-500 mb-4 px-2 tracking-[0.3em]">Diccionario</p><div className="scale-[0.6] origin-top h-[150px]">{states[1]?<></>:<WordGuessGame config={config.subPuzzles[1]} onSolve={()=>solveSub(1)} onError={onError} />}</div></div>
      <div className={`lg:col-span-2 p-4 rounded-[2rem] border ${states[2]?'border-emerald-500/50 bg-emerald-500/5':'glass-card'}`}><p className="text-[8px] font-black uppercase text-zinc-500 px-2 tracking-[0.3em]">Intercepción</p><div className="scale-75 origin-top pt-4 h-[120px] flex justify-center">{states[2]?<></>:<TimingBarGame config={config.subPuzzles[2]} onSolve={()=>solveSub(2)} onError={onError} />}</div></div>
    </div>
  );
};


export const ExtraPuzzlesRenderer = ({ activePuzzle, onSolve, onError }) => {
  switch(activePuzzle.type) {
    case 'binary_flip': return <BinaryFlipGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'color_mixer': return <ColorMixerGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'safe_crack': return <SafeCrackGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'memory_grid': return <MemoryGridGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'timing_bar': return <TimingBarGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'word_guess': return <WordGuessGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'arrow_seq': return <ArrowSeqGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'keypad_chaos': return <KeypadChaosGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'math_sum': return <MathSumGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'crypto_slider': return <CryptoSliderGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'wire_connect': return <WireConnectGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'radar_find': return <RadarFindGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'morse_code': return <MorseCodeGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'laser_reflect': return <LaserReflectGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'pattern_lock': return <PatternLockGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'riddle': return <RiddleGame config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    case 'boss_phase_2': return <BossPhase2Game config={activePuzzle.config} onSolve={onSolve} onError={onError} />;
    default: return null;
  }
};
