
import React from 'react';
import { CHAPTER_DATA, DAG_STAGES } from '../constants';

interface LevelMapProps {
  stats: {
    chapter: number;
    level: number;
    levelHistory: string[];
    historyLogs?: any[]; // 增加历史日志
  };
  onClose: () => void;
  onLevelClick?: (chapter: number, level: number) => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ stats, onClose, onLevelClick }) => {
  const chapters = CHAPTER_DATA;
  const dagStages = DAG_STAGES;
  const [selectedHistory, setSelectedHistory] = React.useState<any | null>(null);

  // 禁止 body 滚动
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0); // 滚动到顶部
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // 辅助函数：获取某个关卡的历史记录
  const getHistoryForLevel = (chapterId: number, levelNum: number) => {
    return stats.historyLogs?.find(log => log.chapter === chapterId && log.level === levelNum);
  };

  const isLevelInHistory = (chapterId: number, levelNum: number) => {
    return stats.levelHistory.includes(`${chapterId}-${levelNum}`);
  };

  // 找到玩家当前所在的阶段索引
  const currentStageIdx = dagStages.findIndex(s => s.includes(stats.level));

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center animate-fadeIn select-none text-white" style={{ top: 0, left: 0 }}>
      <style>{`
        .map-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .map-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .map-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .map-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
      <div className="w-full h-full overflow-y-auto map-scroll flex flex-col items-center justify-start p-4">
      {/* Header */}
      <div className="w-full max-w-xl flex justify-between items-center mt-4 mb-8 border-b border-white/10 pb-4 shrink-0">
        <h2 className="text-xl md:text-2xl font-black serif-font text-white italic tracking-tighter">
          生存地图 <span className="text-white/20 font-light not-italic ml-2 uppercase text-[10px]">Neural DAG Map</span>
        </h2>
        <button 
          onClick={onClose}
          className="px-4 py-1.5 border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300 tracking-widest uppercase font-bold text-[10px] flex items-center gap-2"
        >
          <span>返回 (CONTINUE)</span>
        </button>
      </div>

      {/* Chapters Container */}
      <div className="w-full max-w-xl space-y-16 pb-24">
        {chapters.map((chapter) => {
          const isChapterActive = chapter.id === stats.chapter;
          const isChapterLocked = chapter.id > stats.chapter;
          const isChapterPast = chapter.id < stats.chapter;
          
          return (
            <div key={chapter.id} className={`transition-all duration-700 ${isChapterLocked ? 'opacity-20 grayscale scale-95' : 'opacity-100'}`}>
              {/* Chapter Title */}
              <div className="flex items-center gap-3 mb-12">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border
                  ${isChapterActive ? 'bg-white text-black border-white' : isChapterPast ? 'bg-green-500 border-green-500 text-black' : 'bg-transparent border-white/10 text-white/20'}`}>
                  {chapter.id}
                </div>
                <div>
                  <h3 className={`text-xl font-bold serif-font italic ${isChapterActive ? 'text-white' : isChapterPast ? 'text-green-500' : 'text-white/20'}`}>
                    {chapter.title}
                  </h3>
                  <p className="text-white/30 text-[8px] uppercase tracking-[0.4em]">{chapter.subtitle}</p>
                </div>
              </div>

              {/* DAG Body */}
              <div className="flex flex-col items-center space-y-12 relative">
                {dagStages.map((stageLevels, stageIdx) => (
                  <div key={stageIdx} className="relative flex flex-col items-center w-full">
                    {/* 连接线逻辑 */}
                    {stageIdx < dagStages.length - 1 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-white/5 pointer-events-none">
                        {/* 只有在路径上的线才高亮 */}
                        {stageLevels.some(l => isLevelInHistory(chapter.id, l)) && 
                         dagStages[stageIdx+1].some(l => isLevelInHistory(chapter.id, l)) && (
                          <div className="w-full h-full bg-green-500/30 animate-pulse" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-center gap-6 md:gap-12 relative z-10">
                      {stageLevels.map((levelNum) => {
                        const isCurrent = isChapterActive && levelNum === stats.level;
                        const inHistory = isLevelInHistory(chapter.id, levelNum);
                        const isLocked = !inHistory && !isCurrent;
                        const isClickable = inHistory && !isCurrent && onLevelClick;

                        return (
                          <div key={levelNum} className="relative group">
                            <button 
                              disabled={!isClickable}
                              onClick={() => {
                                if (isClickable) {
                                  const history = getHistoryForLevel(chapter.id, levelNum);
                                  if (history) {
                                    setSelectedHistory(history);
                                  } else {
                                    onLevelClick && onLevelClick(chapter.id, levelNum);
                                  }
                                }
                              }}
                              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 border
                                ${isCurrent ? 'bg-white border-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 
                                  inHistory ? 'bg-green-900/40 border-green-500 text-green-500 hover:bg-green-500 hover:text-black cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 
                                  'bg-zinc-900 border-white/5 text-white/5 cursor-default'}`}
                            >
                              {isLocked ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                              ) : (
                                <span className={`text-xs font-black`}>{levelNum}</span>
                              )}
                              
                              {isCurrent && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-0.5 text-[7px] font-black uppercase rounded shadow-xl whitespace-nowrap animate-bounce">
                                  YOU
                                </div>
                              )}

                              {isClickable && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[6px] text-green-500 uppercase tracking-widest">
                                  Jump Back
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 历史记录弹窗 (History Replay Card) */}
      {selectedHistory && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn" style={{ top: 0, left: 0 }}>
          <div className="bg-zinc-900 border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] rounded-2xl shadow-2xl space-y-6 relative overflow-y-auto map-scroll">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-green-500 font-bold">历史轨迹 • 第 {selectedHistory.chapter} 章 第 {selectedHistory.level} 关</span>
              <h3 className="text-3xl font-bold serif-font italic text-white">{selectedHistory.title}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed italic">“ {selectedHistory.description} ”</p>
            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
              <span className="text-[10px] uppercase text-white/40 block mb-2">你的抉择</span>
              <p className="text-white font-medium">{selectedHistory.choiceMade}</p>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <span className="text-[10px] uppercase text-green-500/60 block mb-2">结果回响</span>
              <p className="text-green-400 font-light">{selectedHistory.resultDescription}</p>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setSelectedHistory(null)}
                className="flex-1 py-3 border border-white/10 text-white/60 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
              >
                关闭 (CLOSE)
              </button>
              <button 
                onClick={() => {
                  onLevelClick && onLevelClick(selectedHistory.chapter, selectedHistory.level);
                  setSelectedHistory(null);
                }}
                className="flex-1 py-3 bg-white text-black hover:bg-green-500 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                跳回此关 (JUMP BACK)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 mb-12 text-center text-white/10 max-w-md italic text-[8px] tracking-[0.2em] uppercase">
        "毕业不是终点，拿到 Urkunde 才是解脱。"
      </div>
      </div>
    </div>
  );
};

export default LevelMap;
