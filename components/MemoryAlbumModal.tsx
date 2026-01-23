import React from 'react';
import { MemoryImage } from '../data/types';

interface MemoryAlbumModalProps {
  images: MemoryImage[];
  onClose: () => void;
}

const MemoryAlbumModal: React.FC<MemoryAlbumModalProps> = ({ images, onClose }) => {
  const [selectedImage, setSelectedImage] = React.useState<MemoryImage | null>(null);

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
                  onClick={() => setSelectedImage(img)}
                  className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all hover:scale-[1.03] hover:shadow-2xl border-2 border-transparent hover:border-blue-500"
                >
                  <div className="aspect-video relative overflow-hidden">
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
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
                      #{img.id.slice(-4)}
                    </span>
                  </div>
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
          onClick={() => setSelectedImage(null)}
        >
          {/* 返回按钮 - 固定在视口右上角，确保不被遮挡 */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
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
              className="max-h-[80vh] w-auto rounded-lg shadow-2xl border border-slate-700"
            />
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-blue-400 font-medium">Chapter {selectedImage.chapter} - Level {selectedImage.level}</p>
              <p className="text-slate-500 text-sm mt-1">{new Date(selectedImage.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryAlbumModal;
