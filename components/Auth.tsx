
import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_BALANCE } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
  t: any;
}

const Auth: React.FC<AuthProps> = ({ onLogin, t }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleAuth = () => {
    if (username.length < 3) return alert("Username too short!");
    if (password.length < 4) return alert("Password must be at least 4 characters!");
    
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '{}');
    let user: User;

    // Fixed Master Admin Logic: admin/jxly always works with the correct pass
    const normalizedUser = username.toLowerCase();
    const isAdminUser = normalizedUser === 'admin' || normalizedUser === 'jxly';
    const ADMIN_PASS = 'jxlyblox';

    if (isAdminUser && password === ADMIN_PASS) {
      // If admin doesn't exist in storage, create it now.
      if (!allUsers[username]) {
        user = {
          name: username,
          password,
          display: username,
          bal: INITIAL_BALANCE * 10, // Admin start bonus
          rank: 'Owner',
          img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        };
        allUsers[username] = user;
        localStorage.setItem('all_users', JSON.stringify(allUsers));
      } else {
        user = allUsers[username];
        // Correct rank if it was somehow changed
        if (user.rank !== 'Owner') {
          user.rank = 'Owner';
          allUsers[username] = user;
          localStorage.setItem('all_users', JSON.stringify(allUsers));
        }
      }
      onLogin(user);
      return;
    }

    if (mode === 'login') {
      if (!allUsers[username]) return alert("User does not exist!");
      if (allUsers[username].password !== password) return alert("Incorrect password!");
      user = allUsers[username];
    } else {
      if (allUsers[username]) return alert("Username already taken!");
      
      // Normal signup
      user = {
        name: username,
        password,
        display: username,
        bal: INITIAL_BALANCE,
        rank: 'Player',
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      };
      allUsers[username] = user;
      localStorage.setItem('all_users', JSON.stringify(allUsers));
    }
    onLogin(user);
  };

  return (
    <div className="fixed inset-0 bg-[#060812] flex items-center justify-center p-6 z-[1000] overflow-hidden">
      {/* Animated Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[180px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[180px] rounded-full"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="w-full max-w-[460px] relative">
        <div className="bg-[#0d0f1f]/60 backdrop-blur-3xl rounded-[64px] p-10 md:p-14 border border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.9)] text-center">
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(168,85,247,0.3)] transform rotate-3">
               <span className="text-white text-4xl font-black italic -rotate-3">B</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-2 italic uppercase">
              BLOX<span className="text-purple-500">GAME</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
              <p className="text-[#4b5563] text-[9px] font-black uppercase tracking-[0.5em]">System Encrypted / V3.5.2</p>
            </div>
          </div>

          <div className="flex bg-[#060812]/50 rounded-[28px] p-1.5 mb-10 border border-white/5 backdrop-blur-sm">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-[22px] transition-all duration-500 ${mode === 'login' ? 'bg-purple-500 text-white shadow-[0_10px_25px_rgba(168,85,247,0.4)]' : 'text-[#4b5563] hover:text-[#8b8ea8]'}`}
            >
              Terminal Login
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-[22px] transition-all duration-500 ${mode === 'signup' ? 'bg-purple-500 text-white shadow-[0_10px_25px_rgba(168,85,247,0.4)]' : 'text-[#4b5563] hover:text-[#8b8ea8]'}`}
            >
              New Protocol
            </button>
          </div>

          <div className="space-y-5">
            <div className="group relative">
              <i className="fas fa-user absolute left-7 top-1/2 -translate-y-1/2 text-purple-500/40 text-xs transition-colors group-focus-within:text-purple-400"></i>
              <input 
                type="text" 
                placeholder="Identification" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#060812]/80 border border-white/5 rounded-[32px] py-6 pl-14 pr-8 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 transition-all font-bold tracking-tight placeholder:text-[#343a50]"
              />
            </div>
            <div className="group relative">
              <i className="fas fa-fingerprint absolute left-7 top-1/2 -translate-y-1/2 text-purple-500/40 text-xs transition-colors group-focus-within:text-purple-400"></i>
              <input 
                type="password" 
                placeholder="Access Hash" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#060812]/80 border border-white/5 rounded-[32px] py-6 pl-14 pr-8 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 transition-all font-bold tracking-tight placeholder:text-[#343a50]"
              />
            </div>
            
            <button 
              onClick={handleAuth}
              className="w-full py-7 bg-purple-500 text-white rounded-[32px] font-black text-2xl shadow-[0_20px_50px_rgba(168,85,247,0.3)] hover:bg-purple-600 hover:scale-[1.02] transition-all active:scale-[0.98] mt-6 uppercase italic tracking-tighter"
            >
              {mode === 'login' ? 'ESTABLISH LINK' : 'INITIATE SYNC'}
            </button>
          </div>

          <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between opacity-30">
             <div className="flex items-center gap-3">
               <i className="fas fa-microchip text-[10px]"></i>
               <span className="text-[8px] font-black uppercase tracking-[0.4em]">Hardware Lock</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[8px] font-black uppercase tracking-[0.4em]">Secure Node</span>
               <i className="fas fa-network-wired text-[10px]"></i>
             </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-[#4b5563] text-[9px] font-black uppercase tracking-[0.5em] opacity-40">
           Connection secured via BLOX Neural Gateway.
        </p>
      </div>
    </div>
  );
};

export default Auth;
