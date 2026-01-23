import React from 'react';
import { Identity } from '../data/types';
import { IDENTITIES } from '../config/constants';

interface IdentitySelectorProps {
  onSelect: (identity: Identity) => void;
  onBack: () => void;
  menuBg?: string;
}

const IdentitySelector: React.FC<IdentitySelectorProps> = ({ onSelect, onBack }) => {
  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-6 animate-fadeIn text-white overflow-hidden">
      {/* Background Layer - 使用纯色背景，不包含首页文字 */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* 添加微妙的渐变效果，增加视觉层次 */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, rgba(30,30,30,1) 0%, rgba(0,0,0,1) 100%)',
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black italic serif-font tracking-tight">选择你的降落身份</h2>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs">Choose Your Identity in Germany</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {IDENTITIES.map((idty) => (
            <button
              key={idty.id}
              onClick={() => onSelect(idty)}
              className="group relative p-8 border border-white/10 bg-white/5 hover:border-white/40 hover:bg-white/10 transition-all duration-500 text-left space-y-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-500"></div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold italic serif-font">{idty.name}</h3>
                <div className="h-px w-8 bg-white/20"></div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {idty.description}
              </p>

              <div className="bg-white/5 p-4 rounded-lg space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">特殊天赋 (Perks)</span>
                <p className="text-[11px] text-green-400/80 leading-snug">{idty.perks}</p>
              </div>

              <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] uppercase tracking-tighter text-white/20">SELECT THIS PATH</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={onBack}
            className="text-white/40 hover:text-white transition-colors uppercase text-[10px] tracking-[0.4em] font-bold border-b border-transparent hover:border-white/40 pb-1"
          >
            返回主菜单 (BACK)
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentitySelector;
