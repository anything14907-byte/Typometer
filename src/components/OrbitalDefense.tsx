import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Shield, Crosshair, Zap, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrbitalDefenseProps {
  onBack: () => void;
  playLaserSound?: () => void;
  playShockwaveSound?: () => void;
}

interface Asteroid {
  id: string;
  word: string;
  typedIndex: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  radius: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface LaserBeam {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  color: string;
}

const WORD_DICTIONARY = [
  'plasma', 'orbital', 'quantum', 'cipher', 'vector', 'matrix', 'reactor',
  'firewall', 'shield', 'telemetry', 'photon', 'laser', 'drone', 'overclock',
  'synapse', 'binary', 'hyper', 'crypto', 'sensor', 'stellar', 'core',
  'flux', 'gateway', 'packet', 'daemon', 'latency', 'bandwidth', 'pulse'
];

export const OrbitalDefense: React.FC<OrbitalDefenseProps> = ({
  onBack,
  playLaserSound,
  playShockwaveSound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [wave, setWave] = useState<number>(1);
  const [shield, setShield] = useState<number>(100);
  const [streak, setStreak] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>('');

  // Game state stored in refs for the 60fps canvas loop
  const asteroidsRef = useRef<Asteroid[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lasersRef = useRef<LaserBeam[]>([]);
  const screenShakeRef = useRef<number>(0);
  const activeAsteroidIdRef = useRef<string | null>(null);
  const lastSpawnTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  // Spawn an incoming cyber-asteroid
  const spawnAsteroid = useCallback((canvasWidth: number) => {
    const word = WORD_DICTIONARY[Math.floor(Math.random() * WORD_DICTIONARY.length)];
    const x = Math.random() * (canvasWidth - 140) + 70;
    const y = -30;
    const targetX = canvasWidth / 2;
    const targetY = 380; // Planet position
    const speed = 0.5 + Math.random() * 0.5 + (wave * 0.15);

    const colors = ['#00F0FF', '#A855F7', '#FF2A5F', '#10B981'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    asteroidsRef.current.push({
      id: `ast_${Date.now()}_${Math.random()}`,
      word,
      typedIndex: 0,
      x,
      y,
      targetX,
      targetY,
      speed,
      radius: 20 + word.length * 2,
      color,
    });
  }, [wave]);

  // Create explosion particles on impact
  const triggerExplosion = (x: number, y: number, color: string, count: number = 24) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1.5,
        color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.015,
      });
    }
  };

