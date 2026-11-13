import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';

type SprintPhase = 'warmup' | 'focus' | 'cooldown';

const PHASE_CONFIG: Record<SprintPhase, { name: string; durationSec: number; color: string; desc: string }> = {
  warmup: {
    name: 'SYNAPSE WARMUP',
    durationSec: 5 * 60,
    color: '#38BDF8',
    desc: 'Gentle cadence calibration and hand dexterity warmup drills'
  },
  focus: {
    name: 'DEEP FOCUS SPRINT',
    durationSec: 25 * 60,
    color: '#00F0FF',
    desc: 'Uninterrupted flow-state session with maximum typing efficiency'
  },
  cooldown: {
    name: 'REFLEX COOLDOWN',
    durationSec: 5 * 60,
    color: '#10B981',
    desc: 'Wrist relief, tendon relaxation, and biomechanical recovery'
  }
};

interface PomodoroSprintProps {
  onClose?: () => void;
  onPhaseChangeAlert?: () => void;
}

export const PomodoroSprint: React.FC<PomodoroSprintProps> = ({
  onPhaseChangeAlert,
}) => {
  const [phase, setPhase] = useState<SprintPhase>('warmup');
  const [timeLeft, setTimeLeft] = useState<number>(PHASE_CONFIG.warmup.durationSec);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  const currentConfig = PHASE_CONFIG[phase];

  useEffect(() => {
    let timer: number;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Switch phase
      onPhaseChangeAlert?.();
      if (phase === 'warmup') {
        setPhase('focus');
        setTimeLeft(PHASE_CONFIG.focus.durationSec);
      } else if (phase === 'focus') {
        setPhase('cooldown');
        setTimeLeft(PHASE_CONFIG.cooldown.durationSec);
      } else {
        setCyclesCompleted(c => c + 1);
        setPhase('warmup');
        setTimeLeft(PHASE_CONFIG.warmup.durationSec);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, phase, onPhaseChangeAlert]);

  const toggleRun = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentConfig.durationSec);
  };

  const switchPhaseManually = (newPhase: SprintPhase) => {
    setIsRunning(false);
    setPhase(newPhase);
    setTimeLeft(PHASE_CONFIG[newPhase].durationSec);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = 100 - (timeLeft / currentConfig.durationSec) * 100;

  return (
    <div className="w-full cyber-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-cyber-cyan" />
            <h3 className="text-sm font-display font-bold text-white tracking-wider uppercase">
              DEEP FOCUS SPRINT // POMODORO FLOW
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Synchronize warmup drills, deep work sprints, and reflex recovery
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3 sm:mt-0 font-mono text-xs">
          <span className="text-slate-400">Completed Sprints:</span>
          <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-bold">
            {cyclesCompleted} Cycles
          </span>
        </div>
      </div>

      {/* Phase Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-6 font-mono text-xs">
        {(['warmup', 'focus', 'cooldown'] as SprintPhase[]).map(p => {
          const cfg = PHASE_CONFIG[p];
          const isActive = phase === p;
          return (
            <button
              key={p}
              onClick={() => switchPhaseManually(p)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-obsidian-900 border-cyber-cyan text-white shadow-neon-cyan'
                  : 'bg-obsidian-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-display font-bold">
                {p === 'warmup' && <Sparkles className="w-3.5 h-3.5 text-cyber-blue" />}
                {p === 'focus' && <Flame className="w-3.5 h-3.5 text-cyber-cyan" />}
                {p === 'cooldown' && <Coffee className="w-3.5 h-3.5 text-cyber-emerald" />}
                <span>{cfg.name.split(' ')[0]}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">{cfg.durationSec / 60} MIN</span>
            </button>
          );
        })}
      </div>

      {/* Big Circular / Radial Countdown HUD */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-48 h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="transparent"
              stroke="#0f172a"
              strokeWidth="6"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="transparent"
              stroke={currentConfig.color}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className="transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black font-mono tracking-tight text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-display font-bold text-slate-400 mt-1 uppercase" style={{ color: currentConfig.color }}>
              {currentConfig.name}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-mono mt-4 text-center max-w-sm">
          {currentConfig.desc}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={toggleRun}
            className={`px-6 py-2.5 rounded-xl font-display text-sm font-bold flex items-center gap-2 transition-all ${
              isRunning
                ? 'bg-cyber-crimson text-white hover:bg-rose-600 shadow-neon-crimson'
                : 'bg-cyber-cyan text-obsidian-950 hover:bg-cyber-blue shadow-neon-cyan'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'PAUSE TIMER' : 'START SPRINT'}
          </button>

          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset Phase"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

