import { PianoKeyInfo, ScaleDefinition, ChordDefinition } from '../types';

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const KEYBOARD_SHORTCUTS: Record<string, string> = {
  'z': 'C4',
  's': 'C#4',
  'x': 'D4',
  'd': 'D#4',
  'c': 'E4',
  'v': 'F4',
  'g': 'F#4',
  'b': 'G4',
  'h': 'G#4',
  'n': 'A4',
  'j': 'A#4',
  'm': 'B4',
  'q': 'C5',
  '2': 'C#5',
  'w': 'D5',
  '3': 'D#5',
  'e': 'E5',
  'r': 'F5',
  '5': 'F#5',
  't': 'G5',
  '6': 'G#5',
  'y': 'A5',
  '7': 'A#5',
  'u': 'B5',
  'i': 'C6',
};

export const MAC_EASY_MAP: Record<string, string> = {
  'a': 'C3',
  's': 'D3',
  'd': 'E3',
  'f': 'F3',
  'g': 'G3',
  'h': 'A3',
  'j': 'B3',
  'k': 'C4',
  'l': 'D4',

  'q': 'C4',
  'w': 'D4',
  'e': 'E4',
  'r': 'F4',
  't': 'G4',
  'y': 'A4',
  'u': 'B4',
  'i': 'C5',
  'o': 'D5',
  'p': 'E5',

  '1': 'C5',
  '2': 'D5',
  '3': 'E5',
  '4': 'F5',
  '5': 'G5',
  '6': 'A5',
  '7': 'B5',
  '8': 'C6',
  '9': 'D6',
  '0': 'E6',
};

export interface SongRhythmNote {
  key: string;       // Mac key tag e.g. "Q"
  note: string;      // Exact musical pitch e.g. "G#4", "A4"
  duration: number;  // Duration in beats
  pauseAfter: number;// Rest after note in ms
}

export interface HindiSongInfo {
  name: string;
  movie: string;
  bpm: number;
  keys: string[];
  notes: string;
  rhythm: SongRhythmNote[];
}

/**
 * MASTER SONG LIBRARY (Bollywood & World Classics)
 */
