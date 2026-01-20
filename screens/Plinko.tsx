
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { PLINKO_MULTIS } from '../constants';

interface PlinkoProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

const Plinko: React.FC<PlinkoProps> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(100);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [showHelp, setShowHelp] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<any[]>([]);
  const rows = 14;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const spacing = 32;
      const rowHeight = 28;
      const startY = 40;

      // Draw Pegs
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      for (let r = 0; r < rows; r++) {
        const cols = r + 3;
        const rowStartX = canvas.width / 2 - ((cols - 1) * spacing) / 2;
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(rowStartX + c * spacing, startY + r * rowHeight, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update and Draw Balls
      ballsRef.current = ballsRef.current.filter(b => b.active);
      ballsRef.current.forEach(b => {
        b.vy += 0.2; // Gravity
        b.x += b.vx;
        b.y += b.vy;

        // Friction
        b.vx *= 0.99;

        // Collision detection with rows
        const currentRow = Math.floor((b.y - startY) / rowHeight);
        if (currentRow > b.lastRow && currentRow < rows) {
          b.lastRow = currentRow;
          // Randomize horizontal bounce
          const direction = Math.random() > 0.5 ? 1 : -1;
          b.vx = direction * (Math.random() * 2 + 1);
          b.vy = 2.5; // Upward-ish bounce feel
        }

        // Walls
        if (b.x < 10 || b.x > canvas.width - 10) b.vx *= -1;

        // Final Resolution
        if (b.y > startY + (rows - 0.5) * rowHeight) {
          b.active = false;
          resolve(b);
        }

        // Draw trail
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ec4899";
        ctx.fillStyle = "#ec4899";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, [risk]);

  const resolve = (ball: any) => {
    const multis = PLINKO_MULTIS[ball.risk as keyof typeof PLINKO_MULTIS];
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate bucket based on final X relative to center
    const width = 500;
    const center = width / 2;
    const distFromCenter = ball.x - center;
    const bucketWidth = 35;
    
    let bucketIndex = Math.floor(distFromCenter / bucketWidth) + Math.floor(multis.length / 2);
    bucketIndex = Math.max(0, Math.min(multis.length - 1, bucketIndex));
    
    const multi = multis[bucketIndex];
    const payout = Math.floor(ball.bet * multi);
    
    updateBalance(payout);
    addBet('Plinko', ball.bet, multi, payout);
  };

  const drop = () => {
    if (user.bal < bet || bet <= 0) return alert("Insufficient funds!");
    updateBalance(-bet);
    ballsRef.current.push({
      x: 250 + (Math.random() - 0.5) * 4,
      y: 10,
      vx: 0,
      vy: 1.5,
      lastRow: -1,
      bet: bet,
      risk: risk,
      active: true
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up relative">
      <div className="bg-[#0d0f1f] rounded-[48px] p-8 border border-white/5 shadow-2xl overflow-hidden relative">
        <button 
          onClick={() => setShowHelp(!showHelp)} 
          className="absolute top-8 right-8 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
        >
          <i className="fas fa-info"></i>
        </button>

        {showHelp && (
          <div className="absolute top-20 left-8 right-8 bg-[#161930] p-6 rounded-3xl border border-pink-500/30 z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-pink-400 text-xs uppercase tracking-widest">How to Play</h4>
              <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-[11px] text-[#8b8ea8] leading-relaxed">
              Drop balls into the triangular grid of pegs! Each ball bounces randomly until it lands in a multiplier slot at the bottom. Choose higher risk levels for the chance to hit massive 100x+ multipliers!
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-black text-pink-500 uppercase italic">Plinko Royale</h2>
           <div className="px-4 py-1 bg-pink-500/10 rounded-full border border-pink-500/20 text-[10px] font-black text-pink-400 uppercase tracking-widest">0.80% House Edge</div>
        </div>

        <canvas 
          ref={canvasRef} 
          width={500} 
          height={480} 
          className="bg-[#060812] rounded-[32px] mb-4 w-full h-auto border border-white/5" 
        />
        
        <div className="flex justify-between gap-1 mb-10 overflow-hidden rounded-xl bg-black/40 p-1">
          {PLINKO_MULTIS[risk].map((m, i) => (
            <div key={i} className={`flex-1 text-[8px] font-black py-3 text-center transition-colors rounded-lg ${m >= 5 ? 'bg-pink-600 text-white' : m >= 1 ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-[#4b5563]'}`}>
              {m}x
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-[#060812] p-4 rounded-2xl border border-white/5">
            <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Bet Amount</label>
            <div className="flex items-center gap-2">
              <span className="text-[#00ffa3] font-black">$</span>
              <input 
                type="number" value={bet} onChange={(e) => setBet(Math.max(0, parseInt(e.target.value)))}
                className="w-full bg-transparent text-white font-black text-lg outline-none"
              />
            </div>
          </div>
          <div className="bg-[#060812] p-4 rounded-2xl border border-white/5">
            <label className="text-[10px] font-black text-[#4b5563] uppercase mb-2 block">Risk Level</label>
            <select 
              value={risk} onChange={(e) => setRisk(e.target.value as any)}
              className="w-full bg-transparent text-white font-black text-lg outline-none appearance-none cursor-pointer"
            >
              <option value="low" className="bg-[#060812]">Low Risk</option>
              <option value="medium" className="bg-[#060812]">Medium Risk</option>
              <option value="high" className="bg-[#060812]">High Risk</option>
            </select>
          </div>
        </div>

        <button 
          onClick={drop}
          className="w-full py-6 bg-pink-500 text-white rounded-[24px] font-black text-xl shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-95 group"
        >
          <i className="fas fa-play mr-3 group-hover:translate-x-1 transition-transform"></i>
          PLACE BET
        </button>
      </div>
    </div>
  );
};

export default Plinko;
