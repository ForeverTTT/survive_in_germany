import React, { useState } from 'react';
import { DiaryEntry } from '../types';

interface DiaryModalProps {
  entries: DiaryEntry[];
  currentLocation?: string;
  chapter: number;
  level: number;
  onSave: (content: string, mood: DiaryEntry['mood']) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const DiaryModal: React.FC<DiaryModalProps> = ({ entries, currentLocation, chapter, level, onSave, onDelete, onClose }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<DiaryEntry['mood']>('neutral');
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSave = () => {
    if (newContent.trim()) {
      onSave(newContent, selectedMood);
      setNewContent('');
      setIsWriting(false);
    }
  };

  const moods: { type: DiaryEntry['mood']; icon: string; label: string }[] = [
    { type: 'happy', icon: '😊', label: '开心' },
    { type: 'neutral', icon: '😐', label: '一般' },
    { type: 'stressed', icon: '😫', label: '压力大' },
    { type: 'sad', icon: '😢', label: '难过' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
      <style>{`
        .diary-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .diary-scroll::-webkit-scrollbar-track {
          background: rgba(139, 94, 60, 0.05);
        }
        .diary-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 94, 60, 0.2);
          border-radius: 10px;
        }
        .diary-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 94, 60, 0.4);
        }
      `}</style>
      <div className="bg-[#f4f1ea] border-8 border-[#8b5e3c] w-full max-w-4xl h-[85vh] rounded-lg overflow-hidden flex flex-col shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative">
        {/* Book Spine Shadow */}
        <div className="absolute left-[48%] top-0 bottom-0 w-8 bg-black/10 z-10 pointer-events-none"></div>
        
        {/* Header */}
        <div className="p-6 border-b-2 border-[#8b5e3c]/20 flex justify-between items-center bg-[#eaddca]">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-[#5d4037] serif-font flex items-center">
              <span className="mr-3">📓</span> 留德生存日记 (Tagebuch)
            </h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#8b5e3c]/60">
              日记会随存档恢复；重新开始不会清除。仅「彻底重置 (Nuclear Reset)」会抹除。
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-[#8b5e3c]/10 hover:bg-[#8b5e3c]/20 border-2 border-[#8b5e3c]/30 rounded-full transition-all duration-300 text-[#5d4037] group shadow-lg"
          >
            <svg className="w-8 h-8 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Page: Entry List */}
          <div className="w-1/2 overflow-y-auto p-6 bg-[#fdfbf7] border-r border-[#8b5e3c]/10 diary-scroll">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#5d4037]">过往记录 ({entries.length})</h3>
              <button 
                onClick={() => {
                  setIsWriting(true);
                  setViewingEntry(null);
                }}
                className="px-4 py-2 bg-[#8b5e3c] text-white rounded hover:bg-[#6f4a30] transition-colors text-sm font-bold"
              >
                + 写日记
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-[#8b5e3c]/40 italic">
                <p>今天还没有写过日记...</p>
                <p className="text-xs mt-2">记录下你在德国的点点滴滴吧</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.sort((a, b) => b.timestamp - a.timestamp).map((entry) => (
                  <div 
                    key={entry.id}
                    onClick={() => {
                      setViewingEntry(entry);
                      setIsWriting(false);
                    }}
                    className={`p-4 border-b border-[#8b5e3c]/10 cursor-pointer transition-all hover:bg-[#8b5e3c]/5 rounded ${
                      viewingEntry?.id === entry.id ? 'bg-[#8b5e3c]/10 ring-1 ring-[#8b5e3c]/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-[#8b5e3c]/60">
                        {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-lg">
                        {moods.find(m => m.type === entry.mood)?.icon || '😐'}
                      </span>
                    </div>
                    <p className="text-[#5d4037] line-clamp-2 text-sm leading-relaxed">
                      {entry.content}
                    </p>
                    <div className="mt-2 flex items-center text-[10px] text-[#8b5e3c]/40 uppercase tracking-wider">
                      <span>CH {entry.chapter} - LV {entry.level}</span>
                      {entry.location && <span className="ml-2">• {entry.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Page: Write or View Area */}
          <div className="w-1/2 overflow-y-auto p-8 bg-[#fdfbf7] diary-scroll relative">
            {isWriting ? (
              <div className="h-full flex flex-col animate-fadeIn">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#5d4037] mb-4">记录此刻...</h3>
                  <div className="flex gap-4 mb-6">
                    {moods.map((m) => (
                      <button
                        key={m.type}
                        onClick={() => setSelectedMood(m.type)}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all border-2 ${
                          selectedMood === m.type 
                            ? 'bg-[#8b5e3c]/20 border-[#8b5e3c] scale-110' 
                            : 'bg-transparent border-transparent grayscale hover:grayscale-0'
                        }`}
                      >
                        <span className="text-2xl mb-1">{m.icon}</span>
                        <span className="text-[10px] font-bold text-[#5d4037]">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 relative mb-6">
                  {/* Lined Paper Effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 border-t border-[#8b5e3c]" 
                       style={{ background: 'repeating-linear-gradient(transparent, transparent 31px, #8b5e3c 31px, #8b5e3c 32px)', marginTop: '38px' }}>
                  </div>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="亲爱的日记，今天在德国..."
                    className="w-full h-full bg-transparent border-none focus:ring-0 text-[#5d4037] text-lg leading-[32px] resize-none placeholder:text-[#8b5e3c]/20 relative z-10 pt-2"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button 
                    onClick={() => setIsWriting(false)}
                    className="px-6 py-2 text-[#8b5e3c] hover:bg-[#8b5e3c]/5 rounded font-bold transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!newContent.trim()}
                    className="px-8 py-2 bg-[#8b5e3c] text-white rounded font-bold hover:bg-[#6f4a30] transition-colors shadow-lg disabled:opacity-50"
                  >
                    落笔存档
                  </button>
                </div>
              </div>
            ) : viewingEntry ? (
              <div className="h-full flex flex-col animate-fadeIn">
                <div className="mb-8 border-b-2 border-[#8b5e3c]/10 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg text-[#8b5e3c]/60 serif-font italic">
                      {new Date(viewingEntry.timestamp).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-2xl filter sepia opacity-80">{moods.find(m => m.type === viewingEntry.mood)?.icon || '😐'}</span>
                  </div>
                  <div className="flex gap-4 text-xs font-bold text-[#8b5e3c]/40 uppercase tracking-[0.2em]">
                    <span>Chapter {viewingEntry.chapter}</span>
                    <span>Level {viewingEntry.level}</span>
                    {viewingEntry.location && <span>@ {viewingEntry.location}</span>}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto diary-scroll pr-4 mb-4">
                  <div className="text-[#5d4037] text-xl md:text-2xl leading-[2.2] serif-font whitespace-pre-wrap italic break-all w-full">
                    {viewingEntry.content}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between items-center border-t-2 border-[#8b5e3c]/10 pt-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(viewingEntry.id)}
                    className="text-red-800/40 hover:text-red-800 transition-colors text-sm font-bold flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    撕掉这一页
                  </button>
                  <div className="w-16 h-1 bg-[#8b5e3c] rounded-full opacity-30"></div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#8b5e3c]/40 text-center">
                <div className="text-6xl mb-6 opacity-10">📖</div>
                <p className="text-xl serif-font italic">选择一篇日记阅读，<br/>或者开始书写新的篇章。</p>
              </div>
            )}

            {/* In-game Delete Confirmation Overlay */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 bg-[#f4f1ea]/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-fadeIn backdrop-blur-sm">
                <div className="text-4xl mb-4">🗑️</div>
                <h3 className="text-xl font-bold text-[#5d4037] mb-2">确定要撕掉这一页日记吗？</h3>
                <p className="text-sm text-[#8b5e3c]/60 mb-8 font-serif italic">这段回忆将被永久抹去，无法找回。</p>
                <div className="flex flex-col w-full gap-3">
                  <button 
                    onClick={() => {
                      onDelete(showDeleteConfirm);
                      setShowDeleteConfirm(null);
                      setViewingEntry(null);
                    }}
                    className="w-full py-3 bg-red-800 text-white font-bold rounded shadow-lg hover:bg-red-900 transition-colors"
                  >
                    确认撕掉 (CONFIRM)
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(null)}
                    className="w-full py-3 border-2 border-[#8b5e3c]/20 text-[#8b5e3c] font-bold rounded hover:bg-[#8b5e3c]/5 transition-colors"
                  >
                    保留它 (CANCEL)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
