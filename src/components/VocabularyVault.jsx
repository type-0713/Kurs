import React, { useState } from 'react';
import { 
  Plus, 
  Volume2, 
  Search, 
  Trash2, 
  Sparkles, 
  Layers, 
  Rotate3d, 
  Check, 
  X,
  Bookmark,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { VOCABULARY_CATEGORIES, INITIAL_VOCABULARY } from '../data/vocabularyData';

export default function VocabularyVault({ isDark, onAddXp }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customWords, setCustomWords] = useState(() => storageService.getCustomWords());
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [studyMode, setStudyMode] = useState('grid'); // 'grid' or 'flashcard'

  // Form state
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newUz, setNewUz] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newExampleUz, setNewExampleUz] = useState('');

  // Flashcard State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Combine initial curated words with user custom words
  const allCombinedWords = [
    ...customWords.map(w => ({ ...w, category: 'custom' })),
    ...INITIAL_VOCABULARY
  ];

  const filteredWords = allCombinedWords.filter((w) => {
    const matchesCat = selectedCategory === 'all' 
      ? true 
      : selectedCategory === 'custom' 
        ? w.category === 'custom' 
        : w.category === selectedCategory;

    const matchesSearch = 
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.uz.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const handlePronounce = (text, e) => {
    if (e) e.stopPropagation();
    soundFx.playClick();
    speechService.speak(text);
  };

  const handleSaveWord = (e) => {
    e.preventDefault();
    if (!newWord.trim() || !newUz.trim()) return;

    soundFx.playSuccess();
    const saved = storageService.saveCustomWord({
      word: newWord.trim(),
      ipa: newIpa.trim() || `/${newWord.toLowerCase().trim()}/`,
      uz: newUz.trim(),
      example: newExample.trim() || `The word "${newWord.trim()}" is useful in conversation.`,
      exampleUz: newExampleUz.trim() || `"${newWord.trim()}" so‘zi muloqotda juda asqotadi.`
    });

    setCustomWords(storageService.getCustomWords());
    setIsAddingWord(false);
    setNewWord('');
    setNewIpa('');
    setNewUz('');
    setNewExample('');
    setNewExampleUz('');

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    if (onAddXp) onAddXp(20);
  };

  const handleDeleteCustomWord = (id, e) => {
    e.stopPropagation();
    soundFx.playError();
    const updated = storageService.deleteCustomWord(id);
    setCustomWords(updated);
  };

  const currentFlashcard = filteredWords[flashcardIndex] || filteredWords[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Bar */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-900/90 border-purple-500/30' 
          : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-white border-indigo-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Vocab Vault & Lexicon Creator
              </span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Interactive Vocabulary Studio
            </h1>
            <p className={`text-sm sm:text-base font-light mt-1 ${isDark ? 'text-purple-200/80' : 'text-indigo-700'}`}>
              Lug‘atlar bilan ishlash, o‘z so‘zlaringizni qo‘shish va 3D fleshkartalarda o‘rganish
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setStudyMode(studyMode === 'grid' ? 'flashcard' : 'grid');
              }}
              className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                studyMode === 'flashcard'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                  : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Rotate3d className="w-4 h-4" />
              <span>{studyMode === 'flashcard' ? 'Grid View' : '3D Flashcard Mode'}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsAddingWord(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <div className="flex flex-col text-left">
                <span className="leading-tight">Add New Word</span>
                <span className="text-[10px] font-normal leading-tight opacity-90">Yangi so‘z qo‘shish</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
          {VOCABULARY_CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedCategory(cat.id);
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                  isSel
                    ? isDark
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-sky-500/20 border-sky-400 text-sky-900 shadow-sm'
                    : isDark
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-light opacity-75">{cat.uz}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search word / Qidiruv..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-white focus:border-cyan-400' 
                : 'bg-white border-slate-200 text-slate-900 focus:border-sky-400'
            }`}
          />
        </div>
      </div>

      {/* 3D Flashcard Study Mode */}
      {studyMode === 'flashcard' && currentFlashcard && (
        <div className="max-w-xl mx-auto py-8 space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Card {flashcardIndex + 1} of {filteredWords.length}</span>
            <span>Click card to flip / Aylantirish uchun bosing</span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => {
              soundFx.playCardFlip();
              setIsFlipped(!isFlipped);
            }}
            className="w-full h-80 perspective-1000 cursor-pointer"
          >
            <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-3xl shadow-2xl ${
              isFlipped ? 'rotate-y-180' : ''
            }`}>
              
              {/* Front (English) */}
              <div className={`absolute inset-0 backface-hidden p-8 rounded-3xl border flex flex-col justify-between items-center text-center ${
                isDark 
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900/95 to-cyan-950/40 border-cyan-500/40 shadow-xl shadow-cyan-950/40' 
                  : 'bg-gradient-to-b from-white to-sky-50 border-sky-300 shadow-xl'
              }`}>
                <div className="w-full flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {currentFlashcard.category || 'English'}
                  </span>
                  <button
                    onClick={(e) => handlePronounce(currentFlashcard.word, e)}
                    className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {currentFlashcard.word}
                  </h2>
                  <p className="text-sm font-mono text-cyan-300">
                    {currentFlashcard.ipa}
                  </p>
                </div>

                <div className="text-xs font-light text-slate-400 flex items-center space-x-1.5">
                  <Rotate3d className="w-4 h-4 text-cyan-400" />
                  <span>Click anywhere to see Uzbek translation / Tarjimani ko‘rish</span>
                </div>
              </div>

              {/* Back (Uzbek translation) */}
              <div className={`absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl border flex flex-col justify-between items-center text-center ${
                isDark 
                  ? 'bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-900 border-purple-500/40 shadow-xl shadow-purple-950/40' 
                  : 'bg-gradient-to-b from-white to-purple-50 border-purple-300 shadow-xl'
              }`}>
                <div className="w-full flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    O‘zbekcha Ma‘nosi
                  </span>
                  <button
                    onClick={(e) => handlePronounce(currentFlashcard.example, e)}
                    className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all"
                    title="Listen example sentence"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {currentFlashcard.uz}
                  </h3>
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-purple-500/20 text-xs sm:text-sm text-slate-300 font-light">
                    "{currentFlashcard.example}"
                    <p className="text-[11px] text-purple-300/80 mt-1 font-normal">
                      {currentFlashcard.exampleUz}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-light text-slate-400">
                  Tap to flip back / Old tomonga qaytish
                </div>
              </div>

            </div>
          </div>

          {/* Flashcard Nav controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredWords.length - 1));
              }}
              className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous / Oldingi</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev < filteredWords.length - 1 ? prev + 1 : 0));
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Next / Keyingi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid View Mode */}
      {studyMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWords.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 ${
                isDark 
                  ? 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/40 shadow-lg' 
                  : 'bg-white hover:bg-sky-50/40 border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.word}
                    </h3>
                    {item.difficulty && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-cyan-400/80">
                    {item.ipa}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={(e) => handlePronounce(item.word, e)}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
                    title="Pronounce Word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {item.category === 'custom' && (
                    <button
                      onClick={(e) => handleDeleteCustomWord(item.id, e)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                      title="Delete Word"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Uzbek Translation (Thin & Small) */}
              <div className="mb-3">
                <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  {item.uz}
                </p>
              </div>

              {/* Example Sentence */}
              {item.example && (
                <div className={`p-3 rounded-2xl border text-xs ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <p className="font-medium italic">"{item.example}"</p>
                  {item.exampleUz && (
                    <p className="text-[11px] font-light text-slate-400 mt-1">
                      {item.exampleUz}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add New Custom Word */}
      {isAddingWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${
            isDark ? 'bg-slate-900 border-cyan-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setIsAddingWord(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Create Custom Vocabulary
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mb-1">
              Add Word to Personal Vault
            </h2>
            <p className="text-xs font-light text-slate-400 mb-6">
              Shaxsiy lug‘atingizga yangi so‘z qo‘shing va avtomatik talaffuzini eshiting
            </p>

            <form onSubmit={handleSaveWord} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">
                  English Word / Inglizcha so‘z *
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g., Breakthrough, Serendipity..."
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 focus:border-sky-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  Phonetics (IPA) / Fonetika (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={newIpa}
                  onChange={(e) => setNewIpa(e.target.value)}
                  placeholder="e.g., /ˈbreɪk.θruː/"
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 focus:border-sky-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  Uzbek Translation / O‘zbekcha ma‘nosi *
                </label>
                <input
                  type="text"
                  required
                  value={newUz}
                  onChange={(e) => setNewUz(e.target.value)}
                  placeholder="e.g., Katta yutuq, yangi bosqich..."
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 focus:border-sky-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  Example Sentence / Misol gap (Inglizcha)
                </label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g., This invention is a major breakthrough."
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 focus:border-sky-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  Example Meaning / Misol tarjimasi (O‘zbekcha)
                </label>
                <input
                  type="text"
                  value={newExampleUz}
                  onChange={(e) => setNewExampleUz(e.target.value)}
                  placeholder="e.g., Ushbu kashfiyot katta burilish bo‘ldi."
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 focus:border-cyan-400' : 'bg-slate-50 border-slate-200 focus:border-sky-500'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingWord(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold hover:bg-slate-800"
                >
                  Cancel / Bekor qilish
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
                >
                  Save Word / Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
