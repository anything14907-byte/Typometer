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
   * Determine heatmap color from cool blue to fiery rocket crimson
   */
  const getKeyColor = (key: string) => {
    const norm = key.toLowerCase();
    const data = keyStats[norm];

    if (!data || data.total === 0) {
      return {
        bg: 'bg-slate-100 dark:bg-obsidian-900/60',
        border: 'border-slate-300 dark:border-slate-800',
        text: 'text-slate-600 dark:text-slate-400',
        glow: '',
      };
    }

    const errorRate = data.errors / data.total;
    const avgLatency = data.totalLatencyMs / data.total;

    // High error rate or high latency -> Fiery Rocket Flame / Crimson
    if (errorRate > 0.2 || avgLatency > 280) {
      return {
        bg: 'bg-rocket-flame/30 dark:bg-rocket-flame/25',
        border: 'border-rocket-flame/70',
        text: 'text-rocket-flame font-black',
        glow: 'shadow-[0_0_12px_rgba(255,42,0,0.6)]',
      };
    }

    // Medium error or hesitation -> Solar Amber / Rocket Thrust
    if (errorRate > 0.08 || avgLatency > 210) {
      return {
        bg: 'bg-rocket-thrust/25 dark:bg-rocket-thrust/20',
        border: 'border-rocket-thrust/60',
        text: 'text-rocket-thrust font-bold',
        glow: '',
      };
    }

    // Moderate speed -> Cosmic Nebula Violet
    if (avgLatency > 150) {
      return {
        bg: 'bg-rocket-nebula/25 dark:bg-rocket-nebula/20',
        border: 'border-rocket-nebula/60',
        text: 'text-rocket-nebula font-bold',
        glow: '',
      };
    }

    // Fast and accurate -> Electric Plasma Cyan
    return {
      bg: 'bg-cyber-cyan/25 dark:bg-cyber-cyan/20',
      border: 'border-cyber-cyan/60',
      text: 'text-sky-600 dark:text-cyber-cyan font-black',
      glow: 'shadow-[0_0_12px_rgba(0,240,255,0.4)]',
    };
  };

  const selectedKeyData = hoveredKey ? keyStats[hoveredKey.toLowerCase()] : null;

  return (
    <div className="w-full rocket-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-display font-black text-slate-900 dark:text-slate-100 tracking-wider uppercase">
            ROCKET TELEMETRY KEYBOARD MATRIX
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            Keystroke latency and motor error density across physical actuators
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono mt-2 sm:mt-0 font-bold">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyber-cyan border border-cyber-cyan" />
            <span className="text-slate-600 dark:text-slate-400">OPTIMAL</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rocket-nebula border border-rocket-nebula" />
            <span className="text-slate-600 dark:text-slate-400">STABLE</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rocket-thrust border border-rocket-thrust" />
            <span className="text-slate-600 dark:text-slate-400">HESITATION</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rocket-flame border border-rocket-flame" />
            <span className="text-slate-600 dark:text-slate-400">CRITICAL</span>
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
                    h-9 sm:h-11 rounded-lg border text-xs sm:text-sm font-mono flex items-center justify-center transition-all duration-150
                    ${isSpace ? 'w-56 sm:w-72' : 'w-7 sm:w-9'}
                    ${bg} ${border} ${text} ${glow}
                    ${isPressed ? 'scale-90 ring-2 ring-rocket-thrust' : 'hover:scale-105'}
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
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
        {hoveredKey ? (
          <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
            <span className="text-rocket-thrust font-bold">KEY [{hoveredKey.toUpperCase()}]:</span>
            <span>Strikes: <strong className="text-slate-900 dark:text-white">{selectedKeyData?.total || 0}</strong></span>
            <span>Errors: <strong className="text-rocket-flame">{selectedKeyData?.errors || 0}</strong></span>
            <span>
              Accuracy: <strong className="text-cyber-emerald">
                {selectedKeyData && selectedKeyData.total > 0
                  ? Math.round(((selectedKeyData.total - selectedKeyData.errors) / selectedKeyData.total) * 100)
                  : 100}%
              </strong>
            </span>
            <span>
              Latency: <strong className="text-sky-500">
                {selectedKeyData && selectedKeyData.total > 0
                  ? Math.round(selectedKeyData.totalLatencyMs / selectedKeyData.total)
                  : '--'} ms
              </strong>
            </span>
          </div>
        ) : (
          <span className="text-slate-500 italic">
            Hover over any actuator to inspect exact millisecond latency and error analytics
          </span>
        )}
      </div>
    </div>
  );
};
