// 完整的本地关卡数据库 - 无需 AI 生成
import { Scenario } from './types';

// AI图片生成提示词 - 每个场景的精确英文描述（用于Gemini图片生成）
// 注意：这些是文字描述，不是URL！AI会根据这些描述生成图片
export const IMAGE_PROMPTS = {
  // 第1章
  airport_winter: 'Frankfurt airport in winter, heavy snow falling, cold atmosphere, luggage, lonely traveler',
  hostel_dark: 'dark university dormitory hallway, empty and cold, dim lighting',
  government_building: 'German government building exterior, bureaucratic, imposing grey architecture',
  bank_interior: 'German bank interior, sterile, cold atmosphere, waiting area',
  insurance_office: 'insurance office, paperwork on desk, fluorescent lighting, depressing',
  supermarket_aisle: 'German supermarket aisle, cold lighting, empty and lonely',
  train_delay: 'German train station platform, delayed train, frustrated passengers waiting',
  canteen_gray: 'university cafeteria, grey atmosphere, unappetizing food',
  classroom_empty: 'empty German classroom, cold and unwelcoming',
  rainy_street: 'rainy German street, grey sky, puddles, lonely pedestrian',
  apartment_interview: 'WG apartment viewing, awkward interview situation, multiple people staring',
  bureaucracy: 'government office interior, paperwork piles, bureaucratic nightmare',
  lecture_hall_dark: 'large dark lecture hall, intimidating atmosphere, many empty seats',
  mailbox_letter: 'mailbox with official letters, bills, German paperwork',
  city_night_cold: 'German city at night, cold winter, empty streets, streetlights',
  
  // 第2章
  algorithm_chalkboard: 'complex algorithms on blackboard, mathematical formulas, overwhelming',
  library_stressed: 'university library, stressed students studying, books piled high, exhausted',
  train_station_panic: 'train station in panic, people running, delayed trains, chaos',
  thesis_writing: 'student writing thesis alone, laptop, coffee cups, exhausted, late night',
  expulsion_letter: 'official expulsion letter on desk, devastating news, close-up document',
  lab_accident: 'university laboratory, scientific equipment, accident scene, worried atmosphere',
  presentation_fear: 'presentation stage, spotlight, intimidating audience, fear perspective',
  exam_hall: 'large exam hall, rows of desks, students writing, tense atmosphere',
  plagiarism_meeting: 'professor office, serious meeting, accusation, uncomfortable confrontation',
  internship_rejection: 'rejection email on laptop screen, disappointed student, dark room',
  burnout_library: 'exhausted student collapsed in library, books everywhere, mental breakdown',
  semester_end: 'end of semester, winter landscape, tired student walking alone',
  
  // 第3章
  job_hunting: 'job hunting online, laptop with job applications, rejection emails, stress',
  restaurant_work: 'working in restaurant kitchen, exhausting work, harsh lighting',
  rent_bill: 'unpaid rent bills, overdue notices, financial stress, paperwork',
  ticket_check: 'train conductor checking ticket, confrontation, nervous passenger',
  noise_complaint: 'angry neighbor at door, noise complaint, conflict',
  winter_depression: 'winter depression, dark room, lonely person by window, grey sky outside',
  german_exam: 'German language exam paper, difficult questions, stress',
  stolen_bike: 'empty bike lock, stolen bicycle location, frustrated owner',
  inflation: 'expensive grocery receipt, empty wallet, financial crisis',
  visa_renewal: 'foreigner office, visa renewal stress, waiting in line, bureaucracy',
  language_exchange: 'awkward language exchange meeting in cafe, cultural barriers',
  supermarket_stress: 'overwhelmed in supermarket, confused about products, decision paralysis',
  moving_chaos: 'chaotic moving day, boxes everywhere, stressed person packing',
  work_limit: 'official warning letter about work hours exceeded, visa violation',
  crossroads: 'person at crossroads at night, difficult decision, uncertain future',
  
  // 第4章
  thesis_supervisor: 'thesis supervisor meeting, professor criticism, uncomfortable atmosphere',
  defense_preparation: 'thesis defense preparation, stressed student, presentation slides, anxiety',
  lab_disaster: 'laboratory disaster, failed experiment, months of work lost',
  phd_offer: 'PhD offer letter, difficult decision, contemplating future',
  tech_interview: 'technical job interview, whiteboard coding, pressure, interrogation',
  defense_night: 'night before thesis defense, exhausted student, final preparation, panic',
  train_delay_defense: 'train delay on defense day, panic, checking watch, desperate',
  graduation_certificate: 'university graduation certificate, achievement but bittersweet',
  work_visa: 'work visa application paperwork, bureaucracy, uncertain future',
  career_choice: 'person choosing between career paths, Germany vs home country',
  final_moving: 'final moving day, packing up German life, mixed emotions',
  first_salary: 'first salary payment notification, relief, small celebration',
  parents_visit: 'parents visiting Germany, showing them around, cultural differences',
  permanent_residence: 'permanent residence permit, official document, life-changing',
  new_chapter: 'new chapter beginning, looking at German cityscape, hopeful yet melancholic',
};

