import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { Radio } from 'lucide-react';

export const DrumMachine: React.FC = () => {
  const { drumTracks, toggleDrumStep, triggerDrumSample } = useStudioStore();

  const loadPresetPattern = (presetName: string) => {
    if (presetName === 'Trap') {
      drumTracks[0].steps = [true, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false];
      drumTracks[1].steps = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
      drumTracks[2].steps = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
      drumTracks[7].steps = [true, false, false, true, false, false, true, false, false, false, true, false, false, false, false, false];
    } else if (presetName === 'House') {
      drumTracks[0].steps = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
      drumTracks[1].steps = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
      drumTracks[3].steps = [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
      drumTracks[4].steps = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
    } else if (presetName === 'Synthwave') {
      drumTracks[0].steps = [true, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false];
      drumTracks[1].steps = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
      drumTracks[2].steps = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
      drumTracks[6].steps = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080a0f] text-slate-100 select-none p-4 overflow-y-auto scrollbar-thin">
      {/* Header Bar */}
      <div className="bg-studio-surface/90 border border-studio-border rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-rose-500 to-amber-500 rounded-lg shadow-md">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">16-STEP DRUM SEQUENCER</h2>
            <p className="text-xs text-slate-400">Synthesized 808/909 drum kit & step sequencer</p>
          </div>
        </div>

        {/* Pattern Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase">PRESETS:</span>
          {['House', 'Trap', 'Synthwave'].map((preset) => (
            <button
              key={preset}
              onClick={() => loadPresetPattern(preset)}
              className="px-3 py-1 bg-studio-surfaceLight hover:bg-studio-border border border-studio-border text-xs font-semibold text-slate-200 rounded-lg transition"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Sequencer Grid Matrix */}
      <div className="flex-1 bg-studio-surface/80 border border-studio-border rounded-xl p-4 shadow-2xl flex flex-col gap-3">
        {/* Step Indicator Top Ruler */}
        <div className="flex items-center gap-2 pl-[240px]">
          {Array.from({ length: 16 }).map((_, stepIdx) => (
            <div
              key={stepIdx}
              className={`flex-1 text-center font-mono text-[11px] font-bold py-1 rounded ${
                stepIdx % 4 === 0 ? 'bg-studio-surfaceLight text-synth-cyan' : 'text-slate-500'
              }`}
            >
              {stepIdx + 1}
            </div>
          ))}
        </div>

        {/* Drum Sound Tracks */}
        {drumTracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-3 bg-[#0b0e17] border border-studio-border/60 rounded-lg p-2 hover:border-studio-border transition"
          >
            <div className="w-[220px] flex items-center justify-between shrink-0 pr-2 border-r border-studio-border/40">
              <button
                onClick={() => triggerDrumSample(track.sampleKey)}
                className="flex items-center gap-2 group text-left"
              >
                <span
                  className="w-3 h-3 rounded-full shadow-sm group-hover:scale-125 transition"
                  style={{ backgroundColor: track.color }}
                />
                <span className="text-xs font-bold text-slate-200 group-hover:text-synth-cyan transition">
                  {track.name}
                </span>
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={track.volume}
                onChange={(e) => (track.volume = Number(e.target.value))}
                className="w-16 accent-synth-purple cursor-pointer"
                title={`Track Volume: ${Math.round(track.volume * 100)}%`}
              />
            </div>

            <div className="flex-1 grid grid-cols-16 gap-1.5">
              {track.steps.map((isSet, stepIdx) => {
                const isQuarterBeat = stepIdx % 4 === 0;
                return (
                  <button
                    key={stepIdx}
                    onClick={() => toggleDrumStep(track.id, stepIdx)}
                    className={`h-10 rounded-md transition-all duration-150 flex items-center justify-center border ${
                      isSet
                        ? 'shadow-lg scale-[0.98]'
                        : isQuarterBeat
                        ? 'bg-studio-surfaceLight/80 border-studio-border hover:bg-slate-700'
                        : 'bg-studio-bg/60 border-studio-border/40 hover:bg-slate-800'
                    }`}
                    style={
                      isSet
                        ? {
                            backgroundColor: track.color,
                            borderColor: '#ffffff',
                            boxShadow: `0 0 12px ${track.color}`,
                          }
                        : {}
                    }
                  >
                    {isSet && <span className="w-2 h-2 bg-white rounded-full shadow" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
