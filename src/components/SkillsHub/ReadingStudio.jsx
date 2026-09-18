import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  RotateCcw, 
  Sparkles,
  HelpCircle,
  Play,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';
import { READING_ARTICLES } from '../../data/readingData';

export default function ReadingStudio({ isDark, onAddXp }) {
  const [selectedArticle, setSelectedArticle] = useState(READING_ARTICLES[0]);
  const [inspectedWord, setInspectedWord] = useState(null);
  const [inspectorPos, setInspectorPos] = useState({ x: 0, y: 0 });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);

  // WPM Tracker
  const [isReading, setIsReading] = useState(false);
  const [readStartTime, setReadStartTime] = useState(null);
  const [wpmScore, setWpmScore] = useState(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Instant Inspector Click Handler
  const handleWordClick = (wordRaw, event) => {
    soundFx.playClick();
    const cleanWord = wordRaw.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundData = selectedArticle.wordLookup[cleanWord] || {
      ipa: `/${cleanWord}/`,
      uz: `"${cleanWord}" so‘zi`,
      pos: 'word'
    };

    const rect = event.currentTarget.getBoundingClientRect();
    setInspectorPos({
      x: Math.min(window.innerWidth - 300, Math.max(16, rect.left)),
      y: rect.bottom + window.scrollY + 8
    });

    setInspectedWord({
      word: wordRaw.replace(/[^a-zA-Z]/g, ''),
      ...foundData
    });
  };

  const handleAddInspectedToVocab = () => {
    if (!inspectedWord) return;
    soundFx.playSuccess();
    storageService.saveCustomWord({
      word: inspectedWord.word,
      ipa: inspectedWord.ipa,
      uz: inspectedWord.uz,
      example: `Mastering the word "${inspectedWord.word}" expands your fluency.`,
      exampleUz: `"${inspectedWord.word}" so‘zini o‘zlashtirish nutqingizni boyitadi.`
    });
    setInspectedWord(null);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    if (onAddXp) onAddXp(15);
  };

  const handleFullAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
      setActiveSentenceIndex(-1);
      return;
    }

    soundFx.playClick();
    setIsPlayingAudio(true);
    const fullText = selectedArticle.paragraphs.join(' ');

    speechService.speak(fullText, {
      rate: 0.95,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => {
        setIsPlayingAudio(false);
        setActiveSentenceIndex(-1);
        soundFx.playSuccess();
        if (onAddXp) onAddXp(20);
      }
    });
  };

  const startReadingTracker = () => {
    setIsReading(true);
    setReadStartTime(Date.now());
    setWpmScore(null);
    soundFx.playClick();
  };

  const finishReadingTracker = () => {
    if (!readStartTime) return;
    const elapsedMinutes = (Date.now() - readStartTime) / 1000 / 60;
    const calculatedWpm = Math.round(selectedArticle.wordCount / Math.max(0.1, elapsedMinutes));
    setWpmScore(calculatedWpm);
    setIsReading(false);
    soundFx.playLevelUp();
    storageService.addDailyActivity({
      type: 'reading',
      title: `Read "${selectedArticle.title.slice(0, 20)}..."`,
      titleUz: `O‘qish tezligi: ${calculatedWpm} WPM`,
      score: `${calculatedWpm} WPM`,
      scoreVal: 95,
      xp: '+30 XP',
      icon: 'BookOpen'
    });
    if (onAddXp) onAddXp(30);
  };

  const handleQuizOption = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    soundFx.playClick();
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    soundFx.playSuccess();
    setQuizSubmitted(true);
    let correctCount = 0;
    selectedArticle.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correctCount++;
    });
    const xpBonus = correctCount === selectedArticle.quiz.length ? 50 : 20;
    storageService.addDailyActivity({
      type: 'reading',
      title: `Quiz: ${selectedArticle.title.slice(0, 20)}...`,
      titleUz: `Matn tushunish testi (${correctCount}/${selectedArticle.quiz.length})`,
      score: `${correctCount}/${selectedArticle.quiz.length} Correct`,
      scoreVal: Math.round((correctCount / selectedArticle.quiz.length) * 100),
      xp: `+${xpBonus} XP`,
      icon: 'BookOpen'
    });
    if (correctCount === selectedArticle.quiz.length) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      if (onAddXp) onAddXp(50);
    } else {
      if (onAddXp) onAddXp(20);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner & Article Picker */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Reading Studio & Instant Word Inspector
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedArticle.title}
            </h2>
            <p className={`text-xs sm:text-sm font-light mt-1 ${isDark ? 'text-emerald-300/80' : 'text-emerald-700'}`}>
              {selectedArticle.titleUz}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Audio Listen */}
            <button
              onClick={handleFullAudio}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all ${
                isPlayingAudio
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : isDark
                    ? 'bg-slate-800 border-cyan-500/30 text-cyan-300 hover:text-white'
                    : 'bg-sky-50 border-sky-300 text-sky-800'
              }`}
            >
              {isPlayingAudio ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Narration' : 'Listen Full Story'}</span>
            </button>

            {/* WPM Tracker Button */}
            {!isReading && wpmScore === null ? (
              <button
                onClick={startReadingTracker}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-md shadow-emerald-500/20"
              >
                <Clock className="w-4 h-4" />
                <span>Start WPM Speed Timer</span>
              </button>
            ) : isReading ? (
              <button
                onClick={finishReadingTracker}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center space-x-2 animate-bounce shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finished Reading! Calculate WPM</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Your Speed: {wpmScore} WPM</span>
              </div>
            )}
          </div>
        </div>

        {/* Article Selector Tabs */}
        <div className="flex space-x-3 overflow-x-auto pb-2 border-t border-slate-800 pt-4">
          {READING_ARTICLES.map((art) => (
            <button
              key={art.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedArticle(art);
                setQuizAnswers({});
                setQuizSubmitted(false);
                setWpmScore(null);
                setIsReading(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedArticle.id === art.id
                  ? isDark 
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                    : 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : isDark 
                    ? 'bg-slate-950/60 border-slate-800 text-slate-400' 
                    : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {art.title.split(' ')[0]}... ({art.level})
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Article Text */}
      <div className={`p-6 sm:p-10 rounded-3xl border leading-relaxed space-y-6 relative ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-md'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-medium text-cyan-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Tip: Tap ANY word to inspect pronunciation, IPA, and Uzbek translation!</span>
        </div>

        {selectedArticle.paragraphs.map((paragraph, pIdx) => {
          const words = paragraph.split(' ');
          return (
            <p key={pIdx} className="text-base sm:text-lg tracking-wide leading-8">
              {words.map((word, wIdx) => {
                const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                const isKeyWord = Boolean(selectedArticle.wordLookup[clean]);
                return (
                  <span
                    key={wIdx}
                    onClick={(e) => handleWordClick(word, e)}
                    className={`inline-block mx-1 cursor-pointer transition-all rounded px-1 -my-0.5 ${
                      isKeyWord
                        ? isDark
                          ? 'text-cyan-300 font-semibold border-b border-cyan-400/50 hover:bg-cyan-500/20 hover:scale-105'
                          : 'text-indigo-700 font-semibold border-b border-indigo-400 hover:bg-indigo-50 hover:scale-105'
                        : isDark
                          ? 'hover:text-cyan-200 hover:bg-slate-800'
                          : 'hover:text-indigo-900 hover:bg-slate-100'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          );
        })}
      </div>

      {/* Instant Word Inspector Floating Popup */}
      {inspectedWord && (
        <div 
          className="fixed z-50 animate-fadeIn"
          style={{ 
            left: `${Math.max(16, Math.min(window.innerWidth - 300, inspectorPos.x))}px`, 
            top: `${Math.min(window.innerHeight - 200, inspectorPos.y - window.scrollY)}px` 
          }}
        >
          <div className={`w-72 p-4 rounded-2xl border shadow-2xl ${
            isDark 
              ? 'bg-slate-950/95 border-cyan-500/50 shadow-cyan-950/80 text-white backdrop-blur-xl' 
              : 'bg-white border-sky-300 shadow-xl text-slate-900'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-base font-black text-cyan-400">
                  {inspectedWord.word}
                </h4>
                <p className="text-xs font-mono text-slate-400">
                  {inspectedWord.ipa}
                </p>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => speechService.speak(inspectedWord.word)}
                  className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setInspectedWord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs mb-3">
              <span className="text-[10px] text-purple-400 font-bold uppercase block">
                O‘zbekcha Ma‘nosi:
              </span>
              <p className="font-light text-slate-200 mt-0.5">
                {inspectedWord.uz}
              </p>
            </div>

            <button
              onClick={handleAddInspectedToVocab}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add to My Vocab / Lug‘atga qo‘shish</span>
            </button>
          </div>
        </div>
      )}

      {/* Comprehension Quiz Section */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <div className="flex flex-col">
            <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Article Comprehension Quiz
            </span>
            <span className={`text-xs font-light ${isDark ? 'text-purple-300/80' : 'text-purple-700'}`}>
              O‘qilgan matnni tushunish bo‘yicha savollar
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {selectedArticle.quiz.map((qItem, qIdx) => {
            const userAnswer = quizAnswers[qIdx];
            return (
              <div key={qIdx} className={`p-5 rounded-2xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-sm sm:text-base font-bold mb-1">
                  {qIdx + 1}. {qItem.question}
                </h4>
                <p className="text-xs font-light text-slate-400 mb-4">
                  {qItem.questionUz}
                </p>

                <div className="space-y-2">
                  {qItem.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isCorrect = optIdx === qItem.correct;
                    let optionStyle = isDark 
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-red-500/20 border-red-500 text-red-300 font-bold';
                      }
                    } else if (isSelected) {
                      optionStyle = isDark 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' 
                        : 'bg-sky-100 border-sky-400 text-sky-900 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleQuizOption(qIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300">
                    💡 Izoh: {qItem.explanationUz}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz */}
        {!quizSubmitted ? (
          <button
            onClick={submitQuiz}
            disabled={Object.keys(quizAnswers).length < selectedArticle.quiz.length}
            className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${
              Object.keys(quizAnswers).length === selectedArticle.quiz.length
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Submit Quiz & Claim XP / Natijani tekshirish
          </button>
        ) : (
          <button
            onClick={() => {
              setQuizAnswers({});
              setQuizSubmitted(false);
            }}
            className="w-full py-3 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Retry Quiz / Qaytadan yechish
          </button>
        )}
      </div>

    </div>
  );
}
