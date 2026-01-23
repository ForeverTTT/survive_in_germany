import { useEffect, useCallback, useRef } from 'react';
import { GameSettings } from '../data/types';
import { BGM_URL, CLICK_SFX_URL } from '../config/constants';

export const useGameAudio = (settings: GameSettings) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // 播放音效
  const playSfx = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.volume = (settings.volume / 100) * 0.5;
    audio.play().catch(() => {});
  }, [settings.volume]);

  // 全局点击音效监听
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        playSfx(CLICK_SFX_URL);
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [playSfx]);

  // 监听音量变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume / 100;
    }
  }, [settings.volume]);

  // 音乐解锁逻辑
  const startMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        document.removeEventListener('mousedown', startMusic);
        document.removeEventListener('keydown', startMusic);
        document.removeEventListener('touchstart', startMusic);
      }).catch(() => {});
    }
  }, []);

  // 注册用户交互监听
  useEffect(() => {
    document.addEventListener('mousedown', startMusic);
    document.addEventListener('keydown', startMusic);
    document.addEventListener('touchstart', startMusic);
    return () => {
      document.removeEventListener('mousedown', startMusic);
      document.removeEventListener('keydown', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };
  }, [startMusic]);

  return { audioRef, playSfx, startMusic };
};
