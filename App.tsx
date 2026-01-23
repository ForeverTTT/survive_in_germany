
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { GameStats, Scenario, GameStatus, GameOption, HistoryEntry, GameSettings, Achievement, Identity, Letter, MemoryImage, CrisisEvent, DiaryEntry } from './data/types';
import { INITIAL_STATS, START_SCENARIO, LOADING_TIPS, LOADING_MESSAGES, DAG_STAGES, DEFAULT_SETTINGS, ACHIEVEMENTS, CLICK_SFX_URL, SUCCESS_SFX_URL, LETTER_TEMPLATES, INITIAL_NPCS, CRISIS_EVENTS } from './config/constants';
import { getScenarioByChapterLevel, getNextScenario, ALL_SCENARIOS, getScenarioById } from './data/scenariosDatabase';
import { generateScenarioImage } from './services/geminiService';
import { IMAGE_STATE_KEY } from './utils/imageState';
import { pickRandomLocalSceneBg, rollMicroEvent } from './utils/gameLogic';
import { useGameAudio, useAchievements, useGameSave } from './hooks';
import { SAVE_KEY, SETTINGS_KEY, GLOBAL_PROGRESS_KEY, MENU_BG_CACHE_KEY } from './config/keys';

// 通用 UI 组件
import LevelMap from './components/LevelMap';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import SettingsMenu from './components/SettingsMenu';
import IdentitySelector from './components/IdentitySelector';
import AchievementToast from './components/AchievementToast';
import SocialMap from './components/SocialMap';
import CrisisOverlay from './components/CrisisOverlay';
import MailboxModal from './components/MailboxModal';
import MemoryAlbumModal from './components/MemoryAlbumModal';
import DiaryModal from './components/DiaryModal';

// 页面组件
import MainMenu from './pages/Start/MainMenu';
import GameLoader from './pages/Loading/GameLoader';
import PlayPage from './pages/Play/PlayPage';
import ResultPage from './pages/Result/ResultPage';

// 首页主题图
import introBg from './assets/media/images/intro.png';

// 本地 BGM
import localBgm from './assets/media/audios/bgm.mp3';

// 返回主菜单音效
import zugausSfx from './assets/media/audios/zugaus.mp3';

// 开场视频
import introVideo from './assets/media/videos/start.mp4';

// 故事介绍背景图
import storyIntroBg from './assets/media/images/bg_1.png';

// 打字机文字组件
const TypewriterText: React.FC<{ 
  text: string; 
  delay?: number; 
  speed?: number;
  className?: string; 
  onComplete?: () => void 
}> = ({ text, delay = 0, speed = 25, className = '', onComplete }) => {
  const [displayed, setDisplayed] = React.useState('');
  const [started, setStarted] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  
  React.useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);
  
  React.useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!completed) {
      setCompleted(true);
      onComplete?.();
    }
  }, [displayed, started, text, speed, onComplete, completed]);
  
  return (
    <span className={className}>
      {displayed}
      {!completed && started && <span className="animate-pulse text-green-400 ml-0.5">▊</span>}
    </span>
  );
};

