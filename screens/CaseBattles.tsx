
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User } from '../types';

interface CaseBattlesProps {
  user: User;
  updateBalance: (amt: number) => void;
  addBet: (game: string, bet: number, multi: number, payout: number) => void;
}

interface CaseItem {
  id: string;
  name: string;
  skin: string;
  value: number;
  rarity: 'blue' | 'purple' | 'pink' | 'red' | 'gold';
  img: string;
}

interface CaseType {
  id: string;
  name: string;
  price: number;
  items: CaseItem[];
  color: string;
}

const RARITY_COLORS = {
  blue: '#4b69ff',
  purple: '#8847ff',
  pink: '#d32ce6',
  red: '#eb4b4b',
  gold: '#e4ae39',
};

// Simulated CS2-style items
const ITEMS: CaseItem[] = [
  { id: '1', name: 'USP-S', skin: 'Cyrex', value: 15, rarity: 'blue', img: '🔫' },
  { id: '2', name: 'Glock-18', skin: 'Candy Apple', value: 12, rarity: 'blue', img: '🔫' },
  { id: '3', name: 'MP9', skin: 'Modest', value: 8, rarity: 'blue', img: '🔫' },
  { id: '4', name: 'AK-47', skin: 'Slate', value: 45, rarity: 'purple', img: '🔫' },
  { id: '5', name: 'M4A4', skin: 'Spider Lily', value: 38, rarity: 'purple', img: '🔫' },
  { id: '6', name: 'AWP', skin: 'Atheris', value: 65, rarity: 'purple', img: '🔫' },
  { id: '7', name: 'Desert Eagle', skin: 'Printstream', value: 210, rarity: 'pink', img: '🔫' },
  { id: '8', name: 'M4A1-S', skin: 'Player Two', value: 180, rarity: 'pink', img: '🔫' },
  { id: '9', name: 'AK-47', skin: 'Vulcan', value: 850, rarity: 'red', img: '🔫' },
  { id: '10', name: 'AWP', skin: 'Dragon Lore', value: 12500, rarity: 'gold', img: '🗡️' },
  { id: '11', name: 'Karambit', skin: 'Doppler', value: 2400, rarity: 'gold', img: '🗡️' },
  { id: '12', name: 'Butterfly Knife', skin: 'Fade', value: 3200, rarity: 'gold', img: '🗡️' },
];

const CASES: CaseType[] = [
  { 
    id: 'broken_fang', 
    name: 'Broken Fang Case', 
    price: 150, 
    color: 'text-blue-400',
    items: ITEMS.filter(i => ['blue', 'purple', 'pink', 'gold'].includes(i.rarity)).slice(0, 8)
  },
  { 
    id: 'snakebite', 
    name: 'Snakebite Case', 
    price: 500, 
    color: 'text-purple-400',
    items: ITEMS.filter(i => ['purple', 'pink', 'red', 'gold'].includes(i.rarity)).slice(0, 8)
  },
  { 
    id: 'operation_wildfire', 
    name: 'Wildfire Case', 
    price: 2500, 
    color: 'text-red-400',
    items: ITEMS.filter(i => ['pink', 'red', 'gold'].includes(i.rarity))
  },
];

// Helper to pick a random item based on weights
const rollItem = (caseItems: CaseItem[]) => {
  const weights: Record<string, number> = { blue: 80, purple: 15, pink: 4, red: 0.8, gold: 0.2 };
  const pool = caseItems.map(item => ({ item, weight: weights[item.rarity] || 1 }));
  const totalWeight = pool.reduce((acc, curr) => acc + curr.weight, 0);
  let random = Math.random() * totalWeight;
  for (const entry of pool) {
    if (random < entry.weight) return entry.item;
    random -= entry.weight;
  }
  return pool[0].item;
};

