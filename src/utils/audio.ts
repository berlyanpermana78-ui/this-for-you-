// HTML5 Audio singleton background player for romantic love letter
// Source: https://files.catbox.moe/5elp10.mp3
// RULE: Audio is strictly unlocked ONLY after the envelope is opened (or upon reaching 'transition'/'letter').
// Persists smoothly across all subsequent pages including final celebration.

const AUDIO_SRC = 'https://files.catbox.moe/5elp10.mp3';

class GlobalAudioController {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private userExplicitlyMuted: boolean = false;
  private isEnvelopeUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio(AUDIO_SRC);
      this.audio.loop = true;
      this.audio.volume = 0.28; // volume ~28%
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        if (this.audio && !this.userExplicitlyMuted && this.isEnvelopeUnlocked) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
        }
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Background audio issue:', e);
      });
    } catch (e) {
      console.warn('Failed to initialize Audio instance:', e);
    }
  }

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isPlaying);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  /**
   * Called specifically when the user opens the surprise envelope
   */
  public unlockAndPlay(): Promise<void> {
    this.isEnvelopeUnlocked = true;
    this.userExplicitlyMuted = false;
    this.initAudio();
    if (!this.audio) return Promise.resolve();

    const promise = this.audio.play();
    if (promise !== undefined) {
      return promise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch((err) => {
          console.log('Audio autoplay after envelope open deferred:', err);
          // Attach one-time resume on next tap
          const onNextTap = () => {
            if (this.isEnvelopeUnlocked && !this.userExplicitlyMuted) {
              this.audio?.play().catch(() => {});
            }
            window.removeEventListener('pointerdown', onNextTap);
            window.removeEventListener('click', onNextTap);
          };
          window.addEventListener('pointerdown', onNextTap, { once: true });
          window.addEventListener('click', onNextTap, { once: true });
        });
    }
    return Promise.resolve();
  }

  public play(): Promise<void> {
    if (!this.isEnvelopeUnlocked) {
      // Prevent audio before envelope opening
      return Promise.resolve();
    }
    this.initAudio();
    if (!this.audio) return Promise.resolve();

    return this.audio.play().then(() => {
      this.isPlaying = true;
      this.notify();
    }).catch(() => {
      this.isPlaying = false;
      this.notify();
    });
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle(): boolean {
    if (!this.isEnvelopeUnlocked) {
      return false;
    }
    if (this.isPlaying) {
      this.userExplicitlyMuted = true;
      this.pause();
      return false;
    } else {
      this.userExplicitlyMuted = false;
      this.play().catch(() => {});
      return true;
    }
  }

  public tryAutoPlayOnInteraction() {
    if (!this.isEnvelopeUnlocked || this.isPlaying || this.userExplicitlyMuted) return;
    this.play().catch(() => {});
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public isUnlocked(): boolean {
    return this.isEnvelopeUnlocked;
  }

  public ensurePlaying() {
    if (this.isEnvelopeUnlocked && !this.userExplicitlyMuted && (!this.isPlaying || (this.audio && this.audio.paused))) {
      this.play().catch(() => {});
    }
  }

  public resetEnvelopeLock() {
    this.pause();
    this.isEnvelopeUnlocked = false;
    this.userExplicitlyMuted = false;
  }

  public setVolume(vol: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, vol));
    }
  }
}

export const bgMusic = new GlobalAudioController();
