import express from 'express';
import cors from 'cors';

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

app.listen(PORT, () => {
  console.log(`🎵 Piano Studio Express Server running on http://localhost:${PORT}`);
});
