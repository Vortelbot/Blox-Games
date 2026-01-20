
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage, BetRecord } from '../types';
import LiveFeed from './LiveFeed';

interface RightSidebarProps {
  user: User;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  bets: BetRecord[];
  t: any;
}

const RankTag: React.FC<{ rank: string }> = ({ rank }) => {
  switch (rank) {
    case 'Owner':
      return (
        <span className="bg-red-500/20 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-tighter mr-1 flex items-center gap-1">
          <i className="fas fa-crown text-[7px]"></i> OWNER
        </span>
      );
    case 'Media':
      return (
        <span className="bg-cyan-500/20 text-cyan-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase tracking-tighter mr-1 flex items-center gap-1">
          <i className="fas fa-video text-[7px]"></i> MEDIA
        </span>
      );
    case 'Vip':
      return (
        <span className="bg-amber-500/20 text-amber-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-tighter mr-1 flex items-center gap-1">
          <i className="fas fa-gem text-[7px]"></i> VIP
        </span>
      );
    default:
      return null;
  }
};

const RightSidebar: React.FC<RightSidebarProps> = ({ user, messages, setMessages, bets, t }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'live'>('chat');
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: user.name,
      display: user.display,
      avatar: user.img,
      text: input,
      rank: user.rank,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const getRankColor = (rank: string) => {
    if (rank === 'Owner') return 'text-red-500';
    if (rank === 'Media') return 'text-cyan-400';
    if (rank === 'Vip') return 'text-amber-500';
    return 'text-purple-400';
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 bg-[#0d0f1f] border-l border-[#1a1d2e] shadow-2xl relative z-10">
      {/* Header with Tabs */}
      <div className="p-4 bg-[#0d0f1f] border-b border-[#1a1d2e]">
        <div className="flex bg-[#060812] rounded-xl p-1.5 border border-white/5 shadow-inner">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'chat' 
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                : 'text-[#4b5563] hover:text-[#8b8ea8]'
            }`}
          >
            <i className="fas fa-comments"></i>
            {t.chat}
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'live' 
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                : 'text-[#4b5563] hover:text-[#8b8ea8]'
            }`}
          >
            <i className="fas fa-satellite-dish"></i>
            {t.live}
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'live' ? 'bg-white' : 'bg-emerald-500'} animate-pulse`}></span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 p-8 text-center">
                  <i className="fas fa-comment-dots text-6xl mb-4"></i>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em]">No incoming transmissions</div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3 animate-slide-up">
                    <img src={msg.avatar} className="w-8 h-8 rounded-lg border border-purple-500/30 object-cover" alt="Av" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <RankTag rank={msg.rank} />
                        <span className={`text-[11px] font-black truncate ${getRankColor(msg.rank)} flex items-center gap-1`}>
                          {msg.display}
                          {msg.rank === 'Owner' && <i className="fas fa-shield-check text-[9px]"></i>}
                          {msg.rank === 'Vip' && <i className="fas fa-circle-check text-[9px]"></i>}
                        </span>
                        <span className="text-[9px] text-[#4b5563] shrink-0 font-medium">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-[#cfd1d9] break-words leading-relaxed bg-white/5 p-2 rounded-r-lg rounded-bl-lg border border-white/5">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Fixed at Bottom */}
            <div className="p-4 bg-[#161930]/30 border-t border-[#1a1d2e] backdrop-blur-sm">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t.type_message}
                  className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-purple-500 transition-all pr-12 text-white font-medium placeholder:text-[#4b5563]"
                />
                <button 
                  onClick={sendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-purple-500 hover:text-white hover:bg-purple-500/10 rounded-lg transition-all"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             <LiveFeed bets={bets} />
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
