
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
  const [showConfirmNewGame, setShowConfirmNewGame] = React.useState(false);

  const handleStartClick = () => {
    if (hasSave) {
      setShowConfirmNewGame(true);
    } else {
      onStart();
    }
  };

  const handleConfirmNewGame = () => {
    setShowConfirmNewGame(false);
    onStart();
  };

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
              onClick={handleStartClick}
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

      {/* 确认新游戏对话框 */}
      {showConfirmNewGame && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-white/10 p-8 max-w-md w-full rounded-3xl shadow-2xl space-y-6 relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">确认开始新游戏</h3>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold">WARNING • 警告</p>
            </div>
            
            <div className="relative z-10 p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-300 leading-relaxed text-base">
                开始新游戏将会<span className="text-red-400 font-bold">清除当前所有的游戏进度</span>。你确定要开始新的模拟吗？
              </p>
              <p className="text-gray-400 text-sm mt-3 italic">
                注意：记忆相册、邮件和日记不会被清除。
              </p>
            </div>
            
            <div className="flex gap-4 pt-2 relative z-10">
              <button 
                onClick={() => setShowConfirmNewGame(false)}
                className="flex-1 py-4 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 uppercase text-xs font-bold tracking-widest rounded-xl backdrop-blur-sm"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmNewGame}
                className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white transition-all duration-300 uppercase text-xs font-bold tracking-widest rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]"
              >
                确认开始
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu;
