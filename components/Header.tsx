
import React from 'react';
import { User } from '../types';
import { COLORS } from '../constants';

interface HeaderProps {
  user: User;
  onProfile: () => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ user, onProfile, t }) => {
  return (
    <header className="h-24 px-8 flex items-center justify-between border-b border-[#1a1d2e] bg-[#060812]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="bg-[#161930] px-6 py-2.5 rounded-full border border-[#1a1d2e] flex items-center gap-3 shadow-inner">
          <span className="text-[#00ffa3] font-black text-xl">
            {Math.floor(user.bal).toLocaleString()}
          </span>
          <span className="text-[#4b5563] text-[10px] font-black uppercase tracking-widest">{t.balance}</span>
          <button className="ml-2 w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs hover:bg-purple-600 transition-all active:scale-90">
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div 
        className="flex items-center gap-4 cursor-pointer group"
        onClick={onProfile}
      >
        <div className="text-right hidden sm:block">
          <div className="font-black text-base group-hover:text-purple-400 transition-colors tracking-tight">{user.display}</div>
          <div className="text-[10px] text-purple-500 uppercase font-black tracking-widest">{user.rank}</div>
        </div>
        <div className="relative">
          <img 
            src={user.img} 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500 shadow-2xl shadow-purple-500/20 group-hover:scale-105 transition-transform" 
            alt="Avatar"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-[#060812] rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
