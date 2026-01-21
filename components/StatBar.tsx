
import React from 'react';
import { GameStats } from '../types';

interface StatBarProps {
  stats: GameStats;
  onHomeClick: () => void;
  onMapClick: () => void;
  onSaveClick: () => void;
}

const StatBar: React.FC<StatBarProps> = ({ stats, onHomeClick, onMapClick, onSaveClick }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center px-4 md:px-12 pointer-events-none">
      <div className="flex gap-4 pointer-events-auto">
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

      <div className="flex gap-4 md:gap-8 items-center bg-black/40 backdrop-blur-md px-4 md:px-8 py-2 rounded-full border border-white/10 pointer-events-auto">
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">ECTS</span>
          <span className="text-base md:text-lg font-bold text-yellow-500">{stats.ects}<span className="text-[9px] md:text-[10px] font-normal text-gray-400 ml-1">/ 180</span></span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">Cash</span>
          <span className="text-base md:text-lg font-bold text-green-500">€{stats.money}</span>
        </div>
        <div className="flex flex-col items-center hidden sm:flex">
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">Sanity</span>
          <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${stats.sanity > 50 ? 'bg-blue-500' : stats.sanity > 20 ? 'bg-orange-500' : 'bg-red-600'}`}
              style={{ width: `${Math.max(0, Math.min(100, stats.sanity))}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400">Sem</span>
          <span className="text-base md:text-lg font-bold text-purple-400">{stats.semester}</span>
        </div>
      </div>
      
      <div className="w-12 hidden md:block"></div>
    </div>
  );
};

export default StatBar;
