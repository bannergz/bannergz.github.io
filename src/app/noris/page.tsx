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

      // Texto centrado al medio
      ctx.save();
      ctx.font = "bold 2.2rem Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFD600";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 10;
      const text = "Flores para ti por siempre mi amorcita bella, te amo ♥";
      const textX = width / 2;
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.restore();

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, background: "#fffde7" }}>
      <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh", display: "block" }} />
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontSize: 32, color: "#FFD600", fontWeight: "bold", textShadow: "1px 1px 8px #fff" }}>
        Para ti, Noris: ¡Feliz día de las flores amarillas! 🌻
      </div>
    </div>
  );
}
