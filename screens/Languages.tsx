
import React from 'react';
import { Language } from '../translations';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
];

interface LanguagesProps {
  current: Language;
  onSelect: (lang: Language) => void;
  t: any;
}

const Languages: React.FC<LanguagesProps> = ({ current, onSelect, t }) => {
  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-20">
      <div className="text-center mb-16">
        <h2 className="text-6xl font-black tracking-tighter mb-4">
          Terminal <span className="text-purple-500">Locale</span>
        </h2>
        <p className="text-[#8b8ea8] text-xl font-medium max-w-2xl mx-auto">
          Synchronize your interface with global regional standards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            onClick={() => onSelect(lang.code as Language)}
            className={`group cursor-pointer p-8 rounded-[40px] border-2 transition-all duration-500 relative overflow-hidden ${
              current === lang.code 
                ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.15)]' 
                : 'bg-[#0d0f1f] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
            }`}
          >
            {current === lang.code && (
              <div className="absolute top-0 right-0 p-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
              </div>
            )}

            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 block w-fit">
              {lang.flag}
            </div>
            
            <h3 className={`font-black text-2xl mb-1 ${current === lang.code ? 'text-white' : 'text-[#8b8ea8]'}`}>
              {lang.name}
            </h3>
            <p className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.2em]">
              {lang.native}
            </p>
            
            <div className={`mt-8 flex items-center gap-3 transition-opacity duration-500 ${current === lang.code ? 'opacity-100' : 'opacity-0'}`}>
               <div className="px-4 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-[9px] font-black uppercase tracking-widest">
                  SYNCED
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-[#0d0f1f] rounded-[56px] border border-white/5 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
         <i className="fas fa-globe-americas text-6xl text-purple-500/20 mb-8 block"></i>
         <h4 className="text-2xl font-black mb-4 tracking-tight">Encryption & Translation Protocol</h4>
         <p className="text-base text-[#8b8ea8] max-w-xl mx-auto leading-relaxed font-medium">
            Changes are applied instantly to all terminal sessions. Our neural translation matrix maintains 100% data integrity across all {LANGUAGES.length} supported languages.
         </p>
      </div>
    </div>
  );
};

export default Languages;
