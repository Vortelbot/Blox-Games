
import React from 'react';
import { GameID, User } from '../types';

interface HomeProps {
  onNavigate: (tab: GameID) => void;
  user?: User;
  t: any;
}

const Home: React.FC<HomeProps> = ({ onNavigate, user, t }) => {
  const trendingGames = [
    { id: GameID.CRASH, label: 'Crash', icon: 'fa-rocket', color: 'from-amber-500/20 to-amber-900/40', accent: 'text-amber-400', edge: '1.00%', live: true, desc: 'Global multiplayer event. Cash out before it explodes.' },
    { id: GameID.MINES, label: 'Mines', icon: 'fa-bomb', color: 'from-purple-500/20 to-purple-900/40', accent: 'text-purple-400', edge: '1.00%', desc: 'Find gems, avoid the hidden bombs.' },
    { id: GameID.TOWER, label: 'Towers', icon: 'fa-layer-group', color: 'from-blue-500/20 to-blue-900/40', accent: 'text-blue-400', edge: '1.50%', desc: 'Climb the tower for exponential rewards.' },
  ];

  const classicGames = [
    { id: GameID.PLINKO, label: 'Plinko', icon: 'fa-braille', color: 'from-pink-500/20 to-pink-900/40', accent: 'text-pink-400', edge: '1.00%', desc: 'Drop the ball and hit massive multipliers.' },
    { id: GameID.LIMBO, label: 'Limbo', icon: 'fa-rocket', color: 'from-orange-500/20 to-orange-900/40', accent: 'text-orange-400', edge: '1.00%', desc: 'Bet on how high the rocket will go.' },
    { id: GameID.DICE, label: 'Dice', icon: 'fa-dice', color: 'from-rose-500/20 to-rose-900/40', accent: 'text-rose-400', edge: '1.00%', desc: 'Classic target-based high stakes dice.' },
    { id: GameID.SLOTS, label: 'Slots', icon: 'fa-random', color: 'from-yellow-500/20 to-amber-900/40', accent: 'text-amber-400', edge: '2.00%', desc: 'The elite golden 3-reel experience.' },
    { id: GameID.COINFLIP, label: 'Coinflip', icon: 'fa-coins', color: 'from-cyan-500/20 to-cyan-900/40', accent: 'text-cyan-400', edge: '2.50%', desc: 'Pure 50/50 action. Double or nothing.' },
  ];

  const GameCard = (game: any) => (
    <div
      key={game.id}
      onClick={() => onNavigate(game.id)}
      className="group relative cursor-pointer overflow-hidden rounded-[36px] bg-[#0d0f1f] border border-white/5 p-1 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)] h-[280px]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative z-10 bg-[#0d0f1f]/90 backdrop-blur-xl h-full rounded-[32px] p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${game.accent} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white/10`}>
            <i className={`fas ${game.icon} text-3xl`}></i>
          </div>
          <div className="bg-black/40 px-3 py-1 rounded-full border border-white/5 text-[10px] font-black text-[#4b5563] tracking-widest uppercase">
            {t.edge} {game.edge}
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter mb-2">{game.label}</h3>
          <p className="text-[#8b8ea8] text-xs font-medium line-clamp-2 pr-4">{game.desc}</p>
        </div>
        <div className="absolute bottom-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{t.play_now}</span>
          <i className="fas fa-arrow-right text-xs"></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-slide-up space-y-16">
      {/* Hero Section */}
      <section className="relative h-[440px] rounded-[56px] overflow-hidden group">
        <div className="absolute inset-0 bg-[#0d0f1f] border border-white/5"></div>
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden opacity-30 pointer-events-none">
           <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[140%] bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-transparent blur-[120px] animate-pulse"></div>
           <div className="grid grid-cols-12 h-full w-full rotate-12 scale-150">
             {Array.from({length: 12}).map((_, i) => <div key={i} className="border-r border-white/5 h-full"></div>)}
           </div>
        </div>

        <div className="relative z-10 h-full p-16 flex flex-col justify-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-6">
            <i className="fas fa-sparkles"></i>
            {t.featured_game}
          </div>
          <h1 className="text-7xl font-black tracking-tighter mb-6 leading-none italic">
            {t.welcome_back} <span className="text-purple-500">{user?.display || 'Player'}</span>
          </h1>
          <p className="text-[#8b8ea8] text-xl font-medium leading-relaxed mb-10">
            {t.house_open}
          </p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate(GameID.BLOX_RUN)}
              className="px-12 py-5 bg-purple-500 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-purple-500/20 hover:bg-white hover:text-black transition-all active:scale-95"
            >
              {t.play_now} BLOX RUN
            </button>
            <button 
              onClick={() => onNavigate(GameID.EXCLUSIVES)}
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[28px] font-black text-lg hover:bg-white/10 transition-all"
            >
              {t.view_all_exclusives}
            </button>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">{t.trending_now}</h2>
            <div className="h-px w-32 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingGames.map(GameCard)}
        </div>
      </section>

      {/* Classic Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">{t.classic_originals}</h2>
            <div className="h-px w-32 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classicGames.map(GameCard)}
        </div>
      </section>
    </div>
  );
};

export default Home;
