# Piano Studio 🎹

**Piano Studio** is a full-featured, production-ready Virtual Piano & Digital Audio Workstation (DAW) web application inspired by FL Studio, Ableton Live, Logic Pro, and Native Instruments. Built using **React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, Tone.js, Web Audio API, Web MIDI API, Express.js, and Prisma ORM**.

---

## 🌟 Key Features

### 🎹 1. 88-Key Interactive Virtual Piano
- **Full 88-Key Range**: Complete spectrum from A0 (27.5 Hz) to C8 (4186.01 Hz).
- **Easy Mac Keyboard Mode**: Easy 3-row Mac keyboard mapping (`Q, W, E, R, T, Y, U, I`) so beginners can play any song without music theory knowledge.
- **Quad Input Support**: Mouse drag, multi-touch gestures, Web MIDI hardware keyboards, and computer keyboard.
- **Velocity Sensitivity & Sustain**: Real-time velocity modulation and Spacebar / MIDI CC64 sustain pedal.
- **Middle-C Navigator & Key Badges**: On-key Mac shortcut badges and Middle-C quick focus.

### 🎼 2. Polyphonic Instrument Synthesizers
Switch instantly between 12 realistic synthesized audio voices:
1. **Grand Piano**: Steinway-inspired acoustic concert piano voice.
2. **Electric Piano**: FM tine synthesizer with bell warmth.
3. **Organ**: Multi-drawbar additive synth.
4. **Synth Lead**: Dual sawtooth lead with filter sweep.
5. **Strings**: Warm polyphonic string ensemble.
6. **Guitar**: Plucked acoustic body resonance.
7. **Bass**: Punchy sub/analog synth bass.
8. **Violin**: Expressive solo string voice.
9. **Flute**: Airy sine-noise woodwind voice.
10. **Bell**: Crystalline metallic chime synth.
11. **Choir**: Multi-formant vocal pad.
12. **Ambient Pads**: Lush atmospheric decay pad.

### 🎶 3. Professional Piano Roll Sequencer
- FL Studio style note grid timeline across 4 bars.
- Add, drag-to-move, drag-to-resize, and right-click to delete notes.
- Snap-to-Grid (1/4, 1/8, 1/16, 1/32) & Quantize action.
- Velocity lane & live transport playhead animation.

### 🥁 4. 16-Step Drum Sequencer
- 8 Synthesized Drum Sound Tracks: Kick, Snare, Hi-Hat Closed, Hi-Hat Open, Clap, Tom, Crash, 808 Sub.
- Built-in drum kits powered by Tone.MembraneSynth, Tone.NoiseSynth, and Tone.MetalSynth.
- Preset patterns: House, Trap, Synthwave, Lo-Fi.

### 🎛️ 5. Master Audio Effects Rack
- **Studio Reverb**: Dattorro room decay & wet blend.
- **Stereo Ping-Pong Delay**: BPM-synced delay with feedback.
- **3-Band Equalizer**: Low, Mid, High dB controls.
- **Filter Sweep**: Lowpass/Highpass cutoff (20Hz - 20kHz) & resonance Q.
- **Overdrive & Distortion**: Drive control with wet mix.
- **Master Limiter & Compressor**: Gain staging to prevent audio clipping.

### 🎵 6. Scale & Chord Assistant
- **Circle of Fifths**: Interactive SVG diagram showing key signatures.
- **Scale Key Highlights**: 9 scale modes (Major, Minor, Pentatonic, Blues, Dorian, Phrygian, etc.) highlighted on the 88 keys.
- **Chord Builder**: Instant auditioning for triads, 7ths, diminished, and augmented chords.

### 🤖 7. AI Music Composition Suite
- **Internet Song Search & Key Generator**: Search ANY song online (Bollywood, Hollywood, Punjabi) to generate Mac keys.
- **AI Melody Generator**: Algorithmic melody creator based on scale, octave, and density.
- **AI Chord Generator**: Generates harmonic progressions for Pop, Jazz, Synthwave, and Lo-Fi.
- **AI Harmony Generator**: Auto-builds 3rd interval harmony layers.
- **AI Song Starter**: 1-Click creation of complete starter tracks.

### 📊 8. 60 FPS Real-Time Audio Visualizer
- Oscilloscope waveform time-domain display.
- 32-Bar Frequency Spectrum Analyzer with neon cyan-purple gradients.
- Audio-reactive particle canvas.

### 💾 9. Export & Cloud Backend
- Download standard `.mid` MIDI files for Ableton, FL Studio & Logic Pro.
- Export full `.json` project backups.
- Express API server (`/api/projects`, `/api/recordings`, `/api/ai`).
- Prisma Schema for PostgreSQL (`prisma/schema.prisma`).

---

## 📁 Project Structure

```
/
├── server/                   # Express + TypeScript Backend
│   └── index.ts              # REST API (projects, recordings, ai)
├── prisma/
│   └── schema.prisma         # Prisma Schema (User, Project, Recording, Preset)
├── src/
│   ├── audio/                # Audio Engine
│   │   ├── engine.ts         # Tone.js Master Bus & Audio Context
│   │   ├── instruments.ts    # 12 Instrument Synthesizers
│   │   ├── effects.ts        # Master Audio FX Chain
│   │   ├── drumEngine.ts     # 16-step Drum Synthesizers
│   │   └── recorder.ts       # Audio & MIDI File Exporter
│   ├── midi/
│   │   └── midiManager.ts    # Web MIDI API Handler
│   ├── store/
│   │   └── useStudioStore.ts # Zustand global store
│   ├── components/
│   │   ├── toolbar/          # Top Header Toolbar
│   │   ├── piano/            # 88-Key Virtual Piano & Auto-Player
│   │   ├── pianoroll/        # Piano Roll Sequencer
│   │   ├── drums/            # 16-Step Drum Machine
│   │   ├── fx/               # Master Audio FX Rack
│   │   ├── chords/           # Scale & Chord Assistant
│   │   ├── ai/               # AI Composition Suite
│   │   ├── visualizer/       # 60 FPS Audio Visualizer
│   │   ├── export/           # Project Export Modal
│   │   └── settings/         # Studio Settings Modal
│   ├── utils/
│   │   ├── musicTheory.ts    # 88 Keys, Scales, Songs & Mac Mappings
│   │   └── aiGenerators.ts   # Algorithmic Music Composition
│   ├── types/
│   │   └── index.ts          # TypeScript Type Definitions
│   ├── App.tsx               # Main Layout
│   └── main.tsx              # React Entry Point
├── package.json              # Project dependencies
├── tailwind.config.js        # Dark DAW theme configuration
└── vite.config.ts            # Vite build setup
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3005`** in your browser.

### 3. Run Express Backend API
```bash
npm run server
```
Backend API will run on **`http://localhost:5001`**.

---

## 📄 License
MIT License. Created for Piano Studio.
