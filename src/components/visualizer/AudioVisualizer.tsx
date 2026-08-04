import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../../audio/engine';
import { Maximize2 } from 'lucide-react';

export const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3 + 1,
        color: i % 2 === 0 ? '#06b6d4' : '#8b5cf6',
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const waveData = audioEngine.getWaveformData();
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06b6d4';

      const sliceWidth = canvas.width / waveData.length;
      let x = 0;

      for (let i = 0; i < waveData.length; i++) {
        const v = waveData[i];
        const y = (v + 1) * (canvas.height / 4);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();

      const fftData = audioEngine.getFftData();
      const numBars = 32;
      const barWidth = (canvas.width / numBars) - 6;

      for (let i = 0; i < numBars; i++) {
        const rawDb = fftData[i] || -100;
        const normalized = Math.max(0, (rawDb + 100) / 100);
        const barHeight = normalized * (canvas.height / 2.5);

        const bx = i * (barWidth + 6) + 3;
        const by = canvas.height - barHeight - 20;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, by);
        grad.addColorStop(0, '#8b5cf6');
        grad.addColorStop(1, '#ec4899');

        ctx.fillStyle = grad;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#8b5cf6';
        ctx.fillRect(bx, by, barWidth, barHeight);
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#080a0f] text-slate-100 select-none p-4 overflow-hidden relative">
      <div className="bg-studio-surface/90 border border-studio-border rounded-xl p-4 mb-4 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-synth-cyan to-synth-purple rounded-lg shadow-md">
            <Maximize2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">60 FPS REAL-TIME AUDIO VISUALIZER</h2>
            <p className="text-xs text-slate-400">Oscilloscope Waveform, Spectrum Analyzer & Particle Canvas</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-studio-surface/80 border border-studio-border rounded-xl overflow-hidden relative shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
