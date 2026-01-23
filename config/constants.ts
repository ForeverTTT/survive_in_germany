
import { GameStats, Scenario, GameSettings, Identity, Achievement, NPC, CrisisEvent } from '../data/types';

export const INITIAL_NPCS: NPC[] = [
  {
    id: 'prof_schmidt',
    name: 'Schmidt 教授',
    role: '严厉的系主任',
    description: 'TUM 著名的“杀手课”讲师，对学术规范有着病态的坚持。',
    favorability: 20,
    avatar: '👨‍🏫',
    isLocked: false
  },
  {
    id: 'senior_l',
    name: 'L学长',
    role: '社交达人/打工皇帝',
    description: '在德国待了 n 年，没有他搞不定的兼职和内推。',
    favorability: 40,
    avatar: '👨‍🎓',
    isLocked: false
  },
  {
    id: 'flatmate_clara',
    name: 'Clara',
    role: '同病相怜的室友',
    description: '来自意大利的交换生，和你一样每天都在纠结垃圾分类。',
    favorability: 50,
    avatar: '👩‍🎨',
    isLocked: false
  },
  {
    id: 'hausmeister_klaus',
    name: 'Hausmeister Klaus',
    role: '宿舍管理员',
    description: '掌握着你宿舍钥匙和暖气命运的男人，通常只在 10:00-11:00 办公。',
    favorability: 10,
    avatar: '👴',
    isLocked: true
  },
  {
    id: 'auslaenderbehoerde_frau_muller',
    name: 'Frau Müller',
    role: '外管局办事员',
    description: '她的表情决定了你下一次签证的有效期长度。',
    favorability: 5,
    avatar: '👩‍💼',
    isLocked: true
  }
];

export const CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: 'strike_wave',
    title: '全德大罢工 (Streik!)',
    description: '由于 GDL 薪资谈判破裂，全德国交通瘫痪。你今天有一场价值 12 ECTS 的考试。',
    options: [
      {
        text: '豪掷 150 欧打 Uber 赶往考场',
        impact: { money: -150, sanity: -10 },
        result: '你赶上了考试，但钱包在滴血。'
      },
      {
        text: '错过考试，申请 Attest 补考',
        impact: { sanity: -30, ects: -12 },
        result: '补考流程极其复杂，你的学分计划被打乱了。'
      }
    ]
  },
  {
    id: 'ard_bill',
    title: 'ARD 催款单 (Rundfunkbeitrag)',
    description: '你突然收到一封厚厚的信，要求你补缴过去一年的广播费。一共 220 欧。',
    options: [
      {
        text: '乖乖全额补缴',
        impact: { money: -220, sanity: -5 },
        result: '你履行了“公民义务”，心在滴血。'
      },
      {
        text: '写信试图申诉豁免',
        impact: { sanity: -20, money: -50 },
        result: '申诉失败了，你还额外付了滞纳金。'
      }
    ]
  },
  {
    id: 'heating_debt',
    title: '暖气费补缴 (Nachzahlung)',
    description: '冬天结束了，因为能源危机，你的暖气费超出预支 500 欧。',
    options: [
      {
        text: '分期付款',
        impact: { money: -500, sanity: -15 },
        result: '接下来的五个月，你都要缩减开支。'
      },
      {
        text: '找 Hausmeister 理论',
        impact: { sanity: -25 },
        result: '并没有什么用，反而被训斥了一顿。'
      }
    ]
  }
];

export const INITIAL_STATS: GameStats = {
  ects: 0,
  money: 5000,
  sanity: 100,
  semester: 1,
  chapter: 1,
  level: 1,
  levelHistory: ["1-1"],
  historyLogs: [],
  rngSeed: Math.random().toString(36).substring(7),
  tags: [],
  achievements: [],
  delayCount: 0,
  workCount: 0,
  npcs: INITIAL_NPCS,
  mailbox: [],
  memoryAlbum: [],
  diary: []
};

