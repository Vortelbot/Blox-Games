
import React from 'react';
import { BetRecord } from '../types';

interface LiveFeedProps {
  bets: BetRecord[];
}

const RankBadge: React.FC<{ rank: string }> = ({ rank }) => {
  switch (rank) {
    case 'Owner':
      return <span className="text-[8px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-tighter">Owner</span>;
    case 'Media':
      return (
        <span className="text-[8px] font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase tracking-tighter flex items-center gap-1">
          <i className="fas fa-film text-[7px]"></i> Media
        </span>
      );
    case 'Vip':
      return <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-tighter">VIP</span>;
    default:
      return null;
  }
};

const LiveFeed: React.FC<LiveFeedProps> = ({ bets }) => {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest">Recent Activity</span>
        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">REALTIME</span>
      </div>
      
      {bets.length === 0 ? (
        <div className="text-center py-20 px-6">
          <i className="fas fa-satellite text-4xl text-white/5 mb-4"></i>
          <p className="text-[#4b5563] text-xs font-bold uppercase tracking-widest leading-loose">
            Listening for network signals...
          </p>
        </div>
      ) : (
        bets.map((bet) => (
          <div 
            key={bet.id} 
            className="bg-[#060812] rounded-2xl p-4 border border-white/5 hover:border-purple-500/20 transition-all group animate-slide-up"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={bet.avatar} className="w-8 h-8 rounded-lg border border-purple-500/20 flex-shrink-0" alt="p" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="text-[11px] font-black text-white truncate">{bet.user}</div>
                    <RankBadge rank={bet.rank} />
                  </div>
                  <div className="text-[9px] font-black text-purple-500 uppercase tracking-tighter">{bet.game}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] font-black text-white">{bet.multi.toFixed(2)}x</div>
                <div className="text-[8px] font-bold text-[#4b5563] uppercase">MULTI</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-[#4b5563] uppercase">Wager</span>
                  <span className="text-[11px] font-bold text-white/70">${bet.bet.toLocaleString()}</span>
               </div>
               <div className="text-right flex flex-col">
                  <span className="text-[8px] font-black text-[#4b5563] uppercase">Payout</span>
                  <span className={`text-[11px] font-black ${bet.payout > bet.bet ? 'text-[#00ffa3]' : 'text-white/20'}`}>
                    ${bet.payout.toLocaleString()}
                  </span>
               </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LiveFeed;
