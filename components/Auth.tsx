
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

    // Fixed Master Admin Logic
    const normalizedUser = username.toLowerCase().trim();
    const isAdminUser = normalizedUser === 'admin' || normalizedUser === 'jxly';
    const ADMIN_PASS = 'jxlyblox';

    if (isAdminUser && password === ADMIN_PASS) {
      user = {
        name: normalizedUser,
        password: ADMIN_PASS,
        display: normalizedUser === 'jxly' ? 'JXLY' : 'Admin',
        bal: allUsers[normalizedUser]?.bal || INITIAL_BALANCE * 100,
        rank: 'Owner',
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedUser}`
      };
      allUsers[normalizedUser] = user;
      localStorage.setItem('all_users', JSON.stringify(allUsers));
      onLogin(user);
      return;
    }

    if (mode === 'login') {
      if (!allUsers[username]) return alert("User does not exist!");
      if (allUsers[username].password !== password) return alert("Incorrect password!");
      user = allUsers[username];
    } else {
      if (allUsers[username]) return alert("Username already taken!");
      
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full"></div>
      
      <div className="w-full max-w-[440px] relative">
        <div className="bg-[#0d0f1f]/80 backdrop-blur-2xl rounded-[48px] p-10 md:p-14 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-center">
          <div className="mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/20">
               <span className="text-white text-3xl font-black italic">B</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic">
              BLOX<span className="text-purple-500">GAME</span>
            </h1>
            <p className="text-[#4b5563] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">High-Stakes Encryption</p>
          </div>

          <div className="flex bg-[#060812] rounded-2xl p-1 mb-8 border border-white/5">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${mode === 'login' ? 'bg-purple-500 text-white shadow-lg' : 'text-[#4b5563] hover:text-[#8b8ea8]'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${mode === 'signup' ? 'bg-purple-500 text-white shadow-lg' : 'text-[#4b5563] hover:text-[#8b8ea8]'}`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <i className="fas fa-user absolute left-6 top-1/2 -translate-y-1/2 text-purple-500/30 text-xs transition-colors group-focus-within:text-purple-500"></i>
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#060812] border border-white/5 rounded-[24px] py-5 pl-12 pr-6 text-sm focus:outline-none focus:border-purple-500/50 transition-all font-bold tracking-tight placeholder:text-[#343a50]"
              />
            </div>
            <div className="relative group">
              <i className="fas fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-purple-500/30 text-xs transition-colors group-focus-within:text-purple-500"></i>
              <input 
                type="password" 
                placeholder="Security Key" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#060812] border border-white/5 rounded-[24px] py-5 pl-12 pr-6 text-sm focus:outline-none focus:border-purple-500/50 transition-all font-bold tracking-tight placeholder:text-[#343a50]"
              />
            </div>
            
            <button 
              onClick={handleAuth}
              className="w-full py-6 bg-purple-500 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-purple-500/30 hover:bg-purple-600 hover:scale-[1.01] transition-all active:scale-[0.98] mt-4 uppercase italic tracking-tighter"
            >
              {mode === 'login' ? 'Establish Link' : 'Register Protocol'}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-4 opacity-20">
             <i className="fas fa-shield-halved text-xs"></i>
             <span className="text-[8px] font-black uppercase tracking-[0.5em]">RSA-4096 Certified</span>
             <i className="fas fa-terminal text-xs"></i>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[#4b5563] text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
           Connection secured via BLOX Neural Gateway.
        </p>
      </div>
    </div>
  );
};

export default Auth;
