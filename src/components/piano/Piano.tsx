import React, { useMemo, useEffect, useRef, useState } from 'react';
import { generate88Keys, KEYBOARD_SHORTCUTS, MAC_EASY_MAP, BEGINNER_SONGS, getScaleNotes } from '../../utils/musicTheory';
import { useStudioStore } from '../../store/useStudioStore';
import { InstrumentId } from '../../types';
import { midiManager } from '../../midi/midiManager';
import { audioEngine } from '../../audio/engine';
import { Sparkles, Play, Pause, BookOpen, Volume2, Zap, GraduationCap } from 'lucide-react';

export const Piano: React.FC = () => {
  const {
    activeNotes,
    noteOn,
    noteOff,
    instrumentId,
    setInstrument,
    octaveOffset,
    setOctaveOffset,
    selectedRoot,
    selectedScale,
    activeSongTitle,
    activeSongKeys,
    activeSongRhythm,
    loadActiveSong,
    arpeggiatorEnabled,
    toggleArpeggiator,
    tutorModeEnabled,
    toggleTutorMode,
  } = useStudioStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [sustainActive, setSustainActive] = useState(false);
  const [easyMacMode, setEasyMacMode] = useState<boolean>(true);

  // Auto-Play & Speed State
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [autoPlayNoteIndex, setAutoPlayNoteIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [leftHandChordsEnabled, setLeftHandChordsEnabled] = useState<boolean>(true);
  const autoPlayTimerRef = useRef<any>(null);

  const all88Keys = useMemo(() => generate88Keys(), []);

  const keyToMacLabel = useMemo(() => {
    const map: Record<string, string> = {};
    if (easyMacMode) {
      Object.entries(MAC_EASY_MAP).forEach(([key, note]) => {
        map[note] = key.toUpperCase();
      });
    } else {
      Object.entries(KEYBOARD_SHORTCUTS).forEach(([key, note]) => {
        map[note] = key.toUpperCase();
      });
    }
    return map;
  }, [easyMacMode]);

  const highlightedScaleNotes = useMemo(() => {
    return new Set(getScaleNotes(selectedRoot, selectedScale));
  }, [selectedRoot, selectedScale]);

  const instrumentsList: { id: InstrumentId; label: string; icon: string }[] = [
    { id: 'grand-piano', label: 'Grand Piano', icon: '🎹' },
    { id: 'electric-piano', label: 'Electric Piano', icon: '⚡' },
    { id: 'organ', label: 'Organ', icon: '⛪' },
    { id: 'synth', label: 'Synth Lead', icon: '🎛️' },
    { id: 'strings', label: 'Strings', icon: '🎻' },
    { id: 'guitar', label: 'Guitar', icon: '🎸' },
    { id: 'bass', label: 'Analog Bass', icon: '🔊' },
    { id: 'violin', label: 'Violin Solo', icon: '🎻' },
    { id: 'flute', label: 'Air Flute', icon: '🪈' },
    { id: 'bell', label: 'Chime Bell', icon: '🔔' },
    { id: 'choir', label: 'Vocal Choir', icon: '🎤' },
    { id: 'pads', label: 'Ambient Pad', icon: '🌌' },
  ];

  const leftHandChords = [
    ['C3', 'E3', 'G3'],
    ['A2', 'C3', 'E3'],
    ['F2', 'A2', 'C3'],
    ['G2', 'B2', 'D3'],
  ];

  // Auto Play Engine
  const startAutoPlay = async () => {
    await audioEngine.startAudioContext();
    if (isAutoPlaying) {
      stopAutoPlay();
      return;
    }

    setIsAutoPlaying(true);
    setAutoPlayNoteIndex(0);

    const keysToPlay = activeSongKeys && activeSongKeys.length > 0 ? activeSongKeys : BEGINNER_SONGS[0].keys;
    const rhythmToPlay = activeSongRhythm && activeSongRhythm.length > 0 ? activeSongRhythm : null;

    let idx = 0;
    let chordIndex = 0;

    const playNextStep = () => {
      if (idx >= keysToPlay.length) {
        stopAutoPlay();
        return;
      }

      setAutoPlayNoteIndex(idx);

      if (leftHandChordsEnabled && idx % 4 === 0) {
        const chordNotes = leftHandChords[chordIndex % leftHandChords.length];
        chordIndex++;
        chordNotes.forEach((cn) => {
          noteOn(cn, 0.55);
          setTimeout(() => noteOff(cn), 1400);
        });
      }

      if (rhythmToPlay && rhythmToPlay[idx]) {
        const step = rhythmToPlay[idx];
        if (step.key !== ' ' && step.note !== 'REST') {
          const rawNote = step.note.length > 2 ? step.note : MAC_EASY_MAP[step.key.toLowerCase()] || 'C4';
          noteOn(rawNote, 0.95);
          const holdTimeMs = Math.round((step.duration * 750) / playbackSpeed);
          setTimeout(() => noteOff(rawNote), holdTimeMs);
        }
        idx++;
        const nextDelayMs = Math.round((step.pauseAfter || 450) / playbackSpeed);
        autoPlayTimerRef.current = setTimeout(playNextStep, nextDelayMs);
      } else {
        const macKey = keysToPlay[idx];
        if (macKey !== ' ') {
          const rawLower = macKey.toLowerCase();
          const targetNote = MAC_EASY_MAP[rawLower] || 'C4';
          noteOn(targetNote, 0.95);
          setTimeout(() => noteOff(targetNote), Math.round(450 / playbackSpeed));
        }
        idx++;
        autoPlayTimerRef.current = setTimeout(playNextStep, Math.round(500 / playbackSpeed));
      }
    };

    playNextStep();
  };

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    setIsAutoPlaying(false);
    setAutoPlayNoteIndex(0);
  };

  useEffect(() => {
    return () => stopAutoPlay();
  }, [activeSongTitle]);

  // Mac Keyboard Listener
  useEffect(() => {
    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setSustainActive(true);
        midiManager.sustainPedalDown = true;
        return;
      }

      const rawKey = e.key.toLowerCase();
      if (pressedKeys.has(rawKey)) return;

      let targetNote = easyMacMode ? MAC_EASY_MAP[rawKey] : KEYBOARD_SHORTCUTS[rawKey];

      if (targetNote) {
        pressedKeys.add(rawKey);
        const match = targetNote.match(/^([A-G]#?)(\d+)$/);
        if (match) {
          const pitch = match[1];
          const oct = Math.max(0, Math.min(8, parseInt(match[2], 10) + octaveOffset));
          const adjustedNote = `${pitch}${oct}`;
          noteOn(adjustedNote, 0.85);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSustainActive(false);
        midiManager.sustainPedalDown = false;
        return;
      }

      const rawKey = e.key.toLowerCase();
      pressedKeys.delete(rawKey);

      let targetNote = easyMacMode ? MAC_EASY_MAP[rawKey] : KEYBOARD_SHORTCUTS[rawKey];

      if (targetNote) {
        const match = targetNote.match(/^([A-G]#?)(\d+)$/);
        if (match) {
          const pitch = match[1];
          const oct = Math.max(0, Math.min(8, parseInt(match[2], 10) + octaveOffset));
          const adjustedNote = `${pitch}${oct}`;
          noteOff(adjustedNote);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [noteOn, noteOff, octaveOffset, easyMacMode]);

  useEffect(() => {
    if (containerRef.current) {
      const c4Element = containerRef.current.querySelector('[data-note="C4"]');
      if (c4Element) {
        c4Element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#080a0f] text-slate-100 select-none overflow-hidden">
      {/* Beginner Mac Song Learning & REALISTIC ACOUSTIC CONCERT AUTO PLAYER */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-studio-border p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-synth-purple text-white rounded-lg shadow-md flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase text-synth-cyan tracking-wider">
                ACOUSTIC PIANO AUTO-PERFORMER: {activeSongTitle}
              </span>
              {isAutoPlaying && (
                <span className="text-[10px] bg-rose-600 text-white font-mono px-2 py-0.5 rounded font-bold border border-white/30 animate-pulse flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> FULL PIANO PERFORMANCE (WITH BACKING CHORDS)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Playing <span className="text-amber-400 font-bold">{activeSongTitle}</span> like a real pianist with both hands & acoustic reverb
            </p>
          </div>
        </div>

        {/* Pro Arpeggiator & Tutor Mode Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleArpeggiator}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 border ${
              arpeggiatorEnabled
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/40 animate-pulse'
                : 'bg-studio-surfaceLight text-slate-400 hover:text-slate-200 border-studio-border'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{arpeggiatorEnabled ? 'ARPEGGIATOR (ON)' : 'ARPEGGIATOR'}</span>
          </button>

          <button
            onClick={toggleTutorMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 border ${
              tutorModeEnabled
                ? 'bg-gradient-to-r from-synth-cyan to-teal-400 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/40'
                : 'bg-studio-surfaceLight text-slate-400 hover:text-slate-200 border-studio-border'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{tutorModeEnabled ? 'TUTOR (ON)' : 'TUTOR'}</span>
          </button>

          {/* Left Hand Chord Backing Toggle */}
          <button
            onClick={() => setLeftHandChordsEnabled(!leftHandChordsEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              leftHandChordsEnabled
                ? 'bg-synth-purple text-white border-synth-purple shadow'
                : 'bg-studio-surfaceLight text-slate-400 border-studio-border'
            }`}
          >
            {leftHandChordsEnabled ? '🎹 LEFT-HAND CHORDS' : 'MELODY ONLY'}
          </button>

          {/* AUTO PLAY BUTTON */}
          <button
            onClick={startAutoPlay}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-lg ${
              isAutoPlaying
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/50 animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 shadow-emerald-900/40'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            <span>{isAutoPlaying ? 'STOP PLAYING' : 'AUTO PLAY FULL SONG'}</span>
          </button>
        </div>

        {/* Preset Songs Picker */}
        <div className="flex items-center gap-2 bg-studio-surface/90 border border-studio-border p-1.5 rounded-xl">
          <span className="text-xs font-mono text-slate-400 pl-1 uppercase font-bold">Presets:</span>
          {BEGINNER_SONGS.map((song) => (
            <button
              key={song.name}
              onClick={() => {
                stopAutoPlay();
                loadActiveSong(song.name, song.keys, song.bpm, song.rhythm);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                activeSongTitle === song.name
                  ? 'bg-synth-purple text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {song.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main 88-Key Piano Keyboard Canvas */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
        className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative flex justify-start items-end scrollbar-thin bg-gradient-to-b from-[#090b12] to-[#121624]"
      >
        <div className="relative flex items-end h-[340px] min-w-max mx-auto shadow-2xl rounded-b-xl border-t-8 border-rose-950 bg-studio-surface">
          {all88Keys.map((key) => {
            const isActive = activeNotes.has(key.noteName);
            const isHighlightedInScale = highlightedScaleNotes.has(key.pitchClass);
            const macShortcut = keyToMacLabel[key.noteName];

            if (key.isBlack) {
              return (
                <div
                  key={key.keyNumber}
                  data-note={key.noteName}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    noteOn(key.noteName, 0.9);
                  }}
                  onMouseUp={() => noteOff(key.noteName)}
                  onMouseEnter={() => {
                    if (isMouseDown) noteOn(key.noteName, 0.9);
                  }}
                  onMouseLeave={() => noteOff(key.noteName)}
                  className={`absolute z-20 w-8 h-[210px] -ml-4 rounded-b-md cursor-pointer transition-all duration-75 flex flex-col justify-end items-center pb-3 ${
                    isActive
                      ? 'bg-gradient-to-b from-purple-600 to-synth-cyan shadow-[0_0_25px_rgba(6,182,212,1)] translate-y-1.5 scale-95'
                      : isHighlightedInScale
                      ? 'bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-b-2 border-synth-purple shadow-md'
                      : 'bg-gradient-to-b from-slate-900 via-slate-950 to-black hover:bg-slate-800 border-b border-slate-700'
                  }`}
                  style={{
                    left: `${(key.keyNumber - getWhiteKeyIndexOffset(key.keyNumber)) * 44}px`,
                  }}
                >
                  {isActive && tutorModeEnabled && (
                    <span className="absolute -top-6 text-amber-300 font-bold text-sm animate-bounce">
                      ♩
                    </span>
                  )}
                  {macShortcut && (
                    <span className="text-[9px] font-extrabold uppercase px-1 py-0.5 bg-slate-800 text-amber-300 rounded font-mono border border-slate-600 shadow">
                      {macShortcut}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <div
                key={key.keyNumber}
                data-note={key.noteName}
                onMouseDown={(e) => {
                  e.preventDefault();
                  noteOn(key.noteName, 0.85);
                }}
                onMouseUp={() => noteOff(key.noteName)}
                onMouseEnter={() => {
                  if (isMouseDown) noteOn(key.noteName, 0.85);
                }}
                onMouseLeave={() => noteOff(key.noteName)}
                className={`z-10 w-11 h-[320px] rounded-b-lg border-r border-l border-slate-300/20 cursor-pointer transition-all duration-75 flex flex-col justify-end items-center pb-4 select-none relative ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-200 to-synth-purple shadow-[0_0_30px_rgba(139,92,246,1)] translate-y-2 scale-[0.98]'
                    : isHighlightedInScale
                    ? 'bg-gradient-to-b from-slate-100 via-purple-100 to-indigo-200 text-slate-950'
                    : 'bg-gradient-to-b from-slate-100 via-white to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-900'
                }`}
              >
                {isActive && tutorModeEnabled && (
                  <span className="absolute top-2 text-purple-600 font-bold text-base animate-bounce">
                    ♫
                  </span>
                )}

                {macShortcut && (
                  <span className="text-[12px] font-extrabold uppercase px-2 py-1 bg-amber-400 text-slate-950 rounded-lg font-mono shadow-md mb-2 border border-amber-500 scale-110">
                    [{macShortcut}]
                  </span>
                )}

                {key.noteName === 'C4' && (
                  <span className="text-[9px] font-extrabold uppercase px-1 py-0.5 bg-synth-purple text-white rounded mb-1 shadow">
                    Middle C
                  </span>
                )}
                <span className="text-[10px] font-mono font-bold tracking-tight text-slate-600 pointer-events-none">
                  {key.noteName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getWhiteKeyIndexOffset(keyNum: number): number {
  let blackCount = 0;
  for (let i = 1; i < keyNum; i++) {
    const offsetFromA0 = i - 1;
    const noteIndexFromC0 = offsetFromA0 + 9;
    const pitchIndex = noteIndexFromC0 % 12;
    const pitchClass = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][pitchIndex];
    if (pitchClass.includes('#')) {
      blackCount++;
    }
  }
  return blackCount;
}
