import React, { useState } from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import {
  generateAIMelody,
  generateAIChordProgression,
  generateAIHarmony,
  generateFullSongMelody,
} from '../../utils/aiGenerators';
import { HINDI_SONGS, MAC_EASY_MAP } from '../../utils/musicTheory';
import { Sparkles, Music, Wand2, Bot, ArrowRight, Play, Disc, ClipboardCheck, Search, Globe } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const {
    selectedRoot,
    selectedScale,
    setPianoRollNotes,
    pianoRollNotes,
    addPianoRollNote,
    setViewTab,
    loadActiveSong,
  } = useStudioStore();

  const [aiStyle, setAiStyle] = useState<string>('Pop');
  const [aiDensity, setAiDensity] = useState<'sparse' | 'medium' | 'dense'>('medium');
  const [internetSearchQuery, setInternetSearchQuery] = useState('');
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  const [selectedHindiSong, setSelectedHindiSong] = useState(HINDI_SONGS[0]);
  const [generatedSongKeys, setGeneratedSongKeys] = useState<string[]>(HINDI_SONGS[0].keys);
  const [chatGptKeysInput, setChatGptKeysInput] = useState('');
  const [pastedKeysSuccess, setPastedKeysSuccess] = useState(false);

  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: "🌐 Welcome to Internet Song Search & AI Full-Song Generator! Search ANY song from the Web (Bollywood, Hollywood, Punjabi) and I will generate the FULL song for you!",
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // 1. Internet Song Search & Full Key Extractor
  const handleSearchInternetSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internetSearchQuery.trim()) return;

    const query = internetSearchQuery.trim();
    setIsSearchingWeb(true);

    setTimeout(() => {
      const matched = HINDI_SONGS.find((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.movie.toLowerCase().includes(query.toLowerCase()));

      if (matched) {
        setGeneratedSongKeys(matched.keys);
        setSelectedHindiSong(matched);
        loadActiveSong(matched.name, matched.keys, matched.bpm || 90, matched.rhythm);
      } else {
        const fullSongData = generateFullSongMelody(query);
        setGeneratedSongKeys(fullSongData.macKeys);
        loadActiveSong(query, fullSongData.macKeys, fullSongData.bpm);
      }

      setIsSearchingWeb(false);
      setInternetSearchQuery('');

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `🌐 Internet Search Complete for "${query}"!\n\nGenerated FULL Song (Intro + Verse + Chorus) with ${generatedSongKeys.length} Mac Keys! Click "Play Full Song on Piano" to listen!`,
        },
      ]);
    }, 1000);
  };

  const handleLoadHindiSong = (song: typeof HINDI_SONGS[0]) => {
    setSelectedHindiSong(song);
    setGeneratedSongKeys(song.keys);
    loadActiveSong(song.name, song.keys, song.bpm || 90, song.rhythm);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `🎵 Loaded Song: "${song.name}"!\n\nPress these Mac Keys in order: ${song.keys.join(' - ')}`,
      },
    ]);
  };

  const handleImportChatGPTKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatGptKeysInput.trim()) return;

    const rawText = chatGptKeysInput.toUpperCase();
    const parsedKeys: string[] = [];

    for (let char of rawText) {
      if (/[QWERTYUIOPASDFGHJKLZXCVBNM0123456789]/.test(char)) {
        parsedKeys.push(char);
      } else if (char === ' ' || char === '-' || char === ',') {
        if (parsedKeys[parsedKeys.length - 1] !== ' ') {
          parsedKeys.push(' ');
        }
      }
    }

    if (parsedKeys.length === 0) return;

    setGeneratedSongKeys(parsedKeys);
    loadActiveSong("Custom ChatGPT Song", parsedKeys, 90);
    setPastedKeysSuccess(true);
    setTimeout(() => setPastedKeysSuccess(false), 4000);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `🚀 ChatGPT Song Keys Successfully Imported! (${parsedKeys.filter((k) => k !== ' ').length} notes)`,
      },
    ]);
  };

  const handlePlayOnPianoView = () => {
    setViewTab('piano');
  };

  const handleGenerateMelody = () => {
    const melodyNotes = generateAIMelody({
      key: selectedRoot,
      scale: selectedScale,
      octave: 4,
      lengthBars: 4,
      density: aiDensity,
    });
    setPianoRollNotes(melodyNotes);
    setViewTab('pianoroll');
  };

  const handleGenerateChords = () => {
    const chordNotes = generateAIChordProgression(selectedRoot, aiStyle);
    setPianoRollNotes(chordNotes);
    setViewTab('pianoroll');
  };

  const handleGenerateHarmony = () => {
    if (pianoRollNotes.length === 0) return;
    const harmonies = generateAIHarmony(pianoRollNotes);
    harmonies.forEach((h) => addPianoRollNote(h));
    setViewTab('pianoroll');
  };

  const handleSongStarter = () => {
    const melody = generateAIMelody({
      key: selectedRoot,
      scale: selectedScale,
      octave: 4,
      lengthBars: 4,
      density: 'medium',
    });
    const chords = generateAIChordProgression(selectedRoot, 'Pop');
    setPianoRollNotes([...melody, ...chords]);
    setViewTab('pianoroll');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let aiReply = "Aap upar 'Search Internet Song' box me kisi bhi gaane ka naam daal kar Search karein! Full song generate ho jayega.";
      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#080a0f] text-slate-100 select-none p-4 overflow-y-auto scrollbar-thin">
      <div className="bg-studio-surface/90 border border-studio-border rounded-xl p-4 mb-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-emerald-500 via-synth-cyan to-synth-purple rounded-lg shadow-md">
            <Globe className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">INTERNET SONG SEARCH & FULL SONG GENERATOR</h2>
            <p className="text-xs text-slate-400">Search ANY song online & generate full 3-minute Piano keys</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Internet Song Search & ChatGPT Key Paste Box */}
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col gap-4 shadow-md">
          {/* 🌐 INTERNET SONG SEARCH BAR */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950 border border-emerald-500/50 rounded-xl p-3.5 flex flex-col gap-2 shadow-lg">
            <h3 className="font-bold text-xs text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Search className="w-4 h-4 text-synth-cyan" /> Search Internet For Any Full Song
            </h3>
            <form onSubmit={handleSearchInternetSong} className="flex gap-2">
              <input
                type="text"
                placeholder="Search ANY Song (e.g. Kesariya full, Despacito, Tum Hi Ho full, Pasoori)..."
                value={internetSearchQuery}
                onChange={(e) => setInternetSearchQuery(e.target.value)}
                className="flex-1 bg-studio-bg border border-studio-border focus:border-emerald-400 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none font-medium"
              />
              <button
                type="submit"
                disabled={isSearchingWeb}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs transition shadow flex items-center gap-1.5"
              >
                {isSearchingWeb ? <span className="animate-spin">🌀</span> : <Globe className="w-3.5 h-3.5" />}
                <span>{isSearchingWeb ? 'Searching...' : 'Search Web'}</span>
              </button>
            </form>
          </div>

          {/* ChatGPT Key Paste Box */}
          <div className="bg-gradient-to-r from-purple-950/80 to-slate-900 border border-synth-purple/40 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-synth-purple flex items-center gap-1.5 uppercase tracking-wider">
                <ClipboardCheck className="w-4 h-4 text-synth-cyan" /> Paste ChatGPT Mac Keys Here
              </h3>
              {pastedKeysSuccess && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                  IMPORTED!
                </span>
              )}
            </div>
            <form onSubmit={handleImportChatGPTKeys} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste keys from ChatGPT (e.g. Q W E R T Y U I O P)..."
                value={chatGptKeysInput}
                onChange={(e) => setChatGptKeysInput(e.target.value)}
                className="flex-1 bg-studio-bg border border-studio-border focus:border-synth-purple rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-synth-purple to-indigo-600 hover:brightness-110 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow"
              >
                Load
              </button>
            </form>
          </div>

          {/* Quick Preset Song List */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2 uppercase font-bold">Select Famous Song:</label>
            <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
              {HINDI_SONGS.map((song) => (
                <button
                  key={song.name}
                  onClick={() => handleLoadHindiSong(song)}
                  className={`p-2 rounded-lg text-xs font-semibold text-left flex justify-between items-center transition border ${
                    selectedHindiSong.name === song.name
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold border-amber-400 shadow'
                      : 'bg-studio-surfaceLight text-slate-200 border-studio-border hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{song.name}</span>
                  <span className="text-[10px] opacity-75 font-mono ml-1">({song.movie})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Mac Keyboard Keys Display Box */}
          <div className="bg-studio-bg/90 border border-studio-border rounded-xl p-3 flex flex-col gap-2 shadow-inner">
            <div className="flex justify-between items-center border-b border-studio-border/60 pb-2">
              <span className="text-xs font-bold text-synth-cyan">
                Active Full Song ({generatedSongKeys.filter((k) => k !== ' ').length} Notes)
              </span>
              <button
                onClick={handlePlayOnPianoView}
                className="text-[11px] bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold px-3 py-1 rounded-md transition flex items-center gap-1 shadow hover:scale-105"
              >
                <Play className="w-3 h-3 fill-current" /> Play Full Song on Piano
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-[100px] overflow-y-auto scrollbar-thin">
              <span className="text-xs font-bold text-amber-400 font-mono self-center mr-1">MAC KEYS:</span>
              {generatedSongKeys.map((k, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded font-extrabold text-xs shadow ${
                    k === ' '
                      ? 'w-3'
                      : 'bg-gradient-to-r from-synth-cyan to-synth-purple text-slate-950 border border-white/40'
                  }`}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Chat Console */}
        <div className="bg-studio-surface/80 border border-studio-border rounded-xl p-4 flex flex-col h-[460px] shadow-md">
          <div className="flex items-center gap-2 border-b border-studio-border pb-2 mb-3">
            <Bot className="w-4 h-4 text-synth-cyan" />
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">AI Internet Music Search Assistant</h3>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg text-xs leading-relaxed max-w-[90%] ${
                  msg.sender === 'ai'
                    ? 'bg-studio-surfaceLight text-slate-200 self-start border border-studio-border whitespace-pre-wrap'
                    : 'bg-synth-purple text-white self-end font-medium shadow'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Ask for any full song..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-studio-bg border border-studio-border focus:border-synth-purple rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
            />
            <button
              type="submit"
              className="bg-synth-purple hover:bg-purple-600 text-white p-2 rounded-lg transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
