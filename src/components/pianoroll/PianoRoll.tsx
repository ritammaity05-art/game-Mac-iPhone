import React, { useState, useMemo } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { PianoRollNote } from '../../types';
import { NOTE_NAMES } from '../../utils/musicTheory';
import { Trash2, Scissors, Zap } from 'lucide-react';
import { instrumentManager } from '../../audio/instruments';

export const PianoRoll: React.FC = () => {
  const {
    pianoRollNotes,
    addPianoRollNote,
    removePianoRollNote,
    clearPianoRollNotes,
    setPianoRollNotes,
  } = useStudioStore();

  const [snapGrid, setSnapGrid] = useState<number>(0.25);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const pitches = useMemo(() => {
    const list: string[] = [];
    for (let oct = 6; oct >= 2; oct--) {
      for (let i = 11; i >= 0; i--) {
        list.push(`${NOTE_NAMES[i]}${oct}`);
      }
    }
    return list;
  }, []);

  const totalBeats = 16;
  const cellWidth = 32;
  const cellHeight = 22;

  const handleGridClick = (pitch: string, beatTime: number) => {
    const snappedTime = Math.floor(beatTime / snapGrid) * snapGrid;
    const existing = pianoRollNotes.find(
      (n) => n.pitch === pitch && Math.abs(n.time - snappedTime) < 0.1
    );

    if (existing) {
      removePianoRollNote(existing.id);
    } else {
      instrumentManager.triggerAttack(pitch, 0.8);
      setTimeout(() => instrumentManager.triggerRelease(pitch), 200);

      const newNote: PianoRollNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        pitch,
        time: snappedTime,
        duration: snapGrid,
        velocity: 90,
      };
      addPianoRollNote(newNote);
    }
  };

  const handleQuantize = () => {
    const quantized = pianoRollNotes.map((n) => ({
      ...n,
      time: Math.round(n.time / snapGrid) * snapGrid,
      duration: Math.max(snapGrid, Math.round(n.duration / snapGrid) * snapGrid),
    }));
    setPianoRollNotes(quantized);
  };

  return (
    <div className="flex flex-col h-full bg-[#080a0f] text-slate-100 select-none overflow-hidden">
      {/* Piano Roll Toolbar */}
      <div className="bg-studio-surface/80 border-b border-studio-border p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-synth-cyan tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4" /> PIANO ROLL SEQUENCER
          </span>

          <div className="flex items-center gap-1 bg-studio-surfaceLight border border-studio-border rounded-lg p-1 text-xs">
            <span className="text-slate-400 font-mono px-1">SNAP:</span>
            {[
              { label: '1/4', val: 1.0 },
              { label: '1/8', val: 0.5 },
              { label: '1/16', val: 0.25 },
              { label: '1/32', val: 0.125 },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setSnapGrid(item.val)}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  snapGrid === item.val
                    ? 'bg-synth-purple text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuantize}
            className="flex items-center gap-1 bg-studio-surfaceLight hover:bg-studio-border text-slate-200 border border-studio-border px-3 py-1 rounded-lg text-xs font-semibold transition"
          >
            <Scissors className="w-3.5 h-3.5" /> Quantize
          </button>
          <button
            onClick={clearPianoRollNotes}
            className="flex items-center gap-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 px-3 py-1 rounded-lg text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Piano Roll Timeline Ruler & Note Grid */}
      <div className="flex-1 overflow-auto flex relative bg-slate-950/90 scrollbar-thin">
        <div className="sticky left-0 z-30 w-24 bg-studio-surface border-r border-studio-border flex flex-col shrink-0">
          <div className="h-8 bg-studio-surfaceLight border-b border-studio-border flex items-center justify-center text-[10px] font-mono text-slate-400">
            PITCH
          </div>
          {pitches.map((pitch) => {
            const isBlack = pitch.includes('#');
            return (
              <div
                key={pitch}
                onClick={() => {
                  instrumentManager.triggerAttack(pitch, 0.85);
                  setTimeout(() => instrumentManager.triggerRelease(pitch), 250);
                }}
                className={`h-[22px] px-2 flex items-center justify-between text-[10px] font-mono font-bold cursor-pointer border-b border-studio-border/30 transition-colors ${
                  isBlack
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-200 hover:bg-white text-slate-900'
                }`}
              >
                <span>{pitch}</span>
                {pitch.startsWith('C') && !isBlack && (
                  <span className="w-1.5 h-1.5 rounded-full bg-synth-purple" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex-1 relative flex flex-col min-w-max">
          <div className="h-8 sticky top-0 z-20 bg-studio-surface border-b border-studio-border flex items-center font-mono text-[11px] text-slate-400">
            {Array.from({ length: totalBeats }).map((_, beatIdx) => (
              <div
                key={beatIdx}
                className={`w-[128px] shrink-0 border-r border-studio-border/60 pl-2 font-bold ${
                  beatIdx % 4 === 0 ? 'text-synth-cyan' : 'text-slate-500'
                }`}
              >
                Bar {Math.floor(beatIdx / 4) + 1}.{(beatIdx % 4) + 1}
              </div>
            ))}
          </div>

          <div className="relative flex-1">
            {pitches.map((pitch) => {
              const isBlack = pitch.includes('#');
              return (
                <div
                  key={pitch}
                  className={`h-[22px] flex border-b border-studio-border/20 ${
                    isBlack ? 'bg-[#0b0e17]' : 'bg-[#101422]'
                  }`}
                >
                  {Array.from({ length: totalBeats * 4 }).map((_, stepIdx) => {
                    const stepBeatTime = stepIdx * 0.25;
                    const isBarBoundary = stepIdx % 16 === 0;
                    const isBeatBoundary = stepIdx % 4 === 0;

                    return (
                      <div
                        key={stepIdx}
                        onClick={() => handleGridClick(pitch, stepBeatTime)}
                        className={`w-[32px] shrink-0 border-r hover:bg-synth-purple/20 cursor-pointer transition-colors ${
                          isBarBoundary
                            ? 'border-r-studio-border'
                            : isBeatBoundary
                            ? 'border-r-studio-border/50'
                            : 'border-r-studio-border/10'
                        }`}
                      />
                    );
                  })}
                </div>
              );
            })}

            {pianoRollNotes.map((note) => {
              const pitchRowIndex = pitches.indexOf(note.pitch);
              if (pitchRowIndex === -1) return null;

              const topPx = pitchRowIndex * cellHeight;
              const leftPx = (note.time / 0.25) * cellWidth;
              const widthPx = Math.max(24, (note.duration / 0.25) * cellWidth - 2);

              return (
                <div
                  key={note.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNoteId(note.id);
                  }}
                  className="absolute z-10 h-[20px] rounded border border-white/30 bg-gradient-to-r from-synth-purple to-synth-cyan shadow-md shadow-purple-900/40 flex items-center justify-between px-1.5 cursor-pointer hover:brightness-125 transition-all text-[10px] font-mono font-bold text-white overflow-hidden"
                  style={{
                    top: `${topPx + 1}px`,
                    left: `${leftPx}px`,
                    width: `${widthPx}px`,
                  }}
                >
                  <span className="truncate">{note.pitch}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
