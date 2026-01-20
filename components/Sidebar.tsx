
import React from 'react';
import { GameID } from '../types';
import { COLORS } from '../constants';

interface SidebarProps {
  activeTab: GameID;
  setActiveTab: (tab: GameID) => void;
  isAdmin: boolean;
  userRank: string;
  t: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAdmin, userRank, t }) => {
  const isVip = userRank === 'Vip' || userRank === 'Media' || userRank === 'Owner';

  const sections = [
    {
      title: 'Main Terminal',
      items: [
        { id: GameID.HOME, icon: 'fa-gamepad', label: t.originals },
        { id: GameID.EXCLUSIVES, icon: 'fa-star', label: t.exclusives, badge: 'NEW' },
      ]
    },
    ...(isVip ? [{
      title: 'Elite Access',
      items: [
        { id: GameID.VIP_LOUNGE, icon: 'fa-gem', label: t.vip_lounge, badge: 'VIP' },
      ]
    }] : []),
    {
      title: 'Platform',
      items: [
        { id: GameID.LEADERBOARD, icon: 'fa-crown', label: t.leaderboard },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#0d0f1f] border-r border-[#1a1d2e] p-6">
      <div className="text-2xl font-black tracking-tighter mb-10 flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab(GameID.HOME)}>
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
           <span className="text-white text-xs font-black">B</span>
        </div>
        BLOX<span style={{ color: COLORS.accent }}>GAME</span>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.2em] px-4 mb-4">{section.title}</h4>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/5' 
                      : 'text-[#8b8ea8] hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`fas ${item.icon} text-lg w-6 transition-transform group-hover:scale-110`}></i>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-white text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse ${item.id === GameID.VIP_LOUNGE ? 'bg-amber-500' : 'bg-purple-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div className="pt-8 border-t border-white/5">
             <h4 className="text-[10px] font-black text-red-500/40 uppercase tracking-[0.2em] px-4 mb-4">Security</h4>
            <button
              onClick={() => setActiveTab(GameID.ADMIN)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === GameID.ADMIN ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-red-400/60 hover:text-red-400 hover:bg-red-500/5'
              }`}
            >
              <i className="fas fa-user-shield text-lg w-6"></i>
              <span className="text-sm">{t.admin}</span>
            </button>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
        <h4 className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.2em] px-4 mb-2">Settings</h4>
        <button
          onClick={() => setActiveTab(GameID.LANGUAGES)}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 group ${
            activeTab === GameID.LANGUAGES 
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
              : 'text-[#8b8ea8] hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <i className="fas fa-globe text-lg w-6 transition-transform group-hover:scale-110"></i>
          <span className="text-sm">{t.languages}</span>
        </button>
        
        <div className="p-5 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] border border-white/5 mt-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className={`w-1.5 h-1.5 rounded-full ${isVip ? 'bg-amber-500 animate-pulse' : 'bg-purple-500'}`}></div>
            <div className="text-[9px] text-[#4b5563] uppercase font-black tracking-[0.2em]">{userRank} Protocol</div>
          </div>
          <p className="text-[10px] text-[#8b8ea8] leading-tight font-black uppercase tracking-widest italic opacity-80">This will not release</p>
          <div className="mt-2 text-[7px] text-[#343a50] font-bold uppercase tracking-[0.4em]">Encrypted Session Active</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
