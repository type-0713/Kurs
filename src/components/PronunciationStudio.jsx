import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Award,
  BookOpen,
  VolumeX,
  Play,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../services/speechService';
import { soundFx } from '../services/soundEffects';
import { storageService } from '../services/storageService';
import { TONGUE_TWISTERS, INITIAL_VOCABULARY } from '../data/vocabularyData';

export default function PronunciationStudio({ isDark, onAddXp }) {
  const [text, setText] = useState('Artificial intelligence enhances human pronunciation and speaking confidence.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  // Microphone state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [micError, setMicError] = useState('');

  // Sample phrases
  const samplePresets = [
    { en: 'Artificial intelligence enhances human pronunciation.', uz: 'Sun‘iy intellekt inson talaffuzini yaxshilaydi.' },
    { en: 'Consistency and continuous practice guarantee true fluency.', uz: 'Doimiylik va uzluksiz amaliyot haqiqiy ravonlikni kafolatlaydi.' },
    { en: 'The quick brown fox jumps over the lazy dog.', uz: 'Chaqqon qo‘ng‘ir tulki yalqov it ustidan sakrab o‘tadi.' },
    { en: 'Worcestershire sauce is a traditional British savory condiment.', uz: 'Vustershir sousi an‘anaviy Britaniya ziravorli sousidir.' }
  ];

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      const v = speechService.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoiceUri) {
        setSelectedVoiceUri(v[0].voiceURI || v[0].name);
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleVoiceChange = (e) => {
    setSelectedVoiceUri(e.target.value);
    speechService.setVoice(e.target.value);
    soundFx.playClick();
  };

  // Text-to-Speech Playback
  const handleSpeak = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      setActiveWordIndex(-1);
      return;
    }

    if (!text.trim()) return;

    soundFx.playClick();
    setIsPlaying(true);
    setActiveWordIndex(0);

    const words = text.trim().split(/\s+/);
    let currentIdx = 0;

    speechService.speak(text, {
      rate: speechRate,
      pitch: speechPitch,
      onStart: () => setIsPlaying(true),
      onBoundary: () => {
        currentIdx++;
        setActiveWordIndex(currentIdx % words.length);
      },
      onEnd: () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
        soundFx.playSuccess();
        if (onAddXp) onAddXp(10);
      }
    });
  };

  // Microphone Speech Recognition
  const handleToggleRecord = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
      return;
    }

    setMicError('');
    setSpokenText('');
    setEvaluation(null);
    soundFx.playClick();

    const success = speechService.startListening({
      onResult: (transcript, isFinal) => {
        setSpokenText(transcript);
        if (isFinal) {
          setIsRecording(false);
          evaluateSpeech(transcript);
        }
      },
      onError: (err) => {
        setIsRecording(false);
        setMicError(typeof err === 'string' ? err : 'Microphone error. Please check permissions.');
        soundFx.playError();
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });

    if (success) {
      setIsRecording(true);
    }
  };

  const evaluateSpeech = (spoken) => {
    const result = speechService.calculateAccuracy(spoken, text);
    setEvaluation(result);

    const xpEarned = result.score >= 85 ? 35 : result.score >= 50 ? 15 : 5;
    storageService.addDailyActivity({
      type: 'speech',
      title: 'Spoke: ' + (text.length > 25 ? text.slice(0, 25) + '...' : text),
      titleUz: 'Talaffuz mashqi baholandi',
      score: `${result.score}% Match`,
      scoreVal: result.score,
      xp: `+${xpEarned} XP`,
      icon: 'Mic'
    });

    if (result.score >= 85) {
      soundFx.playLevelUp();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onAddXp) onAddXp(35);
    } else if (result.score >= 50) {
      soundFx.playSuccess();
      if (onAddXp) onAddXp(15);
    } else {
      soundFx.playError();
    }
  };

  // Word token rendering for karaoke
  const wordsList = text.trim().split(/\s+/);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border-cyan-500/30 shadow-xl shadow-cyan-500/5' 
          : 'bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white border-sky-200 shadow-lg shadow-sky-100'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Neural Pronunciation Studio
              </span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Master Authentic English Speech
            </h1>
            <p className={`text-sm sm:text-base font-light mt-1 ${isDark ? 'text-cyan-200/80' : 'text-sky-700'}`}>
              Matn kiriting va toza inglizcha talaffuzda eshiting, mikrofon orqali talaffuzingizni tekshiring
            </p>
          </div>

          {/* Quick preset selector */}
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setText(preset.en);
                  setEvaluation(null);
                  setSpokenText('');
                }}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                  isDark 
                    ? 'bg-slate-800/80 hover:bg-cyan-950/60 border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-white' 
                    : 'bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-300 text-slate-700'
                }`}
              >
                Sample {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Main Workspace (8 cols) */}
        <div className={`lg:col-span-8 p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 shadow-xl' 
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          
          {/* Text Input Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex flex-col">
                <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Enter English Text or Sentence
                </span>
                <span className={`text-xs font-light ${isDark ? 'text-cyan-300/80' : 'text-sky-600'}`}>
                  Inglizcha so‘z yoki matn kiriting
                </span>
              </label>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setText('');
                  setEvaluation(null);
                  setSpokenText('');
                }}
                className={`text-xs flex items-center space-x-1 ${
                  isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-600'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear / Tozalash</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setEvaluation(null);
              }}
              placeholder="Type any English phrase here, e.g., 'Hello world, how are you today?'..."
              className={`w-full p-4 rounded-2xl border text-base sm:text-lg resize-none focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-950/70 border-slate-700 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
              }`}
            />
          </div>

          {/* Karaoke Display (Active when playing) */}
          {isPlaying && (
            <div className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-950/90 border-cyan-500/40' : 'bg-sky-50/70 border-sky-300'
            }`}>
              <div className="flex items-center space-x-2 text-xs font-semibold mb-2 text-cyan-400">
                <Zap className="w-4 h-4 animate-bounce" />
                <span>Live Speech Karaoke / So‘zma-so‘z talaffuz:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-lg font-medium leading-relaxed">
                {wordsList.map((word, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded-lg transition-all duration-150 ${
                      i === activeWordIndex
                        ? isDark
                          ? 'bg-cyan-400 text-slate-950 font-bold scale-110 shadow-lg shadow-cyan-400/50'
                          : 'bg-sky-600 text-white font-bold scale-110 shadow-md'
                        : isDark
                          ? 'text-slate-300'
                          : 'text-slate-700'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Audio Visualizer Wave */}
          {isPlaying && (
            <div className="flex items-center justify-center space-x-1.5 h-12 py-2">
              {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50, 85, 30].map((height, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full animate-wave-bar"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${(i % 5) * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            {/* Big Listen Button */}
            <button
              onClick={handleSpeak}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-bold text-base transition-all transform active:scale-95 ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                  : isDark
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-md shadow-sky-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  <div className="flex flex-col text-left">
                    <span className="leading-tight">Stop Audio</span>
                    <span className="text-[11px] font-light opacity-80 leading-tight">To‘xtatish</span>
                  </div>
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <div className="flex flex-col text-left">
                    <span className="leading-tight">Listen Pronunciation</span>
                    <span className="text-[11px] font-light opacity-90 leading-tight">Toza talaffuzni eshitish</span>
                  </div>
                </>
              )}
            </button>

            {/* Practice Speaking (Mic) Button */}
            <button
              onClick={handleToggleRecord}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-bold text-base border transition-all transform active:scale-95 ${
                isRecording
                  ? 'bg-red-600/90 text-white border-red-500 animate-pulse'
                  : isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-cyan-500/30 text-cyan-300 hover:text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-sky-300 text-sky-800'
              }`}
            >
              {isRecording ? <MicOff className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
              <div className="flex flex-col text-left">
                <span className="leading-tight">
                  {isRecording ? 'Listening... (Speak Now)' : 'Practice Speaking'}
                </span>
                <span className="text-[11px] font-light opacity-80 leading-tight">
                  {isRecording ? 'Yozib olinmoqda... gapiring' : 'Mikrofonda aytib ko‘rish'}
                </span>
              </div>
            </button>
          </div>

          {/* Mic Error Notice */}
          {micError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {micError}
            </div>
          )}

          {/* Pronunciation AI Assessment Results */}
          {evaluation && (
            <div className={`p-6 rounded-3xl border transition-all ${
              isDark ? 'bg-slate-950/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Award className={`w-5 h-5 ${evaluation.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span className="font-bold text-sm">
                    AI Pronunciation Score / Talaffuz Bahosi:
                  </span>
                </div>
                <span className={`text-2xl font-black ${
                  evaluation.score >= 80 ? 'text-emerald-400' : evaluation.score >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {evaluation.score}% Match
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    evaluation.score >= 80 ? 'bg-emerald-400' : evaluation.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${evaluation.score}%` }}
                />
              </div>

              {/* Word-by-word feedback breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400">
                  Word Accuracy Breakdown / So‘zma-so‘z tahlil:
                </p>
                <div className="flex flex-wrap gap-2">
                  {evaluation.wordFeedback.map((item, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        item.status === 'perfect'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.status === 'good'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : item.status === 'fair'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {item.word} {item.status === 'perfect' ? '✓' : `(${item.score}%)`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right / Audio & Voice Settings (4 cols) */}
        <div className={`lg:col-span-4 p-6 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Audio Tuning Controls
              </span>
              <span className={`text-xs font-light ${isDark ? 'text-cyan-300/80' : 'text-sky-600'}`}>
                Ovoz va Tezlik Sozlamalari
              </span>
            </div>
          </div>

          {/* High-Fidelity Audio Mode Indicator */}
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center space-x-2.5">
            <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">
                Native English Voice Engine
              </span>
              <span className="text-[10px] font-light text-cyan-300/80 block">
                Faqat Eshitish tugmasi bosilganda toza inglizcha ovoz yangraydi
              </span>
            </div>
          </div>

          {/* Voice Accent Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">
              Voice & Accent / Aksent Tanlash
            </label>
            <select
              value={selectedVoiceUri}
              onChange={handleVoiceChange}
              className={`w-full p-3 rounded-xl border text-xs font-medium focus:outline-none ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-slate-200 focus:border-cyan-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-sky-400'
              }`}
            >
              {voices.length > 0 ? (
                voices.map((v, i) => (
                  <option key={i} value={v.voiceURI || v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))
              ) : (
                <option value="">Default English Voice</option>
              )}
            </select>
          </div>

          {/* Speed Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">Speech Rate / Tezlik</span>
              <span className="text-cyan-400 font-bold">{speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5x (Slow/Darslik)</span>
              <span>1.0x (Normal)</span>
              <span>1.5x (Fast)</span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">Voice Pitch / Ovoz Ohangi</span>
              <span className="text-cyan-400 font-bold">{speechPitch}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.1"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Quick Tongue Twisters Presets */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Tongue Twister Sprint / Tez Aytishlar
            </span>
            <div className="space-y-2">
              {TONGUE_TWISTERS.slice(0, 3).map((tt) => (
                <div
                  key={tt.id}
                  onClick={() => {
                    soundFx.playClick();
                    setText(tt.text);
                    setEvaluation(null);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isDark
                      ? 'bg-slate-950/60 hover:bg-purple-950/30 border-slate-800 hover:border-purple-500/40'
                      : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{tt.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      {tt.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] font-light text-slate-400 mt-1 line-clamp-1">
                    {tt.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
