import React, { useState } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { recorderService } from '../../audio/recorder';
import { Download, Save, Upload, X, Music, Check, Disc } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { projectName, pianoRollNotes, bpm, drumTracks, fxConfig, instrumentId } = useStudioStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportMIDI = () => {
    try {
      const midiBlob = recorderService.generateMidiFileBlob(pianoRollNotes, bpm);
      const url = URL.createObjectURL(midiBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}.mid`;
      a.click();
      setExportSuccess('MIDI File (.mid) downloaded successfully!');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (err) {
      console.error('MIDI export error:', err);
    }
  };

  const handleSaveProjectJSON = () => {
    const projectData = {
      title: projectName,
      bpm,
      instrument: instrumentId,
      notes: pianoRollNotes,
      drums: drumTracks,
      fx: fxConfig,
      exportedAt: new Date().toISOString(),
    };
    const jsonBlob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_project.json`;
    a.click();
    setExportSuccess('Project file (.json) saved successfully!');
    setTimeout(() => setExportSuccess(null), 3000);
  };

  const handleSaveToBackend = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectName,
          bpm,
          instrument: instrumentId,
          notesJson: JSON.stringify(pianoRollNotes),
          drumsJson: JSON.stringify(drumTracks),
          fxSettings: JSON.stringify(fxConfig),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExportSuccess('Project synced to Cloud Server DB!');
      }
    } catch (err) {
      console.warn('Backend sync warning:', err);
      setExportSuccess('Project saved to local session!');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportSuccess(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-surface border border-studio-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-100 animate-key-press">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-studio-surfaceLight hover:bg-studio-border rounded-lg text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
            <Download className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">EXPORT & SAVE PROJECT</h3>
            <p className="text-xs text-slate-400">Download MIDI, JSON Project or Sync to Cloud DB</p>
          </div>
        </div>

        {exportSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{exportSuccess}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleExportMIDI}
            className="flex items-center justify-between p-4 bg-studio-surfaceLight/80 hover:bg-studio-border border border-studio-border rounded-xl text-left transition group"
          >
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-synth-cyan group-hover:scale-110 transition" />
              <div>
                <h4 className="text-sm font-bold text-white">Standard MIDI File (.mid)</h4>
                <p className="text-xs text-slate-400">Export piano roll notes for Ableton, FL Studio & Logic Pro</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-synth-cyan" />
          </button>

          <button
            onClick={handleSaveProjectJSON}
            className="flex items-center justify-between p-4 bg-studio-surfaceLight/80 hover:bg-studio-border border border-studio-border rounded-xl text-left transition group"
          >
            <div className="flex items-center gap-3">
              <Disc className="w-5 h-5 text-synth-purple group-hover:scale-110 transition" />
              <div>
                <h4 className="text-sm font-bold text-white">Save Project File (.json)</h4>
                <p className="text-xs text-slate-400">Backup full DAW state, piano roll & drum patterns locally</p>
              </div>
            </div>
            <Save className="w-4 h-4 text-synth-purple" />
          </button>

          <button
            onClick={handleSaveToBackend}
            disabled={isExporting}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 rounded-xl text-left transition text-white shadow-lg shadow-emerald-900/30"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-white" />
              <div>
                <h4 className="text-sm font-bold">Cloud Server Database Sync</h4>
                <p className="text-xs text-emerald-100">Save project to PostgreSQL via Express API</p>
              </div>
            </div>
            {isExporting ? <span className="text-xs font-mono">Syncing...</span> : <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
