import React from 'react';
import { Activity, Zap, Target, Gauge, Clock, Flame } from 'lucide-react';
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
  // Calculate dynamic reactor spin speed and color
  // Base speed: 10s, down to 0.8s at 120+ WPM or 30+ combo
  const reactorSpeed = Math.max(0.6, 10 - (liveWpm / 15) - (combo / 8));
  
  // Reactor glow color based on streak
  const getReactorColor = () => {
    if (combo >= 40 || liveWpm >= 110) return '#FF2A5F'; // Crimson Overdrive
    if (combo >= 25 || liveWpm >= 85) return '#F59E0B'; // Solar Amber
    if (combo >= 15 || liveWpm >= 65) return '#A855F7'; // Neon Violet
    return '#00F0FF'; // Electric Cyan
  };

  const reactorColor = getReactorColor();

  // Sparkline coordinates from recent WPM points (last 16 points)
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
    <div className="w-full cyber-panel rounded-xl p-4 mb-6 relative overflow-hidden border border-cyber-blue/20">
      {/* Laser line scan on top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
        
        {/* Reactor Core Visualizer */}
        <div className="col-span-2 md:col-span-1 flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            {/* Pulsing Outer Aura */}
            <div 
              className="absolute inset-0 rounded-full opacity-30 blur-md transition-all duration-300"
              style={{ backgroundColor: reactorColor, transform: `scale(${1 + combo * 0.015})` }}
            />

            {/* Reactor Core SVG */}
            <svg 
              className="w-14 h-14" 
              viewBox="0 0 100 100" 
              style={{ 
                animation: isStarted ? `spin ${reactorSpeed}s linear infinite` : 'spin 12s linear infinite',
                filter: `drop-shadow(0 0 8px ${reactorColor}80)`
              }}
            >
              {/* Outer Stator Ring */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <circle 
                cx="50" cy="50" r="44" 
                fill="none" 
                stroke={reactorColor} 
                strokeWidth="3" 
                strokeDasharray="60 30" 
              />

              {/* Counter-rotating Inner Chamber */}
              <circle 
                cx="50" cy="50" r="32" 
                fill="none" 
                stroke={reactorColor} 
                strokeWidth="2.5" 
                strokeDasharray="25 15"
                opacity="0.8" 
              />

              {/* Core Rotor Tri-fins */}
              <path 
                d="M50 20 L55 45 L50 48 L45 45 Z M50 80 L55 55 L50 52 L45 55 Z M20 50 L45 45 L48 50 L45 55 Z M80 50 L55 45 L52 50 L55 55 Z" 
                fill={reactorColor} 
                opacity="0.9"
              />

              {/* Central Singularity */}
              <circle cx="50" cy="50" r="10" fill="#05070A" stroke={reactorColor} strokeWidth="3" />
              <circle cx="50" cy="50" r="5" fill={reactorColor} className="animate-ping" style={{ animationDuration: '1.2s' }} />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-display flex items-center gap-1">
              REACTOR CORE
              {combo >= 20 && <Flame className="w-3 h-3 text-cyber-crimson animate-bounce" />}
            </span>
            <span className="text-xs font-semibold" style={{ color: reactorColor }}>
              {combo >= 25 ? 'HYPERDRIVE' : isStarted ? 'FUSION ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Live Net WPM */}
        <div className="flex flex-col p-2.5 rounded-lg bg-obsidian-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display text-cyber-cyan">
              <Zap className="w-3.5 h-3.5" /> NET WPM
            </span>
            <span className="text-[10px] text-slate-500">RAW: {rawWpm}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight text-glow-cyan font-mono">
              {liveWpm}
            </span>
            <span className="text-[11px] text-cyber-blue/70">WPM</span>
          </div>
        </div>

        {/* Accuracy % */}
        <div className="flex flex-col p-2.5 rounded-lg bg-obsidian-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display text-cyber-emerald">
              <Target className="w-3.5 h-3.5" /> ACCURACY
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight font-mono ${
              accuracy >= 95 ? 'text-cyber-emerald text-glow-emerald' : accuracy >= 88 ? 'text-cyber-amber' : 'text-cyber-crimson'
            }`}>
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Keystroke Latency */}
        <div className="flex flex-col p-2.5 rounded-lg bg-obsidian-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display text-cyber-blue">
              <Clock className="w-3.5 h-3.5" /> LATENCY
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-200 tracking-tight font-mono">
              {latencyMs > 0 ? latencyMs : '--'}
            </span>
            <span className="text-[10px] text-slate-500">ms/key</span>
          </div>
        </div>

        {/* Combo / Streak */}
        <div className="flex flex-col p-2.5 rounded-lg bg-obsidian-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display text-cyber-violet">
              <Activity className="w-3.5 h-3.5" /> STREAK
            </span>
            {combo > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-violet/20 text-cyber-violet border border-cyber-violet/30">
                {combo}x
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyber-violet text-glow-violet tracking-tight font-mono">
              {combo}
            </span>
            <span className="text-[10px] text-slate-500">keys</span>
          </div>
        </div>

        {/* Velocity Sparkline & Ghost Pacer Indicator */}
        <div className="flex flex-col p-2.5 rounded-lg bg-obsidian-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1 text-[11px] font-display text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-cyber-cyan" /> VELOCITY
            </span>
            <span className="text-[10px] text-cyber-cyan font-mono">PACER: {targetWpm}</span>
          </div>
          <div className="h-8 w-full flex items-center justify-center">
            {recentPoints.length > 1 ? (
              <svg className="w-full h-8 overflow-visible" viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={sparklinePath}
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <div className="text-[11px] text-slate-600 font-mono tracking-wider animate-pulse">
                AWAITING PULSE...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

