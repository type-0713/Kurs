import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Award,
  Zap,
  Flame,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { AI_SPEAKING_TOPICS, PRONUNCIATION_CHALLENGES } from '../../data/speakingData';
import { TONGUE_TWISTERS } from '../../data/vocabularyData';

export default function SpeakingHub({ isDark, onAddXp }) {
  const [selectedTopic, setSelectedTopic] = useState(AI_SPEAKING_TOPICS[0]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [micError, setMicError] = useState('');

  // Mode: 'ai-partner' or 'challenges'
  const [speakingTab, setSpeakingTab] = useState('ai-partner');

  const currentStep = selectedTopic.steps[stepIndex] || selectedTopic.steps[0];

  // Play AI's current question
  const speakAiQuestion = () => {
    soundFx.playClick();
    setIsAiSpeaking(true);
    speechService.speak(currentStep.aiMessage, {
      rate: 1.0,
      pitch: 1.05,
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => {
        setIsAiSpeaking(false);
        soundFx.playSuccess();
      }
    });
  };

  // User mic recording
  const handleToggleRecord = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
      return;
    }

    setMicError('');
    setUserTranscript('');
    setFeedback(null);
    soundFx.playClick();

    const started = speechService.startListening({
      onResult: (transcript, isFinal) => {
        setUserTranscript(transcript);
        if (isFinal) {
          setIsRecording(false);
          evaluateUserAnswer(transcript);
        }
      },
      onError: (err) => {
        setIsRecording(false);
        setMicError(typeof err === 'string' ? err : 'Microphone error');
        soundFx.playError();
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });

    if (started) {
      setIsRecording(true);
    }
  };

  const evaluateUserAnswer = (spoken) => {
    if (!spoken.trim()) return;

    const lower = spoken.toLowerCase();
    let keywordHits = 0;
    currentStep.suggestedKeywords.forEach(kw => {
      if (lower.includes(kw.toLowerCase())) keywordHits++;
    });

    const wordCount = spoken.trim().split(/\s+/).length;
    const pronunciationScore = Math.min(98, Math.max(70, Math.round(75 + keywordHits * 6 + Math.min(15, wordCount))));

    const feedbackObj = {
      score: pronunciationScore,
      wordsSpoken: wordCount,
      keywordHits,
      adviceUz: keywordHits > 0 
        ? `Juda ajoyib! Siz asosiy tushunchalardan (${currentStep.suggestedKeywords.slice(0, 2).join(', ')}) to‘g‘ri foydalandingiz.`
        : 'Yaxshi harakat! Keyingi safar mavzuga oid ko‘proq so‘zlarni qo‘shishga harakat qiling.'
    };

    setFeedback(feedbackObj);

    if (pronunciationScore >= 85) {
      soundFx.playLevelUp();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      if (onAddXp) onAddXp(35);
    } else {
      soundFx.playSuccess();
      if (onAddXp) onAddXp(15);
    }
  };

  const handleNextDialogueStep = () => {
    soundFx.playClick();
    setFeedback(null);
    setUserTranscript('');
    if (stepIndex < selectedTopic.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Completed topic
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setStepIndex(0);
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
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Bot className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                CyberLex AI Dialogue Partner & Speech Coach
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Interactive Conversational English
            </h2>
            <p className={`text-xs sm:text-sm font-light mt-1 ${isDark ? 'text-purple-300/80' : 'text-purple-700'}`}>
              AI suhbatdosh bilan real vaqtda ovozli muloqot va talaffuz tahlili
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setSpeakingTab('ai-partner');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                speakingTab === 'ai-partner'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/20'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              AI Partner (Suhbat)
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setSpeakingTab('challenges');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                speakingTab === 'challenges'
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              Pronunciation Drills (Mashqlar)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: AI CONVERSATION PARTNER */}
      {speakingTab === 'ai-partner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Cyber Avatar & Topic selector (4 cols) */}
          <div className={`lg:col-span-4 p-6 rounded-3xl border space-y-6 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            {/* 3D-styled AI Companion Avatar Card */}
            <div className={`p-6 rounded-2xl border text-center space-y-4 ${
              isDark ? 'bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950 border-purple-500/30 shadow-xl' : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="relative inline-block">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-2xl transition-all ${
                  isAiSpeaking 
                    ? 'bg-cyan-500 text-slate-950 animate-pulse scale-105 shadow-cyan-400/50' 
                    : 'bg-purple-600 text-white shadow-purple-500/30'
                }`}>
                  <Bot className="w-10 h-10" />
                </div>
                {isAiSpeaking && (
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-white">CyberLex AI</h3>
                <p className="text-xs font-light text-cyan-300">
                  {isAiSpeaking ? 'Speaking question...' : 'Listening & Coaching'}
                </p>
              </div>

              {/* Equalizer waves */}
              {isAiSpeaking && (
                <div className="flex justify-center space-x-1 h-6">
                  {[40, 80, 100, 60, 90, 50, 70].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full animate-wave-bar"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Conversation Topic Selector */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Conversation Scenario / Mavzuni Tanlang
              </span>
              {AI_SPEAKING_TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedTopic(topic);
                    setStepIndex(0);
                    setFeedback(null);
                    setUserTranscript('');
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                    selectedTopic.id === topic.id
                      ? isDark ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-purple-100 border-purple-400 text-purple-900'
                      : isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold">{topic.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      {topic.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-light text-slate-400 line-clamp-1">
                    {topic.titleUz}
                  </span>
                </button>
              ))}
            </div>

          </div>

          {/* Right: Active Dialogue Exchange (8 cols) */}
          <div className={`lg:col-span-8 p-6 sm:p-8 rounded-3xl border space-y-6 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            
            {/* Step Progress */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
              <span>Question {stepIndex + 1} of {selectedTopic.steps.length}</span>
              <span className="text-purple-400">{selectedTopic.title}</span>
            </div>

            {/* AI Question Bubble */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-slate-950/90 border-purple-500/30 shadow-lg' : 'bg-purple-50/50 border-purple-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-400">
                  <Bot className="w-4 h-4" />
                  <span>CyberLex Asks:</span>
                </div>
                <button
                  onClick={speakAiQuestion}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Voice</span>
                </button>
              </div>

              <p className={`text-base sm:text-lg font-bold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                "{currentStep.aiMessage}"
              </p>

              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs font-light text-purple-200">
                🇺🇿 O‘zbekcha ma‘nosi: {currentStep.aiMessageUz}
              </div>

              <div className="text-[11px] text-slate-400 italic">
                💡 Maslahat: {currentStep.tipUz}
              </div>
            </div>

            {/* User Speech Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Your Spoken Response / Sizning Javobingiz
                </span>
                {userTranscript && (
                  <span className="text-xs font-mono text-cyan-400">
                    {userTranscript.split(/\s+/).length} words spoken
                  </span>
                )}
              </div>

              {/* Spoken Text Result Box */}
              <div className={`p-4 rounded-2xl border min-h-[90px] flex items-center justify-center text-center ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {isRecording ? (
                  <div className="flex items-center space-x-2 text-red-400 animate-pulse text-sm font-bold">
                    <Mic className="w-5 h-5 animate-bounce" />
                    <span>Listening to your voice... Speak now in English!</span>
                  </div>
                ) : userTranscript ? (
                  <p className="text-base font-semibold text-white">
                    "{userTranscript}"
                  </p>
                ) : (
                  <p className="text-xs font-light text-slate-500">
                    Press the microphone button below and speak your answer clearly.
                  </p>
                )}
              </div>

              {micError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {micError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleToggleRecord}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black shadow-lg shadow-cyan-500/25 hover:scale-[1.02]'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isRecording ? 'Stop & Evaluate' : 'Answer with Voice / Mikrofonda Gapirish'}</span>
                </button>
              </div>

              {/* AI Feedback & Next Button */}
              {feedback && (
                <div className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
                  isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold">AI Speech Evaluation:</span>
                    </div>
                    <span className="text-xl font-black text-emerald-400">
                      {feedback.score}% Score
                    </span>
                  </div>

                  <p className="text-xs font-light text-slate-300">
                    {feedback.adviceUz}
                  </p>

                  <button
                    onClick={handleNextDialogueStep}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Continue Conversation / Keyingi Savolga O‘tish →</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PRONUNCIATION CHALLENGES */}
      {speakingTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRONUNCIATION_CHALLENGES.map(item => (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">{item.word}</h3>
                  <span className="text-xs font-mono text-cyan-400">{item.ipa}</span>
                </div>
                <button
                  onClick={() => speechService.speak(item.word, { rate: 0.85 })}
                  className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm font-light text-purple-300">
                🇺🇿 {item.uz}
              </p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                💡 <span className="font-semibold text-cyan-300">Phonetic Tip:</span> {item.tips}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
