import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { Activity, Sliders, Waves, Zap, ShieldAlert, Sparkles } from 'lucide-react';

export const EffectsRack: React.FC = () => {
  const { fxConfig, updateFxConfig } = useStudioStore();

  return (
    <div className="flex flex-col h-full bg-[#080a0f] text-slate-100 select-none p-4 overflow-y-auto scrollbar-thin">
      {/* Header Bar */}
      <div className="bg-studio-surface/90 border border-studio-border rounded-xl p-4 mb-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-synth-purple to-synth-cyan rounded-lg shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">MASTER AUDIO EFFECTS RACK</h2>
            <p className="text-xs text-slate-400">Professional Studio DSP Chain & Master Processing</p>
          </div>
        </div>
      </div>

      {/* Grid of FX Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Module 1: Reverb */}
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-3 shadow-md hover:border-synth-purple/60 transition">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-2">
            <span className="font-bold text-xs text-synth-purple uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Studio Reverb
            </span>
          </div>
          <div className="flex flex-col gap-3 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Decay Time</span>
                <span className="text-synth-purple font-bold">{fxConfig.reverbDecay.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={fxConfig.reverbDecay}
                onChange={(e) => updateFxConfig({ reverbDecay: Number(e.target.value) })}
                className="w-full accent-synth-purple cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Mix (Wet/Dry)</span>
                <span className="text-synth-purple font-bold">{Math.round(fxConfig.reverbWet * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={fxConfig.reverbWet}
                onChange={(e) => updateFxConfig({ reverbWet: Number(e.target.value) })}
                className="w-full accent-synth-purple cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Module 2: Delay */}
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-3 shadow-md hover:border-synth-cyan/60 transition">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-2">
            <span className="font-bold text-xs text-synth-cyan uppercase tracking-wider flex items-center gap-1.5">
              <Waves className="w-4 h-4" /> Stereo Ping-Pong Delay
            </span>
          </div>
          <div className="flex flex-col gap-3 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Feedback</span>
                <span className="text-synth-cyan font-bold">{Math.round(fxConfig.delayFeedback * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.85"
                step="0.05"
                value={fxConfig.delayFeedback}
                onChange={(e) => updateFxConfig({ delayFeedback: Number(e.target.value) })}
                className="w-full accent-synth-cyan cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Mix (Wet/Dry)</span>
                <span className="text-synth-cyan font-bold">{Math.round(fxConfig.delayWet * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={fxConfig.delayWet}
                onChange={(e) => updateFxConfig({ delayWet: Number(e.target.value) })}
                className="w-full accent-synth-cyan cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Module 3: 3-Band EQ */}
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-3 shadow-md hover:border-emerald-500/60 transition">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-2">
            <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> 3-Band Master EQ
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
            <div>
              <span className="text-slate-400 block mb-1">LOW</span>
              <input
                type="range"
                min="-24"
                max="24"
                step="1"
                value={fxConfig.eqLow}
                onChange={(e) => updateFxConfig({ eqLow: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-24 [writing-mode:vertical-lr] [direction:rtl] mx-auto"
              />
              <span className="text-emerald-400 font-bold block mt-1">{fxConfig.eqLow}dB</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">MID</span>
              <input
                type="range"
                min="-24"
                max="24"
                step="1"
                value={fxConfig.eqMid}
                onChange={(e) => updateFxConfig({ eqMid: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-24 [writing-mode:vertical-lr] [direction:rtl] mx-auto"
              />
              <span className="text-emerald-400 font-bold block mt-1">{fxConfig.eqMid}dB</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">HIGH</span>
              <input
                type="range"
                min="-24"
                max="24"
                step="1"
                value={fxConfig.eqHigh}
                onChange={(e) => updateFxConfig({ eqHigh: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-24 [writing-mode:vertical-lr] [direction:rtl] mx-auto"
              />
              <span className="text-emerald-400 font-bold block mt-1">{fxConfig.eqHigh}dB</span>
            </div>
          </div>
        </div>

        {/* Module 4: Lowpass Filter */}
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-3 shadow-md hover:border-amber-500/60 transition">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-2">
            <span className="font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Filter Sweep
            </span>
          </div>
          <div className="flex flex-col gap-3 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Cutoff Frequency</span>
                <span className="text-amber-400 font-bold">{Math.round(fxConfig.filterCutoff)} Hz</span>
              </div>
              <input
                type="range"
                min="200"
                max="20000"
                step="100"
                value={fxConfig.filterCutoff}
                onChange={(e) => updateFxConfig({ filterCutoff: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Resonance Q</span>
                <span className="text-amber-400 font-bold">{fxConfig.filterResonance.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={fxConfig.filterResonance}
                onChange={(e) => updateFxConfig({ filterResonance: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Module 5: Distortion */}
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-3 shadow-md hover:border-rose-500/60 transition">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-2">
            <span className="font-bold text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Overdrive & Distortion
            </span>
          </div>
          <div className="flex flex-col gap-3 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Drive</span>
                <span className="text-rose-400 font-bold">{Math.round(fxConfig.distortionDrive * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={fxConfig.distortionDrive}
                onChange={(e) => updateFxConfig({ distortionDrive: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-slate-400">
                <span>Mix (Wet/Dry)</span>
                <span className="text-rose-400 font-bold">{Math.round(fxConfig.distortionWet * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={fxConfig.distortionWet}
                onChange={(e) => updateFxConfig({ distortionWet: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
