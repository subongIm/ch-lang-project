export interface Clip {
  id: string;
  title: string;
  source: {
    type: 'youtube';
    videoId: string;
    start: number;
    end: number;
  };
  tags: string[];
  createdBy: string;
  thumbnail?: string;
  duration: number;
}

export interface Phrase {
  id: string;
  clipId: string;
  tStart: number;
  tEnd: number;
  zh: string;
  pinyin: string;
  ko: string;
  vocabRefs: string[];
  grammarRefs: string[];
}

export interface Vocab {
  id: string;
  term: string;
  pinyin: string;
  meaningKo: string;
  pos: string;
  examples: string[];
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Grammar {
  id: string;
  label: string;
  explainKo: string;
  patterns: string[];
  examples: string[];
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Bookmark {
  id: string;
  userId: string;
  clipId: string;
  t: number;
  note?: string;
  phraseId?: string;
}

export interface User {
  id: string;
  role: 'learner' | 'editor' | 'admin';
  name: string;
  email?: string;
}

export const mockData = {
  clips: [
    {
      id: "clip_chinese_variety_1",
      title: "크라임씬 게임 방법",
      source: { type: "youtube" as const, videoId: "CFPKWcRJGk0", start: 1335, end: 1364 },
      tags: ["crimeScene", "gameMethod", "explanation"],
      createdBy: "editor_01",
      thumbnail: "https://img.youtube.com/vi/CFPKWcRJGk0/maxresdefault.jpg",
      duration: 29
    },
    {
      id: "clip_chinese_variety_2", 
      title: "중국 예능 학습 - 미션 설명",
      source: { type: "youtube" as const, videoId: "gkQ3SAN9-EQ", start: 300, end: 480 },
      tags: ["gameRules", "explanation"],
      createdBy: "editor_01",
      thumbnail: "https://img.youtube.com/vi/gkQ3SAN9-EQ/maxresdefault.jpg",
      duration: 180
    },
    {
      id: "clip_chinese_variety_3",
      title: "중국 예능 학습 - 팀 구성",
      source: { type: "youtube" as const, videoId: "gkQ3SAN9-EQ", start: 480, end: 600 },
      tags: ["teamFormation", "discussion"],
      createdBy: "editor_01",
      thumbnail: "https://img.youtube.com/vi/gkQ3SAN9-EQ/maxresdefault.jpg",
      duration: 120
    }
  ] as Clip[],

  phrases: [
    {
      id: "ph_001",
      clipId: "clip_chinese_variety_1",
      tStart: 0.0,
      tEnd: 14.0,
      zh: "太可怕了",
      pinyin: "Tài kěpà le",
      ko: "너무 무서워요",
      vocabRefs: ["vc_very", "vc_scary"],
      grammarRefs: ["gr_太+形容词+了"]
    },
    {
      id: "ph_002",
      clipId: "clip_chinese_variety_1",
      tStart: 14.0,
      tEnd: 22.0,
      zh: "感谢你表演物体模仿，郑凯拥抱铅笔圆规",
      pinyin: "Gǎnxiè nǐ biǎoyǎn wùtǐ mófǎng, Zhèng Kǎi yōngbào qiānbǐ yuánguī",
      ko: "물체 모방을 연기해주셔서 감사합니다, 정카이가 연필 컴퍼스를 안아주세요",
      vocabRefs: ["vc_thank", "vc_perform", "vc_object", "vc_imitation", "vc_embrace", "vc_pencil", "vc_compass"],
      grammarRefs: ["gr_感谢+人+动词", "gr_表演+宾语", "gr_拥抱+宾语"]
    },
    {
      id: "ph_003",
      clipId: "clip_chinese_variety_1",
      tStart: 22.0,
      tEnd: 29.0,
      zh: "好的，你可以看到你身后有一个圆台，上面有一杯水，每组搭档轮流挑战",
      pinyin: "Hǎo de, nǐ kěyǐ kàndào nǐ shēnhòu yǒu yīgè yuántái, shàngmiàn yǒu yībēi shuǐ, měi zǔ dādàng lúnliú tiǎozhàn",
      ko: "좋아요, 당신 뒤에 원형 테이블이 있고 그 위에 물 한 잔이 있어요, 각 팀의 파트너가 번갈아 도전합니다",
      vocabRefs: ["vc_good", "vc_see", "vc_behind", "vc_round", "vc_table", "vc_water", "vc_each", "vc_group", "vc_partner", "vc_take_turns", "vc_challenge"],
      grammarRefs: ["gr_可以+动词", "gr_有+名词", "gr_每组+名词", "gr_轮流+动词"]
    },
    {
      id: "ph_004",
      clipId: "clip_chinese_variety_1",
      tStart: 29.0,
      tEnd: 44.0,
      zh: "男孩先跳到圆桌上，然后女孩也跳上去，站立五秒钟就算成功",
      pinyin: "Nánhái xiān tiàodào yuánzhuō shàng, ránhòu nǚhái yě tiào shàngqù, zhànlì wǔ miǎo zhōng jiùsuàn chénggōng",
      ko: "남자아이가 먼저 원형 테이블에 뛰어오르고, 그 다음 여자아이도 뛰어올라서 5초간 서 있으면 성공입니다",
      vocabRefs: ["vc_boy", "vc_first", "vc_jump", "vc_round", "vc_table", "vc_then", "vc_girl", "vc_also", "vc_stand", "vc_five", "vc_second", "vc_success"],
      grammarRefs: ["gr_先+动词", "gr_跳到+名词", "gr_然后+动词", "gr_也+动词", "gr_站立+时间", "gr_就算+形容词"]
    },
    {
      id: "ph_004",
      clipId: "clip_chinese_variety_2",
      tStart: 310.2,
      tEnd: 315.8,
      zh: "这个游戏需要两个人一组。",
      pinyin: "Zhège yóuxì xūyào liǎnggè rén yīzǔ.",
      ko: "이 게임은 두 명씩 한 팀이 필요해요.",
      vocabRefs: ["vc_need", "vc_two", "vc_person", "vc_group"],
      grammarRefs: ["gr_需要+名词", "gr_数量+名词"]
    },
    {
      id: "ph_005",
      clipId: "clip_chinese_variety_2",
      tStart: 316.5,
      tEnd: 322.1,
      zh: "每组选一个代表来回答问题。",
      pinyin: "Měi zǔ xuǎn yīgè dàibiǎo lái huídá wèntí.",
      ko: "각 팀에서 대표 한 명을 뽑아서 질문에 답하세요.",
      vocabRefs: ["vc_each", "vc_choose", "vc_representative", "vc_answer", "vc_question"],
      grammarRefs: ["gr_每+名词", "gr_来+动词"]
    }
  ] as Phrase[],

  vocabs: [
    {
      id: "vc_hello",
      term: "大家",
      pinyin: "dàjiā",
      meaningKo: "여러분, 모두",
      pos: "대명사",
      examples: ["大家好！", "大家辛苦了。"],
      level: "beginner"
    },
    {
      id: "vc_welcome",
      term: "欢迎",
      pinyin: "huānyíng",
      meaningKo: "환영하다",
      pos: "동사",
      examples: ["欢迎来到北京。", "欢迎你参加我们的节目。"],
      level: "beginner"
    },
    {
      id: "vc_today",
      term: "今天",
      pinyin: "jīntiān",
      meaningKo: "오늘",
      pos: "명사",
      examples: ["今天天气很好。", "今天我要学习中文。"],
      level: "beginner"
    },
    {
      id: "vc_play",
      term: "玩",
      pinyin: "wán",
      meaningKo: "놀다, 게임하다",
      pos: "동사",
      examples: ["我们一起玩游戏吧。", "孩子们在玩球。"],
      level: "beginner"
    },
    {
      id: "vc_interesting",
      term: "有趣",
      pinyin: "yǒuqù",
      meaningKo: "재미있다, 흥미롭다",
      pos: "형용사",
      examples: ["这个故事很有趣。", "他是一个有趣的人。"],
      level: "intermediate"
    },
    {
      id: "vc_game",
      term: "游戏",
      pinyin: "yóuxì",
      meaningKo: "게임",
      pos: "명사",
      examples: ["我们玩个游戏吧。", "这个游戏很好玩。"],
      level: "beginner"
    },
    {
      id: "vc_first",
      term: "首先",
      pinyin: "shǒuxiān",
      meaningKo: "먼저, 우선",
      pos: "부사",
      examples: ["首先，我要介绍一下自己。", "首先，让我们看看这个。"],
      level: "intermediate"
    },
    {
      id: "vc_introduce",
      term: "介绍",
      pinyin: "jièshào",
      meaningKo: "소개하다",
      pos: "동사",
      examples: ["让我介绍一下我的朋友。", "请介绍一下这个产品。"],
      level: "intermediate"
    },
    {
      id: "vc_rules",
      term: "规则",
      pinyin: "guīzé",
      meaningKo: "규칙",
      pos: "명사",
      examples: ["请遵守游戏规则。", "这个规则很简单。"],
      level: "intermediate"
    },
    {
      id: "vc_need",
      term: "需要",
      pinyin: "xūyào",
      meaningKo: "필요하다",
      pos: "동사",
      examples: ["我需要你的帮助。", "这个工作需要经验。"],
      level: "beginner"
    },
    {
      id: "vc_two",
      term: "两",
      pinyin: "liǎng",
      meaningKo: "두 (개수)",
      pos: "수사",
      examples: ["两个人", "两本书", "两杯水"],
      level: "beginner"
    },
    {
      id: "vc_person",
      term: "人",
      pinyin: "rén",
      meaningKo: "사람",
      pos: "명사",
      examples: ["很多人", "这个人很好", "三个人"],
      level: "beginner"
    },
    {
      id: "vc_group",
      term: "组",
      pinyin: "zǔ",
      meaningKo: "조, 팀",
      pos: "명사",
      examples: ["一组人", "分组讨论", "第一组"],
      level: "intermediate"
    },
    {
      id: "vc_each",
      term: "每",
      pinyin: "měi",
      meaningKo: "매, 각",
      pos: "형용사",
      examples: ["每个人", "每天", "每年"],
      level: "beginner"
    },
    {
      id: "vc_choose",
      term: "选",
      pinyin: "xuǎn",
      meaningKo: "선택하다, 뽑다",
      pos: "동사",
      examples: ["选择答案", "选代表", "选礼物"],
      level: "beginner"
    },
    {
      id: "vc_representative",
      term: "代表",
      pinyin: "dàibiǎo",
      meaningKo: "대표",
      pos: "명사",
      examples: ["学生代表", "公司代表", "选代表"],
      level: "intermediate"
    },
    {
      id: "vc_answer",
      term: "回答",
      pinyin: "huídá",
      meaningKo: "답하다, 대답하다",
      pos: "동사",
      examples: ["回答问题", "回答正确", "请回答"],
      level: "beginner"
    },
    {
      id: "vc_question",
      term: "问题",
      pinyin: "wèntí",
      meaningKo: "문제, 질문",
      pos: "명사",
      examples: ["问问题", "解决问题", "回答问题"],
      level: "beginner"
    },
    {
      id: "vc_program",
      term: "节目",
      pinyin: "jiémù",
      meaningKo: "프로그램, 방송",
      pos: "명사",
      examples: ["电视节目", "节目开始", "这个节目很有趣"],
      level: "beginner"
    },
    {
      id: "vc_we",
      term: "我们",
      pinyin: "wǒmen",
      meaningKo: "우리",
      pos: "대명사",
      examples: ["我们学习中文", "我们一起玩", "我们的学校"],
      level: "beginner"
    },
    {
      id: "vc_learn",
      term: "学习",
      pinyin: "xuéxí",
      meaningKo: "학습하다, 공부하다",
      pos: "동사",
      examples: ["学习中文", "努力学习", "学习新知识"],
      level: "beginner"
    },
    {
      id: "vc_chinese",
      term: "中文",
      pinyin: "zhōngwén",
      meaningKo: "중국어",
      pos: "명사",
      examples: ["学习中文", "中文很难", "我会说中文"],
      level: "beginner"
    },
    {
      id: "vc_this",
      term: "这",
      pinyin: "zhè",
      meaningKo: "이것",
      pos: "대명사",
      examples: ["这是什么", "这个很好", "这里"],
      level: "beginner"
    },
    {
      id: "vc_very",
      term: "很",
      pinyin: "hěn",
      meaningKo: "매우, 아주",
      pos: "부사",
      examples: ["很好", "很漂亮", "很累"],
      level: "beginner"
    },
    {
      id: "vc_please",
      term: "请",
      pinyin: "qǐng",
      meaningKo: "부탁드립니다, ~해주세요",
      pos: "동사",
      examples: ["请坐", "请说", "请帮忙"],
      level: "beginner"
    },
    {
      id: "vc_everyone",
      term: "大家",
      pinyin: "dàjiā",
      meaningKo: "여러분, 모두",
      pos: "대명사",
      examples: ["大家好", "大家辛苦了", "大家一起来"],
      level: "beginner"
    },
    {
      id: "vc_listen",
      term: "听",
      pinyin: "tīng",
      meaningKo: "듣다",
      pos: "동사",
      examples: ["听音乐", "听老师讲", "仔细听"],
      level: "beginner"
    },
    {
      id: "vc_let",
      term: "让",
      pinyin: "ràng",
      meaningKo: "~하게 하다",
      pos: "동사",
      examples: ["让我想想", "让他来", "让我们开始"],
      level: "beginner"
    },
    {
      id: "vc_us",
      term: "我们",
      pinyin: "wǒmen",
      meaningKo: "우리",
      pos: "대명사",
      examples: ["我们学习", "我们一起", "我们的家"],
      level: "beginner"
    },
    {
      id: "vc_start",
      term: "开始",
      pinyin: "kāishǐ",
      meaningKo: "시작하다",
      pos: "동사",
      examples: ["开始学习", "开始工作", "让我们开始"],
      level: "beginner"
    },
    {
      id: "vc_now",
      term: "现在",
      pinyin: "xiànzài",
      meaningKo: "지금, 현재",
      pos: "명사",
      examples: ["现在开始", "现在几点了", "现在很好"],
      level: "beginner"
    },
    {
      id: "vc_my",
      term: "我的",
      pinyin: "wǒ de",
      meaningKo: "나의",
      pos: "소유격",
      examples: ["我的书", "我的家", "我的问题"],
      level: "beginner"
    },
    {
      id: "vc_choose",
      term: "选择",
      pinyin: "xuǎnzé",
      meaningKo: "선택하다",
      pos: "동사",
      examples: ["选择答案", "选择朋友", "选择工作"],
      level: "beginner"
    },
    {
      id: "vc_correct",
      term: "正确",
      pinyin: "zhèngquè",
      meaningKo: "정확한, 올바른",
      pos: "형용사",
      examples: ["正确答案", "正确的方法", "很正确"],
      level: "intermediate"
    },
    {
      id: "vc_come",
      term: "来",
      pinyin: "lái",
      meaningKo: "오다",
      pos: "동사",
      examples: ["来学习", "来帮忙", "来回答问题"],
      level: "beginner"
    },
    {
      id: "vc_five",
      term: "五",
      pinyin: "wǔ",
      meaningKo: "다섯",
      pos: "수사",
      examples: ["五个人", "五本书", "五点钟"],
      level: "beginner"
    },
    {
      id: "vc_first",
      term: "第一",
      pinyin: "dì yī",
      meaningKo: "첫 번째",
      pos: "수사",
      examples: ["第一个", "第一次", "第一名"],
      level: "beginner"
    },
    {
      id: "vc_clear",
      term: "清楚",
      pinyin: "qīngchǔ",
      meaningKo: "명확한, 분명한",
      pos: "형용사",
      examples: ["听清楚", "看清楚", "说清楚"],
      level: "intermediate"
    },
    {
      id: "vc_tell",
      term: "告诉",
      pinyin: "gàosù",
      meaningKo: "알려주다, 말하다",
      pos: "동사",
      examples: ["告诉我", "告诉老师", "告诉朋友"],
      level: "beginner"
    },
    {
      id: "vc_me",
      term: "我",
      pinyin: "wǒ",
      meaningKo: "나",
      pos: "대명사",
      examples: ["我学习", "我的书", "告诉我"],
      level: "beginner"
    },
    {
      id: "vc_understand",
      term: "明白",
      pinyin: "míngbái",
      meaningKo: "이해하다",
      pos: "동사",
      examples: ["明白了", "不明白", "明白了吗"],
      level: "beginner"
    },
    {
      id: "vc_good",
      term: "好",
      pinyin: "hǎo",
      meaningKo: "좋다",
      pos: "형용사",
      examples: ["很好", "好学生", "好老师"],
      level: "beginner"
    },
    {
      id: "vc_wish",
      term: "祝",
      pinyin: "zhù",
      meaningKo: "축하하다, 빌다",
      pos: "동사",
      examples: ["祝你生日快乐", "祝你好运", "祝你成功"],
      level: "intermediate"
    },
    {
      id: "vc_good_luck",
      term: "好运",
      pinyin: "hǎoyùn",
      meaningKo: "행운",
      pos: "명사",
      examples: ["祝你好运", "好运来了", "没有好运"],
      level: "intermediate"
    },
    {
      id: "vc_scary",
      term: "可怕",
      pinyin: "kěpà",
      meaningKo: "무서운",
      pos: "형용사",
      examples: ["太可怕了", "很可怕", "可怕的故事"],
      level: "beginner"
    },
    {
      id: "vc_thank",
      term: "感谢",
      pinyin: "gǎnxiè",
      meaningKo: "감사하다",
      pos: "동사",
      examples: ["感谢你", "感谢老师", "非常感谢"],
      level: "beginner"
    },
    {
      id: "vc_perform",
      term: "表演",
      pinyin: "biǎoyǎn",
      meaningKo: "연기하다, 공연하다",
      pos: "동사",
      examples: ["表演节目", "表演舞蹈", "表演得很好"],
      level: "intermediate"
    },
    {
      id: "vc_object",
      term: "物体",
      pinyin: "wùtǐ",
      meaningKo: "물체",
      pos: "명사",
      examples: ["物体模仿", "小物体", "物体运动"],
      level: "intermediate"
    },
    {
      id: "vc_imitation",
      term: "模仿",
      pinyin: "mófǎng",
      meaningKo: "모방",
      pos: "명사/동사",
      examples: ["模仿表演", "模仿动物", "模仿得很像"],
      level: "intermediate"
    },
    {
      id: "vc_embrace",
      term: "拥抱",
      pinyin: "yōngbào",
      meaningKo: "안아주다",
      pos: "동사",
      examples: ["拥抱朋友", "拥抱妈妈", "紧紧拥抱"],
      level: "beginner"
    },
    {
      id: "vc_pencil",
      term: "铅笔",
      pinyin: "qiānbǐ",
      meaningKo: "연필",
      pos: "명사",
      examples: ["一支铅笔", "铅笔盒", "用铅笔写字"],
      level: "beginner"
    },
    {
      id: "vc_compass",
      term: "圆规",
      pinyin: "yuánguī",
      meaningKo: "컴퍼스",
      pos: "명사",
      examples: ["用圆规画圆", "圆规和尺子", "圆规工具"],
      level: "intermediate"
    },
    {
      id: "vc_behind",
      term: "身后",
      pinyin: "shēnhòu",
      meaningKo: "뒤에",
      pos: "명사",
      examples: ["在身后", "身后有人", "站在身后"],
      level: "beginner"
    },
    {
      id: "vc_round",
      term: "圆",
      pinyin: "yuán",
      meaningKo: "둥근",
      pos: "형용사",
      examples: ["圆桌", "圆形", "很圆"],
      level: "beginner"
    },
    {
      id: "vc_table",
      term: "台",
      pinyin: "tái",
      meaningKo: "테이블, 대",
      pos: "명사",
      examples: ["圆台", "桌子", "上台"],
      level: "beginner"
    },
    {
      id: "vc_partner",
      term: "搭档",
      pinyin: "dādàng",
      meaningKo: "파트너",
      pos: "명사",
      examples: ["好搭档", "搭档关系", "找搭档"],
      level: "intermediate"
    },
    {
      id: "vc_take_turns",
      term: "轮流",
      pinyin: "lúnliú",
      meaningKo: "번갈아",
      pos: "동사",
      examples: ["轮流做", "轮流发言", "轮流休息"],
      level: "intermediate"
    },
    {
      id: "vc_challenge",
      term: "挑战",
      pinyin: "tiǎozhàn",
      meaningKo: "도전",
      pos: "동사/명사",
      examples: ["接受挑战", "挑战自己", "新的挑战"],
      level: "intermediate"
    },
    {
      id: "vc_boy",
      term: "男孩",
      pinyin: "nánhái",
      meaningKo: "남자아이",
      pos: "명사",
      examples: ["小男孩", "男孩女孩", "男孩们"],
      level: "beginner"
    },
    {
      id: "vc_jump",
      term: "跳",
      pinyin: "tiào",
      meaningKo: "뛰다",
      pos: "동사",
      examples: ["跳高", "跳远", "跳起来"],
      level: "beginner"
    },
    {
      id: "vc_girl",
      term: "女孩",
      pinyin: "nǚhái",
      meaningKo: "여자아이",
      pos: "명사",
      examples: ["小女孩", "女孩们", "漂亮女孩"],
      level: "beginner"
    },
    {
      id: "vc_stand",
      term: "站立",
      pinyin: "zhànlì",
      meaningKo: "서 있다",
      pos: "동사",
      examples: ["站立不动", "站立姿势", "站立很久"],
      level: "beginner"
    },
    {
      id: "vc_second",
      term: "秒",
      pinyin: "miǎo",
      meaningKo: "초",
      pos: "명사",
      examples: ["一秒钟", "几秒钟", "秒表"],
      level: "beginner"
    },
    {
      id: "vc_success",
      term: "成功",
      pinyin: "chénggōng",
      meaningKo: "성공",
      pos: "명사/동사",
      examples: ["获得成功", "成功完成", "很成功"],
      level: "beginner"
    }
  ] as Vocab[],

  grammars: [
    {
      id: "gr_欢迎+到/来",
      label: "欢迎 + 到/来 + 地点/处所",
      explainKo: "어디에 오신 것을 환영합니다. '欢迎' 뒤에 '到' 또는 '来'를 사용하여 장소를 나타냅니다.",
      patterns: ["欢迎来到…", "欢迎你来…", "欢迎到…来"],
      examples: ["欢迎来到我们的节目。", "欢迎你来上海。", "欢迎到北京来。"],
      level: "intermediate"
    },
    {
      id: "gr_要+动词",
      label: "要 + 动词",
      explainKo: "할 예정이다, 하려고 한다. 미래의 의도나 계획을 나타냅니다.",
      patterns: ["要 + 动词", "要 + 动词 + 宾语"],
      examples: ["我要学习中文。", "今天要玩游戏。", "明天要去北京。"],
      level: "beginner"
    },
    {
      id: "gr_的+名词",
      label: "的 + 名词",
      explainKo: "형용사나 동사 뒤에 '的'를 붙여 명사구를 만듭니다.",
      patterns: ["形容词 + 的 + 名词", "动词 + 的 + 名词"],
      examples: ["有趣的游戏", "好吃的菜", "学习的方法"],
      level: "beginner"
    },
    {
      id: "gr_让+人+动词",
      label: "让 + 人 + 动词",
      explainKo: "사람에게 어떤 행동을 하게 하다. 사역의 의미를 나타냅니다.",
      patterns: ["让 + 人 + 动词", "让 + 人 + 动词 + 宾语"],
      examples: ["让我介绍一下。", "让他回答问题。", "让老师解释一下。"],
      level: "intermediate"
    },
    {
      id: "gr_一下",
      label: "一下",
      explainKo: "동작을 가볍게, 잠깐 하는 의미를 나타내는 보어입니다.",
      patterns: ["动词 + 一下"],
      examples: ["看一下", "试一下", "介绍一下"],
      level: "beginner"
    },
    {
      id: "gr_需要+名词",
      label: "需要 + 名词",
      explainKo: "무엇이 필요하다는 의미를 나타냅니다.",
      patterns: ["需要 + 名词", "需要 + 动词"],
      examples: ["需要帮助", "需要时间", "需要学习"],
      level: "beginner"
    },
    {
      id: "gr_数量+名词",
      label: "数量 + 名词",
      explainKo: "수량사와 명사를 함께 사용하여 개수를 나타냅니다.",
      patterns: ["数词 + 量词 + 名词"],
      examples: ["两个人", "三本书", "五杯水"],
      level: "beginner"
    },
    {
      id: "gr_每+名词",
      label: "每 + 名词",
      explainKo: "매, 각의 의미로 모든 것을 가리킵니다.",
      patterns: ["每 + 名词", "每 + 名词 + 都"],
      examples: ["每个人", "每天", "每年都"],
      level: "beginner"
    },
    {
      id: "gr_来+动词",
      label: "来 + 动词",
      explainKo: "동작의 목적을 나타내는 연결어입니다.",
      patterns: ["来 + 动词", "来 + 动词 + 宾语"],
      examples: ["来回答问题", "来学习中文", "来买东西"],
      level: "beginner"
    },
    {
      id: "gr_学习+宾语",
      label: "学习 + 宾语",
      explainKo: "무엇을 학습하다는 의미를 나타냅니다.",
      patterns: ["学习 + 名词"],
      examples: ["学习中文", "学习数学", "学习新知识"],
      level: "beginner"
    },
    {
      id: "gr_很+形容词",
      label: "很 + 形容词",
      explainKo: "형용사를 강조하는 부사입니다.",
      patterns: ["很 + 形容词"],
      examples: ["很好", "很漂亮", "很有趣"],
      level: "beginner"
    },
    {
      id: "gr_请+人+动词",
      label: "请 + 人 + 动词",
      explainKo: "사람에게 정중하게 요청할 때 사용합니다.",
      patterns: ["请 + 人 + 动词"],
      examples: ["请大家听", "请你说", "请老师讲"],
      level: "beginner"
    },
    {
      id: "gr_让+人+动词",
      label: "让 + 人 + 动词",
      explainKo: "사람에게 어떤 행동을 하게 하다. 사역의 의미를 나타냅니다.",
      patterns: ["让 + 人 + 动词"],
      examples: ["让我们开始", "让他来", "让老师讲"],
      level: "intermediate"
    },
    {
      id: "gr_开始+吧",
      label: "开始 + 吧",
      explainKo: "시작하자, 시작해봅시다. 권유의 의미를 나타냅니다.",
      patterns: ["动词 + 吧"],
      examples: ["开始吧", "走吧", "吃吧"],
      level: "beginner"
    },
    {
      id: "gr_现在+让+人+动词",
      label: "现在 + 让 + 人 + 动词",
      explainKo: "지금 ~하게 하자. 현재 시점에서 권유를 나타냅니다.",
      patterns: ["现在 + 让 + 人 + 动词"],
      examples: ["现在让我们开始", "现在让他来", "现在让老师讲"],
      level: "intermediate"
    },
    {
      id: "gr_开始+宾语",
      label: "开始 + 宾语",
      explainKo: "무엇을 시작하다는 의미를 나타냅니다.",
      patterns: ["开始 + 名词"],
      examples: ["开始游戏", "开始学习", "开始工作"],
      level: "beginner"
    },
    {
      id: "gr_选择+宾语",
      label: "选择 + 宾语",
      explainKo: "무엇을 선택하다는 의미를 나타냅니다.",
      patterns: ["选择 + 名词"],
      examples: ["选择答案", "选择朋友", "选择工作"],
      level: "beginner"
    },
    {
      id: "gr_第+数量+名词",
      label: "第 + 数量 + 名词",
      explainKo: "순서를 나타내는 표현입니다.",
      patterns: ["第 + 数词 + 量词 + 名词"],
      examples: ["第一个问题", "第二本书", "第三个人"],
      level: "beginner"
    },
    {
      id: "gr_听+补语",
      label: "听 + 补语",
      explainKo: "듣기의 결과나 정도를 나타내는 보어입니다.",
      patterns: ["听 + 形容词"],
      examples: ["听清楚", "听明白", "听仔细"],
      level: "intermediate"
    },
    {
      id: "gr_告诉+人+宾语",
      label: "告诉 + 人 + 宾语",
      explainKo: "사람에게 무엇을 알려주다.",
      patterns: ["告诉 + 人 + 名词"],
      examples: ["告诉我答案", "告诉老师问题", "告诉朋友消息"],
      level: "beginner"
    },
    {
      id: "gr_明白+了",
      label: "明白 + 了",
      explainKo: "이해했다는 완료 상태를 나타냅니다.",
      patterns: ["明白 + 了"],
      examples: ["明白了", "不明白", "明白了吗"],
      level: "beginner"
    },
    {
      id: "gr_好+现在+动词",
      label: "好 + 现在 + 动词",
      explainKo: "좋아, 이제 ~하자. 동의 후 행동을 제안합니다.",
      patterns: ["好 + 现在 + 动词"],
      examples: ["好，现在开始", "好，现在说", "好，现在做"],
      level: "beginner"
    },
    {
      id: "gr_祝+人+名词",
      label: "祝 + 人 + 名词",
      explainKo: "사람에게 축복이나 소원을 빕니다.",
      patterns: ["祝 + 人 + 名词"],
      examples: ["祝你好运", "祝你生日快乐", "祝你成功"],
      level: "intermediate"
    },
    {
      id: "gr_太+形容词+了",
      label: "太 + 形容词 + 了",
      explainKo: "너무 ~하다. 강조의 의미를 나타냅니다.",
      patterns: ["太 + 形容词 + 了"],
      examples: ["太好了", "太可怕了", "太棒了"],
      level: "beginner"
    },
    {
      id: "gr_感谢+人+动词",
      label: "感谢 + 人 + 动词",
      explainKo: "사람에게 무엇을 해준 것에 감사하다.",
      patterns: ["感谢 + 人 + 动词"],
      examples: ["感谢你帮助", "感谢老师教导", "感谢朋友支持"],
      level: "beginner"
    },
    {
      id: "gr_表演+宾语",
      label: "表演 + 宾语",
      explainKo: "무엇을 연기하다, 공연하다.",
      patterns: ["表演 + 名词"],
      examples: ["表演节目", "表演舞蹈", "表演戏剧"],
      level: "intermediate"
    },
    {
      id: "gr_拥抱+宾语",
      label: "拥抱 + 宾语",
      explainKo: "무엇을 안아주다.",
      patterns: ["拥抱 + 名词"],
      examples: ["拥抱朋友", "拥抱孩子", "拥抱妈妈"],
      level: "beginner"
    },
    {
      id: "gr_可以+动词",
      label: "可以 + 动词",
      explainKo: "~할 수 있다. 가능성을 나타냅니다.",
      patterns: ["可以 + 动词"],
      examples: ["可以看到", "可以听到", "可以做到"],
      level: "beginner"
    },
    {
      id: "gr_有+名词",
      label: "有 + 名词",
      explainKo: "무엇이 있다. 존재를 나타냅니다.",
      patterns: ["有 + 名词"],
      examples: ["有桌子", "有水", "有朋友"],
      level: "beginner"
    },
    {
      id: "gr_每组+名词",
      label: "每组 + 名词",
      explainKo: "각 팀의 무엇. 그룹 단위를 나타냅니다.",
      patterns: ["每组 + 名词"],
      examples: ["每组搭档", "每组代表", "每组学生"],
      level: "intermediate"
    },
    {
      id: "gr_轮流+动词",
      label: "轮流 + 动词",
      explainKo: "번갈아 ~하다. 순서를 나타냅니다.",
      patterns: ["轮流 + 动词"],
      examples: ["轮流做", "轮流发言", "轮流休息"],
      level: "intermediate"
    },
    {
      id: "gr_先+动词",
      label: "先 + 动词",
      explainKo: "먼저 ~하다. 순서를 나타냅니다.",
      patterns: ["先 + 动词"],
      examples: ["先做", "先说", "先走"],
      level: "beginner"
    },
    {
      id: "gr_跳到+名词",
      label: "跳到 + 名词",
      explainKo: "어디로 뛰어오르다.",
      patterns: ["跳到 + 名词"],
      examples: ["跳到桌子上", "跳到床上", "跳到台上"],
      level: "beginner"
    },
    {
      id: "gr_也+动词",
      label: "也 + 动词",
      explainKo: "~도 하다. 추가를 나타냅니다.",
      patterns: ["也 + 动词"],
      examples: ["也去", "也做", "也来"],
      level: "beginner"
    },
    {
      id: "gr_站立+时间",
      label: "站立 + 时间",
      explainKo: "얼마나 오래 서 있다.",
      patterns: ["站立 + 时间词"],
      examples: ["站立五分钟", "站立很久", "站立一会儿"],
      level: "beginner"
    },
    {
      id: "gr_就算+形容词",
      label: "就算 + 形容词",
      explainKo: "~로 간주하다, ~로 여기다.",
      patterns: ["就算 + 形容词"],
      examples: ["就算成功", "就算完成", "就算合格"],
      level: "intermediate"
    }
  ] as Grammar[],

  bookmarks: [
    {
      id: "bm_001",
      userId: "u_001",
      clipId: "clip_chinese_variety_1",
      t: 7.0,
      note: "무서움 표현",
      phraseId: "ph_001"
    },
    {
      id: "bm_002",
      userId: "u_001", 
      clipId: "clip_chinese_variety_1",
      t: 18.0,
      note: "감사 인사 및 모방 연기",
      phraseId: "ph_002"
    },
    {
      id: "bm_003",
      userId: "u_001",
      clipId: "clip_chinese_variety_1",
      t: 25.5,
      note: "게임 규칙 설명",
      phraseId: "ph_003"
    },
    {
      id: "bm_004",
      userId: "u_001",
      clipId: "clip_chinese_variety_1",
      t: 36.5,
      note: "게임 진행 방법",
      phraseId: "ph_004"
    }
  ] as Bookmark[],

  users: [
    {
      id: "u_001",
      role: "learner" as const,
      name: "춘식",
      email: "chunsik@example.com"
    },
    {
      id: "editor_01",
      role: "editor" as const,
      name: "에디터",
      email: "editor@example.com"
    },
    {
      id: "admin_01",
      role: "admin" as const,
      name: "관리자",
      email: "admin@example.com"
    }
  ] as User[]
};

// Helper functions for data access
export const getClips = () => mockData.clips;
export const getClipById = (id: string) => mockData.clips.find(clip => clip.id === id);
export const getPhrasesByClipId = (clipId: string) => mockData.phrases.filter(phrase => phrase.clipId === clipId);
export const getVocabById = (id: string) => mockData.vocabs.find(vocab => vocab.id === id);
export const getGrammarById = (id: string) => mockData.grammars.find(grammar => grammar.id === id);
export const getBookmarksByUserId = (userId: string) => mockData.bookmarks.filter(bookmark => bookmark.userId === userId);
export const getUserById = (id: string) => mockData.users.find(user => user.id === id);