export const IDENTITIES: Identity[] = [
  {
    id: 'tum_slave',
    name: '工科苦力',
    description: '你在 TUM 或 RWTH 读研，随身携带一把计算尺。',
    perks: '初始 +10 ECTS，但 Sanity 下降速度快 10%',
    initialStats: { ects: 10, sanity: 100, money: 4500 },
    color: 'blue'
  },
  {
    id: 'bwl_elite',
    name: '商科精英',
    description: '法兰克福金融圈的预备役，西装笔挺。',
    perks: '初始资金 +2000€，更容易触发高收益随机事件',
    initialStats: { ects: 0, sanity: 100, money: 7000 },
    color: 'gold'
  },
  {
    id: 'arts_soul',
    name: '艺术之魂',
    description: '柏林的自由职业者，在画室和咖啡厅穿梭。',
    perks: 'Sanity 恢复速度翻倍，但学分和金钱获取较难',
    initialStats: { ects: 0, sanity: 120, money: 3000 },
    color: 'purple'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_pfand', title: '回血达人', description: '第一次通过退瓶子赚到钱', icon: '♻️' },
  { id: 'db_victim', title: '德铁受害者', description: '累计遇到 3 次以上列车延误。效果：未来遇到交通延误时，Sanity 下降减半（已经麻木了）。', icon: '🚆' },
  { id: 'illegal_work', title: '黑工嫌疑', description: '过度打工或打黑工被盯上。效果：未来办理延签剧情时，难度大幅增加。', icon: '🕵️' },
  { id: 'language_god', title: '语言天才', description: '德语对话表现完美。效果：解锁隐藏的“德语撕逼”选项，可以直接免除某些行政罚款。', icon: '🗣️' },
  { id: 'sanity_collapse', title: '精神重塑', description: 'Sanity 降至 10 以下但依然存活', icon: '🧠' },
  { id: 'graduate_victory', title: '毕业万岁', description: '成功拿到毕业证书', icon: '🎓' }
];

export const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 2,
  volume: 80,
  showEffects: true,
  useLLM: true
};

// 换成 MP3 格式的肖邦夜曲，兼容性更好
export const BGM_URL = "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/33/Frederic_Chopin_-_Nocturne_Op._9%2C_No._2_in_E-flat_major.ogg/Frederic_Chopin_-_Nocturne_Op._9%2C_No._2_in_E-flat_major.ogg.mp3"; 

// UI 音效
export const CLICK_SFX_URL = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"; 
export const SUCCESS_SFX_URL = "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3";
export const CHAPTER_DATA = [
  { id: 1, title: "初抵德意志", subtitle: "Ankommen" },
  { id: 2, title: "课堂厮杀", subtitle: "Kampf im Hörsaal" },
  { id: 3, title: "生存之道", subtitle: "Überleben" },
  { id: 4, title: "毕业冲刺", subtitle: "Endspurt" }
];

// 定义 DAG 拓扑结构 (层级纵向，同层横向)
export const DAG_STAGES = [
  [1],          // Stage 1
  [2, 3],       // Stage 2: 横向分叉
  [4],          // Stage 3
  [5, 6, 7],    // Stage 4: 横向三路
  [8, 9],       // Stage 5
  [10],         // Stage 6
  [11, 12],     // Stage 7
  [13, 14],     // Stage 8
  [15]          // Stage 9
];

export const LETTER_TEMPLATES = [
  {
    title: "关于 Rundfunkbeitrag (广播电视费) 的重要通知",
    sender: "Beitragsservice",
    content: "尊敬的住户，我们注意到您尚未注册广播费。在德国，每个住户都有义务缴纳每月 18.36 欧元的费用。请尽快完成注册，否则将面临滞纳金。",
    type: 'bill' as const,
    action: {
      text: "乖乖注册并缴纳 (55.08 欧 - 三个月)",
      impact: { money: -55.08, sanity: -5 },
      result: "你履行了德国公民的‘义务’。"
    }
  },
  {
    title: "你的 TK 保险卡已寄出",
    sender: "Techniker Krankenkasse (TK)",
    content: "你好！你的电子健康保险卡已经通过邮寄发出。请确保你的信箱上有清晰的名字标签 (Namensschild)，否则邮件将被退回。",
    type: 'info' as const
  },
  {
    title: "关于 WG 房间面试的回复",
    sender: "Tobias (WG 主人)",
    content: "嘿！感谢你来参加我们的 WG 面试。我们觉得你很酷，想邀请你加入我们的合租房。租金是每月 450 欧，押金 900 欧。你感兴趣吗？",
    type: 'action' as const,
    action: {
      text: "接受并付押金 (1350 欧)",
      impact: { money: -1350, sanity: +20 },
      result: "你终于摆脱了昂贵的临时酒店，有了一个真正的家！"
    }
  },
  {
    title: "外管局 Termin 确认信",
    sender: "Ausländerbehörde",
    content: "您的预约已确认。日期：下周二 08:15。请携带有效的护照、生物识别照片、当前的保险证明和资金证明。",
    type: 'info' as const
  },
  {
    title: "Amazon 快递配送失败",
    sender: "DHL Express",
    content: "抱歉，由于无法找到您的地址或信箱上没有名字，您的快递无法投递。它已被送往最近的 Paketstation，请在 7 天内领取。",
    type: 'info' as const
  }
];

