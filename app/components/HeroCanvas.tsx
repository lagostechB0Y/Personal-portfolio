'use client';

import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // Simple animated gradient / particles for hero background (light-weight)
    const particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = [];
    const COUNT = 18;

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 20 + Math.random() * 40,
          hue: 200 + Math.random() * 50
        });
      }
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // subtle radial ambient
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, 'rgba(37,99,235,0.06)');
      g.addColorStop(1, 'rgba(2,6,23,0.02)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `hsla(${p.hue},85%,60%,0.14)`);
        grad.addColorStop(1, `hsla(${p.hue},85%,60%,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      initParticles();
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(draw);
    }

    start();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  return <canvas id="hero-canvas" ref={canvasRef} style={{ width: '100%', height: '100%' }} aria-hidden />;
}
