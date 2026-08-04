import { instrumentManager } from '../audio/instruments';
import { audioEngine } from '../audio/engine';
import { MidiDevice } from '../types';

type NoteCallback = (note: string, velocity: number, isDown: boolean) => void;

class MidiManager {
  private static instance: MidiManager;
  private midiAccess: any = null;
  private devices: MidiDevice[] = [];
  private callbacks: Set<NoteCallback> = new Set();
  public sustainPedalDown = false;

  private constructor() {}

  public static getInstance(): MidiManager {
    if (!MidiManager.instance) {
      MidiManager.instance = new MidiManager();
    }
    return MidiManager.instance;
  }

  public async initMIDI(): Promise<MidiDevice[]> {
    if (typeof navigator === 'undefined' || !(navigator as any).requestMIDIAccess) {
      console.warn('Web MIDI API is not supported in this browser environment.');
      return [];
    }

    try {
      this.midiAccess = await (navigator as any).requestMIDIAccess();
      this.updateDevices();

      // Listen for hardware connections/disconnections
      this.midiAccess.onstatechange = () => {
        this.updateDevices();
      };

      console.log('🔌 Web MIDI Access Granted!');
      return this.devices;
    } catch (err) {
      console.warn('Web MIDI permission denied or unavailable:', err);
      return [];
    }
  }

  private updateDevices() {
    if (!this.midiAccess) return;
    this.devices = [];
    const inputs = this.midiAccess.inputs.values();
    
    for (const input of inputs) {
      this.devices.push({
        id: input.id,
        name: input.name || 'External MIDI Device',
        manufacturer: input.manufacturer || 'Generic',
        state: input.state,
      });

      // Bind MIDI message listener
      input.onmidimessage = this.handleMidiMessage.bind(this);
    }
  }

  private handleMidiMessage(event: any) {
    const [status, noteNumber, velocity] = event.data;
    const command = status >> 4; // 9 = note on, 8 = note off, 11 = control change

    // Ensure audio context is running on user input
    audioEngine.startAudioContext();

    if (command === 9 && velocity > 0) {
      // Note On
      const noteName = this.midiNumberToNoteName(noteNumber);
      const normalizedVel = velocity / 127;
      instrumentManager.triggerAttack(noteName, normalizedVel);
      this.notifyCallbacks(noteName, normalizedVel, true);
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      // Note Off
      const noteName = this.midiNumberToNoteName(noteNumber);
      if (!this.sustainPedalDown) {
        instrumentManager.triggerRelease(noteName);
      }
      this.notifyCallbacks(noteName, 0, false);
    } else if (command === 11 && noteNumber === 64) {
      // CC 64 = Sustain Pedal
      this.sustainPedalDown = velocity > 63;
      console.log(`🎹 Sustain Pedal: ${this.sustainPedalDown ? 'DOWN' : 'UP'}`);
    }
  }

  public subscribe(cb: NoteCallback) {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  private notifyCallbacks(note: string, velocity: number, isDown: boolean) {
    this.callbacks.forEach((cb) => cb(note, velocity, isDown));
  }

  public getConnectedDevices(): MidiDevice[] {
    return this.devices;
  }

  private midiNumberToNoteName(midiNum: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNum / 12) - 1;
    const pitch = noteNames[midiNum % 12];
    return `${pitch}${octave}`;
  }
}

export const midiManager = MidiManager.getInstance();
