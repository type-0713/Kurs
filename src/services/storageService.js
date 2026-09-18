// LocalStorage persistence service for XP, Streaks, Custom Words, Themes, Daily Grades, and Activities

const KEYS = {
  USER_DATA: 'lingosphere_user_data',
  CUSTOM_WORDS: 'lingosphere_custom_words',
  THEME: 'lingosphere_theme',
  STATS: 'lingosphere_stats',
  BADGES: 'lingosphere_badges',
  DAILY_ACTIVITIES: 'lingosphere_daily_activities',
  DAILY_GOALS: 'lingosphere_daily_goals'
};

const DEFAULT_USER_DATA = {
  xp: 340,
  level: 2,
  streak: 5,
  lastDate: new Date().toDateString(),
  gems: 65
};

const DEFAULT_STATS = {
  wordsLearned: 24,
  gamesPlayed: 8,
  speakingScoreAvg: 92,
  readingWpmAvg: 165,
  dictationsCompleted: 5
};

const DEFAULT_ACTIVITIES = [
  {
    id: 'act-1',
    time: '18:45',
    type: 'speech',
    title: 'Neural Speech Lab Practice',
    titleUz: 'Nutq laboratoriyasida talaffuz mashqi',
    score: '96% Accuracy',
    scoreVal: 96,
    xp: '+35 XP',
    icon: 'Mic'
  },
  {
    id: 'act-2',
    time: '18:15',
    type: 'reading',
    title: 'Read: The AI Renaissance',
    titleUz: 'AI Renessansi maqolasini o‘qish & test',
    score: '100% Quiz (3/3)',
    scoreVal: 100,
    xp: '+50 XP',
    icon: 'BookOpen'
  },
  {
    id: 'act-3',
    time: '17:30',
    type: 'arcade',
    title: 'Cyber Meteor Defender Victory',
    titleUz: 'Meteorlar jangida g‘alaba',
    score: '400 PTS',
    scoreVal: 90,
    xp: '+40 XP',
    icon: 'Flame'
  },
  {
    id: 'act-4',
    time: '16:50',
    type: 'vocab',
    title: 'Added New Custom Word: "Resilience"',
    titleUz: 'Shaxsiy lug‘atga yangi so‘z qo‘shildi',
    score: 'Saved',
    scoreVal: 85,
    xp: '+20 XP',
    icon: 'Sparkles'
  }
];

const DEFAULT_GOALS = [
  { id: 'g1', title: 'Speech Practice with Microphone', titleUz: 'Mikrofonda talaffuz mashqi', completed: true, target: 1 },
  { id: 'g2', title: 'Inspect & Learn 3 Vocabulary Words', titleUz: '3 ta yangi so‘zni o‘rganish', completed: true, target: 3 },
  { id: 'g3', title: 'Survive 1 Cyber Arcade Game', titleUz: '1 ta kiber-o‘yinda qatnashish', completed: true, target: 1 },
  { id: 'g4', title: 'Complete 1 Speed Typing Sprint', titleUz: 'Tez yozish mashqini bajarish', completed: false, target: 1 }
];

const BADGES_LIST = [
  { id: 'first_word', title: 'First Word', uz: 'Birinchi So‘z', desc: 'Add or master your first English word', icon: 'Sparkles', unlocked: true },
  { id: 'speech_master', title: 'Speech Maestro', uz: 'Talaffuz Ustasi', desc: 'Score 90%+ on pronunciation scanner', icon: 'Mic', unlocked: true },
  { id: 'speed_demon', title: 'Speed Demon', uz: 'Tezlik Qahramoni', desc: 'Achieve 40+ WPM in Writing Arena', icon: 'Zap', unlocked: true },
  { id: 'meteor_slayer', title: 'Meteor Slayer', uz: 'Meteorlar Qotili', desc: 'Survive round 5 in Meteor Defender', icon: 'Flame', unlocked: true },
  { id: 'polyglot', title: 'Polyglot Scout', uz: 'So‘z Zargari', desc: 'Collect 50 words in your Vocab Vault', icon: 'BookOpen', unlocked: false },
  { id: 'listening_pro', title: 'Ear of Gold', uz: 'Oltin Quloq', desc: 'Complete 3 dictations without errors', icon: 'Headphones', unlocked: true },
  { id: 'night_owl', title: 'Cyber Learner', uz: 'Kiber O‘quvchi', desc: 'Practice in both Dark and Light modes', icon: 'Moon', unlocked: true }
];