export const HINDI_SONGS: HindiSongInfo[] = [
  {
    name: 'Tum Hi Ho',
    movie: 'Aashiqui 2',
    bpm: 85,
    keys: ['G#', 'A', 'G#', 'F#', 'E', 'F#', 'G#', ' ', 'G#', 'A', 'B', 'A', 'G#', 'F#', 'G#'],
    notes: 'Hum tere bin ab reh nahi sakte... Tere bina kya wajood mera...',
    rhythm: [
      { key: 'G#', note: 'G#4', duration: 1.0, pauseAfter: 550 },
      { key: 'A',  note: 'A4',  duration: 0.5, pauseAfter: 350 },
      { key: 'G#', note: 'G#4', duration: 1.2, pauseAfter: 600 },
      { key: 'F#', note: 'F#4', duration: 0.6, pauseAfter: 350 },
      { key: 'E',  note: 'E4',  duration: 0.8, pauseAfter: 450 },
      { key: 'F#', note: 'F#4', duration: 0.6, pauseAfter: 350 },
      { key: 'G#', note: 'G#4', duration: 1.5, pauseAfter: 900 },
      { key: ' ',  note: 'REST',duration: 0.0, pauseAfter: 700 },
      { key: 'G#', note: 'G#4', duration: 1.0, pauseAfter: 500 },
      { key: 'A',  note: 'A4',  duration: 0.5, pauseAfter: 350 },
      { key: 'B',  note: 'B4',  duration: 1.2, pauseAfter: 600 },
      { key: 'A',  note: 'A4',  duration: 0.5, pauseAfter: 350 },
      { key: 'G#', note: 'G#4', duration: 0.8, pauseAfter: 450 },
      { key: 'F#', note: 'F#4', duration: 0.6, pauseAfter: 350 },
      { key: 'G#', note: 'G#4', duration: 1.5, pauseAfter: 900 },
    ],
  },
  {
    name: 'Kal Ho Naa Ho',
    movie: 'Kal Ho Naa Ho',
    bpm: 92,
    keys: ['G', 'A', 'B', 'B', 'C', 'B', 'A', 'G', ' ', 'G', 'A', 'B', 'D', 'C', 'B'],
    notes: 'Har ghadi badal rahi hai roop zindagi... Chaav hai kabhi kabhi hai dhoop zindagi...',
    rhythm: [
      { key: 'G',  note: 'G4',  duration: 0.8, pauseAfter: 400 },
      { key: 'A',  note: 'A4',  duration: 0.8, pauseAfter: 400 },
      { key: 'B',  note: 'B4',  duration: 1.2, pauseAfter: 600 },
      { key: 'B',  note: 'B4',  duration: 0.6, pauseAfter: 350 },
      { key: 'C',  note: 'C5',  duration: 0.6, pauseAfter: 350 },
      { key: 'B',  note: 'B4',  duration: 0.8, pauseAfter: 400 },
      { key: 'A',  note: 'A4',  duration: 0.8, pauseAfter: 400 },
      { key: 'G',  note: 'G4',  duration: 1.5, pauseAfter: 900 },
      { key: ' ',  note: 'REST',duration: 0.0, pauseAfter: 700 },
      { key: 'G',  note: 'G4',  duration: 0.8, pauseAfter: 400 },
      { key: 'A',  note: 'A4',  duration: 0.8, pauseAfter: 400 },
      { key: 'B',  note: 'B4',  duration: 1.0, pauseAfter: 500 },
      { key: 'D',  note: 'D5',  duration: 1.2, pauseAfter: 600 },
      { key: 'C',  note: 'C5',  duration: 0.8, pauseAfter: 400 },
      { key: 'B',  note: 'B4',  duration: 1.5, pauseAfter: 900 },
    ],
  },
  {
    name: 'Kesariya',
    movie: 'Brahmastra',
    bpm: 96,
    keys: ['D', 'E', 'F#', 'G', 'F#', 'E', 'D', 'A', ' ', 'D', 'E', 'F#', 'A', 'G', 'F#', 'E'],
    notes: 'Kesariya tera ishq hai piya... Rang jaaun jo main haath lagaun...',
    rhythm: [
      { key: 'D',  note: 'D4',  duration: 1.0, pauseAfter: 500 },
      { key: 'E',  note: 'E4',  duration: 0.8, pauseAfter: 400 },
      { key: 'F#', note: 'F#4', duration: 1.2, pauseAfter: 600 },
      { key: 'G',  note: 'G4',  duration: 0.6, pauseAfter: 350 },
      { key: 'F#', note: 'F#4', duration: 0.8, pauseAfter: 400 },
      { key: 'E',  note: 'E4',  duration: 0.6, pauseAfter: 350 },
      { key: 'D',  note: 'D4',  duration: 0.8, pauseAfter: 400 },
      { key: 'A',  note: 'A4',  duration: 1.5, pauseAfter: 900 },
    ],
  },
  {
    name: 'Für Elise',
    movie: 'Ludwig van Beethoven',
    bpm: 130,
    keys: ['E', 'D#', 'E', 'D#', 'E', 'B', 'D', 'C', 'A', ' ', 'C', 'E', 'A', 'B'],
    notes: 'Classic Piano Masterpiece Für Elise by Beethoven',
    rhythm: [
      { key: 'E',  note: 'E5',  duration: 0.5, pauseAfter: 250 },
      { key: 'D#', note: 'D#5', duration: 0.5, pauseAfter: 250 },
      { key: 'E',  note: 'E5',  duration: 0.5, pauseAfter: 250 },
      { key: 'D#', note: 'D#5', duration: 0.5, pauseAfter: 250 },
      { key: 'E',  note: 'E5',  duration: 0.5, pauseAfter: 250 },
      { key: 'B',  note: 'B4',  duration: 0.5, pauseAfter: 250 },
      { key: 'D',  note: 'D5',  duration: 0.5, pauseAfter: 250 },
      { key: 'C',  note: 'C5',  duration: 0.5, pauseAfter: 250 },
      { key: 'A',  note: 'A4',  duration: 1.2, pauseAfter: 600 },
      { key: ' ',  note: 'REST',duration: 0.0, pauseAfter: 400 },
      { key: 'C',  note: 'C4',  duration: 0.5, pauseAfter: 250 },
      { key: 'E',  note: 'E4',  duration: 0.5, pauseAfter: 250 },
      { key: 'A',  note: 'A4',  duration: 0.5, pauseAfter: 250 },
      { key: 'B',  note: 'B4',  duration: 1.2, pauseAfter: 600 },
    ],
  },
  {
    name: 'Interstellar Theme',
    movie: 'Hans Zimmer',
    bpm: 110,
    keys: ['E', 'A', 'E', 'A', 'F', 'A', 'F', 'A', 'D', 'A', 'D', 'A'],
    notes: 'Hans Zimmer Interstellar Main Theme - First Step',
    rhythm: [
      { key: 'E', note: 'E5', duration: 1.0, pauseAfter: 450 },
      { key: 'A', note: 'A4', duration: 1.0, pauseAfter: 450 },
      { key: 'E', note: 'E5', duration: 1.0, pauseAfter: 450 },
      { key: 'A', note: 'A4', duration: 1.0, pauseAfter: 450 },
      { key: 'F', note: 'F5', duration: 1.0, pauseAfter: 450 },
      { key: 'A', note: 'A4', duration: 1.0, pauseAfter: 450 },
      { key: 'F', note: 'F5', duration: 1.0, pauseAfter: 450 },
      { key: 'A', note: 'A4', duration: 1.0, pauseAfter: 450 },
      { key: 'D', note: 'D5', duration: 1.0, pauseAfter: 450 },
      { key: 'A', note: 'A4', duration: 1.0, pauseAfter: 450 },
    ],
  },
  {
    name: 'Pirates of the Caribbean',
    movie: 'Hans Zimmer',
    bpm: 140,
    keys: ['A', 'C', 'D', 'D', 'D', 'E', 'F', 'F', 'F', 'G', 'E', 'E', 'D', 'C', 'D'],
    notes: "He's a Pirate - Pirates of the Caribbean Theme",
    rhythm: [
      { key: 'A', note: 'A4', duration: 0.4, pauseAfter: 200 },
      { key: 'C', note: 'C5', duration: 0.4, pauseAfter: 200 },
      { key: 'D', note: 'D5', duration: 0.8, pauseAfter: 350 },
      { key: 'D', note: 'D5', duration: 0.4, pauseAfter: 200 },
      { key: 'D', note: 'D5', duration: 0.4, pauseAfter: 200 },
      { key: 'E', note: 'E5', duration: 0.4, pauseAfter: 200 },
      { key: 'F', note: 'F5', duration: 0.8, pauseAfter: 350 },
      { key: 'F', note: 'F5', duration: 0.4, pauseAfter: 200 },
      { key: 'F', note: 'F5', duration: 0.4, pauseAfter: 200 },
      { key: 'G', note: 'G5', duration: 0.4, pauseAfter: 200 },
      { key: 'E', note: 'E5', duration: 0.8, pauseAfter: 350 },
      { key: 'E', note: 'E5', duration: 0.4, pauseAfter: 200 },
      { key: 'D', note: 'D5', duration: 0.4, pauseAfter: 200 },
      { key: 'C', note: 'C5', duration: 0.4, pauseAfter: 200 },
      { key: 'D', note: 'D5', duration: 1.2, pauseAfter: 600 },
    ],
  },
  {
    name: 'Lag Jaa Gale',
    movie: 'Woh Kaun Thi',
    bpm: 78,
    keys: ['C', 'E', 'G', 'A', 'G', 'E', 'F', 'E', ' ', 'C', 'D', 'E', 'F', 'E', 'D', 'C'],
    notes: 'Lag jaa gale ke phir yeh haseen raat ho na ho...',
    rhythm: [
      { key: 'C',  note: 'C4',  duration: 1.2, pauseAfter: 600 },
      { key: 'E',  note: 'E4',  duration: 1.0, pauseAfter: 500 },
      { key: 'G',  note: 'G4',  duration: 1.5, pauseAfter: 800 },
      { key: 'A',  note: 'A4',  duration: 0.8, pauseAfter: 400 },
      { key: 'G',  note: 'G4',  duration: 1.0, pauseAfter: 500 },
      { key: 'E',  note: 'E4',  duration: 0.8, pauseAfter: 400 },
      { key: 'F',  note: 'F4',  duration: 0.8, pauseAfter: 400 },
      { key: 'E',  note: 'E4',  duration: 1.8, pauseAfter: 1000 },
    ],
  },
];

