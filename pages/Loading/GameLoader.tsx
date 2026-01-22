
import React from 'react';
import introBg from '../../image/intro.png';

interface GameLoaderProps {
  loadingMsg: string;
  loadingTip: string;
  bgImage: string;
  menuBg?: string;
  microEvent?: { text: string; statImpact: string } | null;
}

const GameLoader: React.FC<GameLoaderProps> = ({ loadingMsg, loadingTip, bgImage, menuBg, microEvent }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {/* Loading Background - 优先使用德国主题背景 */}
      <div className="absolute inset-0 z-0">
        <img 
          src={menuBg || bgImage || introBg} 
          className="w-full h-full object-cover blur-sm opacity-50 scale-105"
          alt="Loading Background"
        />
        <div className="absolute inset-0 cinematic-gradient"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center">
        <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mb-8 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
        <p className="text-2xl font-bold tracking-widest mb-12 text-white drop-shadow-lg">{loadingMsg}</p>
        
        {microEvent ? (
          <div className="mt-12 p-8 bg-green-900/20 backdrop-blur-xl border border-green-500/30 rounded-2xl animate-bounce-in">
            <p className="text-[10px] uppercase tracking-[0.4em] text-green-400 font-bold mb-3">意外事件 (Zufälliges Ereignis)</p>
            <p className="text-xl md:text-2xl font-bold italic leading-relaxed text-white mb-2">
              {microEvent.text}
            </p>
            <p className="text-sm font-bold text-green-400 uppercase tracking-widest">{microEvent.statImpact}</p>
          </div>
        ) : (
          <div className="mt-12 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl animate-fadeIn">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40 mb-3">你知道吗？ (Wussten Sie schon?)</p>
            <p className="text-lg md:text-xl font-light italic leading-relaxed text-gray-200">
              “ {loadingTip} ”
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLoader;
