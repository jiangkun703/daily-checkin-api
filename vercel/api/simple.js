/**
 * 每日签到 API - 简化版
 * 适合微信群聊使用的简单格式
 */

// 签到奖励配置
const REWARD_CONFIG = {
  // 基础积分奖励
  basePoints: 10,
  
  // 连续签到额外奖励
  streakBonus: {
    3: { points: 5, message: '连续3天奖励🎉' },
    7: { points: 10, message: '连续7天奖励🎉' },
    14: { points: 20, message: '连续14天奖励🎉' },
    30: { points: 50, message: '连续30天奖励🎉' },
  },
  
  // 每日幸运物品
  luckyItems: [
    '红包', '金币', '钻石', '福袋', '礼盒', '宝箱'
  ],
  
  // 幸运颜色
  luckyColors: ['红', '橙', '黄', '绿', '蓝', '紫', '金'],
  
  // 每日寄语
  dailyMessages: [
    '新的一天，新的开始！',
    '坚持就是胜利！',
    '今天又是美好的一天！',
    '签到打卡，好运连连！',
    '积少成多，聚沙成塔！',
    '每天进步一点点！',
    '坚持签到，收获满满！',
    '今日事，今日毕！',
    '好运从签到开始！',
    '持之以恒，必有回响！'
  ]
};

// 根据日期和用户ID生成伪随机数
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 计算连续签到天数
function calculateStreakDays(userId, currentDate) {
  const date = new Date(currentDate);
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const userHash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 生成1-30的"伪连续天数"
  const pseudoStreak = Math.floor(seededRandom(seed + userHash) * 30) + 1;
  return pseudoStreak;
}

// 生成每日签到奖励
function generateDailyReward(userId, streakDays, date = new Date()) {
  const seedBase = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const userHash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = seedBase + userHash;
  
  // 基础奖励
  let totalPoints = REWARD_CONFIG.basePoints;
  let bonusMessages = [];
  
  // 连续签到奖励
  for (const [days, bonus] of Object.entries(REWARD_CONFIG.streakBonus)) {
    if (streakDays >= parseInt(days)) {
      totalPoints += bonus.points;
      bonusMessages.push(bonus.message);
    }
  }
  
  // 随机幸运物品
  const luckyItem = REWARD_CONFIG.luckyItems[
    Math.floor(seededRandom(seed + 100) * REWARD_CONFIG.luckyItems.length)
  ];
  
  // 随机幸运颜色
  const luckyColor = REWARD_CONFIG.luckyColors[
    Math.floor(seededRandom(seed + 200) * REWARD_CONFIG.luckyColors.length)
  ];
  
  // 幸运数字（1-99）
  const luckyNumber = Math.floor(seededRandom(seed + 400) * 99) + 1;
  
  return {
    points: totalPoints,
    streakDays: streakDays,
    luckyItem: luckyItem,
    luckyColor: luckyColor,
    luckyNumber: luckyNumber,
    bonuses: bonusMessages
  };
}

// 格式化为微信群聊简单格式
function formatForGroupChat(userName, reward) {
  const starCount = Math.min(Math.floor(reward.streakDays / 7) + 1, 3);
  const stars = '⭐'.repeat(starCount);
  
  // 极简格式，适合微信群聊
  return `${userName} 签到成功 ${stars}

📅 连续签到：${reward.streakDays}天
💰 获得积分：+${reward.points}分
🎁 幸运物品：${reward.luckyItem}
🔢 幸运数字：${reward.luckyNumber}
🎨 幸运颜色：${reward.luckyColor}

${reward.bonuses.length > 0 ? reward.bonuses.join(' ') : ''}

✅ 签到完成！`;
}

// 更简单的格式（适合微信机器人）
function formatSimple(userName, reward) {
  return `[${userName}]签到成功

连续：${reward.streakDays}天
积分：+${reward.points}分
物品：${reward.luckyItem}
数字：${reward.luckyNumber}
颜色：${reward.luckyColor}

${reward.bonuses.length > 0 ? reward.bonuses.join(' ') : ''}`;
}

// Vercel Serverless 函数入口
export default function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 获取参数
  const msg = req.query.msg || '签到';
  const userId = req.query.userId || req.query.userid || req.query.uid || 'user001';
  const userName = req.query.userName || req.query.username || req.query.name || '用户';
  const format = req.query.format || 'simple'; // simple | groupchat
  
  // 如果不是签到请求，返回错误
  if (!msg.includes('签到') && !msg.includes('打卡') && !msg.includes('签')) {
    return res.status(400).json({
      code: 400,
      msg: '失败',
      data: '请发送"签到"或"打卡"进行签到'
    });
  }
  
  const currentDate = new Date();
  
  // 计算连续签到天数
  const streakDays = calculateStreakDays(userId, currentDate);
  
  // 生成每日奖励
  const reward = generateDailyReward(userId, streakDays, currentDate);
  
  // 根据格式返回
  let result;
  if (format === 'groupchat') {
    result = formatForGroupChat(userName, reward);
  } else {
    result = formatSimple(userName, reward);
  }
  
  res.status(200).send(result);
}