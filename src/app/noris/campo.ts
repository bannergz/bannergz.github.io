/**
 * Un campo de girasoles al atardecer, dibujado en canvas.
 *
 * La idea que sostiene todo: el puntero es el sol. Las cabezas giran hacia
 * él —eso hace un girasol joven de verdad, se llama heliotropismo— y el
 * cielo cambia de hora según qué tan alto esté. Quien mira no mueve una
 * luz: mueve la tarde.
 *
 * Va aparte del componente para poder probarlo sin React y para que la
 * página se quede en lo suyo: el texto.
 */

/** El ángulo áureo, el que usa el girasol para acomodar sus semillas. Por
 *  eso el disco sale en espiral y no en anillos concéntricos. */
const ANGULO_AUREO = Math.PI * (3 - Math.sqrt(5));
const PETALOS = 21;

/** Las dos horas del día entre las que se interpola el cielo. */
const DIA: ReadonlyArray<readonly [number, number, number]> = [
  [62, 122, 196],
  [126, 168, 218],
  [190, 208, 226],
  [236, 226, 202],
  [232, 215, 180],
];
const OCASO: ReadonlyArray<readonly [number, number, number]> = [
  [74, 95, 158],
  [142, 113, 150],
  [196, 128, 94],
  [247, 220, 166],
  [242, 206, 150],
];
const PARADAS = [0, 0.38, 0.62, 0.82, 1];

interface Flor {
  /** Profundidad, 0 al fondo y 1 al frente. Manda tamaño, altura y bruma. */
  p: number;
  x: number;
  demora: number;
  largo: number;
  radio: number;
  fase: number;
  giro: number;
  cabeza: number;
}

interface Mota {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  fase: number;
}

export interface Campo {
  destruir(): void;
}

const azar = (a: number, b: number) => a + Math.random() * (b - a);
const topar = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const suave = (t: number) => 1 - Math.pow(1 - topar(t, 0, 1), 3);

function mezclar(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  k: number,
): string {
  const c = (i: number) => Math.round(a[i] + (b[i] - a[i]) * k);
  return `rgb(${c(0)},${c(1)},${c(2)})`;
}

