
import React from 'react';

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn p-4">
      <div className="bg-zinc-900 border border-white/20 p-8 md:p-12 max-w-md w-full text-center space-y-8 shadow-2xl">
        <h3 className="text-3xl font-bold serif-font italic">确定返回主菜单？</h3>
        <p className="text-gray-400 font-light leading-relaxed">
          当前的未保存进度将会丢失。<br/>
          (Unsaved progress will be lost.)
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            确定退出 (CONFIRM)
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            继续模拟 (CANCEL)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
