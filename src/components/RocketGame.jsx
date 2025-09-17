import React, { useRef, useEffect, useState } from "react";
import { CrashEngine, CrashEngineState } from "./CrashEngine";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

import rocketAnim from "./lotties/rocket.json";
import explosionAnim from "./lotties/explosion.json";
import countdownAnim from "./lotties/countdown.json";

export default function RocketGame() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const animRef = useRef(null);

  const [rocketFlying, setRocketFlying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [lastMultipliers, setLastMultipliers] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [rocketExplosion, setRocketExplosion] = useState(false);
  const [countdownActive, setCountdownActive] = useState(true);
  const [roundRunning, setRoundRunning] = useState(false);

  const [lineFadeOut, setLineFadeOut] = useState(false);
  const lastMultiplierRef = useRef(1);
  const [explosionAnimationProgress, setExplosionAnimationProgress] = useState(0);

  const getRandomCrashPoint = () => {
return 20
  };

  useEffect(() => {
    engineRef.current = new CrashEngine();

    const resizeCanvas = () => {
      const container = canvasRef.current.parentElement;
      if (container) {
        const width = container.clientWidth;
        const height = 400;
        setCanvasSize({ width, height });
        engineRef.current.onResize(width, height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    startCountdown();

    return () => {
      cancelAnimationFrame(animRef.current);
      engineRef.current.destroy();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const startCountdown = () => {
    setCountdownActive(true);
    setRoundRunning(false);

    setTimeout(() => {
      setCountdownActive(false);
      startRocket();
    }, 5000);
  };

  const getBaseTime = (multiplier) => {
    if (multiplier < 1.9) return 10000;
    if (multiplier < 3) {
      // плавный переход от 10000 -> 7000 между 1.9 и 3
      const t = (multiplier - 1.9) / (3 - 1.9);
      return 10000 + t * (7000 - 10000); // интерполяция
    }
    // после 3x уменьшаем на 500 за каждую единицу после 3, но не меньше 3000
    const extra = Math.floor(multiplier - 3) * 500;
    return Math.max(7000 - extra, 3000);
  };
  

  const tick = () => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.tick();

    // динамическое ускорение
    const baseTime = getBaseTime(engine.multiplier);
    engine.multiplier = 1 + Math.pow(engine.elapsedTime / baseTime, 0.95);    
    setCurrentMultiplier(engine.multiplier);

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    const { width, height } = canvasRef.current;

    // фон
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#0f0f0f");
    grad.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // траектория ракеты
    const start = { x: 0, y: engine.plotHeight };
    let end = engine.getElapsedPosition(engine.elapsedTime * 2);
    const maxHeight = 50;
    if (end.y < maxHeight) end.y = maxHeight;

    const amplitude = 120;
    const steps = 60;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = start.x + (end.x - start.x) * t;
      let y = start.y * (1 - t) + end.y * t - amplitude * 4 * t * (1 - t);
      y += 10 * Math.sin(x * 0.1 + engine.elapsedTime * 0.002);
      ctx.lineTo(x, y);
    }

    // эффект линии с мерцанием и перегревом
    const baseAlpha = lineFadeOut ? 1 - explosionAnimationProgress : 1;
    const flickerIntensity = engine.multiplier > 2 ? Math.min(engine.multiplier / 10, 1) : 0;
    const flicker = flickerIntensity > 0 ? 0.5 + 0.5 * Math.sin(engine.elapsedTime * 0.05 * flickerIntensity) : 1;
    const alpha = baseAlpha * flicker;
    const lineWidth = 6 + flickerIntensity * 3;

    let colorStart = `rgba(0,255,204,${alpha})`;
    let colorEnd = `rgba(0,179,255,${alpha})`;
    if (engine.multiplier > 6) {
      const over = Math.min((engine.multiplier - 5) / 14, 1);
      colorStart = `rgba(${Math.floor(0 + 255 * over)}, ${Math.floor(255 - 150 * over)}, 204, ${alpha})`;
      colorEnd = `rgba(${Math.floor(0 + 255 * over)}, ${Math.floor(179 - 179 * over)}, 255, ${alpha})`;
    }

    const lineGrad = ctx.createLinearGradient(0, 0, canvasSize.width, 0);
    lineGrad.addColorStop(0, colorStart);
    lineGrad.addColorStop(1, colorEnd);

    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = 20 * alpha;
    ctx.shadowColor = "#00ffcc";
    ctx.stroke();
    ctx.shadowBlur = 0;

    // множитель
    ctx.font = "bold 42px Arial";
    ctx.fillStyle = "#ff4d4f";
    const labelText = engine.multiplier.toFixed(2) + "x";
    const textSize = ctx.measureText(labelText);
    ctx.fillText(labelText, canvasSize.width / 2 - textSize.width / 2, 60);

    if (
      engine.crashPoint &&
      engine.multiplier >= engine.crashPoint &&
      !rocketExplosion
    ) {
      endRound(engine.crashPoint);
    }

    animRef.current = requestAnimationFrame(tick);
  };

  const startRocket = () => {
    setRoundRunning(true);
    setRocketFlying(true);
    setRocketExplosion(false);
    setLineFadeOut(false);
    setExplosionAnimationProgress(0);
    lastMultiplierRef.current = 1;

    const engine = engineRef.current;
    engine.startTime = Date.now();
    engine.state = CrashEngineState.Active;
    engine.crashPoint = getRandomCrashPoint();

    tick();
  };

  const endRound = (finalMultiplier) => {
    const engine = engineRef.current;
    engine.state = CrashEngineState.Over;
    setRocketFlying(false);
    setRocketExplosion(true);
    setLineFadeOut(true);
    setExplosionAnimationProgress(0);

    const startTime = performance.now();
    const duration = 2000;

    const animate = (time) => {
      const t = Math.min((time - startTime) / duration, 1);
      setExplosionAnimationProgress(t);
      if (t < 1) requestAnimationFrame(animate);
      else setRocketExplosion(false);
    };
    requestAnimationFrame(animate);

    setLastMultipliers((prev) => [
      finalMultiplier.toFixed(2),
      ...prev.slice(0, 19),
    ]);

    cancelAnimationFrame(animRef.current);

    setTimeout(() => startCountdown(), 2000);
  };

  const rocketStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 120,
    height: 120,
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 640,
        margin: "0 auto",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 15,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: canvasSize.height,
          borderRadius: 12,
          overflow: "hidden",
          background: "#1a1a1a",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            width: canvasSize.width + "px",
            height: canvasSize.height + "px",
            display: "block",
          }}
        />

        <AnimatePresence>
          {countdownActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ ...rocketStyle, filter: "brightness(0) invert(1)" }}
            >
              <Lottie animationData={countdownAnim} loop={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {rocketFlying && !rocketExplosion && !countdownActive && (
          <Lottie animationData={rocketAnim} loop style={rocketStyle} />
        )}

        <AnimatePresence>
          {rocketExplosion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={rocketStyle}
            >
              <Lottie animationData={explosionAnim} loop={false} />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            flexDirection: "row-reverse",
            gap: 6,
          }}
        >
          <AnimatePresence>
            {lastMultipliers.map((m, i) => (
              <motion.div
                key={i + "-" + m}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "#646cff33",
                  padding: "4px 8px",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                x{m}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
