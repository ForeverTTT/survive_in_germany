import React, { useState } from 'react';
import { GameStats, NPC } from '../data/types';

interface SocialMapProps {
  stats: GameStats;
  onInteract: (npcId: string, type: 'party' | 'study') => void;
  onClose: () => void;
}

const SocialMap: React.FC<SocialMapProps> = ({ stats, onInteract, onClose }) => {
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);

  // Dynamic positions for NPCs in a circle
  const getPosition = (idx: number, total: number) => {
    const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 35; // % of container
    return {
      top: `${50 + radius * Math.sin(angle)}%`,
      left: `${50 + radius * Math.cos(angle)}%`
    };
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-fadeIn overflow-hidden">
      <style>{`
        .social-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .social-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .social-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .social-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
      {/* Background Image Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover grayscale"
          alt="Social Background"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="max-w-6xl w-full h-[85vh] flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Left Side: The Map Visualization */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden flex items-center justify-center backdrop-blur-sm shadow-2xl">
          {/* Background Grid/Connections */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="relative w-full h-full">
             {/* Center Node: You */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 border-2 border-white/30 rounded-full flex flex-col items-center justify-center backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                   <span className="text-2xl md:text-3xl mb-1">👤</span>
                   <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/60">YOU</span>
                </div>
             </div>

             {/* NPC Nodes */}
             {stats.npcs.map((npc, idx) => {
               const pos = getPosition(idx, stats.npcs.length);
               const isSelected = selectedNpc?.id === npc.id;
               const isLocked = npc.isLocked;
               
               return (
                 <div 
                   key={npc.id} 
                   className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                   style={{ top: pos.top, left: pos.left }}
                 >
                   <button 
                     onMouseEnter={() => !isLocked && setSelectedNpc(npc)}
                     onClick={() => !isLocked && setSelectedNpc(npc)}
                     className={`group relative flex flex-col items-center gap-2 transition-all duration-500 ${isSelected ? 'scale-110' : 'hover:scale-105'} ${isLocked ? 'cursor-not-allowed grayscale' : 'opacity-80 hover:opacity-100'}`}
                   >
                     {!isLocked && (
                       <div className="absolute -top-10 px-2 py-0.5 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full text-[9px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {npc.favorability}%
                       </div>
                     )}

                     <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-500 border-2 ${isLocked ? 'bg-black/40 border-white/5' : isSelected ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                       {isLocked ? '🔒' : npc.avatar}
                     </div>
                     <div className="text-center">
                        <h4 className={`text-[10px] font-bold tracking-widest uppercase ${isLocked ? 'text-white/20' : 'text-white'}`}>{isLocked ? '???' : npc.name}</h4>
                        {!isLocked && <div className="h-0.5 w-0 group-hover:w-full bg-blue-500/40 mx-auto transition-all"></div>}
                     </div>
                   </button>
                 </div>
               );
             })}

             {/* Decorative SVG Lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                {stats.npcs.map((npc, idx) => {
                   const pos = getPosition(idx, stats.npcs.length);
                   return (
                     <line 
                        key={`line-${npc.id}`}
                        x1="50%" y1="50%" 
                        x2={pos.left} y2={pos.top} 
                        stroke="white" 
                        strokeWidth="1" 
                        strokeDasharray={npc.isLocked ? "2,2" : "5,5"}
                     />
                   );
                })}
             </svg>
          </div>
        </div>

        {/* Right Side: NPC Details & Interactions */}
        <div className="w-full md:w-[350px] flex flex-col gap-6">
          <div className="flex-none flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-4xl font-black serif-font italic text-white tracking-tight">社交地图</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">Social Connection Graph</p>
            </div>
            {/* Mini Stats Display */}
            <div className="flex flex-col items-end gap-1 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Cash</span>
                <span className="text-sm font-bold text-green-500">€{stats.money.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Sanity</span>
                <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${stats.sanity > 50 ? 'bg-blue-500' : stats.sanity > 20 ? 'bg-orange-500' : 'bg-red-600'}`}
                    style={{ width: `${stats.sanity}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white">{stats.sanity}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 overflow-y-auto social-scroll flex flex-col backdrop-blur-md">
            {selectedNpc ? (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <span className="text-6xl">{selectedNpc.avatar}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedNpc.name}</h3>
                      <p className="text-xs uppercase tracking-widest text-blue-400 font-black">{selectedNpc.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    {selectedNpc.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold">
                    <span className="text-white/40">好感度 Favorability</span>
                    <span className="text-blue-400">{selectedNpc.favorability}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000"
                      style={{ width: `${selectedNpc.favorability}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4">
                  {selectedNpc.id === 'hausmeister_klaus' && (
                    <button 
                      onClick={() => onInteract(selectedNpc.id, 'party')}
                      disabled={stats.money < 30}
                      className={`group relative p-4 bg-orange-500/10 hover:bg-orange-600 text-left transition-all duration-500 border border-orange-500/20 rounded-xl overflow-hidden ${stats.money < 30 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative z-10 flex justify-between items-center">
                        <div>
                          <span className="block text-[8px] uppercase font-black text-orange-400 group-hover:text-orange-200 mb-1">Help with Repairs</span>
                          <span className="text-sm font-bold text-white group-hover:text-black">帮大叔修暖气</span>
                        </div>
                        <span className={`text-xs font-black group-hover:text-black ${stats.money < 30 ? 'text-red-500' : ''}`}>-30 Sanity / +{Math.floor(150 * (1 + selectedNpc.favorability/100))}€</span>
                      </div>
                    </button>
                  )}

                  {selectedNpc.id === 'flatmate_clara' && (
                    <>
                      <button 
                        onClick={() => onInteract(selectedNpc.id, 'party')}
                        disabled={stats.money < 40}
                        className={`group relative p-4 bg-purple-500/10 hover:bg-purple-600 text-left transition-all duration-500 border border-purple-500/20 rounded-xl overflow-hidden ${stats.money < 40 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="block text-[8px] uppercase font-black text-purple-400 group-hover:text-purple-200 mb-1">WG Party</span>
                            <span className="text-sm font-bold text-white group-hover:text-black">邀请参加聚会</span>
                          </div>
                          <span className={`text-xs font-black group-hover:text-black ${stats.money < 40 ? 'text-red-500' : ''}`}>-40€ / +{Math.floor(20 * (1 + selectedNpc.favorability/100))} Sanity</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => onInteract(selectedNpc.id, 'study')}
                        disabled={stats.sanity < 15}
                        className={`group relative p-4 bg-blue-500/10 hover:bg-blue-600 text-left transition-all duration-500 border border-blue-500/20 rounded-xl overflow-hidden ${stats.sanity < 15 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="block text-[8px] uppercase font-black text-blue-400 group-hover:text-blue-200 mb-1">Language Exchange</span>
                            <span className="text-sm font-bold text-white group-hover:text-black">德意语言交换</span>
                          </div>
                          <span className={`text-xs font-black group-hover:text-black ${stats.sanity < 15 ? 'text-red-500' : ''}`}>-15 Sanity / +5 Favor</span>
                        </div>
                      </button>
                    </>
                  )}

                  {selectedNpc.id === 'prof_schmidt' && (
                    <>
                      <button 
                        onClick={() => onInteract(selectedNpc.id, 'study')}
                        disabled={stats.sanity < 40}
                        className={`group relative p-4 bg-emerald-500/10 hover:bg-emerald-600 text-left transition-all duration-500 border border-emerald-500/20 rounded-xl overflow-hidden ${stats.sanity < 40 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="block text-[8px] uppercase font-black text-emerald-400 group-hover:text-emerald-200 mb-1">Research Assistant</span>
                            <span className="text-sm font-bold text-white group-hover:text-black">申请助研岗位</span>
                          </div>
                          <span className={`text-xs font-black group-hover:text-black ${stats.sanity < 40 ? 'text-red-500' : ''}`}>-40 Sanity / +{Math.floor(2 * (1 + selectedNpc.favorability/100))} ECTS</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => onInteract(selectedNpc.id, 'party')}
                        disabled={stats.money < 100}
                        className={`group relative p-4 bg-amber-500/10 hover:bg-amber-600 text-left transition-all duration-500 border border-amber-500/20 rounded-xl overflow-hidden ${stats.money < 100 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="block text-[8px] uppercase font-black text-amber-400 group-hover:text-amber-200 mb-1">Academic Dinner</span>
                            <span className="text-sm font-bold text-white group-hover:text-black">请教授吃中餐</span>
                          </div>
                          <span className={`text-xs font-black group-hover:text-black ${stats.money < 100 ? 'text-red-500' : ''}`}>-100€ / +15 Favor</span>
                        </div>
                      </button>
                    </>
                  )}

                  {selectedNpc.id === 'senior_l' && (
                    <>
                      <button 
                        onClick={() => onInteract(selectedNpc.id, 'study')}
                        disabled={stats.sanity < 20}
                        className={`group relative p-4 bg-indigo-500/10 hover:bg-indigo-600 text-left transition-all duration-500 border border-indigo-500/20 rounded-xl overflow-hidden ${stats.sanity < 20 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="block text-[8px] uppercase font-black text-indigo-400 group-hover:text-indigo-200 mb-1">Exam Tips</span>
                            <span className="text-sm font-bold text-white group-hover:text-black">讨要考试真题</span>
                          </div>
                          <span className={`text-xs font-black group-hover:text-black ${stats.sanity < 20 ? 'text-red-500' : ''}`}>-20 Sanity / +{Math.floor(5 * (1 + selectedNpc.favorability/100))} ECTS</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => onInteract(selectedNpc.id, 'party')}
                        disabled={stats.money < 20}
                        className={`group relative p-4 bg-rose-500/10 hover:bg-rose-600 text-left transition-all duration-500 border border-rose-500/20 rounded-xl overflow-hidden ${stats.money < 20 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="block text-[8px] uppercase font-black text-rose-400 group-hover:text-rose-200 mb-1">Beer Garden</span>
                            <span className="text-sm font-bold text-white group-hover:text-black">去啤酒花园吐槽</span>
                          </div>
                          <span className={`text-xs font-black group-hover:text-black ${stats.money < 20 ? 'text-red-500' : ''}`}>-20€ / +{Math.floor(10 * (1 + selectedNpc.favorability/100))} Sanity</span>
                        </div>
                      </button>
                    </>
                  )}

                  {selectedNpc.id === 'auslaenderbehoerde_frau_muller' && (
                    <button 
                      onClick={() => onInteract(selectedNpc.id, 'study')}
                      disabled={stats.sanity < 50}
                      className={`group relative p-4 bg-slate-500/10 hover:bg-slate-600 text-left transition-all duration-500 border border-slate-500/20 rounded-xl overflow-hidden ${stats.sanity < 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative z-10 flex justify-between items-center">
                        <div>
                          <span className="block text-[8px] uppercase font-black text-slate-400 group-hover:text-slate-200 mb-1">Visa Extension</span>
                          <span className="text-sm font-bold text-white group-hover:text-black">卑微延签</span>
                        </div>
                        <span className={`text-xs font-black group-hover:text-black ${stats.sanity < 50 ? 'text-red-500' : ''}`}>-50 Sanity / +{Math.floor(10 * (1 + selectedNpc.favorability/100))} Favor</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center text-2xl">
                  🔍
                </div>
                <p className="text-xs uppercase tracking-widest font-bold">点击节点查看详情<br/>(Select a node to view)</p>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-gray-200 transition-all rounded-2xl shadow-xl"
          >
            返回主界面 (BACK)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMap;
