import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Activity, 
  Clock, 
  RotateCcw, 
  AlertTriangle, 
  Award, 
  ArrowRight,
  TrendingUp,
  Rocket
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SessionResult, DiagnosticInsight } from '../types/telemetry';
import { VirtualKeyboard } from './VirtualKeyboard';
import { generateDiagnostics } from '../utils/telemetryStats';

interface ResultsDashboardProps {
  session: SessionResult;
  onRestart: () => void;
  onLaunchWeakKeyDrill: (keys: string[]) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  session,
  onRestart,
  onLaunchWeakKeyDrill,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const diagnostics = generateDiagnostics(session);

  // Trigger celebration on great performance
  useEffect(() => {
    if (session.accuracy >= 95 && session.wpm >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF5E00', '#00F0FF', '#9D4EDD', '#FFB800']
        });
      } catch {}
    }
  }, [session]);

  const timeline = session.wpmTimeline || [];
  const chartWidth = 720;
  const chartHeight = 180;
  const maxWpm = Math.max(80, ...timeline.map(p => Math.max(p.wpm || 0, p.rawWpm || 0))) + 10;
  const minWpm = 0;

  const points = timeline.map((p, idx) => {
    const x = timeline.length > 1 ? (idx / (timeline.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
    const yNet = chartHeight - 20 - (((p.wpm || 0) - minWpm) / (maxWpm - minWpm || 1)) * (chartHeight - 40);
    const yRaw = chartHeight - 20 - (((p.rawWpm || 0) - minWpm) / (maxWpm - minWpm || 1)) * (chartHeight - 40);
    return { ...p, x, yNet, yRaw };
  });

  const netPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yNet.toFixed(1)}`).join(' ');
  const rawPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yRaw.toFixed(1)}`).join(' ');

  const activePointData = hoveredPoint !== null ? points[hoveredPoint] : null;

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Primary Telemetry Scorecard */}
      <div className="rocket-panel-glow rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="w-5 h-5 text-rocket-thrust animate-pulse" />
              <span className="text-xs font-display tracking-widest text-rocket-thrust uppercase font-black">
                ORBITAL STAGE TELEMETRY ANALYSIS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-wide">
              MISSION RUN COMPLETE
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={onRestart}
              className="px-5 py-2.5 rounded-xl font-display text-sm font-black bg-rocket-thrust text-white hover:bg-orange-600 shadow-rocket-thrust transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              NEXT MISSION (Ctrl+Enter)
            </button>
          </div>
        </div>

        {/* 4 Big Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-display text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1 font-bold">
              <Zap className="w-4 h-4 text-cyber-cyan" /> NET WPM
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-slate-900 dark:text-white text-glow-cyan">
              {session.wpm}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              RAW: <span className="text-slate-700 dark:text-slate-300 font-bold">{session.rawWpm} WPM</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-display text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1 font-bold">
              <Target className="w-4 h-4 text-cyber-emerald" /> ACCURACY
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-cyber-emerald">
              {session.accuracy}%
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              MISTAKES: <span className="text-rocket-flame font-bold">{session.errorCount}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-display text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1 font-bold">
              <Activity className="w-4 h-4 text-rocket-nebula" /> CONSISTENCY
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-rocket-nebula text-glow-violet">
              {session.consistency}%
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              CADENCE STABILITY
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-obsidian-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-display text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1 font-bold">
              <Award className="w-4 h-4 text-rocket-amber" /> XP EARNED
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-rocket-amber">
              +{session.xpEarned || Math.round(session.wpm * 2 + session.accuracy)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              DURATION: <span className="text-slate-700 dark:text-slate-300 font-bold">{session.timeSeconds}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive WPM vs Time Line Chart */}
      <div className="rocket-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-display font-black text-slate-900 dark:text-slate-100 tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rocket-thrust" />
              VELOCITY TRAJECTORY CURVE (WPM VS. TIME)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Net velocity (cyan), Raw burst speed (dashed slate), and error markers (crimson)
            </p>
          </div>

          {activePointData && (
            <div className="flex items-center gap-4 text-xs font-mono bg-slate-100 dark:bg-obsidian-900 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 mt-2 sm:mt-0 font-bold">
              <span className="text-slate-500">{activePointData.second}s:</span>
              <span className="text-cyber-cyan">{activePointData.wpm} WPM</span>
              <span className="text-slate-400">Raw: {activePointData.rawWpm}</span>
              {activePointData.errors > 0 && (
                <span className="text-rocket-flame font-bold">Errors: {activePointData.errors}</span>
              )}
            </div>
          )}
        </div>

        {/* SVG Telemetry Chart */}
        <div className="w-full overflow-x-auto py-2">
          <svg 
            className="w-full h-48 select-none" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight - 20 - ratio * (chartHeight - 40);
              const val = Math.round(minWpm + ratio * (maxWpm - minWpm));
              return (
                <g key={i}>
                  <line 
                    x1="20" y1={y} x2={chartWidth - 20} y2={y} 
                    stroke="rgba(148, 163, 184, 0.2)" 
                    strokeDasharray="4 4" 
                  />
                  <text x="5" y={y + 3} fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Raw WPM Line */}
            {points.length > 1 && (
              <path 
                d={rawPath} 
                fill="none" 
                stroke="#94a3b8" 
                strokeWidth="1.5" 
                strokeDasharray="3 3" 
                opacity="0.6"
              />
            )}

            {/* Net WPM Line */}
            {points.length > 1 && (
              <path 
                d={netPath} 
                fill="none" 
                stroke="#00F0FF" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
              />
            )}

            {/* Error Markers & Interactive Hover Points */}
            {points.map((p, idx) => (
              <g key={idx} onMouseEnter={() => setHoveredPoint(idx)}>
                {p.errors > 0 && (
                  <circle 
                    cx={p.x} 
                    cy={p.yNet} 
                    r="5" 
                    fill="#FF0055" 
                    stroke="#ffffff" 
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}
                {hoveredPoint === idx && (
                  <circle 
                    cx={p.x} 
                    cy={p.yNet} 
                    r="6.5" 
                    fill="#FF5E00" 
                    opacity="0.9" 
                  />
                )}
                <rect 
                  x={p.x - 12} 
                  y={0} 
                  width={24} 
                  height={chartHeight} 
                  fill="transparent" 
                  className="cursor-crosshair"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Interactive Virtual Keyboard Heatmap */}
      <VirtualKeyboard keyStats={session.keyStats} />

      {/* Actionable AI-Style Diagnostic Insights */}
      <div className="rocket-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <AlertTriangle className="w-5 h-5 text-rocket-thrust" />
          <h3 className="text-sm font-display font-black text-slate-900 dark:text-slate-100 tracking-wider uppercase">
            FLIGHT RECORDER DIAGNOSTICS & DRILL PRESCRIPTIONS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnostics.map((diag: DiagnosticInsight, idx: number) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                diag.severity === 'high' 
                  ? 'bg-rocket-flame/10 border-rocket-flame/30' 
                  : diag.severity === 'positive'
                  ? 'bg-cyber-emerald/10 border-cyber-emerald/30'
                  : 'bg-slate-100/80 dark:bg-obsidian-900/80 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <span className={`text-[10px] font-display font-black tracking-widest uppercase px-2 py-0.5 rounded ${
                  diag.severity === 'high' 
                    ? 'bg-rocket-flame/20 text-rocket-flame' 
                    : diag.severity === 'positive'
                    ? 'bg-cyber-emerald/20 text-cyber-emerald'
                    : 'bg-cyber-blue/20 text-sky-600 dark:text-sky-400'
                }`}>
                  {diag.type.replace('-', ' ')}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2 font-display">
                  {diag.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed font-sans">
                  {diag.description}
                </p>
                <div className="text-xs text-slate-800 dark:text-slate-300 font-mono mt-2 bg-slate-200/60 dark:bg-obsidian-950/70 p-2 rounded border border-slate-300 dark:border-slate-800">
                  ⚡ <strong>Prescription:</strong> {diag.recommendedAction}
                </div>
              </div>

              {diag.drillKeys && diag.drillKeys.length > 0 && (
                <button
                  onClick={() => onLaunchWeakKeyDrill(diag.drillKeys!)}
                  className="mt-4 w-full py-2.5 px-3 rounded-lg bg-rocket-thrust text-white hover:bg-orange-600 font-display font-black text-xs flex items-center justify-center gap-2 transition-all shadow-rocket-thrust"
                >
                  <span>LAUNCH WEAK-KEY DRILL [{diag.drillKeys.join(', ').toUpperCase()}]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
