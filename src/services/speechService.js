// Ultra High-Fidelity Audio & Speech Engine (Studio Native Stream + SpeechSynthesis + Speech Recognition)

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.voices = [];
    this.selectedVoice = null;
    this.speechRate = 1.0;
    this.speechPitch = 1.0;
    this.currentAudio = null;

    // Default engine: 'studio' (Crystal clear Native Studio Audio Stream) or 'browser'
    try {
      this.audioEngine = localStorage.getItem('lingosphere_audio_engine') || 'studio';
    } catch {
      this.audioEngine = 'studio';
    }

    if (typeof window !== 'undefined') {
      this.initVoices();
      if (this.synth && this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  setAudioEngine(engine) {
    this.audioEngine = engine;
    try {
      localStorage.setItem('lingosphere_audio_engine', engine);
    } catch {
      // ignore
    }
    return this.audioEngine;
  }

  getAudioEngine() {
    return this.audioEngine;
  }

  initVoices() {
    if (!this.synth) return;
    const allVoices = this.synth.getVoices();
    // Only accept genuine English voices
    this.voices = allVoices.filter(v => 
      v.lang && (v.lang.startsWith('en-') || v.lang === 'en' || v.lang.startsWith('en_'))
    );

    if (this.voices.length > 0) {
      // Sort to prioritize natural high-fidelity voices
      const naturalPriority = [
        'Natural',
        'Jenny',
        'Guy',
        'Aria',
        'Google US English',
        'Google UK English Female',
        'Samantha',
        'Daniel',
        'Karen',
        'en-US'
      ];

      this.voices.sort((a, b) => {
        const scoreA = naturalPriority.findIndex(p => a.name.includes(p) || a.lang.includes(p));
        const scoreB = naturalPriority.findIndex(p => b.name.includes(p) || b.lang.includes(p));
        return (scoreA === -1 ? 99 : scoreA) - (scoreB === -1 ? 99 : scoreB);
      });

      if (!this.selectedVoice) {
        this.selectedVoice = this.voices[0];
      }
    }
  }

  getVoices() {
    if (this.voices.length === 0) {
      this.initVoices();
    }
    return this.voices;
  }

  setVoice(voiceUri) {
    const found = this.voices.find(v => v.voiceURI === voiceUri || v.name === voiceUri);
    if (found) {
      this.selectedVoice = found;
    }
  }

  stop() {
    // Stop any streaming audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    // Stop browser synthesis
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }
  }

  // Master speak function: uses Studio HD stream or Browser Synthesis based on preference
  speak(text, { rate = 1.0, pitch = 1.0, onBoundary = null, onEnd = null, onStart = null } = {}) {
    if (!text || typeof text !== 'string') return;
    const cleanText = text.trim();
    if (!cleanText) return;

    this.stop();

    if (this.audioEngine === 'studio') {
      this.speakStudioStream(cleanText, { rate, onStart, onEnd, onBoundary });
    } else {
      this.speakSynthesis(cleanText, { rate, pitch, onStart, onEnd, onBoundary });
    }
  }

  // 1. Studio Native Audio Stream (Crystal clear native human American accent)
  speakStudioStream(text, { rate = 1.0, onStart = null, onEnd = null, onBoundary = null } = {}) {
    try {
      // High-resolution native TTS stream
      const encoded = encodeURIComponent(text);
      // Dual source: standard Google TTS stream for pristine pronunciation
      const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-US&q=${encoded}`;
      
      const audio = new Audio(streamUrl);
      this.currentAudio = audio;
      audio.playbackRate = Math.max(0.5, Math.min(1.5, rate || this.speechRate));

      if (onStart) onStart();

      // Karaoke simulation for stream
      let words = text.split(/\s+/);
      let wordDuration = (text.length * 55) / (words.length || 1);
      let boundaryInterval;

      if (onBoundary && words.length > 1) {
        let currentWord = 0;
        boundaryInterval = setInterval(() => {
          currentWord++;
          if (currentWord < words.length) {
            onBoundary(currentWord);
          } else {
            clearInterval(boundaryInterval);
          }
        }, wordDuration);
      }

      audio.onended = () => {
        if (boundaryInterval) clearInterval(boundaryInterval);
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (err) => {
        if (boundaryInterval) clearInterval(boundaryInterval);
        console.warn('Studio audio stream blocked, falling back to Browser Synthesis:', err);
        // Seamless fallback
        this.speakSynthesis(text, { rate, onStart, onEnd, onBoundary });
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (boundaryInterval) clearInterval(boundaryInterval);
          this.speakSynthesis(text, { rate, onStart, onEnd, onBoundary });
        });
      }
    } catch {
      this.speakSynthesis(text, { rate, onStart, onEnd, onBoundary });
    }
  }

  // 2. Upgraded Browser Speech Synthesis with anti-garbage collection fix
  speakSynthesis(text, { rate = 1.0, pitch = 1.0, onBoundary = null, onEnd = null, onStart = null } = {}) {
    if (!this.synth) return;

    if (this.voices.length === 0) {
      this.initVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Prevent garbage collection cutoff bug in Chromium
    window._lingoSpeechUtterance = utterance;

    utterance.lang = this.selectedVoice ? this.selectedVoice.lang : 'en-US';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.rate = Math.max(0.5, Math.min(1.8, rate || this.speechRate));
    utterance.pitch = Math.max(0.8, Math.min(1.3, pitch || this.speechPitch));

    if (onStart) utterance.onstart = onStart;
    utterance.onend = () => {
      window._lingoSpeechUtterance = null;
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      window._lingoSpeechUtterance = null;
      console.warn('SpeechSynthesis error:', e);
      if (onEnd) onEnd();
    };

    if (onBoundary) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onBoundary(event.charIndex);
        }
      };
    }

    this.synth.speak(utterance);
  }

  // Speech Recognition (Microphone)
  initRecognition() {
    if (typeof window === 'undefined') return null;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.maxAlternatives = 1;
    return rec;
  }

  startListening({ onResult, onError, onEnd }) {
    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.recognition = this.initRecognition();
      if (!this.recognition) {
        if (onError) onError('Mikrofon ushbu brauzerda qo‘llab-quvvatlanmaydi. Chrome yoki Edge brauzeridan foydalaning.');
        return false;
      }

      this.isListening = true;

      this.recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) isFinal = true;
        }
        if (onResult) onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error === 'not-allowed' ? 'Mikrofon ruxsati berilmagan. Brauzer sozlamalaridan ruxsat bering.' : event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      this.isListening = false;
      if (onError) onError(err.message || 'Mikrofon xatosi');
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  // Calculate Pronunciation Accuracy (0 - 100%) and Word-by-Word diff
  calculateAccuracy(spokenText, targetText) {
    if (!spokenText || !targetText) return { score: 0, wordFeedback: [] };

    const clean = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s']/g, '')
        .trim();

    const spokenClean = clean(spokenText);
    const targetClean = clean(targetText);

    const targetWords = targetClean.split(/\s+/).filter(Boolean);
    const spokenWords = spokenClean.split(/\s+/).filter(Boolean);

    if (targetWords.length === 0) return { score: 0, wordFeedback: [] };

    let totalScore = 0;
    const wordFeedback = targetWords.map((tWord, idx) => {
      const sWord = spokenWords[idx] || '';

      if (sWord === tWord) {
        totalScore += 100;
        return { word: tWord, spoken: sWord, status: 'perfect', score: 100 };
      }

      const sim = this.stringSimilarity(tWord, sWord);
      totalScore += sim;

      if (sim >= 80) {
        return { word: tWord, spoken: sWord, status: 'good', score: sim };
      } else if (sim >= 50) {
        return { word: tWord, spoken: sWord, status: 'fair', score: sim };
      } else {
        return { word: tWord, spoken: sWord || '...', status: 'missed', score: sim };
      }
    });

    const averageScore = Math.round(totalScore / targetWords.length);
    return {
      score: Math.min(100, Math.max(0, averageScore)),
      wordFeedback,
      recognizedText: spokenText
    };
  }

  stringSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 100;
    const dist = this.levenshtein(longer, shorter);
    return Math.round(((longer.length - dist) / longer.length) * 100);
  }

  levenshtein(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}

export const speechService = new SpeechService();
