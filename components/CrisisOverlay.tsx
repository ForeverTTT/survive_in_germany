import React from 'react';
import { CrisisEvent } from '../types';

interface CrisisOverlayProps {
  event: CrisisEvent;
  onOptionSelect: (impact: any, result: string) => void;
}

const CrisisOverlay: React.FC<CrisisOverlayProps> = ({ event, onOptionSelect }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block bg-red-600 px-4 py-1 rounded-sm mb-2 animate-pulse">
            <span className="text-xs uppercase tracking-[0.4em] font-black text-white">
              突发紧急事件 (CRISIS!)
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic serif-font tracking-tight text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            {event.title}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6">
          <p className="text-xl text-gray-100 leading-relaxed font-light italic">
            “ {event.description} ”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {event.options.map((opt, idx) => (
            <button 
              key={idx} 
              onClick={() => onOptionSelect(opt.impact, opt.result)}
              className="group relative p-8 border border-white/10 bg-white/5 hover:border-red-600/40 hover:bg-red-600/10 transition-all duration-500 text-left space-y-4 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-0 bg-red-600 group-hover:h-full transition-all duration-500"></div>
              <span className="block text-[10px] uppercase tracking-widest text-white/40 group-hover:text-red-600/60 font-black">抉择 {idx + 1}</span>
              <p className="text-lg font-bold text-white group-hover:text-red-50">{opt.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrisisOverlay;
