import { useEffect, useCallback, useRef } from 'react';
import { GameSettings } from '../data/types';
import { CLICK_SFX_URL } from '../config/constants';

export const useGameAudio = (settings: GameSettings) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // 兼容旧存档：如果没有新字段，使用旧的 volume 或默认值
  const musicVolume = settings.musicVolume ?? settings.volume ?? 60;
  const sfxVolume = settings.sfxVolume ?? settings.volume ?? 80;

  // 播放音效
  const playSfx = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.volume = (sfxVolume / 100) * 0.5;
    audio.play().catch(() => {});
  }, [sfxVolume]);

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

  // 监听音乐音量变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

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
