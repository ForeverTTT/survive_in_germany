
export interface HistoryEntry {
  chapter: number;
  level: number;
  title: string;
  description: string;
  choiceMade: string;
  resultDescription: string;
  timestamp: number;
}

export interface GameSettings {
  textSpeed: number; // 1-3
  volume?: number;   // 0-100 (deprecated, for backward compatibility)
  musicVolume: number; // 0-100 背景音乐音量
  sfxVolume: number;   // 0-100 音效音量
  showEffects: boolean;
  useLLM: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface Identity {
  id: string;
  name: string;
  description: string;
  perks: string;
  initialStats: Partial<GameStats>;
  color: string;
}

export interface StatChangeFeedback {
  id: string;
  type: keyof GameStats;
  value: number;
  timestamp: number;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
  favorability: number; // 0-100
  avatar: string;
  lastInteraction?: string;
  isLocked?: boolean; // 是否锁定（未解锁）
}

export interface CrisisEvent {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    impact: Partial<GameStats>;
    result: string;
  }[];
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  sender: string;
  timestamp: number;
  isRead: boolean;
  type: 'info' | 'bill' | 'action';
  action?: {
    text: string;
    impact: Partial<GameStats>;
    result: string;
  };
}

export interface MemoryImage {
  id: string;
  url: string;
  title: string;
  chapter: number;
  level: number;
  timestamp: number;
}

export interface DiaryEntry {
  id: string;
  content: string;
  chapter: number;
  level: number;
  timestamp: number;
  mood?: 'happy' | 'sad' | 'stressed' | 'neutral';
  location?: string;
}

export interface GameStats {
  ects: number;
  money: number;
  sanity: number;
  semester: number;
  chapter: number;
  level: number;
  levelHistory: string[]; // 格式: "chapter-level"
  historyLogs: HistoryEntry[]; // 完整剧情回放
  rngSeed: string;
  tags: string[]; // 获得的标签
  identity?: string; // 玩家选择的身份ID
  achievements: string[]; // 已解锁的成就ID列表
  delayCount: number; // 德铁延误计数
  workCount: number; // 打工计数
  npcs: NPC[]; // 社交圈NPC
  mailbox: Letter[]; // 信箱
  memoryAlbum: MemoryImage[]; // 记忆相册
  diary: DiaryEntry[]; // 留德日记
}

export interface SaveSlot {
  id: string;
  timestamp: number;
  stats: GameStats;
  currentScenario: Scenario | null;
  chapterTitle: string;
}

export interface GameOption {
  text: string;
  resultDescription: string;
  statChanges: Partial<GameStats>;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  imagePrompt: string;
  options: GameOption[];
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  LOADING = 'LOADING',
  GAMEOVER = 'GAMEOVER',
  VICTORY = 'VICTORY',
  MAP = 'MAP'
}
