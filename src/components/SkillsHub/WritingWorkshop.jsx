import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit3, 
  Zap, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle,
  Award,
  ArrowRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';
import { SPEED_TYPING_PASSAGES, ERROR_SURGEON_PUZZLES, SENTENCE_UPGRADES } from '../../data/writingData';

export default function WritingWorkshop({ isDark, onAddXp }) {
  const [activeTab, setActiveTab] = useState('speed-typing'); // 'speed-typing', 'error-surgeon', 'upgrade'

  // Speed Typing State
  const [passageIndex, setPassageIndex] = useState(0);
  const currentPassage = SPEED_TYPING_PASSAGES[passageIndex];
  const [typedChars, setTypedChars] = useState('');
  const [typingStarted, setTypingStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);

  // Error Surgeon State
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = ERROR_SURGEON_PUZZLES[puzzleIndex];
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(null);
  const [userFixInput, setUserFixInput] = useState('');
  const [fixSuccess, setFixSuccess] = useState(null);

  // Typing logic
  const handleTypingInput = (e) => {
    const val = e.target.value;
    if (isCompleted) return;

    if (!typingStarted) {
      setTypingStarted(true);
      setStartTime(Date.now());
    }

    soundFx.playKeystroke();
    setTypedChars(val);

    // Calculate accuracy
    const targetSub = currentPassage.text.slice(0, val.length);
    let correctCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetSub[i]) correctCount++;
    }
    const acc = val.length > 0 ? Math.round((correctCount / val.length) * 100) : 100;
    setAccuracy(acc);

    // Calculate live WPM
    if (startTime) {
      const minutes = (Date.now() - startTime) / 1000 / 60;
      const words = val.length / 5;
      setWpm(Math.round(words / Math.max(0.05, minutes)));
    }

    // Check completion
    if (val === currentPassage.text) {
      setIsCompleted(true);
      soundFx.playLevelUp();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.7 } });
      if (onAddXp) onAddXp(40);
    }
  };

  const resetTyping = () => {
    soundFx.playClick();
    setTypedChars('');
    setTypingStarted(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
  };

  // Error Surgeon Logic
  const handleSelectToken = (idx) => {
    soundFx.playClick();
    setSelectedTokenIdx(idx);
    setUserFixInput('');
    setFixSuccess(null);
  };

  const handleApplyFix = () => {
    const targetToken = currentPuzzle.sentenceParts[selectedTokenIdx];
    if (!targetToken) return;

    if (targetToken.isError) {
      const userClean = userFixInput.trim().toLowerCase();
      const expectedClean = targetToken.correct.trim().toLowerCase();

      if (userClean === expectedClean) {
        soundFx.playSuccess();
        setFixSuccess({
          valid: true,
          message: `To‘g‘ri! "${currentPuzzle.ruleTitleUz}" qoidasiga ko‘ra: ${targetToken.reasonUz}`
        });
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
        if (onAddXp) onAddXp(30);
      } else {
        soundFx.playError();
        setFixSuccess({
          valid: false,
          message: `Xato. To‘g‘ri variant "${targetToken.correct}" bo‘lishi kerak edi.`
        });
      }
    } else {
      soundFx.playError();
      setFixSuccess({
        valid: false,
        message: 'Bu so‘zda xatolik yo‘q. Boshqa so‘zni tekshirib ko‘ring!'
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <Edit3 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Writing Workshop & Grammar Surgeon
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Precision English Writing Arena
            </h2>
            <p className={`text-xs sm:text-sm font-light mt-1 ${isDark ? 'text-amber-300/80' : 'text-amber-700'}`}>
              Tez yozish musobaqasi, grammatik xatolarni tuzatish va jumlalarni boyitish
            </p>
          </div>

          {/* Sub-modes */}
          <div className="flex items-center space-x-2 bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'speed-typing', en: 'Speed Typing', uz: 'Tez Yozish' },
              { id: 'error-surgeon', en: 'Error Surgeon', uz: 'Xatolar Xirurgi' },
              { id: 'upgrade', en: 'Sentence Upgrade', uz: 'Jumlani Boyitish' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 shadow-md'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex flex-col">
                  <span>{tab.en}</span>
                  <span className="text-[10px] font-light opacity-80">{tab.uz}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: SPEED TYPING */}
      {activeTab === 'speed-typing' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          {/* Stats Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Typing Speed</span>
                <span className="text-2xl font-black text-amber-400">{wpm} WPM</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Accuracy</span>
                <span className={`text-2xl font-black ${accuracy >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {accuracy}%
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Difficulty</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                  {currentPassage.difficulty}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={resetTyping}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300"
                title="Reset test"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setPassageIndex((prev) => (prev + 1) % SPEED_TYPING_PASSAGES.length);
                  resetTyping();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Next Text / Keyingi Matn →
              </button>
            </div>
          </div>

          {/* Target Text with Character-by-Character Highlighting */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-lg sm:text-xl font-mono leading-relaxed select-none">
            {currentPassage.text.split('').map((char, i) => {
              const typedChar = typedChars[i];
              let colorClass = 'text-slate-500';
              if (typedChar !== undefined) {
                colorClass = typedChar === char ? 'text-emerald-400' : 'bg-red-500/30 text-red-400';
              } else if (i === typedChars.length) {
                colorClass = 'border-b-2 border-amber-400 text-white animate-pulse';
              }
              return (
                <span key={i} className={colorClass}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Typing Input */}
          <div>
            <textarea
              rows={3}
              value={typedChars}
              onChange={handleTypingInput}
              disabled={isCompleted}
              placeholder="Start typing the text above as fast and accurately as you can..."
              className={`w-full p-4 rounded-2xl border text-lg font-mono focus:outline-none transition-all ${
                isDark ? 'bg-slate-950 border-slate-700 text-white focus:border-amber-400' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
              }`}
            />
          </div>

          {isCompleted && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 text-center space-y-3">
              <h3 className="text-2xl font-black text-emerald-400">
                🎉 Sprint Completed! You clocked {wpm} WPM!
              </h3>
              <p className="text-xs text-slate-300 font-light">
                Ajoyib natija! Siz bu matnni {accuracy}% aniqlik bilan yozib tugatdingiz va 40 XP qo‘lga kiritdingiz!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ERROR SURGEON */}
      {activeTab === 'error-surgeon' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Puzzle {puzzleIndex + 1} of {ERROR_SURGEON_PUZZLES.length}: {currentPuzzle.ruleTitle}</span>
            </div>
            <h3 className="text-xl font-bold">Find and Fix the Deliberate Grammatical Error</h3>
            <p className="text-xs font-light text-slate-400">
              Ushbu gapda bitta grammatik xato bor. Xato so‘z ustiga bosing va to‘g‘rilang!
            </p>
          </div>

          {/* Interactive Clickable Sentence Words */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2.5 text-lg font-medium">
            {currentPuzzle.sentenceParts.map((part, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectToken(idx)}
                className={`px-3 py-1.5 rounded-xl border transition-all ${
                  selectedTokenIdx === idx
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-md'
                    : isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                {part.text}
              </button>
            ))}
          </div>

          {/* Fix Input box */}
          {selectedTokenIdx !== null && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Selected Word: <span className="text-white font-mono">"{currentPuzzle.sentenceParts[selectedTokenIdx].text}"</span>. Replace with:
                  </label>
                  <input
                    type="text"
                    value={userFixInput}
                    onChange={(e) => setUserFixInput(e.target.value)}
                    placeholder="Type correct word or leave blank if word should be deleted..."
                    className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 focus:border-amber-400' : 'bg-white border-slate-200 focus:border-amber-500'
                    }`}
                  />
                </div>

                <button
                  onClick={handleApplyFix}
                  className="w-full sm:w-auto px-6 py-3 mt-4 sm:mt-5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-black text-xs shadow-md"
                >
                  Verify Fix / Tekshirish
                </button>
              </div>

              {fixSuccess && (
                <div className={`p-4 rounded-xl border text-xs font-semibold ${
                  fixSuccess.valid
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/15 border-red-500/40 text-red-300'
                }`}>
                  {fixSuccess.message}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => {
                soundFx.playClick();
                setPuzzleIndex((prev) => (prev + 1) % ERROR_SURGEON_PUZZLES.length);
                setSelectedTokenIdx(null);
                setUserFixInput('');
                setFixSuccess(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Next Grammar Puzzle / Keyingi Mashq →
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SENTENCE UPGRADE */}
      {activeTab === 'upgrade' && (
        <div className="space-y-6">
          {SENTENCE_UPGRADES.map(item => (
            <div
              key={item.id}
              className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Basic / Oddiy Jumla:
                </span>
                <p className="text-lg font-bold text-slate-300">
                  "{item.basic}"
                </p>
                <p className="text-xs font-light text-slate-400">
                  {item.basicUz}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Upgraded Professional Versions / Yuqori Darajali Muqobillari:
                </span>

                {item.upgrades.map((upg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border space-y-1 ${
                      isDark ? 'bg-slate-950/60 border-cyan-500/20' : 'bg-sky-50/50 border-sky-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                        {upg.level}
                      </span>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          speechService.speak(upg.text);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center space-x-1"
                      >
                        <span>Listen / Eshitish</span>
                      </button>
                    </div>

                    <p className="text-base font-semibold text-white">
                      "{upg.text}"
                    </p>
                    <p className="text-xs font-light text-cyan-200/80">
                      {upg.uz}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
