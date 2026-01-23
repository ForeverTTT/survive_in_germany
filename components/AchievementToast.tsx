import React, { useEffect, useState } from 'react';
import { Achievement } from '../data/types';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 1000); // Wait for fade out animation
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] transition-all duration-1000 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="bg-zinc-900 border border-yellow-500/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.2)] flex items-center gap-6 min-w-[320px] max-w-md overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent pointer-events-none"></div>
        <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center text-4xl shadow-inner border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
          {achievement.icon}
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 font-black mb-1">Achievement Unlocked!</p>
          <h4 className="text-xl font-bold italic serif-font text-white">{achievement.title}</h4>
          <p className="text-xs text-white/40 font-light mt-1">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
