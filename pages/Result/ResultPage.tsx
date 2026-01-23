
import React from 'react';
import { GameStatus } from '../../data/types';
import introBg from '../../assets/media/images/intro.png';

interface ResultPageProps {
  status: GameStatus;
  onRestart: () => void;
  onBackToMenu: () => void;
  menuBg: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ status, onRestart, onBackToMenu, menuBg }) => {
  const isVictory = status === GameStatus.VICTORY;
  
  // 背景图最终判定：强制使用 introBg (DB火车雪地场景)
  const finalBg = introBg;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center relative overflow-hidden">
      {/* 德国留学主题背景 */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src={finalBg} 
          className="w-full h-full object-cover"
          alt="Background"
          onError={(e) => {
            console.error('Result background failed:', finalBg);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* 占位背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 -z-10"></div>
      </div>
      <div className="absolute inset-0 cinematic-gradient"></div>
      <div className={`absolute inset-0 opacity-20 ${isVictory ? 'bg-green-900' : 'bg-red-900'} pointer-events-none`}></div>
      <h2 className={`text-7xl font-bold mb-6 serif-font italic ${isVictory ? 'text-green-500' : 'text-red-600'}`}>
        {isVictory ? '学成毕业' : '模拟终止'}
      </h2>
      <p className="text-xl mb-12 max-w-md text-gray-400">
        {isVictory 
          ? '恭喜！你拿到了那张价值连城的Urkunde。180个ECTS终于凑齐了。虽然发际线后移了，但你赢了！' 
          : '你在德意志的生存挑战以失败告终。可能是因为精神崩溃，也可能是因为钱包空空。准备好回国了吗？'}
      </p>
      <div className="flex gap-4 relative z-10">
        <button 
          onClick={onRestart} 
          className={`px-8 py-3 ${isVictory ? 'bg-white text-black' : 'bg-red-600 text-white'} font-bold uppercase tracking-widest hover:opacity-80 transition-all shadow-lg`}
        >
          {isVictory ? '载誉而归' : '重新开始'}
        </button>
        {!isVictory && (
          <button 
            onClick={onBackToMenu} 
            className="px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            返回主界面
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