// 注意：START_SCENARIO 已被本地关卡系统替代，这里保留作为类型参考
export const START_SCENARIO: Scenario = {
  id: '1-1',
  title: '法兰克福机场的冷风',
  description: '你拖着两个30kg的巨型行李箱，走出了法兰克福机场。由于罢工，原本的ICE停运了。此时天正下着夹心雪，冷风直往脖子里灌。你面前只有两个选择。',
  imagePrompt: 'Frankfurt airport in winter, heavy snow falling, cold atmosphere, large suitcases, lonely international student',
  options: [
    {
      text: '咬牙打个Uber去学生宿舍 (60欧)',
      resultDescription: '司机是个热情的土耳其大叔，虽然钱包缩水了，但你保住了体温。',
      statChanges: { money: -60, sanity: +5 }
    },
    {
      text: '坚持等那趟不确定什么时候来的Regional Bahn',
      resultDescription: '你在站台冻了两个小时，DB最终取消了班次。你最后还是打车了，但你感冒了。',
      statChanges: { money: -60, sanity: -20, delayCount: 1 }
    }
  ]
};

export const SYSTEM_INSTRUCTION = `
你是一位专门创作“德区留子”文化题材的剧本作家。你的任务是根据玩家当前的属性、所处的章节以及已解锁的成就，生成下一个充满“德国特色”的生存困境。

核心成就影响：
1. [德铁受害者] (db_victim): 玩家已经对延误麻木。如果当前场景涉及交通延误，请在描述中体现玩家的淡定，并减少精神损失。
2. [黑工嫌疑] (illegal_work): 玩家因为打工过多被外管局盯上。如果当前场景涉及签证、延签或行政审查，请大幅增加难度，描述中体现压力和被质疑。
3. [语言天才] (language_god): 玩家德语极好。如果场景涉及沟通冲突，请务必提供一个【专属选项】，前缀带有 [语言天才]，该选项通常能通过流利的德语“撕逼”或沟通来免除罚款或获得额外利益。

游戏结构分为 4 个大章节，每个章节约 15 个小关卡：
1. Chapter 1: 初抵德意志 (Ankommen) - 侧重于落脚、语言、文化冲击、基础行政（如报户口、办保险、TK）。
2. Chapter 2: 课堂厮杀 (Kampf im Hörsaal) - 侧重于学习压力、难缠的教授、小组作业、由于挂科导致的 Exmatrikulation 风险。
3. Chapter 3: 生存之道 (Überleben) - 侧重于实习申请、学生工工作、复杂的租房市场、融入当地社交圈的尴尬。
4. Chapter 4: Endspurt (毕业冲刺) - 侧重于毕业论文、最终答辩、未来职业规划、找工作签证、回国还是留下的心理拉锯。

核心属性：
1. ECTS (学分): 目标是达到180分毕业。
2. Money (欧元): 初始资金根据身份不同。
3. Sanity (精神状态): 0-100。
4. Chapter & Level: 当前进度的视觉参考。
5. Achievements: 已解锁的成就列表，请务必根据此列表定制场景描述和选项。
6. NPCs: 社交圈NPC及其好感度。如果某个NPC好感度高（>60），请在剧情中偶尔让他们出现，并提供有利的选择。

  output格式必须是JSON，包含：
- title: 场景标题
- description: 详细的场景描述（包含情绪和环境描写）
- imagePrompt: 用于生成该场景背景图的英文提示词（需符合电影感、写实、略带忧郁的德国美学）
    - options: 两个选项（如果有[语言天才]成就，可提供第三个专属选项），每个选项包含text, resultDescription, 和statChanges。
`;

