
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '../types';

interface ChickenProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
  t: any;
}

const Chicken: React.FC<ChickenProps> = ({ user, updateBalance, addBet, t }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'crashed' | 'won'>('betting');
  const [currentLane, setCurrentLane] = useState(-1);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [collisionActive, setCollisionActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const totalLanes = 9;

  const multipliers = useMemo(() => {
    switch (difficulty) {
      case 'easy': return [1.15, 1.35, 1.65, 2.05, 2.65, 3.55, 5.00, 7.50, 12.00];
      case 'medium': return [1.50, 2.80, 5.20, 10.50, 22.00, 48.00, 110.00, 280.00, 750.00];
      case 'hard': return [4.00, 20.00, 110.00, 650.00, 4200.00, 28000.00, 190000.00, 1400000.00, 12000000.00];
      default: return [1.2, 1.5, 2.0, 3.0, 5.0, 8.0, 15.0, 30.0, 100.0];
    }
  }, [difficulty]);

  const handleStart = () => {
    if (user.bal < betAmount || betAmount <= 0) return alert("Insufficient balance!");
    updateBalance(-betAmount);
    setGameState('playing');
    setCurrentLane(-1);
    setCollisionActive(false);
  };

  const handleJump = () => {
    if (gameState !== 'playing' || isAdvancing) return;
    
    setIsAdvancing(true);
    const nextLane = currentLane + 1;

    const probabilities = { easy: 0.86, medium: 0.62, hard: 0.30 };
    const successChance = probabilities[difficulty];
    const isSuccess = Math.random() < successChance;

    // Movement Timing
    setTimeout(() => {
      if (isSuccess) {
        setCurrentLane(nextLane);
        if (nextLane === totalLanes - 1) {
          setGameState('won');
          const finalMulti = multipliers[totalLanes - 1];
          const payout = Math.floor(betAmount * finalMulti);
          updateBalance(payout);
          addBet('Chicken', betAmount, finalMulti, payout);
        }
      } else {
        setCurrentLane(nextLane);
        setCollisionActive(true);
        setTimeout(() => {
          setGameState('crashed');
          addBet('Chicken', betAmount, 0, 0);
        }, 350);
      }
      setIsAdvancing(false);
    }, 200);
  };

  const handleCashout = () => {
    if (gameState !== 'playing' || currentLane === -1 || isAdvancing) return;
    const multi = multipliers[currentLane];
    const payout = Math.floor(betAmount * multi);
    updateBalance(payout);
    addBet('Chicken', betAmount, multi, payout);
    setGameState('betting');
  };

  return (
    <div className="max-w-full mx-auto flex flex-col lg:flex-row gap-6 animate-slide-up pb-10 relative">
      {/* Premium Side Terminal */}
      <div className="w-full lg:w-[320px] shrink-0 bg-[#0f141e] rounded-[2rem] p-6 border border-white/5 shadow-2xl flex flex-col gap-6 relative">
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-[#b1bad3] transition-all z-20"
        >
          <i className="fas fa-info"></i>
        </button>

        {showHelp && (
          <div className="absolute top-12 left-6 right-6 bg-[#213743] p-6 rounded-3xl border border-[#00e701]/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-[#00e701] text-xs uppercase tracking-widest">How to Play</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#b1bad3] hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-[11px] text-[#b1bad3] leading-relaxed">
              DASH across the lanes to increase your multiplier. Each lane jump is a risk—if a car hits the chicken, you lose your bet. You can cash out after any successful jump.
            </p>
          </div>
        )}

        <div className="flex bg-[#070b12] rounded-xl p-1 shadow-inner">
          <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg bg-[#213743] text-white">Manual</button>
          <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg text-[#b1bad3] hover:text-white transition-all">Auto</button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5 px-1">
              <label className="text-[10px] font-black text-[#b1bad3] uppercase tracking-widest">Wager</label>
              <span className="text-[10px] font-bold text-white/10 tracking-tighter">${user.bal.toLocaleString()}</span>
            </div>
            <div className="bg-[#213743] p-3.5 rounded-xl border-2 border-transparent focus-within:border-[#00e701]/30 transition-all flex items-center gap-3">
               <input 
                 type="number" 
                 value={betAmount} 
                 onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                 disabled={gameState === 'playing'}
                 className="flex-1 bg-transparent text-white font-black text-lg outline-none"
               />
               <div className="flex gap-1 border-l border-[#3b596d] pl-3">
                 <button onClick={() => setBetAmount(Math.max(0, Math.floor(betAmount/2)))} className="px-2 py-1 rounded-md bg-[#2f4553] text-[9px] font-black hover:bg-[#3b596d]">1/2</button>
                 <button onClick={() => setBetAmount(betAmount*2)} className="px-2 py-1 rounded-md bg-[#2f4553] text-[9px] font-black hover:bg-[#3b596d]">2x</button>
               </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-[#b1bad3] uppercase tracking-widest mb-1.5 px-1 block">Traffic Intensity</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as any)}
              disabled={gameState === 'playing'}
              className="w-full bg-[#213743] border-2 border-transparent rounded-xl p-4 text-xs font-black text-white appearance-none cursor-pointer outline-none hover:bg-[#2f4553] transition-all shadow-md"
            >
              <option value="easy">{t.easy.toUpperCase()}</option>
              <option value="medium">{t.medium.toUpperCase()}</option>
              <option value="hard">{t.hard.toUpperCase()}</option>
            </select>
          </div>

          <div className="pt-2">
            {gameState === 'betting' || gameState === 'won' || gameState === 'crashed' ? (
              <button 
                onClick={handleStart}
                className="w-full py-5 bg-[#00e701] text-black rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(0,231,1,0.2)] hover:bg-[#1fff20] hover:scale-[1.01] transition-all active:scale-[0.98] uppercase italic"
              >
                Launch Bet
              </button>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={handleJump}
                  disabled={isAdvancing}
                  className="w-full py-5 bg-[#00e701] text-black rounded-2xl font-black text-xl shadow-lg hover:bg-[#1fff20] transition-all active:scale-[0.95] flex items-center justify-center gap-3"
                >
                  {isAdvancing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fa-solid fa-arrow-right"></i>}
                  DASH
                </button>
                <button 
                  onClick={handleCashout}
                  disabled={currentLane === -1 || isAdvancing}
                  className="w-full py-4 bg-[#2f4553] text-white rounded-xl font-bold text-xs hover:bg-[#3b596d] transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-money-bill-transfer opacity-40"></i>
                  CASHOUT
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[#213743] space-y-4">
           <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-[#b1bad3] uppercase tracking-widest">Multiplier</span>
              <span className="text-xl font-black text-white italic">{currentLane === -1 ? '1.00' : multipliers[currentLane].toFixed(2)}x</span>
           </div>
           <div className="bg-[#070b12] p-4 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Return</span>
                 <span className="text-lg font-black text-[#00e701] tabular-nums">
                    ${currentLane === -1 ? '0.00' : (betAmount * multipliers[currentLane]).toLocaleString()}
                 </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 text-xl opacity-60">
                 <i className="fa-brands fa-bitcoin"></i>
              </div>
           </div>
        </div>
      </div>

      {/* HORIZONTAL 3D HIGHWAY ARENA */}
      <div className={`flex-1 bg-[#0b0e14] rounded-[2.5rem] border border-white/5 relative overflow-hidden min-h-[600px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col ${collisionActive ? 'animate-shake' : ''}`}>
        
        {/* Environmental Top UI (Status) */}
        <div className="h-16 bg-[#12161f]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10 relative z-20">
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                 {[0,1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${gameState === 'playing' ? 'bg-[#00e701] animate-pulse' : 'bg-white/10'}`}></div>)}
              </div>
              <span className="text-[10px] font-black text-[#b1bad3] uppercase tracking-[0.3em]">Network Active</span>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                 <i className="fa-solid fa-flag-checkered text-emerald-500 opacity-40"></i>
                 <span className="text-[10px] font-black text-[#b1bad3] uppercase tracking-widest">Goal Zone 09</span>
              </div>
           </div>
        </div>

        {/* 3D Road Perspective Wrapper */}
        <div className="flex-1 relative perspective-[1200px] flex items-center justify-center overflow-hidden">
           
           {/* Asphalt Highway Base */}
           <div className="absolute inset-x-0 inset-y-12 bg-[#0d1017] rotate-x-[35deg] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col justify-between py-2 border-y-4 border-white/5">
              
              {/* Lane Markings */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, #fff 95%)', backgroundSize: '12% 100%' }}></div>
              
              {/* Central Dash Lines */}
              <div className="h-full w-full flex items-center px-4 overflow-hidden opacity-5">
                 {Array.from({length: 40}).map((_, i) => <div key={i} className="min-w-[40px] h-[2px] bg-white mx-4 rounded-full"></div>)}
              </div>
           </div>

           {/* The Lanes and Multipliers */}
           <div className="w-full h-full relative z-10 flex items-center px-12 md:px-24 justify-between gap-2">
              
              {/* Start/Buffer Zone */}
              <div className="w-24 h-48 shrink-0 relative flex items-center justify-center">
                 {currentLane === -1 && (
                    <div className="relative group animate-hop-static">
                       <div className="w-16 h-16 bg-[#00e701] rounded-2xl border-b-4 border-emerald-800 shadow-2xl flex items-center justify-center text-[#1a2c38]">
                          <i className="fa-solid fa-kiwi-bird text-3xl"></i>
                       </div>
                       <div className="absolute -inset-2 border-2 border-[#00e701]/20 rounded-3xl animate-pulse"></div>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#00e701] uppercase tracking-[0.3em]">Ready</div>
                    </div>
                 )}
                 <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/5"></div>
              </div>

              {/* Road Lanes */}
              {multipliers.map((m, i) => (
                 <div key={i} className="flex-1 h-full relative flex flex-col items-center justify-center group">
                    
                    {/* Lane Highlighting */}
                    <div className={`absolute inset-x-0.5 inset-y-16 rounded-3xl border transition-all duration-500 ${
                       i === currentLane 
                        ? 'bg-[#00e701]/10 border-[#00e701]/30 shadow-[inset_0_0_30px_rgba(0,231,1,0.05)]' 
                        : i < currentLane 
                          ? 'bg-white/[0.02] border-emerald-500/10 opacity-30' 
                          : 'bg-white/[0.01] border-white/5'
                    }`}></div>

                    {/* Multiplier Tag */}
                    <div className={`absolute top-20 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border shadow-lg z-20 ${
                       i === currentLane 
                        ? 'bg-white text-black scale-110 border-white shadow-[0_10px_30px_rgba(255,255,255,0.2)]' 
                        : i < currentLane
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                          : 'bg-[#1a2c38] text-[#b1bad3] border-white/5'
                    }`}>
                       {m.toFixed(2)}x
                    </div>

                    {/* Collision Animation (Vertical coming from top) */}
                    {collisionActive && i === currentLane && (
                       <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center z-40 overflow-hidden">
                          <div className="w-16 h-32 bg-[#ff3333] rounded-2xl border-2 border-white/10 shadow-[0_0_50px_rgba(255,51,51,0.3)] animate-car-crash flex flex-col items-center justify-center gap-4 text-white">
                             <i className="fa-solid fa-car rotate-180 text-3xl"></i>
                             <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_#fde047]"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_#fde047]"></div>
                             </div>
                          </div>
                       </div>
                    )}

                    {/* The Player Chicken */}
                    {i === currentLane && !collisionActive && (
                       <div className={`relative z-30 transition-all duration-300 ${isAdvancing ? 'scale-90 opacity-80' : 'scale-125'}`}>
                          <div className="w-16 h-16 bg-[#00e701] rounded-[20px] border-b-[6px] border-emerald-800 flex items-center justify-center text-[#1a2c38] shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-hop">
                             <i className="fa-solid fa-kiwi-bird text-3xl"></i>
                          </div>
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-md rounded-full"></div>
                       </div>
                    )}

                    {/* Lane Label */}
                    <div className="absolute bottom-20 text-[20px] font-black text-white/[0.02] italic tracking-tighter uppercase whitespace-nowrap">
                       LANE-0{i + 1}
                    </div>
                 </div>
              ))}

              {/* Goal Area */}
              <div className="w-24 h-48 shrink-0 flex items-center justify-center relative">
                 <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/5"></div>
                 <div className="w-12 h-12 bg-[#00e701]/5 rounded-xl border border-[#00e701]/20 flex items-center justify-center text-[#00e701]/20">
                    <i className="fa-solid fa-crown text-xl"></i>
                 </div>
              </div>
           </div>
        </div>

        {/* Dynamic Overlays */}
        {gameState === 'crashed' && (
           <div className="absolute inset-0 bg-[#070b12]/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center animate-fade-in">
              <div className="w-40 h-40 bg-rose-500/10 rounded-full flex items-center justify-center text-7xl text-rose-500 border-4 border-rose-500/20 shadow-[0_0_60px_rgba(244,63,94,0.3)] mb-8">
                 <i className="fa-solid fa-car-burst animate-pulse"></i>
              </div>
              <h3 className="text-8xl font-black italic tracking-tighter text-rose-500 uppercase drop-shadow-2xl">BUSTED</h3>
              <p className="text-[#8b8ea8] text-xs mt-4 font-black uppercase tracking-[0.5em] opacity-50">Fatal Impact Registered</p>
              <button 
               onClick={() => { setGameState('betting'); setCollisionActive(false); }}
               className="mt-12 px-10 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white"
              >
                Re-Deploy
              </button>
           </div>
        )}

        {gameState === 'won' && (
           <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-xl z-[100] flex flex-col items-center justify-center animate-fade-in">
              <div className="w-48 h-48 bg-[#00e701] rounded-[40px] flex items-center justify-center text-black text-[100px] shadow-[0_0_120px_rgba(0,231,1,0.5)] transform rotate-12 mb-10">
                 <i className="fa-solid fa-trophy"></i>
              </div>
              <h3 className="text-8xl font-black italic tracking-tighter text-white uppercase drop-shadow-2xl">Z-LIMIT</h3>
              <div className="text-4xl font-black text-[#00e701] mt-8 italic tabular-nums">
                 ${(betAmount * multipliers[totalLanes-1]).toLocaleString()}
              </div>
              <button 
               onClick={() => setGameState('betting')}
               className="mt-16 px-16 py-5 bg-[#00e701] text-black rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Withdraw
              </button>
           </div>
        )}

        {/* Decorative Ambient Lines */}
        <div className="absolute bottom-6 right-10 flex items-center gap-6 opacity-20 pointer-events-none z-10">
           <div className="h-[1px] w-24 bg-white/20"></div>
           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#b1bad3]">System Matrix v4.0.1</span>
        </div>
      </div>

      <style>{`
        @keyframes hop {
          0%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
          50% { transform: translateY(-40px) scaleX(1.1) scaleY(0.9); }
          95% { transform: translateY(0) scaleX(1.1) scaleY(0.9); }
        }
        .animate-hop { animation: hop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes hop-static {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-hop-static { animation: hop-static 2s ease-in-out infinite; }

        @keyframes car-crash {
          from { transform: translateY(-1000px); }
          to { transform: translateY(0); }
        }
        .animate-car-crash { animation: car-crash 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes fade-in {
          from { opacity: 0; backdrop-filter: blur(0px); transform: scale(1.05); }
          to { opacity: 1; backdrop-filter: blur(24px); transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes shake {
          0%, 100% { transform: translate(0,0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 2px); }
          20%, 40%, 60%, 80% { transform: translate(4px, -2px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default Chicken;