// 选项结果浮层停留时长（毫秒）：让玩家有时间读完结果
const RESULT_OVERLAY_DURATION_MS = 7000;

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error?.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '24px', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '20px', marginBottom: '12px' }}>App crashed</h1>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>Error: {this.state.error}</p>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 核心状态
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 合并默认值，确保新字段存在（兼容旧存档）
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          // 如果旧存档只有 volume，迁移到新字段
          musicVolume: parsed.musicVolume ?? parsed.volume ?? DEFAULT_SETTINGS.musicVolume,
          sfxVolume: parsed.sfxVolume ?? parsed.volume ?? DEFAULT_SETTINGS.sfxVolume,
        };
      }
      return DEFAULT_SETTINGS;
    } catch (err) {
      console.warn("Settings cache corrupted, reset to defaults.", err);
      try {
        localStorage.removeItem(SETTINGS_KEY);
      } catch {}
      return DEFAULT_SETTINGS;
    }
  });
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [bgImage, setBgImage] = useState<string>('');
  const [loadingMsg, setLoadingMsg] = useState<string>('正在准备降落法兰克福...');
  const [resultOverlay, setResultOverlay] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showIdentitySelector, setShowIdentitySelector] = useState<boolean>(false);
  const [showSocialMap, setShowSocialMap] = useState<boolean>(false);
  const [showMailbox, setShowMailbox] = useState<boolean>(false);
  const [showMemoryAlbum, setShowMemoryAlbum] = useState<boolean>(false);
  const [showDiary, setShowDiary] = useState<boolean>(false);
  const [activeCrisis, setActiveCrisis] = useState<CrisisEvent | null>(null);
  const [loadingTip, setLoadingTip] = useState<string>('');
  const [microEvent, setMicroEvent] = useState<{ text: string; statImpact: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showConfirmMenu, setShowConfirmMenu] = useState<boolean>(false);
  const [showIntroVideo, setShowIntroVideo] = useState<boolean>(false);
  const [showStoryIntro, setShowStoryIntro] = useState<boolean>(false);
  const [pendingIdentity, setPendingIdentity] = useState<Identity | null>(null);

  // Toast 提示函数（需要在 hooks 之前定义）
  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // 使用自定义 hooks
  const { audioRef, playSfx, startMusic } = useGameAudio(settings);
  const { 
    globalAchievements, 
    setGlobalAchievements, 
    activeAchievement, 
    setActiveAchievement,
    unlockAchievements 
  } = useAchievements(playSfx);
  const { 
    hasSave, 
    setHasSave, 
    menuBg, 
    setMenuBg, 
    autoSave, 
    syncFromDisk, 
    loadLocalSave,
    clearSave 
  } = useGameSave(showToast);

  // 在状态改变时检查成就
  useEffect(() => {
    unlockAchievements(stats, setStats);
  }, [stats.money, stats.sanity, stats.ects, unlockAchievements]);

  // 自动存档逻辑
  useEffect(() => {
    autoSave(stats, currentScenario, bgImage, globalAchievements, settings);
  }, [stats, currentScenario, bgImage, globalAchievements, settings, autoSave]);

  // 保存设置到本地
  const updateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    showToast("设置已应用 (Settings Applied)");
  }, [showToast]);

  // 🚨 终极保护：5秒后强制解除黑屏（即使 useEffect 没执行）
  useEffect(() => {
    const ultimateTimeout = setTimeout(() => {
      console.error("🆘 Ultimate timeout triggered - forcing app to load");
      setIsDataLoaded(true);
    }, 5000);
    return () => clearTimeout(ultimateTimeout);
  }, []);

  // 1. 核心数据初始化 (仅在应用启动时运行一次)
  useEffect(() => {
    const API_BASE = `${window.location.protocol}//${window.location.hostname}:3001`;
    const syncFromDisk = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const response = await fetch(`${API_BASE}/api/load`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          const diskData = await response.json();
          if (diskData && diskData.stats) {
            // 关键：磁盘存档可能比浏览器存档旧。这里选“更新”的那份作为唯一真相，保证主界面/游戏内信箱一致。
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

            // 日记特殊处理：无论选哪份存档，都合并“磁盘(物理txt同步)”与 localStorage，避免恢复时日记被覆盖丢失
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

            console.log(useLocal ? "Using newer LocalStorage save." : "Using disk save.");
            showToast(useLocal ? "已载入更新的浏览器存档 (Prefer Local)" : "本地物理存档已同步 (Data Synced from Disk)");

            setStats(prev => ({
              ...prev,
              ...chosen.stats,
              npcs: ((chosen.stats?.npcs) || prev.npcs).map((npc: any) => {
                if (npc.id === 'senior_li' || npc.name === '李学长') {
                  return { ...npc, id: 'senior_l', name: 'L学长' };
                }
                return npc;
              })
            }));
            
            if (chosen.currentScenario) {
              // 重要：存档里可能带着旧文案，这里用本地数据库的最新关卡覆盖（若能找到）
              const refreshedScenario =
                (chosen.currentScenario?.id && getScenarioById(chosen.currentScenario.id)) ||
                chosen.currentScenario;
              setCurrentScenario(refreshedScenario);
              setBgImage(chosen.bgImage || '');
            }
            if (chosen.globalAchievements) {
              setGlobalAchievements(chosen.globalAchievements);
            }
            if (chosen.settings) {
              setSettings(chosen.settings);
            }
            setHasSave(!!chosen.currentScenario);
            return true;
          }
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.warn("Local File Server not reachable, using browser storage only.");
      }
      return false;
    };

    const loadInitialData = async () => {
      // 🚨 紧急保护：3秒强制加载完成，避免永久黑屏
      const emergencyTimeout = setTimeout(() => {
        console.warn("⚠️ Emergency timeout: Force loading complete");
        setIsDataLoaded(true);
      }, 3000);

      try {
        const synced = await syncFromDisk();
        if (!synced) {
          const saved = localStorage.getItem(SAVE_KEY);
          if (saved) {
            try {
              const { stats: savedStats, currentScenario: savedScenario, bgImage: savedBg } = JSON.parse(saved);
              if (savedStats) {
                setStats(prev => ({
                  ...prev,
                  ...savedStats,
                  npcs: (savedStats.npcs || prev.npcs).map((npc: any) => {
                    if (npc.id === 'senior_li' || npc.name === '李学长') {
                      return { ...npc, id: 'senior_l', name: 'L学长' };
                    }
                    return npc;
                  }),
                  diary: savedStats.diary || [],
                  mailbox: savedStats.mailbox || [],
                  memoryAlbum: savedStats.memoryAlbum || [],
                  achievements: savedStats.achievements || []
                }));
                if (savedScenario) {
                  // 重要：用本地数据库的最新关卡覆盖旧存档文本（若能找到）
                  const refreshedScenario =
                    (savedScenario?.id && getScenarioById(savedScenario.id)) || savedScenario;
                  setCurrentScenario(refreshedScenario);
                  setBgImage(savedBg || '');
                  setHasSave(true);
                } else {
                  setHasSave(false);
                }
              } else {
                setHasSave(false);
              }
            } catch (parseErr) {
              console.warn("LocalStorage data corrupted, clearing...", parseErr);
              localStorage.removeItem(SAVE_KEY);
              setHasSave(false);
            }
          } else {
            setHasSave(false);
          }
        }
      } catch (err) {
        console.error("Initialization Error:", err);
        setHasSave(false);
      } finally {
        clearTimeout(emergencyTimeout);
        setIsDataLoaded(true);
      }

      // 载入全局成就
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
    };

    loadInitialData();
  }, []); // 空依赖数组，只在 mount 时执行

  // 2. 页面背景和导航安全检查
  useEffect(() => {
    // 首页背景：使用本地 intro.png（并且把旧默认图的缓存替换掉）
    const OLD_DEFAULT_MENU_BG = 'https://images.unsplash.com/photo-1546726747-0411da142385?w=1920&q=80';
    const isOldLocalPath = menuBg && (menuBg.includes('/image/') || menuBg.includes('undefined'));
    
    const shouldReplace =
      !menuBg ||
      menuBg === OLD_DEFAULT_MENU_BG ||
      menuBg.includes('images.unsplash.com/photo-1546726747-0411da142385') ||
      isOldLocalPath;

    if (shouldReplace) {
      setMenuBg(introBg);
      localStorage.setItem(MENU_BG_CACHE_KEY, introBg);
    }

    if (location.pathname === '/loading') {
      setLoadingTip(LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]);
    }

    // 安全检查：如果直接访问 /play 但没有场景数据，退回主菜单
    // 增加一个小延时或检查 location.state，防止在载入过程中被踢回
    if (location.pathname === '/play' && !currentScenario && isDataLoaded && location.state?.loading !== true) {
      navigate('/');
    }
  }, [location.pathname, menuBg, currentScenario, navigate, isDataLoaded]);

  // 返回主菜单时播放音效
  const prevPathRef = React.useRef<string | null>(null);
  const zugausAudioRef = React.useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // 只有从其他页面进入主菜单时才播放（不是初始加载）
    if (location.pathname === '/' && prevPathRef.current && prevPathRef.current !== '/') {
      const sfxVolume = settings.sfxVolume ?? settings.volume ?? 80;
      const audio = new Audio(zugausSfx);
      audio.volume = (sfxVolume / 100) * 0.5;
      audio.play().catch(() => {});
      zugausAudioRef.current = audio;
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, settings.sfxVolume, settings.volume]);

  // 信箱逻辑
  const markLetterAsRead = (id: string) => {
    setStats(prev => ({
      ...prev,
      mailbox: prev.mailbox.map(l => l.id === id ? { ...l, isRead: true } : l)
    }));
  };

  const deleteLetter = (id: string) => {
    setStats(prev => ({
      ...prev,
      mailbox: prev.mailbox.filter(l => l.id !== id)
    }));
    showToast("信件已删除 (Letter Deleted)");
  };

  const handleLetterAction = (letter: Letter) => {
    if (!letter.action) return;
    const { impact, result } = letter.action;
    setStats(prev => ({
      ...prev,
      money: Number((prev.money + (impact.money || 0)).toFixed(2)),
      sanity: Math.max(0, Math.min(100, prev.sanity + (impact.sanity || 0))),
      // 动作执行后移除该动作，标记为已处理
      mailbox: prev.mailbox.map(l => l.id === letter.id ? { ...l, action: undefined } : l)
    }));
    showToast(result);
  };

  const triggerRandomLetter = (currentStats: GameStats) => {
    // 20% 概率触发新信件
    if (Math.random() > 0.8) {
      const template = LETTER_TEMPLATES[Math.floor(Math.random() * LETTER_TEMPLATES.length)];
      // 检查是否已经有同名的未读信件，避免重复
      if (currentStats.mailbox.some(l => l.title === template.title && !l.isRead)) return null;

      const newLetter = {
        ...template,
        id: `letter_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
        isRead: false
      };
      return newLetter;
    }
    return null;
  };

  // 记忆相册逻辑
  const addToMemoryAlbum = (url: string, title: string, currentStats: GameStats) => {
    // 只允许入库“已成功加载过的背景图”
    try {
      const raw = localStorage.getItem(IMAGE_STATE_KEY);
      const okList = raw ? (JSON.parse(raw)?.ok as string[] | undefined) : undefined;
      if (okList && Array.isArray(okList) && !okList.includes(url)) {
        console.warn("Skip album capture: image not confirmed loaded yet.", url);
        return;
      }
    } catch {
      // ignore parse errors, allow save
    }
    // 确保每个关卡只保存一张图片：先删除该关卡之前的旧图片，再保存新图片
    setStats(prev => {
      // 检查是否已经存在相同场景和相同图片的记录
      const existingSameImage = prev.memoryAlbum?.find(
        img => img.chapter === currentStats.chapter && 
               img.level === currentStats.level && 
               img.url === url
      );
      if (existingSameImage) {
        // 如果已存在完全相同的图片，不重复保存
        return prev;
      }
      
      // 删除该关卡之前的其他图片（确保每个关卡只有一张图片）
      const filteredAlbum = (prev.memoryAlbum || []).filter(
        img => !(img.chapter === currentStats.chapter && img.level === currentStats.level)
      );
      
      const newImage = {
        id: `img_${Date.now()}`,
        url,
        title,
        chapter: currentStats.chapter,
        level: currentStats.level,
        timestamp: Date.now()
      };
      return {
        ...prev,
        memoryAlbum: [newImage, ...filteredAlbum]
      };
    });
  };

  const deleteMemoryImage = (id: string) => {
    setStats(prev => ({
      ...prev,
      memoryAlbum: (prev.memoryAlbum || []).filter(img => img.id !== id)
    }));
    showToast("照片已删除 (Photo Deleted)");
  };

  // 只从“已成功加载过的背景”入相册：由 PlayPage 的 <img onLoad> 触发
  const pendingAlbumRef = React.useRef<{
    url: string;
    title: string;
    statsSnapshot: GameStats;
  } | null>(null);

  const queueAlbumCapture = (url: string, title: string, statsSnapshot: GameStats) => {
    pendingAlbumRef.current = { url, title, statsSnapshot };
  };

  const handleBackgroundLoaded = (url: string) => {
    const pending = pendingAlbumRef.current;
    
    // 只保存通过 queueAlbumCapture 明确标记的图片，避免保存无关图片
    if (pending) {
      // 如果实际显示的图片和待保存的图片不同，使用实际显示的图片
      // 这样可以确保相册中的图片和游戏实际显示的背景一致
      const imageToSave = url;
      const titleToSave = pending.title;
      const statsToSave = pending.statsSnapshot;
      addToMemoryAlbum(imageToSave, titleToSave, statsToSave);
      pendingAlbumRef.current = null;
    }
    // 移除了 else if 分支，避免在没有明确标记时保存图片
  };

  // 日记逻辑
  const handleSaveDiary = (content: string, mood: DiaryEntry['mood']) => {
    const newEntry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      content,
      mood,
      chapter: stats.chapter,
      level: stats.level,
      timestamp: Date.now(),
      location: currentScenario?.title // 使用当前场景标题作为地点
    };
    setStats(prev => ({
      ...prev,
      diary: [newEntry, ...(prev.diary || [])]
    }));
    showToast("日记已保存 (Diary Entry Saved)");
  };

  const handleDeleteDiary = (id: string) => {
    setStats(prev => ({
      ...prev,
      diary: (prev.diary || []).filter(entry => entry.id !== id)
    }));
    showToast("日记已删除 (Entry Deleted)");
  };

  const saveGame = useCallback(() => {
    try {
      const saveData = { stats, currentScenario, bgImage, timestamp: Date.now() };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      setHasSave(true);
      showToast("进度已成功保存！(Progress Saved)");
    } catch (e) {
      showToast("保存失败：存储空间已满。");
    }
  }, [stats, currentScenario, bgImage, showToast]);

  const loadGame = useCallback(() => {
    startMusic();

    // 优先：如果初始化同步已经把数据载入 State 了，直接跳转即可
    if (currentScenario) {
      navigate('/play', { state: { loading: true } });
      showToast("继续模拟进度");
      return;
    }

    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) {
      showToast("未发现存档");
      return;
    }
    try {
      const { stats: savedStats, currentScenario: savedScenario, bgImage: savedBg } = JSON.parse(saved);
      // 兼容性处理：确保旧存档也有新字段，并更新NPC名称
      const processedNpcs = (savedStats.npcs || INITIAL_STATS.npcs).map((npc: any) => {
        if (npc.id === 'senior_li' || npc.name === '李学长') {
          return { ...npc, id: 'senior_l', name: 'L学长' };
        }
        return npc;
      });

      setStats({
        ...INITIAL_STATS,
        ...savedStats,
        levelHistory: savedStats.levelHistory || [`${savedStats.chapter}-${savedStats.level}`],
        historyLogs: savedStats.historyLogs || [],
        npcs: processedNpcs,
        mailbox: savedStats.mailbox || [],
        memoryAlbum: savedStats.memoryAlbum || [],
        diary: savedStats.diary || []
      });
      // 重要：用本地数据库的最新关卡覆盖旧存档文本（若能找到）
      const refreshedScenario =
        (savedScenario?.id && getScenarioById(savedScenario.id)) || savedScenario;
      setCurrentScenario(refreshedScenario);
      setBgImage(savedBg);
      showToast("存档已载入");
      navigate('/play', { state: { loading: true } });
      setShowMap(false);
    } catch (e) {
      showToast("存档文件损坏");
    }
  }, [navigate, currentScenario, startMusic, showToast]);

  // 身份选择逻辑
  const handleIdentitySelect = (identity: Identity) => {
    setShowIdentitySelector(false);
    // 暂停背景音乐
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // 停止 zugaus 音效
    if (zugausAudioRef.current) {
      zugausAudioRef.current.pause();
      zugausAudioRef.current = null;
    }
    // 先播放开场视频，视频结束后再开始游戏
    setPendingIdentity(identity);
    setShowIntroVideo(true);
  };

  const startGameWithIdentity = async (identity: Identity) => {
    startMusic();
    setLoadingMsg(`正在为 ${identity.name} 办理居留许可...`);
    
    // 初始化时加入第一封信：欢迎信（每封信都有唯一ID）
    const welcomeLetter = {
      id: `welcome_letter_${Date.now()}`,
      title: '欢迎来到德国！',
      sender: '德国驻华大使馆',
      content: '恭喜你获得了留学签证！你的留德生活正式开启。\n\n记住，在德国，信箱 (Briefkasten) 是非常重要的。你会收到来自政府、银行、保险公司甚至邻居的各种信件。请务必养成每天检查信箱的习惯，并确保你的名字贴在信箱上，否则你可能会错过重要的账单或通知。',
      type: 'info' as const,
      timestamp: Date.now(),
      isRead: false
    };

    const finalStats: GameStats = {
      ...INITIAL_STATS,
      ...identity.initialStats,
      identity: identity.id,
      // 跨局保留：相册、邮件、日记
      mailbox: [welcomeLetter, ...(stats.mailbox || [])],
      memoryAlbum: stats.memoryAlbum || [],
      diary: stats.diary || [],
      achievements: stats.achievements || []
    };
    // 新开局：清掉旧进度存档 + 图片状态缓存，避免“旧局残留”
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    try { localStorage.removeItem(IMAGE_STATE_KEY); } catch {}
    setStats(finalStats);
    navigate('/loading');
    // 使用本地第一关，但用AI生成背景图
    const firstScenario = getScenarioByChapterLevel(1, 1);
    if (firstScenario) {
      setCurrentScenario(firstScenario);
      // AI生成图片（异步）
      generateScenarioImage(firstScenario.imagePrompt).then(generatedImage => {
        setBgImage(generatedImage);
        // 相册入库由 PlayPage 的 <img onLoad> 确认后执行，避免“没加载成功也入库”
        queueAlbumCapture(generatedImage, firstScenario.title, finalStats);
      }).catch(err => {
        console.error("图片生成失败:", err);
        // 使用本地随机兜底（不使用网图）
        const fallback = pickRandomLocalSceneBg();
        setBgImage(fallback);
        queueAlbumCapture(fallback, firstScenario.title, finalStats);
      });
      
      setTimeout(() => {
        navigate('/play', { state: { loading: true } });
      }, 8000); // 给AI更多时间生成图片
    } else {
      console.error("First scenario not found!");
      navigate('/');
    }
  };

  const startGame = () => {
    // 清除存档，确保"继续模拟"按钮不显示
    localStorage.removeItem(SAVE_KEY);
    setHasSave(false);
    setShowIdentitySelector(true);
  };

  const handleSocialInteract = (npcId: string, type: 'party' | 'study') => {
    const npc = stats.npcs.find(n => n.id === npcId);
    if (!npc || npc.isLocked) return;

    let moneyChange = 0;
    let sanityChange = 0;
    let ectsChange = 0;
    let favorChange = 0;
    let successMsg = "";

    const favorBonus = 1 + npc.favorability / 100;

    // 根据不同 NPC 定制交互逻辑
    if (npcId === 'hausmeister_klaus') {
      // 宿管大叔：用精神换钱
      if (stats.sanity < 30) {
        showToast("你已经累得连扳手都拿不动了，大叔摇了摇头让你先去休息...");
        return;
      }
      sanityChange = -30;
      moneyChange = Math.floor(150 * favorBonus);
      successMsg = `你帮 Klaus 大叔修好了整栋楼的暖气，他塞给你 ${moneyChange} 欧劳务费。`;
    } else if (npcId === 'flatmate_clara') {
      // 室友 Clara：常规社交
      if (type === 'party') {
        if (stats.money < 40) {
          showToast("钱包空空如也，连一瓶最便宜的 Oettinger 都买不起...");
          return;
        }
        moneyChange = -40;
        sanityChange = Math.floor(20 * favorBonus);
        favorChange = 10;
        successMsg = "Party 上的音乐震耳欲聋，酒精让你暂时忘记了下周的考试。";
      } else {
        if (stats.sanity < 15) {
          showToast("你的精神已经恍惚，连德语和意大利语都分不清了...");
          return;
        }
        sanityChange = -15;
        favorChange = 5;
        successMsg = "通过语言交换，你学会了用德语和意大利语同时吐槽教授。";
      }
    } else if (npcId === 'prof_schmidt') {
      // Schmidt 教授：用精神换学分
      if (type === 'study') {
        if (stats.sanity < 40) {
          showToast("你盯着复杂的公式，感觉它们在屏幕上跳舞，教授让你回家睡觉...");
          return;
        }
        sanityChange = -40;
        ectsChange = Math.floor(2 * favorBonus);
        favorChange = 2;
        successMsg = `你在实验室熬了一整晚，教授对你的研究成果非常满意，给了你 ${ectsChange} 学分。`;
      } else {
        if (stats.money < 100) {
          showToast("摸了摸口袋，发现连请教授喝杯咖啡的钱都不够...");
          return;
        }
        moneyChange = -100;
        favorChange = 15;
        successMsg = "教授对你请的中餐赞不绝口，甚至开始向你打听正宗宫保鸡丁的做法。";
      }
    } else if (npcId === 'senior_l') {
      // L 学长：低成本换学分/精神
      if (type === 'study') {
        if (stats.sanity < 20) {
          showToast("你已经困得睁不开眼，学长拍了拍你的肩膀让你先睡会儿...");
          return;
        }
        sanityChange = -20;
        ectsChange = Math.floor(5 * favorBonus);
        favorChange = 5;
        successMsg = `学长把珍藏多年的“期末必过宝典”传授给了你，学分 +${ectsChange}！`;
      } else {
        if (stats.money < 20) {
          showToast("连买两杯啤酒的钱都没有，学长叹了口气...");
          return;
        }
        moneyChange = -20;
        sanityChange = Math.floor(10 * favorBonus);
        favorChange = 8;
        successMsg = "在啤酒花园，学长告诉你：'其实大家都是这么挂过来的'，你瞬间释怀了。";
      }
    } else if (npcId === 'auslaenderbehoerde_frau_muller') {
      // 签证官：纯刷好感
      if (stats.sanity < 50) {
        showToast("你面对签证官时紧张得说不出话，她皱着眉头让你下次再来...");
        return;
      }
      sanityChange = -50;
      favorChange = Math.floor(10 * favorBonus);
      successMsg = "你准备了极其完美的材料，Müller 女士的脸色竟然缓和了一点点。";
    }

    const newNpcs = stats.npcs.map(n => {
      if (n.id === npcId) {
        return { ...n, favorability: Math.min(100, n.favorability + favorChange) };
      }
      return n;
    });

    setStats(prev => ({
      ...prev,
      money: Number((prev.money + moneyChange).toFixed(2)),
      sanity: Math.max(0, Math.min(100, prev.sanity + sanityChange)),
      ects: prev.ects + ectsChange,
      npcs: newNpcs
    }));

    showToast(successMsg);
  };

  const handleCrisisDecision = (impact: any, result: string) => {
    setActiveCrisis(null);
    showToast(result);

    setStats(prev => {
      const updatedStats = {
        ...prev,
        money: Number((prev.money + (impact.money || 0)).toFixed(2)),
        sanity: Math.max(0, Math.min(100, prev.sanity + (impact.sanity || 0))),
        ects: prev.ects + (impact.ects || 0)
      };

      // 突发事件解决后，必须手动触发进入下一关的渲染流程
      // 因为 handleOptionSelect 之前已经在 shouldTriggerCrisis 分支中提前返回了
      setTimeout(() => {
        const nextChapter = updatedStats.chapter;
        const nextLevel = updatedStats.level;
        
        setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
        navigate('/loading');
        
        const nextScenario = getScenarioByChapterLevel(nextChapter, nextLevel);
        if (nextScenario) {
          setCurrentScenario(nextScenario);
          generateScenarioImage(nextScenario.imagePrompt).then(generatedImage => {
            setBgImage(generatedImage);
            queueAlbumCapture(generatedImage, nextScenario.title, updatedStats);
          }).catch(err => {
            console.error("图片生成失败:", err);
            const fallback = bgImage || pickRandomLocalSceneBg();
            setBgImage(fallback);
            queueAlbumCapture(fallback, nextScenario.title, updatedStats);
          });
          
          setTimeout(() => {
            navigate('/play', { replace: true, state: { loading: true } });
          }, 8000);
        } else {
          // 如果没有下一关，判定为胜利
          navigate('/victory');
        }
      }, 500);

      return updatedStats;
    });
  };

  const resetToMenu = useCallback(() => setShowConfirmMenu(true), []);
  const confirmReset = () => {
    // 回到主菜单（不清空进度）：继续模拟按钮取决于现有存档/进度
    // “重新开始/清空进度”在“开始新模拟(选身份)”以及“彻底重置”里处理
    setShowMap(false);
    setResultOverlay(null);
    setShowConfirmMenu(false);
    navigate('/');
  };

  const resetAllData = async () => {
    // 1. 清空本地磁盘
    const API_BASE = `${window.location.protocol}//${window.location.hostname}:3001`;
    let diskResetOk = false;
    try {
      const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
      diskResetOk = !!res.ok;
      if (!res.ok) {
        throw new Error(`reset failed: ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to reset disk data:", e);
    }

    // 2. 清空浏览器缓存
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(GLOBAL_PROGRESS_KEY);
    localStorage.removeItem(MENU_BG_CACHE_KEY);
    localStorage.removeItem(IMAGE_STATE_KEY);

    // 3. 重置所有状态
    setStats(INITIAL_STATS);
    setGlobalAchievements([]);
    setSettings(DEFAULT_SETTINGS);
    setCurrentScenario(null);
    setBgImage('');
    setHasSave(false);
    showToast(diskResetOk ? "所有数据已永久抹除。" : "已清空浏览器数据，但未能连接本地存档服务器清空硬盘日记/存档。请确认使用 npm run all 后再重试。");
    navigate('/');
    // 只有磁盘也清空成功才重载；否则重载会把硬盘旧日记又同步回来
    if (diskResetOk) {
      window.location.reload();
    }
  };

  // 跳转到之前关卡的逻辑
  const jumpToLevel = async (targetChapter: number, targetLevel: number) => {
    const key = `${targetChapter}-${targetLevel}`;
    const history = stats.levelHistory || [];
    const historyIdx = history.indexOf(key);
    if (historyIdx === -1 || (targetChapter === stats.chapter && targetLevel === stats.level)) return;

    // 截断历史记录到目标关卡
    const newHistory = history.slice(0, historyIdx + 1);
    const newStats: GameStats = {
      ...stats,
      chapter: targetChapter,
      level: targetLevel,
      levelHistory: newHistory,
      historyLogs: (stats.historyLogs || []).slice(0, historyIdx + 1)
    };
    
    setStats(newStats);
    setShowMap(false);
    
    // 从本地数据库加载对应关卡，用AI生成背景
    setLoadingMsg("正在穿越回之前的抉择点...");
    navigate('/loading');
    const targetScenario = getScenarioByChapterLevel(newStats.chapter, newStats.level);
    if (targetScenario) {
      setCurrentScenario(targetScenario);
      // AI生成图片
      generateScenarioImage(targetScenario.imagePrompt).then(generatedImage => {
        setBgImage(generatedImage);
      }).catch(err => {
        console.error("图片生成失败:", err);
        setBgImage(pickRandomLocalSceneBg());
      });
      
      setTimeout(() => {
        navigate('/play', { state: { loading: true } });
      }, 8000); // 给AI时间生成图片
    } else {
      console.error(`Scenario ${newStats.chapter}-${newStats.level} not found!`);
      navigate('/');
    }
  };

  const handleOptionSelect = async (option: GameOption, optionIdx: number) => {
    setResultOverlay(option.resultDescription);
    
    // 生成历史记录条目 (History Tracking)
    const historyEntry: HistoryEntry = {
      chapter: stats.chapter,
      level: stats.level,
      title: currentScenario?.title || "",
      description: currentScenario?.description || "",
      choiceMade: option.text,
      resultDescription: option.resultDescription,
      timestamp: Date.now()
    };

    // 关卡进度逻辑 (DAG 拓扑推进)
    const currentStageIdx = DAG_STAGES.findIndex(s => s.includes(stats.level));
    
    // 检查是否触发突发大事件 (每 7 关左右)
    const shouldTriggerCrisis = (stats.levelHistory.length + 1) % 7 === 0;

    let nextLevel = stats.level;
    let nextChapter = stats.chapter;
    let nextSemester = stats.semester;

    // 统计逻辑：检查选项是否包含延误或打工关键词
    let delayInc = 0;
    let workInc = 0;
    if (option.text.includes("延误") || option.resultDescription.includes("延误") || option.text.includes("ICE停运")) {
      delayInc = 1;
    }
    if (option.text.includes("打工") || option.text.includes("兼职") || option.text.includes("赚钱")) {
      workInc = 1;
    }

    if (currentStageIdx !== -1) {
      if (currentStageIdx < DAG_STAGES.length - 1) {
        const nextStage = DAG_STAGES[currentStageIdx + 1];
        nextLevel = nextStage[optionIdx % nextStage.length];
      } else {
        nextLevel = DAG_STAGES[0][0]; 
        nextChapter += 1;
        nextSemester += 1;
      }
    }

    // 计算属性变化（考虑成就加成）
    let sanityChange = option.statChanges.sanity || 0;
    if (delayInc > 0 && sanityChange < 0 && (stats.achievements || []).includes('db_victim')) {
      sanityChange = Math.floor(sanityChange / 2); // 德铁受害者：延误造成的精神损失减半
    }

    // NPC 解锁与更名逻辑
    const updatedNpcs = (stats.npcs || INITIAL_STATS.npcs).map(npc => {
      let updatedNpc = { ...npc };
      // 强制更名迁移
      if (updatedNpc.id === 'senior_li' || updatedNpc.name === '李学长') {
        updatedNpc.id = 'senior_l';
        updatedNpc.name = 'L学长';
      }
      // 中途解锁逻辑
      if (updatedNpc.id === 'hausmeister_klaus' && nextChapter === 1 && nextLevel >= 5) {
        updatedNpc.isLocked = false;
      }
      if (updatedNpc.id === 'auslaenderbehoerde_frau_muller' && nextChapter === 1 && nextLevel >= 10) {
        updatedNpc.isLocked = false;
      }
      return updatedNpc;
    });

    // 尝试触发新信件
    const newLetter = triggerRandomLetter(stats);
    const updatedMailbox = newLetter ? [newLetter, ...(stats.mailbox || [])] : (stats.mailbox || []);
    if (newLetter) {
      showToast("你收到了一封新信件！📬");
    }

    const newStats: GameStats = {
      ...stats,
      ects: stats.ects + (option.statChanges.ects || 0),
      money: Number((stats.money + (option.statChanges.money || 0)).toFixed(2)),
      sanity: Math.max(0, Math.min(100, stats.sanity + sanityChange)),
      semester: nextSemester,
      chapter: nextChapter,
      level: nextLevel,
      levelHistory: [...(stats.levelHistory || []), `${nextChapter}-${nextLevel}`],
      historyLogs: [...(stats.historyLogs || []), historyEntry],
      delayCount: (stats.delayCount || 0) + delayInc,
      workCount: (stats.workCount || 0) + workInc,
      npcs: updatedNpcs,
      mailbox: updatedMailbox
    };
    setStats(newStats);

    if (newStats.sanity <= 0 || newStats.money <= 0) {
      setTimeout(() => {
        setResultOverlay(null);
        navigate('/gameover');
      }, RESULT_OVERLAY_DURATION_MS);
      return;
    }
    if (newStats.ects >= 180 || newStats.chapter > 4) {
      setTimeout(() => {
        setResultOverlay(null);
        navigate('/victory');
      }, RESULT_OVERLAY_DURATION_MS);
      return;
    }

    setTimeout(async () => {
      setResultOverlay(null);

      if (shouldTriggerCrisis) {
        const randomCrisis = CRISIS_EVENTS[Math.floor(Math.random() * CRISIS_EVENTS.length)];
        setActiveCrisis(randomCrisis);
        return;
      }

      setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      
      // 随机加载小事件 (RNG Check)
      const { event: microEv, impact } = rollMicroEvent(newStats);
      if (microEv) {
        setMicroEvent(microEv);
      }
      if (Object.keys(impact).length > 0) {
        newStats.money = Number((newStats.money + (impact.money || 0)).toFixed(2));
        newStats.sanity = Math.max(0, Math.min(100, newStats.sanity + (impact.sanity || 0)));
        setStats({ ...newStats });
      }

      navigate('/loading');
      // 从本地数据库加载下一关，用AI生成背景
      const nextScenario = getScenarioByChapterLevel(nextChapter, nextLevel);
      
      if (nextScenario) {
        setCurrentScenario(nextScenario);
        // AI生成图片
        generateScenarioImage(nextScenario.imagePrompt).then(generatedImage => {
          setBgImage(generatedImage);
          queueAlbumCapture(generatedImage, nextScenario.title, newStats);
        }).catch(err => {
          console.error("图片生成失败:", err);
          // 使用上一关图片优先，否则本地随机兜底（不使用网图）
          const fallback = bgImage || pickRandomLocalSceneBg();
          setBgImage(fallback);
          queueAlbumCapture(fallback, nextScenario.title, newStats);
        });
        
        setTimeout(() => {
          navigate('/play', { replace: true, state: { loading: true } });
        }, 8000); // 给AI时间生成图片
      } else {
        console.error(`Scenario ${nextChapter}-${nextLevel} not found! Reached end of game.`);
        // 如果没有更多关卡，判定为胜利
        setTimeout(() => {
          setResultOverlay(null);
          navigate('/victory');
        }, RESULT_OVERLAY_DURATION_MS);
      }
    }, RESULT_OVERLAY_DURATION_MS);
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-serif italic p-8 text-center">
        <div className="flex flex-col items-center gap-6 max-w-sm">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="space-y-2">
            <p className="tracking-widest text-lg opacity-80">正在同步留德记忆...</p>
            <p className="text-xs opacity-40 leading-relaxed uppercase tracking-tighter">Syncing data from local storage & disk</p>
            </div>
            <button 
            onClick={() => setIsDataLoaded(true)}
            className="mt-4 px-6 py-2 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            跳过同步 (Skip Sync)
          </button>
        </div>
      </div>
    );
  }

  // 开场视频（选择身份后、正式开始游戏前播放）
  if (showIntroVideo && pendingIdentity) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
        <video
          autoPlay
          playsInline
          className="w-full h-full object-contain"
          onEnded={() => {
            setShowIntroVideo(false);
            setShowStoryIntro(true);
          }}
          onError={() => {
            // 视频加载失败时跳过，显示背景介绍
            setShowIntroVideo(false);
            setShowStoryIntro(true);
          }}
        >
          <source src={introVideo} type="video/mp4" />
        </video>
        {/* 跳过按钮 */}
        <button
          onClick={() => {
            setShowIntroVideo(false);
            setShowStoryIntro(true);
          }}
          className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm uppercase tracking-widest rounded-lg backdrop-blur-sm transition-all"
        >
          跳过 (Skip)
        </button>
      </div>
    );
  }

  // 游戏背景介绍（视频结束后显示）
  if (showStoryIntro && pendingIdentity) {
    const identityName = pendingIdentity.name;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 animate-fadeIn overflow-hidden">
        {/* 背景图片 */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${storyIntroBg})` }}
        />
        {/* 暗色遮罩 */}
        <div className="absolute inset-0 bg-black/60" />
        {/* 渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        
        <div className="relative max-w-2xl w-full space-y-8 text-center">
          {/* 标题 */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">Your Story Begins</p>
            <h1 className="text-4xl md:text-5xl font-black text-white serif-font italic">
              Willkommen zu Deutschland
            </h1>
          </div>

          {/* 背景故事 */}
          <div className="space-y-6 text-left bg-black/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-white/80 leading-relaxed text-lg">
              你是一名刚刚抵达德国的<span className="text-green-400 font-bold">{identityName}</span>，
              带着对未来的憧憬和一箱子泡面，踏上了这片土地。
            </p>
            <p className="text-white/70 leading-relaxed">
              在这里，你将面对：<br/>
              <span className="text-yellow-400">🏛️ 令人抓狂的官僚体系</span> — Anmeldung、签证、保险，一个都不能少<br/>
              <span className="text-blue-400">📚 硬核的学业压力</span> — 挂科？延毕？每一个选择都关乎命运<br/>
              <span className="text-red-400">💶 紧巴巴的经济状况</span> — 房租、Semesterbeitrag、还有那该死的 Rundfunkbeitrag<br/>
              <span className="text-purple-400">🧠 摇摇欲坠的精神状态</span> — 孤独、焦虑、文化冲击
            </p>
            <p className="text-white/60 leading-relaxed italic">
              你的目标：在这里活下去，拿到学位，保住理智。<br/>
              记住，每一个决定都可能改变你的命运。
            </p>
          </div>

          {/* 身份信息 */}
          <div className="bg-black/40 border border-white/20 rounded-xl px-8 py-4 inline-block backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">你的身份</p>
            <p className="text-xl font-bold text-white">{pendingIdentity.name}</p>
            <p className="text-sm text-white/60">{pendingIdentity.description}</p>
          </div>

          {/* 开始按钮 */}
          <button
            onClick={() => {
              setShowStoryIntro(false);
              startGameWithIdentity(pendingIdentity);
              setPendingIdentity(null);
            }}
            className="px-12 py-4 bg-white text-black font-black uppercase text-sm tracking-[0.3em] rounded-xl hover:bg-green-500 hover:text-white transition-all transform hover:scale-105 shadow-2xl"
          >
            开始模拟生存 (Begin)
          </button>

          <p className="text-[10px] text-white/30 uppercase tracking-widest">
            Viel Erfolg, du wirst es brauchen.
          </p>
        </div>
      </div>
    );
  }

    return (
    <div className="relative">
      <audio 
        ref={audioRef} 
        src={localBgm} 
        loop 
        preload="auto"
        onCanPlay={() => {
          startMusic();
        }}
      />
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={
          <MainMenu 
            onStart={startGame} 
            onLoad={loadGame} 
            onMapClick={() => setShowMap(true)}
            onSocialClick={() => setShowSocialMap(true)}
            onSettingsClick={() => setShowSettings(true)}
            onMailboxClick={() => setShowMailbox(true)}
            onMemoryAlbumClick={() => setShowMemoryAlbum(true)}
            onDiaryClick={() => setShowDiary(true)}
            hasSave={hasSave} 
            menuBg={menuBg} 
            unlockedAchievements={stats.achievements || []}
            unreadLetters={stats.mailbox?.filter(l => !l.isRead).length || 0}
          />
        } />
        
        <Route path="/loading" element={
          <GameLoader 
            loadingMsg={loadingMsg} 
            loadingTip={loadingTip} 
            bgImage={bgImage} 
            menuBg={menuBg}
            microEvent={microEvent}
          />
        } />
        
        <Route path="/play" element={
          <PlayPage 
        stats={stats} 
            currentScenario={currentScenario}
            resultOverlay={resultOverlay}
            bgImage={bgImage}
            onBackgroundLoaded={handleBackgroundLoaded}
            onOptionSelect={(opt) => {
              const idx = currentScenario?.options.indexOf(opt) ?? 0;
              handleOptionSelect(opt, idx);
            }}
        onHomeClick={resetToMenu} 
        onMapClick={() => setShowMap(true)} 
        onSaveClick={saveGame}
            onMailboxClick={() => setShowMailbox(true)}
            onMemoryAlbumClick={() => setShowMemoryAlbum(true)}
            onDiaryClick={() => setShowDiary(true)}
          />
        } />
        
        <Route path="/gameover" element={
          <ResultPage 
            status={GameStatus.GAMEOVER} 
            onRestart={() => {
              // 保留记忆相册、邮件、日记（跨局保留）
              const preservedAlbum = stats.memoryAlbum || [];
              const preservedMailbox = stats.mailbox || [];
              const preservedDiary = stats.diary || [];
              
              // 清除存档
              localStorage.removeItem(SAVE_KEY);
              setHasSave(false);
              
              // 重置状态但保留跨局数据
              setStats({
                ...INITIAL_STATS,
                memoryAlbum: preservedAlbum,
                mailbox: preservedMailbox,
                diary: preservedDiary
              });
              setCurrentScenario(null);
              setBgImage('');
              setResultOverlay(null);
              
              // 直接打开身份选择器，开始新游戏
              navigate('/');
              setTimeout(() => setShowIdentitySelector(true), 100);
            }} 
            onBackToMenu={() => {
              // 清除存档，回到主界面
              localStorage.removeItem(SAVE_KEY);
              setHasSave(false);
              setResultOverlay(null);
              navigate('/');
            }} 
            menuBg={menuBg}
          />
        } />
        
        <Route path="/victory" element={
          <ResultPage 
            status={GameStatus.VICTORY} 
            onRestart={() => {
              // 保留记忆相册、邮件、日记（跨局保留）
              const preservedAlbum = stats.memoryAlbum || [];
              const preservedMailbox = stats.mailbox || [];
              const preservedDiary = stats.diary || [];
              
              // 清除存档
              localStorage.removeItem(SAVE_KEY);
              setHasSave(false);
              
              // 重置状态但保留跨局数据
              setStats({
                ...INITIAL_STATS,
                memoryAlbum: preservedAlbum,
                mailbox: preservedMailbox,
                diary: preservedDiary
              });
              setCurrentScenario(null);
              setBgImage('');
              setResultOverlay(null);
              
              // 直接打开身份选择器，开始新游戏
              navigate('/');
              setTimeout(() => setShowIdentitySelector(true), 100);
            }} 
            onBackToMenu={() => {
              // 清除存档，回到主界面
              localStorage.removeItem(SAVE_KEY);
              setHasSave(false);
              setResultOverlay(null);
              navigate('/');
            }} 
            menuBg={menuBg}
          />
        } />
        <Route path="*" element={
          <MainMenu 
            onStart={startGame} 
            onLoad={loadGame} 
            onMapClick={() => setShowMap(true)}
            onSocialClick={() => setShowSocialMap(true)}
            onSettingsClick={() => setShowSettings(true)}
            onMailboxClick={() => setShowMailbox(true)}
            onMemoryAlbumClick={() => setShowMemoryAlbum(true)}
            onDiaryClick={() => setShowDiary(true)}
            hasSave={hasSave} 
            menuBg={menuBg} 
            unlockedAchievements={stats.achievements || []}
            unreadLetters={stats.mailbox?.filter(l => !l.isRead).length || 0}
          />
        } />
      </Routes>
      </ErrorBoundary>
      
      {/* 全局 Overlays - 跨路由保持显示 */}
      {showMap && (
        <LevelMap 
          stats={stats} 
          onClose={() => setShowMap(false)} 
          onLevelClick={jumpToLevel}
        />
      )}
      {showSettings && (
        <SettingsMenu 
          settings={settings} 
          onUpdate={updateSettings} 
          onResetAll={resetAllData}
          onClose={() => setShowSettings(false)} 
        />
      )}
      {showSocialMap && (
        <SocialMap 
          stats={stats} 
          onInteract={handleSocialInteract}
          onClose={() => setShowSocialMap(false)} 
        />
      )}
      {activeCrisis && (
        <CrisisOverlay 
          event={activeCrisis} 
          onOptionSelect={handleCrisisDecision} 
        />
      )}
      {showIdentitySelector && (
        <IdentitySelector 
          onSelect={handleIdentitySelect} 
          onBack={() => setShowIdentitySelector(false)}
        />
      )}
      {showMailbox && (
        <MailboxModal 
          letters={stats.mailbox || []} 
          onClose={() => setShowMailbox(false)} 
          onRead={markLetterAsRead}
          onAction={handleLetterAction}
          onDelete={deleteLetter}
        />
      )}
      {showMemoryAlbum && (
        <MemoryAlbumModal 
          images={stats.memoryAlbum || []} 
          onClose={() => setShowMemoryAlbum(false)} 
          onDelete={deleteMemoryImage}
        />
      )}
      {showDiary && (
        <DiaryModal 
          entries={stats.diary || []} 
          currentLocation={currentScenario?.title}
          chapter={stats.chapter}
          level={stats.level}
          onSave={handleSaveDiary}
          onDelete={handleDeleteDiary}
          onClose={() => setShowDiary(false)} 
        />
      )}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      {showConfirmMenu && <ConfirmDialog onConfirm={confirmReset} onCancel={() => setShowConfirmMenu(false)} />}
      {activeAchievement && (
        <AchievementToast 
          achievement={activeAchievement} 
          onClose={() => setActiveAchievement(null)} 
        />
      )}
    </div>
  );
};

export default App;
