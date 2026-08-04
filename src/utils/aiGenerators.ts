import { PianoRollNote } from '../types';
import { MAC_EASY_MAP } from './musicTheory';

export interface MelodyGeneratorOptions {
  key: string;       // e.g. "C"
  scale: string;     // e.g. "Major (Ionian)"
  octave: number;    // e.g. 4
  lengthBars: number;// 2, 4, 8
  density: 'sparse' | 'medium' | 'dense';
}

const SCALE_SEMITONES: Record<string, number[]> = {
  'Major (Ionian)': [0, 2, 4, 5, 7, 9, 11],
  'Natural Minor (Aeolian)': [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function generateAIMelody(options: MelodyGeneratorOptions): PianoRollNote[] {
  const { key, scale, octave, lengthBars, density } = options;
  const rootIndex = NOTE_NAMES.indexOf(key);
  const intervals = SCALE_SEMITONES[scale] || SCALE_SEMITONES['Major (Ionian)'];
  
  const pitchPool: string[] = [];
  [octave, octave + 1].forEach((oct) => {
    intervals.forEach((semi) => {
      const idx = (rootIndex + semi) % 12;
      const actOct = oct + Math.floor((rootIndex + semi) / 12);
      pitchPool.push(`${NOTE_NAMES[idx]}${actOct}`);
    });
  });

  const notes: PianoRollNote[] = [];
  const totalBeats = lengthBars * 4;
  const stepIncrement = density === 'sparse' ? 1.0 : density === 'medium' ? 0.5 : 0.25;

  let currentBeat = 0;
  let lastPitchIndex = Math.floor(pitchPool.length / 2);

  while (currentBeat < totalBeats) {
    if (Math.random() > 0.25) {
      const delta = [ -2, -1, -1, 0, 1, 1, 2, 3 ][Math.floor(Math.random() * 8)];
      lastPitchIndex = Math.max(0, Math.min(pitchPool.length - 1, lastPitchIndex + delta));
      const pitch = pitchPool[lastPitchIndex];
      const duration = [0.25, 0.5, 0.75, 1.0][Math.floor(Math.random() * 4)];
      const velocity = Math.floor(Math.random() * 30 + 80);

      notes.push({
        id: `ai_melody_${Date.now()}_${notes.length}`,
        pitch,
        time: currentBeat,
        duration: Math.min(duration, totalBeats - currentBeat),
        velocity,
      });

      currentBeat += duration;
    } else {
      currentBeat += stepIncrement;
    }
  }

  return notes;
}

/**
 * Generate a FULL 3-Minute Multi-Section Song (Intro + Mukhda + Antara + Chorus + Outro)
 */
export function generateFullSongMelody(songName: string): { notes: PianoRollNote[]; macKeys: string[]; bpm: number } {
  // Key mapping for easy Mac keyboard
  const macKeyPool = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '1', '2', '3', '4', '5'];
  
  const macKeys: string[] = [];
  const notes: PianoRollNote[] = [];
  let currentBeat = 0;

  // Structure: Intro (4 bars), Verse 1 (8 bars), Chorus (8 bars), Verse 2 (8 bars), Outro (4 bars) = 32 bars
  const sections = [
    { name: 'Intro', bars: 4, speed: 0.5 },
    { name: 'Mukhda (Verse 1)', bars: 8, speed: 0.4 },
    { name: 'Chorus (Hook)', bars: 8, speed: 0.35 },
    { name: 'Antara (Verse 2)', bars: 8, speed: 0.4 },
    { name: 'Outro', bars: 4, speed: 0.6 },
  ];

  let kIdx = 0;

  sections.forEach((sec) => {
    const sectionBeats = sec.bars * 4;
    let secBeat = 0;

    while (secBeat < sectionBeats) {
      // Pick Mac key
      const keyChar = macKeyPool[kIdx % macKeyPool.length];
      kIdx = (kIdx + Math.floor(Math.random() * 3 + 1)) % macKeyPool.length;

      const targetPitch = MAC_EASY_MAP[keyChar.toLowerCase()] || 'C4';
      const dur = [0.5, 0.75, 1.0, 1.5][Math.floor(Math.random() * 4)];

      macKeys.push(keyChar);
      notes.push({
        id: `full_song_${currentBeat}_${Date.now()}`,
        pitch: targetPitch,
        time: currentBeat,
        duration: dur,
        velocity: 88,
      });

      secBeat += dur;
      currentBeat += dur;

      // Rest pause occasionally
      if (Math.random() > 0.7) {
        macKeys.push(' ');
        currentBeat += 0.5;
        secBeat += 0.5;
      }
    }
  });

  return {
    notes,
    macKeys,
    bpm: 92,
  };
}

export function generateAIChordProgression(key: string, style: string): PianoRollNote[] {
  const rootIndex = NOTE_NAMES.indexOf(key);
  const baseOctave = 3;

  const progressionsMap: Record<string, number[][]> = {
    Pop: [
      [0, 4, 7],
      [7, 11, 14],
      [9, 12, 16],
      [5, 9, 12],
    ],
    Jazz: [
      [2, 5, 9, 12],
      [7, 11, 14, 17],
      [0, 4, 7, 11],
      [9, 12, 16, 19],
    ],
    Synthwave: [
      [9, 12, 16],
      [5, 8, 12],
      [0, 3, 7],
      [7, 10, 14],
    ],
    LoFi: [
      [0, 3, 7, 10],
      [5, 8, 12, 15],
      [7, 10, 14, 17],
      [9, 12, 15, 19],
    ],
  };

  const selectedProg = progressionsMap[style] || progressionsMap['Pop'];
  const notes: PianoRollNote[] = [];

  selectedProg.forEach((chordSemitones, barIndex) => {
    const startTime = barIndex * 4;
    chordSemitones.forEach((semi) => {
      const absSemi = rootIndex + semi;
      const pitchClass = NOTE_NAMES[absSemi % 12];
      const oct = baseOctave + Math.floor(absSemi / 12);
      
      notes.push({
        id: `ai_chord_${barIndex}_${semi}_${Date.now()}`,
        pitch: `${pitchClass}${oct}`,
        time: startTime,
        duration: 3.8,
        velocity: 85,
      });
    });
  });

  return notes;
}

export function generateAIHarmony(existingNotes: PianoRollNote[]): PianoRollNote[] {
  return existingNotes.map((note) => {
    const match = note.pitch.match(/^([A-G]#?)(\d+)$/);
    if (!match) return note;
    const pitchClass = match[1];
    const oct = parseInt(match[2], 10);
    const idx = NOTE_NAMES.indexOf(pitchClass);
    const harmIdx = (idx + 4) % 12;
    const harmOct = oct + Math.floor((idx + 4) / 12);

    return {
      id: `ai_harm_${note.id}`,
      pitch: `${NOTE_NAMES[harmIdx]}${harmOct}`,
      time: note.time,
      duration: note.duration,
      velocity: Math.max(50, note.velocity - 15),
    };
  });
}
