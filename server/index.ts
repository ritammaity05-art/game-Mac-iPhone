import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const inMemoryProjects: any[] = [];
const inMemoryRecordings: any[] = [];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Piano Studio API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, projects: inMemoryProjects });
});

app.post('/api/projects', (req, res) => {
  const { title, bpm, instrument, notesJson, drumsJson, fxSettings } = req.body;
  const newProject = {
    id: `proj_${Date.now()}`,
    title: title || 'Untitled Project',
    bpm: bpm || 120,
    instrument: instrument || 'grand-piano',
    notesJson: notesJson || '[]',
    drumsJson: drumsJson || '[]',
    fxSettings: fxSettings || '{}',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryProjects.unshift(newProject);
  res.status(201).json({ success: true, project: newProject });
});

app.post('/api/recordings', (req, res) => {
  const { title, duration, audioUrl, midiData } = req.body;
  const newRec = {
    id: `rec_${Date.now()}`,
    title: title || 'New Recording',
    duration: duration || 0,
    audioUrl,
    midiData,
    createdAt: new Date().toISOString(),
  };
  inMemoryRecordings.unshift(newRec);
  res.status(201).json({ success: true, recording: newRec });
});

app.post('/api/ai/generate-melody', (req, res) => {
  const { scale = 'C Major', bpm = 120, lengthInBars = 4 } = req.body;
  
  const scaleNotes: Record<string, string[]> = {
    'C Major': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    'A Minor': ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
    'G Major': ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4'],
    'F Major': ['F3', 'G3', 'A3', 'Bb3', 'C4', 'D4', 'E4', 'F4'],
  };

  const pool = scaleNotes[scale] || scaleNotes['C Major'];
  const generatedNotes = [];
  const totalSubdivisions = lengthInBars * 16;

  for (let step = 0; step < totalSubdivisions; step += Math.floor(Math.random() * 3 + 1) * 2) {
    const randomNote = pool[Math.floor(Math.random() * pool.length)];
    const duration = [0.25, 0.5, 1.0][Math.floor(Math.random() * 3)];
    generatedNotes.push({
      id: `ai_note_${step}_${Date.now()}`,
      note: randomNote,
      time: step * 0.25,
      duration,
      velocity: Math.floor(Math.random() * 40 + 70),
    });
  }

  res.json({ success: true, notes: generatedNotes });
});

app.post('/api/ai/generate-chords', (req, res) => {
  const { style = 'Pop', rootNote = 'C' } = req.body;
  const progression = [
    { root: `${rootNote}4`, type: 'Maj', notes: [`${rootNote}4`, 'E4', 'G4'] },
    { root: 'G4', type: 'Maj', notes: ['G4', 'B4', 'D5'] },
    { root: 'A4', type: 'min', notes: ['A4', 'C5', 'E5'] },
    { root: 'F4', type: 'Maj', notes: ['F4', 'A4', 'C5'] },
  ];

  res.json({ success: true, style, progression });
});

app.listen(PORT, () => {
  console.log(`🎵 Piano Studio Express Server running on http://localhost:${PORT}`);
});
