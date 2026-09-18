import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import PronunciationStudio from './components/PronunciationStudio';
import SkillsHubIndex from './components/SkillsHub/SkillsHubIndex';
import ArcadeZone from './components/ArcadeZone';
import VocabularyVault from './components/VocabularyVault';
import ProfileStats from './components/ProfileStats';
import { storageService } from './services/storageService';
import { soundFx } from './services/soundEffects';

export default function App() {
  const [theme, setThemeState] = useState(() => storageService.getTheme());
  const [activeTab, setActiveTab] = useState('speech-lab');
  const [userData, setUserData] = useState(() => storageService.getUserData());
  const [isMuted, setIsMuted] = useState(() => soundFx.isMuted());
  const [showLevelUpModal, setShowLevelUpModal] = useState(null);

  const isDark = theme === 'dark';

  // Synchronize theme with DOM
  useEffect(() => {
    storageService.setTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-950 text-slate-100 transition-colors duration-300 select-none overflow-x-hidden';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-900 transition-colors duration-300 select-none overflow-x-hidden';
    }
  }, [theme]);

  // XP & Leveling handler
  const handleAddXp = (amount) => {
    const { user, leveledUp } = storageService.addXP(amount);
    setUserData({ ...user });

    if (leveledUp) {
      soundFx.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      setShowLevelUpModal(user.level);
    }
  };

  return (
    <div className="min-h-screen relative font-sans flex flex-col">
      {/* 3D Interactive Three.js Background Canvas */}
      <ThreeBackground isDark={isDark} />

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          setTheme={setThemeState}
          userData={userData}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />

        {/* Dynamic Main Workspace */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {activeTab === 'speech-lab' && (
            <PronunciationStudio isDark={isDark} onAddXp={handleAddXp} />
          )}

          {activeTab === 'core-skills' && (
            <SkillsHubIndex isDark={isDark} onAddXp={handleAddXp} />
          )}

          {activeTab === 'arcade' && (
            <ArcadeZone isDark={isDark} onAddXp={handleAddXp} />
          )}

          {activeTab === 'vocab' && (
            <VocabularyVault isDark={isDark} onAddXp={handleAddXp} />
          )}

          {activeTab === 'profile' && (
            <ProfileStats isDark={isDark} userData={userData} onAddXp={handleAddXp} />
          )}
        </main>

        {/* Sleek Footer with Bilingual Notice */}
        <footer className={`mt-auto py-6 border-t transition-colors text-center text-xs ${
          isDark ? 'border-slate-800/80 text-slate-500 bg-slate-950/70' : 'border-slate-200 text-slate-500 bg-white/70'
        } backdrop-blur-md`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-cyan-400">LingoSphere 3D</span>
              <span className="text-[11px] font-light">Interactive English Cyber-Platform</span>
            </div>

            <p className="text-[11px] font-light">
              Made for ambitious learners • O‘rganing, o‘ynang va talaffuzingizni charxlang!
            </p>
          </div>
        </footer>

      </div>

      {/* Level Up Celebration Modal */}
      {showLevelUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-8 rounded-3xl border border-cyan-400/50 bg-slate-900 text-center space-y-4 shadow-2xl relative shadow-cyan-500/20">
            <button
              onClick={() => setShowLevelUpModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-cyan-500/30 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-black text-white">
              LEVEL UP! / DARAJA OSHDI!
            </h3>
            <p className="text-sm font-light text-cyan-300">
              Tabriklaymiz! Siz <span className="font-bold text-white">{showLevelUpModal}-Darajaga</span> ko‘tarildingiz!
            </p>

            <button
              onClick={() => setShowLevelUpModal(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
            >
              Claim Rewards & Continue / Davom etish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
