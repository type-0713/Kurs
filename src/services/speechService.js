// Robust, 100% Local & Cross-Browser Speech Service
// Fixes CORS/403 errors, Chrome GC bugs, and ensures speech only triggers on explicit user request.

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.voices = [];
    this.selectedVoice = null;
    this.speechRate = 0.95;
    this.speechPitch = 1.0;
    this.isSpeaking = false;

    if (typeof window !== 'undefined') {
      this.initVoices();
      if (this.synth && this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    try {
      const allVoices = this.synth.getVoices() || [];
      // Strictly pick English voices
      this.voices = allVoices.filter(v => 
        v.lang && (v.lang.toLowerCase().startsWith('en-') || v.lang.toLowerCase() === 'en' || v.lang.toLowerCase().startsWith('en_'))
      );

      if (this.voices.length > 0) {
        // High quality priority ranking
        const qualityRank = [
          'Natural',
          'Jenny',
          'Guy',
          'Aria',
          'Google US English',
          'Google UK English Female',
          'Samantha',
          'Daniel',
          'Karen',
          'en-US',
          'en-GB'
        ];

        this.voices.sort((a, b) => {
          const scoreA = qualityRank.findIndex(k => a.name.includes(k) || a.lang.includes(k));
          const scoreB = qualityRank.findIndex(k => b.name.includes(k) || b.lang.includes(k));
          return (scoreA === -1 ? 999 : scoreA) - (scoreB === -1 ? 999 : scoreB);
        });

        if (!this.selectedVoice) {
          this.selectedVoice = this.voices[0];
        }
      }
    } catch (e) {
      console.warn('Voice initialization error:', e);
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
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }
    this.isSpeaking = false;
    window._activeUtterance = null;
  }

  // Speak method: ONLY runs on explicit user click (no CORS, no 403, no errors)
  speak(text, { rate = 0.95, pitch = 1.0, onBoundary = null, onEnd = null, onStart = null } = {}) {
    if (!text || typeof text !== 'string') return;
    const clean = text.trim();
    if (!clean) return;

    if (!this.synth) {
      console.warn('Speech synthesis is not supported on this device.');
      if (onEnd) onEnd();
      return;
    }

    // Stop any current utterance
    this.stop();

    // Small delay before speaking to prevent Chrome cancellation bug
    setTimeout(() => {
      try {
        if (this.synth.paused) {
          this.synth.resume();
        }

        if (this.voices.length === 0) {
          this.initVoices();
        }

        const utterance = new SpeechSynthesisUtterance(clean);
        window._activeUtterance = utterance; // Prevent garbage collection bug

        utterance.lang = this.selectedVoice ? this.selectedVoice.lang : 'en-US';
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }

        utterance.rate = Math.max(0.5, Math.min(1.5, rate || this.speechRate));
        utterance.pitch = Math.max(0.8, Math.min(1.2, pitch || this.speechPitch));

        utterance.onstart = () => {
          this.isSpeaking = true;
          if (onStart) onStart();
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          window._activeUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = (event) => {
          this.isSpeaking = false;
          window._activeUtterance = null;
          // 'canceled' or 'interrupted' is normal when user stops or changes word
          if (event.error !== 'canceled' && event.error !== 'interrupted') {
            console.warn('SpeechSynthesis notice:', event.error);
          }
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
      } catch (err) {
        console.warn('Speech error occurred:', err);
        this.isSpeaking = false;
        window._activeUtterance = null;
        if (onEnd) onEnd();
      }
    }, 40);
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