export const BEGINNER_SONGS = HINDI_SONGS;

export function generate88Keys(): PianoKeyInfo[] {
  const keys: PianoKeyInfo[] = [];
  
  const noteToShortcut: Record<string, string> = {};
  Object.entries(KEYBOARD_SHORTCUTS).forEach(([key, note]) => {
    noteToShortcut[note] = key.toUpperCase();
  });

  for (let i = 1; i <= 88; i++) {
    const semitoneOffsetFromA0 = i - 1;
    const frequency = 440 * Math.pow(2, (i - 49) / 12);
    const noteIndexFromC0 = semitoneOffsetFromA0 + 9;
    const octave = Math.floor(noteIndexFromC0 / 12);
    const pitchIndex = noteIndexFromC0 % 12;
    const pitchClass = NOTE_NAMES[pitchIndex];
    const noteName = `${pitchClass}${octave}`;
    const isBlack = pitchClass.includes('#');

    keys.push({
      keyNumber: i,
      noteName,
      pitchClass,
      octave,
      isBlack,
      shortcutKey: noteToShortcut[noteName],
      frequency,
    });
  }

  return keys;
}

export const SCALES: Record<string, ScaleDefinition> = {
  'Major (Ionian)': { name: 'Major (Ionian)', intervals: [0, 2, 4, 5, 7, 9, 11], description: 'Bright, cheerful, happy' },
  'Natural Minor (Aeolian)': { name: 'Natural Minor (Aeolian)', intervals: [0, 2, 3, 5, 7, 8, 10], description: 'Sad, emotional, serious' },
  'Harmonic Minor': { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11], description: 'Neoclassical, dramatic, exotic' },
  'Dorian': { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], description: 'Jazzy, soulful, minor with a bright 6th' },
  'Phrygian': { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], description: 'Spanish, tension, dark' },
  'Lydian': { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11], description: 'Dreamy, ethereal, sci-fi' },
  'Mixolydian': { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], description: 'Bluesy, rock, major with flat 7th' },
  'Pentatonic Major': { name: 'Pentatonic Major', intervals: [0, 2, 4, 7, 9], description: 'Versatile, folk, pop solos' },
  'Pentatonic Minor': { name: 'Pentatonic Minor', intervals: [0, 3, 5, 7, 10], description: 'Blues, rock riffing' },
};

