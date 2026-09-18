import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Mic2, 
  BookOpen, 
  Gamepad2, 
  Layers, 
  Diamond,
  Compass
} from 'lucide-react';
import { soundFx } from '../services/soundEffects';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  userData,
  isMuted,
  setIsMuted
}) {
  const isDark = theme === 'dark';

  const navItems = [
    {
      id: 'speech-lab',
      en: 'Speech Lab',
      uz: 'Talaffuz Laboratoriyasi',
      icon: Mic2,
      badge: 'TTS & Mic'
    },
    {
      id: 'core-skills',
      en: '4 Core Skills',
      uz: '4 Asosiy Ko‘nikma',
      icon: Compass,
      badge: 'Deep Study'
    },
    {
      id: 'arcade',
      en: 'Arcade Arena',
      uz: '8 Kiber O‘yinlar',
      icon: Gamepad2,
      badge: '8 Games'
    },
    {
      id: 'vocab',
      en: 'Vocab Vault',
      uz: 'Lug‘atlar & Shaxsiy',
      icon: BookOpen,
      badge: '3D Cards'
    },
    {
      id: 'profile',
      en: 'Achievements',
      uz: 'Yutuqlar & Unvon',
      icon: Award,
      badge: 'Badges'
    }
  ];

  const handleTabClick = (id) => {
    soundFx.playClick();
    setActiveTab(id);
  };

  const toggleSound = () => {
    const nextMute = soundFx.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) soundFx.playSuccess();
  };

  const toggleTheme = () => {
    soundFx.playClick();
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const xpProgress = Math.min(100, Math.round((userData.xp % 250) / 2.5));

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      isDark ? 'bg-slate-950/80 border-b border-cyan-500/20 shadow-lg shadow-cyan-950/20' : 'bg-white/85 border-b border-sky-200 shadow-md shadow-sky-100/50'
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleTabClick('speech-lab')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className={`relative p-2.5 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark 
                ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-slate-950 shadow-lg shadow-cyan-500/30' 
                : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
            }`}>
              <Sparkles className="w-6 h-6 animate-spin-slow" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xl sm:text-2xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  LingoSphere <span className={isDark ? 'text-cyan-400' : 'text-sky-600'}>3D</span>
                </span>
                <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full ${
                  isDark ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'bg-sky-100 text-sky-700 border border-sky-300'
                }`}>
                  Cyber Edition
                </span>
              </div>
              <p className={`text-[11px] font-light tracking-wide ${
                isDark ? 'text-cyan-300/70' : 'text-slate-500'
              }`}>
                Kiber Ingliz Tili Koinoti
              </p>
            </div>
          </div>

          {/* Gamification Stats Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Level & XP */}
            <div className={`px-3 py-1.5 rounded-xl flex items-center space-x-3 border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isDark ? 'text-cyan-400' : 'text-sky-600'}>Level {userData.level}</span>
                  <span className={`text-[10px] font-normal ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{userData.xp % 250}/250 XP</span>
                </div>
                <div className="w-24 h-1.5 bg-slate-700/40 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500" 
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 border ${
              isDark ? 'bg-slate-900/80 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}>
              <Flame className="w-4 h-4 animate-bounce" />
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">{userData.streak} Days</span>
                <span className="text-[9px] font-light leading-tight">Streak</span>
              </div>
            </div>

            {/* Gems */}
            <div className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 border ${
              isDark ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <Diamond className="w-4 h-4" />
              <span className="text-xs font-bold">{userData.gems}</span>
            </div>
          </div>

          {/* Quick Tools & Theme/Mute */}
          <div className="flex items-center space-x-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl transition-all border ${
                isDark 
                  ? 'bg-slate-900/70 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300'
              }`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all border ${
                isDark 
                  ? 'bg-slate-900/70 border-slate-800 text-amber-300 hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Crystal Mode' : 'Switch to Dark Cyber Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar with Bilingual Display */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-3 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex-shrink-0 flex items-center space-x-2.5 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 text-left border ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                      : 'bg-gradient-to-r from-sky-500/15 to-indigo-500/15 border-sky-400/60 shadow-md shadow-sky-500/10'
                    : isDark
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive 
                    ? isDark ? 'text-cyan-400' : 'text-sky-600'
                    : 'opacity-70'
                }`} />

                <div className="flex flex-col">
                  {/* English Top (Bold) */}
                  <span className={`text-xs sm:text-sm font-bold tracking-tight leading-tight ${
                    isActive
                      ? isDark ? 'text-cyan-300' : 'text-sky-900'
                      : ''
                  }`}>
                    {item.en}
                  </span>
                  {/* Uzbek Bottom (Thin, Small) */}
                  <span className={`text-[10px] sm:text-[11px] font-light leading-tight ${
                    isActive
                      ? isDark ? 'text-cyan-200/80' : 'text-sky-700'
                      : isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {item.uz}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