export const storageService = {
  getUserData() {
    try {
      const data = localStorage.getItem(KEYS.USER_DATA);
      if (!data) return DEFAULT_USER_DATA;
      return { ...DEFAULT_USER_DATA, ...JSON.parse(data) };
    } catch {
      return DEFAULT_USER_DATA;
    }
  },

  saveUserData(data) {
    try {
      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save user data:', e);
    }
  },

  addXP(amount) {
    const user = this.getUserData();
    user.xp += amount;
    const newLevel = Math.floor(user.xp / 250) + 1;
    const leveledUp = newLevel > user.level;
    user.level = newLevel;
    user.gems += Math.floor(amount / 10);
    this.saveUserData(user);
    return { user, leveledUp };
  },

  getCustomWords() {
    try {
      const words = localStorage.getItem(KEYS.CUSTOM_WORDS);
      return words ? JSON.parse(words) : [
        {
          id: 'cw-1',
          word: 'Resilience',
          ipa: '/rɪˈzɪl.jəns/',
          uz: 'Chidamlilik, matonat',
          example: 'She showed great resilience in learning English every day.',
          exampleUz: 'U har kuni ingliz tilini o‘rganishda katta matonat ko‘rsatdi.',
          category: 'Personal',
          createdAt: new Date().toISOString()
        },
        {
          id: 'cw-2',
          word: 'Breakthrough',
          ipa: '/ˈbreɪk.θruː/',
          uz: 'Katta yutuq, burilish nuqtasi',
          example: 'Practicing speaking daily was a major breakthrough for him.',
          exampleUz: 'Har kuni gapirishni mashq qilish u uchun katta burilish bo‘ldi.',
          category: 'Personal',
          createdAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  },

  saveCustomWord(wordObj) {
    const words = this.getCustomWords();
    const newWord = {
      ...wordObj,
      id: 'cw-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    words.unshift(newWord);
    try {
      localStorage.setItem(KEYS.CUSTOM_WORDS, JSON.stringify(words));
    } catch (e) {
      console.warn('Failed to save custom word:', e);
    }
    
    // Log activity
    this.addDailyActivity({
      type: 'vocab',
      title: `Added "${wordObj.word}" to Vault`,
      titleUz: `Lug‘atga yangi so‘z qo‘shildi: "${wordObj.word}"`,
      score: '100%',
      scoreVal: 100,
      xp: '+20 XP',
      icon: 'Sparkles'
    });

    return newWord;
  },

  deleteCustomWord(id) {
    const words = this.getCustomWords().filter(w => w.id !== id);
    try {
      localStorage.setItem(KEYS.CUSTOM_WORDS, JSON.stringify(words));
    } catch (e) {
      console.warn('Failed to delete word:', e);
    }
    return words;
  },

  getTheme() {
    try {
      return localStorage.getItem(KEYS.THEME) || 'dark';
    } catch {
      return 'dark';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch (e) {
      console.warn('Failed to set theme:', e);
    }
  },

  getStats() {
    try {
      const stats = localStorage.getItem(KEYS.STATS);
      return stats ? { ...DEFAULT_STATS, ...JSON.parse(stats) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  },

  updateStats(partialStats) {
    const current = this.getStats();
    const updated = { ...current, ...partialStats };
    try {
      localStorage.setItem(KEYS.STATS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update stats:', e);
    }
    return updated;
  },

  getBadges() {
    try {
      const saved = localStorage.getItem(KEYS.BADGES);
      return saved ? JSON.parse(saved) : BADGES_LIST;
    } catch {
      return BADGES_LIST;
    }
  },

  unlockBadge(badgeId) {
    const badges = this.getBadges();
    const target = badges.find(b => b.id === badgeId);
    if (target && !target.unlocked) {
      target.unlocked = true;
      try {
        localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
      } catch (e) {
        console.warn('Failed to save badge:', e);
      }
      return target;
    }
    return null;
  },

  // Daily Activities Log
  getDailyActivities() {
    try {
      const acts = localStorage.getItem(KEYS.DAILY_ACTIVITIES);
      return acts ? JSON.parse(acts) : DEFAULT_ACTIVITIES;
    } catch {
      return DEFAULT_ACTIVITIES;
    }
  },

  addDailyActivity({ type, title, titleUz, score = 'Done', scoreVal = 90, xp = '+20 XP', icon = 'Sparkles' }) {
    const activities = this.getDailyActivities();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newAct = {
      id: 'act-' + Date.now(),
      time: timeStr,
      type,
      title,
      titleUz,
      score,
      scoreVal,
      xp,
      icon
    };

    activities.unshift(newAct);
    // Keep max 15 recent items
    const trimmed = activities.slice(0, 15);
    try {
      localStorage.setItem(KEYS.DAILY_ACTIVITIES, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to save activity:', e);
    }
    return trimmed;
  },

  // Daily Grade Calculator
  getDailyGrade() {
    const activities = this.getDailyActivities();
    if (!activities || activities.length === 0) {
      return {
        letter: 'B',
        percentage: 82,
        title: 'Good Start / Yaxshi Boshlanish',
        descriptionUz: 'Bugun yana 2 ta mashq bajaring va A+ a‘lo bahoni qo‘lga kiriting!',
        color: 'from-blue-500 to-cyan-500',
        textColor: 'text-cyan-400'
      };
    }

    const totalVal = activities.reduce((acc, curr) => acc + (curr.scoreVal || 85), 0);
    const avg = Math.round(totalVal / activities.length);
    const activityBonus = Math.min(10, activities.length * 2);
    const finalScore = Math.min(100, Math.max(60, avg + activityBonus));

    if (finalScore >= 94) {
      return {
        letter: 'A+',
        percentage: finalScore,
        title: 'Mastery Level / A‘lo Daraja',
        descriptionUz: 'Fantastik natija! Bugungi barcha mashg‘ulotlarni mutlaq yuqori aniqlikda bajardingiz!',
        color: 'from-emerald-400 to-cyan-500',
        textColor: 'text-emerald-400',
        stars: 5
      };
    } else if (finalScore >= 88) {
      return {
        letter: 'A',
        percentage: finalScore,
        title: 'Excellent / Zo‘r Natija',
        descriptionUz: 'Juda yaxshi! Talaffuz va o‘qish ko‘nikmalaringiz sezilarli darajada o‘smoqda.',
        color: 'from-cyan-400 to-blue-500',
        textColor: 'text-cyan-400',
        stars: 5
      };
    } else if (finalScore >= 80) {
      return {
        letter: 'B+',
        percentage: finalScore,
        title: 'Very Good / Yaxshi Rivojlanish',
        descriptionUz: 'Yaxshi sur‘at! Kunlik maqsadlarni to‘liq yakunlash uchun yana bitta o‘yin o‘ynang.',
        color: 'from-purple-400 to-indigo-500',
        textColor: 'text-purple-400',
        stars: 4
      };
    } else {
      return {
        letter: 'B',
        percentage: finalScore,
        title: 'Progressing / Faol Harakat',
        descriptionUz: 'O‘rganishda davom eting, muntazamlik sizni eng yuqori bahoga olib chiqadi!',
        color: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-400',
        stars: 3
      };
    }
  },

  // Daily Goals
  getDailyGoals() {
    try {
      const goals = localStorage.getItem(KEYS.DAILY_GOALS);
      return goals ? JSON.parse(goals) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  },

  toggleGoal(id) {
    const goals = this.getDailyGoals();
    const target = goals.find(g => g.id === id);
    if (target) {
      target.completed = !target.completed;
      try {
        localStorage.setItem(KEYS.DAILY_GOALS, JSON.stringify(goals));
      } catch (e) {
        console.warn('Failed to save goal:', e);
      }
    }
    return goals;
  }
};
