import React from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementListProps {
  unlockedIds: string[];
  onClose: () => void;
}

const AchievementList: React.FC<AchievementListProps> = ({ unlockedIds, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-zinc-900 border border-white/10 p-8 max-w-2xl w-full rounded-2xl shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
           </button>
        </div>

        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-black serif-font italic text-white tracking-tight">荣誉室</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Academic & Survival Honors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`p-4 border rounded-xl flex items-center gap-4 transition-all duration-500 ${isUnlocked ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5 opacity-40'}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-white' : 'text-white/40'}`}>{ach.title}</h4>
                  <p className="text-[10px] text-white/20 line-clamp-2 leading-tight mt-0.5">{ach.description}</p>
                </div>
                {isUnlocked && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                )}
              </div>
            );
          })}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 border border-white/10 text-white/60 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          返回 (CLOSE)
        </button>
      </div>
    </div>
  );
};

export default AchievementList;
