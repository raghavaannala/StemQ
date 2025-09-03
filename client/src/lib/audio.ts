// Audio feedback system for STEM Quest gamification
class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.loadSounds();
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
      this.isEnabled = false;
    }
  }

  private async loadSounds() {
    if (!this.audioContext) return;

    try {
      // Generate simple sound effects using Web Audio API
      this.sounds.set('correct', this.generateTone(800, 0.2, 'sine'));
      this.sounds.set('incorrect', this.generateTone(200, 0.3, 'sawtooth'));
      this.sounds.set('levelup', this.generateMelody([523, 659, 784], 0.15));
      this.sounds.set('achievement', this.generateMelody([392, 523, 659, 784], 0.1));
      this.sounds.set('streak', this.generateTone(1000, 0.1, 'square'));
      this.sounds.set('complete', this.generateMelody([659, 784, 1047], 0.2));
    } catch (error) {
      console.warn('Failed to generate sounds:', error);
    }
  }

  private generateTone(frequency: number, duration: number, type: OscillatorType): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not available');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }
      
      // Apply envelope to avoid clicks
      const envelope = Math.exp(-t * 3);
      data[i] = value * envelope * 0.3;
    }

    return buffer;
  }

  private generateMelody(frequencies: number[], noteDuration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not available');

    const totalDuration = frequencies.length * noteDuration;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * totalDuration, sampleRate);
    const data = buffer.getChannelData(0);

    frequencies.forEach((frequency, index) => {
      const startTime = index * noteDuration;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor((startTime + noteDuration) * sampleRate);

      for (let i = startSample; i < endSample && i < data.length; i++) {
        const t = (i - startSample) / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * t);
        
        // Apply envelope
        const envelope = Math.exp(-t * 5);
        data[i] = value * envelope * 0.2;
      }
    });

    return buffer;
  }

  async playSound(soundName: string): Promise<void> {
    if (!this.isEnabled || !this.audioContext || !this.sounds.has(soundName)) {
      return;
    }

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const buffer = this.sounds.get(soundName)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Set volume
      gainNode.gain.value = 0.5;

      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // Convenience methods for specific game events
  async playCorrectAnswer(): Promise<void> {
    await this.playSound('correct');
  }

  async playIncorrectAnswer(): Promise<void> {
    await this.playSound('incorrect');
  }

  async playLevelUp(): Promise<void> {
    await this.playSound('levelup');
  }

  async playAchievement(): Promise<void> {
    await this.playSound('achievement');
  }

  async playStreakBonus(): Promise<void> {
    await this.playSound('streak');
  }

  async playQuizComplete(): Promise<void> {
    await this.playSound('complete');
  }
}

// Create and export a singleton instance
export const audioManager = new AudioManager();

// Audio feedback hooks for React components
export const useAudioFeedback = () => {
  const playCorrect = () => audioManager.playCorrectAnswer();
  const playIncorrect = () => audioManager.playIncorrectAnswer();
  const playLevelUp = () => audioManager.playLevelUp();
  const playAchievement = () => audioManager.playAchievement();
  const playStreak = () => audioManager.playStreakBonus();
  const playComplete = () => audioManager.playQuizComplete();

  return {
    playCorrect,
    playIncorrect,
    playLevelUp,
    playAchievement,
    playStreak,
    playComplete,
    setEnabled: audioManager.setEnabled.bind(audioManager),
    isEnabled: audioManager.isAudioEnabled.bind(audioManager)
  };
};
