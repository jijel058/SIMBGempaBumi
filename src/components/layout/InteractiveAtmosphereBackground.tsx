import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
}

interface SeismicRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const InteractiveAtmosphereBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2
  });
  const ringsRef = useRef<SeismicRing[]>([]);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count (fewer on mobile for 60fps performance)
    const isMobile = width < 768;
    const particleCount = isMobile ? 30 : 75;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    // Spawn seismic wave ring on click/touch
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      ringsRef.current.push({
        x: clientX,
        y: clientY,
        radius: 4,
        maxRadius: Math.random() * 140 + 100,
        alpha: 0.7,
        color: Math.random() > 0.4 ? 'rgba(16, 185, 129, ' : 'rgba(52, 211, 153, '
      });

      // Keep max 6 active rings
      if (ringsRef.current.length > 6) {
        ringsRef.current.shift();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    // Periodic ambient seismic ripple
    const ambientRippleInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        ringsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 5,
          maxRadius: Math.random() * 120 + 80,
          alpha: 0.35,
          color: 'rgba(5, 150, 105, '
        });
      }
    }, 4500);

    let tick = 0;

    const render = () => {
      tick++;

      // Smooth mouse follow (spring lag for parallax feel)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // 1. Dynamic Emerald / Aurora Light Gradient following mouse
      const auroraGradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        10,
        mouseRef.current.x,
        mouseRef.current.y,
        width * 0.65
      );

      if (isDark) {
        auroraGradient.addColorStop(0, 'rgba(16, 185, 129, 0.09)');
        auroraGradient.addColorStop(0.35, 'rgba(5, 150, 105, 0.05)');
        auroraGradient.addColorStop(0.7, 'rgba(4, 120, 87, 0.02)');
        auroraGradient.addColorStop(1, 'rgba(10, 15, 13, 0)');
      } else {
        auroraGradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        auroraGradient.addColorStop(0.4, 'rgba(52, 211, 153, 0.03)');
        auroraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      ctx.fillStyle = auroraGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Decorative Geographic Coordinates & Radar Grid (Subtle, never obstructive)
      ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.035)' : 'rgba(5, 150, 105, 0.04)';
      ctx.lineWidth = 1;

      // Vertical longitudes
      const gridStep = isMobile ? 120 : 180;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal latitudes
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Decorative Crosshairs in four corners
      const drawCrosshair = (cx: number, cy: number) => {
        ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.12)' : 'rgba(5, 150, 105, 0.12)';
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy);
        ctx.lineTo(cx + 10, cy);
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(cx, cy + 10);
        ctx.stroke();
      };
      drawCrosshair(40, 100);
      drawCrosshair(width - 40, 100);
      drawCrosshair(width / 2, height - 60);

      // 3. Render and Update Seismic Ripple Wave Rings
      for (let i = ringsRef.current.length - 1; i >= 0; i--) {
        const ring = ringsRef.current[i];
        ring.radius += 1.8;
        ring.alpha -= 0.009;

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          ringsRef.current.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `${ring.color}${ring.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Second inner wave
        if (ring.radius > 20) {
          ctx.strokeStyle = `${ring.color}${ring.alpha * 0.5})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius * 0.7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 4. Floating Atmospheric Dust & Starlight Particles
      particles.forEach(p => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulsing twinkle
        p.alpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed) * 0.2;
        p.alpha = Math.max(0.08, Math.min(0.8, p.alpha));

        // Parallax offset relative to mouse
        const parallaxX = (mouseRef.current.x - width / 2) * 0.012;
        const parallaxY = (mouseRef.current.y - height / 2) * 0.012;

        ctx.fillStyle = isDark
          ? `rgba(110, 231, 183, ${p.alpha})`
          : `rgba(5, 150, 105, ${p.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x + parallaxX, p.y + parallaxY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      clearInterval(ambientRippleInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Fallback CSS Radial Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-emerald-950/10 dark:via-emerald-950/10 dark:to-earth-dark" />
      {/* Dynamic Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
};