// ==================== 第1章：初抵德意志 (Ankommen) ====================
const CHAPTER_1_SCENARIOS: Scenario[] = [
  {
    id: '1-1',
    title: '法兰克福机场的冷风',
    description: '你把两只沉得像装了石头的行李箱拖出航站楼，金属拉杆在地面上发出刺耳的摩擦声。电子屏一排排红色“取消”，广播里的德语像雨点一样砸下来：罢工、停运、改线。夹着雪的冷风从衣领钻进脊背，你的手机电量只剩一格，手心却全是汗。你突然意识到：从这一刻开始，你需要用自己的选择，把这座陌生城市过成生活。',
    imagePrompt: IMAGE_PROMPTS.airport_winter,
    options: [
      {
        text: '咬牙叫车直奔宿舍（-60€）',
        resultDescription: '车门合上的瞬间，暖气像一块毯子盖住你。司机用带口音的英语和你闲聊，你只想把头靠在玻璃上。钱包确实瘦了一圈，但你保住了体温，也保住了今晚“能睡着”的可能。',
        statChanges: { money: -60, sanity: +5 }
      },
      {
        text: '守在站台等慢车，赌一把运气',
        resultDescription: '你在站台上站成一根冰冷的旗杆：两小时、三小时，列车信息一变再变，最后干脆变成“取消”。你还是叫了车，但已经晚了——喉咙像被砂纸磨过，鼻子开始发酸。你第一次直面“德国效率”的另一面：耐心会被消耗到见底。',
        statChanges: { money: -60, sanity: -20, delayCount: 1 }
      }
    ]
  },
  {
    id: '1-2',
    title: '宿舍的钥匙哪去了？',
    description: '宿舍楼的门禁像一张冷脸。你站在前台，湿掉的围巾贴在脖子上，前台工作人员用连珠炮一样的德语解释规则、签字、押金、以及那位“掌握钥匙命运”的管理员今天不在。你只抓住了两个词：明天、十点。你的行李在身后安静地立着，像在提醒你——你还没有家。',
    imagePrompt: IMAGE_PROMPTS.hostel_dark,
    options: [
      {
        text: '花120€住一晚青旅，先把今天熬过去',
        resultDescription: '你拖着行李走进热闹的大厅，听见各国语言交错。热水冲下来的那一刻，你差点想哭。价格刺痛，但至少你今晚能洗掉一路的疲惫，明天再来和这套规则较劲。',
        statChanges: { money: -120, sanity: -5 }
      },
      {
        text: '用蹩脚德语+手势求情，争取今晚能进门',
        resultDescription: '你把“刚到”“行李很重”“真的没地方去”一句句拼起来，语法错得离谱，眼神却很真。她沉默了几秒，翻出抽屉里一把备用钥匙，像是在给你一次试用期。你接过钥匙时，指尖都在抖。',
        statChanges: { sanity: +10 }
      }
    ]
  },
  {
    id: '1-3',
    title: 'Anmeldung 注册噩梦',
    description: '邮件像一记闷拳：两周内必须完成户口登记，否则后续一切都可能卡住。你打开预约网站，最早的时间在三个月后——屏幕上那行日期像一个冷笑话。你忽然明白，在这里，很多事不是“你想不想做”，而是“你能不能排到队”。',
    imagePrompt: IMAGE_PROMPTS.government_building,
    options: [
      {
        text: '凌晨5点去现场排队，赌当天的号',
        resultDescription: '天还没亮，街灯把你的影子拉得很长。队伍里的人抱着文件夹，呼出的白气一团团散开。你排了三小时才拿到号码，窗口前的工作人员用十分钟盖章、敲键盘、递回纸张——那张登记证明薄得像一片叶子，却重得像一张通行证。',
        statChanges: { sanity: -15 }
      },
      {
        text: '花150€找专业代办，把时间买回来',
        resultDescription: '你把材料交出去，像把一部分焦虑也交出去。钱花得肉痛，但你省下了清晨的寒风、漫长的等待和被德语淹没的无力感。你终于能把注意力放回“读书”这件事上。',
        statChanges: { money: -150, sanity: +10 }
      }
    ]
  },
  {
    id: '1-4',
    title: '德意志银行开户之旅',
    description: '学校要求提供本地银行账户才能完成注册。你坐在银行明亮却冰冷的大厅里，号码牌跳得很慢，空气里有打印机的热味。轮到你时，对方列出一串材料：登记证明、学生身份、护照、居留许可。你想解释：居留许可又要求银行账户——像一条咬住自己尾巴的蛇。',
    imagePrompt: IMAGE_PROMPTS.bank_interior,
    options: [
      {
        text: '把“死循环”讲清楚，硬着头皮争取通融',
        resultDescription: '你把流程一层层拆开讲给他听，讲到自己都想笑。对方沉默片刻，叹气说这事并不少见，最后允许你用入学相关材料先开账户。那一刻，你第一次觉得“规则”也可能有缝隙。',
        statChanges: { sanity: -10 }
      },
      {
        text: '改走线上流程，先把账户弄出来',
        resultDescription: '你对着手机一步步完成身份验证，镜头里你的脸疲惫得像刚跑完马拉松。十分钟后账户就出现了——不够体面，但足够实用。你学会了留学生第一课：先活下去，再讲究。',
        statChanges: { sanity: +5 }
      }
    ]
  },
  {
    id: '1-5',
    title: '公立保险注册',
    description: '在这里读书必须有保险。你走进保险机构的办公室，白炽灯把每个人的脸照得苍白。工作人员几乎不说英语，你的德语只够点菜，面对“合同、保费、报销、起保日期”这些词，像站在一堵高墙前。',
    imagePrompt: IMAGE_PROMPTS.insurance_office,
    options: [
      {
        text: '硬着头皮用翻译工具+手势沟通，把流程走完',
        resultDescription: '你一边把句子塞进翻译工具，一边用手比划“学校”“学生”“从什么时候开始”。对方皱着眉，但还是把表格推到你面前。尴尬几乎要把你压扁，不过最后你签下名字——每月110欧，像一张“你正式在这里生活”的发票。',
        statChanges: { sanity: -15, money: -110 }
      },
      {
        text: '回去找会德语的学长带你跑一趟',
        resultDescription: '学长把你的情况用标准德语讲得清清楚楚，工作人员的表情瞬间柔和下来。十分钟搞定。你松了一口气，也在心里记下：在异国他乡，人情往往比教程更有用——你欠他一顿饭。',
        statChanges: { sanity: -5, money: -110 }
      }
    ]
  },
  {
    id: '1-6',
    title: '超市的垃圾分类学问',
    description: '第一次采购，你在收银台前手忙脚乱：有些瓶子会多收0.25欧押金，收据长得像论文。回到宿舍，楼下四个不同颜色的桶像四道选择题：黄、蓝、棕、黑。你盯着手里的塑料包装、纸盒和厨余，突然意识到连“扔垃圾”都需要学习。',
    imagePrompt: IMAGE_PROMPTS.supermarket_aisle,
    options: [
      {
        text: '先乱扔再说，反正今晚太累了',
        resultDescription: '你把一切塞进同一个桶，回房间就倒在床上。第二天门上贴着一张字迹用力的纸条，你看不懂全部，但“请遵守”“不可以”这类词像针一样扎眼。你开始明白：这里的规则，会以邻居的方式追上你。',
        statChanges: { sanity: -10 }
      },
      {
        text: '花时间对照规则，把它当成“入门考试”',
        resultDescription: '你对着指示牌逐项核对：塑料进黄桶、纸进蓝桶、有机进棕桶、剩下进黑桶。半小时像做了一套阅读理解，但你完成了。室友看你认真得可爱，笑着说你是“融入模范”。你第一次因为一件小事感到踏实。',
        statChanges: { sanity: +5 }
      }
    ]
  },
  {
    id: '1-7',
    title: '第一次坐德铁',
    description: '你要去另一个城市参加新生活动，买了一张看起来很划算的通票。上车后才发现：这张票不能坐快车。检票员的眼神像扫描仪，从你的票扫到你的脸，冷冷一句：补票或罚款。你握着那张薄薄的纸，心里发凉。',
    imagePrompt: IMAGE_PROMPTS.train_delay,
    options: [
      {
        text: '乖乖认罚，当作在德国上的第一堂“规则课”',
        resultDescription: '你把60欧交出去，心里像被挖走一块。对方还用缓慢却不容置疑的语气讲了五分钟票务规则。你点头、道歉、微笑，内心却在默背：下次先查清楚，别再用钱买教训。',
        statChanges: { money: -60, sanity: -20 }
      },
      {
        text: '放下自尊解释自己是新来的留学生，争取一点余地',
        resultDescription: '你用并不流利的德语说自己刚到、看不懂条款、愿意补票。检票员看了你几秒，像在权衡什么，最后只让你补正常票差价。你松了口气，像从窄门里挤出来。',
        statChanges: { money: -30, sanity: -10 }
      }
    ]
  },
  {
    id: '1-8',
    title: 'Mensa初体验',
    description: '学校食堂据说是最省钱的选择。你端着托盘站在菜单板前，菜名全是德语缩写，像密码一样。身后队伍越来越近，你能听见轻轻的叹气声，像压力计一点点上升。',
    imagePrompt: IMAGE_PROMPTS.canteen_gray,
    options: [
      {
        text: '随便指一个“炸肉排”，先吃到再说',
        resultDescription: '你像下赌注一样把手指点过去。端上来的盘子冒着热气：炸肉排配土豆泥，简单但可靠。只要4.5欧，你突然觉得自己也许能在这里过下去——至少在“吃饭”这一关。',
        statChanges: { money: -5, sanity: +5 }
      },
      {
        text: '紧张到撤退，去隔壁买一份烤肉卷',
        resultDescription: '烤肉卷很香，热量像安慰一样落在胃里。但7欧也真实地落在账本上。你突然意识到：如果每次都靠“更贵的确定性”逃离不确定，你会先被生活费击倒。',
        statChanges: { money: -7, sanity: -5 }
      }
    ]
  },
  {
    id: '1-9',
    title: '语言班的抉择',
    description: '学校有免费的德语强化班，可时间恰好压在你的专业课上。你的德语还停留在“你好、谢谢、我要这个”的层级，而选课系统冷冰冰写着：许多课程建议至少B2。你像站在两条轨道之间：一条通向“看得懂”，一条通向“赶得上”。',
    imagePrompt: IMAGE_PROMPTS.classroom_empty,
    options: [
      {
        text: '先把德语拉上来：短痛换长稳',
        resultDescription: '你把时间砸进语法、听力和口语里，日常对话终于不再像噪音。三个月后你通过了B2，却也错过了一些核心专业内容——你把学分的压力推迟到了下学期，但你知道这是为了更长远的路。',
        statChanges: { sanity: -10, ects: -5 }
      },
      {
        text: '专业课优先：德语靠自学硬扛',
        resultDescription: '你把自己绑在专业课的节奏上，德语靠碎片时间慢慢啃。进步很慢，偶尔也会被一句听不懂的公告击溃，但学分在一点点增长。你选择了当下能抓住的东西。',
        statChanges: { ects: +10, sanity: -5 }
      }
    ]
  },
  {
    id: '1-10',
    title: '周日的孤独',
    description: '周日，你想去补点食物，却发现整座城市像按下了静音键：商店拉着铁门，街上空得发凉。冰箱里只剩三片黑面包和一罐酸黄瓜。雨水贴在窗上，你听见自己的呼吸比平时更响——孤独不是情绪，是一种环境。',
    imagePrompt: IMAGE_PROMPTS.rainy_street,
    options: [
      {
        text: '点外卖：用钱换一份热气',
        resultDescription: '你盯着外卖App反复犹豫，最后还是按下确认。18欧，换来一盒冒着热气的食物。你吃得很慢，像在把自己从那种无声的空洞里一点点拽出来。',
        statChanges: { money: -18, sanity: -5 }
      },
      {
        text: '啃黑面包：把今天忍过去',
        resultDescription: '黑面包硬得像一块石头，你一口一口咬下去，像在咬碎一种现实。雨一直下，你想起家乡随时能买到的热饭、亮着灯的便利店，胃是饱的，心却更空了。',
        statChanges: { sanity: -20 }
      }
    ]
  },
  {
    id: '1-11',
    title: 'WG面试的尴尬',
    description: '宿舍贵得像在烧钱，你决定去找合租房。第一次“合租面试”比你想象更像审讯：五个室友坐成一排，杯子里是冷掉的咖啡，他们轮流问你作息、打扫、做饭、社交——像在确认你是否会成为他们生活里的麻烦。',
    imagePrompt: IMAGE_PROMPTS.apartment_interview,
    options: [
      {
        text: '老实说：我安静、边界感强，但会守规则',
        resultDescription: '他们点头、微笑，像在礼貌地收起你的真诚。最后那句“我们会再联系你”轻得像空气，却清楚得像结论。你走出门时，楼道里回声很长。',
        statChanges: { sanity: -15 }
      },
      {
        text: '戴上社交面具：我很合群，也愿意一起活动',
        resultDescription: '他们的眼睛亮了一下，气氛突然松动，甚至开始聊起周五的聚会。你当场被“录用”：房租450欧/月，押金900欧。你笑着点头，心里却在计算：这份“合群”，你能演多久。',
        statChanges: { money: -1350, sanity: -10 }
      }
    ]
  },
  {
    id: '1-12',
    title: '办居留许可的噩梦',
    description: '你终于抢到外管局的预约号，像抢到一张演唱会门票。可现场比想象更冷：湿外套的味道、塑料椅、此起彼伏的叹气。排了三小时后，窗口里的工作人员抬眼扫过你的材料，冷冰冰一句：资金证明不够，冻结账户里需要11208欧。',
    imagePrompt: IMAGE_PROMPTS.bureaucracy,
    options: [
      {
        text: '紧急联系家里补齐资金，把缺口堵上',
        resultDescription: '你在走廊里拨通家里的电话，声音压得很低，心却跳得很快。父母很快转来5000欧，你凑够了数字，却听见对方说：材料完整了也不行——下次预约三个月后，请重新排队。你站在原地，像被按下暂停键。',
        statChanges: { money: +5000, sanity: -30 }
      },
      {
        text: '试图解释：我已缴学费、有住宿、有计划',
        resultDescription: '你把自己的计划讲得很认真：学费、课程、住宿、未来。她只重复一句：规定就是规定。你收起材料离开，走廊的灯光像一条漫长的隧道。你第一次感到“合法居留”不是身份，是一道要反复闯的关卡。',
        statChanges: { sanity: -40 }
      }
    ]
  },
  {
    id: '1-13',
    title: '第一次听德语授课',
    description: '第一节专业课，你坐在阶梯教室里，桌面还残留着前排同学的铅笔灰。教授开口的那一刻你就知道完了：德语像高速列车，术语像路标一闪而过。你同桌的本地学生笔记写得飞快，你的笔尖却像被冻住，只能抄下零碎的词。',
    imagePrompt: IMAGE_PROMPTS.lecture_hall_dark,
    options: [
      {
        text: '硬听到底，课后礼貌开口借笔记',
        resultDescription: '你坚持把整节课坐完，听懂三成也算胜利。下课后你鼓起勇气开口，对方意外地友好，递给你笔记，还顺手加了联系方式。你突然觉得：也许不是所有门都紧闭。',
        statChanges: { sanity: -15, ects: +2 }
      },
      {
        text: '放弃现场听懂，转而课后用英文教材自救',
        resultDescription: '你把课堂当成“熟悉术语发音”的背景音，课后靠英文教材一点点啃。进度慢得像爬坡，但至少每一页都看得懂。你选择了更稳的路线，只是更孤独。',
        statChanges: { sanity: -20, ects: +1 }
      }
    ]
  },
  {
    id: '1-14',
    title: 'Rundfunkbeitrag的催款信',
    description: '信箱里躺着一封厚厚的官方信，纸张硬得像警告。内容很简单：请注册并缴纳广播电视费。你甚至没有电视，却仍要每月交钱。你盯着那串金额，第一次感到“生活的固定成本”像一张看不见的网。',
    imagePrompt: IMAGE_PROMPTS.mailbox_letter,
    options: [
      {
        text: '乖乖注册缴费：把麻烦变成常态',
        resultDescription: '你按流程注册，绑定扣款。每月的那笔钱像一颗小石子，持续落进你的生活里。你不喜欢，但你也明白：在这里，有些费用不是“买不买”，而是“承不承认自己住在这里”。',
        statChanges: { money: -55, sanity: -5 }
      },
      {
        text: '假装没看到：把信丢进垃圾桶',
        resultDescription: '你把信揉成一团丢掉，像在丢掉麻烦。可接下来的三个月，催缴信越来越多，语气越来越硬，最后甚至提到法律程序。你开始在每次开信箱时心跳加速——逃避把成本翻倍地还给你。',
        statChanges: { sanity: -25 }
      }
    ]
  },
  {
    id: '1-15',
    title: '第一个学期的中期总结',
    description: '不知不觉，两个月过去了。你学会了在雨里赶车、在表格里找关键信息、在陌生语言里抓住自己。余额在下降，体重也在下降，但你开始在某些瞬间感到“我好像可以”。你站在十字路口：要不要给自己一点喘息，还是把一切都押在学业上？',
    imagePrompt: IMAGE_PROMPTS.city_night_cold,
    options: [
      {
        text: '给自己放个假：去柏林换一口空气',
        resultDescription: '夜班大巴的座椅不舒服，但窗外的城市灯火像另一种现实。你走过博物馆岛，站在勃兰登堡门前，第一次不是在“解决问题”，而是在“看见世界”。花了200欧，却把精神从谷底拉上来。',
        statChanges: { money: -200, sanity: +30, level: 1 }
      },
      {
        text: '继续埋头苦学：把安全感押在考试上',
        resultDescription: '你把娱乐全部按下暂停，像把情绪也一起关掉。图书馆的灯光陪你到很晚，你靠咖啡和意志把自己撑住。两门课的学分到手，像两枚勋章，但你也知道：这条路会很累。',
        statChanges: { ects: +12, sanity: -10, level: 1 }
      }
    ]
  }
];

