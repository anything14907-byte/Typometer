import React from 'react';
import { 
  Trophy, 
  Target, 
  Zap, 
  Activity, 
  Clock, 
  X, 
  Gamepad2, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { UserStats, KeyHeatmapData } from '../types/telemetry';
import { CYBER_RANKS, CyberRank } from '../data/ranks';
import { VirtualKeyboard } from './VirtualKeyboard';

interface CareerTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  currentRank: CyberRank;
  onLaunchDrill: (keys: string[]) => void;
  onLaunchGame: (game: 'orbital' | 'warp' | 'hack') => void;
}

export const CareerTelemetryModal: React.FC<CareerTelemetryModalProps> = ({
  isOpen,
  onClose,
  stats,
  currentRank,
  onLaunchDrill,
  onLaunchGame,
}) => {
  if (!isOpen) return null;

  // Identify all-time weakest keys
  const weakKeys = Object.entries(stats.keyAccuracyMap)
    .map(([key, data]) => {
      const errorRate = data.total > 0 ? data.errors / data.total : 0;
      const avgLatency = data.total > 0 ? data.totalLatencyMs / data.total : 0;
      return { key, errorRate, avgLatency, errors: data.errors, total: data.total };
    })
    .filter(k => /^[a-z]$/.test(k.key) && k.total >= 4)
    .sort((a, b) => (b.errors * 2 + b.avgLatency / 100) - (a.errors * 2 + a.avgLatency / 100))
    .slice(0, 4);

  // Past 20 sessions trend
  const sessions = stats.recentSessions.slice(0, 20).reverse();
  const maxWpm = Math.max(80, ...sessions.map(s => s.wpm)) + 10;
  const chartWidth = 600;
  const chartHeight = 120;

  const points = sessions.map((s, idx) => {
    const x = sessions.length > 1 ? (idx / (sessions.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
    const y = chartHeight - 15 - (s.wpm / maxWpm) * (chartHeight - 30);
    return { x, y, wpm: s.wpm, acc: s.accuracy, date: s.date };
  });

  const pathD = points.length > 1
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-4xl cyber-panel-glow rounded-2xl p-6 sm:p-8 border border-cyber-cyan/40 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-cyber-amber" />
              <span className="text-xs font-display tracking-widest text-cyber-amber uppercase font-bold">
                LIFETIME COGNITIVE TELEMETRY DOSSIER
              </span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-white">
              PILOT CLASSIFICATION: {currentRank.title}
            </h2>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-obsidian-900 border border-cyber-cyan/40 text-center font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">PILOT LEVEL</span>
              <span className="text-sm font-bold text-cyber-cyan">LVL {stats.level}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-obsidian-900 border border-cyber-amber/40 text-center font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">TOTAL XP</span>
              <span className="text-sm font-bold text-cyber-amber">{stats.totalXp.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 4 Lifetime Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-obsidian-900/80 border border-slate-800 font-mono">
            <span className="text-[11px] text-slate-400 uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyber-cyan" /> PERSONAL BEST
            </span>
            <div className="text-2xl font-bold text-white text-glow-cyan mt-1">
              {stats.bestWpm} <span className="text-xs text-slate-500">WPM</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-900/80 border border-slate-800 font-mono">
            <span className="text-[11px] text-slate-400 uppercase flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyber-blue" /> CAREER AVERAGE
            </span>
            <div className="text-2xl font-bold text-slate-200 mt-1">
              {stats.avgWpm} <span className="text-xs text-slate-500">WPM</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-900/80 border border-slate-800 font-mono">
            <span className="text-[11px] text-slate-400 uppercase flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-cyber-emerald" /> AVG ACCURACY
            </span>
            <div className="text-2xl font-bold text-cyber-emerald mt-1">
              {stats.avgAccuracy || 100}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-900/80 border border-slate-800 font-mono">
            <span className="text-[11px] text-slate-400 uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyber-violet" /> TESTS LOGGED
            </span>
            <div className="text-2xl font-bold text-cyber-violet mt-1">
              {stats.totalTests} <span className="text-xs text-slate-500">runs</span>
            </div>
          </div>
        </div>

        {/* Career Speed Progression Graph */}
        <div className="p-4 rounded-xl bg-obsidian-900/80 border border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-display font-bold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyber-cyan" /> SPEED EVOLUTION (PAST 20 SESSIONS)
            </span>
            <span className="text-[11px] font-mono text-slate-500">Velocity Curve</span>
          </div>

          {points.length > 1 ? (
            <svg className="w-full h-32 overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <path
                d={pathD}
                fill="none"
                stroke="#00F0FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
              />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#00F0FF" />
              ))}
            </svg>
          ) : (
            <div className="h-28 flex items-center justify-center text-xs font-mono text-slate-500">
              Complete more tests to generate career progression telemetry
            </div>
          )}
        </div>

        {/* Key Missed Bottlenecks & Gamified Recommendations */}
        <div className="p-4 rounded-xl bg-obsidian-900/80 border border-slate-800 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-cyber-crimson" />
            <span className="text-xs font-display font-bold text-white tracking-wider uppercase">
              WEAKEST RECEPTORS & PRESCRIPTION PROTOCOLS
            </span>
          </div>

          {weakKeys.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weakKeys.map(k => (
                <div key={k.key} className="p-3 rounded-lg bg-obsidian-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-cyber-crimson font-mono">
                      KEY [{k.key.toUpperCase()}]
                    </span>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Miss rate: <strong className="text-cyber-amber">{Math.round(k.errorRate * 100)}%</strong> | Latency: <strong>{Math.round(k.avgLatency)}ms</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLaunchDrill([k.key]);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-cyber-violet/20 hover:bg-cyber-violet/30 border border-cyber-violet/40 text-[11px] font-display text-cyber-violet hover:text-white flex items-center gap-1"
                  >
                    <span>Train Drill</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-mono p-2">
              No chronic weak-key bottlenecks identified yet! Keep testing to populate biomechanical telemetry.
            </div>
          )}
        </div>

        {/* Lifetime Keyboard Heatmap */}
        <div className="mb-6">
          <VirtualKeyboard keyStats={stats.keyAccuracyMap} />
        </div>

        {/* Cybernetic Ranks Progression Hierarchy */}
        <div className="p-4 rounded-xl bg-obsidian-900/80 border border-slate-800 font-mono text-xs">
          <span className="text-xs font-display font-bold text-slate-300 block mb-3 uppercase">
            CYBERNETIC PILOT CLASSIFICATION MATRIX
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {CYBER_RANKS.map(r => {
              const isUnlocked = stats.bestWpm >= r.minWpm || stats.totalXp >= r.minXp;
              return (
                <div
                  key={r.rankLevel}
                  className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-obsidian-950 border-cyber-cyan/40 text-slate-200'
                      : 'bg-obsidian-950/40 border-slate-800/80 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-[11px]" style={{ color: isUnlocked ? r.color : '#64748B' }}>
                      {r.title}
                    </span>
                    <span className="text-[10px] px-1 rounded bg-slate-800">
                      {r.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    REQ: {r.minWpm} WPM or {r.minXp.toLocaleString()} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

