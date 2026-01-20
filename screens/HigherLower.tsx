
import React, { useState } from 'react';
import { User } from '../types';

interface HigherLowerProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const HigherLower: React.FC<HigherLowerProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [target, setTarget] = useState(50);
  const [mode, setMode] = useState<'over' | 'under'>('over');
  const [result, setResult] = useState<number>(50.00);
  const [isRolling, setIsRolling] = useState(false);
  const [lastWin, setLastWin] = useState<boolean | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const chance = mode === 'over' ? (100 - target) : target;
  const multiplier = chance <= 0 ? 0 : 99 / chance;

  const handleRoll = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient balance!");
    
    updateBalance(-bet);
    setIsRolling(true);
    setLastWin(null);

    let frames = 0;
    const interval = setInterval(() => {
      setResult(Math.random() * 100);
      frames++;
      if (frames > 15) {
        clearInterval(interval);
        const finalResult = parseFloat((Math.random() * 100).toFixed(2));
        setResult(finalResult);
        
        const win = (mode === 'over' && finalResult > target) || (mode === 'under' && finalResult < target);
        const payout = win ? Math.floor(bet * multiplier) : 0;
        
        if (win) updateBalance(payout);
        addBet('HiLo', bet, win ? multiplier : 0, payout);
        setLastWin(win);
        setIsRolling(false);
      }
    }, 50);
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[40px] p-8 border border-[#1a1d2e] shadow-2xl relative overflow-hidden">
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
        >
          <i className="fas fa-info"></i>
        </button>

        {showHelp && (
          <div className="absolute top-16 left-6 right-6 bg-[#161930] p-6 rounded-3xl border border-purple-500/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-purple-400 text-xs uppercase tracking-widest">How to Play</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-[11px] text-[#8b8ea8] leading-relaxed">
              Adjust the slider to set your target number. Choose whether you think the result will be Higher (Over) or Lower (Under) than your target. The lower the chance of winning, the higher the payout!
            </p>
          </div>
        )}

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black mb-2 uppercase italic">HIGHER OR LOWER</h2>
          <p className="text-[#4b5563] text-[10px] font-black uppercase tracking-widest">Probability Multiplier Engine</p>
        </div>

        <div className={`text-6xl font-black mb-10 text-center transition-colors ${isRolling ? 'text-white' : lastWin === true ? 'text-[#00ffa3]' : lastWin === false ? 'text-rose-500' : 'text-white'}`}>
          {result.toFixed(2)}
        </div>

        <div className="flex justify-between items-center text-[10px] font-black text-[#4b5563] mb-2 uppercase tracking-tighter">
          <span>Target: <span className="text-white">{target}</span></span>
          <span>Chance: <span className="text-white">{chance.toFixed(2)}%</span></span>
        </div>

        <input 
          type="range" 
          min="2" 
          max="98" 
          value={target}
          onChange={(e) => setTarget(parseInt(e.target.value))}
          disabled={isRolling}
          className="w-full h-2 bg-[#1a1d2e] rounded-lg appearance-none cursor-pointer accent-purple-500 mb-8"
        />

        <div className="bg-[#161930] p-6 rounded-2xl border border-white/5 mb-8 text-center">
          <div className="text-xs text-[#4b5563] uppercase font-bold mb-1">Potential Payout</div>
          <div className="text-3xl font-black text-[#00ffa3]">{multiplier.toFixed(4)}x</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Bet Amount</label>
            <input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
              className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Prediction</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as 'over' | 'under')}
              className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="over">Higher (Over)</option>
              <option value="under">Lower (Under)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleRoll}
          disabled={isRolling}
          className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-purple-500/30 hover:bg-purple-600 disabled:opacity-50 transition-all active:scale-95"
        >
          {isRolling ? 'ROLLING...' : 'PLACE BET'}
        </button>
      </div>
    </div>
  );
};

export default HigherLower;
