import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { ViewTab } from '../../types';
import {
  Play,
  Square,
  Circle,
  Volume2,
  Piano as PianoIcon,
  Grid,
  Drum,
  SlidersHorizontal,
  Music2,
  Bot,
  BarChart3,
  Download,
  Settings,
  Sparkles,
} from 'lucide-react';

interface ToolbarProps {
  onOpenExportModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenExportModal, onOpenSettingsModal }) => {
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

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'piano', label: '88-Key Piano', icon: <PianoIcon className="w-4 h-4" /> },
    { id: 'pianoroll', label: 'Piano Roll', icon: <Grid className="w-4 h-4" /> },
    { id: 'drums', label: '16-Step Drums', icon: <Drum className="w-4 h-4" /> },
    { id: 'fx', label: 'FX Rack', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'chords', label: 'Scale & Chords', icon: <Music2 className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Composition', icon: <Bot className="w-4 h-4" /> },
    { id: 'visualizer', label: '60 FPS Visualizer', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="h-16 daw-glass border-b border-white/10 px-4 flex items-center justify-between gap-4 z-40 select-none shadow-2xl relative">
      {/* Brand & Project Title */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <div className="p-2.5 bg-gradient-to-tr from-purple-600 via-synth-purple to-synth-cyan rounded-xl shadow-lg shadow-purple-900/40 animate-neon-pulse flex items-center justify-center border border-white/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-200 uppercase">
              PIANO STUDIO DAW
            </span>
            <span className="text-[10px] bg-synth-purple/30 text-synth-cyan font-mono px-2 py-0.5 rounded-full border border-synth-cyan/30 font-bold">
              PRO v2.5
            </span>
          </div>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-300 hover:text-white focus:text-white outline-none border-b border-transparent hover:border-slate-600 focus:border-synth-cyan transition w-44"
          />
        </div>
      </div>

      {/* Main Transport Controls */}
      <div className="flex items-center gap-3 bg-studio-surface/90 border border-white/10 p-1.5 rounded-2xl shadow-inner daw-card-glow">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className={`p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center ${
            isPlaying
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/40 scale-105 ring-2 ring-emerald-300'
              : 'bg-studio-surfaceLight hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title={isPlaying ? 'Pause Transport' : 'Play Transport'}
        >
          {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Record */}
        <button
          onClick={toggleRecord}
          className={`p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center ${
            isRecording
              ? 'bg-rose-600 text-white shadow-rose-600/50 animate-pulse ring-2 ring-white'
              : 'bg-studio-surfaceLight hover:bg-slate-700 text-slate-300 hover:text-rose-400'
          }`}
          title={isRecording ? 'Stop Recording' : 'Start Recording MIDI/Audio'}
        >
          <Circle className={`w-4 h-4 ${isRecording ? 'fill-current' : ''}`} />
        </button>

        {/* Metronome */}
        <button
          onClick={toggleMetronome}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            metronome
              ? 'bg-synth-purple text-white shadow-md shadow-purple-900/50 border border-purple-400'
              : 'bg-studio-surfaceLight text-slate-400 hover:text-slate-200'
          }`}
        >
          METRO
        </button>

        <div className="h-6 w-[1px] bg-studio-border" />

        {/* BPM Selector */}
        <div className="flex items-center gap-1.5 px-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold">BPM:</span>
          <input
            type="number"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-14 bg-studio-bg border border-studio-border focus:border-synth-cyan rounded-lg px-2 py-1 text-xs font-mono font-bold text-synth-cyan text-center outline-none"
          />
        </div>

        <div className="h-6 w-[1px] bg-studio-border" />

        {/* Master Volume */}
        <div className="flex items-center gap-2 px-2">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            className="w-20 accent-synth-cyan cursor-pointer"
          />
          <span className="text-[11px] font-mono text-slate-400 w-8 text-right font-bold">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <nav className="flex items-center gap-1 bg-studio-surface/90 border border-white/10 p-1.5 rounded-2xl shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              viewTab === tab.id
                ? 'bg-gradient-to-r from-synth-purple via-purple-600 to-synth-cyan text-white shadow-lg shadow-purple-900/50 border border-white/30 scale-105'
                : 'text-slate-400 hover:text-slate-100 hover:bg-studio-surfaceLight'
            }`}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenExportModal}
          className="bg-gradient-to-r from-synth-purple to-indigo-600 hover:brightness-110 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-lg shadow-purple-900/30 flex items-center gap-1.5 border border-white/20"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export MIDI</span>
        </button>

        <button
          onClick={onOpenSettingsModal}
          className="p-2.5 bg-studio-surfaceLight hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition border border-studio-border"
          title="Studio Settings & Web MIDI Setup"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