  // Trigger EMP shockwave vaporizing all on screen (on 25x streak)
  const triggerEmpShockwave = () => {
    playShockwaveSound?.();
    screenShakeRef.current = 18;
    asteroidsRef.current.forEach(ast => {
      triggerExplosion(ast.x, ast.y, '#00F0FF', 35);
    });
    asteroidsRef.current = [];
    activeAsteroidIdRef.current = null;
    setScore(s => s + 500);

    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#00F0FF', '#A855F7', '#FFFFFF']
      });
    } catch {}
  };

  // Primary animation & render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const planetX = width / 2;
      const planetY = height - 60;

      // Screen Shake translation
      ctx.save();
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - 0.7);
      }

      // Clear with dark trail fade
      ctx.fillStyle = '#05070A';
      ctx.fillRect(0, 0, width, height);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let s = 0; s < 40; s++) {
        const sx = (s * 47) % width;
        const sy = (s * 73 + Date.now() * 0.02) % height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Planetary Shield Base
      ctx.beginPath();
      ctx.arc(planetX, planetY + 80, 110, Math.PI, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = shield > 40 ? '#00F0FF' : '#FF2A5F';
      ctx.shadowBlur = 15;
      ctx.shadowColor = shield > 40 ? '#00F0FF' : '#FF2A5F';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Central planetary defense cannon
      ctx.beginPath();
      ctx.arc(planetX, planetY - 10, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00F0FF';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Spawn manager
      if (!gameOver && Date.now() - lastSpawnTimeRef.current > Math.max(1200, 3200 - wave * 300)) {
        if (asteroidsRef.current.length < 5 + wave) {
          spawnAsteroid(width);
          lastSpawnTimeRef.current = Date.now();
        }
      }

      // Render & Update Lasers
      for (let l = lasersRef.current.length - 1; l >= 0; l--) {
        const laser = lasersRef.current[l];
        laser.progress += 0.18;

        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.endX, laser.endY);
        ctx.strokeStyle = laser.color;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 16;
        ctx.shadowColor = laser.color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (laser.progress >= 1) {
          lasersRef.current.splice(l, 1);
        }
      }

      // Render & Update Asteroids
      for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
        const ast = asteroidsRef.current[i];
        const dx = ast.targetX - ast.x;
        const dy = ast.targetY - ast.y;
        const dist = Math.hypot(dx, dy);

        ast.x += (dx / dist) * ast.speed;
        ast.y += (dy / dist) * ast.speed;

        const isTargeted = activeAsteroidIdRef.current === ast.id;

        // Asteroid Body
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.radius, 0, Math.PI * 2);
        ctx.fillStyle = isTargeted ? 'rgba(0, 240, 255, 0.25)' : 'rgba(30, 41, 59, 0.7)';
        ctx.fill();
        ctx.lineWidth = isTargeted ? 2.5 : 1.5;
        ctx.strokeStyle = isTargeted ? '#00F0FF' : ast.color;
        ctx.shadowBlur = isTargeted ? 14 : 4;
        ctx.shadowColor = isTargeted ? '#00F0FF' : ast.color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Render Word Tag inside asteroid
        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';

        const typedPart = ast.word.slice(0, ast.typedIndex);
        const remainingPart = ast.word.slice(ast.typedIndex);

        // Highlight typed portion in emerald, remaining in white
        const totalWordWidth = ctx.measureText(ast.word).width;
        let startTextX = ast.x - totalWordWidth / 2;

        if (typedPart.length > 0) {
          ctx.fillStyle = '#10B981';
          ctx.fillText(typedPart, startTextX + ctx.measureText(typedPart).width / 2, ast.y + 5);
          startTextX += ctx.measureText(typedPart).width;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(remainingPart, startTextX + ctx.measureText(remainingPart).width / 2, ast.y + 5);

        // Impact with planetary shield
        if (dist < 35) {
          triggerExplosion(ast.x, ast.y, '#FF2A5F', 28);
          screenShakeRef.current = 12;
          asteroidsRef.current.splice(i, 1);
          if (activeAsteroidIdRef.current === ast.id) {
            activeAsteroidIdRef.current = null;
          }

          setShield(s => {
            const next = Math.max(0, s - 20);
            if (next <= 0) {
              setGameOver(true);
            }
            return next;
          });
          setStreak(0);
        }
      }

      // Render & Update Particles
      for (let p = particlesRef.current.length - 1; p >= 0; p--) {
        const part = particlesRef.current[p];
        part.x += part.vx;
        part.y += part.vy;
        part.alpha -= part.decay;

        if (part.alpha <= 0) {
          particlesRef.current.splice(p, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fillStyle = part.color;
        ctx.globalAlpha = Math.max(0, part.alpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = part.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameOver, wave, shield, spawnAsteroid]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameOver) return;
    const value = e.target.value.toLowerCase().trim();
    setCurrentInput(value);

    // If an asteroid is currently locked
    let targetAst = asteroidsRef.current.find(a => a.id === activeAsteroidIdRef.current);

    // If not locked, find first asteroid starting with this input
    if (!targetAst && value.length > 0) {
      targetAst = asteroidsRef.current.find(a => a.word.startsWith(value));
      if (targetAst) {
        activeAsteroidIdRef.current = targetAst.id;
      }
    }

    if (targetAst) {
      if (targetAst.word.startsWith(value)) {
        targetAst.typedIndex = value.length;

        // Check if word is completely typed
        if (value.length === targetAst.word.length) {
          // Fire Laser from cannon to asteroid
          const canvas = canvasRef.current;
          const cannonX = canvas ? canvas.width / 2 : 360;
          const cannonY = canvas ? canvas.height - 70 : 380;

          lasersRef.current.push({
            startX: cannonX,
            startY: cannonY,
            endX: targetAst.x,
            endY: targetAst.y,
            progress: 0,
            color: '#00F0FF',
          });

          playLaserSound?.();
          triggerExplosion(targetAst.x, targetAst.y, targetAst.color, 24);

          // Remove destroyed asteroid
          asteroidsRef.current = asteroidsRef.current.filter(a => a.id !== targetAst?.id);
          activeAsteroidIdRef.current = null;
          setCurrentInput('');

          const nextStreak = streak + 1;
          setStreak(nextStreak);
          setScore(s => s + (targetAst?.word.length || 5) * 15 * (1 + Math.floor(nextStreak / 10)));

          // Wave progression check (every 500 points)
          if (score > wave * 600) {
            setWave(w => w + 1);
          }

          // EMP Shockwave milestone at 25 streaks
          if (nextStreak > 0 && nextStreak % 25 === 0) {
            triggerEmpShockwave();
          }
        }
      } else {
        // Mistyped letter resets active locked progress
        targetAst.typedIndex = 0;
        activeAsteroidIdRef.current = null;
        setCurrentInput('');
        setStreak(0);
      }
    }
  };

  const restartGame = () => {
    asteroidsRef.current = [];
    particlesRef.current = [];
    lasersRef.current = [];
    activeAsteroidIdRef.current = null;
    setScore(0);
    setWave(1);
    setShield(100);
    setStreak(0);
    setGameOver(false);
    setCurrentInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full cyber-panel rounded-2xl p-6 border border-cyber-cyan/30 relative">
      {/* Top HUD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <h3 className="text-lg font-display font-extrabold text-white tracking-wider">
              ORBITAL DEFENSE // CANNON TELEMETRY
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Type incoming cyber-asteroid tags to discharge laser cannons. 25x streak unlocks EMP shockwave.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
          >
            Exit Game
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-3 mb-4 font-mono text-center">
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">SCORE</span>
          <div className="text-xl font-bold text-cyber-cyan">{score}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">WAVE</span>
          <div className="text-xl font-bold text-cyber-violet">WAVE {wave}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">STREAK</span>
          <div className="text-xl font-bold text-cyber-emerald">{streak}x</div>
        </div>
        <div className="p-2.5 rounded-lg bg-obsidian-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase">SHIELD INTEGRITY</span>
          <div className={`text-xl font-bold ${shield > 40 ? 'text-cyber-cyan' : 'text-cyber-crimson'}`}>
            {shield}%
          </div>
        </div>
      </div>

      {/* HTML5 Canvas Arena */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-obsidian-950 flex justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={420}
          className="w-full max-w-[720px] h-[420px] block cursor-crosshair"
          onClick={() => inputRef.current?.focus()}
        />

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-obsidian-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Shield className="w-16 h-16 text-cyber-crimson mb-3 animate-bounce" />
            <h4 className="text-2xl font-display font-black text-white text-glow-crimson mb-1">
              PLANETARY SHIELD COLLAPSE
            </h4>
            <p className="text-slate-400 font-mono text-xs mb-4">
              Final Telemetry Score: <strong className="text-cyber-cyan">{score}</strong> | Survived: <strong className="text-cyber-violet">Wave {wave}</strong>
            </p>
            <button
              onClick={restartGame}
              className="px-6 py-2.5 rounded-xl font-display text-sm font-bold bg-cyber-cyan text-obsidian-950 hover:bg-cyber-blue shadow-neon-cyan transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> REBOOT DEFENSE SYSTEM
            </button>
          </div>
        )}
      </div>

      {/* Dedicated Interactive Typing Input */}
      {!gameOver && (
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type matching asteroid keyword to target and fire..."
              className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-cyber-cyan/50 text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-cyber-cyan/60"
            />
            {streak >= 20 && (
              <span className="absolute right-3 top-3 text-xs font-mono text-cyber-amber flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> EMP READY AT 25x
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