// ==================== 第2章：课堂厮杀 (Kampf im Hörsaal) ====================
const CHAPTER_2_SCENARIOS: Scenario[] = [
  {
    id: '2-1',
    title: 'Schmidt教授的杀手课',
    description: '开学第一周，你就听见无数次那门课的名字，像听见一座山的回声。教室里座无虚席，空气里是湿外套和焦虑的味道。教授站在讲台前，像宣布判决一样平静：平均只有三成能通过。剩下的人，要么重修，要么转向更“温柔”的道路。你低头看着课表，突然明白这学期的难度不是“忙”，而是“被迫长出一副更硬的骨头”。',
    imagePrompt: IMAGE_PROMPTS.algorithm_chalkboard,
    options: [
      {
        text: '迎难而上：拉起学习小组，把孤独拆开',
        resultDescription: '你主动开口，把三个人从各自的焦虑里拉出来。你们约定每周三次图书馆刷题、互相讲解。进度仍然艰难，但“难”被分摊后不再像绝境——至少你不是一个人对着黑板发抖。',
        statChanges: { sanity: -20, ects: +6 }
      },
      {
        text: '在截止日前退课：先保命，再谈理想',
        resultDescription: '你在系统里点下“退课”的那一刻，心跳突然慢了半拍。你换了一门更稳的课程，风险小很多。可当你合上电脑，依旧会想：我是在做理性选择，还是在用安全感给自己找借口？',
        statChanges: { sanity: +10, ects: +3 }
      }
    ]
  },
  {
    id: '2-2',
    title: '小组作业的地狱',
    description: '项目占总成绩40%，一句话把所有人都钉在了同一条绳上。你被随机分到一个四人组，另外三位本地同学交流飞快，群聊里满屏德语缩写、表情和俚语。你每次点开消息，都像打开一段加密文本：你知道自己必须跟上，否则你会在“分工”和“决定”里被悄悄抛下。',
    imagePrompt: IMAGE_PROMPTS.library_stressed,
    options: [
      {
        text: '请求改用英语：把规则摆到桌面上',
        resultDescription: '他们口头上表示理解，开会时也会切换到英语，但讨论兴奋起来又会自然滑回德语。你总慢半拍，关键决策像从你指缝里漏过去。你努力追赶，却常常只赶上结论。',
        statChanges: { sanity: -20, ects: +4 }
      },
      {
        text: '咬牙学德语：用两小时换一次“听懂”',
        resultDescription: '你把俚语和学术表达写满小本子，睡前也在默念。两周后，你终于能在他们飞快的讨论里抓住关键句。组员开始把你当成“真正的成员”，而不只是“需要照顾的人”。',
        statChanges: { sanity: -25, ects: +6 }
      }
    ]
  },
  {
    id: '2-3',
    title: '图书馆占座大战',
    description: '期末像乌云压下来，图书馆成了唯一的避难所。早上七点开门前，门口队伍已经拐过转角，有人裹着围巾站在晨雾里，像在排队等一场救赎。你看着玻璃门后的空座位，突然理解：在这里，“学习”不只是努力，还是抢资源。',
    imagePrompt: IMAGE_PROMPTS.library_stressed,
    options: [
      {
        text: '加入早起大军：用睡眠换座位',
        resultDescription: '你每天凌晨六点出门，像去打工一样去排队。你抢到座位，也抢到一整天的专注，但睡眠被榨得只剩五小时。一周后，你开始在书页上点头，眼皮像铅块。',
        statChanges: { sanity: -30, ects: +8 }
      },
      {
        text: '留在宿舍自习：用妥协换体力',
        resultDescription: '你省下了排队的时间，却把自己交给噪音：隔壁的音乐、楼上的电钻、走廊里来回的脚步声。你努力集中，但效率像漏气的轮胎，只剩图书馆的一半。',
        statChanges: { sanity: -15, ects: +4 }
      }
    ]
  },
  {
    id: '2-4',
    title: '考试当天的德铁延误',
    description: '今天的考试价值12 ECTS，像一块压在胸口的石头。你提前一小时出门，甚至把备用路线都在脑子里走了一遍。可站台屏幕忽然跳出通知：信号故障，延误至少60分钟。你看着时间一分一秒过去，感觉每一秒都在往你未来的学分上刮刀。',
    imagePrompt: IMAGE_PROMPTS.train_station_panic,
    options: [
      {
        text: '花80€叫车冲刺：把钱包当作救生圈',
        resultDescription: '你把地址递给司机，语气像在请求命运通融。车在雨里穿行，你手指一直捏着手机。你在开考前五分钟冲进考场，浑身大汗，心跳还没降下来——但你没有错过。',
        statChanges: { money: -80, sanity: -25, ects: +12, delayCount: 1 }
      },
      {
        text: '放弃冲刺，收集证据申请补考',
        resultDescription: '你拍下屏幕、保存通知、甚至录下广播，像在收集“我不是故意的”证据。你提交补考申请，却被告知时间在下学期——这学期的学分像被抽走。你站在站台上，第一次感到无力比焦虑更可怕。',
        statChanges: { sanity: -40, delayCount: 1 }
      }
    ]
  },
  {
    id: '2-5',
    title: 'Hausarbeit的噩梦',
    description: '你需要提交一篇30页的德语学术论文。你能勉强写出B2级别的句子，但教授想要的是C1：逻辑严密、用词精准、语气克制。你盯着空白文档，光标一闪一闪，像在嘲笑你“还没准备好”。',
    imagePrompt: IMAGE_PROMPTS.library_stressed,
    options: [
      {
        text: '花300€找母语者润色：把语言短板交给专业',
        resultDescription: '对方把你的句子拆开重组，语法像被抛光，表达更像学术写作。你看着修改痕迹，既感激又心酸——原来你想说的东西，一直卡在语言里。最终成绩不错，至少你不用再为“表达不够像学术”失眠。',
        statChanges: { money: -300, sanity: -10, ects: +8 }
      },
      {
        text: '自己硬写：靠翻译工具和无数次重写撑过去',
        resultDescription: '你写了三周，反复查词、改句子、对照参考文献，把每一段都磨到发白。你知道它不完美，但它是你“亲手交出来的”。最终勉强及格，你像从水里爬上岸——狼狈，却活着。',
        statChanges: { sanity: -35, ects: +5 }
      }
    ]
  },
  {
    id: '2-6',
    title: 'Exmatrikulation警告',
    description: '邮箱里那封正式邮件没有多余情绪，却让你胃里一沉：连续两个学期平均分低于及格线，你面临被开除的风险。你盯着“Exmatrikulation”这个词，像盯着一道裂缝——它可能把你辛苦搭起来的一切直接撕开。',
    imagePrompt: IMAGE_PROMPTS.expulsion_letter,
    options: [
      {
        text: '立刻去学业咨询：把问题摊开、把路找出来',
        resultDescription: '你坐在咨询办公室里，把成绩单像病历一样摊开。辅导员冷静分析，建议你减少选课，专注核心课程，给自己一学期缓冲期。你走出来时仍然焦虑，但至少有了“下一步”。',
        statChanges: { sanity: -30 }
      },
      {
        text: '拼命刷分：用极限学习把自己拉回及格线',
        resultDescription: '你把社交、娱乐、甚至睡眠都砍掉，每天学习16小时。补考那天你眼睛发干，手却稳。你拿到及格分数，暂时保住学籍——代价是你像被掏空了一半。',
        statChanges: { sanity: -50, ects: +10 }
      }
    ]
  },
  {
    id: '2-7',
    title: '实验室的意外',
    description: '实验课开始前，助教用德语快速说明安全要点。你只听懂零星几个词，点头点得很用力。几分钟后，一次误操作让反应瓶冒出异常的泡沫和刺鼻气味，助教脸色瞬间变冷：你差点把整个台面变成事故现场。重修的要求落下来，像一记响亮的耳光。',
    imagePrompt: IMAGE_PROMPTS.presentation_fear,
    options: [
      {
        text: '诚恳道歉并请求补救：把姿态放到最低',
        resultDescription: '你立刻道歉，承认自己没听懂却硬撑，提出愿意补做所有步骤。助教仍然严厉，但给了你一次额外机会——周六加班完成。你知道这次要靠行动把信任一点点补回来。',
        statChanges: { sanity: -20, ects: +3 }
      },
      {
        text: '直接退课：把损失控制在可承受范围',
        resultDescription: '你选择退课，至少不会留下挂科记录。但当你在系统里确认的那一刻，你也同时把毕业时间往后推了一格。你不是没努力，你只是输给了语言和时机。',
        statChanges: { sanity: -10 }
      }
    ]
  },
  {
    id: '2-8',
    title: '口语展示的崩溃',
    description: '你要用德语做20分钟展示。你练习了一周，PPT翻页顺序背得滚瓜烂熟。可站上讲台的瞬间，灯光照在你脸上，台下几十双眼睛像潮水一样涌来——你的大脑突然变成一片白墙，连第一句开场都找不到。',
    imagePrompt: IMAGE_PROMPTS.presentation_fear,
    options: [
      {
        text: '硬着头皮讲完：把尊严和成绩都撑住',
        resultDescription: '你强迫自己把词一个个挤出来，句子断断续续，喉咙像塞了沙。你讲完了，台下没有掌声，但也没有嘲笑。教授给了你刚好及格的分数，还丢下一句带刺的“鼓励”。你笑着点头，心里却发誓：下次不再这样。',
        statChanges: { sanity: -25, ects: +3 }
      },
      {
        text: '中途崩溃离场：让情绪先救你',
        resultDescription: '你站在讲台上，眼眶突然发热，声音断掉。你放下遥控器冲出教室，走廊的冷风像把你按回现实。成绩记零分，你需要重修——代价很大，但至少你没有当场碎掉。',
        statChanges: { sanity: -50 }
      }
    ]
  },
  {
    id: '2-9',
    title: 'Klausur的临时换题',
    description: '考试前一天晚上，教授邮件弹出来：内容有变，新增三个章节。你盯着那几行字，像盯着一张临时改签的机票——所有复习计划瞬间失效。你的心里先是空，然后是怒，最后只剩一句：怎么办？',
    imagePrompt: IMAGE_PROMPTS.library_stressed,
    options: [
      {
        text: '通宵硬啃新章节：用咖啡因和意志顶住',
        resultDescription: '你用咖啡和能量饮料把自己钉在椅子上，学到凌晨五点。第二天考试时你眼睛发涩、手指发抖，但你勉强把题写完。你知道这不是学习，这是求生。',
        statChanges: { sanity: -40, ects: +5 }
      },
      {
        text: '战略性放弃：把精力留给能赢的战场',
        resultDescription: '你合上书，决定不把自己赌在一场不公平的临时战役里。你把精力转向其他考试，至少还能保住整体战线。但这门课的学分这学期注定拿不到，你心里像少了一块。',
        statChanges: { sanity: -15 }
      }
    ]
  },
  {
    id: '2-10',
    title: '同学的笔记丢失事件',
    description: '你一直依赖一位同学的笔记，那些清晰的结构和关键词像救命绳。可考试前一周，他的笔记本被偷了——你听见这个消息时，脑子里只剩下“完了”。你的复习计划像拼好的积木，被人一脚踢散。',
    imagePrompt: IMAGE_PROMPTS.expulsion_letter,
    options: [
      {
        text: '紧急求助：把脸皮当作资源',
        resultDescription: '你在群里发消息、私聊、道歉、感谢，像在四处借火。最后有几个人分享了电子笔记，质量参差不齐，但至少你有了重新搭建复习框架的材料。',
        statChanges: { sanity: -20, ects: +4 }
      },
      {
        text: '硬着头皮去教授答疑时间：直面权威求一条路',
        resultDescription: '教授有些惊讶你直接找上门，但还是给了你一份核心知识点的梳理。你拿着那几条要点，像拿着地图穿过迷雾。你知道它不等于笔记，但它足够救你一命。',
        statChanges: { sanity: -15, ects: +6 }
      }
    ]
  },
  {
    id: '2-11',
    title: 'Mündliche Prüfung的恐惧',
    description: '这门课的考核是口试：十五分钟，在教授面前，用德语回答专业问题，不能带任何笔记。你想象自己卡壳的样子，手心立刻出汗。书本上的知识是静态的，可口试像把你扔进水里——会不会游泳，当场就知道。',
    imagePrompt: IMAGE_PROMPTS.thesis_supervisor,
    options: [
      {
        text: '疯狂练习表达：把专业术语练成肌肉记忆',
        resultDescription: '你找伙伴每天练两小时，把专业术语说到舌头发麻。考试那天你依旧紧张，但当问题落下，你至少能开口、能把逻辑说完。你不是天赋型，但你靠练习把自己推过了门槛。',
        statChanges: { sanity: -30, ects: +7 }
      },
      {
        text: '试图申请改笔试：赌一次“规则例外”',
        resultDescription: '教授拒绝了你，语气像盖章：规定就是口试。你只能回去准备，带着更大的压力硬扛。最终你勉强通过，但你知道自己是擦着边缘走过来的。',
        statChanges: { sanity: -40, ects: +5 }
      }
    ]
  },
  {
    id: '2-12',
    title: '论文抄袭误会',
    description: '你提交的论文被系统标记“高重复率”。教授约你谈话，那封邮件像一张传票。你知道自己不是抄袭，只是引用太多、格式混乱，但在“学术规范”面前，解释听起来总像借口。',
    imagePrompt: IMAGE_PROMPTS.thesis_supervisor,
    options: [
      {
        text: '逐条解释来源并补全格式：用证据说话',
        resultDescription: '你把每一处引用的来源整理成清单，逐条对照，补全格式。过程像自证清白，漫长而难堪。最终教授接受了你的解释，你也更清楚：在这里，规范不是“建议”，是底线。',
        statChanges: { sanity: -30, ects: +5 }
      },
      {
        text: '慌乱承认“无意为之”：把主动权交出去',
        resultDescription: '你的紧张反而像“心虚”，教授的怀疑更重。最后你被要求重写一篇全新论文，原分数作废。你走出办公室时，感觉自己不仅丢了时间，还丢了尊严。',
        statChanges: { sanity: -50, ects: -5 }
      }
    ]
  },
  {
    id: '2-13',
    title: '实习证明的死循环',
    description: '有些课程要求实习经历才能选修，而你找实习时又被问：相关课程学分呢？你像被困在一条环形跑道上，怎么跑都回到原点。你开始明白，现实里的门槛常常不是能力，是“你有没有被允许进来”。',
    imagePrompt: IMAGE_PROMPTS.thesis_supervisor,
    options: [
      {
        text: '找学长帮忙内推：走一条更现实的路',
        resultDescription: '学长把你的简历递进一家公司，绕过了最苛刻的筛选。虽然没有工资，但你拿到了实习证明。你有点不甘心，却也更清楚：很多机会，从来不是公开发放的。',
        statChanges: { sanity: -10, workCount: 1 }
      },
      {
        text: '调整方向：避开死循环，保住进度',
        resultDescription: '你把课程计划重新洗牌，绕开需要实习证明的路径。进度稳了，但你也知道自己错过了一些热门领域。你不是不想要，只是此刻你要先把自己送到终点。',
        statChanges: { sanity: -15 }
      }
    ]
  },
  {
    id: '2-14',
    title: 'Semester末的崩溃边缘',
    description: '期末周像一场围剿：三门考试、两篇论文、一个小组项目，日历被红色截止日期塞满。你连续一周每天只睡三小时，镜子里的人眼下发青，语气变得尖。你开始怀疑自己不是在学习，而是在被消耗。',
    imagePrompt: IMAGE_PROMPTS.library_stressed,
    options: [
      {
        text: '全部硬扛：把自己当机器开到报废边缘',
        resultDescription: '你靠咖啡和意志力把自己撑成一台机器，任务一个个打勾。你完成了全部，却发现内心像被抽空，情绪反应迟钝得像坏掉的传感器。你知道自己赢了分数，却输了一部分自己。',
        statChanges: { sanity: -45, ects: +18 }
      },
      {
        text: '战略性放弃：用少一点学分换可持续的自己',
        resultDescription: '你退掉最难的那门课，把精力集中在能拿到的成果上。学分少了，但你终于能睡一觉。你开始理解：在长期战里，能走到最后的人，不一定每一场都赢。',
        statChanges: { sanity: -20, ects: +12 }
      }
    ]
  },
  {
    id: '2-15',
    title: '学期结束的反思',
    description: '第二学期结束了。你拿到一些学分，也付出巨大精神代价：睡眠被剥夺、情绪被压缩、语言像一堵墙反复撞你。你开始怀疑自己是否适合继续走下去——不是因为不努力，而是因为你不知道这份努力会把你带向哪里。',
    imagePrompt: IMAGE_PROMPTS.crossroads,
    options: [
      {
        text: '回国休息两周：把自己送回“能呼吸的地方”',
        resultDescription: '你买了机票，落地的那刻像把肺重新充满空气。熟悉的语言、熟悉的食物、熟悉的拥抱，让你重新充电。花了1200欧，但你把自己从崩溃边缘拉回来了。',
        statChanges: { money: -1200, sanity: +50, chapter: 1, level: 1 }
      },
      {
        text: '留在德国找兼职：换一点现金流',
        resultDescription: '你选择留下来，去做学生工。你终于能靠自己补一点生活费。你累得更具体了，也更现实了。',
        statChanges: { money: +1500, sanity: -10, workCount: 1, chapter: 1, level: 1 }
      }
    ]
  }
];

