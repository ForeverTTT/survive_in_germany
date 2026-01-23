import React from 'react';
import { Letter } from '../data/types';

interface MailboxModalProps {
  letters: Letter[];
  onClose: () => void;
  onRead: (id: string) => void;
  onAction: (letter: Letter) => void;
  onDelete: (id: string) => void;
}

const MailboxModal: React.FC<MailboxModalProps> = ({ letters, onClose, onRead, onAction, onDelete }) => {
  const [selectedLetter, setSelectedLetter] = React.useState<Letter | null>(null);
  const [selectedLetterKey, setSelectedLetterKey] = React.useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<{ key: string; letter: Letter } | null>(null);

  const handleSelect = (letter: Letter, key: string) => {
    setSelectedLetter(letter);
    setSelectedLetterKey(key);
    if (!letter.isRead) {
      onRead(letter.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <style>{`
        .mailbox-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .mailbox-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .mailbox-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .mailbox-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center">
            <span className="mr-2">📬</span> 我的信箱 (Briefkasten)
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/40 border-2 border-white/30 rounded-full text-white transition-all duration-300 shadow-xl backdrop-blur-xl group"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Letter List */}
          <div className="w-1/3 border-r border-slate-700 overflow-y-auto bg-slate-900/50 mailbox-scroll">
            {letters.length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic">
                目前没有任何信件
              </div>
            ) : (
              letters
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((letter, index) => {
                  const entryKey = `${letter.id}-${letter.timestamp}-${letter.sender}-${index}`;
                  return (
                    <div
                      key={entryKey}
                      onClick={() => handleSelect(letter, entryKey)}
                      className={`relative p-4 border-b border-slate-800 cursor-pointer transition-all hover:bg-slate-800 ${
                        selectedLetterKey === entryKey ? 'bg-slate-800 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          letter.type === 'bill' ? 'bg-red-900/50 text-red-300' : 
                          letter.type === 'action' ? 'bg-blue-900/50 text-blue-300' : 
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {letter.type === 'bill' ? '账单' : letter.type === 'action' ? '互动' : '通知'}
                        </span>
                      </div>
                      <h3 className={`font-medium truncate ${letter.isRead ? 'text-slate-400' : 'text-slate-100'}`}>
                        {letter.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        来自: {letter.sender}
                      </p>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setPendingDelete({ key: entryKey, letter });
                          }}
                          className="text-xs uppercase tracking-[0.3em] text-red-400 hover:text-white transition-colors"
                          title="删除信件"
                        >
                          删除
                        </button>
                      </div>
                      {!letter.isRead && (
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white/40 shadow-[0_0_15px_rgba(37,99,235,0.7)]"></span>
                      )}
                    </div>
                  );
                })
            )}
          </div>

          {/* Letter Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-white/5 mailbox-scroll">
            {pendingDelete && (
              <div className="mb-6 rounded-2xl border border-red-700/70 bg-red-900/20 px-4 py-3 text-sm space-y-2">
                <div className="flex flex-col gap-2">
                  <p className="text-red-100">
                    确认删除 “{pendingDelete.letter.title}” 吗？该操作不可撤销。
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(pendingDelete.letter.id);
                        if (pendingDelete.key === selectedLetterKey) {
                          setSelectedLetter(null);
                          setSelectedLetterKey(null);
                        }
                        setPendingDelete(null);
                      }}
                      className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 py-2 text-xs uppercase tracking-[0.4em] text-white transition-colors"
                    >
                      确认删除
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(null)}
                      className="flex-1 rounded-lg border border-red-600 text-red-200 hover:border-red-400 hover:text-white py-2 text-xs uppercase tracking-[0.4em] transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}
            {selectedLetter ? (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8 border-b border-slate-700 pb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedLetter.title}</h3>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>发送者: {selectedLetter.sender}</span>
                    <span>{new Date(selectedLetter.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedLetter.content}
                  </p>
                </div>

                {selectedLetter.action && (
                  <div className="mt-8 p-6 bg-slate-800 rounded-lg border border-slate-700 animate-pulse">
                    <p className="text-sm text-slate-400 mb-4 italic">此信件需要你做出决定：</p>
                    <button 
                      onClick={() => {
                        onAction(selectedLetter);
                        setSelectedLetter(null);
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02]"
                    >
                      {selectedLetter.action.text}
                    </button>
                  </div>
                )}
                
                <div className="mt-8 text-center text-slate-500 italic text-sm border-t border-slate-800 pt-4">
                  - 完 -
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                请从左侧选择一封信件阅读
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailboxModal;
