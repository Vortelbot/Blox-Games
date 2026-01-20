
import React, { useState } from 'react';
import { User } from '../types';

interface CoinflipProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Coinflip: React.FC<CoinflipProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [side, setSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const flip = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient balance!");
    updateBalance(-bet);
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      
      const win = outcome === side;
      const payout = win ? Math.floor(bet * 1.95) : 0;
      
      if (win) updateBalance(payout);
      addBet('Coinflip', bet, win ? 1.95 : 0, payout);
      setIsFlipping(false);
    }, 1200);
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
          <div className="absolute top-16 left-6 right-6 bg-[#161930] p-6 rounded-3xl border border-cyan-500/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-cyan-400 text-xs uppercase tracking-widest">How to Play</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-[11px] text-[#8b8ea8] leading-relaxed text-left">
              Choose your side: Heads or Tails. Place your bet and flip! It's a pure 50/50 game of chance with a 1.95x payout on successful predictions.
            </p>
          </div>
        )}

        <h2 className="text-2xl font-black mb-10 italic uppercase tracking-widest text-cyan-400">Binary Flip</h2>
        
        <div className="flex justify-center mb-12">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center border-8 transition-all duration-[1200ms] ${isFlipping ? 'animate-spin border-cyan-500' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
            <span className="text-5xl font-black text-cyan-400">
              {isFlipping ? '?' : result ? (result === 'heads' ? 'H' : 'T') : side === 'heads' ? 'H' : 'T'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setSide('heads')}
            className={`py-4 rounded-2xl font-black transition-all border-2 ${side === 'heads' ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-[#060812] text-[#4b5563] border-[#1a1d2e] hover:border-cyan-500/50'}`}
          >
            HEADS
          </button>
          <button 
            onClick={() => setSide('tails')}
            className={`py-4 rounded-2xl font-black transition-all border-2 ${side === 'tails' ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-[#060812] text-[#4b5563] border-[#1a1d2e] hover:border-cyan-500/50'}`}
          >
            TAILS
          </button>
        </div>

        <div className="mb-8">
          <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block text-left">Wager</label>
          <input 
            type="number" value={bet} onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
            className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-4 text-center font-black focus:border-cyan-500 outline-none"
          />
        </div>

        <button 
          onClick={flip}
          disabled={isFlipping}
          className="w-full py-6 bg-cyan-500 text-white rounded-[28px] font-black text-2xl shadow-xl shadow-cyan-500/20 hover:bg-cyan-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {isFlipping ? 'FLIPPING...' : 'EXECUTE FLIP'}
        </button>
      </div>
    </div>
  );
};

export default Coinflip;
