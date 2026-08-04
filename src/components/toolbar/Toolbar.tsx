import React from 'react';
import {
  Play,
  Pause,
  Circle,
  Volume2,
  Sliders,
  Sparkles,
  Music,
  Grid,
  Radio,
  Download,
  Settings as SettingsIcon,
  Activity,
  Maximize2,
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { ViewTab } from '../../types';

interface ToolbarProps {
  onOpenExport: () => void;
  onOpenSettings: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenExport, onOpenSettings }) => {
  const {
    projectName,
    setProjectName,
    bpm,
    setBpm,
    isPlaying,
    togglePlay,
    isRecording,
    toggleRecord,
    metronome,
    toggleMetronome,
    masterVolume,
    setMasterVolume,
    viewTab,
    setViewTab,
  } = useStudioStore();

  const tabs: { id: ViewTab; label: string; icon: any }[] = [
    { id: 'piano', label: '88-Key Piano', icon: Music },
    { id: 'pianoroll', label: 'Piano Roll', icon: Grid },
    { id: 'drums', label: 'Drum Sequencer', icon: Radio },
    { id: 'chords', label: 'Scale & Chords', icon: Sliders },
    { id: 'ai', label: 'AI Composition', icon: Sparkles },
    { id: 'fx', label: 'Audio FX Rack', icon: Activity },
    { id: 'visualizer', label: 'Visualizer', icon: Maximize2 },
  ];

  return (
    <header className="bg-[#0b0e17]/90 backdrop-blur-md border-b border-studio-border px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-slate-200 select-none sticky top-0 z-40">
      {/* Brand & Project Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-synth-purple to-synth-cyan px-3 py-1.5 rounded-lg shadow-lg shadow-purple-900/30">
          <Music className="w-5 h-5 text-white animate-pulse" />
          <span className="font-bold tracking-wide text-white text-base">PIANO STUDIO</span>
        </div>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-studio-surface/80 border border-studio-border hover:border-slate-600 focus:border-synth-cyan rounded-md px-2.5 py-1 text-sm text-slate-200 font-medium outline-none transition"
        />
      </div>

      {/* Main Transport & BPM Controls */}
      <div className="flex items-center gap-4 bg-studio-surface/90 border border-studio-border/80 rounded-xl px-4 py-1.5 shadow-inner">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`p-2 rounded-full transition-all flex items-center justify-center ${
            isPlaying
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 scale-105'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
          }`}
          title={isPlaying ? 'Pause Transport' : 'Play Transport'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Record Button */}
        <button
          onClick={toggleRecord}
          className={`p-2 rounded-full transition-all flex items-center justify-center ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50'
              : 'bg-studio-surfaceLight hover:bg-rose-950 text-rose-500 border border-rose-500/30'
          }`}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          <Circle className={`w-4 h-4 ${isRecording ? 'fill-current' : ''}`} />
        </button>

        {/* Metronome */}
        <button
          onClick={toggleMetronome}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition border ${
            metronome
              ? 'bg-synth-cyan text-slate-950 border-synth-cyan shadow'
              : 'bg-studio-surfaceLight text-slate-400 border-studio-border hover:text-slate-200'
          }`}
        >
          METRO
        </button>

        <div className="h-6 w-[1px] bg-studio-border mx-1" />

        {/* Tempo BPM Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">BPM</span>
          <input
            type="number"
            min="40"
            max="280"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-16 bg-studio-bg border border-studio-border text-center text-sm font-mono text-synth-cyan font-bold rounded py-0.5 outline-none focus:border-synth-cyan"
          />
        </div>

        <div className="h-6 w-[1px] bg-studio-border mx-1" />

        {/* Master Volume Slider */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            className="w-20 accent-synth-purple cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400 w-8">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>
      </div>

      {/* View Tabs Navigation */}
      <div className="flex items-center gap-1 bg-studio-surface/90 border border-studio-border p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = viewTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setViewTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-synth-purple to-indigo-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-studio-surfaceLight'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions: Export & Settings */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-emerald-900/30 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 bg-studio-surface hover:bg-studio-surfaceLight border border-studio-border text-slate-300 rounded-lg transition"
          title="Studio Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
