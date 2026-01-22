
import React from 'react';
import { GameStatus } from '../../types';
import introBg from '../../image/intro.png';

import AchievementList from '../../components/AchievementList';

interface MainMenuProps {
  onStart: () => void;
  onLoad: () => void;
  onMapClick: () => void;
  onSocialClick: () => void;
  onSettingsClick: () => void;
  onMailboxClick: () => void;
  onMemoryAlbumClick: () => void;
  onDiaryClick: () => void;
  hasSave: boolean;
  menuBg: string;
  unlockedAchievements: string[];
  unreadLetters?: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  onStart, 
  onLoad, 
  onMapClick, 
  onSocialClick,
  onSettingsClick,
  onMailboxClick,
  onMemoryAlbumClick,
  onDiaryClick,
  hasSave, 
  menuBg,
  unlockedAchievements,
  unreadLetters = 0
}) => {
  const [showAchievements, setShowAchievements] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Top Right Icons */}
      <div className="absolute top-8 right-8 z-20 flex gap-6">
        <button 
          onClick={onMailboxClick}
          className="relative group p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-500 backdrop-blur-md shadow-2xl overflow-hidden"
          title="信箱 (Mailbox)"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg className="w-8 h-8 text-white/70 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {unreadLetters > 0 && (
            <span className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full border border-black animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          )}
        </button>

        <button 
          onClick={onMemoryAlbumClick}
          className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-500 backdrop-blur-md shadow-2xl overflow-hidden"
          title="记忆相册 (Album)"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg className="w-8 h-8 text-white/70 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button 
          onClick={onDiaryClick}
          className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-500 backdrop-blur-md shadow-2xl overflow-hidden"
          title="留德日记 (Diary)"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg className="w-8 h-8 text-white/70 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* ... background remains same ... */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src={menuBg || introBg} 
          className={`w-full h-full object-cover transition-opacity duration-2000 ${menuBg ? 'opacity-100' : 'opacity-60'}`} 
          alt="Menu Background"
        />
      </div>
      <div className="absolute inset-0 cinematic-gradient"></div>
      <div className="z-10 text-center max-w-2xl px-4">
        <h1 className="text-5xl md:text-8xl serif-font font-bold mb-6 italic text-white drop-shadow-2xl">
          德区留子生存模拟器
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12 tracking-[0.4em] uppercase opacity-60">
          German Student Survival Simulator
        </p>
        <div className="flex flex-col gap-6 items-center justify-center w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <button 
              onClick={onStart}
              className="group relative px-12 py-6 border border-white text-white transition-all duration-500 overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-2xl font-bold tracking-[0.2em] group-hover:text-black transition-colors">开始新模拟</span>
                <span className="text-[10px] uppercase tracking-[0.4em] opacity-60 group-hover:text-black/60 transition-colors">NEW GAME</span>
              </div>
            </button>
            {hasSave && (
              <button 
                onClick={onLoad}
                className="group relative px-12 py-6 bg-white/10 border border-white/40 text-white transition-all duration-500 overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-2xl font-bold tracking-[0.2em] group-hover:text-black transition-colors">继续模拟</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] opacity-60 group-hover:text-black/60 transition-colors">LOAD GAME</span>
                </div>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <button 
              onClick={onMapClick}
              className="group py-4 px-2 border border-white/20 text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-sm flex flex-col items-center justify-center gap-1"
            >
              <span className="text-sm font-medium tracking-[0.1em]">查看地图</span>
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40">MAP</span>
            </button>
            <button 
              onClick={onSocialClick}
              className="group py-4 px-2 border border-white/20 text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-sm flex flex-col items-center justify-center gap-1"
            >
              <span className="text-sm font-medium tracking-[0.1em]">社交圈</span>
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40">SOCIAL</span>
            </button>
            <button 
              onClick={() => setShowAchievements(true)}
              className="group py-4 px-2 border border-white/20 text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-sm flex flex-col items-center justify-center gap-1"
            >
              <span className="text-sm font-medium tracking-[0.1em]">成就系统</span>
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40">ACHIEVEMENTS</span>
            </button>
            <button 
              onClick={onSettingsClick}
              className="group py-4 px-2 border border-white/20 text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-sm flex flex-col items-center justify-center gap-1"
            >
              <span className="text-sm font-medium tracking-[0.1em]">系统设置</span>
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40">SETTINGS</span>
            </button>
          </div>
        </div>
      </div>

      {showAchievements && (
        <AchievementList 
          unlockedIds={unlockedAchievements} 
          onClose={() => setShowAchievements(false)} 
        />
      )}
    </div>
  );
};

export default MainMenu;
