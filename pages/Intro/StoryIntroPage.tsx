import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Identity } from '../../data/types';

// 打字机效果组件
const TypewriterText: React.FC<{ 
  text: string; 
  delay?: number; 
  speed?: number;
  className?: string; 
  onComplete?: () => void 
}> = ({ text, delay = 0, speed = 18, className = '', onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);
  
  useEffect(() => {
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
      {!completed && <span className="animate-pulse text-green-400">▊</span>}
    </span>
  );
};

interface StoryIntroPageProps {
  onStartGame: (identity: Identity) => void;
}

const StoryIntroPage: React.FC<StoryIntroPageProps> = ({ onStartGame }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const identity = location.state?.identity as Identity | undefined;
  
  const [showButton, setShowButton] = useState(false);
  const [allTextComplete, setAllTextComplete] = useState(false);
  const [completedLines, setCompletedLines] = useState(0);
  
  // 如果没有identity数据，重定向回主页
  useEffect(() => {
    if (!identity) {
      navigate('/', { replace: true });
    }
  }, [identity, navigate]);

  // 追踪完成的文本行数
  const handleLineComplete = useCallback(() => {
    setCompletedLines(prev => prev + 1);
  }, []);

  // 当所有文本完成后显示按钮
  useEffect(() => {
    if (completedLines >= 9) { // 总共9行文本
      setAllTextComplete(true);
      setTimeout(() => setShowButton(true), 300);
    }
  }, [completedLines]);

  // 跳过动画，直接显示所有内容
  const handleSkip = () => {
    setAllTextComplete(true);
    setCompletedLines(9);
    setShowButton(true);
  };

  if (!identity) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      {/* 背景动效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' 
        }} />
      </div>

      {/* 跳过按钮 */}
      {!allTextComplete && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 px-4 py-2 text-white/40 hover:text-white/70 text-xs uppercase tracking-widest transition-colors z-10"
        >
          跳过 Skip »
        </button>
      )}

      <div className="relative max-w-3xl w-full px-6 md:px-8 space-y-8">
        {/* 终端风格标题 */}
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1.5 border border-green-500/30 rounded-full bg-green-500/5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-green-400 font-mono">
              System Initializing...
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-white tracking-tight">
            Willkommen
          </h1>
          <p className="text-white/25 text-xs tracking-[0.5em] uppercase">
            — 德意志联邦共和国 —
          </p>
        </div>

        {/* 打字机文本区域 */}
        <div className="bg-black/70 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl font-mono text-sm leading-relaxed space-y-3 shadow-2xl">
          {/* 窗口装饰 */}
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-white/30 text-xs font-mono">survival_protocol.exe</span>
          </div>
          
          <div className="space-y-2 pt-2">
            {allTextComplete ? (
              // 静态显示所有文本
              <>
                <p className="text-green-400">{`> 身份确认: ${identity.name}`}</p>
                <p className="text-white/70">> 你刚刚降落在法兰克福机场，手里攥着入学通知书。</p>
                <p className="text-white/70">> 心里满是对未来的期待和一丝忐忑...</p>
                <p className="text-white/60">> 然而，这片以严谨著称的土地，准备给你上一堂生存课。</p>
                <p className="text-yellow-400/90 pt-2">> [WARNING] 检测到多重生存威胁:</p>
                <p className="text-white/50 pl-4">  • 🏛️ 官僚迷宫 (Bürokratie)</p>
                <p className="text-white/50 pl-4">  • 📚 学业压力 (Studium)</p>
                <p className="text-white/50 pl-4">  • 💶 经济危机 (Finanzen)</p>
                <p className="text-white/50 pl-4">  • 🧠 精神内耗 (Psyche)</p>
                <p className="text-red-400/80 pt-2">> [MISSION] 目标: 活下去。拿学位。保持清醒。</p>
              </>
            ) : (
              // 打字机效果
              <>
                <p className="text-green-400">
                  <TypewriterText 
                    text={`> 身份确认: ${identity.name}`}
                    delay={200}
                    speed={15}
                    onComplete={handleLineComplete}
                  />
                </p>
                <p className="text-white/70">
                  <TypewriterText 
                    text="> 你刚刚降落在法兰克福机场，手里攥着入学通知书。"
                    delay={1200}
                    speed={18}
                    onComplete={handleLineComplete}
                  />
                </p>
                <p className="text-white/70">
                  <TypewriterText 
                    text="> 心里满是对未来的期待和一丝忐忑..."
                    delay={3200}
                    speed={18}
                    onComplete={handleLineComplete}
                  />
                </p>
                <p className="text-white/60">
                  <TypewriterText 
                    text="> 然而，这片以严谨著称的土地，准备给你上一堂生存课。"
                    delay={5000}
                    speed={18}
                    onComplete={handleLineComplete}
                  />
                </p>
                <p className="text-yellow-400/90 pt-2">
                  <TypewriterText 
                    text="> [WARNING] 检测到多重生存威胁:"
                    delay={7500}
                    speed={15}
                    onComplete={handleLineComplete}
                  />
                </p>
                <p className="text-white/50 pl-4">
                  <TypewriterText text="  • 🏛️ 官僚迷宫 (Bürokratie)" delay={8800} speed={12} onComplete={handleLineComplete} />
                </p>
                <p className="text-white/50 pl-4">
                  <TypewriterText text="  • 📚 学业压力 (Studium)" delay={9600} speed={12} onComplete={handleLineComplete} />
                </p>
                <p className="text-white/50 pl-4">
                  <TypewriterText text="  • 💶 经济危机 (Finanzen)" delay={10400} speed={12} onComplete={handleLineComplete} />
                </p>
                <p className="text-white/50 pl-4">
                  <TypewriterText text="  • 🧠 精神内耗 (Psyche)" delay={11200} speed={12} onComplete={handleLineComplete} />
                </p>
                <p className="text-red-400/80 pt-2">
                  <TypewriterText 
                    text="> [MISSION] 目标: 活下去。拿学位。保持清醒。"
                    delay={12200}
                    speed={18}
                    onComplete={handleLineComplete}
                  />
                </p>
              </>
            )}
          </div>
        </div>

        {/* 身份卡片 */}
        <div className={`text-center transition-all duration-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-block bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl px-8 py-4 backdrop-blur-sm">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">Your Identity</p>
            <p className="text-xl font-bold text-white">{identity.name}</p>
            <p className="text-xs text-white/50 mt-1">{identity.description}</p>
          </div>
        </div>

        {/* 开始按钮 */}
        <div className={`text-center pt-2 transition-all duration-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => onStartGame(identity)}
            disabled={!showButton}
            className="group relative px-14 py-5 overflow-hidden rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* 按钮背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            
            {/* 边框光效 */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors" />
            <div className="absolute -inset-1 rounded-2xl bg-green-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 按钮文字 */}
            <span className="relative flex items-center justify-center gap-3 text-white font-black uppercase text-sm tracking-[0.25em]">
              <span>开始生存模拟</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <p className="mt-8 text-[10px] text-white/20 uppercase tracking-[0.4em] font-mono">
            Viel Erfolg. Du wirst es brauchen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryIntroPage;
