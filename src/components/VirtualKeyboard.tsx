import React, { useState } from 'react';
import { KeyHeatmapData } from '../types/telemetry';

interface VirtualKeyboardProps {
  keyStats: KeyHeatmapData;
  activeKey?: string;
  onKeySelect?: (key: string) => void;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ['space']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  keyStats,
  activeKey,
  onKeySelect,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  /**
   * Determine heatmap color from cool blue to fiery red
   */
  const getKeyColor = (key: string) => {
    const norm = key.toLowerCase();
    const data = keyStats[norm];

    if (!data || data.total === 0) {
      return {
        bg: 'bg-obsidian-900/60',
        border: 'border-slate-800',
        text: 'text-slate-400',
        glow: '',
      };
    }

    const errorRate = data.errors / data.total;
    const avgLatency = data.totalLatencyMs / data.total;

    // High error rate or high latency -> Fiery Red / Crimson
    if (errorRate > 0.2 || avgLatency > 280) {
      return {
        bg: 'bg-cyber-crimson/25',
        border: 'border-cyber-crimson/70',
        text: 'text-cyber-crimson font-bold',
        glow: 'shadow-neon-crimson',
      };
    }

    // Medium error or hesitation -> Amber / Orange
    if (errorRate > 0.08 || avgLatency > 210) {
      return {
        bg: 'bg-cyber-amber/20',
        border: 'border-cyber-amber/60',
        text: 'text-cyber-amber font-semibold',
        glow: '',
      };
    }

    // Moderate speed -> Neon Violet
    if (avgLatency > 150) {
      return {
        bg: 'bg-cyber-violet/20',
        border: 'border-cyber-violet/60',
        text: 'text-cyber-violet',
        glow: '',
      };
    }

    // Fast and accurate -> Cool Blue / Electric Cyan
    return {
      bg: 'bg-cyber-cyan/20',
      border: 'border-cyber-cyan/60',
      text: 'text-cyber-cyan font-bold',
      glow: 'shadow-neon-cyan',
    };
  };

  const selectedKeyData = hoveredKey ? keyStats[hoveredKey.toLowerCase()] : null;

  return (
    <div className="w-full cyber-panel rounded-xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-display font-bold text-slate-200 tracking-wider uppercase">
            NEURAL HEATMAP KEYBOARD
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Key latency and error concentration across physical layout
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono mt-2 sm:mt-0">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyber-cyan/40 border border-cyber-cyan" />
            <span className="text-slate-400">OPTIMAL</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyber-violet/40 border border-cyber-violet" />
            <span className="text-slate-400">AVERAGE</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyber-amber/40 border border-cyber-amber" />
            <span className="text-slate-400">HESITATION</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyber-crimson/50 border border-cyber-crimson" />
            <span className="text-slate-400">CRITICAL ERROR</span>
          </div>
        </div>
      </div>

      {/* Keyboard Matrix */}
      <div className="flex flex-col items-center gap-1.5 overflow-x-auto py-2">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5 justify-center w-full">
            {row.map((k) => {
              const { bg, border, text, glow } = getKeyColor(k);
              const isSpace = k === 'space';
              const isPressed = activeKey?.toLowerCase() === k.toLowerCase();

              return (
                <button
                  key={k}
                  onMouseEnter={() => setHoveredKey(k)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => onKeySelect?.(k)}
                  className={`
                    h-9 sm:h-11 rounded-md border text-xs sm:text-sm font-mono flex items-center justify-center transition-all duration-150
                    ${isSpace ? 'w-56 sm:w-72' : 'w-7 sm:w-9'}
                    ${bg} ${border} ${text} ${glow}
                    ${isPressed ? 'scale-90 ring-2 ring-cyber-cyan' : 'hover:scale-105'}
                  `}
                >
                  {isSpace ? 'SPACE' : k.toUpperCase()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hovered Key Telemetry Readout */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        {hoveredKey ? (
          <div className="flex items-center gap-4 text-slate-300">
            <span className="text-cyber-cyan font-bold">KEY [{hoveredKey.toUpperCase()}]:</span>
            <span>Strikes: <strong className="text-white">{selectedKeyData?.total || 0}</strong></span>
            <span>Errors: <strong className="text-cyber-crimson">{selectedKeyData?.errors || 0}</strong></span>
            <span>
              Accuracy: <strong className="text-cyber-emerald">
                {selectedKeyData && selectedKeyData.total > 0
                  ? Math.round(((selectedKeyData.total - selectedKeyData.errors) / selectedKeyData.total) * 100)
                  : 100}%
              </strong>
            </span>
            <span>
              Avg Latency: <strong className="text-cyber-blue">
                {selectedKeyData && selectedKeyData.total > 0
                  ? Math.round(selectedKeyData.totalLatencyMs / selectedKeyData.total)
                  : '--'} ms
              </strong>
            </span>
          </div>
        ) : (
          <span className="text-slate-500 italic">
            Hover over any key on the matrix to inspect exact latency and error analytics
          </span>
        )}
      </div>
    </div>
  );
};

