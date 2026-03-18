"use client";

import { useEffect, useRef } from "react";

// Dibuja una flor amarilla tipo girasol
function drawSunflower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // Pétalos
  for (let i = 0; i < 16; i++) {
    ctx.save();
    ctx.rotate((2 * Math.PI / 16) * i);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.7, size * 0.18, size * 0.5, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFD600";
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.restore();
  }
  // Centro
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.28, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFB300";
  ctx.fill();
  ctx.restore();
}



export default function NorisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    // Generar flores animadas
    const flowers = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7 + height * 0.15,
      size: 38 + Math.random() * 22,
      angle: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.4,
      sway: Math.random() * Math.PI * 2,
    }));

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Fondo suave
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#fffde7");
      grad.addColorStop(1, "#fff9c4");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      flowers.forEach((flower, i) => {
        // Animación de balanceo y flotación
        const sway = Math.sin(Date.now() / 1200 + flower.sway + i) * 0.18;
        const float = Math.sin(Date.now() / 1800 + i) * 8;
        drawSunflower(
          ctx,
          flower.x + Math.sin(Date.now() / 900 + i) * 6,
          flower.y + float,
          flower.size,
          sway
        );
      });

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, background: "#fffde7" }}>
      <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh", display: "block" }} />
      <div
        style={{
          position: "absolute",
          top: 'min(40px, 6vw)',
          width: "100%",
          textAlign: "center",
          fontSize: 'clamp(1.2rem, 5vw, 2.2rem)',
          color: "#FFD600",
          fontWeight: "bold",
          textShadow: "1px 1px 8px #fff",
          pointerEvents: 'none',
        }}
      >
        Flores para ti por siempre, mi amorcita bella, te amo ♥ 🌻
      </div>
    </div>
  );
}
