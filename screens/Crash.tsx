
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '../types';

interface CrashProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const CYCLE_TIME = 40; // Total cycle in seconds
const BETTING_WINDOW = 15; // 15 seconds to bet

const Crash: React.FC<CrashProps> = ({ user, updateBalance, addBet }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [isAutoCashEnabled, setIsAutoCashEnabled] = useState(false);
  const [isAutoBetEnabled, setIsAutoBetEnabled] = useState(false);
  
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [currentMulti, setCurrentMulti] = useState(1.0);
  const [gameStatus, setGameStatus] = useState<'betting' | 'flying' | 'crashed'>('betting');
  const [timeLeft, setTimeLeft] = useState(0);
  const [crashPoint, setCrashPoint] = useState(1.0);
  const [showHelp, setShowHelp] = useState(false);
  
  // Refs to handle auto-actions without closure stale state issues
  const autoBetAppliedRef = useRef<number>(-1); 
  const [liveCashes, setLiveCashes] = useState<{name: string, multi: number, amt: number}[]>([]);

  const handlePlaceBet = useCallback(() => {
    if (hasBet) return;
    if (user.bal < betAmount || betAmount <= 0) {
      setIsAutoBetEnabled(false); 
      return;
    }
    updateBalance(-betAmount);
    setHasBet(true);
  }, [user.bal, betAmount, hasBet, updateBalance]);

  const triggerCashout = useCallback((multi: number) => {
    if (cashedOut) return;
    const payout = Math.floor(betAmount * multi);
    updateBalance(payout);
    addBet('Crash', betAmount, multi, payout);
    setCashedOut(true);
    setLiveCashes(prev => [{ name: user.display, multi: multi, amt: payout }, ...prev]);
  }, [betAmount, updateBalance, addBet, cashedOut, user.display]);

  const handleManualCashOut = () => {
    if (!hasBet || cashedOut || gameStatus !== 'flying') return;
    triggerCashout(currentMulti);
  };

  // Sync Auto Enter with Auto Cashout
  const toggleAutoCashout = () => {
    const nextState = !isAutoCashEnabled;
    setIsAutoCashEnabled(nextState);
    if (nextState) {
      setIsAutoBetEnabled(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const secondsInCycle = (Math.floor(now / 1000) % CYCLE_TIME);
      const currentRoundId = Math.floor(now / (CYCLE_TIME * 1000));
      
      if (secondsInCycle < BETTING_WINDOW) {
        if (gameStatus !== 'betting') {
          setHasBet(false);
          setCashedOut(false);
          setCurrentMulti(1.0);
          setLiveCashes([]);
          
          const rand = (currentRoundId * 1103515245 + 12345) % 2147483647;
          const cp = Math.max(1, 0.99 / (1 - (rand / 2147483647)));
          setCrashPoint(cp);
          setGameStatus('betting');
        }

        if (isAutoBetEnabled && autoBetAppliedRef.current !== currentRoundId) {
          handlePlaceBet();
          autoBetAppliedRef.current = currentRoundId;
        }

        setTimeLeft(BETTING_WINDOW - secondsInCycle);
      } 
      else {
        const flightDuration = secondsInCycle - BETTING_WINDOW;
        const currentM = Math.pow(Math.E, 0.06 * flightDuration);
        
        if (currentM >= crashPoint) {
          if (gameStatus !== 'crashed') setGameStatus('crashed');
        } else {
          if (gameStatus !== 'flying') setGameStatus('flying');
          setCurrentMulti(currentM);
          
          if (hasBet && !cashedOut && isAutoCashEnabled && currentM >= autoCashout) {
            triggerCashout(currentM);
          }

          if (Math.random() > 0.97) {
            setLiveCashes(prev => [{
              name: `Player_${Math.floor(Math.random() * 9999)}`,
              multi: currentM,
              amt: Math.floor(Math.random() * 200) + 10
            }, ...prev].slice(0, 12));
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameStatus, crashPoint, hasBet, cashedOut, isAutoCashEnabled, isAutoBetEnabled, autoCashout, handlePlaceBet, triggerCashout]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-slide-up relative">
      <div className="w-full lg:w-[420px] space-y-6">
        <div className="bg-[#0d0f1f] rounded-[48px] p-8 border border-white/5 shadow-2xl relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest">Wager Terminal</h2>
            <div className="flex items-center gap-3">
               <button onClick={() => setShowHelp(!showHelp)} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-[#4b5563] transition-all"><i className="fas fa-info"></i></button>
               <div className={`w-2 h-2 rounded-full ${gameStatus === 'betting' ? 'bg-amber-500 animate-pulse' : gameStatus === 'flying' ? 'bg-green-500' : 'bg-rose-500'}`}></div>
               <span className="text-[10px] font-black text-white/60 uppercase tracking-tighter">{gameStatus}</span>
            </div>
          </div>

          {showHelp && (
            <div className="absolute top-20 left-8 right-8 bg-[#161930] p-6 rounded-3xl border border-purple-500/30 z-50 shadow-2xl animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-purple-400 text-xs uppercase tracking-widest">How to Play</h4>
                <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
              </div>
              <p className="text-[11px] text-[#8b8ea8] leading-relaxed">
                Watch the multiplier climb. Place your bet during the countdown. Cash out at any time before the line crashes to win. The longer you wait, the higher the multiplier, but the greater the risk of crashing!
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="bg-[#060812] p-6 rounded-[32px] border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[9px] font-black text-[#4b5563] uppercase">Bet Amount</label>
                <div className="flex gap-1">
                  <button onClick={() => setBetAmount(Math.max(0, Math.floor(betAmount/2)))} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black hover:bg-white/10 transition-colors">1/2</button>
                  <button onClick={() => setBetAmount(betAmount*2)} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black hover:bg-white/10 transition-colors">2x</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#00ffa3] font-black text-xl">$</span>
                <input 
                  type="number" value={betAmount} onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                  className="bg-transparent text-white text-3xl font-black outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsAutoBetEnabled(!isAutoBetEnabled)}
                className={`p-6 rounded-[32px] border flex flex-col gap-2 transition-all ${isAutoBetEnabled ? 'bg-purple-500/10 border-purple-500/30' : 'bg-[#060812] border-white/5 opacity-60'}`}
              >
                <span className={`text-[8px] font-black uppercase ${isAutoBetEnabled ? 'text-purple-400' : 'text-[#4b5563]'}`}>Auto Enter</span>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black text-white">{isAutoBetEnabled ? 'ON' : 'OFF'}</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${isAutoBetEnabled ? 'bg-purple-500' : 'bg-[#1a1d2e]'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAutoBetEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
              </button>

              <div className={`p-6 rounded-[32px] border flex flex-col gap-2 transition-all ${isAutoCashEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-[#060812] border-white/5 opacity-60'}`}>
                <div className="flex justify-between items-center">
                   <span className={`text-[8px] font-black uppercase ${isAutoCashEnabled ? 'text-green-400' : 'text-[#4b5563]'}`}>Auto Cash</span>
                   <button onClick={toggleAutoCashout} className={`w-4 h-4 rounded-md border ${isAutoCashEnabled ? 'bg-green-500 border-green-500' : 'border-[#4b5563]'}`}>
                      {isAutoCashEnabled && <i className="fas fa-check text-[8px] text-black"></i>}
                   </button>
                </div>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" step="0.1" value={autoCashout} onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 1.1)}
                    className="bg-transparent text-white text-sm font-black outline-none w-full"
                  />
                  <span className="text-[10px] font-black text-white/20">x</span>
                </div>
              </div>
            </div>
          </div>

          {gameStatus === 'betting' ? (
            <button 
              onClick={handlePlaceBet}
              disabled={hasBet}
              className={`w-full py-7 rounded-[32px] font-black text-2xl transition-all active:scale-95 shadow-xl flex flex-col items-center justify-center gap-1 ${hasBet ? 'bg-amber-500/10 text-amber-500/40 cursor-not-allowed border border-amber-500/10' : 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600'}`}
            >
              <span className="text-lg">{hasBet ? 'WAITING' : 'BET'}</span>
              <span className="text-[8px] opacity-60 font-black tracking-widest">{hasBet ? 'ROUND STARTING' : 'PLACE WAGER'}</span>
            </button>
          ) : (
            <button 
              onClick={handleManualCashOut}
              disabled={!hasBet || cashedOut || gameStatus === 'crashed'}
              className={`w-full py-7 rounded-[32px] font-black text-2xl transition-all active:scale-95 shadow-xl flex flex-col items-center justify-center gap-1 ${!hasBet || cashedOut ? 'bg-green-500/10 text-green-500/40 cursor-not-allowed border border-green-500/10' : 'bg-green-500 text-white shadow-green-500/20 hover:bg-green-600'}`}
            >
              <span className="text-lg">{cashedOut ? 'DONE' : `EJECT`}</span>
              <span className="text-[8px] opacity-60 font-black tracking-widest">
                {cashedOut ? 'SAFE' : `${currentMulti.toFixed(2)}x`}
              </span>
            </button>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
             <div>
               <div className="text-[8px] font-black text-[#4b5563] uppercase mb-1">Profit</div>
               <div className="text-xl font-black text-[#00ffa3]">${hasBet && !cashedOut ? Math.floor(betAmount * currentMulti - betAmount).toLocaleString() : '0'}</div>
             </div>
             <div className="text-right">
                <div className="text-[8px] font-black text-[#4b5563] uppercase mb-1">Latency</div>
                <div className="text-[9px] text-white/20 font-mono">14MS SYNC</div>
             </div>
          </div>
        </div>

        <div className="bg-[#0d0f1f] rounded-[48px] p-8 border border-white/5 shadow-2xl h-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest">Global Activity</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {liveCashes.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-2xl border border-white/[0.01] animate-slide-up">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                   <span className="text-[11px] font-black text-white/70">{c.name}</span>
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-black text-green-400">{c.multi.toFixed(2)}x</div>
                   <div className="text-[8px] font-bold text-[#4b5563]">+${c.amt}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#0d0f1f] rounded-[64px] border border-white/5 shadow-2xl relative overflow-hidden p-12 min-h-[600px] flex flex-col items-center justify-center">
         <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="grid grid-cols-10 h-full w-full">
              {Array.from({length: 10}).map((_, i) => <div key={i} className="border-r border-white/20 h-full"></div>)}
            </div>
         </div>

         {/* Background Rocket Icon */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <i className="fa-solid fa-rocket text-[300px] -rotate-45 opacity-[0.04] text-white select-none"></i>
         </div>

         {gameStatus === 'betting' && (
           <div className="relative z-10 text-center scale-110">
             <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-6">
               <i className="fas fa-satellite-dish animate-pulse"></i>
               Launch Sequence
             </div>
             {/* Significantly reduced font size from 140px to 96px (text-8xl/9xl equivalent) */}
             <div className="text-[100px] leading-none font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
               {timeLeft}<span className="text-amber-500/40 text-3xl ml-2 tracking-normal uppercase">S</span>
             </div>
             <div className="mt-8 flex gap-2 justify-center opacity-40">
                {Array.from({length: 15}).map((_, i) => (
                  <div key={i} className={`h-1 w-2.5 rounded-full transition-all duration-500 ${i < timeLeft ? 'bg-amber-500' : 'bg-white/5'}`}></div>
                ))}
             </div>
           </div>
         )}

         {gameStatus === 'flying' && (
           <div className="relative z-10 text-center">
             {/* Significantly reduced font size from 160px to 110px */}
             <div className="text-[110px] leading-none font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_60px_rgba(255,255,255,0.15)] select-none">
               {currentMulti.toFixed(2)}<span className="text-purple-500 ml-1">X</span>
             </div>
             <div className="flex items-center justify-center gap-4">
                <div className="px-5 py-2 bg-green-500/10 rounded-full border border-green-500/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                  <span className="text-[8px] font-black text-green-400 uppercase tracking-[0.2em]">Ascent</span>
                </div>
                {isAutoBetEnabled && (
                  <div className="px-5 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 text-[8px] font-black text-purple-400 uppercase tracking-widest">
                    Auto: {autoCashout.toFixed(2)}x
                  </div>
                )}
             </div>
           </div>
         )}

         {gameStatus === 'crashed' && (
           <div className="relative z-10 text-center animate-slide-up">
             {/* Reduced font size for the crashed background value */}
             <div className="text-[110px] leading-none font-black text-rose-500/10 tracking-tighter mb-4 blur-[4px]">
               {crashPoint.toFixed(2)}x
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
               <div className="text-6xl font-black text-rose-500 uppercase italic tracking-tighter drop-shadow-2xl">
                 BOOM
               </div>
               <div className="text-sm font-black text-white/30 mt-1 uppercase tracking-widest">Exploded @ {crashPoint.toFixed(2)}X</div>
             </div>
           </div>
         )}

         <div className="absolute bottom-0 left-0 w-full p-20 flex justify-between items-end opacity-10 pointer-events-none">
            <div className="flex gap-4">
              {[100, 60, 130].map((h, i) => (
                <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${h}px` }}></div>
              ))}
            </div>
            <div className="text-[7px] font-black text-[#4b5563] uppercase tracking-[0.3em] mb-4">
              Secure Protocol Sync
            </div>
            <div className="flex gap-4">
              {[130, 60, 100].map((h, i) => (
                <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${h}px` }}></div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Crash;
