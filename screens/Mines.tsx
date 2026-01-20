
import React, { useState } from 'react';
import { User } from '../types';

interface MinesProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Mines: React.FC<MinesProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [grid, setGrid] = useState<(string | null)[]>(Array(25).fill(null));
  const [bombs, setBombs] = useState<number[]>([]);
  const [currentMulti, setCurrentMulti] = useState(1.0);
  const [safePicks, setSafePicks] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const calculateMulti = (picks: number) => {
    let multi = 1.0;
    for (let i = 0; i < picks; i++) {
      multi *= (25 - i) / (25 - i - mineCount);
    }
    return multi;
  };

  const startGame = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient funds!");
    updateBalance(-bet);
    
    const newBombs: number[] = [];
    while (newBombs.length < mineCount) {
      const r = Math.floor(Math.random() * 25);
      if (!newBombs.includes(r)) newBombs.push(r);
    }
    
    setBombs(newBombs);
    setGrid(Array(25).fill(null));
    setSafePicks(0);
    setCurrentMulti(1.0);
    setGameState('playing');
  };

  const handleClick = (idx: number) => {
    if (gameState !== 'playing' || grid[idx] !== null) return;
    
    if (bombs.includes(idx)) {
      const newGrid = [...grid];
      bombs.forEach(b => newGrid[b] = '💣');
      setGrid(newGrid);
      setGameState('ended');
      addBet('Mines', bet, 0, 0);
    } else {
      const newGrid = [...grid];
      newGrid[idx] = '💎';
      const newPicks = safePicks + 1;
      const nextMulti = calculateMulti(newPicks);
      setGrid(newGrid);
      setSafePicks(newPicks);
      setCurrentMulti(nextMulti);
    }
  };

  const cashout = () => {
    if (gameState !== 'playing') return;
    const payout = Math.floor(bet * currentMulti);
    updateBalance(payout);
    addBet('Mines', bet, currentMulti, payout);
    setGameState('ended');
    const newGrid = [...grid];
    bombs.forEach(b => { if (newGrid[b] === null) newGrid[b] = '💣'; });
    setGrid(newGrid);
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up relative">
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
              Find the gems (💎) hidden under the tiles. Each gem increases your payout multiplier. If you hit a mine (💣), you lose the game. You can cash out at any time to keep your current winnings.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div className="text-4xl font-black text-purple-500 italic">{currentMulti.toFixed(2)}x</div>
          <div className="text-[10px] font-black uppercase text-[#4b5563]">Current Multiplier</div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-8">
          {grid.map((val, i) => (
            <div 
              key={i} 
              onClick={() => handleClick(i)}
              className={`aspect-square rounded-xl border flex items-center justify-center text-xl cursor-pointer transition-all duration-200 transform active:scale-90 ${
                val === '💎' ? 'bg-[#161930] border-[#00ffa3] text-[#00ffa3]' :
                val === '💣' ? 'bg-rose-900/50 border-rose-500 text-rose-500' :
                'bg-[#161930] border-[#1a1d2e] hover:border-purple-500/50'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {gameState === 'betting' || gameState === 'ended' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-[#4b5563] uppercase mb-1 block">Mines</label>
                  <input 
                    type="number" min="1" max="24" value={mineCount}
                    onChange={(e) => setMineCount(Math.min(24, Math.max(1, parseInt(e.target.value))))}
                    className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#4b5563] uppercase mb-1 block">Bet</label>
                  <input 
                    type="number" value={bet}
                    onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
                    className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-3 text-sm"
                  />
                </div>
              </div>
              <button 
                onClick={startGame}
                className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-purple-500/30 hover:bg-purple-600"
              >
                {gameState === 'ended' ? 'PLAY AGAIN' : 'START GAME'}
              </button>
            </>
          ) : (
            <button 
              onClick={cashout}
              disabled={safePicks === 0}
              className="w-full py-5 bg-[#00ffa3] text-[#060812] rounded-2xl font-black text-xl shadow-xl shadow-[#00ffa3]/20 hover:bg-[#00e692] disabled:opacity-50"
            >
              CASHOUT (${Math.floor(bet * currentMulti).toLocaleString()})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mines;
