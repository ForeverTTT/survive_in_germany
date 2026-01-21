
import React, { useState, useEffect, useCallback } from 'react';
import { GameStats, Scenario, GameStatus, GameOption } from './types';
import { INITIAL_STATS, START_SCENARIO } from './constants';
import { generateNextScenario, generateScenarioImage } from './services/geminiService';
import StatBar from './components/StatBar';
import LevelMap from './components/LevelMap';

const SAVE_KEY = 'de_survival_simulator_save_v1';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [bgImage, setBgImage] = useState<string>('');
  const [loadingMsg, setLoadingMsg] = useState<string>('正在准备降落法兰克福...');
  const [resultOverlay, setResultOverlay] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [hasSave, setHasSave] = useState<boolean>(false);

  // Check for existing save on mount and status changes
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    setHasSave(!!saved);
  }, [status]);

  const saveGame = useCallback(() => {
    try {
      const saveData = {
        stats,
        currentScenario,
        bgImage,
        timestamp: Date.now()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      setHasSave(true);
      alert("进度已成功保存！(Progress Saved)");
    } catch (e) {
      console.error("Save failed:", e);
      // Minimal save if quota exceeded (e.g. huge base64 image)
      try {
        const minimalSave = { stats, currentScenario, bgImage: '', timestamp: Date.now() };
        localStorage.setItem(SAVE_KEY, JSON.stringify(minimalSave));
        alert("进度已保存（背景图因浏览器存储空间限制未保存）。");
      } catch (e2) {
        alert("保存失败：存储空间已满。");
      }
    }
  }, [stats, currentScenario, bgImage]);

  const loadGame = useCallback(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;

    try {
      const { stats: savedStats, currentScenario: savedScenario, bgImage: savedBg } = JSON.parse(saved);
      setStats(savedStats);
      setCurrentScenario(savedScenario);
      setBgImage(savedBg);
      setStatus(GameStatus.PLAYING);
      setShowMap(false);
    } catch (e) {
      console.error("Load failed:", e);
      alert("存档文件损坏或格式不正确，无法读取。");
    }
  }, []);

  const startGame = async () => {
    setStatus(GameStatus.LOADING);
    setLoadingMsg('正在获取签证信息...');
    setStats(INITIAL_STATS);
    try {
      const img = await generateScenarioImage(START_SCENARIO.imagePrompt);
      setBgImage(img);
      setCurrentScenario(START_SCENARIO);
      setStatus(GameStatus.PLAYING);
    } catch (e) {
      console.error(e);
      // Fallback in case of image generation error
      setCurrentScenario(START_SCENARIO);
      setStatus(GameStatus.PLAYING);
    }
  };

  const resetToMenu = useCallback(() => {
    if (confirm("确定要返回主菜单吗？当前的未保存进度将会丢失。")) {
      setStatus(GameStatus.START);
      setStats(INITIAL_STATS);
      setCurrentScenario(null);
      setBgImage('');
      setShowMap(false);
      setResultOverlay(null);
    }
  }, []);

  const handleOptionSelect = async (option: GameOption) => {
    setResultOverlay(option.resultDescription);
    
    const newStats = {
      ects: stats.ects + (option.statChanges.ects || 0),
      money: stats.money + (option.statChanges.money || 0),
      sanity: Math.max(0, Math.min(100, stats.sanity + (option.statChanges.sanity || 0))),
      semester: stats.semester + (option.statChanges.semester || 0)
    };
    setStats(newStats);

    // End conditions
    if (newStats.sanity <= 0 || newStats.money <= -1000) {
      setTimeout(() => {
        setStatus(GameStatus.GAMEOVER);
        setResultOverlay(null);
      }, 3000);
      return;
    }
    if (newStats.ects >= 180) {
      setTimeout(() => {
        setStatus(GameStatus.VICTORY);
        setResultOverlay(null);
      }, 3000);
      return;
    }

    // Transition to next scenario
    setTimeout(async () => {
      setResultOverlay(null);
      setStatus(GameStatus.LOADING);
      setLoadingMsg(getRandomLoadingMsg());
      try {
        const next = await generateNextScenario(newStats, option.text);
        const nextImg = await generateScenarioImage(next.imagePrompt);
        setBgImage(nextImg);
        setCurrentScenario(next);
        setStatus(GameStatus.PLAYING);
      } catch (err) {
        console.error("Failed to generate scenario:", err);
        setLoadingMsg("由于罢工，生成系统延误了... 正在重试");
        // Simple retry mechanism
        setTimeout(() => handleOptionSelect(option), 3000);
      }
    }, 3000);
  };

  const getRandomLoadingMsg = () => {
    const msgs = [
      "正在处理TK医保公函...",
      "DB列车正在由于天气原因（有云）延误中...",
      "正在等待外管局的Termin...",
      "正在周日关闭的超市门口沉思...",
      "正在图书馆抢座...",
      "正在试图读懂德语版电费账单...",
      "正在经历期末考前的第54次崩溃..."
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  };

  // --- RENDERING ---

  if (status === GameStatus.START) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1546726747-0411da142385?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="z-10 text-center max-w-2xl px-4">
          <h1 className="text-5xl md:text-8xl serif-font font-bold mb-6 italic text-white drop-shadow-2xl">
            德区留子生存模拟器
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 tracking-[0.4em] uppercase opacity-60">
            German Student Survival Simulator
          </p>
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center w-full">
              <button 
                onClick={startGame}
                className="px-12 py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-500 tracking-[0.2em] text-lg font-light backdrop-blur-sm"
              >
                开始新模拟 (NEW GAME)
              </button>
              {hasSave && (
                <button 
                  onClick={loadGame}
                  className="px-12 py-4 bg-white/10 border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-500 tracking-[0.2em] text-lg font-light backdrop-blur-sm"
                >
                  继续模拟 (LOAD GAME)
                </button>
              )}
            </div>
            <button 
              className="px-8 py-3 border border-white/10 text-white/20 cursor-not-allowed tracking-[0.2em] text-sm font-light w-full md:w-auto"
              disabled
            >
              成就集 (LOCKED)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === GameStatus.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mb-8 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
        <p className="text-xl font-light tracking-widest animate-pulse text-white/80">{loadingMsg}</p>
      </div>
    );
  }

  if (status === GameStatus.GAMEOVER) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <div className="absolute inset-0 opacity-20 bg-red-900 pointer-events-none"></div>
        <h2 className="text-7xl font-bold mb-6 serif-font italic text-red-600">模拟终止</h2>
        <p className="text-xl mb-12 max-w-md text-gray-400">你在德意志的生存挑战以失败告终。可能是因为精神崩溃，也可能是因为钱包空空。准备好回国了吗？</p>
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
          >
            重新开始
          </button>
          <button 
            onClick={() => setStatus(GameStatus.START)}
            className="px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            返回主界面
          </button>
        </div>
      </div>
    );
  }

  if (status === GameStatus.VICTORY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <div className="absolute inset-0 opacity-20 bg-green-900 pointer-events-none"></div>
        <h2 className="text-7xl font-bold mb-6 serif-font italic text-green-500">学成毕业</h2>
        <p className="text-xl mb-12 max-w-md text-gray-400">恭喜！你拿到了那张价值连城的Urkunde。180个ECTS终于凑齐了。虽然发际线后移了，但你赢了！</p>
        <button 
          onClick={() => setStatus(GameStatus.START)}
          className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors relative z-10"
        >
          载誉而归
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col overflow-hidden">
      <StatBar 
        stats={stats} 
        onHomeClick={resetToMenu} 
        onMapClick={() => setShowMap(true)} 
        onSaveClick={saveGame}
      />
      
      {showMap && (
        <LevelMap 
          currentSemester={stats.semester} 
          onClose={() => setShowMap(false)} 
        />
      )}

      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {bgImage && (
          <img 
            key={bgImage}
            src={bgImage} 
            className="w-full h-full object-cover blur-in transition-opacity duration-1000"
            alt="Scenario Background"
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
            <div className="bg-black/50 backdrop-blur-xl border-l-4 border-white p-6 rounded-r-lg max-w-3xl shadow-lg">
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-light">
                {currentScenario.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
              {currentScenario.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt)}
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

export default App;
