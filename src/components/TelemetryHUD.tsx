import React from 'react';
import { Rocket, Zap, Target, Gauge, Clock, Flame, Compass } from 'lucide-react';
import { WpmPoint } from '../types/telemetry';

interface TelemetryHUDProps {
  liveWpm: number;
  rawWpm: number;
  accuracy: number;
  latencyMs: number;
  combo: number;
  maxCombo: number;
  wpmTimeline: WpmPoint[];
  targetWpm: number;
  isStarted: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  liveWpm,
  rawWpm,
  accuracy,
  latencyMs,
  combo,
  wpmTimeline,
  targetWpm,
  isStarted,
}) => {
  // Rocket speed calculations
  const machSpeed = isStarted ? (1 + (liveWpm / 45)).toFixed(2) : '1.00';
  const altitudeKm = isStarted ? Math.round(120 + liveWpm * 6.5 + combo * 8) : 120;
  const gForce = isStarted ? (1 + (liveWpm / 55)).toFixed(1) : '1.0';

  // Rocket Thruster Core spin & flame intensity
  const turbineSpeed = Math.max(0.5, 8 - (liveWpm / 18) - (combo / 10));

  const getThrusterColor = () => {
    if (combo >= 40 || liveWpm >= 110) return '#FF0055'; // Hypersonic Plasma
    if (combo >= 25 || liveWpm >= 85) return '#FF5E00'; // Rocket Thrust Flame
    if (combo >= 15 || liveWpm >= 65) return '#FFB800'; // Solar Amber
    return '#00F0FF'; // Plasma Cyan
  };

  const thrusterColor = getThrusterColor();

  // Sparkline coordinates (velocity history)
  const recentPoints = wpmTimeline.slice(-16);
  const maxVal = Math.max(80, ...recentPoints.map(p => p.wpm));
  const minVal = 0;
  const sparkWidth = 140;
  const sparkHeight = 34;

  const sparklinePath = recentPoints.length > 1
    ? recentPoints.map((p, i) => {
        const x = (i / (recentPoints.length - 1)) * sparkWidth;
        const y = sparkHeight - ((p.wpm - minVal) / (maxVal - minVal || 1)) * (sparkHeight - 4) - 2;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }).join(' ')
    : `M 0 ${sparkHeight - 2} L ${sparkWidth} ${sparkHeight - 2}`;

  return (
    <div className="w-full rocket-panel rounded-2xl p-4 sm:p-5 mb-6 relative overflow-hidden transition-all duration-300">
      {/* Top Rocket Exhaust Glow Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] opacity-90 transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${thrusterColor}, transparent)`
        }}
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 items-center">
        
        {/* Rocket Thruster Visualizer */}
        <div className="col-span-2 md:col-span-1 flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            {/* Pulsing Rocket Exhaust Aura */}
            <div 
              className="absolute inset-0 rounded-full opacity-35 blur-md transition-all duration-300"
              style={{ backgroundColor: thrusterColor, transform: `scale(${1 + combo * 0.018})` }}
            />

            {/* Rocket Turbine Core SVG */}
            <svg 
              className="w-14 h-14" 
              viewBox="0 0 100 100" 
              style={{ 
                animation: isStarted ? `spin ${turbineSpeed}s linear infinite` : 'spin 12s linear infinite',
                filter: `drop-shadow(0 0 10px ${thrusterColor}90)`
              }}
            >
              {/* Nozzle Ring */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
              <circle 
                cx="50" cy="50" r="44" 
                fill="none" 
                stroke={thrusterColor} 
                strokeWidth="3.5" 
                strokeDasharray="40 20" 
              />

              {/* Inner Combustion Chamber */}
              <circle 
                cx="50" cy="50" r="28" 
                fill="none" 
                stroke={thrusterColor} 
                strokeWidth="2.5" 
                strokeDasharray="18 12"
              />

              {/* Rocket Propeller Blades */}
              <path 
                d="M50 15 L56 46 L50 50 L44 46 Z M50 85 L56 54 L50 50 L44 54 Z M15 50 L46 44 L50 50 L46 56 Z M85 50 L54 44 L50 50 L54 56 Z" 
                fill={thrusterColor} 
                opacity="0.9"
              />

              {/* Central Plasma Ignition Pin */}
              <circle cx="50" cy="50" r="9" fill="#0A0F1D" stroke={thrusterColor} strokeWidth="2.5" />
              <circle cx="50" cy="50" r="4" fill={thrusterColor} className="animate-ping" style={{ animationDuration: '0.8s' }} />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-slate-400 dark:text-slate-400 font-display uppercase flex items-center gap-1 font-bold">
              THRUST CORE
              {combo >= 20 && <Flame className="w-3.5 h-3.5 text-rocket-thrust animate-flame-flicker" />}
            </span>
            <span className="text-xs font-bold font-mono tracking-tight" style={{ color: thrusterColor }}>
              {combo >= 25 ? 'HYPERSPEED' : isStarted ? `MACH ${machSpeed}` : 'IGNITION IDLE'}
            </span>
          </div>
        </div>

        {/* Live Net WPM with Velocity Metric */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display font-bold text-cyber-cyan dark:text-cyber-cyan">
              <Zap className="w-3.5 h-3.5" /> NET WPM
            </span>
            <span className="text-[10px] font-mono">RAW: {rawWpm}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono text-glow-cyan">
              {liveWpm}
            </span>
            <span className="text-[11px] text-cyber-blue font-bold">WPM</span>
          </div>
        </div>

        {/* Accuracy % */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display font-bold text-cyber-emerald">
              <Target className="w-3.5 h-3.5" /> ACCURACY
            </span>
            <span className="text-[10px] text-slate-400 font-mono">FLOW</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight font-mono ${
              accuracy >= 95 ? 'text-cyber-emerald' : accuracy >= 88 ? 'text-rocket-amber' : 'text-cyber-crimson'
            }`}>
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Keystroke Latency & G-Force */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display font-bold text-sky-500">
              <Clock className="w-3.5 h-3.5" /> LATENCY
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{gForce} G</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-800 dark:text-slate-200 tracking-tight font-mono">
              {latencyMs > 0 ? latencyMs : '--'}
            </span>
            <span className="text-[10px] text-slate-500">ms/key</span>
          </div>
        </div>

        {/* Rocket Streak & Flame Boost */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display font-bold text-rocket-thrust">
              <Flame className="w-3.5 h-3.5" /> STREAK
            </span>
            {combo > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rocket-thrust/20 text-rocket-thrust border border-rocket-thrust/40 font-bold">
                {combo}x
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rocket-thrust text-glow-thrust tracking-tight font-mono">
              {combo}
            </span>
            <span className="text-[10px] text-slate-500">keys</span>
          </div>
        </div>

        {/* Orbital Sparkline & Target Ghost Pacer */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display font-bold text-slate-700 dark:text-slate-300">
              <Rocket className="w-3.5 h-3.5 text-cyber-cyan" /> ORBIT: {altitudeKm}km
            </span>
            <span className="text-[10px] text-cyber-cyan font-mono font-bold">PB: {targetWpm}</span>
          </div>
          <div className="h-8 w-full flex items-center justify-center">
            {recentPoints.length > 1 ? (
              <svg className="w-full h-8 overflow-visible" viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}>
                <defs>
                  <linearGradient id="rocketSparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF5E00" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={sparklinePath}
                  fill="none"
                  stroke={thrusterColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tracking-wider animate-pulse flex items-center gap-1">
                <Compass className="w-3 h-3 text-rocket-thrust animate-spin" /> READY FOR LAUNCH
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
