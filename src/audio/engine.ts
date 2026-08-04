import * as Tone from 'tone';

class AudioEngine {
  private static instance: AudioEngine;
  private isInitialized = false;
  
  public masterGain: Tone.Gain;
  public masterLimiter: Tone.Limiter;
  public waveformAnalyser: Tone.Analyser;
  public fftAnalyser: Tone.Analyser;

  private constructor() {
    this.masterGain = new Tone.Gain(0.85);
    this.masterLimiter = new Tone.Limiter(-0.5);
    
    // Waveform & FFT Analysers for 60 FPS Visualizers
    this.waveformAnalyser = new Tone.Analyser('waveform', 1024);
    this.fftAnalyser = new Tone.Analyser('fft', 64);

    // Connect chain to master destination
    this.masterGain.connect(this.masterLimiter);
    this.masterLimiter.connect(this.waveformAnalyser);
    this.waveformAnalyser.connect(this.fftAnalyser);
    this.fftAnalyser.toDestination();
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public async startAudioContext(): Promise<boolean> {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
      console.log('🔊 Web Audio Context Started & Unlocked!');
    }
    this.isInitialized = true;
    return true;
  }

  public setBpm(bpm: number) {
    Tone.getTransport().bpm.value = Math.max(40, Math.min(280, bpm));
  }

  public setMasterVolume(vol: number) {
    // vol is 0 to 1
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.rampTo(clamped, 0.05);
  }

  public getWaveformData(): Float32Array {
    return this.waveformAnalyser.getValue() as Float32Array;
  }

  public getFftData(): Float32Array {
    return this.fftAnalyser.getValue() as Float32Array;
  }
}

export const audioEngine = AudioEngine.getInstance();
