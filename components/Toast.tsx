
import React from 'react';

interface ToastProps {
  message: string;
  onDismiss?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  return (
    <div 
      className="fixed top-[85px] left-0 w-full flex justify-center z-[100] animate-fadeIn cursor-pointer"
      onClick={onDismiss}
    >
      <div className="bg-black/80 backdrop-blur-xl text-white px-8 py-2 rounded-full border border-white/20 font-medium text-[10px] md:text-sm tracking-widest shadow-2xl flex items-center gap-3">
        <span>{message}</span>
        <span className="opacity-30 text-[8px] border border-white/20 rounded px-1">点击关闭</span>
      </div>
    </div>
  );
};

export default Toast;
