
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface BloxRunProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const BloxRun: React.FC<BloxRunProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'overload'>('idle');
  const [multi, setMulti] = useState(1.0);
  const [distance, setDistance] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRun = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient Balance!");
    updateBalance(-bet);
    setGameState('running');
    setMulti(1.0);
    setDistance(0);
    startTimeRef.current = Date.now();
    
    // Provably fair overload point
    const overloadPoint = 0.99 / (1 - Math.random());
    
    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentMulti = Math.pow(1.08, elapsed);
      
      if (currentMulti >= overloadPoint) {
        setGameState('overload');
        addBet('BloxRun', bet, 0, 0);
        if (timerRef.current) cancelAnimationFrame(timerRef.current);
      } else {
        setMulti(currentMulti);
        setDistance(elapsed * 100);
        timerRef.current = requestAnimationFrame(tick);
      }
    };
    
    timerRef.current = requestAnimationFrame(tick);
  };

  const cashout = () => {
    if (gameState !== 'running') return;
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    
    const payout = Math.floor(bet * multi);
    updateBalance(payout);
    addBet('BloxRun', bet, multi, payout);
    setHighScore(Math.max(highScore, multi));
    setGameState('idle');
  };

  useEffect(() => {
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[64px] border border-cyan-500/10 p-12 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col justify-between">
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="absolute top-10 right-10 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm text-[#4b5563] transition-all z-20"
        >
          <i className="fas fa-info"></i>
        </button>

        {showHelp && (
          <div className="absolute top-24 left-12 right-12 bg-[#161930] p-8 rounded-[40px] border border-cyan-500/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-cyan-400 text-lg uppercase tracking-widest italic">Operations Guide</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times text-xl"></i></button>
            </div>
            <p className="text-sm text-[#8b8ea8] leading-relaxed mb-4">
              Blox Run is a high-speed survival race. As you run, your win multiplier increases exponentially.
            </p>
            <ul className="text-xs text-[#8b8ea8] space-y-3 list-disc pl-5 font-bold">
               <li>Place your wager and initiate the run.</li>
               <li>Watch the multiplier climb—it increases by 8% every second!</li>
               <li>"BANK" your winnings before the system overloads (crashes).</li>
               <li>If the system overloads before you bank, your wager is lost.</li>
            </ul>
          </div>
        )}

        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="flex h-full w-full">
              {Array.from({length: 20}).map((_, i) => (
                <div key={i} className="flex-1 border-r border-cyan-500/20 relative">
                   {gameState === 'running' && (
                     <div className="absolute top-0 w-full h-full bg-cyan-500/10 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                   )}
                </div>
              ))}
           </div>
        </div>

        <div className="relative z-10 flex justify-between items-start">
           <div>
              <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-2">Exclusive Terminal</div>
              <h2 className="text-4xl font-black tracking-tighter italic">BLOX <span className="text-cyan-400">RUN</span></h2>
           </div>
           <div className="text-right pr-14">
              <div className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest mb-1">Session Best</div>
              <div className="text-2xl font-black text-white">{highScore.toFixed(2)}x</div>
           </div>
        </div>

        <div className="relative z-10 text-center py-20">
           <div className={`text-[120px] font-black tracking-tighter leading-none transition-all duration-75 ${gameState === 'overload' ? 'text-rose-500 blur-sm scale-110' : 'text-white'}`}>
             {multi.toFixed(2)}<span className="text-cyan-400">x</span>
           </div>
           {gameState === 'overload' && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-rose-500 text-white px-10 py-3 rounded-full font-black text-2xl uppercase italic shadow-2xl shadow-rose-500/40">SYSTEM OVERLOAD</div>
             </div>
           )}
           <div className="mt-8 h-2 max-w-md mx-auto bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-cyan-500 transition-all duration-75" style={{ width: `${(distance % 100)}%` }}></div>
           </div>
           <div className="mt-4 text-[10px] font-black text-cyan-400 uppercase tracking-[0.6em]">Propelling at 88% Capacity</div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#060812] p-6 rounded-[32px] border border-white/5">
              <label className="text-[9px] font-black text-[#4b5563] uppercase mb-2 block">Investment</label>
              <div className="flex items-center gap-3">
                 <span className="text-cyan-400 font-black">$</span>
                 <input 
                   type="number" value={bet} onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
                   disabled={gameState === 'running'}
                   className="bg-transparent text-white font-black text-2xl outline-none w-full"
                 />
              </div>
           </div>

           <div className="md:col-span-2">
              {gameState === 'running' ? (
                <button 
                  onClick={cashout}
                  className="w-full h-full py-6 bg-cyan-400 text-black rounded-[32px] font-black text-2xl shadow-2xl shadow-cyan-400/30 hover:bg-white transition-all active:scale-95"
                >
                  BANK ${Math.floor(bet * multi).toLocaleString()}
                </button>
              ) : (
                <button 
                  onClick={startRun}
                  className="w-full h-full py-6 bg-white text-black rounded-[32px] font-black text-2xl shadow-xl hover:bg-cyan-400 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  <i className="fas fa-bolt text-cyan-500"></i>
                  {gameState === 'overload' ? 'RE-INITIATE' : 'INITIATE RUN'}
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BloxRun;
