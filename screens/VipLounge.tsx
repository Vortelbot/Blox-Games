
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface VipLoungeProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
  t: any;
}

const VipLounge: React.FC<VipLoungeProps> = ({ user, updateBalance, addBet, t }) => {
  const [activeGame, setActiveGame] = useState<'baccarat' | 'roulette' | 'blackjack' | 'hub'>('hub');

  const renderGame = () => {
    switch (activeGame) {
      case 'baccarat': return <DiamondBaccarat user={user} updateBalance={updateBalance} addBet={addBet} onBack={() => setActiveGame('hub')} />;
      case 'roulette': return <RoyaleRoulette user={user} updateBalance={updateBalance} addBet={addBet} onBack={() => setActiveGame('hub')} />;
      case 'blackjack': return <EclipseBlackjack user={user} updateBalance={updateBalance} addBet={addBet} onBack={() => setActiveGame('hub')} />;
      default: return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GameLauncher 
            name="Diamond Baccarat" 
            desc="Elite card mechanics. Featuring Pair side-bets and live Squeeze reveal."
            icon="fa-id-card"
            color="amber"
            onClick={() => setActiveGame('baccarat')}
          />
          <GameLauncher 
            name="Royale Roulette" 
            desc="Full layout 36-number grid. High stakes, zero commission precision."
            icon="fa-circle-dot"
            color="amber"
            onClick={() => setActiveGame('roulette')}
          />
          <GameLauncher 
            name="Eclipse Blackjack" 
            desc="Face the shadow dealer in this high-limit tactical showdown."
            icon="fa-spade"
            color="amber"
            onClick={() => setActiveGame('blackjack')}
          />
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-slide-up space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">
            <i className="fas fa-gem"></i>
            Elite Member Access Only
          </div>
          <h2 className="text-7xl font-black tracking-tighter uppercase italic">
            VIP <span className="text-amber-500">LOUNGE</span>
          </h2>
          <p className="text-[#8b8ea8] text-xl mt-4 max-w-2xl font-medium">
            Proprietary high-limit engines. Reduced house edge (0.5%), ultra-premium visuals.
          </p>
        </div>
        {activeGame !== 'hub' && (
          <button 
            onClick={() => setActiveGame('hub')}
            className="bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Exit Game
          </button>
        )}
      </div>

      {renderGame()}
    </div>
  );
};

const GameLauncher: React.FC<{ name: string, desc: string, icon: string, color: string, onClick: () => void }> = ({ name, desc, icon, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-[#0d0f1f] rounded-[48px] p-10 border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all cursor-pointer h-[340px] flex flex-col justify-between shadow-2xl"
  >
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
      <i className={`fas ${icon} text-[200px]`}></i>
    </div>
    <div className="relative z-10">
      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 text-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-4xl font-black italic tracking-tighter mb-4 text-white uppercase">{name}</h3>
      <p className="text-[#8b8ea8] font-medium leading-relaxed max-w-xs">{desc}</p>
    </div>
    <div className="relative z-10 flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-[0.3em]">
      ENTER SESSION <i className="fas fa-chevron-right"></i>
    </div>
  </div>
);

// --- DIAMOND BACCARAT ---
const DiamondBaccarat: React.FC<{ user: User, updateBalance: (n: number) => void, addBet: any, onBack: () => void }> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(1000);
  const [target, setTarget] = useState<'player' | 'banker' | 'tie' | 'ppair' | 'bpair'>('player');
  const [isDealing, setIsDealing] = useState(false);
  const [result, setResult] = useState<{p: number, b: number} | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const deal = () => {
    if (user.bal < bet) return alert("Insufficient balance!");
    updateBalance(-bet);
    setIsDealing(true);
    setResult(null);

    setTimeout(() => {
      const p = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      setResult({ p, b });
      
      let win = false;
      let multi = 0;
      let outcome = '';

      if (target === 'player' && p > b) { win = true; multi = 2; outcome = 'P'; }
      else if (target === 'banker' && b > p) { win = true; multi = 1.95; outcome = 'B'; }
      else if (target === 'tie' && p === b) { win = true; multi = 9; outcome = 'T'; }
      else if (target === 'ppair' && Math.random() < 0.1) { win = true; multi = 12; outcome = 'PP'; }
      else if (target === 'bpair' && Math.random() < 0.1) { win = true; multi = 12; outcome = 'BP'; }
      else {
        outcome = p > b ? 'P' : b > p ? 'B' : 'T';
      }

      const payout = win ? Math.floor(bet * multi) : 0;
      if (win) updateBalance(payout);
      addBet('Diamond Baccarat', bet, win ? multi : 0, payout);
      setHistory(prev => [outcome, ...prev].slice(0, 10));
      setIsDealing(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#0d0f1f] border border-amber-500/20 rounded-[64px] p-12 shadow-2xl animate-slide-up relative">
      <button 
        onClick={() => setShowHelp(!showHelp)} 
        className="absolute top-12 right-12 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
      >
        <i className="fas fa-info"></i>
      </button>

      {showHelp && (
        <div className="absolute top-24 left-12 right-12 bg-[#161930] p-8 rounded-[40px] border border-amber-500/30 z-50 shadow-2xl animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-amber-500 text-lg uppercase tracking-widest italic">Baccarat Protocol</h4>
            <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
          </div>
          <p className="text-sm text-[#8b8ea8] leading-relaxed mb-4">
            Predict whether the Player or Banker hand will have a total closest to 9. You can also bet on a Tie or Side Pairs.
          </p>
          <ul className="text-xs text-[#8b8ea8] space-y-2 list-disc pl-5">
             <li>Player/Banker wins double your bet (Banker has commission).</li>
             <li>Tie pays 9x.</li>
             <li>Pairs (Player/Banker) pay a massive 12x if their initial cards match.</li>
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-3xl font-black italic text-amber-500 uppercase tracking-tighter">Diamond Baccarat</h3>
          <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mt-1">High-Stakes Session Active</p>
        </div>
        <div className="flex gap-2 mr-16">
          {history.map((h, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border border-white/5 ${h === 'P' ? 'bg-blue-500 text-white' : h === 'B' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {h}
            </div>
          ))}
          {history.length === 0 && <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Awaiting Results</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
           <div className="w-16 h-16 bg-[#060812] border-4 border-amber-500/20 rounded-full flex items-center justify-center font-black italic text-white/20">VS</div>
        </div>
        <div className={`p-14 rounded-[48px] border-2 transition-all text-center relative overflow-hidden ${result && result.p > result.b ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'bg-[#060812] border-white/5'}`}>
          <div className="text-[10px] font-black text-blue-400 uppercase mb-6 tracking-[0.4em]">Player Hand</div>
          <div className={`text-9xl font-black text-white transition-all ${isDealing ? 'blur-xl opacity-20' : ''}`}>
            {result ? result.p : '?'}
          </div>
        </div>
        <div className={`p-14 rounded-[48px] border-2 transition-all text-center relative overflow-hidden ${result && result.b > result.p ? 'bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'bg-[#060812] border-white/5'}`}>
          <div className="text-[10px] font-black text-red-400 uppercase mb-6 tracking-[0.4em]">Banker Hand</div>
          <div className={`text-9xl font-black text-white transition-all ${isDealing ? 'blur-xl opacity-20' : ''}`}>
            {result ? result.b : '?'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-10">
        {[
          { id: 'ppair', label: 'P-PAIR', multi: '12x', col: 'text-blue-400' },
          { id: 'player', label: 'PLAYER', multi: '2.0x', col: 'text-white' },
          { id: 'tie', label: 'TIE', multi: '9.0x', col: 'text-green-500' },
          { id: 'banker', label: 'BANKER', multi: '1.95x', col: 'text-white' },
          { id: 'bpair', label: 'B-PAIR', multi: '12x', col: 'text-red-400' }
        ].map(opt => (
          <button 
            key={opt.id}
            onClick={() => setTarget(opt.id as any)}
            className={`p-6 rounded-[32px] border-2 font-black transition-all group ${target === opt.id ? 'bg-amber-500 border-amber-400 text-black shadow-xl scale-[1.05]' : 'bg-[#060812] border-white/5 text-[#4b5563] hover:text-white hover:border-white/10'}`}
          >
            <div className={`text-xs mb-1 ${target === opt.id ? 'text-black' : opt.col}`}>{opt.label}</div>
            <div className="text-[10px] opacity-60 font-medium">{opt.multi}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-[#060812] p-6 rounded-[32px] border border-white/5 flex items-center justify-between px-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest">Wager Limit</span>
            <input 
              type="number" value={bet} onChange={(e) => setBet(parseInt(e.target.value) || 0)}
              className="bg-transparent text-white font-black text-2xl outline-none w-full mt-1"
            />
          </div>
          <i className="fas fa-coins text-amber-500/20 text-2xl"></i>
        </div>
        <button 
          onClick={deal}
          disabled={isDealing}
          className="flex-[1.5] py-7 bg-amber-500 text-black rounded-[32px] font-black text-xl hover:bg-white hover:scale-[1.02] transition-all shadow-2xl shadow-amber-500/20 active:scale-95 disabled:opacity-50"
        >
          {isDealing ? <i className="fas fa-spinner animate-spin"></i> : 'INITIATE SQUEEZE'}
        </button>
      </div>
    </div>
  );
};

// --- ROYALE ROULETTE ---
const RoyaleRoulette: React.FC<{ user: User, updateBalance: (n: number) => void, addBet: any, onBack: () => void }> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(1000);
  const [target, setTarget] = useState<number | 'red' | 'black' | 'zero'>(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const numbers = Array.from({ length: 37 }, (_, i) => i);

  const getNumColor = (n: number) => {
    if (n === 0) return 'text-emerald-400';
    const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    return reds.includes(n) ? 'text-red-500' : 'text-white';
  };

  const spin = () => {
    if (user.bal < bet) return alert("Insufficient balance!");
    updateBalance(-bet);
    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const outcome = Math.floor(Math.random() * 37);
      setResult(outcome);
      
      let win = false;
      let multi = 0;

      if (typeof target === 'number') {
        if (target === outcome) { win = true; multi = 36; }
      } else if (target === 'red') {
        const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        if (reds.includes(outcome)) { win = true; multi = 2; }
      } else if (target === 'black') {
        const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        if (outcome !== 0 && !reds.includes(outcome)) { win = true; multi = 2; }
      } else if (target === 'zero' && outcome === 0) {
        win = true; multi = 36;
      }

      const payout = win ? Math.floor(bet * multi) : 0;
      if (win) updateBalance(payout);
      addBet('Royale Roulette', bet, win ? multi : 0, payout);
      setHistory(prev => [outcome, ...prev].slice(0, 8));
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto bg-[#0d0f1f] border border-amber-500/20 rounded-[64px] p-12 shadow-2xl animate-slide-up relative">
      <button 
        onClick={() => setShowHelp(!showHelp)} 
        className="absolute top-10 right-10 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
      >
        <i className="fas fa-info"></i>
      </button>

      {showHelp && (
        <div className="absolute top-24 left-12 right-12 bg-[#161930] p-8 rounded-[40px] border border-amber-500/30 z-50 shadow-2xl animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-amber-500 text-lg uppercase tracking-widest italic">Roulette Mechanics</h4>
            <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
          </div>
          <p className="text-sm text-[#8b8ea8] leading-relaxed mb-4">
            Predict where the ivory ball will land on the spinning wheel.
          </p>
          <ul className="text-xs text-[#8b8ea8] space-y-2 list-disc pl-5">
             <li>Red/Black bets pay 2x your wager.</li>
             <li>Specific number bets pay 36x.</li>
             <li>Zero (Green) is the elite target, also paying 36x.</li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col items-center justify-center bg-[#060812] rounded-[48px] p-10 border border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none"></div>
           <div className={`w-64 h-64 rounded-full border-[12px] border-[#1a1d2e] flex items-center justify-center transition-all duration-[2000ms] relative z-10 ${isSpinning ? 'animate-spin border-amber-500 shadow-[0_0_80px_rgba(245,158,11,0.1)]' : ''}`}>
             <div className={`text-7xl font-black italic tracking-tighter ${result !== null ? getNumColor(result) : 'text-white/10'}`}>
               {result !== null ? result : '??'}
             </div>
           </div>
           <div className="mt-10 flex gap-2">
              {history.map((h, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border border-white/5 bg-[#0d0f1f] ${getNumColor(h)}`}>
                  {h}
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-12 gap-1.5 p-1 bg-[#060812] rounded-3xl border border-white/5">
              {numbers.map(n => (
                <button 
                  key={n}
                  onClick={() => setTarget(n)}
                  className={`aspect-square rounded-lg text-[10px] font-black transition-all border ${target === n ? 'bg-amber-500 text-black border-amber-400' : 'bg-[#0d0f1f] border-white/5 hover:border-white/20 ' + getNumColor(n)}`}
                >
                  {n}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-3 gap-4">
              <button onClick={() => setTarget('red')} className={`py-6 rounded-2xl border-2 font-black transition-all uppercase tracking-widest text-xs ${target === 'red' ? 'bg-red-500 text-white border-red-400 shadow-xl' : 'bg-[#060812] border-white/5 text-[#4b5563]'}`}>RED (2x)</button>
              <button onClick={() => setTarget('zero')} className={`py-6 rounded-2xl border-2 font-black transition-all uppercase tracking-widest text-xs ${target === 'zero' ? 'bg-emerald-500 text-black border-emerald-400 shadow-xl' : 'bg-[#060812] border-white/5 text-[#4b5563]'}`}>ZERO (36x)</button>
              <button onClick={() => setTarget('black')} className={`py-6 rounded-2xl border-2 font-black transition-all uppercase tracking-widest text-xs ${target === 'black' ? 'bg-white text-black border-white shadow-xl' : 'bg-[#060812] border-white/5 text-[#4b5563]'}`}>BLACK (2x)</button>
           </div>

           <div className="flex gap-4">
              <div className="flex-1 bg-[#060812] p-4 rounded-3xl border border-white/5 flex items-center px-8 gap-4">
                 <span className="text-amber-500 font-black text-xl">$</span>
                 <input 
                  type="number" value={bet} onChange={(e) => setBet(parseInt(e.target.value) || 0)}
                  className="bg-transparent text-white font-black text-2xl outline-none w-full"
                 />
              </div>
              <button 
                onClick={spin}
                disabled={isSpinning}
                className="flex-1 bg-amber-500 text-black rounded-[28px] font-black text-xl hover:bg-white transition-all shadow-2xl shadow-amber-500/20 active:scale-95 disabled:opacity-50"
              >
                {isSpinning ? 'SPINNING...' : 'RELEASE BALL'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- ECLIPSE BLACKJACK ---
const EclipseBlackjack: React.FC<{ user: User, updateBalance: (n: number) => void, addBet: any, onBack: () => void }> = ({ user, updateBalance, addBet }) => {
  const [bet, setBet] = useState(1000);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [msg, setMsg] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const getHandTotal = (hand: number[]) => {
    let total = hand.reduce((a, b) => a + b, 0);
    let aces = hand.filter(n => n === 11).length;
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  };

  const drawCard = () => {
    const val = Math.floor(Math.random() * 10) + 2; 
    return val;
  };

  const startHand = () => {
    if (user.bal < bet) return alert("Insufficient balance!");
    updateBalance(-bet);
    const p1 = drawCard();
    const p2 = drawCard();
    const d1 = drawCard();
    setPlayerHand([p1, p2]);
    setDealerHand([d1]);
    setGameState('playing');
    setMsg('');
  };

  const hit = () => {
    const next = drawCard();
    const newHand = [...playerHand, next];
    setPlayerHand(newHand);
    if (getHandTotal(newHand) > 21) {
      setMsg('BUSTED');
      endHand(false);
    }
  };

  const stand = () => {
    let dHand = [...dealerHand];
    while (getHandTotal(dHand) < 17) {
      dHand.push(drawCard());
    }
    setDealerHand(dHand);
    const pTotal = getHandTotal(playerHand);
    const dTotal = getHandTotal(dHand);
    
    if (dTotal > 21 || pTotal > dTotal) {
      setMsg('YOU WIN');
      endHand(true);
    } else if (pTotal === dTotal) {
      setMsg('PUSH');
      updateBalance(bet);
      setGameState('ended');
    } else {
      setMsg('DEALER WINS');
      endHand(false);
    }
  };

  const endHand = (win: boolean) => {
    const payout = win ? bet * 2 : 0;
    if (win) updateBalance(payout);
    addBet('Eclipse Blackjack', bet, win ? 2 : 0, payout);
    setGameState('ended');
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#060812] border border-amber-500/20 rounded-[64px] p-16 shadow-2xl animate-slide-up relative overflow-hidden">
      <button 
        onClick={() => setShowHelp(!showHelp)} 
        className="absolute top-12 right-12 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
      >
        <i className="fas fa-info"></i>
      </button>

      {showHelp && (
        <div className="absolute top-24 left-12 right-12 bg-[#161930] p-8 rounded-[40px] border border-amber-500/30 z-50 shadow-2xl animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-amber-500 text-lg uppercase tracking-widest italic">Blackjack Tactical</h4>
            <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
          </div>
          <p className="text-sm text-[#8b8ea8] leading-relaxed mb-4">
            Get your hand total as close to 21 as possible without going over.
          </p>
          <ul className="text-xs text-[#8b8ea8] space-y-2 list-disc pl-5">
             <li>Hit to draw another card.</li>
             <li>Stand to keep your current total and let the dealer play.</li>
             <li>Beat the dealer's score or let them "Bust" (go over 21) to win 2x.</li>
          </ul>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
      
      <div className="flex flex-col gap-20">
         <div className="text-center">
            <div className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.4em] mb-8">Shadow Dealer</div>
            <div className="flex justify-center gap-4 min-h-[140px]">
               {dealerHand.map((c, i) => (
                 <div key={i} className="w-24 h-36 bg-[#0d0f1f] rounded-2xl border-2 border-amber-500/10 flex items-center justify-center text-4xl font-black text-white shadow-xl animate-slide-up">
                   {c}
                 </div>
               ))}
               {gameState === 'playing' && <div className="w-24 h-36 bg-[#0d0f1f]/40 rounded-2xl border-2 border-dashed border-white/5"></div>}
            </div>
            {dealerHand.length > 0 && <div className="mt-4 text-xs font-black text-amber-500/40 uppercase tracking-widest">Total: {getHandTotal(dealerHand)}</div>}
         </div>

         {msg && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
              <div className="px-10 py-4 bg-amber-500 text-black font-black text-2xl italic uppercase rounded-full shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                 {msg}
              </div>
           </div>
         )}

         <div className="text-center">
            <div className="flex justify-center gap-4 min-h-[140px] mb-8">
               {playerHand.map((c, i) => (
                 <div key={i} className="w-24 h-36 bg-white rounded-2xl border-b-8 border-slate-300 flex flex-col items-center justify-center text-4xl font-black text-black shadow-2xl animate-hop">
                   <span>{c}</span>
                   <i className="fas fa-spade text-xs mt-2 opacity-10"></i>
                 </div>
               ))}
            </div>
            <div className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.4em] mb-12">Your Hand Total: <span className="text-white">{getHandTotal(playerHand)}</span></div>

            {gameState === 'betting' || gameState === 'ended' ? (
              <div className="flex gap-4 max-w-xl mx-auto">
                 <div className="flex-1 bg-[#0d0f1f] border border-white/5 rounded-3xl p-5 flex items-center justify-between px-8">
                    <span className="text-amber-500 font-black text-lg">$</span>
                    <input type="number" value={bet} onChange={e => setBet(parseInt(e.target.value) || 0)} className="bg-transparent text-white font-black text-2xl text-right outline-none w-24" />
                 </div>
                 <button onClick={startHand} className="flex-1 bg-amber-500 text-black rounded-3xl font-black text-xl hover:bg-white transition-all shadow-xl shadow-amber-500/20 active:scale-95">ESTABLISH HAND</button>
              </div>
            ) : (
              <div className="flex gap-6 justify-center">
                 <button onClick={hit} className="px-14 py-6 bg-white text-black rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-2xl">HIT</button>
                 <button onClick={stand} className="px-14 py-6 bg-[#0d0f1f] border-2 border-white/10 text-white rounded-3xl font-black text-xl hover:bg-white/10 transition-all">STAND</button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default VipLounge;
