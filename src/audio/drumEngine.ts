import * as Tone from 'tone';
import { DrumTrack } from '../types';
import { effectsChain } from './effects';

class DrumEngine {
  private static instance: DrumEngine;

  private kickSynth: Tone.MembraneSynth;
  private snareSynth: Tone.NoiseSynth;
  private hihatSynth: Tone.MetalSynth;
  private clapSynth: Tone.NoiseSynth;
  private crashSynth: Tone.MetalSynth;
  private tomSynth: Tone.MembraneSynth;
  private bass808Synth: Tone.MembraneSynth;

  private constructor() {
    // 1. Kick Drum
    this.kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 8,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4 },
    }).connect(effectsChain.inputNode);

    // 2. Snare Drum
    this.snareSynth = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0.0 },
    }).connect(effectsChain.inputNode);

    // 3. Hi-Hat
    this.hihatSynth = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.08, release: 0.05 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).connect(effectsChain.inputNode);

    // 4. Clap
    this.clapSynth = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.005, decay: 0.15, sustain: 0.0 },
    }).connect(effectsChain.inputNode);

    // 5. Crash
    this.crashSynth = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 1.2, release: 0.8 },
      harmonicity: 8.0,
      modulationIndex: 40,
      resonance: 2000,
      octaves: 2,
    }).connect(effectsChain.inputNode);

    // 6. Tom
    this.tomSynth = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 0.3 },
    }).connect(effectsChain.inputNode);

    // 7. 808 Bass Drum
    this.bass808Synth = new Tone.MembraneSynth({
      pitchDecay: 0.04,
      octaves: 10,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 1.0, sustain: 0.1, release: 0.8 },
    }).connect(effectsChain.inputNode);
  }

  public static getInstance(): DrumEngine {
    if (!DrumEngine.instance) {
      DrumEngine.instance = new DrumEngine();
    }
    return DrumEngine.instance;
  }

  public triggerDrum(sampleKey: string) {
    const time = Tone.now();
    try {
      switch (sampleKey) {
        case 'kick':
          this.kickSynth.triggerAttackRelease('C1', '8n', time);
          break;
        case 'snare':
          this.snareSynth.triggerAttackRelease('8n', time);
          break;
        case 'hihat':
          this.hihatSynth.triggerAttackRelease('16n', time);
          break;
        case 'hihat-open':
          this.hihatSynth.triggerAttackRelease('8n', time);
          break;
        case 'clap':
          this.clapSynth.triggerAttackRelease('16n', time);
          break;
        case 'crash':
          this.crashSynth.triggerAttackRelease('4n', time);
          break;
        case 'tom':
          this.tomSynth.triggerAttackRelease('G2', '8n', time);
          break;
        case '808':
          this.bass808Synth.triggerAttackRelease('F0', '4n', time);
          break;
        default:
          this.kickSynth.triggerAttackRelease('C1', '8n', time);
      }
    } catch (e) {
      console.warn('Drum trigger error:', e);
    }
  }

  public getInitialTracks(): DrumTrack[] {
    return [
      { id: 't1', name: 'Kick', sampleKey: 'kick', steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], volume: 0.9, pan: 0, muted: false, soloed: false, color: '#ef4444' },
      { id: 't2', name: 'Snare', sampleKey: 'snare', steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], volume: 0.85, pan: 0, muted: false, soloed: false, color: '#3b82f6' },
      { id: 't3', name: 'Hi-Hat Closed', sampleKey: 'hihat', steps: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true], volume: 0.7, pan: 0.2, muted: false, soloed: false, color: '#06b6d4' },
      { id: 't4', name: 'Hi-Hat Open', sampleKey: 'hihat-open', steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false], volume: 0.75, pan: -0.2, muted: false, soloed: false, color: '#10b981' },
      { id: 't5', name: 'Clap', sampleKey: 'clap', steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], volume: 0.8, pan: 0, muted: false, soloed: false, color: '#ec4899' },
      { id: 't6', name: 'Tom', sampleKey: 'tom', steps: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, true, false], volume: 0.7, pan: -0.4, muted: false, soloed: false, color: '#f59e0b' },
      { id: 't7', name: 'Crash', sampleKey: 'crash', steps: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], volume: 0.6, pan: 0.4, muted: false, soloed: false, color: '#8b5cf6' },
      { id: 't8', name: '808 Sub', sampleKey: '808', steps: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false], volume: 0.95, pan: 0, muted: false, soloed: false, color: '#f43f5e' },
    ];
  }
}

export const drumEngine = DrumEngine.getInstance();
