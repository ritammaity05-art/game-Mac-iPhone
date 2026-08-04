import * as Tone from 'tone';
import { audioEngine } from './engine';
import { PianoRollNote } from '../types';

class RecorderService {
  private recorder: Tone.Recorder | null = null;
  private isRecording = false;
  private audioChunks: Blob[] = [];

  constructor() {
    this.recorder = new Tone.Recorder();
    audioEngine.masterGain.connect(this.recorder);
  }

  public async startRecording() {
    if (!this.recorder) return;
    await audioEngine.startAudioContext();
    this.recorder.start();
    this.isRecording = true;
    console.log('🔴 Live Audio Recording Started!');
  }

  public async stopRecording(): Promise<string> {
    if (!this.recorder || !this.isRecording) return '';
    const recordingBlob = await this.recorder.stop();
    this.isRecording = false;
    const url = URL.createObjectURL(recordingBlob);
    console.log('⏹️ Live Audio Recording Stopped! Blob URL created:', url);
    return url;
  }

  /**
   * Export Piano Roll Notes into a Standard MIDI file string / Blob download
   */
  public generateMidiFileBlob(notes: PianoRollNote[], bpm = 120): Blob {
    // Generate standard MIDI 1.0 binary header & track data
    // Track Header Chunk
    const header = [
      0x4d, 0x54, 0x68, 0x64, // 'MThd'
      0x00, 0x00, 0x00, 0x06, // Chunk length 6
      0x00, 0x00,             // Format 0 (single track)
      0x00, 0x01,             // 1 track
      0x00, 0x60              // 96 ticks per quarter note
    ];

    const trackEvents: number[] = [];

    // Set Tempo event (Meta event 0x51)
    const microsecondsPerQuarter = Math.round(60000000 / bpm);
    trackEvents.push(
      0x00, 0xff, 0x51, 0x03,
      (microsecondsPerQuarter >> 16) & 0xff,
      (microsecondsPerQuarter >> 8) & 0xff,
      microsecondsPerQuarter & 0xff
    );

    // Convert notes into MIDI NoteOn / NoteOff events sorted by time
    const midiEvents: { tick: number; status: number; pitch: number; vel: number }[] = [];

    notes.forEach((note) => {
      const pitchNumber = this.noteNameToMidiNumber(note.pitch);
      const startTick = Math.round(note.time * 96);
      const durationTicks = Math.round(note.duration * 96);
      const endTick = startTick + durationTicks;

      // Note On
      midiEvents.push({ tick: startTick, status: 0x90, pitch: pitchNumber, vel: note.velocity || 90 });
      // Note Off
      midiEvents.push({ tick: endTick, status: 0x80, pitch: pitchNumber, vel: 0 });
    });

    midiEvents.sort((a, b) => a.tick - b.tick);

    let lastTick = 0;
    midiEvents.forEach((ev) => {
      const delta = ev.tick - lastTick;
      lastTick = ev.tick;
      
      // Delta-time variable length quantity encoding
      this.writeVarLen(trackEvents, delta);
      trackEvents.push(ev.status, ev.pitch, ev.vel);
    });

    // End of Track Meta event (0xFF 0x2F 0x00)
    trackEvents.push(0x00, 0xff, 0x2f, 0x00);

    // Track Chunk Header
    const trackChunkLen = trackEvents.length;
    const trackHeader = [
      0x4d, 0x54, 0x72, 0x6b, // 'MTrk'
      (trackChunkLen >> 24) & 0xff,
      (trackChunkLen >> 16) & 0xff,
      (trackChunkLen >> 8) & 0xff,
      trackChunkLen & 0xff,
    ];

    const finalMidiBytes = new Uint8Array([...header, ...trackHeader, ...trackEvents]);
    return new Blob([finalMidiBytes], { type: 'audio/midi' });
  }

  private writeVarLen(arr: number[], value: number) {
    let buffer = value & 0x7f;
    while ((value >>= 7) > 0) {
      buffer <<= 8;
      buffer |= 0x80 | (value & 0x7f);
    }
    while (true) {
      arr.push(buffer & 0xff);
      if (buffer & 0x80) {
        buffer >>= 8;
      } else {
        break;
      }
    }
  }

  private noteNameToMidiNumber(noteName: string): number {
    const match = noteName.match(/^([A-G]#?)(\d+)$/);
    if (!match) return 60; // C4 default
    const pitchClass = match[1];
    const octave = parseInt(match[2], 10);
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const idx = noteNames.indexOf(pitchClass);
    return (octave + 1) * 12 + idx;
  }
}

export const recorderService = new RecorderService();
