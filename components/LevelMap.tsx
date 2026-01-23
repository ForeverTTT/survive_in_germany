
import React from 'react';
import { CHAPTER_DATA, DAG_STAGES } from '../constants';

// 从 image 文件夹随机选择背景图
const LOCAL_SCENE_BG_POOL: string[] = Object.values(
  import.meta.glob('../image/*.png', { eager: true, import: 'default' })
) as string[];

const pickRandomBg = () => {
  if (LOCAL_SCENE_BG_POOL.length === 0) return '';
  return LOCAL_SCENE_BG_POOL[Math.floor(Math.random() * LOCAL_SCENE_BG_POOL.length)];
};

interface LevelMapProps {
  stats: {
    chapter: number;
    level: number;
    levelHistory: string[];
    historyLogs?: any[];
  };
  onClose: () => void;
  onLevelClick?: (chapter: number, level: number) => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ stats, onClose, onLevelClick }) => {
  const chapters = CHAPTER_DATA;
  const dagStages = DAG_STAGES;
  const [selectedHistory, setSelectedHistory] = React.useState<any | null>(null);
  const [bgImage] = React.useState<string>(() => pickRandomBg());

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getHistoryForLevel = (chapterId: number, levelNum: number) => {
    return stats.historyLogs?.find(log => log.chapter === chapterId && log.level === levelNum);
  };

  const isLevelInHistory = (chapterId: number, levelNum: number) => {
    return stats.levelHistory.includes(`${chapterId}-${levelNum}`);
  };

  const currentStageIdx = dagStages.findIndex(s => s.includes(stats.level));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn select-none text-white overflow-hidden" style={{ top: 0, left: 0 }}>
      {/* 背景图片 */}
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      {/* 深色遮罩层 */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
      {/* 渐变叠加层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/40 to-zinc-950/60"></div>
      {/* 动态光效 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      {/* 点状网格 */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      
      <style>{`
        .map-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .map-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .map-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5));
          border-radius: 10px;
        }
        .map-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8));
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .glow-pulse {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="w-full h-full overflow-y-auto map-scroll flex flex-col items-center justify-start p-4 relative z-10">
        <div className="w-full max-w-xl flex justify-between items-center mt-4 mb-8 pb-4 shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-black serif-font italic text-white tracking-tight">
                生存地图
              </h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">Neural DAG Map</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="relative z-10 group px-6 py-2.5 bg-white/10 hover:bg-white border border-white/20 hover:border-white text-white hover:text-black transition-all duration-300 tracking-widest uppercase font-bold text-[10px] rounded-lg backdrop-blur-xl shadow-xl"
          >
            <span className="relative z-10">返回</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-xl"></div>
          </button>
        </div>

        <div className="w-full max-w-xl space-y-20 pb-24">
          {chapters.map((chapter) => {
            const isChapterActive = chapter.id === stats.chapter;
            const isChapterLocked = chapter.id > stats.chapter;
            const isChapterPast = chapter.id < stats.chapter;
            
            return (
              <div key={chapter.id} className={`transition-all duration-700 ${isChapterLocked ? 'opacity-40 grayscale scale-95' : 'opacity-100'} relative`}>
                {isChapterActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl glow-pulse"></div>
                )}
                
                <div className="flex items-center gap-4 mb-12 relative z-10">
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-2 shadow-2xl transition-all duration-500
                    ${isChapterActive ? 'bg-gradient-to-br from-white to-gray-200 text-black border-white shadow-white/50 scale-110' : 
                      isChapterPast ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white shadow-green-500/50' : 
                      'bg-gradient-to-br from-zinc-700 to-zinc-800 border-white/20 text-white/40'}`}>
                    <span className="relative z-10">{chapter.id}</span>
                    {isChapterActive && (
                      <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-black tracking-tight ${isChapterActive ? 'text-white' : isChapterPast ? 'text-green-400' : 'text-white/40'}`}>
                      {chapter.title}
                    </h3>
                    <p className={`text-[10px] uppercase tracking-[0.3em] font-medium ${isChapterActive ? 'text-blue-400' : 'text-white/40'}`}>
                      {chapter.subtitle}
                    </p>
                  </div>
                  {isChapterPast && (
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      ✓ 已通过
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center space-y-12 relative">
                  {dagStages.map((stageLevels, stageIdx) => (
                    <div key={stageIdx} className="relative flex flex-col items-center w-full">
                      {stageIdx < dagStages.length - 1 && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-white/10 to-transparent pointer-events-none">
                          {stageLevels.some(l => isLevelInHistory(chapter.id, l)) && 
                           dagStages[stageIdx+1].some(l => isLevelInHistory(chapter.id, l)) && (
                            <div className="w-full h-full bg-gradient-to-b from-green-500/60 via-green-400/40 to-green-300/20 shadow-[0_0_10px_rgba(34,197,94,0.5)] glow-pulse" />
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-center gap-8 md:gap-16 relative z-10">
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
                                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 border-2 font-black text-base backdrop-blur-sm
                                  ${isCurrent ? 'bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black border-white scale-125 shadow-[0_0_40px_rgba(255,255,255,0.6)]' : 
                                    inHistory ? 'bg-gradient-to-br from-green-900/60 via-green-800/40 to-green-900/60 border-green-500 text-green-300 hover:from-green-500 hover:to-emerald-600 hover:text-white hover:scale-110 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]' : 
                                    'bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 border-white/20 text-white/30 cursor-default'}`}
                              >
                                {isCurrent && (
                                  <>
                                    <div className="absolute inset-0 bg-white rounded-2xl blur-2xl opacity-30 glow-pulse"></div>
                                    <div className="absolute -inset-2 border-2 border-white/30 rounded-3xl glow-pulse"></div>
                                  </>
                                )}
                                
                                {isLocked ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                ) : (
                                  <span className="relative z-10 text-sm md:text-base">{levelNum}</span>
                                )}
                                
                                {isCurrent && (
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-[8px] font-black uppercase rounded-lg shadow-xl whitespace-nowrap animate-bounce border border-white/30">
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rotate-45"></div>
                                    YOU ARE HERE
                                  </div>
                                )}

                                {isClickable && (
                                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-[9px] text-green-400 uppercase tracking-wider font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30 backdrop-blur-sm">
                                    ↩ 跳回
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

        {selectedHistory && (
          <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fadeIn" style={{ top: 0, left: 0 }}>
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] rounded-3xl shadow-2xl space-y-6 relative overflow-y-auto map-scroll">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-green-400 font-bold">历史轨迹</span>
                  </div>
                  <span className="text-[10px] text-white/40">•</span>
                  <span className="text-[10px] text-white/60 font-medium">第 {selectedHistory.chapter} 章 第 {selectedHistory.level} 关</span>
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight">{selectedHistory.title}</h3>
              </div>
              
              <div className="relative z-10 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-300 leading-relaxed text-lg">
                  <span className="text-3xl text-green-400 mr-2">"</span>
                  {selectedHistory.description}
                  <span className="text-3xl text-green-400 ml-2">"</span>
                </p>
              </div>
              
              <div className="relative z-10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-[10px] uppercase text-blue-400/80 font-bold tracking-wider">你的抉择</span>
                </div>
                <p className="text-white font-medium text-base">{selectedHistory.choiceMade}</p>
              </div>
              
              <div className="relative z-10 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-5 rounded-2xl border border-green-500/30 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(34,197,94,0.1)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] uppercase text-green-400/80 font-bold tracking-wider">结果回响</span>
                </div>
                <p className="text-green-300 font-light text-base leading-relaxed">{selectedHistory.resultDescription}</p>
              </div>
              
              <div className="flex gap-4 pt-4 relative z-10">
                <button 
                  onClick={() => setSelectedHistory(null)}
                  className="flex-1 py-4 border-2 border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 uppercase text-xs font-bold tracking-widest rounded-xl backdrop-blur-sm"
                >
                  关闭
                </button>
                <button 
                  onClick={() => {
                    onLevelClick && onLevelClick(selectedHistory.chapter, selectedHistory.level);
                    setSelectedHistory(null);
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white transition-all duration-300 uppercase text-xs font-bold tracking-widest rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                >
                  跳回此关
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 mb-16 text-center text-white/30 max-w-md text-[10px] tracking-[0.3em] uppercase font-light relative z-10">
          <div className="inline-block px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
            "毕业不是终点，拿到 Urkunde 才是解脱。"
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelMap;
