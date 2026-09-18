import React, { useState } from 'react';
import { BookOpen, Headphones, Mic, Edit3 } from 'lucide-react';
import { soundFx } from '../../services/soundEffects';
import ReadingStudio from './ReadingStudio';
import ListeningArena from './ListeningArena';
import SpeakingHub from './SpeakingHub';
import WritingWorkshop from './WritingWorkshop';

export default function SkillsHubIndex({ isDark, onAddXp }) {
  const [activeSkill, setActiveSkill] = useState('reading');

  const skills = [
    {
      id: 'reading',
      en: 'Reading Studio',
      uz: 'O‘qish Studiyasi',
      descUz: 'Jonli so‘z inspektori va maqolalar',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'listening',
      en: 'Listening Arena',
      uz: 'Tinglash Arenasi',
      descUz: 'Audio dialoglar va aqlli diktant',
      icon: Headphones,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'speaking',
      en: 'Speaking Hub',
      uz: 'Gapirish & AI Suhbatdosh',
      descUz: 'Ovozli AI muloqot va talaffuz',
      icon: Mic,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'writing',
      en: 'Writing Workshop',
      uz: 'Yozish Ustaxonasi',
      descUz: 'Tez yozish va xatolarni tuzatish',
      icon: Edit3,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const handleSkillSelect = (id) => {
    soundFx.playClick();
    setActiveSkill(id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 4 Skills Quick Switcher Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill) => {
          const Icon = skill.icon;
          const isSelected = activeSkill === skill.id;
          return (
            <button
              key={skill.id}
              onClick={() => handleSkillSelect(skill.id)}
              className={`p-4 sm:p-5 rounded-3xl border text-left transition-all duration-300 transform active:scale-95 ${
                isSelected
                  ? isDark
                    ? 'bg-slate-900/90 border-cyan-400 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-white border-sky-400 shadow-lg scale-[1.02]'
                  : isDark
                    ? 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800 text-slate-400'
                    : 'bg-white/70 hover:bg-white border-slate-200 text-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-tr ${skill.color} text-slate-950 font-bold shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex flex-col">
                <span className={`text-sm sm:text-base font-extrabold tracking-tight leading-tight ${
                  isSelected ? isDark ? 'text-white' : 'text-slate-900' : ''
                }`}>
                  {skill.en}
                </span>
                <span className="text-xs font-semibold text-cyan-400/90 mt-0.5 leading-tight">
                  {skill.uz}
                </span>
                <span className="text-[11px] font-light text-slate-400 mt-1 line-clamp-1">
                  {skill.descUz}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Active Skill Studio */}
      <div>
        {activeSkill === 'reading' && <ReadingStudio isDark={isDark} onAddXp={onAddXp} />}
        {activeSkill === 'listening' && <ListeningArena isDark={isDark} onAddXp={onAddXp} />}
        {activeSkill === 'speaking' && <SpeakingHub isDark={isDark} onAddXp={onAddXp} />}
        {activeSkill === 'writing' && <WritingWorkshop isDark={isDark} onAddXp={onAddXp} />}
      </div>

    </div>
  );
}
