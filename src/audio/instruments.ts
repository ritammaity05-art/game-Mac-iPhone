import * as Tone from 'tone';
import { InstrumentId } from '../types';
import { effectsChain } from './effects';

class InstrumentManager {
  private static instance: InstrumentManager;
  private currentInstrumentId: InstrumentId = 'grand-piano';
  private synths: Map<InstrumentId, Tone.PolySynth | any> = new Map();

  private constructor() {
    this.initInstruments();
  }

  public static getInstance(): InstrumentManager {
    if (!InstrumentManager.instance) {
      InstrumentManager.instance = new InstrumentManager();
    }
    return InstrumentManager.instance;
  }

  private initInstruments() {
    // 1. Crystal-Clear Acoustic Grand Piano (Zero Distortion, Pure Timbre)
    const grandPiano = new Tone.PolySynth(Tone.Synth, {
      volume: -4, // Controlled gain to eliminate "booo" distortion
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.005, // Crisp hammer strike
        decay: 1.8,    // Natural piano decay
        sustain: 0.2,  // Balanced sustain
        release: 0.8,  // Clean release
      },
    });

    // 2. Electric Piano (FM Tine Synth)
    const electricPiano = new Tone.PolySynth(Tone.FMSynth, {
      volume: -6,
      harmonicity: 3.5,
      modulationIndex: 12,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 1.8, sustain: 0.2, release: 0.8 },
      modulation: { type: 'triangle' },
      modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 0.5 },
    });

    // 3. Organ (Multi-drawbar additive)
    const organ = new Tone.PolySynth(Tone.Synth, {
      volume: -8,
      oscillator: { type: 'square' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.3 },
    });

    // 4. Synth Lead (Sawtooth Lead)
    const synthLead = new Tone.PolySynth(Tone.Synth, {
      volume: -6,
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0.6, release: 0.6 },
    });

    // 5. Strings (Warm ensemble)
    const strings = new Tone.PolySynth(Tone.Synth, {
      volume: -6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.4, decay: 1.2, sustain: 0.8, release: 2.0 },
    });

    // 6. Guitar (Plucked acoustic timbre)
    const guitar = new Tone.PolySynth(Tone.Synth, {
      volume: -4,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.002, decay: 1.2, sustain: 0.1, release: 0.6 },
    });

    // 7. Bass (Sub/Analog Bass)
    const bass = new Tone.PolySynth(Tone.MonoSynth, {
      volume: -4,
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.6, sustain: 0.4, release: 0.5 },
      filterEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.3, baseFrequency: 80, octaves: 4 },
    });

    // 8. Violin (Solo String)
    const violin = new Tone.PolySynth(Tone.Synth, {
      volume: -6,
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.2, decay: 0.8, sustain: 0.7, release: 1.2 },
    });

    // 9. Flute (Airy Sine)
    const flute = new Tone.PolySynth(Tone.AMSynth, {
      volume: -6,
      harmonicity: 2,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.5, sustain: 0.8, release: 0.8 },
    });

    // 10. Bell (Crystalline Metallic)
    const bell = new Tone.PolySynth(Tone.FMSynth, {
      volume: -6,
      harmonicity: 8.5,
      modulationIndex: 20,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 2.5, sustain: 0.1, release: 1.5 },
    });

    // 11. Choir (Vocal pad)
    const choir = new Tone.PolySynth(Tone.AMSynth, {
      volume: -6,
      harmonicity: 1.5,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.5, decay: 1.5, sustain: 0.7, release: 2.5 },
    });

    // 12. Pads (Atmospheric Ambient)
    const pads = new Tone.PolySynth(Tone.Synth, {
      volume: -6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.8, decay: 2.0, sustain: 0.9, release: 2.5 },
    });

    this.synths.set('grand-piano', grandPiano.connect(effectsChain.inputNode));
    this.synths.set('electric-piano', electricPiano.connect(effectsChain.inputNode));
    this.synths.set('organ', organ.connect(effectsChain.inputNode));
    this.synths.set('synth', synthLead.connect(effectsChain.inputNode));
    this.synths.set('strings', strings.connect(effectsChain.inputNode));
    this.synths.set('guitar', guitar.connect(effectsChain.inputNode));
    this.synths.set('bass', bass.connect(effectsChain.inputNode));
    this.synths.set('violin', violin.connect(effectsChain.inputNode));
    this.synths.set('flute', flute.connect(effectsChain.inputNode));
    this.synths.set('bell', bell.connect(effectsChain.inputNode));
    this.synths.set('choir', choir.connect(effectsChain.inputNode));
    this.synths.set('pads', pads.connect(effectsChain.inputNode));
  }

  public setInstrument(id: InstrumentId) {
    this.currentInstrumentId = id;
    console.log(`🎹 Switched Active Instrument to: ${id}`);
  }

  public getActiveInstrument(): InstrumentId {
    return this.currentInstrumentId;
  }

  public triggerAttack(note: string, velocity = 0.8) {
    const synth = this.synths.get(this.currentInstrumentId);
    if (synth) {
      try {
        synth.triggerAttack(note, Tone.now(), velocity);
      } catch (err) {
        console.warn('Synth triggerAttack warning:', err);
      }
    }
  }

  public triggerRelease(note: string) {
    const synth = this.synths.get(this.currentInstrumentId);
    if (synth) {
      try {
        synth.triggerRelease(note, Tone.now());
      } catch (err) {
        console.warn('Synth triggerRelease warning:', err);
      }
    }
  }

  public releaseAll() {
    this.synths.forEach((synth) => {
      if (synth.releaseAll) {
        synth.releaseAll();
      }
    });
  }
}

export const instrumentManager = InstrumentManager.getInstance();
