
import React from 'react';
import { GameID } from '../types';

interface ExclusivesProps {
  onNavigate: (tab: GameID) => void;
  t: any;
}

const Exclusives: React.FC<ExclusivesProps> = ({ onNavigate, t }) => {
  const exclusiveGames = [
    { 
      id: GameID.BLOX_RUN, 
      label: 'Blox Run', 
      icon: 'fa-running', 
      color: 'from-cyan-500/20 to-cyan-900/40', 
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      accent: 'text-cyan-400', 
      edge: '0.80%', 
      badge: t.high_speed,
      desc: 'Unique high-speed multiplier dash. Only found on BloxGame.' 
    },
    { 
      id: GameID.CRASH, 
      label: 'Premium Crash', 
      icon: 'fa-rocket', 
      color: 'from-purple-500/20 to-purple-900/40', 
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      accent: 'text-purple-400', 
      edge: '1.00%', 
      badge: t.ultra_responsive,
      desc: 'The most responsive crash in the industry with exclusive themes.' 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-slide-up space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">
            <i className="fas fa-shield-check"></i>
            Authenticated Exclusives
          </div>
          <h2 className="text-7xl font-black tracking-tighter">
            {t.exclusives.split(' ')[0]} <span className="text-cyan-400">{t.exclusives.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-[#8b8ea8] text-xl mt-4 max-w-2xl font-medium">
            Proprietary gaming engines developed in-house. These experiences cannot be found on any other platform.
          </p>
        </div>
        <div className="bg-[#0d0f1f] p-6 rounded-[32px] border border-white/5 flex items-center gap-5 shadow-xl">
           <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 text-2xl shadow-inner">
             <i className="fas fa-lock-open"></i>
           </div>
           <div>
             <div className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest mb-1">Status Protocol</div>
             <div className="text-base font-black text-white italic">CYBER-SYNC ACTIVE</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {exclusiveGames.map((game) => (
          <div
            key={game.id}
            onClick={() => onNavigate(game.id)}
            className="group relative cursor-pointer overflow-hidden rounded-[64px] bg-[#0d0f1f] border border-cyan-500/10 p-1.5 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_80px_160px_rgba(0,0,0,0.8)] h-[460px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-100 transition-opacity duration-700`}></div>
            
            <div className="relative z-10 bg-[#060812]/90 backdrop-blur-3xl h-full rounded-[58px] p-16 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-all duration-700"></div>
              
              <div className="flex justify-between items-start relative z-20">
                <div className={`w-28 h-28 rounded-[40px] bg-white/5 flex items-center justify-center ${game.accent} ${game.glow} transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-cyan-500/20`}>
                  <i className={`fas ${game.icon} text-6xl`}></i>
                </div>
                <div className="flex flex-col items-end gap-3">
                   <div className="bg-cyan-500 text-black px-5 py-2 rounded-full text-[11px] font-black tracking-widest uppercase italic shadow-lg shadow-cyan-500/20">
                    {t.proprietary}
                  </div>
                  <div className="text-xs font-black text-cyan-400/60 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                    {t.edge} {game.edge}
                  </div>
                </div>
              </div>

              <div className="relative z-20">
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-3">{game.badge}</div>
                <h3 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">{game.label}</h3>
                <p className="text-[#8b8ea8] text-lg font-medium leading-relaxed pr-24">{game.desc}</p>
              </div>

              <div className="flex items-center justify-start relative z-20">
                 <button className="px-12 py-5 bg-cyan-500 text-black rounded-[28px] font-black text-lg uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-cyan-500/20 active:scale-95">
                    {t.play_now}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exclusives;
