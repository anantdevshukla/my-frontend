import React, { useEffect, useRef } from 'react';

export default function InteractiveLabBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, isDown: false });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count based on screen area
    const particleCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles = [];

    const colors = [
      { r: 24, g: 199, b: 122 },  // Emerald (#18C77A)
      { r: 72, g: 245, b: 163 },  // Mint (#48F5A3)
      { r: 155, g: 239, b: 206 }, // Pale Mint (#9BEFCE)
      { r: 0, g: 220, b: 200 },   // Cyan-teal
    ];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
        this.y = initial ? Math.random() * height : Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2.2 + 1.0;
        this.baseRadius = this.radius;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.25;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.mass = this.radius * 2;
      }

      update() {
        // Natural floating pulse
        this.pulseAngle += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.4;

        // Position update
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce / wrap
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        // Interactive mouse interaction (fluid repulsion / excitation)
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 160;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 0.8;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force * 0.35;
          this.vy -= Math.sin(angle) * force * 0.35;
          this.alpha = Math.min(0.9, this.alpha + 0.08);
        } else {
          // Friction to settle back to natural drift
          this.vx *= 0.985;
          this.vy *= 0.985;
          if (Math.abs(this.vx) < 0.15) this.vx = (Math.random() - 0.5) * 0.35;
          if (Math.abs(this.vy) < 0.15) this.vy = (Math.random() - 0.5) * 0.35;
        }

        // Ripple interaction (shockwaves push particles)
        ripplesRef.current.forEach((rip) => {
          const rdx = this.x - rip.x;
          const rdy = this.y - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const diff = Math.abs(rdist - rip.currentRadius);
          if (diff < 30) {
            const shock = (1 - diff / 30) * (1 - rip.progress) * 0.8;
            const angle = Math.atan2(rdy, rdx);
            this.vx += Math.cos(angle) * shock;
            this.vy += Math.sin(angle) * shock;
          }
        });
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.5)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Window event listeners
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handlePointerLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handlePointerDown = (e) => {
      mouseRef.current.isDown = true;
      // Add spectral expansion wave
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        currentRadius: 5,
        maxRadius: Math.min(width, height) * 0.38,
        speed: 4.5,
        progress: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
      if (ripplesRef.current.length > 8) ripplesRef.current.shift();
    };

    const handlePointerUp = () => {
      mouseRef.current.isDown = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Laser scan beam position
    let laserY = 0;
    const laserSpeed = 1.2;

    // Animation Loop
    const render = () => {
      // Smooth cursor lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient cursor glow tracker
      if (mouseRef.current.x > -500) {
        const radGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          260
        );
        radGlow.addColorStop(0, 'rgba(24, 199, 122, 0.09)');
        radGlow.addColorStop(0.5, 'rgba(13, 43, 32, 0.04)');
        radGlow.addColorStop(1, 'rgba(6, 26, 20, 0)');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw sweeping hyperspectral laser beam
      laserY = (laserY + laserSpeed) % (height + 200);
      const beamY = laserY - 100;
      if (beamY > 0 && beamY < height) {
        const beamGrad = ctx.createLinearGradient(0, beamY - 15, 0, beamY + 15);
        beamGrad.addColorStop(0, 'rgba(24, 199, 122, 0)');
        beamGrad.addColorStop(0.5, 'rgba(72, 245, 163, 0.07)');
        beamGrad.addColorStop(1, 'rgba(24, 199, 122, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, beamY - 15, width, 30);

        // Thin laser line
        ctx.beginPath();
        ctx.moveTo(0, beamY);
        ctx.lineTo(width, beamY);
        ctx.strokeStyle = 'rgba(72, 245, 163, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Update & Draw Shockwave / Spectral Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        rip.currentRadius += rip.speed;
        rip.progress = rip.currentRadius / rip.maxRadius;

        if (rip.progress >= 1) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        const ripAlpha = (1 - rip.progress) * 0.35;

        // Inner & Outer ripple rings
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rip.color.r}, ${rip.color.g}, ${rip.color.b}, ${ripAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(0, rip.currentRadius - 12), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rip.color.r}, ${rip.color.g}, ${rip.color.b}, ${ripAlpha * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 4. Update and Connect Particles with Laser Filaments
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxConnectDist = 120;

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(72, 245, 163, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Interactive WebGL/Canvas2D Particle & Optical Laser Field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80 transition-opacity duration-500"
      />

      {/* 2. Floating Ambient Laboratory Nebulae Orbs */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-[#18C77A]/15 via-[#0D2B20]/20 to-transparent rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[#48F5A3]/10 via-[#0A241B]/25 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-[#18C77A]/12 via-[#0D2B20]/15 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* 3. Subtle Laboratory Grid Overlay with Digital Ticks */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(24,199,122,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,199,122,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-70" />

      {/* 4. Ambient Top Vignette for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(24,199,122,0.12),rgba(6,26,20,0))] pointer-events-none" />
    </div>
  );
}
