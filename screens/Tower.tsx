
import React, { useState } from 'react';
import { User } from '../types';

interface TowerProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Tower: React.FC<TowerProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [currentLvl, setCurrentLvl] = useState(0);
  const [currentMulti, setCurrentMulti] = useState(1.0);
  const [showHelp, setShowHelp] = useState(false);
  const [towerGrid, setTowerGrid] = useState<({ status: 'hidden' | 'win' | 'loss' }[])[]>(
    Array.from({ length: 8 }, () => [{ status: 'hidden' }, { status: 'hidden' }])
  );

  const startGame = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient funds!");
    updateBalance(-bet);
    setGameState('playing');
    setCurrentLvl(0);
    setCurrentMulti(1.0);
    setTowerGrid(Array.from({ length: 8 }, () => [{ status: 'hidden' }, { status: 'hidden' }]));
  };

  const handleStep = (row: number, col: number) => {
    if (gameState !== 'playing' || row !== currentLvl) return;

    const isWin = Math.random() > 0.45;
    const nextGrid = [...towerGrid];
    
    if (isWin) {
      nextGrid[row][col].status = 'win';
      const nextMulti = currentMulti * 1.8;
      setCurrentMulti(nextMulti);
      setTowerGrid(nextGrid);
      if (currentLvl === 7) {
        cashout(nextMulti);
      } else {
        setCurrentLvl(currentLvl + 1);
      }
    } else {
      nextGrid[row][col].status = 'loss';
      setTowerGrid(nextGrid);
      setGameState('ended');
      addBet('Tower', bet, 0, 0);
    }
  };

  const cashout = (forcedMulti?: number) => {
    if (gameState !== 'playing') return;
    const finalMulti = forcedMulti || currentMulti;
    const payout = Math.floor(bet * finalMulti);
    updateBalance(payout);
    addBet('Tower', bet, finalMulti, payout);
    setGameState('ended');
  };

  return (
    <div className="max-w-xs mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[48px] p-8 border border-white/5 shadow-2xl relative">
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
              Climb the tower level by level! On each floor, pick one of the two blocks. One contains a gem (💎) to advance, while the other contains a bomb (💣). Cash out early or risk it all to reach the top!
            </p>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="text-5xl font-black text-blue-400 italic mb-1">{currentMulti.toFixed(2)}x</div>
          <div className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest">Current Multiplier</div>
        </div>

        <div className="flex flex-col-reverse gap-4 mb-10">
          {towerGrid.map((row, rIdx) => (
            <div 
              key={rIdx} 
              className={`flex gap-4 transition-all duration-500 transform ${rIdx === currentLvl ? 'scale-110' : 'scale-100 opacity-60'}`}
            >
              {row.map((cell, cIdx) => (
                <div 
                  key={cIdx} 
                  onClick={() => handleStep(rIdx, cIdx)}
                  className={`flex-1 h-14 rounded-2xl flex items-center justify-center cursor-pointer border-2 transition-all duration-300 ${
                    cell.status === 'win' ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.3)]' :
                    cell.status === 'loss' ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' :
                    rIdx === currentLvl ? 'bg-[#161930] border-white/10 hover:border-blue-500 text-white/20 hover:text-blue-400' :
                    'bg-[#161930]/50 border-white/5 text-white/5 pointer-events-none'
                  }`}
                >
                  {cell.status === 'win' ? <i className="fas fa-gem animate-bounce"></i> : cell.status === 'loss' ? <i className="fas fa-bomb"></i> : <i className="fas fa-question text-xs"></i>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {gameState !== 'playing' ? (
            <div className="bg-[#060812] p-6 rounded-[32px] border border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black text-[#4b5563] uppercase">
                 <span>Bet Amount</span>
                 <span className="text-blue-400">Step: 1.80x</span>
              </div>
              <input 
                type="number" value={bet} onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
                className="w-full bg-transparent border-none text-2xl text-center font-black text-white outline-none"
              />
              <button 
                onClick={startGame}
                className="w-full py-5 bg-blue-500 text-white rounded-[24px] font-black text-xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all"
              >
                {gameState === 'ended' ? 'TRY AGAIN' : 'START CLIMB'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => cashout()}
              disabled={currentLvl === 0}
              className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-[24px] font-black text-2xl shadow-xl shadow-green-500/20 active:scale-95 transition-all"
            >
              CASHOUT ${Math.floor(bet * currentMulti).toLocaleString()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tower;
