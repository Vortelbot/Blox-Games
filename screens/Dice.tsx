
import React, { useState } from 'react';
import { User } from '../types';

interface DiceProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Dice: React.FC<DiceProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [diceCount, setDiceCount] = useState(2);
  const [target, setTarget] = useState(7);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [status, setStatus] = useState<'none'|'exact'|'near'|'loss'>('none');
  const [showHelp, setShowHelp] = useState(false);

  const minSum = diceCount;
  const maxSum = diceCount * 6;
  const midPoint = (minSum + maxSum) / 2;
  const difficulty = 1 + Math.abs(target - midPoint) / midPoint * 2;
  const multiExact = (difficulty * (diceCount * 2.5));
  const multiNear = multiExact / 4;

  const rollDice = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient balance!");
    updateBalance(-bet);
    setIsRolling(true);
    setStatus('none');

    let frames = 0;
    const interval = setInterval(() => {
      setDiceResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
      frames++;
      if (frames > 15) {
        clearInterval(interval);
        const finalResults = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
        setDiceResults(finalResults);
        const sum = finalResults.reduce((a, b) => a + b, 0);
        const diff = Math.abs(sum - target);
        
        let payout = 0;
        let multi = 0;
        if (diff === 0) {
          payout = Math.floor(bet * multiExact);
          multi = multiExact;
          setStatus('exact');
        } else if (diff === 1) {
          payout = Math.floor(bet * multiNear);
          multi = multiNear;
          setStatus('near');
        } else {
          setStatus('loss');
        }

        if (payout > 0) updateBalance(payout);
        addBet('Dice', bet, multi, payout);
        setIsRolling(false);
      }
    }, 80);
  };

  return (
    <div className="max-w-xl mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[40px] p-8 border border-[#1a1d2e] shadow-2xl relative">
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
              Predict the sum of the rolled dice. Select your target sum and the number of dice. If you hit the target exactly, you get the highest payout. Being within ±1 also awards a smaller prize!
            </p>
          </div>
        )}

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black mb-2 uppercase italic tracking-widest">Target Dice</h2>
          <p className="text-[#8b8ea8] text-xs font-bold uppercase">Hit exactly or ±1 to win</p>
        </div>

        <div className="flex gap-4 justify-center min-h-[100px] mb-6 items-center flex-wrap">
          {diceResults.length === 0 ? (
            Array.from({ length: diceCount }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-[#1a1d2e] rounded-2xl flex items-center justify-center text-2xl text-white/20">?</div>
            ))
          ) : (
            diceResults.map((r, i) => (
              <div key={i} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl text-black font-black shadow-xl animate-bounce">
                {r}
              </div>
            ))
          )}
        </div>

        <div className="text-center mb-8">
          <div className={`text-5xl font-black mb-2 ${status === 'exact' ? 'text-[#00ffa3]' : status === 'near' ? 'text-amber-400' : status === 'loss' ? 'text-rose-500' : 'text-white'}`}>
            {diceResults.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#4b5563]">Total Sum</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#161930] p-4 rounded-2xl border border-white/5 text-center">
            <div className="text-[9px] text-[#4b5563] uppercase font-bold mb-1">Exact Hit</div>
            <div className="text-xl font-black text-[#00ffa3]">{multiExact.toFixed(2)}x</div>
          </div>
          <div className="bg-[#161930] p-4 rounded-2xl border border-white/5 text-center">
            <div className="text-[9px] text-[#4b5563] uppercase font-bold mb-1">Near Miss (±1)</div>
            <div className="text-xl font-black text-amber-400">{multiNear.toFixed(2)}x</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
              <span className="text-[#4b5563]">Target Sum: <span className="text-white text-lg">{target}</span></span>
            </div>
            <input 
              type="range" 
              min={minSum} 
              max={maxSum} 
              value={target} 
              onChange={(e) => setTarget(parseInt(e.target.value))}
              disabled={isRolling}
              className="w-full accent-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Dice Count</label>
              <select 
                value={diceCount} 
                onChange={(e) => {
                  const c = parseInt(e.target.value);
                  setDiceCount(c);
                  setTarget(Math.floor((c + c*6)/2));
                }}
                className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-3 text-sm"
              >
                <option value="2">2 Dice</option>
                <option value="3">3 Dice</option>
                <option value="4">4 Dice</option>
                <option value="5">5 Dice</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Bet Amount</label>
              <input 
                type="number" 
                value={bet} 
                onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
                className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-3 text-sm"
              />
            </div>
          </div>

          <button 
            onClick={rollDice}
            disabled={isRolling}
            className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-purple-500/30 hover:bg-purple-600 disabled:opacity-50 transition-all active:scale-95"
          >
            {isRolling ? 'ROLLING...' : 'ROLL DICE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dice;
