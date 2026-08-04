import React, { useState, useEffect } from 'react';
import { useStudioStore } from './store/useStudioStore';
import { Toolbar } from './components/toolbar/Toolbar';
import { Piano } from './components/piano/Piano';
import { PianoRoll } from './components/pianoroll/PianoRoll';
import { DrumMachine } from './components/drums/DrumMachine';
import { EffectsRack } from './components/fx/EffectsRack';
import { ChordTools } from './components/chords/ChordTools';
import { AIAssistant } from './components/ai/AIAssistant';
import { AudioVisualizer } from './components/visualizer/AudioVisualizer';
import { ExportModal } from './components/export/ExportModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { midiManager } from './midi/midiManager';

export const App: React.FC = () => {
  const { viewTab } = useStudioStore();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Auto-detect Web MIDI devices on application start
    midiManager.initMIDI();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080a0f] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top DAW Header Toolbar */}
      <Toolbar
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Studio View Workspace */}
      <main className="flex-1 overflow-hidden relative">
        {viewTab === 'piano' && <Piano />}
        {viewTab === 'pianoroll' && <PianoRoll />}
        {viewTab === 'drums' && <DrumMachine />}
        {viewTab === 'chords' && <ChordTools />}
        {viewTab === 'ai' && <AIAssistant />}
        {viewTab === 'fx' && <EffectsRack />}
        {viewTab === 'visualizer' && <AudioVisualizer />}
      </main>

      {/* Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default App;
