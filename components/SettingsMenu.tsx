import React from 'react';
import { GameSettings } from '../data/types';

interface SettingsMenuProps {
  settings: GameSettings;
  onUpdate: (settings: GameSettings) => void;
  onResetAll: () => void;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdate, onResetAll, onClose }) => {
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-zinc-900 border border-white/10 p-8 max-w-md w-full rounded-2xl shadow-2xl space-y-8 relative overflow-hidden">
        {/* ... (rest of the component) */}
        <div className="absolute top-0 right-0 p-4">
           <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
           </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black serif-font italic text-white tracking-tight">系统设置</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">System Configuration</p>
        </div>

        <div className="space-y-6">
          {/* 文本速度 */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-white/60 font-bold">对话文字速度</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(speed => (
                <button
                  key={speed}
                  onClick={() => onUpdate({ ...settings, textSpeed: speed })}
                  className={`py-2 text-[10px] border transition-all ${settings.textSpeed === speed ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                >
                  {speed === 1 ? '慢速' : speed === 2 ? '标准' : '即时'}
                </button>
              ))}
            </div>
          </div>

          {/* 音量 */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold">主音量</label>
              <span className="text-[10px] text-white/40 font-mono">{settings.volume}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={settings.volume} 
              onChange={(e) => onUpdate({ ...settings, volume: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <button 
              onClick={() => {
                const audio = document.querySelector('audio');
                if (audio) audio.play();
              }}
              className="text-[8px] uppercase text-green-500/50 hover:text-green-500 transition-colors tracking-widest"
            >
              点击测试并激活音频 (Test & Activate)
            </button>
          </div>

          {/* 开关选项 */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-white/60 font-bold">启用雪花动效</span>
              <button 
                onClick={() => onUpdate({ ...settings, showEffects: !settings.showEffects })}
                className={`w-10 h-5 rounded-full relative transition-colors ${settings.showEffects ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.showEffects ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-white/60 font-bold">启用 AI 动态关卡</span>
                <span className="text-[8px] text-white/20 uppercase tracking-tighter">Powered by Gemini Pro</span>
              </div>
              <button 
                onClick={() => onUpdate({ ...settings, useLLM: !settings.useLLM })}
                className={`w-10 h-5 rounded-full relative transition-colors ${settings.useLLM ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.useLLM ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
          <button 
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-3 border border-red-500/30 text-red-500/60 hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase tracking-widest font-black rounded-lg"
          >
            彻底重置所有存档 (Nuclear Reset)
          </button>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-green-500 transition-colors"
          >
            保存并关闭 (APPLY)
          </button>
        </div>

        {/* Inner Reset Confirmation */}
        {showConfirmReset && (
          <div className="absolute inset-0 bg-black/95 z-[130] flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="text-5xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold text-white mb-2 italic serif-font">确定要抹除一切吗？</h3>
            <p className="text-sm text-white/40 mb-8 font-light leading-relaxed">
              这将永久删除你的游戏进度、日记本、相册图片、社交关系和所有成就。<br/>
              (This will permanently wipe all your data.)
            </p>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={onResetAll}
                className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                确定抹除 (CONFIRM WIPE)
              </button>
              <button 
                onClick={() => setShowConfirmReset(false)}
                className="w-full py-4 border border-white/20 text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all rounded-xl"
              >
                点错了，回去 (CANCEL)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsMenu;