export const LOADING_TIPS = [
  "在德国，周日所有超市都会关门，记得周六买好干粮。",
  "看到 Pfand 标志了吗？每个塑料瓶都值 0.25 欧，那是留子的回血神器。",
  "DB 延误超过 60 分钟可以申请赔偿，虽然流程慢，但那是你的权利。",
  "收到 广播电视费 (Rundfunkbeitrag) 的信千万别扔，不管你有没有电视都得交。",
  "在外管局延签，Termin 是可遇而不可求的，刷早位是留子的必修课。",
  "如果你在宿舍听到火警响了，大概率是哪位同学又在爆炒辣椒了。",
  "德语考试里的 'DSH 2' 或 'TestDaF 4x4' 是你开启留学生活的钥匙。",
  "德国的静音时段 (Ruhezeit) 通常是 22点到次日6点，别在这时候洗衣服。",
  "这里的面包真的很硬，但习惯了之后，你会发现这就是力量的源泉。",
  "看到 Hausmeister 记得微笑，他是你宿舍生活的实际掌权者。",
  "德国大学的 Mensa 虽然不一定好吃，但绝对是性价比最高的午餐选择。",
  "垃圾分类是德国人的宗教，分错垃圾可能会收到邻居的爱心小纸条。",
  "记得随身携带零钱，有些小店或者公厕（Sanifair）只收硬币。",
  "如果你要在德国骑自行车，记得一定要买个好锁，最好比车还贵。",
  "这里的冬天下午 4 点就天黑了，备好维生素 D 是留子的常识。",
  "德国的插座是欧标两圆孔，记得带好转换插头。",
  "遇到不确定的行政问题，直接发邮件说 'Mit freundlichen Grüßen' 总没错。",
  "在德国，‘半个小时以后’可能是指接下来的两小时。",
  "WG (合租房) 面试比找工作还难，展示你的整洁和厨艺是加分项。",
  "这里的自来水是可以直接喝的，虽然水垢 (Kalk) 可能会让你掉头发。",
  "记得下载 DB Navigator 软件，虽然它经常显示延误，但它是你的命根子。",
  "在德国，行人过马路一定要按那个黄色的小盒子，否则绿灯永远不来。",
  "周末的药店是轮班开门的，搜索 'Notapotheke' 寻找最近的一家。",
  "这里的二手交易平台 Kleinanzeigen 是淘便宜家具的好地方。",
  "如果你被邀请去德国人家里，记得一定要准时，哪怕早到一分钟也别迟到。",
  "德国人的‘诚实’有时候听起来很伤人。",
  "看到‘Keine Werbung’贴在信箱上，可以挡掉 90% 的废纸广告。",
  "这里的周日不只是超市关门，连装修、钻孔等发出噪音的行为都是违法的。",
  "如果你收到了德国人的赞美，通常那是真心的。",
  "在大学图书馆，占座离开超过 30 分钟你的东西会被挪走。",
  "这里的药妆店 DM 和 Rossmann 是留子的宝库，各种平价好物买不停。",
  "想要省钱？多去逛逛超市的‘即将过期’折价区，通常有 50% 的折扣。"
];

export const LOADING_MESSAGES = [
  "正在处理TK医保公函...",
  "DB列车正在由于天气原因（有云）延误中...",
  "正在等待外管局的Termin...",
  "正在周日关闭的超市门口沉思...",
  "正在图书馆抢座...",
  "正在试图读懂德语版电费账单...",
  "正在经历期末考前的第54次崩溃...",
  "正在试图分辨 Mülltrennung 的四种颜色...",
  "正在周日早上被邻居的静音期投诉...",
  "正在排队领取免费的 Mensa 剩饭...",
  "正在试图用 A1 水平解释为什么暖气坏了...",
  "正在法兰克福机场试图找到正确的出口...",
  "正在外管局门口凌晨三点排队...",
  "正在试图理解 Rundfunkbeitrag 的催款单...",
  "正在由于罢工而在火车站原地踏步...",
  "正在试图在一堆德语缩写中寻找真相...",
  "正在给教授发第十封催改论文的邮件...",
  "正在试图读懂 DB Navigator 上的替代路线...",
  "正在思考为什么这里的药店周日不开门...",
  "正在由于没带现金而无法在餐馆结账...",
  "正在试图通过 Youtube 学习如何修自来水管...",
  "正在由于 Hausmeister 的训斥而瑟瑟发抖...",
  "正在试图分清 Döner 里的所有酱汁名字...",
  "正在由于忘记按红绿灯盒子而等待地老天荒...",
  "正在试图在 Kleinanzeigen 上砍价 5 欧...",
  "正在经历由于缺少一个公章而导致的行政死循环...",
  "正在由于图书馆太冷而套上第三件毛衣...",
  "正在试图理解为什么星期天会有警察查噪音...",
  "正在由于 DB 延误而错过了人生中最重要的面试...",
  "正在思考要不要去搜集路边的空瓶子...",
  "正在试图读懂那份长达 20 页的租房合同...",
  "正在由于在静音车厢接电话而被全车人怒视...",
  "正在试图在超市货柜前分辨哪个是面粉哪个是淀粉..."
];
