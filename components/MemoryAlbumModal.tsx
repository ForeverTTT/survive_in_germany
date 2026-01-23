import React from 'react';
import { MemoryImage } from '../data/types';

interface MemoryAlbumModalProps {
  images: MemoryImage[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

const MemoryAlbumModal: React.FC<MemoryAlbumModalProps> = ({ images, onClose, onDelete }) => {
  const [selectedImage, setSelectedImage] = React.useState<MemoryImage | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
      <style>{`
        .album-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .album-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .album-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .album-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
          border: 2px solid transparent;
          background-clip: content-box;
        }
      `}</style>
      <div className="w-full h-full p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center">
            <span className="mr-2">📸</span> 留德记忆相册 (Erinnerungsalbum)
            <span className="ml-4 text-sm font-normal text-slate-400">
              收集了 {images.length} 张回忆片段
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-3 bg-white/20 hover:bg-white/40 border-2 border-white/30 rounded-full text-white transition-all duration-300 shadow-2xl backdrop-blur-xl group"
          >
            <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 album-scroll">
          {images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <div className="text-6-xl mb-4 opacity-20">📷</div>
              <p className="text-xl">目前还没有收集到任何记忆...</p>
              <p className="mt-2 text-sm">继续游戏，AI 生成的精美图片会被自动保存在这里。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
              {images.sort((a, b) => b.timestamp - a.timestamp).map((img) => (
                <div 
                  key={img.id}
                  className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-[1.03] hover:shadow-2xl border-2 border-transparent hover:border-blue-500"
                >
                  <div 
                    className="aspect-video relative overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={img.url} 
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-xs text-blue-400 font-bold mb-1">Chapter {img.chapter} - Level {img.level}</p>
                      <p className="text-white font-medium truncate">{img.title}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      {new Date(img.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDeleteId(img.id);
                        }}
                        className="text-[10px] px-2 py-0.5 text-red-400 hover:text-white hover:bg-red-600 rounded transition-colors"
                        title="删除"
                      >
                        删除
                      </button>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
                        #{img.id.slice(-4)}
                      </span>
                    </div>
                  </div>
                  {/* 删除确认弹层 */}
                  {pendingDeleteId === img.id && (
                    <div 
                      className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-10 animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-red-100 text-sm mb-4 text-center">确认删除？</p>
                      <div className="flex gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(img.id);
                            setPendingDeleteId(null);
                          }}
                          className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 py-2 text-xs text-white transition-colors"
                        >
                          删除
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(null)}
                          className="flex-1 rounded-lg border border-white/30 text-white hover:bg-white/10 py-2 text-xs transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 animate-fadeIn"
          onClick={() => {
            setSelectedImage(null);
            setConfirmDelete(false);
          }}
        >
          {/* 返回按钮 - 固定在视口右上角，确保不被遮挡 */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
              setConfirmDelete(false);
            }}
            className="fixed top-6 right-6 z-[120] p-3 bg-white/20 hover:bg-white/40 border-2 border-white/30 rounded-full text-white transition-all duration-300 shadow-2xl backdrop-blur-xl group flex items-center gap-2"
            style={{ marginTop: 'env(safe-area-inset-top, 0)' }}
          >
            <span className="text-sm font-bold ml-2">关闭</span>
            <svg className="w-8 h-8 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="max-h-[60vh] w-auto rounded-lg shadow-2xl border border-slate-700"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-blue-400 font-medium">Chapter {selectedImage.chapter} - Level {selectedImage.level}</p>
              <p className="text-slate-500 text-sm mt-1">{new Date(selectedImage.timestamp).toLocaleString()}</p>
            </div>
            <div className="mt-4 w-full max-w-sm">
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full rounded-lg border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white py-3 text-xs uppercase tracking-[0.4em] transition-all"
              >
                删除这张照片
              </button>
            </div>
          </div>

          {/* 删除确认弹窗 - 固定在屏幕中央 */}
          {confirmDelete && (
            <div 
              className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
              }}
            >
              <div 
                className="bg-slate-900 border border-red-700/70 rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-4xl mb-4">🗑️</div>
                <p className="text-red-100 mb-6">确认删除这张照片吗？该操作不可撤销。</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(selectedImage.id);
                      setSelectedImage(null);
                      setConfirmDelete(false);
                    }}
                    className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 py-3 text-sm font-bold text-white transition-colors"
                  >
                    确认删除
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 rounded-lg border border-white/30 text-white hover:bg-white/10 py-3 text-sm font-bold transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoryAlbumModal;
