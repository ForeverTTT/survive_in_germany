
import { GameStats, Scenario } from './types';

export const INITIAL_STATS: GameStats = {
  ects: 0,
  money: 5000, // Initial savings in Euro
  sanity: 100,
  semester: 1
};

export const START_SCENARIO: Scenario = {
  id: 'prologue',
  title: '法兰克福机场的冷风',
  description: '你拖着两个30kg的巨型行李箱，走出了法兰克福机场。由于罢工，原本的ICE停运了。此时天正下着夹心雪，冷风直往脖子里灌。你面前只有两个选择。',
  imagePrompt: 'A cinematic, high-quality photograph of Frankfurt Airport in winter, heavy snow, moody lighting, rainy asphalt, German signage, lonely traveler silhouette, 4k, realistic aesthetic.',
  options: [
    {
      text: '咬牙打个Uber去学生宿舍 (60欧)',
      resultDescription: '司机是个热情的土耳其大叔，虽然钱包缩水了，但你保住了体温。',
      statChanges: { money: -60, sanity: +5 }
    },
    {
      text: '坚持等那趟不确定什么时候来的Regional Bahn',
      resultDescription: '你在站台冻了两个小时，DB最终取消了班次。你最后还是打车了，但你感冒了。',
      statChanges: { money: -60, sanity: -20 }
    }
  ]
};

export const SYSTEM_INSTRUCTION = `
你是一位专门创作“德区留子”文化题材的剧本作家。你的任务是根据玩家当前的属性，生成下一个充满“德国特色”的生存困境。
核心属性：
1. ECTS (学分): 目标是达到180分毕业。
2. Money (欧元): 初始5000，生活成本高。
3. Sanity (精神状态): 0-100。
4. Semester (学期): 1-10。

德国特色困境参考：
- DB罢工/延误 (雪天、暑假)。
- 永无止境的纸质公函 (Finanzamt, TK, Ausländerbehörde)。
- 难以预约的Termin。
- 周日超市关门，家里没存粮。
- 只有德语界面的选课系统，教授的口音。
- 挂科率50%以上的Klausur。
- 凌晨4点的图书馆。
- WG舍友半夜开Party，明天你还要考热力学。

输出格式必须是JSON，包含：
- title: 场景标题
- description: 详细的场景描述（包含情绪和环境描写）
- imagePrompt: 用于生成该场景背景图的英文提示词（需符合电影感、写实、略带忧郁的德国美学）
- options: 两个选项，每个选项包含text, resultDescription, 和statChanges。
`;
