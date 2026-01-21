
import React from 'react';

interface LevelMapProps {
  currentSemester: number;
  onClose: () => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ currentSemester, onClose }) => {
  const semesters = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fadeIn">
      <h2 className="text-4xl font-bold serif-font mb-12 text-white italic tracking-widest">
        生存地图 (Survival Progress)
      </h2>
      
      <div className="relative w-full max-w-4xl grid grid-cols-2 md:grid-cols-5 gap-8">
        {semesters.map((s) => {
          const isCurrent = s === currentSemester;
          const isPast = s < currentSemester;
          
          return (
            <div key={s} className="relative flex flex-col items-center group">
              <div 
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10
                  ${isCurrent ? 'bg-white text-black border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 
                    isPast ? 'bg-green-900/50 border-green-500 text-green-500' : 
                    'bg-transparent border-white/20 text-white/20'}`}
              >
                <span className="text-xl font-bold">{s}</span>
                {isCurrent && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 text-[10px] font-bold uppercase rounded whitespace-nowrap animate-bounce">
                    你在这里
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <span className={`text-xs uppercase tracking-widest ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                  Semester {s}
                </span>
              </div>
              
              {/* Connector lines (simplified for grid) */}
              {s % 5 !== 0 && s < 10 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-32px)] h-0.5 bg-white/10" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-20 text-center text-white/60 max-w-lg italic text-sm">
        "毕业不是终点，拿到 Urkunde 才是解脱。当前目标：积攒 180 ECTS 并保持理智。"
      </div>

      <button 
        onClick={onClose}
        className="mt-12 px-10 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 tracking-widest uppercase font-light"
      >
        返回现实 (CONTINUE)
      </button>
    </div>
  );
};

export default LevelMap;
