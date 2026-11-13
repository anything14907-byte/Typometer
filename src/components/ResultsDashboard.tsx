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
  Cpu
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
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#A855F7', '#10B981']
        });
      } catch {}
    }
  }, [session]);

  // Chart Dimensions & Calculations
  const timeline = session.wpmTimeline;
  const chartWidth = 720;
  const chartHeight = 180;
  const maxWpm = Math.max(80, ...timeline.map(p => Math.max(p.wpm, p.rawWpm))) + 10;
  const minWpm = 0;

  const points = timeline.map((p, idx) => {
    const x = timeline.length > 1 ? (idx / (timeline.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
    const yNet = chartHeight - 20 - ((p.wpm - minWpm) / (maxWpm - minWpm || 1)) * (chartHeight - 40);
    const yRaw = chartHeight - 20 - ((p.rawWpm - minWpm) / (maxWpm - minWpm || 1)) * (chartHeight - 40);
    return { ...p, x, yNet, yRaw };
  });

  const netPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yNet.toFixed(1)}`).join(' ');
  const rawPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yRaw.toFixed(1)}`).join(' ');

  const activePointData = hoveredPoint !== null ? points[hoveredPoint] : null;

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Primary Telemetry Scorecard */}
      <div className="cyber-panel-glow rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-cyber-cyan/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-cyber-cyan" />
              <span className="text-xs font-display tracking-widest text-cyber-cyan uppercase font-bold">
                POST-RUN TELEMETRY ANALYSIS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide">
              SYNAPTIC CADENCE LOGGED
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={onRestart}
              className="px-5 py-2.5 rounded-xl font-display text-sm font-bold bg-cyber-cyan text-obsidian-950 hover:bg-cyber-blue hover:shadow-neon-cyan transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              TEST AGAIN (Ctrl+Enter)
            </button>
          </div>
        </div>

        {/* 4 Big Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
            <span className="text-xs font-display text-slate-400 flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-cyber-cyan" /> NET WPM
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-white text-glow-cyan">
              {session.wpm}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              RAW: <span className="text-slate-300 font-bold">{session.rawWpm} WPM</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
            <span className="text-xs font-display text-slate-400 flex items-center gap-1.5 mb-1">
              <Target className="w-4 h-4 text-cyber-emerald" /> ACCURACY
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-cyber-emerald text-glow-emerald">
              {session.accuracy}%
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              ERRORS: <span className="text-cyber-crimson font-bold">{session.errorCount}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
            <span className="text-xs font-display text-slate-400 flex items-center gap-1.5 mb-1">
              <Activity className="w-4 h-4 text-cyber-violet" /> CONSISTENCY
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-cyber-violet text-glow-violet">
              {session.consistency}%
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              CADENCE STABILITY
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/80 border border-slate-800/80">
            <span className="text-xs font-display text-slate-400 flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4 text-cyber-amber" /> XP EARNED
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-cyber-amber">
              +{session.xpEarned || Math.round(session.wpm * 2 + session.accuracy)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              DURATION: <span className="text-slate-300 font-bold">{session.timeSeconds}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive WPM vs Time Line Chart */}
      <div className="cyber-panel rounded-2xl p-6 border border-slate-800 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-display font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyber-cyan" />
              VELOCITY TELEMETRY CURVE (WPM VS. TIME)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Net velocity (cyan), Raw burst speed (dashed slate), and error markers (crimson)
            </p>
          </div>

          {activePointData && (
            <div className="flex items-center gap-4 text-xs font-mono bg-obsidian-900 px-3 py-1.5 rounded-lg border border-slate-700 mt-2 sm:mt-0">
              <span className="text-slate-400">{activePointData.second}s:</span>
              <span className="text-cyber-cyan font-bold">{activePointData.wpm} WPM</span>
              <span className="text-slate-400">Raw: {activePointData.rawWpm}</span>
              {activePointData.errors > 0 && (
                <span className="text-cyber-crimson font-bold">Errors: {activePointData.errors}</span>
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
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight - 20 - ratio * (chartHeight - 40);
              const val = Math.round(minWpm + ratio * (maxWpm - minWpm));
              return (
                <g key={i}>
                  <line 
                    x1="20" y1={y} x2={chartWidth - 20} y2={y} 
                    stroke="rgba(255, 255, 255, 0.06)" 
                    strokeDasharray="4 4" 
                  />
                  <text x="5" y={y + 3} fill="#64748b" fontSize="9" fontFamily="monospace">
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
                stroke="#64748b" 
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
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
              />
            )}

            {/* Error Markers & Interactive Hover Points */}
            {points.map((p, idx) => (
              <g key={idx} onMouseEnter={() => setHoveredPoint(idx)}>
                {/* Error Crimson Marker if error occurred */}
                {p.errors > 0 && (
                  <circle 
                    cx={p.x} 
                    cy={p.yNet} 
                    r="4.5" 
                    fill="#FF2A5F" 
                    stroke="#05070A" 
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}
                {/* Active Hover Halo */}
                {hoveredPoint === idx && (
                  <circle 
                    cx={p.x} 
                    cy={p.yNet} 
                    r="6" 
                    fill="#00F0FF" 
                    opacity="0.8" 
                  />
                )}
                {/* Invisible hit area for smooth hovering */}
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
      <div className="cyber-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
          <AlertTriangle className="w-5 h-5 text-cyber-violet" />
          <h3 className="text-sm font-display font-bold text-slate-200 tracking-wider uppercase">
            AI BIOMECHANICAL DIAGNOSTICS & DRILL RECOMMENDATIONS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnostics.map((diag: DiagnosticInsight, idx: number) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                diag.severity === 'high' 
                  ? 'bg-cyber-crimson/10 border-cyber-crimson/30' 
                  : diag.severity === 'positive'
                  ? 'bg-cyber-emerald/10 border-cyber-emerald/30'
                  : 'bg-obsidian-900/80 border-slate-800'
              }`}
            >
              <div>
                <span className={`text-[10px] font-display font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                  diag.severity === 'high' 
                    ? 'bg-cyber-crimson/20 text-cyber-crimson' 
                    : diag.severity === 'positive'
                    ? 'bg-cyber-emerald/20 text-cyber-emerald'
                    : 'bg-cyber-blue/20 text-cyber-blue'
                }`}>
                  {diag.type.replace('-', ' ')}
                </span>
                <h4 className="text-sm font-bold text-slate-100 mt-2 font-display">
                  {diag.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                  {diag.description}
                </p>
                <div className="text-xs text-slate-300 font-mono mt-2 bg-obsidian-950/70 p-2 rounded border border-slate-800">
                  ⚡ <strong>Prescription:</strong> {diag.recommendedAction}
                </div>
              </div>

              {/* Action Button for Weak Key Drill */}
              {diag.drillKeys && diag.drillKeys.length > 0 && (
                <button
                  onClick={() => onLaunchWeakKeyDrill(diag.drillKeys!)}
                  className="mt-4 w-full py-2 px-3 rounded-lg bg-cyber-violet/20 hover:bg-cyber-violet/30 border border-cyber-violet/40 text-cyber-violet hover:text-white text-xs font-display font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>LAUNCH WEAK-KEY ADAPTIVE DRILL [{diag.drillKeys.join(', ').toUpperCase()}]</span>
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

