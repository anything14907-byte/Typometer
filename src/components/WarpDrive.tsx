import React, { useRef, useEffect, useState } from 'react';
import { Rocket, Zap, AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface WarpDriveProps {
  onBack: () => void;
  playKeypress?: (c: string) => void;
  playError?: () => void;
}

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

const PHRASES = [
  "warp drive online",
  "engage faster than light",
  "trans-warp conduit established",
  "stellar drift compensated",
  "relativistic velocity sustained",
  "tachyon emission nominal",
  "gravitational slingshot active",
  "quantum field harmonics aligned",
  "hyperspace jump coordinates locked",
  "plasma injection at maximum"
];

export const WarpDrive: React.FC<WarpDriveProps> = ({
  onBack,
  playKeypress,
  playError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [warpFactor, setWarpFactor] = useState<number>(1.0);
  const [hullIntegrity, setHullIntegrity] = useState<number>(100);
  const [streak, setStreak] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const phrase = PHRASES[currentPhraseIndex];
  const warpVelocityRef = useRef<number>(2);
  const starsRef = useRef<Star[]>([]);

  // Initialize Starfield
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * 1000 + 1,
        pz: 1000,
      });
    }
    starsRef.current = stars;
  }, []);

  // 3D Starfield Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Dark trail for hyperspace blur
      ctx.fillStyle = warpVelocityRef.current > 12 ? 'rgba(5, 7, 10, 0.4)' : 'rgba(5, 7, 10, 0.7)';
      ctx.fillRect(0, 0, width, height);

      // Render warp rings
      if (warpVelocityRef.current > 8) {
        ctx.beginPath();
        ctx.arc(cx, cy, 140 + Math.sin(Date.now() * 0.01) * 20, 0, Math.PI * 2);
        ctx.strokeStyle = streak >= 15 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Update & Draw 3D Stars
      const speed = warpVelocityRef.current;

      starsRef.current.forEach(star => {
        star.pz = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.z = 1000;
          star.pz = 1000;
          star.x = (Math.random() - 0.5) * 1600;
          star.y = (Math.random() - 0.5) * 1600;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        const pk = 250 / star.pz;
        const prevX = star.x * pk + cx;
        const prevY = star.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const brightness = Math.min(1, (1000 - star.z) / 800);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);

          // Star color shifts to neon violet / cyan at hyperspace
          if (speed > 14) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${brightness})`;
          } else {
            ctx.strokeStyle = `rgba(0, 240, 255, ${brightness})`;
          }

          ctx.lineWidth = Math.max(1, (1000 - star.z) / 250);
          ctx.stroke();
        }
      });

      // Slowly decay warp velocity if user stops typing
      if (!gameOver) {
        warpVelocityRef.current = Math.max(2, warpVelocityRef.current - 0.03);
        setWarpFactor(parseFloat((warpVelocityRef.current / 3).toFixed(1)));
        setDistanceKm(d => d + Math.round(warpVelocityRef.current * 12));

        // Hull destabilizes if crawling below threshold
        if (warpVelocityRef.current <= 2.2) {
          setHullIntegrity(h => {
            const next = Math.max(0, h - 0.08);
            if (next <= 0) setGameOver(true);
            return parseFloat(next.toFixed(1));
          });
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameOver, streak]);

  // Keystroke listener for warp pilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'Tab' || e.key === 'Escape') return;

      const expected = phrase[charIndex];
      if (e.key === expected) {
        playKeypress?.(e.key);
        // Accelerate warp speed
        warpVelocityRef.current = Math.min(22, warpVelocityRef.current + 1.2);
        setStreak(s => s + 1);

        const nextChar = charIndex + 1;
        if (nextChar >= phrase.length) {
          // Completed current phrase
          setCurrentPhraseIndex(p => (p + 1) % PHRASES.length);
          setCharIndex(0);
          setHullIntegrity(h => Math.min(100, h + 8));
        } else {
          setCharIndex(nextChar);
        }
      } else if (e.key.length === 1) {
        playError?.();
        // Stumble reduces warp velocity
        warpVelocityRef.current = Math.max(1.8, warpVelocityRef.current - 2.5);
        setStreak(0);
        setHullIntegrity(h => {
          const next = Math.max(0, h - 4);
          if (next <= 0) setGameOver(true);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [charIndex, phrase, gameOver, playKeypress, playError]);

  const restartWarp = () => {
    warpVelocityRef.current = 4;
    setWarpFactor(1.3);
    setHullIntegrity(100);
    setStreak(0);
    setDistanceKm(0);
    setCharIndex(0);
    setCurrentPhraseIndex(0);
    setGameOver(false);
  };

  return (
    <div className="w-full cyber-panel rounded-2xl p-6 border border-cyber-cyan/30 relative">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyber-violet animate-pulse" />
            <h3 className="text-lg font-display font-extrabold text-white tracking-wider">
              WARP DRIVE // VELOCITY TUNNEL
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Type continuously to maintain warp velocity. Stalling causes hull destabilization.
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return
        </button>
      </div>

      {/* Telemetry Readouts */}
      <div className="grid grid-cols-4 gap-3 mb-4 font-mono text-center">
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">WARP FACTOR</span>
          <div className="text-xl font-bold text-cyber-cyan">{warpFactor} W</div>
        </div>
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">DISTANCE</span>
          <div className="text-xl font-bold text-cyber-violet">{distanceKm.toLocaleString()} KM</div>
        </div>
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">STREAK</span>
          <div className="text-xl font-bold text-cyber-emerald">{streak}x</div>
        </div>
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">HULL INTEGRITY</span>
          <div className={`text-xl font-bold ${hullIntegrity > 40 ? 'text-cyber-cyan' : 'text-cyber-crimson'}`}>
            {Math.round(hullIntegrity)}%
          </div>
        </div>
      </div>

      {/* 3D Starfield Tunnel Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-obsidian-950 flex justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={380}
          className="w-full max-w-[720px] h-[380px] block"
        />

        {/* Warp HUD Overlay */}
        <div className="absolute top-4 left-6 right-6 flex justify-between items-center pointer-events-none">
          <div className="text-xs font-mono text-slate-400 bg-obsidian-950/70 px-2.5 py-1 rounded border border-slate-800">
            {streak >= 15 ? (
              <span className="text-cyber-violet font-bold animate-pulse">⚡ HYPERSPACE OVERDRIVE ACTIVE</span>
            ) : (
              <span>CRUISE CADENCE</span>
            )}
          </div>
        </div>

        {/* Active Target Phrase to Type */}
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-obsidian-950/85 backdrop-blur-md border border-cyber-cyan/40 text-center font-mono text-xl sm:text-2xl tracking-wider">
          {phrase.split('').map((ch, idx) => {
            let color = 'text-slate-500';
            if (idx < charIndex) {
              color = 'text-cyber-emerald font-bold';
            } else if (idx === charIndex) {
              color = 'text-cyber-cyan underline';
            }
            return (
              <span key={idx} className={color}>
                {ch}
              </span>
            );
          })}
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-obsidian-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-cyber-crimson mb-3 animate-bounce" />
            <h4 className="text-2xl font-display font-black text-white text-glow-crimson mb-1">
              WARP STALL // HULL BREACH
            </h4>
            <p className="text-slate-400 font-mono text-xs mb-4">
              Velocity collapsed below threshold. Travelled: <strong className="text-cyber-cyan">{distanceKm} KM</strong>
            </p>
            <button
              onClick={restartWarp}
              className="px-6 py-2.5 rounded-xl font-display text-sm font-bold bg-cyber-cyan text-obsidian-950 hover:bg-cyber-blue shadow-neon-cyan transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> RE-ENGAGE WARP CORE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

