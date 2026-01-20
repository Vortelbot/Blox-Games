
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, onLogout }) => {
  const [display, setDisplay] = useState(user.display);
  const [avatar, setAvatar] = useState(user.img);

  const saveProfile = () => {
    const updated = { ...user, display, img: avatar };
    setUser(updated);
    alert("Profile saved successfully!");
  };

  return (
    <div className="max-w-xl mx-auto animate-slide-up">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black tracking-tighter mb-2">MY <span className="text-purple-500">IDENTITY</span></h2>
      </div>

      <div className="bg-[#0d0f1f] p-10 rounded-[40px] border border-[#1a1d2e]">
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <img src={avatar} className="w-32 h-32 rounded-[32px] object-cover border-4 border-purple-500 group-hover:opacity-50 transition-all" alt="Avatar" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <i className="fas fa-camera text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-black text-[#4b5563] uppercase tracking-widest block mb-2">Display Name</label>
            <input 
              type="text" value={display} onChange={(e) => setDisplay(e.target.value)}
              className="w-full bg-[#060812] border border-[#1a1d2e] rounded-2xl p-4 text-sm focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-[#4b5563] uppercase tracking-widest block mb-2">Avatar URL</label>
            <input 
              type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-[#060812] border border-[#1a1d2e] rounded-2xl p-4 text-sm focus:border-purple-500 transition-all"
            />
          </div>

          <div className="pt-6 grid grid-cols-1 gap-4">
            <button 
              onClick={saveProfile}
              className="py-5 bg-purple-500 text-white rounded-2xl font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-500/20"
            >
              SAVE CHANGES
            </button>
            <button 
              onClick={onLogout}
              className="py-5 bg-white/5 border border-white/5 text-rose-500 rounded-2xl font-black text-lg hover:bg-rose-500 hover:text-white transition-all"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