// ==================== 第3章：生存之道 (Überleben) ====================
const CHAPTER_3_SCENARIOS: Scenario[] = [
  {
    id: '3-1',
    title: '实习申请的马拉松',
    description: '为了毕业，你必须完成六个月的强制实习。你把简历投出去像扔漂流瓶：五十份，三封拒信，剩下的是沉默。每一次刷新邮箱都像把手伸进冰水里——你知道很可能什么也抓不到，但你还是要伸。',
    imagePrompt: IMAGE_PROMPTS.thesis_supervisor,
    options: [
      {
        text: '继续投递，扩大范围：把拒绝当作背景噪音',
        resultDescription: '你又投了三十份，终于收到一家小公司的面试邀请。工资不高，但至少是“有回应”。你把它当作第一块落脚石：先站稳，再往上爬。',
        statChanges: { sanity: -20, money: +450, workCount: 1 }
      },
      {
        text: '找教授要推荐信',
        resultDescription: '教授在信里用几句话替你背书，像给你的简历装上一盏灯。你很快拿到一家中型企业的面试与录用——你第一次体会到：在体系里，认可会像通行证一样打开门。',
        statChanges: { sanity: -10, money: +800, workCount: 1 }
      }
    ]
  },
  {
    id: '3-2',
    title: '黑工的诱惑',
    description: '一个熟人转来消息：餐厅缺人，10欧/小时，现金结算，立刻上岗。你盯着屏幕，肚子先替你点头——账单、房租、生活费都在逼你。但你也知道，一旦被查到，签证的天平会立刻倾覆。',
    imagePrompt: IMAGE_PROMPTS.restaurant_work,
    options: [
      {
        text: '拒绝：把风险挡在门外',
        resultDescription: '你按下拒绝，像关上了一扇“方便但危险”的门。钱包继续紧，但你至少能睡得更踏实——你不想让自己辛苦争取的居留，被一份现金工资毁掉。',
        statChanges: { sanity: +10 }
      },
      {
        text: '接受：先把钱赚到手再说',
        resultDescription: '你周末站在后厨，水汽和油烟糊住眼镜，手指被洗洁精泡得发白。钱确实来了——但你每次在街上看到制服，都下意识缩肩。你赚到的是现金，也是一份持续的紧张。',
        statChanges: { money: +1500, sanity: -20, workCount: 3 }
      }
    ]
  },
  {
    id: '3-3',
    title: '租房合同的陷阱',
    description: '房东的邮件来得很“礼貌”：暖气费暴涨，需要补缴600欧。你翻出合同，密密麻麻的条款里确实藏着这一句，只是当时你没看懂，也没敢问。现在它像一颗迟到的子弹，正中你的预算。',
    imagePrompt: IMAGE_PROMPTS.moving_chaos,
    options: [
      {
        text: '咬牙付钱：用贫穷换平静',
        resultDescription: '你把钱转出去，像把一块肉割走。接下来两个月你开始算到每一顿饭：面、蛋、最便宜的菜。你买到的是“不会被催缴”的平静，代价是生活质量。',
        statChanges: { money: -600, sanity: -25 }
      },
      {
        text: '找租客保护协会咨询：把条款翻译成武器',
        resultDescription: '律师把合同逐条拆解，指出房东的计算有误。你第一次觉得自己不是“被动挨打”。最终金额降到400欧——你付的钱更少，心里的底气更多。',
        statChanges: { money: -400, sanity: -15 }
      }
    ]
  },
  {
    id: '3-4',
    title: 'Semesterticket的BVG查票',
    description: '你坐地铁时忘了带学生证，偏偏遇到查票。你明明有有效的学期交通票，可对方的规则像刀一样干净：没有实体证件=无效。你站在车厢里，所有人的目光都像轻微的压力，把你逼得更喘不过气。',
    imagePrompt: IMAGE_PROMPTS.ticket_check,
    options: [
      {
        text: '当场交60€罚款：用钱结束争执',
        resultDescription: '你交钱签字，争执立刻结束，但心里像吞了硬币：你不是逃票，只是忘带证件。你把这次当作“记忆税”，以后出门会下意识摸一摸钱包。',
        statChanges: { money: -60, sanity: -15 }
      },
      {
        text: '坚持申诉：让规则看到你的证据',
        resultDescription: '你要求写申诉，回去补交电子学生证、票据截图、说明信。你成功免罚，但耗掉两周时间和大量精力。你明白了：在这里，正确不一定省事。',
        statChanges: { sanity: -20 }
      }
    ]
  },
  {
    id: '3-5',
    title: 'WG Party的噪音投诉',
    description: '周五晚上室友们兴致高涨，音乐震得杯子都在抖。凌晨一点，门铃响得像警报——警察站在门口，楼下老太太投诉你们扰民。你看见室友脸上的酒意一点点退下去，只剩尴尬和不服。',
    imagePrompt: IMAGE_PROMPTS.noise_complaint,
    options: [
      {
        text: '立刻道歉并结束：保住底线',
        resultDescription: '你主动道歉、关掉音乐、把人送走。警察只口头警告，没有罚单。室友嫌你扫兴，但你心里清楚：在异国他乡，少一次麻烦就是一次胜利。',
        statChanges: { sanity: -10 }
      },
      {
        text: '争辩“周五没那么严格”：赌一次嘴硬',
        resultDescription: '你们试图争辩，警察的语气更冷：可以晚一点，但凌晨一点已经越界。罚款150欧落下来，像一记响亮的教训。室友的兴致彻底散了，只剩账单。',
        statChanges: { money: -150, sanity: -20 }
      }
    ]
  },
  {
    id: '3-6',
    title: '冬天的抑郁',
    description: '柏林的冬天像一块湿布，下午四点就天黑。一个月的阴雨让世界变得灰且低，你开始变得不想说话、不想出门，连回消息都像耗电。你终于承认：这不是“矫情”，这是一种真实的下沉。',
    imagePrompt: IMAGE_PROMPTS.winter_depression,
    options: [
      {
        text: '买补充剂和日光灯：给自己造一点阳光',
        resultDescription: '你花80欧买了补充剂和模拟日光灯，像在房间里点起一盏“假的太阳”。它不能解决所有问题，但你开始更容易起床，情绪也没那么容易塌陷。',
        statChanges: { money: -80, sanity: +15 }
      },
      {
        text: '硬扛：把一切交给意志力',
        resultDescription: '你告诉自己“再忍忍就过去了”。可阴天一天天叠加，意志力像被雨水泡软的纸。你越来越不想出门、不想社交，连快乐都像被调低了音量。',
        statChanges: { sanity: -35 }
      }
    ]
  },
  {
    id: '3-7',
    title: '德语考试DSH的煎熬',
    description: '为了申请硕士，你必须通过DSH-2。你已经考过一次，上次听力挂了，失败像一根刺留在喉咙里。现在你再次坐到桌前，耳机里传来德语广播，你的手心又开始出汗。',
    imagePrompt: IMAGE_PROMPTS.presentation_fear,
    options: [
      {
        text: '报强化班系统准备：用钱买结构',
        resultDescription: '你花600欧把自己交给课程表：听力、写作、口语一项项拆解。四周像军训，痛苦但有效。最终你通过了——那张成绩单像一张“继续留在这里”的许可证。',
        statChanges: { money: -600, sanity: -25, ects: +5 }
      },
      {
        text: '自学硬扛：把时间砸到听懂为止',
        resultDescription: '你每天刷题四小时，把听力材料反复倒回去听，直到脑子发麻。你勉强通过了，但过程像在泥地里爬行——每一步都费力。',
        statChanges: { sanity: -40, ects: +5 }
      }
    ]
  },
  {
    id: '3-8',
    title: '自行车被偷',
    description: '你走到车站，看到的是空荡荡的锁。自行车不见了，连带着你对“这里很安全”的幻想也不见了。你明明上了锁，可小偷把整辆车连架子一起搬走——像在告诉你：规则不是护身符，城市也有阴影。',
    imagePrompt: IMAGE_PROMPTS.train_station_panic,
    options: [
      {
        text: '去报案：把希望交给流程',
        resultDescription: '你填表、描述颜色、品牌、车架号。警察说会调查，但语气像对每个受害者都一样。你心里明白，找回来的概率很低——你得到的更多是“我至少做了该做的事”。',
        statChanges: { sanity: -20 }
      },
      {
        text: '直接买二手车：用钱换回行动自由',
        resultDescription: '你在二手平台翻了很久，最后买了一辆能骑的旧车。120欧不算多，但那一刻你感觉自己是在给生活续命：你需要继续通勤、继续上课、继续前进。',
        statChanges: { money: -120, sanity: -10 }
      }
    ]
  },
  {
    id: '3-9',
    title: 'Döner涨价事件',
    description: '你最爱的烤肉卷突然涨价：从5欧跳到7.5欧。那张菜单像一张时代的公告。你站在店门口，意识到通胀不是新闻，是你手里越来越轻的生活费。',
    imagePrompt: IMAGE_PROMPTS.restaurant_work,
    options: [
      {
        text: '继续吃：把一点仪式感留给自己',
        resultDescription: '你还是每周吃一次，贵了，但它像一个小小的“我还活着”的仪式。你把它当作精神寄托——有时候，人需要的不只是省钱，还有一点温热的确定。',
        statChanges: { money: -30, sanity: +10 }
      },
      {
        text: '改吃食堂/自己做：把口腹欲压下去',
        resultDescription: '你开始自己煮面、做最简单的饭。钱省下来了，但生活的色彩也淡了些。你发现“省钱”常常意味着“把快乐削薄”。',
        statChanges: { sanity: -15 }
      }
    ]
  },
  {
    id: '3-10',
    title: '签证续签的噩梦',
    description: '居留许可快到期了，你打开预约系统，最早可约时间竟然在过期两个月后。你盯着屏幕，感觉自己被推到悬崖边：你明明想合法续签，却被时间安排成“先过期再说”。',
    imagePrompt: IMAGE_PROMPTS.visa_renewal,
    options: [
      {
        text: '疯狂刷系统抢位：把生活变成闹钟',
        resultDescription: '你每天六点起床刷新页面，像在抢救自己的合法身份。终于抢到一个取消的时间，你却几乎被这段日常磨空：耐心、睡眠、情绪都被按比例扣走。',
        statChanges: { sanity: -30 }
      },
      {
        text: '直接去现场排队：用身体硬撬出一个机会',
        resultDescription: '你凌晨四点到现场，队伍已经存在。你靠着墙等到天亮，终于拿到紧急号。窗口人员不情不愿地办了手续——你赢了这一局，但像从战场走出来。',
        statChanges: { sanity: -40 }
      }
    ]
  },
  {
    id: '3-11',
    title: 'Tandem语言交换的尴尬',
    description: '你参加语言交换活动，期待能练德语。可对方几乎不想学中文，只想免费练英语。你坐在咖啡厅里，听着自己被迫说英语，心里像吞了硬糖：你来这里不是当免费外教的。',
    imagePrompt: IMAGE_PROMPTS.language_exchange,
    options: [
      {
        text: '坚持规则：一半德语一半中文',
        resultDescription: '你把规则说得很清楚，对方勉强同意。气氛有点僵，但你终于练到了德语。你学到的不只是语言，还有边界感：温和不等于让步。',
        statChanges: { sanity: -10 }
      },
      {
        text: '放弃这次匹配：把时间留给真正互惠的人',
        resultDescription: '你礼貌结束对话，重新匹配。终于你遇到一个真正对中文感兴趣的人，你们各练各的，笑声也更真实。你意识到：不是所有关系都值得硬撑。',
        statChanges: { sanity: +10 }
      }
    ]
  },
  {
    id: '3-12',
    title: '超市收银员的白眼',
    description: '结账台像一条流水线，动作慢一点就会被目光推着走。你没提前准备零钱，后面的德国大妈开始大声抱怨，收银员的表情也像结霜。你站在队伍压力中，手指变得笨拙，心跳却越来越快。',
    imagePrompt: IMAGE_PROMPTS.supermarket_stress,
    options: [
      {
        text: '淡定刷卡：把嘀咕当空气',
        resultDescription: '你刷卡、装袋、离开，尽量不去听身后的嘀咕。你知道自己没有做错什么，只是没有符合他们的节奏。你学会了在不友善里保持镇定。',
        statChanges: { sanity: -15 }
      },
      {
        text: '紧张翻车：硬币掉了一地',
        resultDescription: '你手忙脚乱，硬币像雨点撒在地上。后面队伍齐齐叹气，那种尴尬像热浪一下子把你烫红。你捡着硬币，恨不得自己能消失一秒。',
        statChanges: { sanity: -30 }
      }
    ]
  },
  {
    id: '3-13',
    title: 'WG搬家的混乱',
    description: '合租合同到期，你只有两周找新住处。城市的房租却像失控的计时器：650欧/月只是“平均”。你刷房源刷到眼睛发痛，消息发出去石沉大海。你第一次发现“住处”不是屋顶，是一种稀缺资源。',
    imagePrompt: IMAGE_PROMPTS.moving_chaos,
    options: [
      {
        text: '咬牙签下新WG：用钱换确定',
        resultDescription: '你签下合同，房租650欧/月。你松了一口气，也同时背上新的压力：你需要更节俭，或者更努力赚钱。确定性很贵，但无家可归更贵。',
        statChanges: { money: -1300, sanity: -20 }
      },
      {
        text: '先住青旅：用漂泊换时间',
        resultDescription: '你把行李堆进青旅的角落，每晚30欧。贵、吵、没有隐私，但你换来了时间：你可以继续看房、继续联系。你像在临时栖身，等待一扇门真正为你打开。',
        statChanges: { money: -420, sanity: -25 }
      }
    ]
  },
  {
    id: '3-14',
    title: '打工时长超标的风险',
    description: '你把工时一算，心里一凉：本学期已经接近120天上限。再多一点，可能就会触碰学生身份与签证的红线。你站在钱和规则之间，像站在细钢丝上。',
    imagePrompt: IMAGE_PROMPTS.thesis_supervisor,
    options: [
      {
        text: '立刻停工：先保身份，再保收入',
        resultDescription: '你辞掉兼职，收入骤降，但你保住了最关键的底线。你告诉自己：钱可以慢慢赚，身份一旦出问题，所有努力都会重置。',
        statChanges: { sanity: -15, workCount: -2 }
      },
      {
        text: '冒险继续：用焦虑换现金',
        resultDescription: '你继续打工，钱确实多了，但每次看到官方信封、每次听见“检查”两个字，你都心跳加速。你在赚的同时，也在消耗自己。',
        statChanges: { money: +800, sanity: -30, workCount: 2 }
      }
    ]
  },
  {
    id: '3-15',
    title: '第三学年的十字路口',
    description: '两年多过去，你从“听不懂公告的人”变成了能独立办事的人。余额比刚来时少了一半，德语却长在你身上。可你也累了——你开始思考：要不要继续读下去？这不是学习问题，是人生方向。',
    imagePrompt: IMAGE_PROMPTS.career_choice,
    options: [
      {
        text: '坚持到底：把终点当作救赎',
        resultDescription: '你告诉自己已经走了这么远，不该在最后几公里倒下。你选择继续冲刺毕业，像在和过去的自己签一份“不能反悔”的契约。',
        statChanges: { sanity: +20, chapter: 1, level: 1 }
      },
      {
        text: '考虑转向：给自己留一条退路',
        resultDescription: '你开始浏览回国的机会，像在为自己准备一把备用钥匙。你并不一定会离开，但“有退路”的感觉让你轻松了一些。',
        statChanges: { sanity: +10, chapter: 1, level: 1 }
      }
    ]
  }
];

