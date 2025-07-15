import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
  const {
    particleCount = 700,
    rangeY = 100,
    baseHue = 220,
    baseSpeed = 0.0,
    rangeSpeed = 1.5,
    baseRadius = 1,
    rangeRadius = 2,
    backgroundColor = "#000000",
    children,
    className,
    containerClassName
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const baseTTL = 50;
  const rangeTTL = 150;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  
  const noise3D = createNoise3D();
  const particleProps = useRef<Float32Array>(new Float32Array(particlePropsLength));
  const center = useRef<[number, number]>([0, 0]);
  const tick = useRef(0);

  // Constants
  const HALF_PI = 0.5 * Math.PI;
  const TAU = 2 * Math.PI;
  const TO_RAD = Math.PI / 180;

  // Utility functions
  const rand = (n: number) => n * Math.random();
  const randRange = (n: number) => n - rand(2 * n);
  const fadeInOut = (t: number, m: number) => Math.abs(((t + 0.5 * m) % m) - 0.5 * m) / (0.5 * m);
  const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;

  const initParticle = (i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = rand(canvas.width);
    const y = (center.current[1] ?? 0) + randRange(rangeY);
    const ttl = baseTTL + rand(rangeTTL);
    const speed = baseSpeed + rand(rangeSpeed);
    const radius = baseRadius + rand(rangeRadius);
    const hue = baseHue + rand(rangeHue);

    particleProps.current.set([x, y, 0, 0, 0, ttl, speed, radius, hue], i);
  };

  const initParticles = () => {
    tick.current = 0;
    particleProps.current = new Float32Array(particlePropsLength);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const i2 = i + 1, i3 = i + 2, i4 = i + 3, i5 = i + 4, i6 = i + 5, i7 = i + 6, i8 = i + 7, i9 = i + 8;
    
    const x = particleProps.current[i] ?? 0;
    const y = particleProps.current[i2] ?? 0;
    const n = noise3D(x * xOff, y * yOff, tick.current * zOff) * noiseSteps * TAU;
    const vx = lerp(particleProps.current[i3] ?? 0, Math.cos(n), 0.5);
    const vy = lerp(particleProps.current[i4] ?? 0, Math.sin(n), 0.5);
    const life = (particleProps.current[i5] ?? 0) + 1;
    const ttl = particleProps.current[i6] ?? 0;
    const speed = particleProps.current[i7] ?? 0;
    const x2 = x + vx * speed;
    const y2 = y + vy * speed;
    const radius = particleProps.current[i8] ?? 0;
    const hue = particleProps.current[i9] ?? 0;

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    particleProps.current[i] = x2;
    particleProps.current[i2] = y2;
    particleProps.current[i3] = vx;
    particleProps.current[i4] = vy;
    particleProps.current[i5] = life;

    if (x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0 || life > ttl) {
      initParticle(i);
    }
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick.current++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }

    // Glow effect
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    animationFrameId.current = requestAnimationFrame(() => draw(canvas, ctx));
  };

  const setup = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    center.current = [0.5 * canvas.width, 0.5 * canvas.height];

    initParticles();
    draw(canvas, ctx);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    center.current = [0.5 * canvas.width, 0.5 * canvas.height];
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full", containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
      >
        <canvas ref={canvasRef} />
      </motion.div>

      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};
