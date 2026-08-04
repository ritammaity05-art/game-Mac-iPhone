import * as Tone from 'tone';
import { audioEngine } from './engine';
import { FxConfig } from '../types';

class EffectsChain {
  private static instance: EffectsChain;

  public reverb: Tone.Reverb;
  public delay: Tone.PingPongDelay;
  public chorus: Tone.Chorus;
  public eq: Tone.EQ3;
  public distortion: Tone.Distortion;
  public filter: Tone.Filter;
  public compressor: Tone.Compressor;

  public inputNode: Tone.Gain;

  private constructor() {
    this.inputNode = new Tone.Gain(0.85);

    // Clean Studio Reverb
    this.reverb = new Tone.Reverb({ decay: 2.2, wet: 0.2 });
    this.delay = new Tone.PingPongDelay({ delayTime: '8n', feedback: 0.2, wet: 0.1 });
    this.chorus = new Tone.Chorus({ frequency: 1.2, delayTime: 3.0, depth: 0.4, wet: 0.08 }).start();
    this.eq = new Tone.EQ3({ low: 1, mid: 0, high: 1 });
    this.distortion = new Tone.Distortion({ distortion: 0.0, wet: 0.0 });
    this.filter = new Tone.Filter({ frequency: 18000, type: 'lowpass', Q: 1 });
    this.compressor = new Tone.Compressor({ threshold: -20, ratio: 4, attack: 0.01, release: 0.2 });

    this.inputNode
      .connect(this.filter)
      .connect(this.eq)
      .connect(this.distortion)
      .connect(this.chorus)
      .connect(this.delay)
      .connect(this.reverb)
      .connect(this.compressor)
      .connect(audioEngine.masterGain);
  }

  public static getInstance(): EffectsChain {
    if (!EffectsChain.instance) {
      EffectsChain.instance = new EffectsChain();
    }
    return EffectsChain.instance;
  }

  public updateConfig(config: Partial<FxConfig>) {
    if (config.masterGain !== undefined) {
      audioEngine.setMasterVolume(config.masterGain);
    }
    if (config.reverbDecay !== undefined) {
      this.reverb.decay = Math.max(0.1, config.reverbDecay);
      this.reverb.generate();
    }
    if (config.reverbWet !== undefined) {
      this.reverb.wet.value = config.reverbWet;
    }
    if (config.delayFeedback !== undefined) {
      this.delay.feedback.value = config.delayFeedback;
    }
    if (config.delayWet !== undefined) {
      this.delay.wet.value = config.delayWet;
    }
    if (config.chorusWet !== undefined) {
      this.chorus.wet.value = config.chorusWet;
    }
    if (config.distortionDrive !== undefined) {
      this.distortion.distortion = config.distortionDrive;
    }
    if (config.distortionWet !== undefined) {
      this.distortion.wet.value = config.distortionWet;
    }
    if (config.filterCutoff !== undefined) {
      this.filter.frequency.rampTo(config.filterCutoff, 0.05);
    }
    if (config.filterResonance !== undefined) {
      this.filter.Q.value = config.filterResonance;
    }
    if (config.eqLow !== undefined) {
      this.eq.low.value = config.eqLow;
    }
    if (config.eqMid !== undefined) {
      this.eq.mid.value = config.eqMid;
    }
    if (config.eqHigh !== undefined) {
      this.eq.high.value = config.eqHigh;
    }
    if (config.compressorThreshold !== undefined) {
      this.compressor.threshold.value = config.compressorThreshold;
    }
  }
}

export const effectsChain = EffectsChain.getInstance();
