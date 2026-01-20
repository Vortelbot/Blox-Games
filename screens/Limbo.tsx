
import React, { useState } from 'react';
import { User } from '../types';

interface LimboProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Limbo: React.FC<LimboProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [target, setTarget] = useState(2.0);
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const roll = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient balance!");
    if (target < 1.01) return alert("Target too low!");
    
    updateBalance(-bet);
    setIsRolling(true);
    setResult(null);

    setTimeout(() => {
      // Provably fair-ish logic: 0.99 / random
      const rand = Math.random();
      const finalResult = 0.99 / (1 - rand);
      setResult(finalResult);
      
      const win = finalResult >= target;
      const payout = win ? Math.floor(bet * target) : 0;
      
      if (win) updateBalance(payout);
      addBet('Limbo', bet, win ? target : 0, payout);
      setIsRolling(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[40px] p-8 border border-[#1a1d2e] shadow-2xl text-center relative">
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
        >
          <i className="fas fa-info"></i>
        </button>

        {showHelp && (
          <div className="absolute top-16 left-6 right-6 bg-[#161930] p-6 rounded-3xl border border-orange-500/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-orange-400 text-xs uppercase tracking-widest">How to Play</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-[11px] text-[#8b8ea8] leading-relaxed text-left">
              Predict a target multiplier! If the generated game number is Higher than or Equal to your target, you win your target payout. The higher the target you set, the lower your chance of winning, but the bigger the potential prize.
            </p>
          </div>
        )}

        <h2 className="text-2xl font-black mb-10 italic uppercase tracking-widest text-orange-500">Limbo Engine</h2>
        
        <div className="bg-[#060812] p-12 rounded-[32px] border-4 border-[#1a1d2e] mb-10 overflow-hidden relative">
          <div className={`text-6xl font-black transition-all ${isRolling ? 'blur-sm opacity-50 scale-95' : result && result >= target ? 'text-[#00ffa3] scale-110' : result ? 'text-rose-500' : 'text-white'}`}>
            {isRolling ? '...' : result ? result.toFixed(2) + 'x' : '1.00x'}
          </div>
          {result && !isRolling && (
             <div className="text-[10px] font-black uppercase mt-4 text-[#4b5563]">
               {result >= target ? 'Target Breached!' : 'Terminal Failure'}
             </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Target Multiplier</label>
            <input 
              type="number" step="0.01" value={target} onChange={(e) => setTarget(parseFloat(e.target.value))}
              className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-4 text-center font-black focus:border-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Wager</label>
            <input 
              type="number" value={bet} onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
              className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-4 text-center font-black focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        <button 
          onClick={roll}
          disabled={isRolling}
          className="w-full py-6 bg-orange-500 text-white rounded-[28px] font-black text-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {isRolling ? 'SYNCING...' : 'INITIATE'}
        </button>
      </div>
    </div>
  );
};

export default Limbo;
