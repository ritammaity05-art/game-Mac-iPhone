import React, { useEffect, useState } from 'react';
import { midiManager } from '../../midi/midiManager';
import { MidiDevice } from '../../types';
import { X, Settings as SettingsIcon, Radio, Keyboard } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);

  useEffect(() => {
    if (isOpen) {
      midiManager.initMIDI().then((devs) => {
        setMidiDevices(devs);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          <div className="p-3 bg-gradient-to-r from-synth-purple to-indigo-600 rounded-xl shadow-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">STUDIO SETTINGS</h3>
            <p className="text-xs text-slate-400">Audio Latency, MIDI Hardware & Keyboard Mappings</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-xs font-medium">
          <div className="bg-studio-surfaceLight/80 border border-studio-border rounded-xl p-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-synth-cyan flex items-center gap-2 uppercase tracking-wider">
              <Radio className="w-4 h-4" /> Connected MIDI Keyboards
            </h4>
            {midiDevices.length > 0 ? (
              <div className="flex flex-col gap-1.5 mt-1">
                {midiDevices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-2.5 bg-studio-bg rounded-lg border border-studio-border/60 flex items-center justify-between"
                  >
                    <span className="font-bold text-white">{dev.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                      ONLINE
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No external Web MIDI keyboards detected. Connect a USB MIDI keyboard for auto-detection.</p>
            )}
          </div>

          <div className="bg-studio-surfaceLight/80 border border-studio-border rounded-xl p-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-synth-purple flex items-center gap-2 uppercase tracking-wider">
              <Keyboard className="w-4 h-4" /> QWERTY Keyboard Mapping
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
              <div className="bg-studio-bg p-2 rounded border border-studio-border">
                <span className="text-synth-cyan font-bold block mb-1">Octave 4 (Lower):</span>
                <span>Z-X-C-V-B-N-M (White)</span>
                <br />
                <span>S-D-G-H-J (Black)</span>
              </div>
              <div className="bg-studio-bg p-2 rounded border border-studio-border">
                <span className="text-synth-cyan font-bold block mb-1">Octave 5 (Upper):</span>
                <span>Q-W-E-R-T-Y-U-I (White)</span>
                <br />
                <span>2-3-5-6-7 (Black)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