export const CHORDS: Record<string, ChordDefinition> = {
  'Major Triad': { name: 'Major Triad', symbol: 'Maj', intervals: [0, 4, 7], type: 'Triad' },
  'Minor Triad': { name: 'Minor Triad', symbol: 'min', intervals: [0, 3, 7], type: 'Triad' },
  'Dominant 7th': { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10], type: '7th' },
  'Major 7th': { name: 'Major 7th', symbol: 'Maj7', intervals: [0, 4, 7, 11], type: '7th' },
  'Minor 7th': { name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10], type: '7th' },
  'Diminished': { name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6], type: 'Triad' },
  'Augmented': { name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8], type: 'Triad' },
  'Suspended 4th': { name: 'Suspended 4th', symbol: 'sus4', intervals: [0, 5, 7], type: 'Sus' },
  'Suspended 2nd': { name: 'Suspended 2nd', symbol: 'sus2', intervals: [0, 2, 7], type: 'Sus' },
};

export function getScaleNotes(rootNote: string, scaleName: string): string[] {
  const rootIndex = NOTE_NAMES.indexOf(rootNote);
  if (rootIndex === -1) return [];
  const scale = SCALES[scaleName];
  if (!scale) return [];

  return scale.intervals.map((semitones) => NOTE_NAMES[(rootIndex + semitones) % 12]);
}

export function getChordNotes(rootNoteWithOctave: string, chordName: string): string[] {
  const match = rootNoteWithOctave.match(/^([A-G]#?)(\d+)$/);
  if (!match) return [rootNoteWithOctave];
  const rootPitch = match[1];
  const rootOctave = parseInt(match[2], 10);
  const rootIndex = NOTE_NAMES.indexOf(rootPitch);
  const chord = CHORDS[chordName];
  if (!chord) return [rootNoteWithOctave];

  return chord.intervals.map((semitones) => {
    const totalSemis = rootIndex + semitones;
    const noteOctave = rootOctave + Math.floor(totalSemis / 12);
    const pitchClass = NOTE_NAMES[totalSemis % 12];
    return `${pitchClass}${noteOctave}`;
  });
}
