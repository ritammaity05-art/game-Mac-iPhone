import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { NOTE_NAMES, SCALES, CHORDS, getChordNotes } from '../../utils/musicTheory';
import { instrumentManager } from '../../audio/instruments';
import { Sliders, Sparkles, Plus, Play, Music } from 'lucide-react';

export const ChordTools: React.FC = () => {
  const {
    selectedRoot,
    setSelectedRoot,
    selectedScale,
    setSelectedScale,
    selectedChord,
    setSelectedChord,
    addPianoRollNote,
    setViewTab,
  } = useStudioStore();

  const handleAuditionChord = (chordName: string) => {
    const rootWithOct = `${selectedRoot}4`;
    const notes = getChordNotes(rootWithOct, chordName);
    
    notes.forEach((n) => {
      instrumentManager.triggerAttack(n, 0.85);
    });
    setTimeout(() => {
      notes.forEach((n) => instrumentManager.triggerRelease(n));
    }, 600);
  };

  const handleInsertProgressionToPianoRoll = (progression: string[]) => {
    progression.forEach((root, idx) => {
      const notes = getChordNotes(`${root}4`, 'Major Triad');
      const startTime = idx * 4;
      notes.forEach((n) => {
        addPianoRollNote({
          id: `chord_gen_${idx}_${n}_${Date.now()}`,
          pitch: n,
          time: startTime,
          duration: 3.8,
          velocity: 85,
        });
      });
    });
    setViewTab('pianoroll');
  };

  const circleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

  return (
    <div className="flex flex-col h-full bg-[#080a0f] text-slate-100 select-none p-4 overflow-y-auto scrollbar-thin">
      <div className="bg-studio-surface/90 border border-studio-border rounded-xl p-4 mb-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-synth-purple to-indigo-600 rounded-lg shadow-md">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">SCALE & CHORD ASSISTANT</h2>
            <p className="text-xs text-slate-400">Interactive Circle of Fifths, Scale overlays & Chord Builders</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-4 shadow-md">
          <h3 className="font-bold text-sm text-synth-cyan flex items-center gap-2">
            <Music className="w-4 h-4" /> Root Key & Scale Highlight
          </h3>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Select Root Key:</label>
            <div className="grid grid-cols-6 gap-1.5">
              {NOTE_NAMES.map((note) => (
                <button
                  key={note}
                  onClick={() => setSelectedRoot(note)}
                  className={`py-1.5 rounded text-xs font-mono font-bold transition ${
                    selectedRoot === note
                      ? 'bg-synth-purple text-white shadow-md shadow-purple-900/50 scale-105'
                      : 'bg-studio-surfaceLight text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Select Scale Mode:</label>
            <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {Object.keys(SCALES).map((scaleKey) => (
                <button
                  key={scaleKey}
                  onClick={() => setSelectedScale(scaleKey)}
                  className={`p-2 rounded-lg text-xs font-medium text-left flex justify-between items-center transition ${
                    selectedScale === scaleKey
                      ? 'bg-gradient-to-r from-synth-purple to-indigo-600 text-white font-bold shadow'
                      : 'bg-studio-surfaceLight text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{scaleKey}</span>
                  <span className="text-[10px] opacity-75 font-mono">{SCALES[scaleKey].description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col items-center justify-center shadow-md">
          <h3 className="font-bold text-sm text-synth-purple flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" /> Circle of Fifths
          </h3>

          <div className="relative w-56 h-56 flex items-center justify-center">
            {circleOfFifths.map((key, idx) => {
              const angle = (idx * 30 - 90) * (Math.PI / 180);
              const radius = 90;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = selectedRoot === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedRoot(key)}
                  className={`absolute w-10 h-10 rounded-full font-mono font-bold text-xs flex items-center justify-center transition-all duration-200 shadow ${
                    isSelected
                      ? 'bg-synth-cyan text-slate-950 scale-125 shadow-cyan-500/50 ring-4 ring-cyan-300/30'
                      : 'bg-studio-surfaceLight text-slate-200 hover:bg-synth-purple hover:text-white'
                  }`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {key}
                </button>
              );
            })}
            <div className="w-20 h-20 rounded-full bg-studio-bg border border-studio-border flex flex-col items-center justify-center text-center p-1">
              <span className="text-[10px] text-slate-400 font-mono">CURRENT</span>
              <span className="text-base font-extrabold text-synth-cyan font-mono">{selectedRoot}</span>
            </div>
          </div>
        </div>

        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-4 shadow-md">
          <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
            <Play className="w-4 h-4" /> Instant Chord Audition
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {Object.keys(CHORDS).map((chordKey) => (
              <button
                key={chordKey}
                onClick={() => handleAuditionChord(chordKey)}
                className="p-2.5 bg-studio-surfaceLight hover:bg-emerald-950/60 hover:border-emerald-500/50 border border-studio-border rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-between transition group"
              >
                <span>{selectedRoot} {CHORDS[chordKey].symbol}</span>
                <Play className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>

          <div className="border-t border-studio-border pt-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Preset Progressions</h4>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Pop Anthem (I-V-vi-IV)', prog: [selectedRoot, 'G', 'A', 'F'] },
                { name: 'Jazz Cadence (ii-V-I)', prog: ['D', 'G', selectedRoot] },
                { name: 'Emotional Minor (i-VI-III-VII)', prog: ['A', 'F', 'C', 'G'] },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleInsertProgressionToPianoRoll(item.prog)}
                  className="flex items-center justify-between p-2 bg-studio-surfaceLight hover:bg-studio-border border border-studio-border rounded-lg text-xs text-slate-200 transition"
                >
                  <span>{item.name}</span>
                  <Plus className="w-3.5 h-3.5 text-synth-cyan" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
