
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AdminProps {
  user: User;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  const [targetUser, setTargetUser] = useState('');
  const [amount, setAmount] = useState(1000);
  const [isMaintenance, setIsMaintenance] = useState(false);
  
  // Rank Management State
  const [rankTarget, setRankTarget] = useState('');
  const [newRank, setNewRank] = useState('Player');

  useEffect(() => {
    const maintenanceStatus = localStorage.getItem('maintenance_mode') === 'true';
    setIsMaintenance(maintenanceStatus);
  }, []);

  const handleGiveMoney = () => {
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '{}');
    if (!allUsers[targetUser]) return alert("User not found!");
    
    allUsers[targetUser].bal += amount;
    localStorage.setItem('all_users', JSON.stringify(allUsers));
    alert(`Gave $${amount} to ${targetUser}`);
  };

  const handleUpdateRank = () => {
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '{}');
    if (!allUsers[rankTarget]) return alert("User not found!");
    
    allUsers[rankTarget].rank = newRank;
    localStorage.setItem('all_users', JSON.stringify(allUsers));
    alert(`Updated ${rankTarget} rank to: ${newRank}`);
  };

  const toggleMaintenance = () => {
    const newState = !isMaintenance;
    localStorage.setItem('maintenance_mode', newState.toString());
    setIsMaintenance(newState);
    alert(`Maintenance Mode: ${newState ? 'ENABLED' : 'DISABLED'}`);
    window.location.reload();
  };

  const resetLeaderboard = () => {
    alert("Leaderboard calculations refreshed.");
  };

  return (
    <div className="max-w-7xl mx-auto animate-slide-up pb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-red-500/20">
           <i className="fas fa-user-shield"></i>
        </div>
        <h2 className="text-4xl font-black tracking-tighter italic">SYSTEM <span className="text-red-500">CONTROL</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Money Control */}
        <div className="bg-[#0d0f1f] p-8 rounded-[40px] border border-white/5 shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <i className="fas fa-coins text-amber-500"></i> Balance Injection
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#4b5563] uppercase block mb-2">Username</label>
              <input 
                type="text" value={targetUser} onChange={(e) => setTargetUser(e.target.value)}
                placeholder="exact_name"
                className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-4 text-sm focus:border-purple-500 transition-all outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4b5563] uppercase block mb-2">Amount</label>
              <input 
                type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-4 text-sm focus:border-purple-500 transition-all outline-none font-bold"
              />
            </div>
            <button 
              onClick={handleGiveMoney}
              className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 active:scale-95"
            >
              INJECT USD
            </button>
          </div>
        </div>

        {/* Rank Management */}
        <div className="bg-[#0d0f1f] p-8 rounded-[40px] border border-white/5 shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <i className="fas fa-crown text-purple-500"></i> Rank Promotion
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#4b5563] uppercase block mb-2">Target Username</label>
              <input 
                type="text" value={rankTarget} onChange={(e) => setRankTarget(e.target.value)}
                placeholder="player_name"
                className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-4 text-sm focus:border-purple-500 transition-all outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4b5563] uppercase block mb-2">Select Designation</label>
              <select 
                value={newRank} onChange={(e) => setNewRank(e.target.value)}
                className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl p-4 text-sm focus:border-purple-500 transition-all outline-none font-bold text-white appearance-none"
              >
                <option value="Player">Player</option>
                <option value="Media">Media (1.1x Multi)</option>
                <option value="Vip">Vip (VIP Lounge Access)</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
            <button 
              onClick={handleUpdateRank}
              className="w-full py-4 bg-purple-500 text-white rounded-2xl font-black hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/10 active:scale-95"
            >
              UPGRADE RANK
            </button>
          </div>
        </div>

        {/* Overrides */}
        <div className="bg-[#0d0f1f] p-8 rounded-[40px] border border-white/5 shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <i className="fas fa-server text-red-500"></i> Overrides
          </h3>
          <div className="space-y-4">
            <button 
              onClick={toggleMaintenance}
              className={`w-full py-6 rounded-2xl font-black transition-all flex flex-col items-center justify-center gap-1 border shadow-xl ${
                isMaintenance 
                ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' 
                : 'bg-red-500 text-white border-red-400 hover:bg-red-600 shadow-red-500/20'
              }`}
            >
              <span className="text-lg">{isMaintenance ? 'UNLOCK TERMINAL' : 'LOCK TERMINAL'}</span>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                {isMaintenance ? 'Allow Players to Enter' : 'Force Maintenance Mode'}
              </span>
            </button>

            <button 
              onClick={resetLeaderboard}
              className="w-full py-4 bg-white/5 border border-white/5 text-white/60 rounded-2xl font-black hover:bg-white/10 hover:text-white transition-all"
            >
              WIPE SYSTEM CACHE
            </button>
            
            <div className="p-5 bg-white/5 rounded-2xl text-[10px] text-[#4b5563] uppercase font-black text-center border border-dashed border-white/10 leading-relaxed italic">
              "With great power comes absolute responsibility."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
