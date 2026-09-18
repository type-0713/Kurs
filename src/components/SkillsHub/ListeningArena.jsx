import React, { useState } from 'react';
import { 
  Headphones, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff,
  Play,
  Award,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { LISTENING_DIALOGUES, DICTATION_EXERCISES, MINIMAL_PAIRS } from '../../data/listeningData';

export default function ListeningArena({ isDark, onAddXp }) {
  const [activeMode, setActiveMode] = useState('dialogues'); // 'dialogues', 'dictation', 'pairs'

  // Dialogue state
  const [selectedDialogue, setSelectedDialogue] = useState(LISTENING_DIALOGUES[0]);
  const [showTranscript, setShowTranscript] = useState(true);
  const [activeLineIdx, setActiveLineIdx] = useState(-1);

  // Dictation state
  const [dictationIndex, setDictationIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [dictationResult, setDictationResult] = useState(null);

  // Minimal pair state
  const [pairIndex, setPairIndex] = useState(0);
  const [pairFeedback, setPairFeedback] = useState(null);

  // Play line audio
  const handlePlayLine = (line, idx) => {
    soundFx.playClick();
    setActiveLineIdx(idx);
    speechService.speak(line.text, {
      rate: 0.95,
      onEnd: () => setActiveLineIdx(-1)
    });
  };

  // Play whole dialogue
  const handlePlayFullDialogue = () => {
    soundFx.playClick();
    let current = 0;
    const playNext = () => {
      if (current >= selectedDialogue.lines.length) {
        setActiveLineIdx(-1);
        soundFx.playSuccess();
        if (onAddXp) onAddXp(20);
        return;
      }
      setActiveLineIdx(current);
      speechService.speak(selectedDialogue.lines[current].text, {
        rate: 0.95,
        onEnd: () => {
          current++;
          setTimeout(playNext, 400);
        }
      });
    };
    playNext();
  };

  // Dictation Check
  const handleCheckDictation = () => {
    const currentEx = DICTATION_EXERCISES[dictationIndex];
    const cleanTarget = currentEx.sentence.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const cleanUser = typedInput.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

    const targetWords = cleanTarget.split(/\s+/);
    const userWords = cleanUser.split(/\s+/);

    let matchCount = 0;
    const diff = targetWords.map((tWord, i) => {
      const uWord = userWords[i];
      if (uWord === tWord) {
        matchCount++;
        return { word: tWord, status: 'correct' };
      } else if (!uWord) {
        return { word: tWord, status: 'missing' };
      } else {
        return { word: uWord, expected: tWord, status: 'wrong' };
      }
    });

    const score = Math.round((matchCount / targetWords.length) * 100);
    setDictationResult({ score, diff });

    if (score >= 90) {
      soundFx.playLevelUp();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      if (onAddXp) onAddXp(30);
    } else if (score >= 60) {
      soundFx.playSuccess();
      if (onAddXp) onAddXp(15);
    } else {
      soundFx.playError();
    }
  };

  // Minimal Pairs
  const currentPair = MINIMAL_PAIRS[pairIndex];
  const handleSelectPair = (wordChosen) => {
    const isCorrect = wordChosen.toLowerCase() === currentPair.target.toLowerCase();
    if (isCorrect) {
      soundFx.playSuccess();
      setPairFeedback({ correct: true, text: 'Awesome Ear! To‘g‘ri ilg‘adingiz!' });
      if (onAddXp) onAddXp(20);
    } else {
      soundFx.playError();
      setPairFeedback({ correct: false, text: `Afsuski, aytilgan so‘z "${currentPair.target}" edi.` });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Headphones className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Listening Arena & Smart Dictation
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Master Real-World English Listening
            </h2>
            <p className={`text-xs sm:text-sm font-light mt-1 ${isDark ? 'text-cyan-300/80' : 'text-sky-700'}`}>
              Haqiqiy audio dialoglar, aqlli diktant va fonetik quloq sinovi
            </p>
          </div>

          {/* Sub-modes Switcher */}
          <div className="flex items-center space-x-2 bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'dialogues', en: 'Dialogues', uz: 'Dialoglar' },
              { id: 'dictation', en: 'Smart Dictation', uz: 'Diktant' },
              { id: 'pairs', en: 'Minimal Pairs', uz: 'Quloq Sinovi' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveMode(tab.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeMode === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
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

      {/* MODE 1: DIALOGUES */}
      {activeMode === 'dialogues' && (
        <div className="space-y-6">
          {/* Dialogue selector bar */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              {LISTENING_DIALOGUES.map(dlg => (
                <button
                  key={dlg.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedDialogue(dlg);
                    setActiveLineIdx(-1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedDialogue.id === dlg.id
                      ? isDark ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-sky-100 border-sky-400 text-sky-900'
                      : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {dlg.title}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayFullDialogue}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play All Scene / Hammasini eshitish</span>
              </button>

              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`p-2 rounded-xl border text-xs flex items-center space-x-1.5 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}
                title={showTranscript ? 'Hide text' : 'Show text'}
              >
                {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{showTranscript ? 'Hide Text' : 'Show Text'}</span>
              </button>
            </div>
          </div>

          {/* Dialogue Lines */}
          <div className="space-y-4">
            {selectedDialogue.lines.map((line, idx) => {
              const isPlaying = activeLineIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handlePlayLine(line, idx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isPlaying
                      ? isDark
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'bg-sky-50 border-sky-400 shadow-md'
                      : isDark
                        ? 'bg-slate-900/70 hover:bg-slate-900 border-slate-800'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-950/40 border border-slate-800">
                      {line.avatar}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-cyan-400">
                          {line.speaker} <span className="font-light text-slate-400">({line.uzSpeaker})</span>
                        </span>
                        <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                      </div>

                      {showTranscript ? (
                        <>
                          <p className={`text-base font-semibold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {line.text}
                          </p>
                          <p className={`text-xs font-light mt-1 ${isDark ? 'text-cyan-200/80' : 'text-sky-700'}`}>
                            {line.uzText}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs italic text-slate-500 py-1">
                          [Transcript hidden for active listening / Matn yashirilgan, tinglab tushuning]
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: SMART DICTATION */}
      {activeMode === 'dictation' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Exercise {dictationIndex + 1} of {DICTATION_EXERCISES.length}
              </span>
              <h3 className="text-xl font-bold mt-1">Listen and Type the Exact Sentence</h3>
              <p className="text-xs font-light text-slate-400">
                Aytilgan jumlani diqqat bilan eshiting va so‘zma-so‘z to‘g‘ri yozing
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                speechService.speak(DICTATION_EXERCISES[dictationIndex].sentence, { rate: 0.85 });
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-md shadow-purple-500/20"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>Listen Sentence / Eshitish</span>
            </button>
          </div>

          <div>
            <textarea
              rows={3}
              value={typedInput}
              onChange={(e) => {
                setTypedInput(e.target.value);
                setDictationResult(null);
              }}
              placeholder="Type what you hear here / Eshitganingizni bu yerga yozing..."
              className={`w-full p-4 rounded-2xl border text-base resize-none focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-700 text-white focus:border-purple-400' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
              }`}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                soundFx.playClick();
                speechService.speak(DICTATION_EXERCISES[dictationIndex].sentence, { rate: 0.65 });
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Slow Audio (0.65x) / Sekinlashtirilgan</span>
            </button>

            <button
              onClick={handleCheckDictation}
              disabled={!typedInput.trim()}
              className={`px-6 py-3 rounded-xl font-bold text-xs ${
                typedInput.trim()
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Check Dictation / Tekshirish
            </button>
          </div>

          {/* Dictation Evaluation Diff */}
          {dictationResult && (
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Analysis Diff / So‘zma-so‘z tahlil:</span>
                <span className={`text-xl font-black ${
                  dictationResult.score >= 80 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {dictationResult.score}% Accuracy
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {dictationResult.diff.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg border font-medium ${
                      item.status === 'correct'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : item.status === 'missing'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 line-through'
                          : 'bg-red-500/15 border-red-500/40 text-red-400'
                    }`}
                  >
                    {item.word} {item.status === 'wrong' && `(kutilgan: ${item.expected})`}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <p className="text-xs font-light text-slate-400">
                  Target: <span className="font-semibold text-slate-200">{DICTATION_EXERCISES[dictationIndex].sentence}</span>
                </p>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDictationIndex((prev) => (prev + 1) % DICTATION_EXERCISES.length);
                    setTypedInput('');
                    setDictationResult(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Next Sentence / Keyingisi →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: MINIMAL PAIRS */}
      {activeMode === 'pairs' && currentPair && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-xl mx-auto ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Phonetic Discrimination Drill ({pairIndex + 1}/{MINIMAL_PAIRS.length})
            </span>
            <h3 className="text-2xl font-black">Which Word Did You Hear?</h3>
            <p className="text-xs font-light text-slate-400">
              Qaysi so‘z talaffuz qilinganini tinglab to‘g‘risini toping: {currentPair.phoneme}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                soundFx.playClick();
                speechService.speak(currentPair.target, { rate: 0.9 });
              }}
              className="p-6 rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-slate-950 shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Volume2 className="w-10 h-10 animate-pulse" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => handleSelectPair(currentPair.wordA)}
              className={`p-6 rounded-2xl border text-center transition-all ${
                isDark 
                  ? 'bg-slate-950/60 hover:bg-cyan-950/30 border-slate-800 hover:border-cyan-400' 
                  : 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-400'
              }`}
            >
              <span className="text-2xl font-black block">{currentPair.wordA}</span>
              <span className="text-xs font-light text-slate-400">{currentPair.wordAUz}</span>
            </button>

            <button
              onClick={() => handleSelectPair(currentPair.wordB)}
              className={`p-6 rounded-2xl border text-center transition-all ${
                isDark 
                  ? 'bg-slate-950/60 hover:bg-cyan-950/30 border-slate-800 hover:border-cyan-400' 
                  : 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-400'
              }`}
            >
              <span className="text-2xl font-black block">{currentPair.wordB}</span>
              <span className="text-xs font-light text-slate-400">{currentPair.wordBUz}</span>
            </button>
          </div>

          {pairFeedback && (
            <div className={`p-4 rounded-xl border text-center text-xs font-bold animate-fadeIn ${
              pairFeedback.correct 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                : 'bg-red-500/15 border-red-500/40 text-red-400'
            }`}>
              {pairFeedback.text}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setPairIndex((prev) => (prev + 1) % MINIMAL_PAIRS.length);
                  setPairFeedback(null);
                }}
                className="block mx-auto mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Next Pair / Keyingisi →
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