const CaseBattles: React.FC<CaseBattlesProps> = ({ user, updateBalance, addBet }) => {
  const [selectedCase, setSelectedCase] = useState<CaseType>(CASES[0]);
  const [rounds, setRounds] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'opening' | 'results'>('idle');
  const [playerTotal, setPlayerTotal] = useState(0);
  const [botTotal, setBotTotal] = useState(0);
  const [playerHistory, setPlayerHistory] = useState<CaseItem[]>([]);
  const [botHistory, setBotHistory] = useState<CaseItem[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  
  const [spinningRound, setSpinningRound] = useState<number | null>(null);
  const [pReel, setPReel] = useState<CaseItem[]>([]);
  const [bReel, setBReel] = useState<CaseItem[]>([]);

  const timeoutRef = useRef<any>(null);

  const startBattle = () => {
    const totalCost = selectedCase.price * rounds;
    if (user.bal < totalCost) return alert("Insufficient balance for this battle!");
    
    updateBalance(-totalCost);
    setGameState('opening');
    setPlayerTotal(0);
    setBotTotal(0);
    setPlayerHistory([]);
    setBotHistory([]);
    setCurrentRound(0);

    runRound(0);
  };

  const runRound = (roundIndex: number) => {
    if (roundIndex >= rounds) {
      setGameState('results');
      return;
    }

    setCurrentRound(roundIndex + 1);
    setSpinningRound(roundIndex);

    const pWinner = rollItem(selectedCase.items);
    const bWinner = rollItem(selectedCase.items);

    const generateReel = (winner: CaseItem) => {
      const reel = Array.from({ length: 40 }, () => selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)]);
      reel[35] = winner;
      return reel;
    };

    setPReel(generateReel(pWinner));
    setBReel(generateReel(bWinner));

    timeoutRef.current = setTimeout(() => {
      setPlayerHistory(prev => [...prev, pWinner]);
      setBotHistory(prev => [...prev, bWinner]);
      setPlayerTotal(prev => prev + pWinner.value);
      setBotTotal(prev => prev + bWinner.value);
      setSpinningRound(null);

      timeoutRef.current = setTimeout(() => {
        runRound(roundIndex + 1);
      }, 1000);
    }, 4000);
  };

  useEffect(() => {
    if (gameState === 'results') {
      const totalWager = selectedCase.price * rounds;
      const win = playerTotal > botTotal;
      const draw = playerTotal === botTotal;
      
      let payout = 0;
      let multi = 0;

      if (win) {
        payout = totalWager * 2;
        multi = 2;
        updateBalance(payout);
      } else if (draw) {
        payout = totalWager;
        multi = 1;
        updateBalance(payout);
      }

      addBet('CaseBattle', totalWager, multi, payout);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState, playerTotal, botTotal, rounds, selectedCase, updateBalance, addBet]);

  return (
    <div className="max-w-7xl mx-auto animate-slide-up space-y-8 pb-20 relative">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Sidebar Controls */}
        <div className="w-full xl:w-96 space-y-6">
          <div className="bg-[#0d0f1f] rounded-[48px] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowHelp(!showHelp)} 
              className="absolute top-10 right-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-[#4b5563] transition-all z-20"
            >
              <i className="fas fa-info"></i>
            </button>

            {showHelp && (
              <div className="absolute top-20 left-6 right-6 bg-[#161930] p-6 rounded-3xl border border-purple-500/30 z-50 shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-black text-purple-400 text-xs uppercase tracking-widest">How to Play</h4>
                  <button onClick={() => setShowHelp(false)} className="text-[#4b5563] hover:text-white"><i className="fas fa-times"></i></button>
                </div>
                <p className="text-[11px] text-[#8b8ea8] leading-relaxed">
                  Face off against a bot in a sequence of case openings. Each case contains a random skin. The player with the highest total value at the end wins the entire jackpot (2x the wager).
                </p>
              </div>
            )}

            <h2 className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.4em] mb-10 text-center">Engagement Terminal</h2>
            
            <div className="space-y-6">
              <label className="text-[10px] font-black text-[#4b5563] uppercase block mb-2">Inventory Access</label>
              <div className="grid grid-cols-1 gap-3">
                {CASES.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => gameState !== 'opening' && setSelectedCase(c)}
                    disabled={gameState === 'opening'}
                    className={`group p-5 rounded-[28px] border transition-all text-left flex justify-between items-center relative overflow-hidden ${selectedCase.id === c.id ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-[#060812] border-white/5 text-[#8b8ea8] hover:border-white/10'}`}
                  >
                    <div className="relative z-10 flex flex-col">
                      <span className="font-black text-sm tracking-tight">{c.name}</span>
                      <span className="text-[10px] font-bold opacity-60 uppercase">{c.items.length} Potential Skins</span>
                    </div>
                    <span className="relative z-10 font-black text-lg">${c.price}</span>
                    {selectedCase.id === c.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-[#4b5563] uppercase">Duration</label>
                  <span className="text-xs font-black text-purple-400">{rounds} ROUNDS</span>
                </div>
                <div className="flex gap-2">
                  {[1, 3, 5, 10].map(r => (
                    <button 
                      key={r}
                      onClick={() => setRounds(r)}
                      disabled={gameState === 'opening'}
                      className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${rounds === r ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-[#060812] text-[#4b5563] hover:bg-white/5 border border-white/5'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#4b5563] uppercase">Commitment</span>
                    <span className="text-3xl font-black text-white">${(selectedCase.price * rounds).toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-[#4b5563] uppercase">Jackpot</span>
                    <span className="text-3xl font-black text-emerald-400 block">${(selectedCase.price * rounds * 2).toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={startBattle}
                  disabled={gameState === 'opening'}
                  className="w-full py-7 bg-purple-500 text-white rounded-[32px] font-black text-2xl shadow-2xl shadow-purple-500/30 hover:bg-purple-600 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  {gameState === 'opening' ? `ROUND ${currentRound}` : 'INITIATE BATTLE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Field */}
        <div className="flex-1 flex flex-col gap-8">
           <div className="bg-[#0d0f1f] rounded-[48px] border border-white/5 p-8 flex justify-between items-center shadow-xl">
              <div className="flex items-center gap-8">
                 <div className="relative">
                   <img src={user.img} className="w-20 h-20 rounded-3xl border-4 border-purple-500 shadow-2xl" alt="You" />
                   <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg">YOU</div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.2em] mb-1">Combatant Sum</div>
                    <div className="text-5xl font-black tracking-tighter text-white">${playerTotal.toLocaleString()}</div>
                 </div>
              </div>

              <div className="hidden lg:flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-[#060812] border-2 border-white/10 flex items-center justify-center font-black text-white/10 italic text-xl">VS</div>
                 {gameState === 'results' && (
                    <div className={`mt-4 px-8 py-2.5 rounded-full font-black text-sm uppercase tracking-[0.3em] shadow-xl animate-bounce ${playerTotal > botTotal ? 'bg-emerald-500 text-white' : playerTotal < botTotal ? 'bg-rose-500 text-white' : 'bg-white/10 text-white'}`}>
                        {playerTotal > botTotal ? 'VICTORY' : playerTotal < botTotal ? 'DEFEAT' : 'STALEMATE'}
                    </div>
                 )}
              </div>

              <div className="flex items-center gap-8 text-right">
                 <div>
                    <div className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.2em] mb-1">Opponent Sum</div>
                    <div className="text-5xl font-black tracking-tighter text-white">${botTotal.toLocaleString()}</div>
                 </div>
                 <div className="relative">
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=CombatBot" className="w-20 h-20 rounded-3xl border-4 border-rose-500 shadow-2xl" alt="Bot" />
                    <div className="absolute -bottom-2 -left-2 bg-rose-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg">BOT</div>
                 </div>
              </div>
           </div>

           <div className="bg-[#0d0f1f] rounded-[64px] border border-white/5 shadow-2xl overflow-hidden flex flex-col min-h-[700px] relative p-12">
              <div className="grid grid-cols-2 gap-12 h-full">
                 {/* Player Side */}
                 <div className="space-y-4 flex flex-col">
                    <div className="flex-1 space-y-4">
                      {Array.from({length: rounds}).map((_, i) => (
                        <div key={i} className="relative h-32">
                          {spinningRound === i ? (
                             <CaseReel reel={pReel} color={RARITY_COLORS.blue} />
                          ) : (
                            <div className={`h-full rounded-[32px] border transition-all duration-700 flex items-center justify-between px-10 ${playerHistory[i] ? 'bg-white/[0.03] border-white/10' : 'bg-[#060812] border-white/5 opacity-40'}`}>
                               <div className="flex items-center gap-6">
                                  <span className="text-[11px] font-black text-[#4b5563] uppercase w-12">RD {i+1}</span>
                                  {playerHistory[i] && (
                                     <div className="flex items-center gap-5 animate-slide-up">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-black/40 border-2" style={{ borderColor: (RARITY_COLORS as any)[playerHistory[i].rarity] }}>
                                           {playerHistory[i].img}
                                        </div>
                                        <div>
                                           <div className="text-[10px] font-black uppercase opacity-40" style={{ color: (RARITY_COLORS as any)[playerHistory[i].rarity] }}>{playerHistory[i].rarity}</div>
                                           <div className="text-lg font-black tracking-tight text-white">{playerHistory[i].name} | {playerHistory[i].skin}</div>
                                        </div>
                                     </div>
                                  )}
                               </div>
                               {playerHistory[i] && (
                                  <span className="text-3xl font-black text-emerald-400 animate-slide-up">${playerHistory[i].value.toLocaleString()}</span>
                               )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Bot Side */}
                 <div className="space-y-4 flex flex-col">
                    <div className="flex-1 space-y-4">
                      {Array.from({length: rounds}).map((_, i) => (
                        <div key={i} className="relative h-32">
                           {spinningRound === i ? (
                             <CaseReel reel={bReel} color={RARITY_COLORS.red} />
                           ) : (
                            <div className={`h-full rounded-[32px] border transition-all duration-700 flex items-center justify-between px-10 ${botHistory[i] ? 'bg-white/[0.03] border-white/10' : 'bg-[#060812] border-white/5 opacity-40'}`}>
                                {botHistory[i] && (
                                  <span className="text-3xl font-black text-rose-400 animate-slide-up">${botHistory[i].value.toLocaleString()}</span>
                                )}
                                <div className="flex items-center gap-6 text-right">
                                  {botHistory[i] && (
                                     <div className="flex items-center gap-5 animate-slide-up">
                                        <div>
                                           <div className="text-[10px] font-black uppercase opacity-40" style={{ color: (RARITY_COLORS as any)[botHistory[i].rarity] }}>{botHistory[i].rarity}</div>
                                           <div className="text-lg font-black tracking-tight text-white">{botHistory[i].name} | {botHistory[i].skin}</div>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-black/40 border-2" style={{ borderColor: (RARITY_COLORS as any)[botHistory[i].rarity] }}>
                                           {botHistory[i].img}
                                        </div>
                                     </div>
                                  )}
                                  <span className="text-[11px] font-black text-[#4b5563] uppercase w-12">RD {i+1}</span>
                               </div>
                            </div>
                           )}
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              {gameState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="text-center">
                      <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-10 mx-auto border-2 border-white/5">
                        <i className="fas fa-briefcase text-5xl text-white/10"></i>
                      </div>
                      <div className="text-[12px] font-black text-white/10 uppercase tracking-[0.8em]">Operational Status: Standby</div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

// Internal Component for the Reel Animation
const CaseReel: React.FC<{ reel: CaseItem[], color: string }> = ({ reel, color }) => {
  return (
    <div className="h-full w-full bg-[#060812] rounded-[32px] border-2 border-white/10 overflow-hidden relative shadow-2xl">
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-white/40 z-30 shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
      
      <div 
        className="flex items-center absolute left-0 top-0 bottom-0 transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0.1, 1)"
        style={{ 
          width: `${reel.length * 150}px`, 
          transform: `translateX(calc(-35 * 150px + 50% - 75px))` 
        }}
      >
        {reel.map((item, i) => (
          <div 
            key={i} 
            className="w-[150px] h-full flex flex-col items-center justify-center p-4 border-r border-white/5 relative"
          >
             <div 
               className="absolute bottom-0 left-0 right-0 h-1" 
               style={{ backgroundColor: (RARITY_COLORS as any)[item.rarity] }}
             ></div>
             <div className="text-4xl mb-2">{item.img}</div>
             <div className="text-[8px] font-black uppercase text-white/40 truncate w-full text-center">{item.name}</div>
             <div className="text-[9px] font-black text-white truncate w-full text-center">{item.skin}</div>
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#060812] via-transparent to-[#060812] opacity-80"></div>
    </div>
  );
};

export default CaseBattles;
