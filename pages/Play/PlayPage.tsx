
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { GameStats, Scenario, GameOption } from '../../types';
import StatBar from './StatBar';
import TypewriterText from '../../components/TypewriterText';
import { readImageState, writeImageState, preloadImage, type ImageState } from '../../utils/imageState';

// description 背景图素材池：自动收集本地 image/ 下的所有 png（含 intro.png、de-survival-* 等）
const LOCAL_DESCRIPTION_BG_POOL: string[] = Object.values(
  import.meta.glob('../../image/*.png', { eager: true, import: 'default' })
) as string[];

// 只使用本地 image/ 里的图片做随机背景（不混入任何网图）
const DESCRIPTION_BG_POOL = [...LOCAL_DESCRIPTION_BG_POOL].filter(Boolean);

interface PlayPageProps {
  stats: GameStats;
  currentScenario: Scenario | null;
  resultOverlay: string | null;
  bgImage: string;
  onOptionSelect: (option: GameOption) => void;
  onHomeClick: () => void;
  onMapClick: () => void;
  onSaveClick: () => void;
  onMailboxClick: () => void;
  onMemoryAlbumClick: () => void;
  onDiaryClick: () => void;
  onBackgroundLoaded?: (url: string) => void;
}

const PlayPage: React.FC<PlayPageProps> = ({
  stats,
  currentScenario,
  resultOverlay,
  bgImage,
  onOptionSelect,
  onHomeClick,
  onMapClick,
  onSaveClick,
  onMailboxClick,
  onMemoryAlbumClick,
  onDiaryClick,
  onBackgroundLoaded
}) => {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [descBg, setDescBg] = useState<string>('');
  const [sceneBg, setSceneBg] = useState<string>('');
  const [okPool, setOkPool] = useState<string[]>(() => {
    const s = readImageState();
    // 只保留当前构建里存在的本地图片
    return s.ok.filter(u => DESCRIPTION_BG_POOL.includes(u));
  });

  // 预加载所有本地图片：加载成功的才加入 ok 池（之后随机只从 ok 池抽）
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!DESCRIPTION_BG_POOL.length) return;
      const state = readImageState();
      const okSet = new Set((state.ok || []).filter(u => DESCRIPTION_BG_POOL.includes(u)));

      for (const src of DESCRIPTION_BG_POOL) {
        if (cancelled) return;
        if (okSet.has(src)) continue;
        const ok = await preloadImage(src);
        if (cancelled) return;
        if (ok) {
          okSet.add(src);
          const nextOk = Array.from(okSet);
          writeImageState({ ...state, ok: nextOk });
          setOkPool(nextOk);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // 当场景改变时，重置打字机状态
  useEffect(() => {
    setIsTypingComplete(false);
  }, [currentScenario?.id]);

  const pickBgForScenario = async (kind: 'scene' | 'desc') => {
    if (!currentScenario?.id) return '';
    const scenarioId = currentScenario.id;
    const state = readImageState();
    const ok = (state.ok || []).filter(u => DESCRIPTION_BG_POOL.includes(u));

    const byScenario = kind === 'scene' ? { ...state.sceneByScenario } : { ...state.descByScenario };
    const existing = byScenario[scenarioId];
    if (existing && ok.includes(existing)) return existing;

    // 只从 ok 池随机；如果 ok 还是空（首次启动），就先尝试加载几张直到成功为止
    const pool = ok.length ? ok : DESCRIPTION_BG_POOL;
    const attempts = Math.min(10, pool.length);
    for (let i = 0; i < attempts; i++) {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      const candidateOk = ok.length ? true : await preloadImage(candidate);
      if (candidateOk) {
        const nextOk = ok.includes(candidate) ? ok : [...ok, candidate];
        byScenario[scenarioId] = candidate;
        const nextState: ImageState =
          kind === 'scene'
            ? { ...state, ok: nextOk, sceneByScenario: byScenario }
            : { ...state, ok: nextOk, descByScenario: byScenario };
        writeImageState(nextState);
        setOkPool(nextOk);
        return candidate;
      }
    }
    return '';
  };

  // 当场景改变时：description 框背景刷新（只用已成功加载过的图）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await pickBgForScenario('desc');
      if (!cancelled && next) setDescBg(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentScenario?.id, okPool.length]);

  // 关卡整页背景：每次出现新的 description（即关卡 id 变化）就立刻换一张本地图
  // 用 useLayoutEffect 避免“先渲染旧图 -> 再切新图”的闪跳
  useLayoutEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await pickBgForScenario('scene');
      if (!cancelled && next) setSceneBg(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentScenario?.id]);

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col overflow-hidden">
      {/* Low Sanity Warning Overlay */}
      {stats.sanity < 25 && (
        <div className="fixed inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(220,38,38,0.3)] animate-pulse border-[4px] border-red-600/20"></div>
      )}
      
      <StatBar 
        stats={stats} 
        onHomeClick={onHomeClick} 
        onMapClick={onMapClick} 
        onSaveClick={onSaveClick} 
      />

      {/* Floating Action Buttons */}
      <div className="fixed top-24 right-6 z-30 flex flex-col gap-6">
        <button 
          onClick={onMailboxClick}
          className="relative group p-4 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all duration-500 backdrop-blur-md shadow-2xl"
          title="信箱 (Mailbox)"
        >
          <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {stats.mailbox?.filter(l => !l.isRead).length > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full border border-black animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          )}
        </button>

        <button 
          onClick={onMemoryAlbumClick}
          className="group p-4 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all duration-500 backdrop-blur-md shadow-2xl"
          title="记忆相册 (Album)"
        >
          <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button 
          onClick={onDiaryClick}
          className="group p-4 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all duration-500 backdrop-blur-md shadow-2xl"
          title="留德日记 (Diary)"
        >
          <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        {(sceneBg || bgImage) && (
          <img 
            key={sceneBg || bgImage} 
            src={sceneBg || bgImage} 
            className={`w-full h-full object-cover animate-fadeIn ${stats.sanity < 20 ? 'grayscale-[0.5] contrast-125' : ''}`} 
            alt="Scenario" 
            onLoad={() => {
              const shown = sceneBg || bgImage;
              if (!shown) return;
              // 记为“已加载成功”，供相册/随机池使用
              const state = readImageState();
              if (!state.ok?.includes(shown)) {
                writeImageState({ ...state, ok: [...(state.ok || []), shown] });
              }
              onBackgroundLoaded?.(shown);
            }}
          />
        )}
        <div className="absolute inset-0 cinematic-gradient"></div>
      </div>

      {/* Main UI Layer */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 md:p-12 max-w-5xl mx-auto w-full">
        {currentScenario && !resultOverlay && (
          <div className="mb-8 space-y-4 animate-fadeIn">
            <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">
                Semester {stats.semester} • 困境挑战
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold serif-font text-white drop-shadow-2xl italic">
              {currentScenario.title}
            </h2>
            <div className={`relative overflow-hidden bg-black/50 backdrop-blur-xl border-l-4 border-white p-6 rounded-r-lg max-w-3xl shadow-lg ${stats.sanity < 15 ? 'animate-shake' : ''}`}>
              {/* description 背景图（随机） */}
              {descBg && (
                <img
                  src={descBg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-[1px] scale-110"
                  draggable={false}
                />
              )}
              {/* 叠一层暗色，保证可读性 */}
              <div className="absolute inset-0 bg-black/55"></div>
              <div className="relative">
              <TypewriterText 
                text={currentScenario.description}
                // 让描述出现稍微慢一点点（更有电影感）
                speed={4}
                onComplete={() => setIsTypingComplete(true)}
                className="text-lg md:text-xl text-gray-100 leading-relaxed font-light"
              />
              </div>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 transition-all duration-1000 ${isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {currentScenario.options.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => onOptionSelect(opt)} 
                  className="p-5 md:p-8 text-left border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-white group-hover:bg-black transition-colors"></div>
                  <span className="block text-[10px] uppercase tracking-widest opacity-40 mb-2 group-hover:text-black/40">选择 {idx + 1}</span>
                  <span className="text-lg font-medium tracking-tight leading-snug">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {resultOverlay && (
          <div className="mb-24 animate-bounce-in text-center p-12 bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-white">
              “ {resultOverlay} ”
            </p>
          </div>
        )}
      </div>
      
      {/* Cinematic Grain Effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20 contrast-150"></div>
    </div>
  );
};

export default PlayPage;