function prefiereQuietud(): boolean {
  // jsdom no trae matchMedia, y el navegador viejo tampoco lo garantiza.
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function sembrarCampo(lienzo: HTMLCanvasElement): Campo {
  const ctx = lienzo.getContext("2d");
  // Sin contexto no hay nada que dibujar y tampoco nada que limpiar: pasa
  // en jsdom y en cualquier entorno sin canvas.
  if (!ctx) return { destruir: () => {} };

  const quieto = prefiereQuietud();

  let W = 0;
  let H = 0;
  let horizonte = 0;
  let cielo: CanvasGradient | null = null;
  let nivelPintado = -1;
  let flores: Flor[] = [];
  let motas: Mota[] = [];
  let sol = { x: 0, y: 0 };
  let cuadro = 0;
  let inicio = 0;

  function nuevaFlor(p: number, x: number, demora: number): Flor {
    return {
      p,
      x,
      demora,
      largo: (0.13 + p * 0.24) * H,
      radio: (0.013 + p * 0.038) * Math.min(W, H),
      fase: azar(0, Math.PI * 2),
      giro: azar(0.7, 1.3),
      cabeza: 0,
    };
  }

  function sembrar() {
    const cantidad = Math.round(topar(W / 34, 20, 42));
    flores = Array.from({ length: cantidad }, () =>
      nuevaFlor(Math.pow(Math.random(), 0.7), azar(-0.05, 1.05) * W, azar(0, 1600)),
    ).sort((a, b) => a.p - b.p);

    motas = Array.from({ length: 46 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.9,
      r: azar(0.8, 2.6),
      vx: azar(-0.16, 0.34),
      vy: azar(-0.14, -0.02),
      fase: azar(0, Math.PI * 2),
    }));
  }

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    // Dibujar en píxeles CSS deja el campo borroso en cualquier pantalla
    // retina, que hoy es casi cualquier teléfono.
    lienzo.width = Math.round(W * dpr);
    lienzo.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    horizonte = H * 0.42;
    nivelPintado = -1;
    sembrar();
    sol = { x: W * 0.72, y: horizonte * 0.78 };
  }

  /** Una racha cruza el campo de izquierda a derecha cada nueve segundos:
   *  las flores se doblan por tandas, no todas al mismo compás. */
  function viento(t: number, x: number): number {
    const brisa = Math.sin(t / 2600) * 0.3;
    const paso = ((t / 9000) % 1) * 1.7 - 0.35;
    const d = x / W - paso;
    return brisa + Math.exp(-(d * d) / 0.018) * Math.sin(t / 210) * 1.7;
  }

  function pintarCielo() {
    // 0 = sol en lo alto, mediodía; 1 = sol en el horizonte, ocaso.
    const escalon = Math.round(topar(sol.y / horizonte, 0, 1) * 40);
    if (escalon !== nivelPintado) {
      // Se rehace solo cuando el sol cambió de altura de verdad, no en cada
      // uno de los sesenta cuadros del segundo.
      nivelPintado = escalon;
      const k = escalon / 40;
      cielo = ctx!.createLinearGradient(0, 0, 0, H);
      PARADAS.forEach((parada, i) => cielo!.addColorStop(parada, mezclar(DIA[i], OCASO[i], k)));
    }
    ctx!.fillStyle = cielo!;
    ctx!.fillRect(0, 0, W, H);

    const halo = ctx!.createRadialGradient(sol.x, sol.y, 0, sol.x, sol.y, Math.max(W, H) * 0.45);
    halo.addColorStop(0, "rgba(255, 240, 192, 0.85)");
    halo.addColorStop(0.12, "rgba(255, 226, 158, 0.45)");
    halo.addColorStop(0.4, "rgba(255, 210, 135, 0.16)");
    halo.addColorStop(1, "rgba(255, 200, 120, 0)");
    ctx!.fillStyle = halo;
    ctx!.fillRect(0, 0, W, H);

    const r = Math.min(W, H) * 0.028;
    const disco = ctx!.createRadialGradient(sol.x, sol.y, 0, sol.x, sol.y, r);
    disco.addColorStop(0, "rgba(255, 253, 240, 0.98)");
    disco.addColorStop(0.6, "rgba(255, 240, 190, 0.9)");
    disco.addColorStop(1, "rgba(255, 226, 158, 0)");
    ctx!.fillStyle = disco;
    ctx!.beginPath();
    ctx!.arc(sol.x, sol.y, r, 0, Math.PI * 2);
    ctx!.fill();
  }

  function pintarFlor(f: Flor, t: number) {
    const nacida = quieto ? 1 : suave((t - f.demora) / 1400);
    if (nacida <= 0) return;

    const brote = suave(Math.min(1, nacida * 1.35));
    const abre = suave((nacida - 0.45) / 0.55);

    // La flor cercana pesa más y se dobla menos que la del fondo.
    const mecer = quieto
      ? 0
      : (viento(t, f.x) * 0.055 + Math.sin((t / 1500) * f.giro + f.fase) * 0.035) *
        (1.25 - f.p * 0.45);

    const baseY = horizonte + Math.pow(f.p, 1.15) * (H - horizonte) * 1.1;
    const alto = f.largo * brote;
    const cx = f.x + Math.sin(mecer) * alto * 0.55;
    const cy = baseY - alto;

    // Bruma de distancia: lo lejano se lava contra el cielo.
    ctx!.globalAlpha = 0.35 + f.p * 0.65;

    ctx!.beginPath();
    ctx!.moveTo(f.x, baseY);
    ctx!.quadraticCurveTo(f.x + Math.sin(mecer) * alto * 0.22, baseY - alto * 0.55, cx, cy);
    ctx!.strokeStyle = "#4B7A41";
    ctx!.lineWidth = Math.max(1.4, f.radio * 0.16);
    ctx!.lineCap = "round";
    ctx!.stroke();

    if (f.p > 0.35) {
      const hy = baseY - alto * 0.52;
      const hx = f.x + Math.sin(mecer) * alto * 0.2;
      for (const lado of [-1, 1]) {
        ctx!.beginPath();
        ctx!.moveTo(hx, hy);
        ctx!.quadraticCurveTo(
          hx + lado * f.radio * 1.5,
          hy - f.radio * 0.7,
          hx + lado * f.radio * 2.2,
          hy + f.radio * 0.15,
        );
        ctx!.quadraticCurveTo(hx + lado * f.radio * 1.4, hy + f.radio * 0.5, hx, hy);
        ctx!.fillStyle = "#436E3A";
        ctx!.fill();
      }
    }

    if (abre <= 0) {
      ctx!.globalAlpha = 1;
      return;
    }

    const meta = topar(Math.atan2(sol.x - cx, cy - sol.y) * 0.42, -0.62, 0.62);
    f.cabeza += (meta - f.cabeza) * (quieto ? 1 : 0.055);

    const r = f.radio * abre;
    ctx!.save();
    ctx!.translate(cx, cy);
    ctx!.rotate(f.cabeza + mecer * 0.5);
    // Escorzo: una cabeza girada se ve más angosta. Sin esto el giro parece
    // que la flor rueda, no que se voltea a mirar.
    ctx!.scale(Math.max(0.42, Math.cos(f.cabeza * 1.5)), 1);

    for (let i = 0; i < PETALOS; i++) {
      ctx!.save();
      ctx!.rotate(((Math.PI * 2) / PETALOS) * i);
      const largo = r * (1.62 + Math.sin(i * 2.3) * 0.1);
      const ancho = r * 0.3;
      const tinte = ctx!.createLinearGradient(0, -r * 0.4, 0, -largo);
      tinte.addColorStop(0, "#C06F05");
      tinte.addColorStop(0.45, "#F2A81C");
      tinte.addColorStop(1, "#FFD661");
      ctx!.beginPath();
      ctx!.moveTo(0, -r * 0.35);
      ctx!.quadraticCurveTo(-ancho, -largo * 0.6, 0, -largo);
      ctx!.quadraticCurveTo(ancho, -largo * 0.6, 0, -r * 0.35);
      ctx!.fillStyle = tinte;
      ctx!.fill();
      ctx!.restore();
    }

    ctx!.beginPath();
    ctx!.arc(0, 0, r * 0.62, 0, Math.PI * 2);
    const centro = ctx!.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.05, 0, 0, r * 0.62);
    centro.addColorStop(0, "#7A4620");
    centro.addColorStop(1, "#3D2010");
    ctx!.fillStyle = centro;
    ctx!.fill();

    // Las semillas en su espiral. Solo en las flores cercanas: en las del
    // fondo no se distinguiría y cuesta cuadros.
    if (f.p > 0.55) {
      const semillas = Math.round(70 * f.p);
      ctx!.fillStyle = "#8C5A2B";
      for (let i = 0; i < semillas; i++) {
        const rad = r * 0.6 * Math.sqrt(i / semillas);
        const ang = i * ANGULO_AUREO;
        ctx!.beginPath();
        ctx!.arc(Math.cos(ang) * rad, Math.sin(ang) * rad, Math.max(0.5, r * 0.035), 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    ctx!.restore();
    ctx!.globalAlpha = 1;
  }

  /** Polen a contraluz: se enciende cerca del sol y desaparece lejos. */
  function pintarMotas(t: number) {
    for (const m of motas) {
      if (!quieto) {
        m.x += m.vx + Math.sin(t / 1800 + m.fase) * 0.25;
        m.y += m.vy;
        if (m.y < -10) {
          m.y = H + 10;
          m.x = Math.random() * W;
        }
        if (m.x > W + 10) m.x = -10;
        if (m.x < -10) m.x = W + 10;
      }
      const d = Math.hypot(m.x - sol.x, m.y - sol.y) / (Math.max(W, H) * 0.5);
      const brillo = Math.max(0, 0.75 - d * 0.7);
      if (brillo <= 0.02) continue;
      ctx!.globalAlpha = brillo;
      ctx!.fillStyle = "#FFF3CE";
      ctx!.beginPath();
      ctx!.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  function pintarBruma() {
    // Sin esto la dedicatoria cae encima de tallos y hojas y todo compite.
    const bruma = ctx!.createLinearGradient(0, H * 0.58, 0, H);
    bruma.addColorStop(0, "rgba(247, 220, 166, 0)");
    bruma.addColorStop(0.55, "rgba(248, 226, 180, 0.42)");
    bruma.addColorStop(1, "rgba(249, 231, 191, 0.72)");
    ctx!.fillStyle = bruma;
    ctx!.fillRect(0, H * 0.58, W, H * 0.42);
  }

  function pintar(ahora: number) {
    const t = ahora - inicio;
    pintarCielo();
    for (const f of flores) pintarFlor(f, t);
    pintarMotas(t);
    pintarBruma();
    if (!quieto) cuadro = requestAnimationFrame(pintar);
  }

  function arrancar() {
    cancelAnimationFrame(cuadro);
    medir();
    inicio = performance.now();
    // Con movimiento reducido: un cuadro, el campo ya florecido y quieto.
    if (quieto) pintar(inicio);
    else cuadro = requestAnimationFrame(pintar);
  }

  function alMover(e: PointerEvent) {
    sol.x = e.clientX;
    sol.y = e.clientY;
  }

  function alTocar(e: PointerEvent) {
    if (quieto) return;
    const p = topar((e.clientY - horizonte) / (H - horizonte), 0.15, 1);
    flores.push(nuevaFlor(p, e.clientX, performance.now() - inicio));
    flores.sort((a, b) => a.p - b.p);
  }

  window.addEventListener("pointermove", alMover, { passive: true });
  window.addEventListener("pointerdown", alTocar, { passive: true });
  window.addEventListener("resize", arrancar);
  arrancar();

  return {
    destruir() {
      // Sin esto el bucle sigue corriendo después de salir de la página.
      cancelAnimationFrame(cuadro);
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("pointerdown", alTocar);
      window.removeEventListener("resize", arrancar);
    },
  };
}
