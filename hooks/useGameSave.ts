import { useState, useEffect, useCallback } from 'react';
import { GameStats, Scenario, GameSettings } from '../data/types';
import { getScenarioById } from '../data/scenariosDatabase';
import introBg from '../assets/media/images/intro.png';
import { SAVE_KEY, MENU_BG_CACHE_KEY } from '../config/keys';

export const useGameSave = (showToast: (msg: string) => void) => {
  const [hasSave, setHasSave] = useState<boolean>(false);
  const [menuBg, setMenuBg] = useState<string>(() => {
    try {
      return localStorage.getItem(MENU_BG_CACHE_KEY) || '';
    } catch {
      return '';
    }
  });

  // 自动存档逻辑
  const autoSave = useCallback((
    stats: GameStats,
    currentScenario: Scenario | null,
    bgImage: string,
    globalAchievements: string[],
    settings: GameSettings
  ) => {
    const hasGlobalData = stats.diary?.length > 0 || stats.mailbox?.length > 0 || stats.achievements?.length > 0;
    
    if (stats.identity || hasGlobalData) {
      const existingSaveStr = localStorage.getItem(SAVE_KEY);
      let scenarioToSave = currentScenario;
      let bgToSave = bgImage;

      if (!scenarioToSave && existingSaveStr) {
        try {
          const existing = JSON.parse(existingSaveStr);
          scenarioToSave = existing.currentScenario;
          bgToSave = existing.bgImage;
        } catch (e) {
          // ignore parse errors
        }
      }

      const saveData = {
        stats,
        currentScenario: scenarioToSave,
        bgImage: bgToSave,
        globalAchievements,
        settings,
        timestamp: Date.now()
      };
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      setHasSave(!!scenarioToSave);

      // 同步到物理磁盘
      const API_BASE = `${window.location.protocol}//${window.location.hostname}:3001`;
      fetch(`${API_BASE}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      }).catch(err => console.warn("Local File Server not running, skipping disk sync."));
    }
  }, []);

  // 从磁盘同步数据
  const syncFromDisk = useCallback(async () => {
    const API_BASE = `${window.location.protocol}//${window.location.hostname}:3001`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    try {
      const response = await fetch(`${API_BASE}/api/load`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const diskData = await response.json();
        if (diskData && diskData.stats) {
          let localSave: any = null;
          try {
            const raw = localStorage.getItem(SAVE_KEY);
            localSave = raw ? JSON.parse(raw) : null;
          } catch {
            localSave = null;
          }
          
          const diskTs = Number(diskData.timestamp || 0);
          const localTs = Number(localSave?.timestamp || 0);
          const useLocal = !!localSave && localSave?.stats && localTs > diskTs;
          const chosen = useLocal ? localSave : diskData;

          // 日记特殊处理：合并磁盘和本地
          const mergeDiaries = (a: any[] | undefined, b: any[] | undefined) => {
            const map = new Map<string, any>();
            const push = (arr?: any[]) => {
              if (!Array.isArray(arr)) return;
              for (const e of arr) {
                if (e && e.id) map.set(String(e.id), e);
              }
            };
            push(a);
            push(b);
            return Array.from(map.values()).sort((x, y) => (Number(y?.timestamp || 0) - Number(x?.timestamp || 0)));
          };
          
          const mergedDiary = mergeDiaries(diskData?.stats?.diary, localSave?.stats?.diary);
          if (chosen?.stats) {
            chosen.stats.diary = mergedDiary;
          }

          showToast(useLocal ? "已载入更新的浏览器存档 (Prefer Local)" : "本地物理存档已同步 (Data Synced from Disk)");
          return chosen;
        }
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.warn("Local File Server not reachable, using browser storage only.");
    }
    return null;
  }, [showToast]);

  // 加载本地存档
  const loadLocalSave = useCallback(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (parseErr) {
        console.warn("LocalStorage data corrupted, clearing...", parseErr);
        localStorage.removeItem(SAVE_KEY);
      }
    }
    return null;
  }, []);

  // 清除存档
  const clearSave = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setHasSave(false);
  }, []);

  // 初始化菜单背景
  useEffect(() => {
    const OLD_DEFAULT_MENU_BG = 'https://images.unsplash.com/photo-1546726747-0411da142385?w=1920&q=80';
    // 增加对旧本地路径的检测
    const isOldLocalPath = menuBg && (menuBg.includes('/image/') || menuBg.includes('undefined'));
    
    const shouldReplace =
      !menuBg ||
      menuBg === OLD_DEFAULT_MENU_BG ||
      menuBg.includes('images.unsplash.com/photo-1546726747-0411da142385') ||
      isOldLocalPath;

    if (shouldReplace) {
      console.log('Detected invalid menuBg, resetting to introBg:', introBg);
      setMenuBg(introBg);
      localStorage.setItem(MENU_BG_CACHE_KEY, introBg);
    }
  }, [menuBg]); // 增加 menuBg 依赖，确保在发现错误时能重置

  return {
    hasSave,
    setHasSave,
    menuBg,
    setMenuBg,
    autoSave,
    syncFromDisk,
    loadLocalSave,
    clearSave
  };
};
