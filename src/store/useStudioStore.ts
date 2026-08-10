import { create } from 'zustand';
import { InstrumentId, ViewTab, PianoRollNote, DrumTrack, FxConfig } from '../types';
import { instrumentManager } from '../audio/instruments';
import { drumEngine } from '../audio/drumEngine';
import { effectsChain } from '../audio/effects';
import { audioEngine } from '../audio/engine';
import { HINDI_SONGS, SongRhythmNote, MAC_EASY_MAP } from '../utils/musicTheory';

interface StudioState {
  viewTab: ViewTab;
  instrumentId: InstrumentId;
  activeNotes: Set<string>;
  projectName: string;
  bpm: number;
  isPlaying: boolean;
  isRecording: boolean;
  metronome: boolean;
  masterVolume: number;
  octaveOffset: number;
  keyLabelMode: 'notes' | 'octave' | 'shortcuts' | 'off';

  // Pro Arpeggiator & Tutor Features
  arpeggiatorEnabled: boolean;
  tutorModeEnabled: boolean;

  // Active Song State for Auto-Play & Search
  activeSongTitle: string;
  activeSongKeys: string[];
  activeSongRhythm: SongRhythmNote[];

  // Scale & Chord State
  selectedRoot: string;
  selectedScale: string;
  selectedChord: string;

  // Piano Roll Notes & Drum Grid
  pianoRollNotes: PianoRollNote[];
  drumTracks: DrumTrack[];
  fxConfig: FxConfig;

  // Actions
  setViewTab: (tab: ViewTab) => void;
  setInstrument: (id: InstrumentId) => void;
  noteOn: (note: string, velocity?: number) => void;
  noteOff: (note: string) => void;
  setBpm: (bpm: number) => void;
  setMasterVolume: (vol: number) => void;
  togglePlay: () => void;
  toggleRecord: () => void;
  toggleMetronome: () => void;
  toggleArpeggiator: () => void;
  toggleTutorMode: () => void;
  setProjectName: (name: string) => void;
  setOctaveOffset: (offset: number) => void;
  setKeyLabelMode: (mode: 'notes' | 'octave' | 'shortcuts' | 'off') => void;

  // Active Song Actions
  loadActiveSong: (title: string, keys: string[], bpm?: number, rhythm?: SongRhythmNote[]) => void;
  
  // Scales & Chords Actions
  setSelectedRoot: (root: string) => void;
  setSelectedScale: (scale: string) => void;
  setSelectedChord: (chord: string) => void;

  // Piano Roll Note Actions
  addPianoRollNote: (note: PianoRollNote) => void;
  removePianoRollNote: (id: string) => void;
  clearPianoRollNotes: () => void;
  setPianoRollNotes: (notes: PianoRollNote[]) => void;

  // Drum Actions
  toggleDrumStep: (trackId: string, stepIndex: number) => void;
  triggerDrumSample: (sampleKey: string) => void;

  // FX Actions
  updateFxConfig: (config: Partial<FxConfig>) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  viewTab: 'piano',
  instrumentId: 'grand-piano',
  activeNotes: new Set<string>(),
  projectName: 'Piano Studio Project',
  bpm: HINDI_SONGS[0].bpm || 85,
  isPlaying: false,
  isRecording: false,
  metronome: false,
  masterVolume: 0.85,
  octaveOffset: 0,
  keyLabelMode: 'notes',

  arpeggiatorEnabled: false,
  tutorModeEnabled: true,

  activeSongTitle: HINDI_SONGS[0].name,
  activeSongKeys: HINDI_SONGS[0].keys,
  activeSongRhythm: HINDI_SONGS[0].rhythm || [],

  selectedRoot: 'C',
  selectedScale: 'Major (Ionian)',
  selectedChord: 'Major Triad',

  pianoRollNotes: [
    { id: 'n1', pitch: 'C4', time: 0, duration: 1, velocity: 90 },
    { id: 'n2', pitch: 'E4', time: 1, duration: 1, velocity: 85 },
    { id: 'n3', pitch: 'G4', time: 2, duration: 1, velocity: 95 },
    { id: 'n4', pitch: 'B4', time: 3, duration: 1, velocity: 88 },
  ],

  drumTracks: drumEngine.getInitialTracks(),

  fxConfig: {
    masterGain: 0.85,
    reverbDecay: 2.2,
    reverbWet: 0.2,
    delayTime: '8n',
    delayFeedback: 0.2,
    delayWet: 0.1,
    chorusFreq: 1.2,
    chorusWet: 0.08,
    distortionDrive: 0.0,
    distortionWet: 0.0,
    filterCutoff: 18000,
    filterResonance: 1,
    filterType: 'lowpass',
    eqLow: 1,
    eqMid: 0,
    eqHigh: 1,
    compressorThreshold: -20,
    compressorRatio: 4,
  },

  setViewTab: (tab) => set({ viewTab: tab }),