// ==================== 第4章：毕业冲刺 (Endspurt) ====================
const CHAPTER_4_SCENARIOS: Scenario[] = [
  {
    id: '4-1',
    title: '选择毕业论文导师',
    description: '毕业冲刺真正开始于这一刻：你得选导师。一个是学术强者，要求严苛、节奏像军令；另一个温和好说话，能让你顺利毕业，却可能让你的论文在简历上显得黯淡。你把两位教授的研究方向反复对照，像在选择一条将要走很久的路——轻松一点，还是锋利一点？',
    imagePrompt: IMAGE_PROMPTS.expulsion_letter,
    options: [
      {
        text: '选择严格导师：把自己交给更高标准',
        resultDescription: '对方接受了你，也同时把标准抬到天花板：每周汇报、每次修改都像被剖开。你知道接下来会很苦，但你也清楚——这条路能把你磨得更强。',
        statChanges: { sanity: -20 }
      },
      {
        text: '选择温和导师：先保证按时毕业',
        resultDescription: '你选了更和善的导师，沟通顺畅、压力更可控。论文过程可能没那么耀眼，但你得到的是稳定和可持续。你开始明白：有时候，“顺利”本身就是一种胜利。',
        statChanges: { sanity: +10, ects: +20 }
      }
    ]
  },
  {
    id: '4-2',
    title: '毕业论文开题的压力',
    description: '你提交开题报告，像把心血交到审判席。反馈回来时，红色批注密密麻麻：逻辑不够、问题不尖、方法不稳，几乎要推翻整个框架。你盯着屏幕，先是麻木，然后是委屈，最后只剩下一个更冷的现实：要么重写，要么被卡在这里。',
    imagePrompt: IMAGE_PROMPTS.thesis_supervisor,
    options: [
      {
        text: '接受意见全部重写：把自尊放一边',
        resultDescription: '你把原稿放进“旧版本”文件夹，像把一次失败封存。两周里你推翻、重建、再推翻。痛苦得像拔掉一颗钉子，但新的框架更严谨、更站得住。',
        statChanges: { sanity: -30 }
      },
      {
        text: '坚持部分观点：用逻辑为自己争一口气',
        resultDescription: '你写了一封很长的邮件，逐条解释你的设计与取舍。对方并没有完全让步，但最终接受了其中一部分。你付出了精力，也保住了自己对研究的掌控感。',
        statChanges: { sanity: -15 }
      }
    ]
  },
  {
    id: '4-3',
    title: '实验数据的灾难',
    description: '你做了三个月实验，像在黑暗里一点点攒起星光。可最后一周你发现数据严重偏差，可能是仪器校准问题——也就是说，前面的努力可能都建立在错误的地基上。你盯着曲线图，胃里发冷：时间不是你的朋友，毕业期限更不会同情你。',
    imagePrompt: IMAGE_PROMPTS.presentation_fear,
    options: [
      {
        text: '重做实验申请延期：用时间换真实性',
        resultDescription: '你咬牙承认问题，申请延期，把实验全部重做。毕业时间推迟了一学期，但你终于不用在论文里撒谎。你选择了更难的诚实。',
        statChanges: { sanity: -40, semester: 1 }
      },
      {
        text: '调整研究问题：让现有数据“还能成立”',
        resultDescription: '你把问题换个角度，重新定义研究目标，让现有数据也能自圆其说。它不完美，但能让你按时毕业。你明白这是一种妥协，但你需要先到终点。',
        statChanges: { sanity: -25, ects: +15 }
      }
    ]
  },
  {
    id: '4-4',
    title: '找工作还是继续读博',
    description: '导师欣赏你的论文，递来读博邀请，像把一条学术道路铺到你脚下：继续研究、继续发表、继续在实验室与文字之间耗尽青春。可你也已经疲惫，你开始渴望更明确的回报、更可控的生活。你站在门口，听见自己心里有两个声音在拉扯。',
    imagePrompt: IMAGE_PROMPTS.expulsion_letter,
    options: [
      {
        text: '接受读博邀请：把未来押在学术上',
        resultDescription: '你决定留下来，继续深造。意味着至少三年的清贫与高压，但也意味着更深的研究、更长的赛道。你像把人生切换到“耐力模式”。',
        statChanges: { sanity: -20, ects: +10 }
      },
      {
        text: '婉拒读博：转向投递工作',
        resultDescription: '你礼貌拒绝，打开求职平台开始投递。你第一次把“毕业后要去哪”写成一份份简历，也第一次清楚地感到：你想要一份更稳定、更现实的生活。',
        statChanges: { sanity: +10 }
      }
    ]
  },
  {
    id: '4-5',
    title: 'IT公司的面试马拉松',
    description: '你拿到一家IT公司的面试机会，流程像一场消耗战：人力面、技术面、现场编程、团队面，前后拖了一个月。每一轮都像把你拆开重新评估：你会什么、你怎么想、你在压力下会不会崩。你一边准备，一边还要写论文——两条战线同时开火。',
    imagePrompt: IMAGE_PROMPTS.thesis_supervisor,
    options: [
      {
        text: '全力准备：每天刷题6小时',
        resultDescription: '你把算法题刷到手指发麻，白板上写满边界条件和复杂度。最终你通过所有轮次，拿到年薪55k欧的offer。你松了一口气，像终于把未来抓住了一角。',
        statChanges: { sanity: -30, money: +5000 }
      },
      {
        text: '放松心态：不过度准备',
        resultDescription: '你没有把自己逼到极限，面试发挥也就中规中矩。最终在团队面试环节被淘汰。你失落，但也松了一点：至少你没有为了一个机会把自己完全燃尽。',
        statChanges: { sanity: -20 }
      }
    ]
  },
  {
    id: '4-6',
    title: '论文答辩的前夜',
    description: '明天就是答辩。你需要做30分钟德语展示，再面对评委提问。夜里你翻着PPT，一页页像一段段回忆：你熬过的夜、你改过的句子、你差点放弃的瞬间。你明明很累，却不敢睡——你怕一闭眼，明天就会塌下来。',
    imagePrompt: IMAGE_PROMPTS.library_stressed,
    options: [
      {
        text: '通宵练习：把每一页都刻进脑子',
        resultDescription: '你一夜没睡，把每一页PPT都练到闭眼也能说。答辩时你依旧紧张，但细节像护甲一样保护你——你发挥得很稳，几乎完美。',
        statChanges: { sanity: -35, ects: +30 }
      },
      {
        text: '早点休息：把状态留给明天',
        resultDescription: '你十点就睡，把自己交给睡眠。第二天精神更好，虽然有些问题没答完美，但整体发挥稳定。你用“可持续”换了“少一点失误”。',
        statChanges: { sanity: -15, ects: +25 }
      }
    ]
  },
  {
    id: '4-7',
    title: '答辩当天的意外',
    description: '答辩当天早上，交通又出了问题。你答辩时间是10点，现在9:30，你还在路上。你盯着手机时间，心里像有一只手在拧：你努力了这么久，难道要输给一个“延误”？',
    imagePrompt: IMAGE_PROMPTS.ticket_check,
    options: [
      {
        text: '打车冲刺（-60€）：把钱当作保险',
        resultDescription: '你上车后一路催促，喉咙发紧。你在9:55冲进教室，浑身大汗。答辩推迟10分钟开始——你没有错过，你只是把紧张提前透支了。',
        statChanges: { money: -60, sanity: -25, delayCount: 1 }
      },
      {
        text: '紧急联系教授申请延期：用沟通换时间',
        resultDescription: '你一边走一边发邮件说明情况。教授同意把答辩改到下午，但你一上午都在焦虑里打转，像被关在等待室里。你活下来了，但精神被撕扯得很累。',
        statChanges: { sanity: -35, delayCount: 1 }
      }
    ]
  },
  {
    id: '4-8',
    title: '拿到毕业证书的瞬间',
    description: '你终于拿到了毕业证书。那张纸薄得几乎能透光，却承载了三年的重量：办手续的队伍、课堂的崩溃、孤独的冬天、以及无数个你以为熬不过去的夜晚。你握着它，突然不知道该笑还是该哭。',
    imagePrompt: IMAGE_PROMPTS.expulsion_letter,
    options: [
      {
        text: '请朋友们大吃一顿：把感谢说出口',
        resultDescription: '你订了位子，邀请所有帮助过你的人。250欧花得不轻松，但你终于把“谢谢”说出来。你知道这顿饭吃的是人情，也是你在异乡活下来的证据。',
        statChanges: { money: -250, sanity: +50, ects: 180 }
      },
      {
        text: '一个人静静走一圈：把这三年收进心里',
        resultDescription: '你一个人走在校园里，树影摇晃，风有点冷。你看着证书，想起无数片段像电影闪回。你没有大声庆祝，但你在心里对自己说：你做到了。',
        statChanges: { sanity: +40, ects: 180 }
      }
    ]
  },
  {
    id: '4-9',
    title: '工作签证的申请',
    description: '你拿到工作offer，却还要过最后一关：把学生签证转成工作签证。你想起外管局的冷灯光和漫长等待，胃里又紧了一下。你以为毕业就是终点，原来它只是另一个流程的起点。',
    imagePrompt: IMAGE_PROMPTS.visa_renewal,
    options: [
      {
        text: '提前准备全套材料：一次到位',
        resultDescription: '你提前三个月准备材料，把每一份文件都复印备份，像在为一场审查铺路。最终你顺利拿到工作签证。你终于能喘一口气——合法身份像一块真正落地的石头。',
        statChanges: { sanity: -20 }
      },
      {
        text: '找专业代办：用钱换省事',
        resultDescription: '你花300欧把流程交给专业人士。你少跑了很多路，签证也很快批下来。你知道这是一种“买时间”的行为，而你现在最缺的就是时间和精力。',
        statChanges: { money: -300, sanity: -5 }
      }
    ]
  },
  {
    id: '4-10',
    title: '回国还是留下',
    description: '你同时拿到两个offer：一个来自国内的大公司，工资更高，节奏更快；一个来自德国公司，薪资没那么耀眼，但生活更平衡。你把两份合同放在桌上，像摆着两种人生。选择不再是对错，而是你想成为谁。',
    imagePrompt: IMAGE_PROMPTS.career_choice,
    options: [
      {
        text: '留在德国：把生活放回人生中心',
        resultDescription: '你选择留下。工资不算顶尖，但你拥有更稳定的节奏、更长的假期和更可呼吸的生活。你开始相信：不被工作吞噬，也是一种成功。',
        statChanges: { sanity: +30 }
      },
      {
        text: '回国发展：用高薪换高强度',
        resultDescription: '你选择回国，工资更高，机会更多。但你也知道更高强度的节奏在等你。你不是没想过代价，只是你愿意承担。',
        statChanges: { money: +10000, sanity: -20 }
      }
    ]
  },
  {
    id: '4-11',
    title: '最后一次搬家',
    description: '宿舍合同到期，你要搬到新公寓。这已经是你在德国的第五次搬家：你对纸箱的折法比对某些公式还熟。每一次搬家都像一次小型告别——告别一个阶段、告别一群人、告别一个“暂住的自己”。',
    imagePrompt: IMAGE_PROMPTS.moving_chaos,
    options: [
      {
        text: '租单人公寓：用钱换独处与边界',
        resultDescription: '你租下30平的单人公寓，房租900欧/月很贵，但你终于拥有完全属于自己的空间。你关上门的那一刻，世界安静下来——安静得让人想哭。',
        statChanges: { money: -1800, sanity: +20 }
      },
      {
        text: '继续住合租：把钱留给未来',
        resultDescription: '你找了新的合租，房租550欧/月，厨房和浴室要共享，生活也要磨合。但你至少省下不少钱。你告诉自己：等站稳了，再给自己更大的空间。',
        statChanges: { money: -1100, sanity: -10 }
      }
    ]
  },
  {
    id: '4-12',
    title: '第一次发工资',
    description: '第一笔正式工资到账。税前4500欧，扣完税到手2900欧。你盯着银行App，突然觉得这串数字不是钱，是“被社会承认”的信号。你终于不再只是靠补助和兼职活着的人。',
    imagePrompt: IMAGE_PROMPTS.parents_visit,
    options: [
      {
        text: '买一台高端笔记本犒劳自己',
        resultDescription: '你花1800欧买了心仪已久的高端笔记本。很贵，但你在心里对自己说：这不是挥霍，这是对一路坚持的奖励。你终于允许自己快乐一次。',
        statChanges: { money: -1800, sanity: +25 }
      },
      {
        text: '存起来：把安全感放进账户',
        resultDescription: '你把钱存起来，为未来做准备。你没有立刻奖励自己，但内心更踏实：你终于能为风险留一份缓冲。安全感像慢慢涨起来的潮。',
        statChanges: { money: +2900, sanity: +10 }
      }
    ]
  },
  {
    id: '4-13',
    title: '父母来德国探望',
    description: '父母第一次来德国看你。他们不会英语和德语，你成了翻译、导游、司机、甚至“情绪缓冲垫”。你既想让他们看到你的成长，也怕他们看到你吃过的苦。你在机场接到他们的那一刻，喉咙突然有点紧。',
    imagePrompt: IMAGE_PROMPTS.parents_visit,
    options: [
      {
        text: '请假一周全程陪同：把时间给家人',
        resultDescription: '你请假一周，带他们游览不同城市。很累，但你看见父母的笑容，突然觉得很多苦都值得。你用陪伴把这几年欠下的“想念”一点点补回来。',
        statChanges: { money: -1200, sanity: +40 }
      },
      {
        text: '周末陪同，平日让他们自己探索：在责任间取平衡',
        resultDescription: '你只能周末陪他们，平日他们自己探索。父母有点失望，但也理解你要工作。你在心里有点愧疚，却也知道：成年人的爱常常夹在现实里。',
        statChanges: { money: -500, sanity: +15 }
      }
    ]
  },
  {
    id: '4-14',
    title: '永久居留的申请',
    description: '你在德国待了快五年，终于够资格申请永久居留。可申请不是“领取奖励”，而是另一套考试：德语B1、融入测试、材料审核、等待。你看着清单，心里竟有点害怕——不是怕难，是怕再一次被流程卡住。',
    imagePrompt: IMAGE_PROMPTS.visa_renewal,
    options: [
      {
        text: '认真准备一次通过：把最后一关打穿',
        resultDescription: '你报名准备，按计划学习，顺利通过所有考试，拿到永久居留。那一刻你意识到：你终于不用再为“能不能留下”失眠了。世界突然变得宽一些。',
        statChanges: { money: -400, sanity: +50 }
      },
      {
        text: '暂时不申请：给自己留出选择权',
        resultDescription: '你决定先不申请，因为你还不确定是否要永久留在这里。你保留弹性，也接受不确定。你学会了：人生不是只有一种答案。',
        statChanges: { sanity: -10 }
      }
    ]
  },
  {
    id: '4-15',
    title: '德国生活的新篇章',
    description: '五年过去。你从一个拖着行李在寒风里发抖的留学生，变成能独立工作、独立生活的人。你经历了无数困境：语言、流程、孤独、焦虑、以及一次次“差点坚持不下去”。可你活下来了，并且学会了在灰色天空下也能站稳脚跟。',
    imagePrompt: IMAGE_PROMPTS.crossroads,
    options: [
      {
        text: '继续深耕：把这里当作第二故乡',
        resultDescription: '你决定留下来，把这里当作第二故乡。它不完美，但你已经学会与它共处。你不是被它温柔对待才留下的——你是靠自己一点点适应、改变、扎根。恭喜你，生存挑战完成。',
        statChanges: { sanity: +50, ects: 180 }
      },
      {
        text: '选择回国：带着成长回到起点',
        resultDescription: '你买了回国的单程机票。你感谢这段经历，它把你磨得更坚韧、更清醒。但你的根仍在故乡，你想把学到的一切带回去。你没有失败，你只是选择了另一种人生。恭喜你，生存挑战完成。',
        statChanges: { sanity: +40, ects: 180 }
      }
    ]
  }
];

// 合并所有章节
export const ALL_SCENARIOS: Scenario[] = [
  ...CHAPTER_1_SCENARIOS,
  ...CHAPTER_2_SCENARIOS,
  ...CHAPTER_3_SCENARIOS,
  ...CHAPTER_4_SCENARIOS
];

// 根据 ID 获取关卡
export const getScenarioById = (id: string): Scenario | null => {
  return ALL_SCENARIOS.find(s => s.id === id) || null;
};

// 根据章节和关卡号获取关卡
export const getScenarioByChapterLevel = (chapter: number, level: number): Scenario | null => {
  return getScenarioById(`${chapter}-${level}`);
};

// 获取下一关（按顺序）
export const getNextScenario = (currentId: string): Scenario | null => {
  const currentIndex = ALL_SCENARIOS.findIndex(s => s.id === currentId);
  if (currentIndex === -1 || currentIndex === ALL_SCENARIOS.length - 1) {
    return null;
  }
  return ALL_SCENARIOS[currentIndex + 1];
};

// 获取章节的所有关卡
export const getChapterScenarios = (chapter: number): Scenario[] => {
  return ALL_SCENARIOS.filter(s => s.id.startsWith(`${chapter}-`));
};
