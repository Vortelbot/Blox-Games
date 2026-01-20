
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';

interface ChatProps {
  user: User;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const Chat: React.FC<ChatProps> = ({ user, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <aside className="hidden xl:flex flex-col w-80 bg-[#0d0f1f] border-l border-[#1a1d2e]">
      <div className="p-6 font-black border-b border-[#1a1d2e] flex items-center justify-between">
        <span>GLOBAL CHAT</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-[#4b5563]">1,284 ONLINE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 animate-slide-up">
            <img src={msg.avatar} className="w-8 h-8 rounded-lg border border-purple-500/30" alt="Av" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-black ${msg.rank === 'Owner' ? 'text-red-500' : 'text-purple-400'}`}>
                  {msg.display}
                </span>
                <span className="text-[9px] text-[#4b5563]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-[#cfd1d9] break-words leading-relaxed bg-white/5 p-2 rounded-r-lg rounded-bl-lg border border-white/5">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-[#161930]/50 border-t border-[#1a1d2e]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type message..."
            className="w-full bg-[#060812] border border-[#1a1d2e] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-purple-500 transition-all pr-12"
          />
          <button 
            onClick={sendMessage}
            className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center text-purple-500 hover:text-white transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Chat;
