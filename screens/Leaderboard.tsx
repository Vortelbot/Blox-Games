
import React, { useState, useMemo } from 'react';
import { User, BetRecord } from '../types';

interface LeaderboardProps {
  bets?: BetRecord[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ bets = [] }) => {
  const [view, setView] = useState<'global' | 'vip'>('global');

  const allUsersObj = JSON.parse(localStorage.getItem('all_users') || '{}');
  const players: User[] = Object.values(allUsersObj);

  // Global: Sort by Balance
  const globalSorted = useMemo(() => 
    players.sort((a, b) => b.bal - a.bal).slice(0, 10),
  [players]);

  // VIP: Sort by Balance, but only VIP ranks
  const vipElite = useMemo(() => 
    players
      .filter(p => p.rank === 'Vip' || p.rank === 'Media' || p.rank === 'Owner')
      .sort((a, b) => b.bal - a.bal)
      .slice(0, 10),
  [players]);

  // VIP Performance: Biggest Wins in VIP games from current session
  const vipPerformance = useMemo(() => {
    const vipGames = ['Diamond Baccarat', 'Royale Roulette', 'Eclipse Blackjack'];
    return bets
      .filter(b => vipGames.includes(b.game) && b.payout > 0)
      .sort((a, b) => b.payout - a.payout)
      .slice(0, 5);
  }, [bets]);

  const currentData = view === 'global' ? globalSorted : vipElite;

  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-20">
      <div className="text-center mb-10">
        <h2 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">
          {view === 'global' ? 'Global' : 'VIP'} <span className={view === 'global' ? 'text-purple-500' : 'text-amber-500'}>Masters</span>
        </h2>
        <p className="text-[#8b8ea8] text-lg">Ranking the elite performers across the terminal.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-[#0d0f1f] p-1.5 rounded-2xl border border-white/5 flex gap-2">
          <button 
            onClick={() => setView('global')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'global' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-[#4b5563] hover:text-white'}`}
          >
            <i className="fas fa-globe mr-2"></i> Global Rankings
          </button>
          <button 
            onClick={() => setView('vip')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'vip' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-[#4b5563] hover:text-white'}`}
          >
            <i className="fas fa-gem mr-2"></i> VIP Elite
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentData.map((p, i) => (
          <div 
            key={p.name} 
            className={`group relative flex items-center justify-between p-8 rounded-[40px] border transition-all hover:scale-[1.01] ${
              view === 'vip' 
                ? 'bg-[#0d0f1f] border-amber-500/10 hover:border-amber-500/30' 
                : 'bg-[#0d0f1f] border-[#1a1d2e] hover:border-purple-500/30'
            }`}
          >
            {/* Rank Decor */}
            <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-2xl z-20 ${
              i === 0 ? 'bg-amber-500 text-black rotate-12' : 
              i === 1 ? 'bg-slate-300 text-black rotate-6' : 
              i === 2 ? 'bg-amber-800 text-white -rotate-6' : 
              'bg-[#1a1d2e] text-[#4b5563]'
            }`}>
              {i + 1}
            </div>

            <div className="flex items-center gap-6 pl-6">
              <div className="relative">
                <img 
                  src={p.img} 
                  className={`w-16 h-16 rounded-2xl object-cover border-2 shadow-2xl transition-transform group-hover:scale-110 ${
                    view === 'vip' ? 'border-amber-500/20' : 'border-purple-500/20'
                  }`} 
                  alt="Avatar" 
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#0d0f1f] ${
                  p.rank === 'Owner' ? 'bg-red-500' : p.rank === 'Media' ? 'bg-cyan-400' : p.rank === 'Vip' ? 'bg-amber-500' : 'bg-purple-500'
                }`}></div>
              </div>
              
              <div>
                <div className="font-black text-2xl tracking-tighter uppercase italic flex items-center gap-2">
                  {p.display}
                  {p.rank === 'Owner' && <i className="fas fa-crown text-red-500 text-sm"></i>}
                  {p.rank === 'Vip' && <i className="fas fa-gem text-amber-500 text-sm"></i>}
                  {p.rank === 'Media' && <i className="fas fa-video text-cyan-400 text-sm"></i>}
                </div>
                <div className="flex items-center gap-2 mt-1">
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${
                     p.rank === 'Owner' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                     p.rank === 'Media' ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' : 
                     p.rank === 'Vip' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                     'bg-purple-500/10 text-purple-400'
                   }`}>
                     {p.rank === 'Owner' && <i className="fas fa-crown text-[7px]"></i>}
                     {p.rank === 'Vip' && <i className="fas fa-gem text-[7px]"></i>}
                     {p.rank}
                   </span>
                </div>
              </div>
            </div>

            <div className="text-right pr-4">
              <div className={`text-3xl font-black italic tracking-tighter ${view === 'vip' ? 'text-amber-500' : 'text-[#00ffa3]'}`}>
                ${Math.floor(p.bal).toLocaleString()}
              </div>
              <div className="text-[10px] text-[#4b5563] font-black uppercase tracking-widest">Total Valuation</div>
            </div>
          </div>
        ))}

        {currentData.length === 0 && (
          <div className="text-center p-20 text-[#4b5563] italic">No legends detected in this sector.</div>
        )}
      </div>

      {view === 'vip' && (
        <div className="mt-20 space-y-8">
           <div className="flex items-center gap-4 px-4">
              <h3 className="text-2xl font-black italic uppercase text-amber-500 tracking-tighter">Elite Session Records</h3>
              <div className="flex-1 h-px bg-amber-500/10"></div>
              <span className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest">Top VIP Wins</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vipPerformance.map((rec, i) => (
                <div key={rec.id} className="bg-[#0d0f1f] border border-amber-500/10 rounded-3xl p-6 relative overflow-hidden group">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <img src={rec.avatar} className="w-10 h-10 rounded-xl border border-amber-500/20" alt="v" />
                         <span className="font-black text-sm text-white/80">{rec.user}</span>
                      </div>
                      <div className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                         {rec.multi.toFixed(2)}x
                      </div>
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                         <div className="text-[8px] font-black text-[#4b5563] uppercase mb-1">{rec.game}</div>
                         <div className="text-2xl font-black text-amber-500 tracking-tighter">${rec.payout.toLocaleString()}</div>
                      </div>
                      <i className="fas fa-crown text-amber-500/20 text-2xl group-hover:scale-110 transition-transform"></i>
                   </div>
                </div>
              ))}
              {vipPerformance.length === 0 && (
                <div className="col-span-full py-20 bg-amber-500/5 rounded-[40px] border border-dashed border-amber-500/10 text-center">
                   <i className="fas fa-gem text-amber-500/20 text-4xl mb-4"></i>
                   <p className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest">Awaiting high-roller data...</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
