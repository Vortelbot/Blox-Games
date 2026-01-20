
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, GameID, BetRecord, ChatMessage } from './types';
import { Language, translations } from './translations';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RightSidebar from './components/RightSidebar';
import Auth from './components/Auth';
import Home from './screens/Home';
import Exclusives from './screens/Exclusives';
import Languages from './screens/Languages';
import HigherLower from './screens/HigherLower';
import Dice from './screens/Dice';
import Mines from './screens/Mines';
import Tower from './screens/Tower';
import Slots from './screens/Slots';
import Plinko from './screens/Plinko';
import Limbo from './screens/Limbo';
import Coinflip from './screens/Coinflip';
import Wheel from './screens/Wheel';
import Crash from './screens/Crash';
import Leaderboard from './screens/Leaderboard';
import Profile from './screens/Profile';
import Admin from './screens/Admin';
import BloxRun from './screens/BloxRun';
import VipLounge from './screens/VipLounge';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<GameID>(GameID.HOME);
  const [language, setLanguage] = useState<Language>('en');
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const t = useMemo(() => translations[language] || translations.en, [language]);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsAuthOpen(false);
    }
    
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }

    setIsMaintenance(localStorage.getItem('maintenance_mode') === 'true');
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '{}');
      allUsers[user.name] = user;
      localStorage.setItem('all_users', JSON.stringify(allUsers));
    }
  }, [user]);

  const addBet = useCallback((game: string, bet: number, multi: number, payout: number) => {
    if (!user) return;
    const record: BetRecord = {
      id: Math.random().toString(36).substr(2, 9),
      game,
      user: user.display,
      rank: user.rank,
      avatar: user.img,
      bet,
      multi,
      payout,
      timestamp: Date.now()
    };
    setBets(prev => [record, ...prev].slice(0, 50));
  }, [user]);

  const updateBalance = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      let finalAmount = amount;
      
      // MEDIA RANK BONUS: 50% boost (1.5x) on winnings
      if (amount > 0 && prev.rank === 'Media') {
        finalAmount = Math.floor(amount * 1.5);
      }
      
      return { ...prev, bal: prev.bal + finalAmount };
    });
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setUser(null);
    setIsAuthOpen(true);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const renderContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case GameID.HOME: return <Home onNavigate={setActiveTab} user={user} t={t} />;
      case GameID.EXCLUSIVES: return <Exclusives onNavigate={setActiveTab} t={t} />;
      case GameID.LANGUAGES: return <Languages current={language} onSelect={changeLanguage} t={t} />;
      case GameID.CRASH: return <Crash user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.HIGHER_LOWER: return <HigherLower user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.DICE: return <Dice user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.MINES: return <Mines user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.TOWER: return <Tower user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.SLOTS: return <Slots user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.PLINKO: return <Plinko user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.LIMBO: return <Limbo user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.COINFLIP: return <Coinflip user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.WHEEL: return <Wheel user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.BLOX_RUN: return <BloxRun user={user} updateBalance={updateBalance} addBet={addBet} />;
      case GameID.VIP_LOUNGE: return <VipLounge user={user} updateBalance={updateBalance} addBet={addBet} t={t} />;
      case GameID.LEADERBOARD: return <Leaderboard bets={bets} />;
      case GameID.PROFILE: return <Profile user={user} setUser={setUser} onLogout={handleLogout} t={t} />;
      case GameID.ADMIN: return <Admin user={user} />;
      default: return <Home onNavigate={setActiveTab} user={user} t={t} />;
    }
  };

  if (isAuthOpen) {
    return <Auth onLogin={handleLogin} t={t} />;
  }

  if (isMaintenance && user?.rank !== 'Owner') {
    return (
      <div className="fixed inset-0 bg-[#060812] flex flex-col items-center justify-center p-12 text-center z-[2000]">
        <div className="relative mb-12">
          <i className="fas fa-wrench text-8xl text-purple-500 animate-pulse"></i>
          <i className="fas fa-cog text-4xl text-purple-400 absolute -bottom-2 -right-2 animate-spin"></i>
        </div>
        <h1 className="text-6xl font-black tracking-tighter italic mb-4">{t.system_offline}</h1>
        <p className="text-[#4b5563] text-xl font-bold uppercase tracking-[0.3em] mb-8">{t.maintenance}</p>
        <button 
          onClick={handleLogout}
          className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors"
        >
          Exit Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#060812] text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={user?.rank === 'Owner'} userRank={user?.rank || 'Player'} t={t} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Header user={user!} onProfile={() => setActiveTab(GameID.PROFILE)} t={t} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          {renderContent()}
        </div>
      </main>

      <RightSidebar 
        user={user!} 
        messages={messages} 
        setMessages={setMessages} 
        bets={bets}
        t={t}
      />
    </div>
  );
};

export default App;
