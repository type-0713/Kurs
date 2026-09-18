// Web Audio API Synthesizer for zero-latency UI and game audio
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = false;
    try {
      this.muted = localStorage.getItem('lingosphere_sound_muted') === 'true';
    } catch {
      this.muted = false;
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('lingosphere_sound_muted', String(this.muted));
    } catch {
      // ignore
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio tone error:', e);
      }
    }, delay * 1000);
  }

  playClick() {
    if (this.muted) return;
    this.playTone(800, 'triangle', 0.04, 0.05);
  }

  playCardFlip() {
    if (this.muted) return;
    this.playTone(450, 'sine', 0.06, 0.08);
  }

  playSuccess() {
    if (this.muted) return;
    this.playTone(523.25, 'sine', 0.12, 0.15, 0.0);    // C5
    this.playTone(659.25, 'sine', 0.12, 0.15, 0.08);   // E5
    this.playTone(783.99, 'sine', 0.15, 0.15, 0.16);   // G5
    this.playTone(1046.50, 'sine', 0.25, 0.18, 0.24);  // C6
  }

  playError() {
    if (this.muted) return;
    this.playTone(220, 'sawtooth', 0.15, 0.12, 0);
    this.playTone(180, 'sawtooth', 0.25, 0.15, 0.1);
  }

  playLaser() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  playCoin() {
    if (this.muted) return;
    this.playTone(987.77, 'sine', 0.08, 0.12, 0);    // B5
    this.playTone(1318.51, 'sine', 0.2, 0.15, 0.08); // E6
  }

  playCombo() {
    if (this.muted) return;
    this.playTone(440, 'triangle', 0.1, 0.1, 0);
    this.playTone(554, 'triangle', 0.1, 0.1, 0.06);
    this.playTone(659, 'triangle', 0.15, 0.12, 0.12);
  }

  playLevelUp() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.25, 0.15, idx * 0.09);
    });
  }

  playKeystroke() {
    if (this.muted) return;
    const freq = 600 + Math.random() * 200;
    this.playTone(freq, 'triangle', 0.03, 0.03);
  }
}

export const soundFx = new SoundSynthesizer();
