import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Flame, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  Award, 
  ArrowLeft,
  Zap,
  Play,
  Layers,
  HelpCircle,
  ShieldAlert,
  Info,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { 
  METEOR_WORDS, 
  MEMORY_CARDS, 
  SCRAMBLE_WORDS, 
  SENTENCE_ARCHITECT_DATA, 
  LIGHTNING_QUIZ_QUESTIONS,
  HANGMAN_WORDS,
  ODD_ONE_OUT_QUESTIONS,
  TRUE_FALSE_QUESTIONS
} from '../data/gameData';

export default function ArcadeZone({ isDark, onAddXp }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // GAME 1: METEOR DEFENDER
  const [meteorWordIdx, setMeteorWordIdx] = useState(0);
  const [meteorInput, setMeteorInput] = useState('');
  const [meteorHealth, setMeteorHealth] = useState(100);
  const [meteorScore, setMeteorScore] = useState(0);
  const [meteorY, setMeteorY] = useState(10);

  // GAME 2: 3D MEMORY MATRIX
  const [cards, setCards] = useState(() => 
    [...MEMORY_CARDS].sort(() => Math.random() - 0.5).map(c => ({ ...c, flipped: false, matched: false }))
  );
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  // GAME 3: WORD ALCHEMIST (SCRAMBLE)
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const currentScramble = SCRAMBLE_WORDS[scrambleIdx];
  const [userLetters, setUserLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);

  // GAME 4: SENTENCE ARCHITECT
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const currentSentenceGame = SENTENCE_ARCHITECT_DATA[sentenceIdx];
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [poolTokens, setPoolTokens] = useState([]);

  // GAME 5: 30s SPEED LIGHTNING
  const [lightningIdx, setLightningIdx] = useState(0);
  const [lightningScore, setLightningScore] = useState(0);
  const [lightningTime, setLightningTime] = useState(30);
  const [lightningActive, setLightningActive] = useState(false);

  // GAME 6: CYBER HANGMAN
  const [hangmanIdx, setHangmanIdx] = useState(0);
  const currentHangman = HANGMAN_WORDS[hangmanIdx];
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [hangmanLives, setHangmanLives] = useState(6);

  // GAME 7: ODD ONE OUT
  const [oddIdx, setOddIdx] = useState(0);
  const currentOdd = ODD_ONE_OUT_QUESTIONS[oddIdx];
  const [oddFeedback, setOddFeedback] = useState(null);

  // GAME 8: TRUE OR FALSE BLITZ
  const [tfIdx, setTfIdx] = useState(0);
  const currentTf = TRUE_FALSE_QUESTIONS[tfIdx];
  const [tfFeedback, setTfFeedback] = useState(null);

  // Init Scramble
  useEffect(() => {
    if (selectedGame === 'scramble' && currentScramble) {
      setAvailableLetters([...currentScramble.scrambled]);
      setUserLetters([]);
    }
  }, [selectedGame, scrambleIdx]);

  // Init Sentence Architect
  useEffect(() => {
    if (selectedGame === 'architect' && currentSentenceGame) {
      setPoolTokens([...currentSentenceGame.tokens].sort(() => Math.random() - 0.5));
      setSelectedTokens([]);
    }
  }, [selectedGame, sentenceIdx]);

  // Lightning timer
  useEffect(() => {
    let interval;
    if (selectedGame === 'lightning' && lightningActive && lightningTime > 0) {
      interval = setInterval(() => {
        setLightningTime((t) => {
          if (t <= 1) {
            setLightningActive(false);
            soundFx.playLevelUp();
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
            storageService.addDailyActivity({
              type: 'arcade',
              title: `30s Lightning Blitz (${lightningScore} pts)`,
              titleUz: `Tezkor viktorinada ${lightningScore} ta to‘g‘ri javob`,
              score: `${lightningScore} Correct`,
              scoreVal: Math.min(100, lightningScore * 20),
              xp: `+${lightningScore * 10} XP`,
              icon: 'Zap'
            });
            if (onAddXp) onAddXp(lightningScore * 10);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedGame, lightningActive, lightningTime, lightningScore]);

  // Meteor Game Loop
  useEffect(() => {
    let meteorTimer;
    if (selectedGame === 'meteor' && meteorHealth > 0) {
      meteorTimer = setInterval(() => {
        setMeteorY((y) => {
          if (y >= 85) {
            soundFx.playError();
            setMeteorHealth((h) => Math.max(0, h - 25));
            setMeteorWordIdx((idx) => (idx + 1) % METEOR_WORDS.length);
            return 10;
          }
          return y + 3;
        });
      }, 500);
    }
    return () => clearInterval(meteorTimer);
  }, [selectedGame, meteorHealth]);

  const handleMeteorTyping = (e) => {
    const val = e.target.value.toUpperCase();
    setMeteorInput(val);
    const target = METEOR_WORDS[meteorWordIdx].word;

    if (val === target) {
      soundFx.playLaser();
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.5 } });
      setMeteorScore((s) => s + 100);
      setMeteorWordIdx((idx) => (idx + 1) % METEOR_WORDS.length);
      setMeteorInput('');
      setMeteorY(10);
      storageService.addDailyActivity({
        type: 'arcade',
        title: `Destroyed Meteor: ${target}`,
        titleUz: `Meteorit urib tushirildi: ${target}`,
        score: '+100 PTS',
        scoreVal: 95,
        xp: '+20 XP',
        icon: 'Flame'
      });
      if (onAddXp) onAddXp(20);
    }
  };

  const handleCardClick = (card, index) => {
    if (card.flipped || card.matched || flippedCards.length >= 2) return;

    soundFx.playCardFlip();
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, { ...card, index }];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [c1, c2] = newFlipped;
      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          soundFx.playSuccess();
          const matchedState = cards.map((c, i) => {
            if (i === c1.index || i === c2.index) {
              return { ...c, matched: true };
            }
            return c;
          });
          setCards(matchedState);
          setFlippedCards([]);
          setMatchedPairs((p) => p + 1);

          if (matchedPairs + 1 === cards.length / 2) {
            soundFx.playLevelUp();
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            storageService.addDailyActivity({
              type: 'arcade',
              title: '3D Memory Matrix Victory',
              titleUz: '3D Xotira o‘yinida barcha juftliklar topildi',
              score: `${cards.length / 2}/${cards.length / 2} Pairs`,
              scoreVal: 100,
              xp: '+60 XP',
              icon: 'Flame'
            });
            if (onAddXp) onAddXp(60);
          }
        }, 500);
      } else {
        setTimeout(() => {
          soundFx.playError();
          const resetFlipped = cards.map((c, i) => {
            if (i === c1.index || i === c2.index) {
              return { ...c, flipped: false };
            }
            return c;
          });
          setCards(resetFlipped);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // Hangman Letter Guess
  const handleHangmanGuess = (char) => {
    if (guessedLetters.includes(char) || hangmanLives <= 0) return;

    soundFx.playClick();
    const updated = [...guessedLetters, char];
    setGuessedLetters(updated);

    if (!currentHangman.word.includes(char)) {
      soundFx.playError();
      const newLives = hangmanLives - 1;
      setHangmanLives(newLives);
      if (newLives <= 0) {
        soundFx.playError();
      }
    } else {
      soundFx.playSuccess();
      // Check win
      const allFound = currentHangman.word.split('').every(c => updated.includes(c));
      if (allFound) {
        soundFx.playLevelUp();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        storageService.addDailyActivity({
          type: 'arcade',
          title: `Solved Hangman: ${currentHangman.word}`,
          titleUz: `Kiber qalqon qutqarildi: ${currentHangman.word}`,
          score: 'Saved Shield',
          scoreVal: 100,
          xp: '+40 XP',
          icon: 'ShieldAlert'
        });
        if (onAddXp) onAddXp(40);
      }
    }
  };

  const arcadeGamesList = [
    {
      id: 'meteor',
      title: 'Cyber Meteor Defender',
      titleUz: 'Kiber Meteorlar Jangi',
      descUz: 'Tushayotgan so‘zlarni tezda yozib lazer bilan yo‘q qiling',
      instructionUz: 'Osmondan inglizcha so‘z tushadi. Qalqon yiqilmasidan oldin uni klaviaturada yozing va lazer bilan yo‘q qiling!',
      icon: '☄️',
      color: 'from-cyan-500 to-blue-600',
      tag: 'Action & Typing'
    },
    {
      id: 'memory',
      title: '3D Hologram Memory',
      titleUz: '3D Xotira Kartalari',
      descUz: '3D kartalarni aylantirib inglizcha va o‘zbekcha juftliklarni toping',
      instructionUz: 'Kartalarni bosib 180° ag‘daring. Inglizcha so‘z va uning o‘zbekcha ma‘nosi juftligini topib oching.',
      icon: '🃏',
      color: 'from-purple-500 to-indigo-600',
      tag: '3D & Memory'
    },
    {
      id: 'scramble',
      title: 'Word Alchemist',
      titleUz: 'Harflar Laboratoriyasi',
      descUz: 'Aralashgan harflardan to‘g‘ri so‘zni yig‘ing va audiosini eshiting',
      instructionUz: 'Aralashgan 3D harf sharlarini bosib kerakli tartibda to‘g‘ri so‘zni hosil qiling.',
      icon: '🔮',
      color: 'from-emerald-500 to-teal-600',
      tag: 'Spelling & Vocab'
    },
    {
      id: 'hangman',
      title: 'Cyber Shield (Hangman)',
      titleUz: 'Kiber Qalqon Qutqaruvchisi',
      descUz: 'Yashirin so‘z harflarini topib kiber qalqonni qutqaring',
      instructionUz: 'Yashiringan inglizcha so‘zni harfma-harf toping. 6 ta xato qilish imkoni bor.',
      icon: '🛡️',
      color: 'from-blue-500 to-cyan-500',
      tag: 'Word Guess'
    },
    {
      id: 'odd',
      title: 'Odd One Out',
      titleUz: 'Begona So‘zni Top',
      descUz: '4 ta so‘z orasidan mantiqan boshqa toifadagi begona so‘zni toping',
      instructionUz: 'Berilgan 4 ta so‘zni o‘qing va qaysi so‘z ma‘no jihatdan qolganlariga mos kelmasligini toping.',
      icon: '🎯',
      color: 'from-pink-500 to-rose-600',
      tag: 'Logic & Vocab'
    },
    {
      id: 'tf',
      title: 'True or False Blitz',
      titleUz: 'Rost yoki Yolg‘on Jangi',
      descUz: 'Inglizcha grammatika va ma‘nolar bo‘yicha tezkor rost/yolg‘on testi',
      instructionUz: 'Keltirilgan inglizcha qoida yoki ma‘lumot rost (True) yoki yolg‘on (False) ekanini aniqlang.',
      icon: '⚖️',
      color: 'from-amber-500 to-yellow-600',
      tag: 'Fast Quiz'
    },
    {
      id: 'architect',
      title: 'Sentence Architect',
      titleUz: 'Gap Me‘mori',
      descUz: 'Gap bo‘laklarini Lego kabi to‘g‘ri sintaktik tartibda terish',
      instructionUz: 'Aralashgan so‘z bloklarini bosib to‘g‘ri grammatik tartibda gap tuzing.',
      icon: '🏗️',
      color: 'from-indigo-500 to-purple-600',
      tag: 'Grammar'
    },
    {
      id: 'lightning',
      title: '30s Speed Lightning',
      titleUz: '30 Soniyalik Poyga',
      descUz: '30 soniya ichida eng ko‘p to‘g‘ri savollarga javob bering',
      instructionUz: 'Vaqt ketmoqda! 30 soniya ichida iloji boricha ko‘proq to‘g‘ri javob bering va yuqori rekord o‘rnating.',
      icon: '⚡',
      color: 'from-red-500 to-amber-600',
      tag: 'Blitz Speed'
    }
  ];

  const currentGameInfo = arcadeGamesList.find(g => g.id === selectedGame);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Gamepad2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Mega Arcade Citadel • 8 Interactive Games
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Master English Through 8 Cyber Games
            </h2>
            <p className={`text-xs sm:text-sm font-light mt-1 ${isDark ? 'text-cyan-300/80' : 'text-sky-700'}`}>
              Eng ko‘p, qiziqarli va tushunarli o‘yinlar orqali ingliz tilini o‘ynab o‘rganing
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {selectedGame && (
              <>
                <button
                  onClick={() => setShowHowToPlay(!showHowToPlay)}
                  className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center space-x-1.5"
                >
                  <Info className="w-4 h-4" />
                  <span>Qoidalar / How to Play</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedGame(null);
                    setShowHowToPlay(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Barcha O‘yinlar Zali</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* How to Play Banner (When active game) */}
      {selectedGame && showHowToPlay && currentGameInfo && (
        <div className={`p-5 rounded-2xl border animate-fadeIn ${
          isDark ? 'bg-purple-950/40 border-purple-500/40 text-purple-200' : 'bg-purple-50 border-purple-300 text-purple-900'
        }`}>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{currentGameInfo.icon}</span>
            <div>
              <h4 className="font-bold text-sm">
                Qanday o‘ynaladi? ({currentGameInfo.title})
              </h4>
              <p className="text-xs font-light mt-1">
                {currentGameInfo.instructionUz}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ARCADE SELECTOR MENU */}
      {!selectedGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {arcadeGamesList.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedGame(game.id);
                if (game.id === 'lightning') {
                  setLightningTime(30);
                  setLightningScore(0);
                  setLightningActive(true);
                }
              }}
              className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between ${
                isDark 
                  ? 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/40 shadow-lg' 
                  : 'bg-white hover:bg-sky-50/40 border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-slate-950/40 border border-slate-800 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {game.tag}
                  </span>
                </div>

                <h3 className={`text-lg font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {game.title}
                </h3>
                <p className="text-xs font-semibold text-cyan-400/90 mb-2">
                  {game.titleUz}
                </p>
                <p className="text-xs font-light text-slate-400 line-clamp-2 mb-4">
                  {game.descUz}
                </p>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-500/10">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>O‘ynash / Play</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* GAME 1: METEOR DEFENDER */}
      {selectedGame === 'meteor' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Qalqon Quvvati (Shield)</span>
              <div className="w-36 h-2.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${meteorHealth > 40 ? 'bg-emerald-400' : 'bg-red-500'}`} 
                  style={{ width: `${meteorHealth}%` }} 
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase">Ball / Score</span>
              <p className="text-xl font-black text-cyan-400">{meteorScore} PTS</p>
            </div>
          </div>

          <div className="relative h-96 rounded-3xl bg-slate-950 border border-cyan-500/30 overflow-hidden flex flex-col justify-between p-6">
            {meteorHealth > 0 ? (
              <div
                className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 text-center"
                style={{ top: `${meteorY}%` }}
              >
                <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xl shadow-xl shadow-red-500/50 animate-pulse border border-amber-300">
                  ☄️ {METEOR_WORDS[meteorWordIdx].word}
                </div>
                <span className="text-xs font-light text-cyan-300/80 mt-1 block">
                  {METEOR_WORDS[meteorWordIdx].uz}
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 space-y-4">
                <h3 className="text-3xl font-black text-red-500">Qalqon Yiqildi! / Shield Breached!</h3>
                <p className="text-xs text-slate-300">Yakuniy Ball: {meteorScore} PTS</p>
                <button
                  onClick={() => {
                    setMeteorHealth(100);
                    setMeteorScore(0);
                    setMeteorY(10);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Qaytadan o‘ynash
                </button>
              </div>
            )}

            <div className="mt-auto w-full pt-4 border-t border-cyan-500/40">
              <input
                type="text"
                autoFocus
                value={meteorInput}
                onChange={handleMeteorTyping}
                placeholder="TUSHAYOTGAN SO‘ZNI YOZING..."
                className="w-full p-4 rounded-2xl bg-slate-900/90 border border-cyan-400 text-center text-xl font-mono uppercase font-black text-cyan-300 tracking-widest focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* GAME 2: 3D MEMORY MATRIX */}
      {selectedGame === 'memory' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">3D Xotira Kartalari</h3>
              <p className="text-xs font-light text-slate-400">Inglizcha so‘z va uning tarjimasini juftlab oching</p>
            </div>
            <span className="text-xs font-bold text-cyan-400">
              Topildi: {matchedPairs} / {cards.length / 2} Juftlik
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card, idx)}
                className="h-28 perspective-1000 cursor-pointer select-none"
              >
                <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl border ${
                  card.flipped || card.matched
                    ? 'rotate-y-180 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}>
                  <div className="absolute inset-0 backface-hidden flex items-center justify-center text-2xl font-black text-slate-700">
                    ?
                  </div>
                  <div className="absolute inset-0 backface-hidden rotate-y-180 p-3 rounded-2xl bg-gradient-to-tr from-slate-900 to-purple-950/60 flex flex-col items-center justify-center text-center">
                    <span className="text-xl mb-1">{card.icon}</span>
                    <span className="text-sm font-bold text-white leading-tight">
                      {card.text}
                    </span>
                    <span className="text-[10px] text-cyan-300 font-light mt-0.5">
                      {card.type === 'en' ? 'English' : 'O‘zbekcha'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME 3: WORD ALCHEMIST (SCRAMBLE) */}
      {selectedGame === 'scramble' && currentScramble && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-xl mx-auto text-center ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Bosqich {scrambleIdx + 1} / {SCRAMBLE_WORDS.length}
            </span>
            <h3 className="text-2xl font-black mt-1">Harflardan So‘zni Yig‘ing</h3>
            <p className="text-xs font-light text-slate-400 mt-1">
              💡 Ma‘nosi: {currentScramble.hintUz}
            </p>
          </div>

          <div className="flex justify-center space-x-2 min-h-[60px] p-3 rounded-2xl bg-slate-950 border border-slate-800">
            {userLetters.map((char, i) => (
              <button
                key={i}
                onClick={() => {
                  soundFx.playClick();
                  setUserLetters(userLetters.filter((_, idx) => idx !== i));
                  setAvailableLetters([...availableLetters, char]);
                }}
                className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md animate-popIn"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {availableLetters.map((char, i) => (
              <button
                key={i}
                onClick={() => {
                  soundFx.playClick();
                  setUserLetters([...userLetters, char]);
                  setAvailableLetters(availableLetters.filter((_, idx) => idx !== i));

                  const updated = [...userLetters, char].join('');
                  if (updated === currentScramble.target) {
                    soundFx.playLevelUp();
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                    if (onAddXp) onAddXp(30);
                    setTimeout(() => {
                      setScrambleIdx((prev) => (prev + 1) % SCRAMBLE_WORDS.length);
                    }, 1200);
                  }
                }}
                className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-400 text-white font-bold text-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 4: CYBER HANGMAN */}
      {selectedGame === 'hangman' && currentHangman && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-xl mx-auto text-center ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase">
                Bosqich {hangmanIdx + 1}/{HANGMAN_WORDS.length}
              </span>
              <h3 className="text-xl font-bold">Kiber Qalqon (Hangman)</h3>
            </div>
            <div className="flex items-center space-x-1 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-bold">{hangmanLives} Imkoniyat</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            💡 Izoh: {currentHangman.hint} ({currentHangman.uz})
          </div>

          {/* Hidden word slots */}
          <div className="flex justify-center space-x-2 py-4">
            {currentHangman.word.split('').map((char, i) => {
              const isFound = guessedLetters.includes(char) || hangmanLives <= 0;
              return (
                <div
                  key={i}
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-black ${
                    isFound 
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' 
                      : 'border-slate-700 bg-slate-950 text-transparent'
                  }`}
                >
                  {isFound ? char : '_'}
                </div>
              );
            })}
          </div>

          {/* Alphabet keyboard */}
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char) => {
              const isUsed = guessedLetters.includes(char);
              return (
                <button
                  key={char}
                  disabled={isUsed || hangmanLives <= 0}
                  onClick={() => handleHangmanGuess(char)}
                  className={`w-9 h-10 rounded-lg text-xs font-bold border transition-all ${
                    isUsed
                      ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 border-slate-700 text-white'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {hangmanLives <= 0 && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-300 text-xs">
              Qalqon buzildi! So‘z: <span className="font-bold text-white">{currentHangman.word}</span>
              <button
                onClick={() => {
                  setGuessedLetters([]);
                  setHangmanLives(6);
                  setHangmanIdx((prev) => (prev + 1) % HANGMAN_WORDS.length);
                }}
                className="block mx-auto mt-2 px-4 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
              >
                Keyingi So‘zga O‘tish →
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 5: ODD ONE OUT */}
      {selectedGame === 'odd' && currentOdd && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-xl mx-auto ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              {currentOdd.category} ({currentOdd.categoryUz})
            </span>
            <h3 className="text-2xl font-black">Qaysi So‘z Begona? (Odd One Out)</h3>
            <p className="text-xs font-light text-slate-400">
              4 ta so‘z orasidan mantiqan guruhga kirmaydigan bittasini toping
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {currentOdd.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i === currentOdd.oddIndex) {
                    soundFx.playSuccess();
                    setOddFeedback({ correct: true, text: `To‘g‘ri! ${currentOdd.reasonUz}` });
                    if (onAddXp) onAddXp(25);
                  } else {
                    soundFx.playError();
                    setOddFeedback({ correct: false, text: 'Xato! Bu so‘z toifaga tegishli. Qaytadan urinib ko‘ring.' });
                  }
                }}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  isDark 
                    ? 'bg-slate-950/70 hover:bg-pink-950/30 border-slate-800 hover:border-pink-500' 
                    : 'bg-slate-50 hover:bg-pink-50 border-slate-200 hover:border-pink-400'
                }`}
              >
                <span className="text-lg font-bold block">{opt}</span>
                <span className="text-xs font-light text-slate-400">{currentOdd.optionsUz[i]}</span>
              </button>
            ))}
          </div>

          {oddFeedback && (
            <div className={`p-4 rounded-xl border text-xs font-semibold text-center animate-fadeIn ${
              oddFeedback.correct ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300'
            }`}>
              {oddFeedback.text}
              {oddFeedback.correct && (
                <button
                  onClick={() => {
                    setOddFeedback(null);
                    setOddIdx((prev) => (prev + 1) % ODD_ONE_OUT_QUESTIONS.length);
                  }}
                  className="block mx-auto mt-2 px-4 py-1.5 rounded-lg bg-pink-600 text-white font-bold"
                >
                  Keyingi Savol →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* GAME 6: TRUE OR FALSE BLITZ */}
      {selectedGame === 'tf' && currentTf && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-xl mx-auto text-center ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase">
              Savol {tfIdx + 1}/{TRUE_FALSE_QUESTIONS.length}
            </span>
            <h3 className="text-2xl font-black mt-1">Rost yoki Yolg‘on?</h3>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="text-lg font-bold text-white">
              "{currentTf.statement}"
            </p>
            <p className="text-xs font-light text-slate-400">
              🇺🇿 {currentTf.statementUz}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (currentTf.isTrue) {
                  soundFx.playSuccess();
                  setTfFeedback({ correct: true, text: currentTf.explanationUz });
                  if (onAddXp) onAddXp(20);
                } else {
                  soundFx.playError();
                  setTfFeedback({ correct: false, text: currentTf.explanationUz });
                }
              }}
              className="p-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>ROST (TRUE)</span>
            </button>

            <button
              onClick={() => {
                if (!currentTf.isTrue) {
                  soundFx.playSuccess();
                  setTfFeedback({ correct: true, text: currentTf.explanationUz });
                  if (onAddXp) onAddXp(20);
                } else {
                  soundFx.playError();
                  setTfFeedback({ correct: false, text: currentTf.explanationUz });
                }
              }}
              className="p-5 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-black text-lg flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5 stroke-[3]" />
              <span>YOLG‘ON (FALSE)</span>
            </button>
          </div>

          {tfFeedback && (
            <div className={`p-4 rounded-xl border text-xs text-center animate-fadeIn ${
              tfFeedback.correct ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300'
            }`}>
              {tfFeedback.text}
              <button
                onClick={() => {
                  setTfFeedback(null);
                  setTfIdx((prev) => (prev + 1) % TRUE_FALSE_QUESTIONS.length);
                }}
                className="block mx-auto mt-2 px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold"
              >
                Keyingi Savol →
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 7: SENTENCE ARCHITECT */}
      {selectedGame === 'architect' && currentSentenceGame && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-2xl mx-auto ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Grammar Builder ({sentenceIdx + 1}/{SENTENCE_ARCHITECT_DATA.length})
            </span>
            <h3 className="text-xl font-bold mt-1">Gapni To‘g‘ri Tartibda Yig‘ing</h3>
            <p className="text-xs font-light text-slate-300 mt-1">
              🇺🇿 Ma‘nosi: {currentSentenceGame.uz}
            </p>
          </div>

          <div className="min-h-[80px] p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 items-center">
            {selectedTokens.map((tok, i) => (
              <button
                key={i}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTokens(selectedTokens.filter((_, idx) => idx !== i));
                  setPoolTokens([...poolTokens, tok]);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md"
              >
                {tok}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {poolTokens.map((tok, i) => (
              <button
                key={i}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTokens([...selectedTokens, tok]);
                  setPoolTokens(poolTokens.filter((_, idx) => idx !== i));
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm transition-all"
              >
                {tok}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setPoolTokens([...currentSentenceGame.tokens]);
                setSelectedTokens([]);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Qaytadan
            </button>

            <button
              onClick={() => {
                const formed = selectedTokens.join(' ');
                if (formed === currentSentenceGame.correctSentence) {
                  soundFx.playLevelUp();
                  confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
                  if (onAddXp) onAddXp(35);
                  setSentenceIdx((prev) => (prev + 1) % SENTENCE_ARCHITECT_DATA.length);
                } else {
                  soundFx.playError();
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold text-xs"
            >
              Gapni Tekshirish / Verify
            </button>
          </div>
        </div>
      )}

      {/* GAME 8: 30s SPEED LIGHTNING */}
      {selectedGame === 'lightning' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-xl mx-auto ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2 text-red-400">
              <Zap className="w-5 h-5 animate-bounce" />
              <span className="text-xl font-black">{lightningTime}s Qoldi</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase">To‘g‘ri Javoblar: </span>
              <span className="text-xl font-black text-cyan-400">{lightningScore}</span>
            </div>
          </div>

          {lightningActive && lightningTime > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">
                {LIGHTNING_QUIZ_QUESTIONS[lightningIdx % LIGHTNING_QUIZ_QUESTIONS.length].q}
              </h3>
              <p className="text-xs font-light text-slate-400">
                {LIGHTNING_QUIZ_QUESTIONS[lightningIdx % LIGHTNING_QUIZ_QUESTIONS.length].qUz}
              </p>

              <div className="space-y-2 pt-2">
                {LIGHTNING_QUIZ_QUESTIONS[lightningIdx % LIGHTNING_QUIZ_QUESTIONS.length].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const isCor = i === LIGHTNING_QUIZ_QUESTIONS[lightningIdx % LIGHTNING_QUIZ_QUESTIONS.length].correct;
                      if (isCor) {
                        soundFx.playSuccess();
                        setLightningScore((s) => s + 1);
                      } else {
                        soundFx.playError();
                      }
                      setLightningIdx((idx) => idx + 1);
                    }}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-cyan-950/40 hover:border-cyan-400 text-xs sm:text-sm font-medium transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <h3 className="text-2xl font-black text-cyan-400">Poyga Yakunlandi!</h3>
              <p className="text-sm">30 soniya ichida {lightningScore} ta to‘g‘ri javob berdingiz!</p>
              <button
                onClick={() => {
                  setLightningTime(30);
                  setLightningScore(0);
                  setLightningActive(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Qaytadan O‘ynash
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
