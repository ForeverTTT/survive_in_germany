import { useState, useCallback, useEffect } from 'react';
import { GameStats, Achievement } from '../data/types';
import { ACHIEVEMENTS, SUCCESS_SFX_URL } from '../config/constants';
import { GLOBAL_PROGRESS_KEY } from '../config/keys';

export const useAchievements = (playSfx: (url: string) => void) => {
  const [globalAchievements, setGlobalAchievements] = useState<string[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);

  // 加载全局成就
  useEffect(() => {
    try {
      const globalData = localStorage.getItem(GLOBAL_PROGRESS_KEY);
      if (globalData) {
        const { achievements } = JSON.parse(globalData);
        setGlobalAchievements(achievements || []);
      }
    } catch (e) {
      console.warn("Global data corrupted, clearing...", e);
      localStorage.removeItem(GLOBAL_PROGRESS_KEY);
    }
  }, []);

  // 检查成就解锁逻辑
  const checkAchievements = useCallback((currentStats: GameStats) => {
    const unlockedIds = [...new Set([...(currentStats.achievements || []), ...globalAchievements])];
    const achievementsToUnlock: Achievement[] = [];

    if (!unlockedIds.includes('sanity_collapse') && currentStats.sanity < 10 && currentStats.sanity > 0) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'sanity_collapse')!;
      achievementsToUnlock.push(ach);
    }

    if (!unlockedIds.includes('db_victim') && currentStats.delayCount >= 3) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'db_victim')!;
      achievementsToUnlock.push(ach);
    }

    if (!unlockedIds.includes('illegal_work') && currentStats.workCount >= 5) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'illegal_work')!;
      achievementsToUnlock.push(ach);
    }

    if (!unlockedIds.includes('graduate_victory') && currentStats.ects >= 180) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'graduate_victory')!;
      achievementsToUnlock.push(ach);
    }

    return { achievementsToUnlock, newUnlockedIds: [...new Set([...unlockedIds, ...achievementsToUnlock.map(a => a.id)])] };
  }, [globalAchievements]);

  const unlockAchievements = useCallback((stats: GameStats, updateStats: (updater: (prev: GameStats) => GameStats) => void) => {
    const { achievementsToUnlock, newUnlockedIds } = checkAchievements(stats);
    
    if (achievementsToUnlock.length > 0) {
      updateStats(prev => ({ ...prev, achievements: newUnlockedIds }));
      setGlobalAchievements(newUnlockedIds);
      localStorage.setItem(GLOBAL_PROGRESS_KEY, JSON.stringify({ achievements: newUnlockedIds }));
      setActiveAchievement(achievementsToUnlock[0]);
      playSfx(SUCCESS_SFX_URL);
    }
  }, [checkAchievements, playSfx]);

  return {
    globalAchievements,
    setGlobalAchievements,
    activeAchievement,
    setActiveAchievement,
    checkAchievements,
    unlockAchievements
  };
};
