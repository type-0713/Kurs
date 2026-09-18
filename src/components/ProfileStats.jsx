import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  Diamond, 
  Sparkles, 
  Mic, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  Lock,
  Headphones,
  Moon,
  Clock,
  Star,
  CheckSquare,
  Square,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../services/storageService';
import { soundFx } from '../services/soundEffects';

const ICON_MAP = {
  Sparkles,
  Mic,
  Zap,
  Flame,
  BookOpen,
  Headphones,
  Moon
};

export default function ProfileStats({ isDark, userData, onAddXp }) {
  const [activities, setActivities] = useState(() => storageService.getDailyActivities());
  const [goals, setGoals] = useState(() => storageService.getDailyGoals());
  const stats = storageService.getStats();
  const badges = storageService.getBadges();
  const dailyGrade = storageService.getDailyGrade();

  const getRankTitle = (lvl) => {
    if (lvl >= 10) return { en: 'Fluency Overlord', uz: 'Ingliz Tili Mutlaq Hukmdori' };
    if (lvl >= 7) return { en: 'Neural Polyglot', uz: 'Neyron Poliglot' };
    if (lvl >= 4) return { en: 'Cyber Linguist', uz: 'Kiber Tilshunos' };
    if (lvl >= 2) return { en: 'Matrix Scout', uz: 'Matritsa Razvedkachisi' };
    return { en: 'Cyber Novice', uz: 'Kiber Yangi O‘rganuvchi' };
  };

  const rank = getRankTitle(userData.level);

  // Handle goal toggle
  const handleToggleGoal = (id) => {
    soundFx.playClick();
    const updated = storageService.toggleGoal(id);
    setGoals([...updated]);

    const target = updated.find(g => g.id === id);
    if (target && target.completed) {
      soundFx.playSuccess();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      if (onAddXp) onAddXp(25);
    }
  };

  const completedGoalsCount = goals.filter(g => g.completed).length;
  const goalPercent = Math.round((completedGoalsCount / goals.length) * 100);

  // Weekly days simulation
  const weekDays = [
    { day: 'Mon', uz: 'Dush', score: 92, active: true },
    { day: 'Tue', uz: 'Sesh', score: 88, active: true },
    { day: 'Wed', uz: 'Chor', score: 95, active: true },
    { day: 'Thu', uz: 'Pay', score: 85, active: true },
    { day: 'Fri', uz: 'Juma', score: dailyGrade.percentage, active: true, today: true },
    { day: 'Sat', uz: 'Shan', score: 0, active: false },
    { day: 'Sun', uz: 'Yak', score: 0, active: false }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. TOP PROFILE & RANK HERO */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border-cyan-500/30 shadow-xl' 
          : 'bg-gradient-to-r from-sky-50 via-indigo-50 to-white border-sky-200 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/30">
            🧑‍🚀
          </div>

          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-2xl sm:text-3xl font-black">{rank.en}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LVL {userData.level}
              </span>
            </div>

            <p className="text-xs font-light text-cyan-300">
              🇺🇿 {rank.uz}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{userData.xp} Total XP</span>
              </div>

              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Flame className="w-4 h-4" />
                <span>{userData.streak} Days Streak</span>
              </div>

              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <Diamond className="w-4 h-4" />
                <span>{userData.gems} Cyber Gems</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC DAILY GRADE (KUNLIK BAHO) & 7-DAY ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BIG DAILY GRADE CARD (7 cols) */}
        <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-between ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-cyan-500/40 shadow-2xl shadow-cyan-950/50' 
            : 'bg-white border-sky-300 shadow-xl'
        }`}>
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-cyan-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
                    Official Daily Performance Grade
                  </span>
                  <span className="text-[11px] font-light text-slate-400">
                    Kunlik Baho & O‘zlashtirish Ko‘rsatkichi
                  </span>
                </div>
              </div>

              {/* 5 Stars */}
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Big Grade Badge and Score */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 my-4">
              {/* Huge Grade Box */}
              <div className={`w-28 h-28 rounded-3xl flex items-center justify-center p-1 bg-gradient-to-tr ${dailyGrade.color} shadow-2xl shadow-cyan-500/30`}>
                <div className="w-full h-full rounded-[22px] bg-slate-950/90 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-black ${dailyGrade.textColor} leading-none`}>
                    {dailyGrade.letter}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 mt-1">
                    {dailyGrade.percentage}%
                  </span>
                </div>
              </div>

              {/* Title & Uzbek description */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h3 className="text-2xl font-black text-white">
                    {dailyGrade.title.split('/')[0]}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Aktiv
                  </span>
                </div>

                <p className="text-xs font-light text-cyan-300">
                  🇺🇿 {dailyGrade.title.split('/')[1] || 'A‘lo Natija'}
                </p>

                <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed pt-1">
                  {dailyGrade.descriptionUz}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Sub-Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Pronunciation</span>
              <span className="text-base font-black text-emerald-400">94%</span>
              <span className="text-[9px] text-slate-500 block">Talaffuz</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Comprehension</span>
              <span className="text-base font-black text-cyan-400">98%</span>
              <span className="text-[9px] text-slate-500 block">Tushunish</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Activities Done</span>
              <span className="text-base font-black text-purple-400">{activities.length}</span>
              <span className="text-[9px] text-slate-500 block">Mashg‘ulotlar</span>
            </div>
          </div>
        </div>

        {/* 7-DAY ACTIVITY HEATMAP & PROGRESS (5 cols) */}
        <div className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  7-Day Consistency Map
                </span>
                <span className="text-[11px] font-light text-slate-400">
                  Haftalik Faollik Xaritasi
                </span>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{userData.streak} Days Streak</span>
            </span>
          </div>

          {/* 7-day visual bars */}
          <div className="flex items-end justify-between gap-2 h-40 pt-4">
            {weekDays.map((wd, i) => {
              const height = wd.active ? Math.max(25, wd.score) : 10;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {wd.active ? `${wd.score}%` : '0%'}
                  </span>

                  <div className="w-full bg-slate-800/60 rounded-xl h-24 flex items-end p-1 overflow-hidden">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${
                        wd.today
                          ? 'bg-gradient-to-t from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/30'
                          : wd.active
                            ? 'bg-cyan-500/70'
                            : 'bg-slate-700/30'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <div className="text-center">
                    <span className={`text-xs font-bold block ${wd.today ? 'text-cyan-400' : 'text-slate-300'}`}>
                      {wd.day}
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      {wd.uz}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs font-light text-purple-200 text-center">
            🚀 Haftaning 5 kunida uzluksiz faol bo‘ldingiz! Ajoyib intizom.
          </div>
        </div>

      </div>

      {/* 3. DAILY ACTIVITIES LOG (KUNLIK FOALLIKLAR) & DAILY GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TODAY'S ACTIVITIES STREAM (7 cols) */}
        <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  Today's Live Activity Stream
                </span>
                <span className="text-xs font-light text-cyan-300/80">
                  Bugungi Bajarilgan Barcha Mashg‘ulotlar Tarixi
                </span>
              </div>
            </div>

            <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {activities.length} Recorded
            </span>
          </div>

          {/* Activities list */}
          <div className="space-y-3">
            {activities.map((act) => {
              const IconComp = ICON_MAP[act.icon] || Sparkles;
              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                    isDark 
                      ? 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 hover:border-cyan-500/30' 
                      : 'bg-slate-50 hover:bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {act.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{act.time}</span>
                        </span>
                      </div>
                      <span className="text-[11px] font-light text-cyan-300/80 block">
                        {act.titleUz}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                      {act.score}
                    </span>
                    <span className="text-xs font-black text-cyan-400">
                      {act.xp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DAILY QUEST GOALS CHECKLIST (5 cols) */}
        <div className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  Daily Quests & Goals
                </span>
                <span className="text-xs font-light text-emerald-400/80">
                  Kunlik Vazifalar & Reja
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400">
              {completedGoalsCount}/{goals.length} ({goalPercent}%)
            </span>
          </div>

          {/* Goal Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>

          {/* Goals Checklist */}
          <div className="space-y-3">
            {goals.map((g) => (
              <div
                key={g.id}
                onClick={() => handleToggleGoal(g.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                  g.completed
                    ? isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300' : 'bg-emerald-50 border-emerald-200 text-slate-800'
                    : isDark ? 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="mt-0.5">
                  {g.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div className="flex-1">
                  <span className={`text-xs font-bold block ${g.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {g.title}
                  </span>
                  <span className="text-[10px] font-light text-slate-400 block">
                    {g.titleUz}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-cyan-400 mt-1">
                  +25 XP
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
            Barcha 4 ta vazifani yakunlang va qo‘shimcha 100 XP oling!
          </div>
        </div>

      </div>

      {/* 4. OVERALL STATS METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Words Learned', uz: 'O‘rganilgan So‘zlar', val: stats.wordsLearned, icon: BookOpen, color: 'text-cyan-400' },
          { label: 'Avg Speaking Score', uz: 'O‘rtacha Talaffuz', val: `${stats.speakingScoreAvg}%`, icon: Mic, color: 'text-purple-400' },
          { label: 'Reading Speed', uz: 'O‘qish Tezligi', val: `${stats.readingWpmAvg} WPM`, icon: Zap, color: 'text-amber-400' },
          { label: 'Games Played', uz: 'O‘ynalgan O‘yinlar', val: stats.gamesPlayed, icon: Award, color: 'text-emerald-400' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.val}</span>
              </div>
              <span className="text-xs font-bold text-slate-300 block">{stat.label}</span>
              <span className="text-[10px] font-light text-slate-400 block">{stat.uz}</span>
            </div>
          );
        })}
      </div>

      {/* 5. UNLOCKABLE BADGES */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div>
          <h3 className="text-xl font-black">Linguistic Achievements & Badges</h3>
          <p className="text-xs font-light text-slate-400">
            Vazifalarni bajarib nishonlarni oching va qo‘shimcha ballar to‘plang
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => {
            const Icon = ICON_MAP[b.icon] || Award;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border flex items-start space-x-3 transition-all ${
                  b.unlocked
                    ? isDark
                      ? 'bg-slate-950/80 border-cyan-500/30'
                      : 'bg-sky-50/50 border-sky-200'
                    : isDark
                      ? 'bg-slate-950/30 border-slate-800/60 opacity-50'
                      : 'bg-slate-100/50 border-slate-200 opacity-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  b.unlocked 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-slate-800 text-slate-600 border-slate-700'
                }`}>
                  {b.unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{b.title}</span>
                    {b.unlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-light text-cyan-400 block">
                    {b.uz}
                  </span>
                  <p className="text-[11px] font-light text-slate-400 mt-1">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
