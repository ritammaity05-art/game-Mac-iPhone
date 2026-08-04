export type InstrumentId =
  | 'grand-piano'
  | 'electric-piano'
  | 'organ'
  | 'synth'
  | 'strings'
  | 'guitar'
  | 'bass'
  | 'violin'
  | 'flute'
  | 'bell'
  | 'choir'
  | 'pads';

export interface PianoKeyInfo {
  keyNumber: number; // 1 to 88
  noteName: string;   // e.g. "C4", "F#3"
  pitchClass: string; // e.g. "C", "F#"
  octave: number;     // 0 to 8
  isBlack: boolean;
  shortcutKey?: string;
  frequency: number;  // Hz
}

export interface PianoRollNote {
  id: string;
  pitch: string;    // e.g., "C4"
  time: number;     // beat position in sixteenths or beats
  duration: number; // in beats (e.g. 0.25, 0.5, 1.0)
  velocity: number; // 0 to 127
  selected?: boolean;
}

export interface DrumTrack {
  id: string;
  name: string;
  sampleKey: string;
  steps: boolean[]; // 16 steps
  volume: number;   // 0 to 1
  pan: number;      // -1 to 1
  muted: boolean;
  soloed: boolean;
  color: string;
}

export interface FxConfig {
  masterGain: number;   // 0 to 1
  reverbDecay: number;  // 0.1 to 10
  reverbWet: number;    // 0 to 1
  delayTime: string;    // e.g., '8n', '4n'
  delayFeedback: number;// 0 to 0.9
  delayWet: number;     // 0 to 1
  chorusFreq: number;   // 0.1 to 10
  chorusWet: number;    // 0 to 1
  distortionDrive: number; // 0 to 1
  distortionWet: number;   // 0 to 1
  filterCutoff: number; // 20 to 20000 Hz
  filterResonance: number; // 0 to 20
  filterType: 'lowpass' | 'highpass' | 'bandpass';
  eqLow: number;        // -24 to 24 dB
  eqMid: number;        // -24 to 24 dB
  eqHigh: number;       // -24 to 24 dB
  compressorThreshold: number; // -60 to 0 dB
  compressorRatio: number;     // 1 to 20
}

export type ViewTab = 'piano' | 'pianoroll' | 'drums' | 'chords' | 'ai' | 'fx' | 'visualizer';

export interface ProjectMetadata {
  id: string;
  name: string;
  bpm: number;
  timeSignature: string;
  createdAt: string;
}

export interface ScaleDefinition {
  name: string;
  intervals: number[];
  description: string;
}

export interface ChordDefinition {
  name: string;
  symbol: string;
  intervals: number[];
  type: string;
}

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state: string;
}
