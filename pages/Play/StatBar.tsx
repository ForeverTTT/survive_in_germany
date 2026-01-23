
import React, { useState, useEffect, useRef } from 'react';
import { GameStats, StatChangeFeedback } from '../../data/types';
import { IDENTITIES } from '../../config/constants';

interface StatBarProps {
  stats: GameStats;
  onHomeClick: () => void;
  onMapClick: () => void;
  onSaveClick: () => void;
}

const StatBar: React.FC<StatBarProps> = ({ stats, onHomeClick, onMapClick, onSaveClick }) => {
  const [feedbacks, setFeedbacks] = useState<StatChangeFeedback[]>([]);
  const prevStats = useRef<GameStats>(stats);
  const activeIdentity = IDENTITIES.find(i => i.id === stats.identity);

  useEffect(() => {
    const changes: StatChangeFeedback[] = [];
    const timestamp = Date.now();

    if (stats.ects !== prevStats.current.ects) {
      changes.push({ id: `ects-${timestamp}`, type: 'ects', value: stats.ects - prevStats.current.ects, timestamp });
    }
    if (stats.money !== prevStats.current.money) {
      changes.push({ id: `money-${timestamp}`, type: 'money', value: stats.money - prevStats.current.money, timestamp });
    }
    if (stats.sanity !== prevStats.current.sanity) {
      changes.push({ id: `sanity-${timestamp}`, type: 'sanity', value: stats.sanity - prevStats.current.sanity, timestamp });
    }

    if (changes.length > 0) {
      setFeedbacks(prev => [...prev, ...changes]);
      setTimeout(() => {
        setFeedbacks(prev => prev.filter(f => !changes.find(c => c.id === f.id)));
      }, 2000);
    }
    prevStats.current = stats;
  }, [stats]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex flex-col items-center pointer-events-none">
      <div className="w-full flex items-center px-4 md:px-12">
        {/* Left section: Buttons */}
        <div className="flex-1 flex justify-start gap-4 pointer-events-auto">
          <button 
            onClick={onHomeClick}
            className="p-2 text-white/60 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
            title="返回主菜单 (Home)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </button>
          <button 
            onClick={onMapClick}
            className="p-2 text-white/60 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
            title="查看地图 (Map)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          </button>
          <button 
            onClick={onSaveClick}
            className="p-2 text-white/60 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
            title="保存进度 (Save)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </button>
        </div>

        {/* Center section: Stats */}
        <div className="flex-none flex gap-4 md:gap-8 items-center bg-black/40 backdrop-blur-md px-4 md:px-8 py-2 rounded-full border border-white/10 pointer-events-auto shadow-xl relative">
          <div className="flex flex-col items-center relative">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">ECTS</span>
            <span className="text-base md:text-lg font-bold text-yellow-500">{stats.ects}<span className="text-[9px] md:text-[10px] font-normal text-gray-400 ml-1">/ 180</span></span>
            {feedbacks.filter(f => f.type === 'ects').map(f => (
              <div key={f.id} className="absolute -bottom-8 animate-float-up text-yellow-500 font-bold text-sm">
                {f.value > 0 ? `+${f.value}` : f.value}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center relative">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">Cash</span>
            <span className="text-base md:text-lg font-bold text-green-500">€{stats.money.toFixed(2)}</span>
            {feedbacks.filter(f => f.type === 'money').map(f => (
              <div key={f.id} className={`absolute -bottom-8 animate-float-up font-bold text-sm ${f.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {f.value > 0 ? `+${f.value.toFixed(2)}€` : `${f.value.toFixed(2)}€`}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center hidden sm:flex relative">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">Sanity</span>
            <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${stats.sanity > 50 ? 'bg-blue-500' : stats.sanity > 20 ? 'bg-orange-500' : 'bg-red-600'}`}
                style={{ width: `${Math.max(0, Math.min(100, stats.sanity))}%` }}
              />
            </div>
            {feedbacks.filter(f => f.type === 'sanity').map(f => (
              <div key={f.id} className={`absolute -bottom-8 animate-float-up font-bold text-sm ${f.value > 0 ? 'text-blue-400' : 'text-red-500'}`}>
                {f.value > 0 ? `+${f.value}` : f.value}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">Prog</span>
            <span className="text-base md:text-lg font-bold text-purple-400">CH {stats.chapter}-{stats.level}</span>
          </div>
        </div>
        
        {/* Right section: Identity Badge */}
        <div className="flex-1 flex justify-end pointer-events-auto">
          {activeIdentity && (
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md hidden lg:flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-black">Active Identity</span>
              <span className="text-xs font-bold italic text-white">{activeIdentity.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatBar;
