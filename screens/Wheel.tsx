
import React, { useState } from 'react';
import { User } from '../types';

interface WheelProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Wheel: React.FC<WheelProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastMulti, setLastMulti] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const segments = [1.5, 0, 2, 1.2, 0, 3, 1.1, 0, 5, 0];
  const colors = [
    '#a855f7', '#18181b', '#3b82f6', '#10b981', '#18181b',
    '#f97316', '#ec4899', '#18181b', '#eab308', '#18181b'
  ];

  const spin = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient balance!");
    updateBalance(-bet);
    setIsSpinning(true);
    setLastMulti(null);

    const winIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    
    const fullSpins = 5 + Math.floor(Math.random() * 5);
    const targetRotation = (fullSpins * 360) - (winIndex * segmentAngle);
    
    setRotation(targetRotation);

    setTimeout(() => {
      const multi = segments[winIndex];
      const payout = Math.floor(bet * multi);
      
      if (payout > 0) updateBalance(payout);
      addBet('Wheel', bet, multi, payout);
      setLastMulti(multi);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[48px] p-8 border border-white/5 shadow-2xl text-center relative overflow-hidden">
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
        >
          <i className="fas fa-info"></i>
        </button>

        {showHelp && (
          <div className="absolute top-16 left-6 right-6 bg-[#161930] p-6 rounded-3xl border border-indigo-500/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-indigo-400 text-xs uppercase tracking-widest">How to Play</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-[11px] text-[#8b8ea8] leading-relaxed text-left">
              Spin the wheel to win a multiplier! The wheel is divided into different segments, each offering a specific payout. Landing on a multiplier (e.g., 5x) multiplied your bet by that amount. Landing on a 0x (black segment) results in a loss.
            </p>
          </div>
        )}

        <h2 className="text-2xl font-black mb-10 italic uppercase tracking-widest text-indigo-400">Zenith Wheel</h2>
        
        <div className="relative w-72 h-72 mx-auto mb-12">
          {/* Pointer */}
          <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white z-30 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
          
          <div 
            className="w-full h-full rounded-full border-[10px] border-[#1a1d2e] overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.15, 0, 0.15, 1) shadow-[0_0_50px_rgba(99,102,241,0.2)]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
             {segments.map((m, i) => (
                <div 
                  key={i} 
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ 
                    backgroundColor: colors[i],
                    clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.tan((360/segments.length) * Math.PI / 180)}% 0)`,
                    transformOrigin: '50% 50%',
                    transform: `rotate(${i * (360/segments.length)}deg)`
                  }}
                >
                   <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-[10px] font-black transform rotate-[18deg] text-white/80">
                     {m}x
                   </div>
                </div>
             ))}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0d0f1f] rounded-full border-4 border-[#1a1d2e] z-20 flex items-center justify-center shadow-inner">
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="min-h-[60px] flex items-center justify-center mb-8">
          {lastMulti !== null && !isSpinning && (
            <div className={`text-4xl font-black animate-bounce ${lastMulti > 0 ? 'text-[#00ffa3]' : 'text-rose-500'}`}>
              {lastMulti === 0 ? 'MISS!' : `${lastMulti}x WIN`}
            </div>
          )}
        </div>

        <div className="bg-[#060812] p-5 rounded-3xl border border-white/5 mb-8">
          <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block text-left">Wager</label>
          <div className="flex items-center gap-3">
             <span className="text-indigo-400 font-black">$</span>
             <input 
              type="number" value={bet} onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
              className="w-full bg-transparent text-white font-black text-2xl outline-none"
            />
          </div>
        </div>

        <button 
          onClick={spin}
          disabled={isSpinning}
          className="w-full py-6 bg-indigo-500 text-white rounded-[28px] font-black text-2xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSpinning ? 'SPINNING...' : 'RELEASE WHEEL'}
        </button>
      </div>
    </div>
  );
};

export default Wheel;
