import { GameStats } from '../data/types';

// 伪随机数生成器 (PRNG) - 保证种子复现
export const seededRandom = (seed: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

// 触发随机加载事件
export const rollMicroEvent = (currentStats: GameStats) => {
  const rng = seededRandom(currentStats.rngSeed + currentStats.levelHistory.length)();
  if (rng > 0.7) { // 30% 概率触发
    const events = [
      { text: "在地铁座椅缝隙捡到了 0.25 欧瓶子", impact: { money: 0.25 }, msg: "Money +0.25€" },
      { text: "今天阳光明媚，你在草坪躺平了一会", impact: { sanity: 5 }, msg: "Sanity +5" },
      { text: "突然想起今天是周日，超市关门了", impact: { sanity: -2 }, msg: "Sanity -2" },
      { text: "在路边看到一张很有艺术感的过期海报", impact: { sanity: 1 }, msg: "Sanity +1" }
    ];
    const ev = events[Math.floor(rng * events.length)];
    return { event: { text: ev.text, statImpact: ev.msg }, impact: ev.impact };
  }
  return { event: null, impact: {} };
};

// 本地背景图池
import introBg from '../assets/media/images/intro.png';

const LOCAL_SCENE_BG_POOL: string[] = Object.values(
  import.meta.glob('../assets/media/images/*.png', { eager: true, import: 'default' })
) as string[];

export const pickRandomLocalSceneBg = () => {
  // 增加日志排查池内容
  if (LOCAL_SCENE_BG_POOL.length > 0) {
    const pick = LOCAL_SCENE_BG_POOL[Math.floor(Math.random() * LOCAL_SCENE_BG_POOL.length)];
    return pick;
  }
  return introBg;
};
