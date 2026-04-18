// Sound Manager for Stewardship5
// Handles lobby music, countdown ticks, and sound effects

type SoundType = 'lobby' | 'tick' | 'submitted' | 'reveal' | 'countdown';

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private musicVolume = 0.3;
  private sfxVolume = 0.5;
  private initialized = false;

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Create audio elements with placeholder paths
    // Users can add their own audio files to /public/sounds/
    const soundPaths: Record<SoundType, string> = {
      lobby: '/sounds/lobby-music.mp3',
      tick: '/sounds/tick.mp3',
      submitted: '/sounds/submitted.mp3',
      reveal: '/sounds/reveal.mp3',
      countdown: '/sounds/countdown.mp3',
    };

    Object.entries(soundPaths).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      
      if (type === 'lobby') {
        audio.loop = true;
        audio.volume = this.musicVolume;
      } else {
        audio.volume = this.sfxVolume;
      }
      
      this.sounds.set(type as SoundType, audio);
    });

    this.initialized = true;
  }

  private play(type: SoundType) {
    if (!this.initialized) this.init();
    
    const sound = this.sounds.get(type);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Silently fail - audio may be blocked by browser
      });
    }
  }

  private stop(type: SoundType) {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  playLobbyMusic() {
    this.play('lobby');
  }

  stopLobbyMusic() {
    this.stop('lobby');
  }

  playTick() {
    this.play('tick');
  }

  playSubmitted() {
    this.play('submitted');
  }

  playReveal() {
    this.play('reveal');
  }

  playCountdown() {
    this.play('countdown');
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    const lobbySound = this.sounds.get('lobby');
    if (lobbySound) lobbySound.volume = this.musicVolume;
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound, type) => {
      if (type !== 'lobby') sound.volume = this.sfxVolume;
    });
  }

  stopAll() {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

// Singleton instance
export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null;
