
import React, { useState } from 'react';
import { User } from '../types';
import { SLOT_SYMBOLS } from '../constants';

interface SlotsProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Slots: React.FC<SlotsProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [reels, setReels] = useState(['💎', '💎', '💎']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winStatus, setWinStatus] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const spin = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient balance!");
    updateBalance(-bet);
    setIsSpinning(true);
    setWinStatus(null);

    // Realistic reel shuffle animation
    let count = 0;
    const interval = setInterval(() => {
      setReels(Array.from({ length: 3 }, () => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]));
      count++;
      if (count > 20) {
        clearInterval(interval);
        const results = Array.from({ length: 3 }, () => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
        setReels(results);
        
        let multi = 0;
        let status = null;

        if (results[0] === results[1] && results[1] === results[2]) {
          multi = 25; 
          status = "JACKPOT!";
        } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
          multi = 3;
          status = "BIG WIN!";
        }

        const payout = bet * multi;
        if (payout > 0) updateBalance(payout);
        addBet('Slots', bet, multi, payout);
        setWinStatus(status);
        setIsSpinning(false);
      }
    }, 60);
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[48px] p-8 border border-white/5 shadow-2xl text-center relative overflow-hidden">
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="absolute top-8 right-8 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
        >
          <i className="fas fa-info"></i>
        </button>

        {showHelp && (
          <div className="absolute top-20 left-6 right-6 bg-[#161930] p-6 rounded-3xl border border-amber-500/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-amber-500 text-xs uppercase tracking-widest">How to Play</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-[11px] text-[#8b8ea8] leading-relaxed text-left">
              Spin the reels to match symbols. Two matching symbols pay 3x your bet. All three matching symbols land you the 25x Jackpot!
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>
        
        <h2 className="text-3xl font-black mb-10 italic uppercase tracking-widest text-yellow-500">Golden Reels</h2>
        
        <div className="flex gap-4 justify-center bg-[#060812] p-8 rounded-[40px] border-4 border-[#1a1d2e] mb-8 relative">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/40 to-transparent"></div>
          {reels.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`text-7xl h-32 w-full flex items-center justify-center bg-[#0d0f1f] rounded-2xl border border-white/5 shadow-inner transition-transform duration-75 ${isSpinning ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
                {s}
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="min-h-[40px] mb-6">
          {winStatus && (
            <div className="text-2xl font-black text-yellow-400 animate-pulse tracking-widest uppercase italic">
              {winStatus}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#060812] p-5 rounded-[32px] border border-white/5">
            <label className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest block mb-2">Wager</label>
            <div className="flex items-center gap-4">
               <button onClick={() => setBet(Math.max(0, bet / 2))} className="text-white/20 hover:text-white transition-colors">½</button>
               <input 
                type="number" value={bet} onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
                className="flex-1 bg-transparent text-white text-3xl text-center font-black outline-none"
              />
              <button onClick={() => setBet(bet * 2)} className="text-white/20 hover:text-white transition-colors">2x</button>
            </div>
          </div>
          
          <button 
            onClick={spin}
            disabled={isSpinning}
            className="w-full py-7 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-[32px] font-black text-3xl shadow-xl shadow-yellow-500/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
          >
            {isSpinning ? 'SPINNING...' : 'PULL LEVER'}
          </button>

          <div className="grid grid-cols-2 gap-4 text-[10px] font-black text-[#4b5563] uppercase tracking-widest">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
               <span className="text-yellow-500">3 MATCH</span>
               <span className="text-lg text-white">25.00x</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
               <span className="text-yellow-500">2 MATCH</span>
               <span className="text-lg text-white">3.00x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slots;