  setInstrument: (id) => {
    instrumentManager.setInstrument(id);
    set({ instrumentId: id });
  },

  noteOn: (note, velocity = 0.8) => {
    audioEngine.startAudioContext();

    const { arpeggiatorEnabled } = get();

    if (arpeggiatorEnabled) {
      // Arpeggiator pattern: root -> +4 semitones -> +7 semitones -> +12 semitones
      const match = note.match(/^([A-G]#?)(\d+)$/);
      if (match) {
        const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = pitches.indexOf(match[1]);
        const oct = parseInt(match[2], 10);
        const offsets = [0, 4, 7, 12];

        offsets.forEach((semi, idx) => {
          setTimeout(() => {
            const arpIdx = (rootIndex + semi) % 12;
            const arpOct = oct + Math.floor((rootIndex + semi) / 12);
            const arpNote = `${pitches[arpIdx]}${arpOct}`;
            instrumentManager.triggerAttack(arpNote, velocity);
            set((state) => {
              const next = new Set(state.activeNotes);
              next.add(arpNote);
              return { activeNotes: next };
            });
            setTimeout(() => {
              instrumentManager.triggerRelease(arpNote);
              set((state) => {
                const next = new Set(state.activeNotes);
                next.delete(arpNote);
                return { activeNotes: next };
              });
            }, 180);
          }, idx * 120);
        });
        return;
      }
    }

    instrumentManager.triggerAttack(note, velocity);
    set((state) => {
      const next = new Set(state.activeNotes);
      next.add(note);
      return { activeNotes: next };
    });
  },

  noteOff: (note) => {
    instrumentManager.triggerRelease(note);
    set((state) => {
      const next = new Set(state.activeNotes);
      next.delete(note);
      return { activeNotes: next };
    });
  },

  setBpm: (bpm) => {
    audioEngine.setBpm(bpm);
    set({ bpm });
  },

  setMasterVolume: (vol) => {
    audioEngine.setMasterVolume(vol);
    set({ masterVolume: vol });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleRecord: () => set((state) => ({ isRecording: !state.isRecording })),
  toggleMetronome: () => set((state) => ({ metronome: !state.metronome })),
  toggleArpeggiator: () => set((state) => ({ arpeggiatorEnabled: !state.arpeggiatorEnabled })),
  toggleTutorMode: () => set((state) => ({ tutorModeEnabled: !state.tutorModeEnabled })),
  setProjectName: (name) => set({ projectName: name }),
  setOctaveOffset: (offset) => set({ octaveOffset: Math.max(-3, Math.min(3, offset)) }),
  setKeyLabelMode: (mode) => set({ keyLabelMode: mode }),

  loadActiveSong: (title, keys, bpmVal = 90, rhythm) => {
    const rollNotes: PianoRollNote[] = [];
    let beatTime = 0;

    keys.forEach((macKey, idx) => {
      if (macKey === ' ') {
        beatTime += 0.5;
        return;
      }
      const rawLower = macKey.toLowerCase();
      const targetNote = MAC_EASY_MAP[rawLower] || 'C4';

      rollNotes.push({
        id: `song_note_${idx}_${Date.now()}`,
        pitch: targetNote,
        time: beatTime,
        duration: 0.4,
        velocity: 90,
      });

      beatTime += 0.5;
    });

    audioEngine.setBpm(bpmVal);

    set({
      activeSongTitle: title,
      activeSongKeys: keys,
      activeSongRhythm: rhythm || [],
      bpm: bpmVal,
      pianoRollNotes: rollNotes,
    });
  },

  setSelectedRoot: (root) => set({ selectedRoot: root }),
  setSelectedScale: (scale) => set({ selectedScale: scale }),
  setSelectedChord: (chord) => set({ selectedChord: chord }),

  addPianoRollNote: (note) => set((state) => ({ pianoRollNotes: [...state.pianoRollNotes, note] })),
  removePianoRollNote: (id) => set((state) => ({ pianoRollNotes: state.pianoRollNotes.filter((n) => n.id !== id) })),
  clearPianoRollNotes: () => set({ pianoRollNotes: [] }),
  setPianoRollNotes: (notes) => set({ pianoRollNotes: notes }),

  toggleDrumStep: (trackId, stepIndex) =>
    set((state) => ({
      drumTracks: state.drumTracks.map((tr) => {
        if (tr.id !== trackId) return tr;
        const newSteps = [...tr.steps];
        newSteps[stepIndex] = !newSteps[stepIndex];
        return { ...tr, steps: newSteps };
      }),
    })),

  triggerDrumSample: (sampleKey) => {
    audioEngine.startAudioContext();
    drumEngine.triggerDrum(sampleKey);
  },

  updateFxConfig: (newFx) => {
    effectsChain.updateConfig(newFx);
    set((state) => ({ fxConfig: { ...state.fxConfig, ...newFx } }));
  },
}));
